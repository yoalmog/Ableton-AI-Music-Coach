import { AIProvider, AIModel, AIHealth, AIRequest, AIResponse } from './aiTypes';
import { apiUrl } from '../apiConfig';

const DEFAULT_MODEL = 'gemini-3.8-flash';

const SYSTEM_INSTRUCTION = `You are ABLETON AI MUSIC COACH, an elite co-producer, mixing engineer, and sound design assistant specialized in Ableton Live 12 and electronic music production (Psytrance, Goa, Techno, House, Melodic Trance, Drum & Bass, Ambient).

ABLETON LIVE 12 SPECIALIZATION:
- Instruments: Operator, Wavetable, Drift, Meld, Simpler, Sampler, Drum Rack, Chord Trigger, Granulator III.
- Processing & FX: Roar distortion, Saturator, EQ Eight, Compressor, Glue Compressor, Utility, Auto Filter, Delay, Reverb, Sidechaining.
- Workflow: Session View, Arrangement View, MIDI Tools, Scale Lock, Warping, Return Tracks.

RESPONSE FORMAT RULES:
- Provide clear, actionable, step-by-step guidance.
- Format responses cleanly with bold labels, step lists, and parameter values.
- Include specific Ableton Live 12 devices and precise parameter settings.

MULTILINGUAL & HEBREW RULES:
- Respond in the language of the prompt or context (default English, or Hebrew when context or prompt is in Hebrew).
- When responding in Hebrew ('he'), write the explanations in natural, fluent Hebrew, while keeping all Ableton Live 12 device names, technical terms, unit values, and plugin names strictly in English LTR (e.g., Operator, Wavetable, EQ Eight, Utility, Saturator, Roar, 142 BPM, F# minor, 30 Hz, 20 kHz, -8 LUFS, MIDI, Sidechain).`;

export class GeminiProvider implements AIProvider {
  public id = 'gemini';
  public name = 'Google Gemini (Cloud AI)';
  private modelName = DEFAULT_MODEL;

  constructor(modelName = DEFAULT_MODEL) {
    this.modelName = modelName;
  }

  public setModel(model: string) {
    this.modelName = model;
  }

  private getDesktopApi() {
    return (window as any).desktopAPI?.ai || (window as any).electronAPI?.ai || null;
  }

