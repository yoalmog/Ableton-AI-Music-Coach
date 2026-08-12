import { aiRouter } from './ai/aiRouter';
import { AIRequest, AIResponse, AIHealth, AISettings } from './ai/aiTypes';

export class AIProviderService {
  public getSettings(): AISettings {
    return aiRouter.getSettings();
  }

  public updateSettings(newSettings: Partial<AISettings>): AISettings {
    return aiRouter.updateSettings(newSettings);
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
    return await aiRouter.chat(request);
  }

  public async getStatus() {
    return await aiRouter.getDiagnostics();
  }
}

export const aiProviderService = new AIProviderService();
