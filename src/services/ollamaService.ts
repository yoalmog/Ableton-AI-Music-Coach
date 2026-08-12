import { AIModel, AIHealth, AIRequest, AIResponse } from './ai/aiTypes';
import { SYSTEM_INSTRUCTION } from './ai/aiPrompts';
import { formatAIContext } from './ai/aiContext';
import { debugLog } from '../utils/debug';

export interface OllamaStatus {
  installed: boolean;
  running: boolean;
  version?: string;
  endpoint: string;
}

export interface PullProgress {
  modelName: string;
  status: string;
  percent: number;
  completedBytes: number;
  totalBytes: number;
  completedHuman: string;
  totalHuman: string;
  speedMBs: number;
  etaSeconds: number;
}

export interface HardwareInfo {
  totalRamGB: number;
  recommendedModel: string;
  description: string;
}

export class OllamaService {
  private endpoint: string = 'http://localhost:11434';

  constructor(endpoint: string = 'http://localhost:11434') {
    this.endpoint = (endpoint || 'http://localhost:11434').replace(/\/+$/, '');
  }

  public setEndpoint(url: string) {
    this.endpoint = (url || 'http://localhost:11434').replace(/\/+$/, '');
  }

  public getEndpoint(): string {
    return this.endpoint;
  }

  private get desktopOllama() {
    return (window as any).desktopAPI?.ollama || (window as any).electronAPI?.ollama;
  }

