import { OllamaProvider } from './ollamaProvider';
import { GeminiProvider } from './geminiProvider';
import { androidLocalAIProvider, AndroidLocalAIProvider } from './androidLocalAIProvider';
import { offlineCoachProvider, OfflineCoachProvider } from './offlineCoachProvider';
import { AISettings, AIHealth, AIRequest, AIResponse, AIProviderType } from './aiTypes';
import { debugLog } from '../../utils/debug';

const DEFAULT_SETTINGS: AISettings = {
  mode: 'local-first',
  localEndpoint: 'http://localhost:11434',
  localModel: 'qwen3.5:9b',
  androidLocalModel: 'qwen2.5-3b-instruct',
  cloudProvider: 'gemini',
  cloudModel: 'gemini-2.5-flash',
  privacyMode: false,
  fallbackEnabled: true,
  apiKey: '',
  userLevel: 'Intermediate',
};

export class AIRouter {
  private ollama: OllamaProvider;
  private gemini: GeminiProvider;
  private androidLocal: AndroidLocalAIProvider;
  private offlineCoach: OfflineCoachProvider;
  private settings: AISettings;

  constructor() {
    this.settings = this.loadSettings();
    this.ollama = new OllamaProvider(this.settings.localEndpoint);
    this.gemini = new GeminiProvider(this.settings.cloudModel);
    this.androidLocal = androidLocalAIProvider;
    this.offlineCoach = offlineCoachProvider;
  }

  public isAndroidPlatform(): boolean {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const cap = (window as any).Capacitor;
    return /Android/i.test(ua) || cap?.getPlatform() === 'android';
  }

