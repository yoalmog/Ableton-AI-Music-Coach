import { AIProvider, AIModel, AIHealth, AIRequest, AIResponse } from './aiTypes';
import { SYSTEM_INSTRUCTION } from './aiPrompts';
import { formatAIContext } from './aiContext';
import { debugLog } from '../../utils/debug';

export class OllamaProvider implements AIProvider {
  public id = 'ollama';
  public name = 'Ollama (Local AI)';
  private endpoint: string;
  private selectedModel: string = 'qwen3.5:9b';

  constructor(endpoint = 'http://localhost:11434', selectedModel = 'qwen3.5:9b') {
    this.endpoint = endpoint.replace(/\/+$/, '');
    this.selectedModel = selectedModel;
  }

  public setEndpoint(newEndpoint: string) {
    this.endpoint = (newEndpoint || 'http://localhost:11434').replace(/\/+$/, '');
  }

  public getEndpoint(): string {
    return this.endpoint;
  }

  public getBaseUrl(): string {
    return this.endpoint;
  }

  public getSelectedModel(): string {
    return this.selectedModel;
  }

  public setSelectedModel(model: string) {
    this.selectedModel = model;
  }

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

  public selectBestModel(installedModels: AIModel[], configuredModel?: string): string {
    const target = configuredModel || this.selectedModel;
    if (!installedModels || installedModels.length === 0) {
      return target || 'qwen3.5:9b';
    }

    const modelIds = installedModels.map((m) => m.id.toLowerCase());

    if (target && modelIds.includes(target.toLowerCase())) {
      const match = installedModels.find((m) => m.id.toLowerCase() === target.toLowerCase());
      if (match) return match.id;
    }

    const preferredSequence = ['qwen3.5:9b', 'qwen3.5:4b', 'qwen3.5:2b', 'qwen3.5:27b', 'qwen3.5'];
    for (const seq of preferredSequence) {
      const found = installedModels.find((m) => m.id.toLowerCase().includes(seq));
      if (found) return found.id;
    }

    const anyQwen = installedModels.find((m) => m.id.toLowerCase().includes('qwen'));
    if (anyQwen) return anyQwen.id;

    return installedModels[0].id;
  }

  public async checkConnection(params?: { targetModel?: string }): Promise<AIHealth> {
    return await this.testConnection(params);
  }

  public async testConnection(params?: { targetModel?: string }): Promise<AIHealth> {
    const startTime = Date.now();
    let isOnline = false;

    try {
      isOnline = await this.isAvailable();
    } catch {
      isOnline = false;
    }

    if (!isOnline) {
      return {
        ok: false,
        provider: 'ollama',
        status: 'NOT RUNNING',
        statusMessage: `Ollama is not running at ${this.endpoint}. Please start Ollama locally.`,
        endpoint: this.endpoint,
        latencyMs: Date.now() - startTime,
      };
    }

    const installedModels = await this.getModels();
    if (installedModels.length === 0) {
      return {
        ok: false,
        provider: 'ollama',
        status: 'NO MODEL INSTALLED',
        statusMessage: `Ollama is running at ${this.endpoint}, but no AI models are installed. Recommended: ollama pull qwen3.5:4b`,
        endpoint: this.endpoint,
        latencyMs: Date.now() - startTime,
        installedModels: [],
      };
    }

    const activeModel = this.selectBestModel(installedModels, params?.targetModel);
    
    if (params?.targetModel && !installedModels.some(m => m.id.toLowerCase() === params.targetModel.toLowerCase())) {
      return {
        ok: false,
        provider: 'ollama',
        status: 'MODEL NOT FOUND',
        statusMessage: `Selected model "${params.targetModel}" is not installed. Please run "ollama pull ${params.targetModel}" or select another model.`,
        endpoint: this.endpoint,
        latencyMs: Date.now() - startTime,
        installedModels,
      };
    }

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

  public async chat(request: AIRequest, targetModel?: string): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      const installedModels = await this.getModels();
      if (installedModels.length === 0) {
        return {
          reply: 'Local AI is unavailable because no Ollama model is installed. Please run "ollama pull qwen3.5:4b" or select Cloud AI.',
          provider: 'ollama',
          model: targetModel || this.selectedModel,
          latencyMs: Date.now() - startTime,
          status: 'error',
          offline: true,
          error: 'No local models installed',
        };
      }

      const modelToUse = this.selectBestModel(installedModels, targetModel);
      const formattedPrompt = formatAIContext(request);

      const controller = new AbortController();
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
        model: targetModel || this.selectedModel,
        latencyMs,
        status: 'error',
        offline: true,
        error: err.message || 'Connection failed',
      };
    }
  }

  public async streamChat(
    request: AIRequest,
    onChunk: (token: string) => void,
    targetModel?: string
  ): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      const installedModels = await this.getModels();
      if (installedModels.length === 0) {
        const errReply = 'Local AI is unavailable because no Ollama model is installed. Please run "ollama pull qwen3.5:4b".';
        onChunk(errReply);
        return {
          reply: errReply,
          provider: 'ollama',
          model: targetModel || this.selectedModel,
          latencyMs: Date.now() - startTime,
          status: 'error',
          offline: true,
          error: 'No local models installed',
        };
      }

      const modelToUse = this.selectBestModel(installedModels, targetModel);
      const formattedPrompt = formatAIContext(request);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);

      const response = await fetch(`${this.endpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            { role: 'system', content: SYSTEM_INSTRUCTION },
            { role: 'user', content: formattedPrompt },
          ],
          stream: true,
          options: {
            temperature: 0.7,
            num_ctx: 4096,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok || !response.body) {
        throw new Error(`Ollama Stream HTTP Error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullReply = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            const content = parsed.message?.content || parsed.response || '';
            if (content) {
              fullReply += content;
              onChunk(content);
            }
          } catch {}
        }
      }

      const latencyMs = Date.now() - startTime;
      return {
        reply: fullReply || 'No response content returned.',
        provider: 'ollama',
        model: modelToUse,
        latencyMs,
        status: 'success',
        offline: true,
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      const errReply = `Local AI Stream Error: ${err.message || 'Connection failed'}.`;
      onChunk(errReply);
      return {
        reply: errReply,
        provider: 'ollama',
        model: targetModel || this.selectedModel,
        latencyMs,
        status: 'error',
        offline: true,
        error: err.message,
      };
    }
  }
}