  public normalizeError(err: any): { code: string; message: string } {
    const msg = String(err?.message || err || '').toLowerCase();
    if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('econrefused') || msg.includes('err_connection_refused')) {
      return {
        code: 'OLLAMA_NOT_RUNNING',
        message: `Ollama is not running at ${this.endpoint}. Please start Ollama locally.`
      };
    }
    if (msg.includes('timeout') || msg.includes('aborted')) {
      return {
        code: 'OLLAMA_TIMEOUT',
        message: 'Request timed out waiting for Ollama local response.'
      };
    }
    if (msg.includes('cors') || msg.includes('cross-origin')) {
      return {
        code: 'CORS_ERROR',
        message: 'CORS restriction blocked connection to Ollama. Ensure Ollama allows origin headers or use desktop app.'
      };
    }
    if (msg.includes('model') && msg.includes('not found')) {
      return {
        code: 'MODEL_NOT_FOUND',
        message: 'The requested model is not installed on this Ollama instance.'
      };
    }
    return {
      code: 'UNKNOWN_ERROR',
      message: err?.message || 'An unknown error occurred while communicating with Ollama.'
    };
  }

  public async checkStatus(): Promise<OllamaStatus> {
    if (this.desktopOllama?.checkStatus) {
      return await this.desktopOllama.checkStatus();
    }
    try {
      const res = await fetch(`${this.endpoint}/api/tags`, { method: 'GET' });
      if (res.ok) {
        return { installed: true, running: true, endpoint: this.endpoint };
      }
    } catch {}
    return { installed: false, running: false, endpoint: this.endpoint };
  }

  public async startService(): Promise<{ success: boolean; message: string }> {
    if (this.desktopOllama?.startService) {
      return await this.desktopOllama.startService();
    }
    return { success: false, message: 'Please start Ollama locally.' };
  }

  public async restartService(): Promise<{ success: boolean; message: string }> {
    if (this.desktopOllama?.restartService) {
      return await this.desktopOllama.restartService();
    }
    return { success: false, message: 'Please restart Ollama locally.' };
  }

  public async getHealth(targetModel?: string): Promise<AIHealth> {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${this.endpoint}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return {
          ok: false,
          provider: 'ollama',
          status: 'NOT RUNNING',
          statusMessage: `Ollama server returned status ${res.status} at ${this.endpoint}`,
          endpoint: this.endpoint,
          latencyMs: Date.now() - startTime,
        };
      }

      const data = await res.json();
      const models = data.models || [];
      if (models.length === 0) {
        return {
          ok: false,
          provider: 'ollama',
          status: 'NO MODEL INSTALLED',
          statusMessage: 'Ollama is running, but no models are installed. Run "ollama pull qwen3.5:4b"',
          endpoint: this.endpoint,
          latencyMs: Date.now() - startTime,
          installedModels: [],
        };
      }

      return {
        ok: true,
        provider: 'ollama',
        status: 'CONNECTED',
        statusMessage: `✓ Ollama Connected (${models.length} models available)`,
        endpoint: this.endpoint,
        latencyMs: Date.now() - startTime,
        installedModels: models.map((m: any) => ({
          id: m.name || m.model,
          name: m.name || m.model,
          sizeBytes: m.size || 0,
        })),
      };
    } catch (err: any) {
      const normalized = this.normalizeError(err);
      return {
        ok: false,
        provider: 'ollama',
        status: 'NOT RUNNING',
        statusMessage: normalized.message,
        endpoint: this.endpoint,
        latencyMs: Date.now() - startTime,
      };
    }
  }

  public async getModels(): Promise<AIModel[]> {
    if (this.desktopOllama?.getModels) {
      try {
        return await this.desktopOllama.getModels();
      } catch {}
    }
    try {
      const res = await fetch(`${this.endpoint}/api/tags`, {
        method: 'GET',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.models && Array.isArray(data.models)) {
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
        }
      }
    } catch (err) {
      debugLog.warn('Ollama getModels error:', err);
    }
    return [];
  }

  public async pullModel(
    modelName: string,
    onProgress?: (progress: PullProgress) => void
  ): Promise<{ success: boolean; modelName: string }> {
    if (this.desktopOllama?.pullModel) {
      let unsubscribe: (() => void) | null = null;
      if (onProgress && this.desktopOllama.onPullProgress) {
        unsubscribe = this.desktopOllama.onPullProgress(onProgress);
      }
      try {
        const result = await this.desktopOllama.pullModel(modelName);
        return result;
      } finally {
        if (unsubscribe) unsubscribe();
      }
    }
    return { success: true, modelName };
  }

  public async cancelPull(): Promise<{ success: boolean; message: string }> {
    if (this.desktopOllama?.cancelPull) {
      return await this.desktopOllama.cancelPull();
    }
    return { success: true, message: 'Cancelled.' };
  }

  public async getHardwareInfo(): Promise<HardwareInfo> {
    if (this.desktopOllama?.getHardwareInfo) {
      return await this.desktopOllama.getHardwareInfo();
    }
    return {
      totalRamGB: 16,
      recommendedModel: 'qwen3.5:4b',
      description: 'Recommended • Standard 8-16 GB System RAM',
    };
  }

  public async openDownloadPage(): Promise<void> {
    if (this.desktopOllama?.openDownload) {
      await this.desktopOllama.openDownload();
    } else {
      window.open('https://ollama.com/download', '_blank', 'noopener,noreferrer');
    }
  }

  public async chat(request: AIRequest, model: string = 'qwen3.5:9b'): Promise<AIResponse> {
    const startTime = Date.now();
    try {
      const formattedPrompt = formatAIContext(request);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const res = await fetch(`${this.endpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_INSTRUCTION },
            { role: 'user', content: formattedPrompt },
          ],
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const data = await res.json();
      const reply = data.message?.content || data.response || 'No response';

      return {
        reply,
        provider: 'ollama',
        model,
        latencyMs: Date.now() - startTime,
        status: 'success',
        offline: true,
      };
    } catch (err: any) {
      const normalized = this.normalizeError(err);
      return {
        reply: `Ollama Error: ${normalized.message}`,
        provider: 'ollama',
        model,
        latencyMs: Date.now() - startTime,
        status: 'error',
        offline: true,
        error: normalized.code,
      };
    }
  }

  public async streamChat(
    request: AIRequest,
    onChunk: (text: string) => void,
    model: string = 'qwen3.5:9b'
  ): Promise<AIResponse> {
    const startTime = Date.now();
    try {
      const formattedPrompt = formatAIContext(request);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);

      const res = await fetch(`${this.endpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_INSTRUCTION },
            { role: 'user', content: formattedPrompt },
          ],
          stream: true,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok || !res.body) {
        throw new Error(`Stream HTTP Error ${res.status}`);
      }

      const reader = res.body.getReader();
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

      return {
        reply: fullReply || 'No response',
        provider: 'ollama',
        model,
        latencyMs: Date.now() - startTime,
        status: 'success',
        offline: true,
      };
    } catch (err: any) {
      const normalized = this.normalizeError(err);
      const errReply = `Stream Error: ${normalized.message}`;
      onChunk(errReply);
      return {
        reply: errReply,
        provider: 'ollama',
        model,
        latencyMs: Date.now() - startTime,
        status: 'error',
        offline: true,
        error: normalized.code,
      };
    }
  }

  public selectBestModel(installedModels: AIModel[], configuredModel?: string): string {
    const target = configuredModel || 'qwen3.5:9b';
    if (!installedModels || installedModels.length === 0) {
      return target;
    }

    const modelIds = installedModels.map((m) => m.id.toLowerCase());

    if (target && modelIds.includes(target.toLowerCase())) {
      const match = installedModels.find((m) => m.id.toLowerCase() === target.toLowerCase());
      if (match) return match.id;
    }

    const preferredSequence = ['qwen3.5:9b', 'qwen3.5:4b', 'qwen3.5:2b', 'qwen3.5:27b', 'qwen3.5', 'qwen3', 'llama3'];
    for (const seq of preferredSequence) {
      const found = installedModels.find((m) => m.id.toLowerCase().includes(seq));
      if (found) return found.id;
    }

    const anyQwen = installedModels.find((m) => m.id.toLowerCase().includes('qwen'));
    if (anyQwen) return anyQwen.id;

    return installedModels[0].id;
  }

  public async testModel(modelName: string = 'qwen3.5:9b'): Promise<{ ok: boolean; reply: string }> {
    try {
      const res = await this.chat({
        message: 'Respond with exactly: OLLAMA TEST OK',
      }, modelName);
      return {
        ok: res.status === 'success',
        reply: res.reply,
      };
    } catch (err: any) {
      return { ok: false, reply: err.message || 'Test failed' };
    }
  }
}

export const ollamaService = new OllamaService();