  public getSettings(): AISettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<AISettings>): AISettings {
    this.settings = {
      ...this.settings,
      ...newSettings,
    };
    this.saveSettings(this.settings);
    this.ollama.setEndpoint(this.settings.localEndpoint);
    this.gemini.setModel(this.settings.cloudModel);

    // Notify desktop/IPC if available
    const api = (window as any).desktopAPI?.ai || (window as any).electronAPI?.ai;
    if (api?.saveSettings) {
      api.saveSettings(this.settings).catch((e: any) => debugLog.warn('Could not save desktop AI settings:', e));
    }

    return { ...this.settings };
  }

  private loadSettings(): AISettings {
    try {
      const saved = localStorage.getItem('aamc-ai-settings');
      if (saved) {
        return {
          ...DEFAULT_SETTINGS,
          ...JSON.parse(saved),
        };
      }
    } catch (e) {
      debugLog.warn('Could not read aamc-ai-settings from localStorage:', e);
    }
    return { ...DEFAULT_SETTINGS };
  }

  private saveSettings(settings: AISettings) {
    try {
      localStorage.setItem('aamc-ai-settings', JSON.stringify(settings));
    } catch (e) {
      debugLog.warn('Could not save aamc-ai-settings to localStorage:', e);
    }
  }

  /**
   * Return comprehensive Health Diagnostics
   */
  public async getDiagnostics(): Promise<{
    activeProvider: AIProviderType;
    activeModel: string;
    settings: AISettings;
    localHealth: AIHealth;
    cloudHealth: AIHealth;
    offlineCoachHealth: AIHealth;
    isAndroid: boolean;
  }> {
    const isAndroid = this.isAndroidPlatform();
    const localHealth = isAndroid
      ? await this.androidLocal.testConnection()
      : await this.ollama.testConnection({ targetModel: this.settings.localModel });

    const cloudHealth = await this.gemini.testConnection();
    const offlineCoachHealth = await this.offlineCoach.testConnection();

    let activeProvider: AIProviderType = 'none';
    let activeModel = 'None';

    if (this.settings.mode === 'cloud-only') {
      if (cloudHealth.ok) {
        activeProvider = 'gemini';
        activeModel = cloudHealth.modelUsed || this.settings.cloudModel;
      } else {
        activeProvider = 'offline_coach';
        activeModel = 'Offline Coach';
      }
    } else if (this.settings.privacyMode || this.settings.mode === 'local-only') {
      if (localHealth.ok) {
        activeProvider = isAndroid ? 'android_local' : 'ollama';
        activeModel = localHealth.modelUsed || (isAndroid ? this.settings.androidLocalModel : this.settings.localModel);
      } else {
        activeProvider = 'offline_coach';
        activeModel = 'Offline Coach';
      }
    } else {
      // local-first or auto
      if (localHealth.ok) {
        activeProvider = isAndroid ? 'android_local' : 'ollama';
        activeModel = localHealth.modelUsed || (isAndroid ? this.settings.androidLocalModel : this.settings.localModel);
      } else if (this.settings.fallbackEnabled && cloudHealth.ok) {
        activeProvider = 'gemini';
        activeModel = cloudHealth.modelUsed || this.settings.cloudModel;
      } else {
        activeProvider = 'offline_coach';
        activeModel = 'Offline Coach';
      }
    }

    return {
      activeProvider,
      activeModel,
      settings: { ...this.settings },
      localHealth,
      cloudHealth,
      offlineCoachHealth,
      isAndroid,
    };
  }

  /**
   * Main Chat Dispatcher with Android Local AI -> Gemini -> Offline Coach Fallback
   */
  public async chat(request: AIRequest): Promise<AIResponse> {
    const isAndroid = this.isAndroidPlatform();
    const mode = this.settings.mode;
    const privacyMode = this.settings.privacyMode;
    const fallbackEnabled = this.settings.fallbackEnabled;

    // 1. PRIVACY MODE ENFORCEMENT
    if (privacyMode) {
      if (isAndroid) {
        const localAvailable = await this.androidLocal.isAvailable();
        if (localAvailable) {
          return await this.androidLocal.chat(request);
        }
      } else {
        const localAvailable = await this.ollama.isAvailable();
        if (localAvailable) {
          return await this.ollama.chat(request, this.settings.localModel);
        }
      }

      // In privacy mode, fall back to local Offline Coach (no internet needed)
      const offlineRes = await this.offlineCoach.chat(request);
      return {
        ...offlineRes,
        notificationMessage: 'Local AI unavailable — using Offline Coach.',
      };
    }

    // 2. MODE: LOCAL ONLY
    if (mode === 'local-only') {
      if (isAndroid) {
        const localAvailable = await this.androidLocal.isAvailable();
        if (localAvailable) {
          return await this.androidLocal.chat(request);
        }
      } else {
        const localAvailable = await this.ollama.isAvailable();
        if (localAvailable) {
          return await this.ollama.chat(request, this.settings.localModel);
        }
      }

      // Fallback to Offline Coach
      const offlineRes = await this.offlineCoach.chat(request);
      return {
        ...offlineRes,
        notificationMessage: 'Local AI unavailable — using Offline Coach.',
      };
    }

    // 3. MODE: CLOUD ONLY
    if (mode === 'cloud-only') {
      const cloudRes = await this.gemini.chat(request);
      if (cloudRes.status === 'success') {
        return cloudRes;
      }
      const offlineRes = await this.offlineCoach.chat(request);
      return {
        ...offlineRes,
        notificationMessage: 'Cloud AI unavailable — using Offline Coach.',
      };
    }

    // 4. DEFAULT: LOCAL-FIRST (Android Local AI / Ollama primary -> Cloud fallback -> Offline Coach)
    if (isAndroid) {
      const localAvailable = await this.androidLocal.isAvailable();
      if (localAvailable) {
        const localRes = await this.androidLocal.chat(request);
        if (localRes.status === 'success') {
          return localRes;
        }
      }
    } else {
      const localAvailable = await this.ollama.isAvailable();
      if (localAvailable) {
        const localRes = await this.ollama.chat(request, this.settings.localModel);
        if (localRes.status === 'success') {
          return localRes;
        }
      }
    }

    // Fallback step 1: Cloud AI (Gemini) if enabled
    if (fallbackEnabled) {
      const cloudRes = await this.gemini.chat(request);
      if (cloudRes.status === 'success') {
        return {
          ...cloudRes,
          status: 'fallback',
          notificationMessage: 'Local AI unavailable — switched to Cloud AI.',
        };
      }
    }

    // Fallback step 2: Offline Coach
    const offlineRes = await this.offlineCoach.chat(request);
    return {
      ...offlineRes,
      status: 'fallback',
      notificationMessage: 'Local AI unavailable — using Offline Coach.',
    };
  }

  public async getLocalModels() {
    if (this.isAndroidPlatform()) {
      return await this.androidLocal.getModels();
    }
    return await this.ollama.getModels();
  }

  public async testLocalConnection() {
    if (this.isAndroidPlatform()) {
      return await this.androidLocal.testConnection();
    }
    return await this.ollama.testConnection({ targetModel: this.settings.localModel });
  }

  public async testCloudConnection(params?: { customKey?: string; customModel?: string }) {
    return await this.gemini.testConnection(params);
  }
}

export const aiRouter = new AIRouter();
