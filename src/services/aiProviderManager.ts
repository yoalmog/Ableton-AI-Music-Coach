import { aiRouter } from './ai/aiRouter';
import { ollamaService } from './ollamaService';
import { AIRequest, AIResponse, AIHealth, AISettings, AIProviderType } from './ai/aiTypes';
import { debugLog } from '../utils/debug';

export class AIProviderManager {
  public getSettings(): AISettings {
    return aiRouter.getSettings();
  }

  public updateSettings(newSettings: Partial<AISettings>): AISettings {
    const updated = aiRouter.updateSettings(newSettings);
    if (newSettings.localEndpoint) {
      ollamaService.setEndpoint(newSettings.localEndpoint);
    }
    return updated;
  }

  public async getActiveProvider(): Promise<AIProviderType> {
    const diag = await aiRouter.getDiagnostics();
    return diag.activeProvider;
  }

  public setProvider(mode: AISettings['mode']) {
    return aiRouter.updateSettings({ mode });
  }

  public async testProvider(): Promise<AIHealth> {
    const diag = await aiRouter.getDiagnostics();
    if (diag.activeProvider === 'android_local' || diag.activeProvider === 'ollama') {
      return diag.localHealth;
    } else if (diag.activeProvider === 'gemini') {
      return diag.cloudHealth;
    } else if (diag.activeProvider === 'offline_coach') {
      return diag.offlineCoachHealth;
    }
    return diag.localHealth;
  }

  public async sendMessage(request: AIRequest): Promise<AIResponse> {
    return await aiRouter.chat(request);
  }

  public async streamMessage(request: AIRequest, onChunk: (text: string) => void): Promise<AIResponse> {
    const isAndroid = aiRouter.isAndroidPlatform();
    const settings = aiRouter.getSettings();
    const activeProvider = await this.getActiveProvider();

    // On Desktop Windows, if Ollama is active, stream via ollamaService directly
    if (!isAndroid && activeProvider === 'ollama') {
      try {
        const models = await ollamaService.getModels();
        const bestModel = (ollamaService as any).selectBestModel
          ? (ollamaService as any).selectBestModel(models, settings.localModel)
          : settings.localModel || 'qwen3.5:9b';
        return await ollamaService.streamChat(request, onChunk, bestModel);
      } catch (e) {
        debugLog.warn('Streaming Ollama failed, falling back to router:', e);
      }
    }

    // Default chat router dispatch (handles Android Local AI, Gemini, and Offline Coach)
    const res = await aiRouter.chat(request);
    if (res.reply) {
      onChunk(res.reply);
    }
    return res;
  }

  public async getStatus() {
    return await aiRouter.getDiagnostics();
  }

  public async getModels() {
    return await aiRouter.getLocalModels();
  }

  public getOllamaService() {
    return ollamaService;
  }
}

export const aiProviderManager = new AIProviderManager();
