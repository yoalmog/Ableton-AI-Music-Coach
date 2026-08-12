import { OllamaProvider } from './ollamaProvider';
import { GeminiProvider } from './geminiProvider';
import { AISettings, AIHealth, AIRequest, AIResponse } from './aiTypes';
import { debugLog } from '../../utils/debug';

const DEFAULT_SETTINGS: AISettings = {
  mode: 'local-first',
  localEndpoint: 'http://localhost:11434',
  localModel: 'qwen3.5:9b',
  cloudProvider: 'gemini',
  cloudModel: 'gemini-3.6-flash',
  privacyMode: false,
  fallbackEnabled: true,
  apiKey: '',
  userLevel: 'Intermediate',
};

export class AIRouter {
  private ollama: OllamaProvider;
  private gemini: GeminiProvider;
  private settings: AISettings;

  constructor() {
    this.settings = this.loadSettings();
    this.ollama = new OllamaProvider(this.settings.localEndpoint);
    this.gemini = new GeminiProvider(this.settings.cloudModel);
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

    // Notify electron main process if available
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
   * Return comprehensive Health Diagnostic for both Local and Cloud
   */
  public async getDiagnostics(): Promise<{
    activeProvider: 'ollama' | 'gemini' | 'none';
    activeModel: string;
    settings: AISettings;
    localHealth: AIHealth;
    cloudHealth: AIHealth;
  }> {
    const localHealth = await this.ollama.testConnection({ targetModel: this.settings.localModel });
    const cloudHealth = await this.gemini.testConnection();

    let activeProvider: 'ollama' | 'gemini' | 'none' = 'none';
    let activeModel = 'None';

    if (this.settings.mode === 'cloud-only') {
      if (cloudHealth.ok) {
        activeProvider = 'gemini';
        activeModel = cloudHealth.modelUsed || this.settings.cloudModel;
      }
    } else if (this.settings.privacyMode || this.settings.mode === 'local-only') {
      if (localHealth.ok) {
        activeProvider = 'ollama';
        activeModel = localHealth.modelUsed || this.settings.localModel;
      }
    } else {
      // local-first or auto
      if (localHealth.ok) {
        activeProvider = 'ollama';
        activeModel = localHealth.modelUsed || this.settings.localModel;
      } else if (this.settings.fallbackEnabled && cloudHealth.ok) {
        activeProvider = 'gemini';
        activeModel = cloudHealth.modelUsed || this.settings.cloudModel;
      }
    }

    return {
      activeProvider,
      activeModel,
      settings: { ...this.settings },
      localHealth,
      cloudHealth,
    };
  }

  /**
   * Main Chat Dispatcher using Local-First Architecture
   */
  public async chat(request: AIRequest): Promise<AIResponse> {
    const mode = this.settings.mode;
    const privacyMode = this.settings.privacyMode;
    const fallbackEnabled = this.settings.fallbackEnabled;

    // 1. PRIVACY MODE ENFORCEMENT
    if (privacyMode) {
      const localAvailable = await this.ollama.isAvailable();
      if (!localAvailable) {
        return {
          reply: 'Local AI is unavailable. Privacy Mode prevents cloud requests.',
          provider: 'none',
          model: 'None',
          latencyMs: 0,
          status: 'privacy_blocked',
          offline: true,
          error: 'Privacy mode active and local AI unavailable',
        };
      }
      return await this.ollama.chat(request, this.settings.localModel);
    }

    // 2. MODE: LOCAL ONLY
    if (mode === 'local-only') {
      const localAvailable = await this.ollama.isAvailable();
      if (!localAvailable) {
        return {
          reply: 'Local AI is currently unavailable and Cloud AI is disabled.',
          provider: 'none',
          model: 'None',
          latencyMs: 0,
          status: 'error',
          offline: true,
          error: 'Local AI unavailable in Local-Only mode',
        };
      }
      return await this.ollama.chat(request, this.settings.localModel);
    }

    // 3. MODE: CLOUD ONLY
    if (mode === 'cloud-only') {
      return await this.gemini.chat(request);
    }

    // 4. DEFAULT: LOCAL-FIRST (Local Ollama primary -> Cloud fallback)
    const localAvailable = await this.ollama.isAvailable();
    if (localAvailable) {
      const localRes = await this.ollama.chat(request, this.settings.localModel);
      if (localRes.status === 'success') {
        return localRes;
      }
      // Local attempt failed with fatal error -> try cloud fallback if enabled
      if (!fallbackEnabled) {
        return localRes;
      }
    }

    // Fallback to Cloud AI
    if (fallbackEnabled) {
      const cloudRes = await this.gemini.chat(request);
      if (cloudRes.status === 'success') {
        return {
          ...cloudRes,
          status: 'fallback',
        };
      }
    }

    // Both local and cloud failed or disabled
    return {
      reply: 'AI is currently unavailable.\n\nDetails:\n- Local AI: Unavailable or not running\n- Cloud AI: Disabled or unreachable',
      provider: 'none',
      model: 'None',
      latencyMs: 0,
      status: 'error',
      offline: true,
      error: 'Both local and cloud providers unavailable',
    };
  }

  /**
   * Helper to fetch installed local models from Ollama
   */
  public async getLocalModels() {
    return await this.ollama.getModels();
  }

  /**
   * Test Local Ollama connection specifically
   */
  public async testLocalConnection() {
    return await this.ollama.testConnection({ targetModel: this.settings.localModel });
  }

  /**
   * Test Cloud Gemini connection specifically
   */
  public async testCloudConnection(params?: { customKey?: string; customModel?: string }) {
    return await this.gemini.testConnection(params);
  }
}

export const aiRouter = new AIRouter();