  private getSavedApiKey(): string | undefined {
    try {
      const raw = localStorage.getItem('aamc-ai-settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed?.apiKey &&
          typeof parsed.apiKey === 'string' &&
          !parsed.apiKey.includes('••••') &&
          parsed.apiKey.trim().length > 10
        ) {
          return parsed.apiKey.trim();
        }
      }
    } catch {
      // ignore
    }
    return undefined;
  }

  public async isAvailable(): Promise<boolean> {
    const health = await this.testConnection();
    return health.ok;
  }

  public async getModels(): Promise<AIModel[]> {
    return [
      { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Fast & Intelligent)', family: 'Gemini 3' },
      { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash-Lite (Low Latency)', family: 'Gemini 3' },
      { id: 'gemini-flash-latest', name: 'Gemini Flash Latest', family: 'Gemini 3' },
      { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro (Deep Music Reasoning)', family: 'Gemini 3' },
    ];
  }

  /**
   * Direct verification against Google's Generative Language API
   * Used for mobile / native environments or when backend proxy is unreachable.
   */
  private async testDirectGoogleGemini(apiKey: string, model: string, startTime: number): Promise<AIHealth> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Ping. Confirm Ableton AI Music Coach engine status.' }] }],
          generationConfig: {
            maxOutputTokens: 20,
          },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - startTime;

      if (res.ok) {
        return {
          ok: true,
          provider: 'gemini',
          status: 'CONNECTED',
          statusMessage: `✓ Connected to Gemini API directly (${model} • ${latencyMs}ms)`,
          modelUsed: model,
          latencyMs,
        };
      }

      const errJson = await res.json().catch(() => null);
      const errMsg = errJson?.error?.message || `HTTP ${res.status}`;

      if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('not valid') || res.status === 400 || res.status === 403) {
        return {
          ok: false,
          provider: 'gemini',
          status: 'ERROR',
          statusMessage: '✕ Invalid API Key. Please verify your Gemini API Key.',
          latencyMs,
        };
      }

      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota')) {
        return {
          ok: false,
          provider: 'gemini',
          status: 'ERROR',
          statusMessage: '✕ Quota Exceeded for this Gemini API Key.',
          latencyMs,
        };
      }

      return {
        ok: false,
        provider: 'gemini',
        status: 'ERROR',
        statusMessage: `✕ Gemini API: ${errMsg}`,
        latencyMs,
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      return {
        ok: false,
        provider: 'gemini',
        status: 'ERROR',
        statusMessage: `✕ Connection Failed: ${err?.message || 'Unable to reach Gemini API'}`,
        latencyMs,
      };
    }
  }

  /**
   * Direct Chat execution against Google's Generative Language API
   */
  private async chatDirectGoogleGemini(
    apiKey: string,
    model: string,
    request: AIRequest,
    startTime: number
  ): Promise<AIResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (request.history && Array.isArray(request.history)) {
        for (const item of request.history) {
          const isUser = item.sender === 'user';
          contents.push({
            role: isUser ? 'user' : 'model',
            parts: [{ text: item.text || '' }],
          });
        }
      }

      let promptText = request.message;
      if (request.context) {
        promptText = `[Session Context: ${JSON.stringify(request.context)}]\n\n${request.message}`;
      }

      contents.push({
        role: 'user',
        parts: [{ text: promptText }],
      });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      const replyPart = parts.find((p: any) => p.text)?.text || parts[0]?.text;
      const reply = replyPart || 'No response returned from Gemini.';

      return {
        reply,
        provider: 'gemini',
        model,
        latencyMs,
        status: 'success',
        offline: false,
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      return {
        reply: `Cloud AI error: ${err.message}`,
        provider: 'gemini',
        model,
        latencyMs,
        status: 'error',
        offline: true,
        error: err.message,
      };
    }
  }

  public async testConnection(params?: {
    customKey?: string;
    customModel?: string;
    forceInference?: boolean;
  }): Promise<AIHealth> {
    const api = this.getDesktopApi();
    const startTime = Date.now();
    const targetModel = params?.customModel || this.modelName;
    const apiKey = params?.customKey?.trim() || this.getSavedApiKey();

    // 1. Desktop IPC test (Electron)
    if (api?.testConnection) {
      try {
        const res = await api.testConnection({
          customKey: apiKey,
          customModel: targetModel,
        });
        const latencyMs = res.responseTimeMs || Date.now() - startTime;
        return {
          ok: Boolean(res.ok),
          provider: 'gemini',
          status: res.ok ? 'CONNECTED' : 'ERROR',
          statusMessage: res.statusMessage || (res.ok ? '✓ Gemini Cloud Connected' : '✕ Connection Error'),
          modelUsed: res.modelUsed || targetModel,
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

    // 2. Web Express route test
    let serverError: Error | null = null;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(apiUrl('/api/ai/test-connection'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customKey: apiKey,
          customModel: targetModel,
          forceInference: Boolean(params?.forceInference),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return {
          ok: Boolean(data.ok),
          provider: 'gemini',
          status: data.ok ? 'CONNECTED' : 'ERROR',
          statusMessage: data.statusMessage || (data.ok ? '✓ Connected to Gemini API' : '✕ Failed'),
          modelUsed: data.modelUsed || targetModel,
          latencyMs: Date.now() - startTime,
        };
      } else {
        serverError = new Error(`Server HTTP ${response.status}`);
      }
    } catch (err: any) {
      serverError = err;
    }

    // 3. Fallback: If server route failed (e.g. mobile APK, native client, unreachable server),
    // and we have a Gemini API key:
    if (apiKey) {
      return await this.testDirectGoogleGemini(apiKey, targetModel, startTime);
    }

    // If server failed and no key was provided
    return {
      ok: false,
      provider: 'gemini',
      status: 'ERROR',
      statusMessage: serverError
        ? `Cloud Server Unreachable (${serverError.message}). Enter your Gemini API Key below to connect directly, or use Local AI.`
        : 'Gemini API Key is missing. Please enter your Gemini API Key below.',
      latencyMs: Date.now() - startTime,
    };
  }

  public async chat(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const api = this.getDesktopApi();
    const apiKey = this.getSavedApiKey();

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
    let serverError: Error | null = null;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(apiUrl('/api/ai/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: request.message,
          context: request.context,
          history: request.history,
          model: this.modelName,
          customKey: apiKey,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const latencyMs = Date.now() - startTime;

        return {
          reply: data.reply || 'No response returned from cloud coach.',
          provider: 'gemini',
          model: data.modelUsed || this.modelName,
          latencyMs,
          status: data.offline ? 'error' : 'success',
          offline: Boolean(data.offline),
        };
      } else {
        serverError = new Error(`Server HTTP ${response.status}`);
      }
    } catch (err: any) {
      serverError = err;
    }

    // 3. Direct Gemini API Fallback if server is unreachable and API key is present
    if (apiKey) {
      return await this.chatDirectGoogleGemini(apiKey, this.modelName, request, startTime);
    }

    const latencyMs = Date.now() - startTime;
    return {
      reply: `Cloud AI Request Error: ${serverError?.message || 'Server unreachable'}. Please check your connection or use Local AI / Offline Coach.`,
      provider: 'gemini',
      model: this.modelName,
      latencyMs,
      status: 'error',
      offline: true,
      error: serverError?.message || 'Server unreachable',
    };
  }
}
