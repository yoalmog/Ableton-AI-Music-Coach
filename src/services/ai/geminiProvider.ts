import { AIProvider, AIModel, AIHealth, AIRequest, AIResponse } from './aiTypes';

export class GeminiProvider implements AIProvider {
  public id = 'gemini';
  public name = 'Google Gemini (Cloud AI)';
  private modelName = 'gemini-3.7-flash';

  constructor(modelName = 'gemini-3.7-flash') {
    this.modelName = modelName;
  }

  public setModel(model: string) {
    this.modelName = model;
  }

  private getDesktopApi() {
    return (window as any).desktopAPI?.ai || (window as any).electronAPI?.ai || null;
  }

  public async isAvailable(): Promise<boolean> {
    const health = await this.testConnection();
    return health.ok;
  }

  public async getModels(): Promise<AIModel[]> {
    return [
      { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash (Fast & Intelligent)', family: 'Gemini 3' },
      { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash-Lite (Low Latency)', family: 'Gemini 3' },
      { id: 'gemini-flash-latest', name: 'Gemini Flash Latest', family: 'Gemini 3' },
      { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro (Deep Music Reasoning)', family: 'Gemini 3' },
    ];
  }

  public async testConnection(params?: { customKey?: string; customModel?: string }): Promise<AIHealth> {
    const api = this.getDesktopApi();
    const startTime = Date.now();

    if (api?.testConnection) {
      try {
        const res = await api.testConnection({
          customKey: params?.customKey,
          customModel: params?.customModel || this.modelName,
        });
        const latencyMs = res.responseTimeMs || Date.now() - startTime;
        return {
          ok: Boolean(res.ok),
          provider: 'gemini',
          status: res.ok ? 'CONNECTED' : 'ERROR',
          statusMessage: res.statusMessage || (res.ok ? '✓ Gemini Cloud Connected' : '✕ Connection Error'),
          modelUsed: res.modelUsed || this.modelName,
          latencyMs,
        };
      } catch (err: any) {
        return {
          ok: false,
          provider: 'gemini',
          status: 'ERROR',
          statusMessage: `Desktop IPC Error: ${err.message}`,
          latencyMs: Date.now() - startTime,
        };
      }
    }

    // Web Express route test
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customKey: params?.customKey,
          customModel: params?.customModel || this.modelName,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          ok: false,
          provider: 'gemini',
          status: 'ERROR',
          statusMessage: `Server HTTP ${response.status}`,
          latencyMs: Date.now() - startTime,
        };
      }

      const data = await response.json();
      return {
        ok: Boolean(data.ok),
        provider: 'gemini',
        status: data.ok ? 'CONNECTED' : 'ERROR',
        statusMessage: data.statusMessage || (data.ok ? '✓ Connected to Gemini API' : '✕ Failed'),
        modelUsed: data.modelUsed || this.modelName,
        latencyMs: Date.now() - startTime,
      };
    } catch (err: any) {
      return {
        ok: false,
        provider: 'gemini',
        status: 'ERROR',
        statusMessage: `Cloud Server Error: ${err.message || 'Unreachable'}`,
        latencyMs: Date.now() - startTime,
      };
    }
  }

  public async chat(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const api = this.getDesktopApi();

    // 1. Electron Desktop Path
    if (api?.chat) {
      try {
        const res = await api.chat({
          message: request.message,
          history: request.history,
          context: request.context,
        });

        const latencyMs = Date.now() - startTime;
        return {
          reply: res.reply || 'No response text returned.',
          provider: 'gemini',
          model: res.modelUsed || this.modelName,
          latencyMs,
          status: res.offline ? 'error' : 'success',
          offline: Boolean(res.offline),
        };
      } catch (err: any) {
        return {
          reply: `Cloud AI error: ${err.message}`,
          provider: 'gemini',
          model: this.modelName,
          latencyMs: Date.now() - startTime,
          status: 'error',
          offline: true,
          error: err.message,
        };
      }
    }

    // 2. Express Web Path
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: request.message,
          context: request.context,
          history: request.history,
          model: this.modelName,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();
      const latencyMs = Date.now() - startTime;

      return {
        reply: data.reply || 'No response returned from cloud coach.',
        provider: 'gemini',
        model: this.modelName,
        latencyMs,
        status: data.offline ? 'error' : 'success',
        offline: Boolean(data.offline),
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      return {
        reply: `Cloud AI Request Error: ${err.message || 'Server unreachable'}.`,
        provider: 'gemini',
        model: this.modelName,
        latencyMs,
        status: 'error',
        offline: true,
        error: err.message,
      };
    }
  }
}
