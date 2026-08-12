import { AIProvider, AIModel, AIHealth, AIRequest, AIResponse } from './aiTypes';
import { SYSTEM_INSTRUCTION } from './aiPrompts';
import { formatAIContext } from './aiContext';
import { debugLog } from '../../utils/debug';

export class OllamaProvider implements AIProvider {
  public id = 'ollama';
  public name = 'Ollama (Local AI)';
  private endpoint: string;

  constructor(endpoint = 'http://localhost:11434') {
    this.endpoint = endpoint.replace(/\/+$/, '');
  }

  public setEndpoint(newEndpoint: string) {
    this.endpoint = newEndpoint.replace(/\/+$/, '');
  }

  public getEndpoint(): string {
    return this.endpoint;
  }

  /**
   * Check if Ollama endpoint responds
   */
  public async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`${this.endpoint}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Fetch list of models installed in Ollama
   */
  public async getModels(): Promise<AIModel[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${this.endpoint}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) return [];

      const data = await res.json();
      if (!data.models || !Array.isArray(data.models)) return [];

      return data.models.map((m: any) => {
        const sizeBytes = m.size || 0;
        const sizeGB = sizeBytes ? (sizeBytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB' : '';
        return {
          id: m.name || m.model,
          name: m.name || m.model,
          sizeBytes,
          sizeHuman: sizeGB,
          family: m.details?.family || 'Qwen',
          modifiedAt: m.modified_at,
        };
      });
    } catch (err) {
      debugLog.warn('Ollama getModels error:', err);
      return [];
    }
  }

  /**
   * Select best compatible Qwen 3.5 or installed model
   */
  public selectBestModel(installedModels: AIModel[], configuredModel?: string): string {
    if (!installedModels || installedModels.length === 0) {
      return configuredModel || 'qwen3.5:9b';
    }

    const modelIds = installedModels.map((m) => m.id.toLowerCase());

    // 1. Exact match with user configured model if installed
    if (configuredModel && modelIds.includes(configuredModel.toLowerCase())) {
      const match = installedModels.find((m) => m.id.toLowerCase() === configuredModel.toLowerCase());
      if (match) return match.id;
    }

    // 2. Preferred Qwen 3.5 sequence
    const preferredSequence = ['qwen3.5:9b', 'qwen3.5:4b', 'qwen3.5:2b', 'qwen3.5:27b', 'qwen3.5'];
    for (const seq of preferredSequence) {
      const found = installedModels.find((m) => m.id.toLowerCase().includes(seq));
      if (found) return found.id;
    }

    // 3. Any Qwen model
    const anyQwen = installedModels.find((m) => m.id.toLowerCase().includes('qwen'));
    if (anyQwen) return anyQwen.id;

    // 4. Any compatible model (Llama, Mistral, Gemma, DeepSeek, Phi)
    return installedModels[0].id;
  }

  /**
   * Perform comprehensive Health Check
   */
  public async testConnection(params?: { targetModel?: string }): Promise<AIHealth> {
    const startTime = Date.now();
    const isOnline = await this.isAvailable();

    if (!isOnline) {
      return {
        ok: false,
        provider: 'ollama',
        status: 'NOT RUNNING',
        statusMessage: `Ollama is not running at ${this.endpoint}. Start Ollama service locally on Windows.`,
        endpoint: this.endpoint,
        latencyMs: 0,
      };
    }

    const installedModels = await this.getModels();
    if (installedModels.length === 0) {
      return {
        ok: false,
        provider: 'ollama',
        status: 'NO MODEL INSTALLED',
        statusMessage: `Ollama is running at ${this.endpoint}, but no AI models are installed. Recommended: qwen3.5:9b.`,
        endpoint: this.endpoint,
        latencyMs: Date.now() - startTime,
        installedModels: [],
      };
    }

    const activeModel = this.selectBestModel(installedModels, params?.targetModel);
    const latencyMs = Date.now() - startTime;

    return {
      ok: true,
      provider: 'ollama',
      status: 'CONNECTED',
      statusMessage: `✓ Local Ollama AI Connected (${activeModel} • ${latencyMs}ms)`,
      modelUsed: activeModel,
      latencyMs,
      endpoint: this.endpoint,
      installedModels,
    };
  }

  /**
   * Execute chat prompt on local model
   */
  public async chat(request: AIRequest, targetModel?: string): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      const installedModels = await this.getModels();
      if (installedModels.length === 0) {
        return {
          reply: 'Local AI is unavailable because no Ollama model is installed. Please run "ollama pull qwen3.5:9b" or select Cloud AI.',
          provider: 'ollama',
          model: targetModel || 'qwen3.5:9b',
          latencyMs: Date.now() - startTime,
          status: 'error',
          offline: true,
          error: 'No local models installed',
        };
      }

      const modelToUse = this.selectBestModel(installedModels, targetModel);
      const formattedPrompt = formatAIContext(request);

      const controller = new AbortController();
      // Allow up to 60 seconds for local CPU/GPU inference
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(`${this.endpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            { role: 'system', content: SYSTEM_INSTRUCTION },
            { role: 'user', content: formattedPrompt },
          ],
          stream: false,
          options: {
            temperature: 0.7,
            num_ctx: 4096,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama HTTP Error ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.message?.content || data.response || 'No response content returned from Local AI model.';
      const latencyMs = Date.now() - startTime;

      return {
        reply: replyText,
        provider: 'ollama',
        model: modelToUse,
        latencyMs,
        status: 'success',
        offline: true,
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      debugLog.warn('Ollama Local AI Chat error:', err);
      return {
        reply: `Local AI Error: ${err.message || 'Could not connect to Ollama'}. Verify Ollama is running at ${this.endpoint}.`,
        provider: 'ollama',
        model: targetModel || 'qwen3.5:9b',
        latencyMs,
        status: 'error',
        offline: true,
        error: err.message || 'Connection failed',
      };
    }
  }
}
