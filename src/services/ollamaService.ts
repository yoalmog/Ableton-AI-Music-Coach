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

export interface OllamaDiagnosticsTiming {
  requestStartedAt?: number;
  firstTokenAt?: number;
  completedAt?: number;
  firstTokenMs?: number;
  totalMs?: number;
  thinkingContent?: string;
  rawResponse?: string;
}

export class OllamaService {
  private endpoint: string = 'http://127.0.0.1:11434';
  private currentAbortController: AbortController | null = null;
  private lastDiagnostics: OllamaDiagnosticsTiming = {};

  constructor(endpoint: string = 'http://127.0.0.1:11434') {
    this.endpoint = (endpoint || 'http://127.0.0.1:11434').replace(/\/+$/, '');
  }

  public setEndpoint(url: string) {
    this.endpoint = (url || 'http://127.0.0.1:11434').replace(/\/+$/, '');
  }

  public getEndpoint(): string {
    return this.endpoint;
  }

  public getLastDiagnostics(): OllamaDiagnosticsTiming {
    return this.lastDiagnostics;
  }

  private get desktopOllama() {
    return (window as any).desktopAPI?.ollama || (window as any).electronAPI?.ollama;
  }

  public cancelCurrentRequest() {
    if (this.currentAbortController) {
      try {
        this.currentAbortController.abort();
      } catch {}
      this.currentAbortController = null;
    }
  }

