import { AIModel } from './ai/aiTypes';
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
  private get desktopOllama() {
    return (window as any).desktopAPI?.ollama || (window as any).electronAPI?.ollama;
  }

  public async checkStatus(): Promise<OllamaStatus> {
    if (this.desktopOllama?.checkStatus) {
      return await this.desktopOllama.checkStatus();
    }
    try {
      const res = await fetch('/api/ollama/status');
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return { installed: false, running: false, endpoint: 'http://localhost:11434' };
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

  public async getModels(): Promise<AIModel[]> {
    if (this.desktopOllama?.getModels) {
      return await this.desktopOllama.getModels();
    }
    try {
      const res = await fetch('/api/ollama/tags');
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
    } catch {}
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

    // Web Fallback implementation via SSE / NDJSON stream
    try {
      const response = await fetch('/api/ollama/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Pull failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let lastBytes = 0;
      let lastTime = Date.now();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            const completed = Number(data.completed || 0);
            const total = Number(data.total || 0);
            const status = data.status || 'pulling';

            const now = Date.now();
            const timeDiffSec = (now - lastTime) / 1000;
            let speedMBs = 0;

            if (timeDiffSec > 0.5 && completed > lastBytes) {
              const bytesDiff = completed - lastBytes;
              speedMBs = Math.round((bytesDiff / (1024 * 1024 * timeDiffSec)) * 10) / 10;
              lastBytes = completed;
              lastTime = now;
            }

            const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
            const completedGB = (completed / (1024 * 1024 * 1024)).toFixed(2);
            const totalGB = (total / (1024 * 1024 * 1024)).toFixed(2);
            const etaSeconds = speedMBs > 0 && total > completed ? Math.round((total - completed) / (speedMBs * 1024 * 1024)) : 0;

            if (onProgress) {
              onProgress({
                modelName,
                status,
                percent,
                completedBytes: completed,
                totalBytes: total,
                completedHuman: `${completedGB} GB`,
                totalHuman: `${totalGB} GB`,
                speedMBs,
                etaSeconds,
              });
            }
          } catch {}
        }
      }

      if (onProgress) {
        onProgress({
          modelName,
          status: 'success',
          percent: 100,
          completedBytes: 3.4 * 1024 * 1024 * 1024,
          totalBytes: 3.4 * 1024 * 1024 * 1024,
          completedHuman: '3.4 GB',
          totalHuman: '3.4 GB',
          speedMBs: 0,
          etaSeconds: 0,
        });
      }

      return { success: true, modelName };
    } catch (err: any) {
      debugLog.error('OllamaService pullModel error:', err);
      return { success: false, modelName };
    }
  }

  public async cancelPull(): Promise<{ success: boolean; message: string }> {
    if (this.desktopOllama?.cancelPull) {
      return await this.desktopOllama.cancelPull();
    }
    return { success: true, message: 'Cancelled.' };
  }

  public async testModel(modelName?: string): Promise<{ ok: boolean; reply: string }> {
    if (this.desktopOllama?.testModel) {
      return await this.desktopOllama.testModel(modelName);
    }
    try {
      const res = await fetch('/api/ollama/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return { ok: false, reply: 'Connection failed.' };
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
}

export const ollamaService = new OllamaService();
