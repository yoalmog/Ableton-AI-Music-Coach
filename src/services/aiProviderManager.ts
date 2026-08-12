import { aiRouter } from './ai/aiRouter';
import { ollamaService } from './ollamaService';
import { AIRequest, AIResponse, AIHealth, AISettings } from './ai/aiTypes';
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

  public getActiveProvider(): string {
    const settings = aiRouter.getSettings();
    if (settings.privacyMode) return 'ollama';
    return settings.mode;
  }

  public setProvider(mode: AISettings['mode']) {
    return aiRouter.updateSettings({ mode });
  }

  public async testProvider(): Promise<AIHealth> {
    const diag = await aiRouter.getDiagnostics();
    if (diag.activeProvider === 'ollama') {
      return diag.localHealth;
    } else if (diag.activeProvider === 'gemini') {
      return diag.cloudHealth;
    }
    return diag.localHealth;
  }

  public async sendMessage(request: AIRequest): Promise<AIResponse> {
    return await aiRouter.chat(request);
  }

  public async streamMessage(request: AIRequest, onChunk: (text: string) => void): Promise<AIResponse> {
    const settings = aiRouter.getSettings();
    const activeProvider = aiRouter.getDiagnostics().then(d => d.activeProvider);
    
    // If local ollama is active or privacy mode, stream from ollamaService directly
    const currentProvider = await activeProvider;
    if (currentProvider === 'ollama' || settings.privacyMode || settings.mode === 'local-only') {
      const models = await ollamaService.getModels();
      const bestModel = ollamaService.selectBestModel ? (ollamaService as any).selectBestModel(models, settings.localModel) : (settings.localModel || 'qwen3.5:9b');
      return await ollamaService.streamChat(request, onChunk, bestModel);
    }

    // Otherwise fallback to general router chat
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
    return await ollamaService.getModels();
  }

  public getOllamaService() {
    return ollamaService;
  }
}

export const aiProviderManager = new AIProviderManager();
