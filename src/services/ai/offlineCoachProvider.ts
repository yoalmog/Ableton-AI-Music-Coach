import { AIProvider, AIModel, AIHealth, AIRequest, AIResponse } from './aiTypes';
import { queryKnowledgeBase } from './musicKnowledgeBase';

export class OfflineCoachProvider implements AIProvider {
  public id = 'offline_coach';
  public name = 'Offline Coach (Local Knowledge Base)';

  public async isAvailable(): Promise<boolean> {
    return true; // Always available offline
  }

  public async getModels(): Promise<AIModel[]> {
    return [
      {
        id: 'aamc-knowledge-base-v1',
        name: 'Ableton & Psytrance Knowledge Base',
        family: 'Structured Educational Engine',
      },
    ];
  }

  public async testConnection(): Promise<AIHealth> {
    return {
      ok: true,
      provider: 'offline_coach',
      status: 'CONNECTED',
      statusMessage: 'OFFLINE COACH ● Available (Local Educational Base)',
      modelUsed: 'Ableton & Psytrance Knowledge Base',
      latencyMs: 5,
      endpoint: 'Local Structured Knowledge Base',
    };
  }

  public async chat(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const ctx = request.context || {};
    const genre = ctx.genre || 'Psytrance';
    const bpm = ctx.bpm || 145;
    const key = ctx.key || 'F Minor';
    const lang = ctx.language || 'he';
    const isHebrew = lang === 'he' || /[\u0590-\u05FF]/.test(request.message);

    const topic = queryKnowledgeBase(request.message, genre);

    let reply = '';

    if (isHebrew) {
      reply = `[OFFLINE COACH]

${topic ? topic.summaryHe : 'מדריך מוזיקלי לא מקוון ל-Ableton Live 12 ופסיטראנס'}

פרויקט: ${genre} | BPM ${bpm} | סולם ${key}

${topic ? topic.detailedAdviceHe : 'הנחיה כללית: להתחלת עבודה נקייה ב-Ableton Live 12, הגדר את הקיק והבס עם Sidechain Compression, השתמש ב-Utility ב-Bass Mono ב-120Hz ובדוק חפיפת תדרים ב-EQ Eight.'}

מכשירים מומלצים ב-Ableton:
${topic ? topic.abletonDevices.join(', ') : 'Operator, Drift, Utility, EQ Eight, Compressor'}`;
    } else {
      reply = `[OFFLINE COACH]

${topic ? topic.summaryEn : 'Offline Educational Knowledge Base for Ableton Live 12 & Electronic Music'}

Project: ${genre} | ${bpm} BPM | ${key}

${topic ? topic.detailedAdviceEn : 'General Guide: For a clean low-end in Ableton Live 12, set Kick and Bass sidechain compression, enable Utility Bass Mono at 120Hz, and check spectral balance in EQ Eight.'}

Recommended Ableton Devices:
${topic ? topic.abletonDevices.join(', ') : 'Operator, Drift, Utility, EQ Eight, Compressor'}`;
    }

    return {
      reply,
      provider: 'offline_coach',
      model: 'OFFLINE COACH (Knowledge Base)',
      latencyMs: Date.now() - startTime,
      status: 'success',
      offline: true,
    };
  }
}

export const offlineCoachProvider = new OfflineCoachProvider();