  public normalizeError(err: any): { code: string; message: string } {
    const msg = String(err?.message || err || '').toLowerCase();
    if (msg.includes('aborted') || msg.includes('user cancelled')) {
      return {
        code: 'CANCELLED',
        message: 'Generation cancelled.'
      };
    }
    if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('econrefused') || msg.includes('err_connection_refused')) {
      return {
        code: 'OLLAMA_NOT_RUNNING',
        message: 'Ollama server unavailable.'
      };
    }
    if (msg.includes('first-token-timeout') || (msg.includes('timeout') && !this.lastDiagnostics.firstTokenAt)) {
      return {
        code: 'OLLAMA_FIRST_TOKEN_TIMEOUT',
        message: 'Local Ollama is reachable, but the model has not produced a response yet. The first generation may take longer while the model loads.'
      };
    }
    if (msg.includes('timeout') || msg.includes('aborted')) {
      return {
        code: 'OLLAMA_TIMEOUT',
        message: 'Generation stream interrupted.'
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
        message: 'The requested model is not installed on this Ollama instance. Expected qwen3.5:4b.'
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
      const timeoutId = setTimeout(() => controller.abort(), 6000);

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
          statusMessage: 'Ollama server unavailable.',
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

      const modelIds = models.map((m: any) => m.name || m.model);
      const hasTarget = targetModel ? modelIds.some((id: string) => id.toLowerCase().includes(targetModel.toLowerCase())) : true;

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
        const desktopModels = await this.desktopOllama.getModels();
        if (desktopModels && desktopModels.length > 0) {
          return desktopModels;
        }
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

  public selectBestModel(installedModels: AIModel[], configuredModel?: string): string {
    const target = configuredModel || 'qwen3.5:4b';
    if (!installedModels || installedModels.length === 0) {
      return target;
    }

    const modelIds = installedModels.map((m) => m.id.toLowerCase());

    if (target && modelIds.includes(target.toLowerCase())) {
      const match = installedModels.find((m) => m.id.toLowerCase() === target.toLowerCase());
      if (match) return match.id;
    }

    const preferredSequence = ['qwen3.5:4b', 'qwen3.5:9b', 'qwen3.5:2b', 'qwen3.5:27b', 'qwen3.5', 'qwen3', 'llama3'];
    for (const seq of preferredSequence) {
      const found = installedModels.find((m) => m.id.toLowerCase().includes(seq));
      if (found) return found.id;
    }

    const anyQwen = installedModels.find((m) => m.id.toLowerCase().includes('qwen'));
    if (anyQwen) return anyQwen.id;

    return installedModels[0].id;
  }

  public async chat(request: AIRequest, model: string = 'qwen3.5:4b'): Promise<AIResponse> {
    let fullReply = '';
    return await this.streamChat(request, () => {}, model);
  }

  public async streamChat(
    request: AIRequest,
    onChunk: (text: string) => void,
    model: string = 'qwen3.5:4b'
  ): Promise<AIResponse> {
    const startTime = Date.now();
    this.lastDiagnostics = {
      requestStartedAt: startTime,
    };

    this.cancelCurrentRequest();
    this.currentAbortController = new AbortController();
    const controller = this.currentAbortController;

    // Generous first-token timeout for local model loading (90 seconds)
    let firstTokenReceived = false;
    const firstTokenTimer = setTimeout(() => {
      if (!firstTokenReceived) {
        controller.abort('first-token-timeout');
      }
    }, 90000);

    try {
      const formattedPrompt = formatAIContext(request);

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

      if (!res.ok || !res.body) {
        throw new Error(`Stream HTTP Error ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullReply = '';
      let rawText = '';
      let thinkingBuffer = '';
      let insideThinking = false;

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
              if (!firstTokenReceived) {
                firstTokenReceived = true;
                clearTimeout(firstTokenTimer);
                this.lastDiagnostics.firstTokenAt = Date.now();
                this.lastDiagnostics.firstTokenMs = this.lastDiagnostics.firstTokenAt - startTime;
              }

              rawText += content;

              // Handle Qwen 3.5 thinking tokens (<think>...</think> or thinking property)
              let processedContent = content;
              if (parsed.message?.thinking) {
                thinkingBuffer += parsed.message.thinking;
              }

              // Check for inline think tags
              if (processedContent.includes('<think>')) {
                insideThinking = true;
                processedContent = processedContent.replace('<think>', '');
              }
              if (processedContent.includes('</think>')) {
                insideThinking = false;
                processedContent = processedContent.replace('</think>', '');
              }

              if (insideThinking) {
                thinkingBuffer += processedContent;
              } else {
                onChunk(processedContent);
                fullReply += processedContent;
              }
            }
          } catch {}
        }
      }

      clearTimeout(firstTokenTimer);
      const completedAt = Date.now();
      this.lastDiagnostics.completedAt = completedAt;
      this.lastDiagnostics.totalMs = completedAt - startTime;
      this.lastDiagnostics.thinkingContent = thinkingBuffer;
      this.lastDiagnostics.rawResponse = rawText;

      return {
        reply: fullReply || rawText || 'No response',
        provider: 'ollama',
        model,
        latencyMs: completedAt - startTime,
        status: 'success',
        offline: true,
      };
    } catch (err: any) {
      clearTimeout(firstTokenTimer);
      const normalized = this.normalizeError(err);
      const errReply = normalized.code === 'CANCELLED' ? 'Generation cancelled.' : `Ollama Error: ${normalized.message}`;
      if (normalized.code !== 'CANCELLED') {
        onChunk(errReply);
      }
      return {
        reply: errReply,
        provider: 'ollama',
        model,
        latencyMs: Date.now() - startTime,
        status: normalized.code === 'CANCELLED' ? 'success' : 'error',
        offline: true,
        error: normalized.code,
      };
    } finally {
      this.currentAbortController = null;
    }
  }

  public async testModel(modelName: string = 'qwen3.5:4b'): Promise<{ ok: boolean; reply: string; diagnostics?: OllamaDiagnosticsTiming }> {
    const startTime = Date.now();
    try {
      let firstChunkTime = 0;
      let replyText = '';

      const res = await this.streamChat({
        message: 'Say OK',
      }, (chunk) => {
        if (!firstChunkTime) firstChunkTime = Date.now();
        replyText += chunk;
      }, modelName);

      const endTime = Date.now();
      const diag = this.getLastDiagnostics();

      return {
        ok: res.status === 'success' && !res.reply.startsWith('Ollama Error'),
        reply: res.reply,
        diagnostics: {
          ...diag,
          totalMs: endTime - startTime,
        }
      };
    } catch (err: any) {
      return { ok: false, reply: err.message || 'Test failed' };
    }
  }
}

export const ollamaService = new OllamaService();

