import { AIProvider, AIModel, AIHealth, AIRequest, AIResponse } from './aiTypes';
import { queryKnowledgeBase, getLocalizedTopic } from './musicKnowledgeBase';

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
    
    // Determine active language
    let lang = ctx.language;
    if (!lang && typeof localStorage !== 'undefined') {
      try {
        lang = localStorage.getItem('aamc-language') || undefined;
      } catch {
        // ignore
      }
    }
    if (!lang && /[\u0590-\u05FF]/.test(request.message)) {
      lang = 'he';
    }
    if (!lang) {
      lang = 'en';
    }

    const topic = queryKnowledgeBase(request.message, genre);
    const localized = topic ? getLocalizedTopic(topic, lang) : null;

    let reply = '';

    if (lang === 'he') {
      reply = `[OFFLINE COACH]

${localized ? localized.summary : 'מדריך מוזיקלי לא מקוון ל-Ableton Live 12 ופסיטראנס'}

פרויקט: ${genre} | BPM ${bpm} | סולם ${key}

${localized ? localized.detailedAdvice : 'הנחיה כללית: להתחלת עבודה נקייה ב-Ableton Live 12, הגדר את הקיק והבס עם Sidechain Compression, השתמש ב-Utility ב-Bass Mono ב-120Hz ובדוק חפיפת תדרים ב-EQ Eight.'}

מכשירים מומלצים ב-Ableton Live 12:
${topic ? topic.abletonDevices.join(', ') : 'Operator, Drift, Utility, EQ Eight, Compressor'}`;
    } else if (lang === 'es') {
      reply = `[OFFLINE COACH]

${localized ? localized.summary : 'Guía educativa fuera de línea para Ableton Live 12 y producción musical'}

Proyecto: ${genre} | ${bpm} BPM | Tonalidad: ${key}

${localized ? localized.detailedAdvice : 'Guía general: Para un subgrave limpio en Ableton Live 12, configura compresión Sidechain entre Bombo y Bajo, activa Utility con Bass Mono a 120Hz y revisa el balance en EQ Eight.'}

Dispositivos recomendados en Ableton Live 12:
${topic ? topic.abletonDevices.join(', ') : 'Operator, Drift, Utility, EQ Eight, Compressor'}`;
    } else if (lang === 'pt') {
      reply = `[OFFLINE COACH]

${localized ? localized.summary : 'Guia educacional offline para Ableton Live 12 e produção musical'}

Projeto: ${genre} | ${bpm} BPM | Tonalidade: ${key}

${localized ? localized.detailedAdvice : 'Guia geral: Para graves limpos no Ableton Live 12, configure compressão Sidechain entre Kick e Baixo, ative o Utility com Bass Mono em 120Hz e monitore no EQ Eight.'}

Dispositivos recomendados no Ableton Live 12:
${topic ? topic.abletonDevices.join(', ') : 'Operator, Drift, Utility, EQ Eight, Compressor'}`;
    } else if (lang === 'fr') {
      reply = `[OFFLINE COACH]

${localized ? localized.summary : 'Guide éducatif hors ligne pour Ableton Live 12 et production musicale'}

Projet : ${genre} | ${bpm} BPM | Tonalité : ${key}

${localized ? localized.detailedAdvice : 'Guide général : Pour un bas du spectre propre dans Ableton Live 12, configurez la compression Sidechain entre Kick et Basse, activez Utility avec Bass Mono à 120Hz et vérifiez sur EQ Eight.'}

Périphériques recommandés dans Ableton Live 12 :
${topic ? topic.abletonDevices.join(', ') : 'Operator, Drift, Utility, EQ Eight, Compressor'}`;
    } else if (lang === 'de') {
      reply = `[OFFLINE COACH]

${localized ? localized.summary : 'Offline-Leitfaden für Ableton Live 12 & elektronische Musikproduktion'}

Projekt: ${genre} | ${bpm} BPM | Tonart: ${key}

${localized ? localized.detailedAdvice : 'Allgemeine Anleitung: Für einen sauberen Bassbereich in Ableton Live 12 richten Sie Sidechain-Kompression zwischen Kick und Bass ein, aktivieren Sie Utility Bass Mono bei 120Hz und prüfen Sie mit EQ Eight.'}

Empfohlene Ableton Live 12 Geräte:
${topic ? topic.abletonDevices.join(', ') : 'Operator, Drift, Utility, EQ Eight, Compressor'}`;
    } else if (lang === 'it') {
      reply = `[OFFLINE COACH]

${localized ? localized.summary : 'Guida didattica offline per Ableton Live 12 e produzione musicale'}

Progetto: ${genre} | ${bpm} BPM | Scala: ${key}

${localized ? localized.detailedAdvice : 'Guida generale: Per una gamma bassa pulita in Ableton Live 12, imposta la compressione Sidechain tra Cassa e Basso, attiva Utility Bass Mono a 120Hz e controlla su EQ Eight.'}

Dispositivi consigliati in Ableton Live 12:
${topic ? topic.abletonDevices.join(', ') : 'Operator, Drift, Utility, EQ Eight, Compressor'}`;
    } else if (lang === 'ru') {
      reply = `[OFFLINE COACH]

${localized ? localized.summary : 'Офлайн руководство по Ableton Live 12 и музыкальному продакшену'}

Проект: ${genre} | ${bpm} BPM | Тональность: ${key}

${localized ? localized.detailedAdvice : 'Общее руководство: Для чистого саб-баса в Ableton Live 12 настройте сайдчейн-компрессию между бочкой и басом, включите Utility Bass Mono на 120Hz и проверьте баланс в EQ Eight.'}

Рекомендуемые устройства в Ableton Live 12:
${topic ? topic.abletonDevices.join(', ') : 'Operator, Drift, Utility, EQ Eight, Compressor'}`;
    } else if (lang === 'zh-CN') {
      reply = `[OFFLINE COACH]

${localized ? localized.summary : 'Ableton Live 12 与电子音乐制作离线教学指南'}

项目: ${genre} | ${bpm} BPM | 调性: ${key}

${localized ? localized.detailedAdvice : '常规指南：在 Ableton Live 12 中获得纯净低频，请设置底鼓与贝斯之间的侧链压缩，在 Utility 中启用 120Hz 的 Bass Mono，并使用 EQ Eight 检查频谱平衡。'}

Ableton Live 12 推荐设备:
${topic ? topic.abletonDevices.join(', ') : 'Operator, Drift, Utility, EQ Eight, Compressor'}`;
    } else if (lang === 'ja') {
      reply = `[OFFLINE COACH]

${localized ? localized.summary : 'Ableton Live 12 & 音楽制作オフライン学習ガイド'}

プロジェクト: ${genre} | ${bpm} BPM | キー: ${key}

${localized ? localized.detailedAdvice : '総合ガイド：Ableton Live 12でクリーンなローエンドを作るには、キックとベース間にサイドチェインコンプレッションを設定し、Utilityで120HzのBass Monoを有効にしてEQ Eightで確認してください。'}

Ableton Live 12 推奨デバイス:
${topic ? topic.abletonDevices.join(', ') : 'Operator, Drift, Utility, EQ Eight, Compressor'}`;
    } else {
      // Default to English
      reply = `[OFFLINE COACH]

${localized ? localized.summary : 'Offline Educational Knowledge Base for Ableton Live 12 & Electronic Music'}

Project: ${genre} | ${bpm} BPM | ${key}

${localized ? localized.detailedAdvice : 'General Guide: For a clean low-end in Ableton Live 12, set Kick and Bass sidechain compression, enable Utility Bass Mono at 120Hz, and check spectral balance in EQ Eight.'}

Recommended Ableton Live 12 Devices:
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

