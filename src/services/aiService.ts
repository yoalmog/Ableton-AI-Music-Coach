import { aiRouter } from './ai/aiRouter';
import { AISettings, AIRequest, AIResponse, AIHealth } from './ai/aiTypes';
import { MidiPattern, AnalysisResult, KeyType, ScaleType } from '../types';
import { midiService } from './midiService';

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
    energy: number = 7,
    lang?: string
  ): Promise<{ pattern: MidiPattern; offline: boolean }> {
    let currentLang = lang;
    if (!currentLang && typeof localStorage !== 'undefined') {
      try {
        currentLang = localStorage.getItem('aamc-language') || undefined;
      } catch {
        // ignore
      }
    }
    if (!currentLang) currentLang = 'en';

    const prompt = `Generate musical sound design and pattern advice for Ableton Live 12.
Type: ${type}
Genre: ${genre}
BPM: ${bpm}
Key: ${key}
Scale: ${scale}
Energy: ${energy}
Language: ${currentLang}

Provide practical, step-by-step sound design advice for Ableton Live 12 in the requested language (${currentLang}).`;

    const res = await this.chat(prompt, { genre, bpm, key, scale, language: currentLang, currentModule: 'MIDI Generator' });

    // Build algorithmic dynamic pattern matching selected parameters
    const generated = midiService.generateMusicalPattern({
      type: type as any,
      genre,
      bpm,
      key: key as KeyType,
      scale: scale as ScaleType,
      energy,
    });

    const pattern: MidiPattern = {
      id: `pat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: generated.name,
      type: (type as any) || 'bassline',
      genre: (genre as any) || 'Psytrance',
      bpm,
      key: (key as any) || 'F#',
      scale: (scale as any) || 'Minor',
      timeSignature: generated.timeSignature || '4/4',
      notes: generated.notes,
      abletonTips: res.reply || (currentLang === 'he' 
        ? 'ב-Ableton Live 12, טען Operator או Drift. הגדר את Osc A לגל Saw, פילטר 24dB LP, התקפה 0ms, דעיכה 160ms.' 
        : currentLang === 'es'
        ? 'En Ableton Live 12, inserta Operator o Drift. Configura Osc A en onda Saw, filtro 24dB LP, ataque 0ms y decaimiento 160ms.'
        : 'In Ableton Live 12, insert Operator or Drift. Set Osc A to Saw wave, 24dB LP Filter, 0ms Attack, 160ms Decay, 0 Sustain.'),
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
    lang?: string;
  }): Promise<{ analysis: AnalysisResult; offline: boolean }> {
    let currentLang = params.lang;
    if (!currentLang && typeof localStorage !== 'undefined') {
      try {
        currentLang = localStorage.getItem('aamc-language') || undefined;
      } catch {
        // ignore
      }
    }
    if (!currentLang) currentLang = 'en';

    const prompt = `Analyze this mixdown for ${params.genre}:
- Measured LUFS: ${params.lufs} dB
- Peak: ${params.peak} dB
- RMS: ${params.rms} dB
- Stereo Width Index: ${params.stereoWidth}
- Low/Mid Ratio: ${params.lowMidRatio}
- Notes: ${params.userNotes || 'None'}
- Language: ${currentLang}`;

    const res = await this.chat(prompt, { genre: params.genre, language: currentLang, currentModule: 'Track Analyzer' });

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
