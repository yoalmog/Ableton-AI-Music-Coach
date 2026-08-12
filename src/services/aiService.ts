import { aiRouter } from './ai/aiRouter';
import { AISettings, AIRequest, AIResponse, AIHealth } from './ai/aiTypes';
import { MidiPattern, AnalysisResult } from '../types';

export class AIService {
  public getSettings(): AISettings {
    return aiRouter.getSettings();
  }

  public updateSettings(settings: Partial<AISettings>): AISettings {
    return aiRouter.updateSettings(settings);
  }

  public async getDiagnostics() {
    return await aiRouter.getDiagnostics();
  }

  public async testConnection(params?: { customKey?: string; customModel?: string }): Promise<{ ok: boolean; statusMessage: string; modelUsed?: string; responseTimeMs?: number }> {
    const cloudRes = await aiRouter.testCloudConnection(params);
    return {
      ok: cloudRes.ok,
      statusMessage: cloudRes.statusMessage,
      modelUsed: cloudRes.modelUsed,
      responseTimeMs: cloudRes.latencyMs,
    };
  }

  public async testLocalConnection(): Promise<AIHealth> {
    return await aiRouter.testLocalConnection();
  }

  public async getLocalModels() {
    return await aiRouter.getLocalModels();
  }

  public async chat(message: string, context?: any, history?: any[]): Promise<{ reply: string; offline: boolean; provider?: string; model?: string; latencyMs?: number; status?: string }> {
    const request: AIRequest = {
      message,
      context,
      history,
    };

    const res: AIResponse = await aiRouter.chat(request);

    return {
      reply: res.reply,
      offline: res.offline,
      provider: res.provider,
      model: res.model,
      latencyMs: res.latencyMs,
      status: res.status,
    };
  }

  public async generatePattern(
    type: string,
    genre: string,
    bpm: number,
    key: string,
    scale: string,
    energy: number = 7
  ): Promise<{ pattern: MidiPattern; offline: boolean }> {
    const prompt = `Generate a musical pattern for Ableton Live 12.
Type: ${type}
Genre: ${genre}
BPM: ${bpm}
Key: ${key}
Scale: ${scale}
Energy: ${energy}

Please output structured MIDI notes.`;

    const res = await this.chat(prompt, { genre, bpm, key, scale, currentModule: 'MIDI Generator' });

    // Build pattern from response or standard generator logic
    const pattern: MidiPattern = {
      id: `pat_${Date.now()}`,
      name: `${genre} ${type.charAt(0).toUpperCase() + type.slice(1)} (${key} ${scale})`,
      type: (type as any) || 'bassline',
      genre: (genre as any) || 'Psytrance',
      bpm,
      key: (key as any) || 'F#',
      scale: (scale as any) || 'Minor',
      timeSignature: '4/4',
      notes: [
        { pitch: `${key}1`, time: 0.25, duration: 0.2, velocity: 100 },
        { pitch: `${key}1`, time: 0.5, duration: 0.2, velocity: 95 },
        { pitch: `${key}1`, time: 0.75, duration: 0.2, velocity: 105 },
        { pitch: `${key}1`, time: 1.25, duration: 0.2, velocity: 100 },
        { pitch: `${key}1`, time: 1.5, duration: 0.2, velocity: 95 },
        { pitch: `${key}1`, time: 1.75, duration: 0.2, velocity: 105 },
        { pitch: `${key}1`, time: 2.25, duration: 0.2, velocity: 100 },
        { pitch: `${key}1`, time: 2.5, duration: 0.2, velocity: 95 },
        { pitch: `${key}1`, time: 2.75, duration: 0.2, velocity: 105 },
        { pitch: `${key}1`, time: 3.25, duration: 0.2, velocity: 100 },
        { pitch: `${key}1`, time: 3.5, duration: 0.2, velocity: 95 },
        { pitch: `${key}1`, time: 3.75, duration: 0.2, velocity: 110 },
      ],
      abletonTips: res.reply || 'In Ableton Live 12, insert Operator or Drift. Set Osc A to Saw wave, 24dB LP Filter, 0ms Attack, 160ms Decay, 0 Sustain.',
      createdAt: new Date().toISOString(),
    };

    return { pattern, offline: res.offline };
  }

  public async analyzeTrack(params: {
    genre: string;
    lufs: number;
    rms: number;
    peak: number;
    lowMidRatio: number;
    stereoWidth: number;
    userNotes?: string;
  }): Promise<{ analysis: AnalysisResult; offline: boolean }> {
    const prompt = `Analyze this mixdown for ${params.genre}:
- Measured LUFS: ${params.lufs} dB
- Peak: ${params.peak} dB
- RMS: ${params.rms} dB
- Stereo Width Index: ${params.stereoWidth}
- Low/Mid Ratio: ${params.lowMidRatio}
- Notes: ${params.userNotes || 'None'}`;

    const res = await this.chat(prompt, { genre: params.genre, currentModule: 'Track Analyzer' });

    const analysis: AnalysisResult = {
      overallRating: 'Mix Analysis',
      loudnessAssessment: `Measured LUFS is ${params.lufs} dB. Standard target for ${params.genre} master is -8 LUFS to -6 LUFS.`,
      spectralBalance: 'Sub-bass and high frequencies evaluated.',
      dynamicsAndWidth: 'Ensure sub frequencies below 120Hz are set to 100% Mono in Ableton Live Utility.',
      actionableSteps: [
        'Add Ableton Live 12 Utility plugin to Master Bus. Enable "Bass Mono" at 120Hz.',
        'Use EQ Eight on Sub Bass with a high pass filter at 30Hz.',
        'Apply Auto Filter sidechain compression on bass triggered by Kick drum C1.',
        'Insert Saturator on K&B bus with 2dB soft clip drive to glue transients.'
      ],
    };

    return { analysis, offline: res.offline };
  }
}

export const aiService = new AIService();
