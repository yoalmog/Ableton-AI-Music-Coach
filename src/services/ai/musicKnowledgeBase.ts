export interface KnowledgeTopic {
  id: string;
  category: 'psytrance' | 'techno' | 'ableton' | 'sound_design' | 'mixing' | 'music_theory';
  keywords: string[];
  titleEn: string;
  titleHe: string;
  summaryEn: string;
  summaryHe: string;
  detailedAdviceEn: string;
  detailedAdviceHe: string;
  abletonDevices: string[];
  translations?: Record<string, { title: string; summary: string; detailedAdvice: string }>;
}

export const MUSIC_KNOWLEDGE_BASE: KnowledgeTopic[] = [
  {
    id: 'psytrance_rolling_bass',
    category: 'psytrance',
    keywords: ['bass', 'rolling', 'psytrance', 'kick', '145', 'sub', 'f minor', 'בס', 'רולינג', 'פסיטראנס', 'bajo', 'patrón', 'linea de bajo'],
    titleEn: 'Rolling Psytrance Bassline (145 BPM)',
    titleHe: 'בס רולינג פסיטראנס (145 BPM)',
    summaryEn: 'Creating a tight 16th-note rolling bassline synchronized with the kick drum.',
    summaryHe: 'יצירת בס רולינג מתודק של 16-תים מסונכרן באופן מושלם עם הקיק.',
    detailedAdviceEn: `To build an authentic rolling Psytrance bassline at 145 BPM in F Minor:
1. Kick Placement: 4-on-the-floor on every beat (1.1, 1.2, 1.3, 1.4).
2. Bass MIDI Pattern: Place 3 16th notes after every kick (K - B - B - B).
3. Ableton Synthesizer: Use Ableton Live 12 Operator or Drift. Set Oscillator A to Saw wave.
4. Filter Envelope: 24dB Low Pass filter. Set Envelope Attack to 0ms, Decay to 140-160ms, Sustain to 0, Amount to +24.
5. EQ & Mono: Insert Utility on the Bass track and click "Bass Mono" at 120Hz.
6. Sidechain: Insert Auto Filter or Compressor sidechained to Kick C1 to clear sub room for the kick transient.`,
    detailedAdviceHe: `כדי ליצור בס רולינג פסיטראנס מדויק ב-145 BPM ובסולם F Minor:
1. מיקום הקיק: 4 על הרצפה בכל פעם (1.1, 1.2, 1.3, 1.4).
2. תבנית MIDI לבס: שים 3 תווים של 16-תים אחרי כל קיק (K - B - B - B).
3. סינתיסייזר ב-Ableton: השתמש ב-Operator או Drift ב-Ableton Live 12. הגדר את Osc A לגל Saw.
4. מעטפת פילטר (Filter Env): פילטר 24dB Low Pass. התקפה (Attack) 0ms, דעיכה (Decay) 140-160ms, Sustain ל-0.
5. EQ ומונו: שים Utility על ערוץ הבס והפעל "Bass Mono" ב-120Hz.
6. Sidechain: שים Auto Filter או Compressor עם sidechain מהקיק כדי לפנות מקום נקי לתדר הנמוך של הקיק.`,
    translations: {
      es: {
        title: 'Línea de bajo rolling para Psytrance (145 BPM)',
        summary: 'Creación de un bajo rolling de semicorcheas (1/16) sincronizado perfectamente con el bombo (kick).',
        detailedAdvice: `Para construir un bajo rolling auténtico de Psytrance a 145 BPM en Fa Menor (F Minor):
1. Ubicación del Bombo (Kick): 4 al suelo en cada tiempo (1.1, 1.2, 1.3, 1.4).
2. Patrón MIDI de Bajo: Coloca 3 notas de 1/16 después de cada bombo (K - B - B - B).
3. Sintetizador en Ableton: Usa Operator o Drift en Ableton Live 12. Configura el Oscilador A en onda Sierra (Saw).
4. Envolvente de Filtro: Filtro Low Pass de 24dB. Ataque (Attack) 0ms, Decaimiento (Decay) 140-160ms, Sustain a 0.
5. EQ y Mono: Inserta Utility en la pista de bajo y activa "Bass Mono" en 120Hz.
6. Sidechain: Inserta Auto Filter o Compressor con sidechain al Bombo para liberar espacio en frecuencias graves.`
      },
      pt: {
        title: 'Linha de baixo rolling para Psytrance (145 BPM)',
        summary: 'Criação de um baixo rolling de semicolcheias sincronizado perfeitamente com o kick.',
        detailedAdvice: `Para construir um baixo rolling autêntico de Psytrance a 145 BPM em Fá Menor:
1. Posicionamento do Kick: 4-on-the-floor a cada tempo (1.1, 1.2, 1.3, 1.4).
2. Padrão MIDI de Baixo: Insira 3 notas de semicolcheia após cada kick (K - B - B - B).
3. Sintetizador no Ableton: Utilize Operator ou Drift no Ableton Live 12. Configure o Oscilador A com onda Saw.
4. Envelope de Filtro: Filtro Low Pass de 24dB. Attack em 0ms, Decay entre 140-160ms, Sustain em 0.
5. EQ e Mono: Insira o plugin Utility no canal do baixo e ative "Bass Mono" em 120Hz.
6. Sidechain: Utilize Auto Filter ou Compressor com sidechain no Kick para manter os subgraves limpos.`
      },
      fr: {
        title: 'Ligne de basse rolling pour Psytrance (145 BPM)',
        summary: 'Création d’une ligne de basse rolling en doubles croches synchronisée avec le kick.',
        detailedAdvice: `Pour créer une basse rolling Psytrance précise à 145 BPM en Fa mineur :
1. Placement du Kick : 4-on-the-floor sur chaque temps (1.1, 1.2, 1.3, 1.4).
2. Motif MIDI : Placez 3 doubles croches après chaque kick (K - B - B - B).
3. Synthétiseur Ableton : Utilisez Operator ou Drift dans Ableton Live 12. Oscillateur A en onde en dents de scie (Saw).
4. Enveloppe de filtre : Filtre passe-bas 24dB. Attack à 0ms, Decay à 140-160ms, Sustain à 0.
5. EQ & Mono : Insérez Utility sur la piste de basse et activez "Bass Mono" à 120Hz.
6. Sidechain : Insérez Auto Filter ou Compressor avec sidechain déclenché par le Kick.`
      },
      de: {
        title: 'Rolling Psytrance Bassline (145 BPM)',
        summary: 'Erstellung einer präzisen 16tel-Rolling-Bassline, synchronisiert mit der Kick.',
        detailedAdvice: `So erstellen Sie eine authentische Rolling-Psytrance-Bassline bei 145 BPM in F-Moll:
1. Kick-Platzierung: 4-on-the-floor auf jedem Schlag (1.1, 1.2, 1.3, 1.4).
2. Bass-MIDI-Muster: Setzen Sie 3 16tel-Noten nach jeder Kick (K - B - B - B).
3. Ableton-Synthesizer: Verwenden Sie Operator oder Drift in Ableton Live 12. Oszillator A auf Sägezahn (Saw).
4. Filter-Hüllkurve: 24dB Low-Pass-Filter. Attack 0ms, Decay 140-160ms, Sustain 0.
5. EQ & Mono: Fügen Sie Utility auf der Bass-Spur ein und aktivieren Sie "Bass Mono" bei 120Hz.
6. Sidechain: Nutzen Sie Auto Filter oder Compressor mit Sidechain auf die Kick für transparenten Tiefbass.`
      },
      it: {
        title: 'Linea di basso rolling per Psytrance (145 BPM)',
        summary: 'Creazione di una linea di basso rolling in sedicesimi sincronizzata con la cassa (kick).',
        detailedAdvice: `Per creare un basso rolling Psytrance autentico a 145 BPM in Fa Minore:
1. Posizionamento Kick: 4-on-the-floor su ogni battuta (1.1, 1.2, 1.3, 1.4).
2. Pattern MIDI: Inserisci 3 sedicesimi dopo ogni cassa (K - B - B - B).
3. Sintetizzatore: Usa Operator o Drift in Ableton Live 12. Imposta l'oscillatore A su onda a dente di sega (Saw).
4. Inviluppo del Filtro: Filtro Low Pass a 24dB. Attack 0ms, Decay 140-160ms, Sustain a 0.
5. EQ & Mono: Inserisci Utility sulla traccia di basso e attiva "Bass Mono" a 120Hz.
6. Sidechain: Applica Auto Filter o Compressor con sidechain dalla cassa.`
      },
      ru: {
        title: 'Роллинг бас-линия для Psytrance (145 BPM)',
        summary: 'Создание плотного 16-дольного роллинг баса, синхронизированного с бочкой (kick).',
        detailedAdvice: `Для создания классического роллинг баса в стиле Psytrance на 145 BPM в Фа Минор:
1. Расположение бочки: Прямая бочка на каждую четверть (1.1, 1.2, 1.3, 1.4).
2. MIDI-паттерн баса: Расставьте по 3 шестнадцатых ноты после каждого удара бочки (K - B - B - B).
3. Синтезатор в Ableton: Используйте Operator или Drift в Ableton Live 12. Генератор A — пила (Saw).
4. Огибающая фильтра: Фильтр 24dB Low Pass. Attack 0ms, Decay 140-160ms, Sustain 0.
5. EQ и моно: Повесьте плагин Utility на дорожку баса и включите "Bass Mono" на 120Hz.
6. Сайдчейн: Добавьте Auto Filter или Compressor с сайдчейном от бочки для чистоты суб-баса.`
      },
      'zh-CN': {
        title: 'Psytrance 滚奏贝斯线条 (145 BPM)',
        summary: '创建与底鼓完美同步的紧凑十六分音符滚奏贝斯。',
        detailedAdvice: `在 145 BPM 和 F 小调下制作标准 Psytrance 滚奏贝斯：
1. 底鼓位置：每拍一个正拍底鼓（1.1, 1.2, 1.3, 1.4）。
2. 贝斯 MIDI 模式：在每个底鼓后放置 3 个十六分音符（K - B - B - B）。
3. Ableton 合成器：在 Ableton Live 12 中使用 Operator 或 Drift，振荡器 A 设为锯齿波（Saw）。
4. 滤波器包络：24dB 低通滤波器，Attack 0ms，Decay 140-160ms，Sustain 归零。
5. EQ 与单声道：在贝斯轨道插入 Utility，开启 120Hz 的 "Bass Mono"。
6. 侧链压缩：使用 Auto Filter 或 Compressor 挂接底鼓侧链，为底鼓保留纯净超低频空间。`
      },
      ja: {
        title: 'Psytrance ローリングベースライン (145 BPM)',
        summary: 'キックドラムと完全に同期した16分音符のタイトなローリングベースの作成。',
        detailedAdvice: `145 BPM、Fマイナーで本格的なPsytranceローリングベースを作成する手順：
1. キックの配置：各拍に4つ打ち（1.1, 1.2, 1.3, 1.4）。
2. ベースMIDIパターン：キックの直後に3つの16分音符を配置（K - B - B - B）。
3. Abletonシンセサイザー：Ableton Live 12のOperatorまたはDriftを使用し、Osc AをSaw波に設定。
4. フィルターエンベロープ：24dBローパスフィルター。Attack 0ms、Decay 140-160ms、Sustain 0。
5. EQとモノラル化：ベーストラックにUtilityを挿入し、120Hz以下で「Bass Mono」を有効化。
6. サイドチェイン：キックからのサイドチェインでAuto FilterやCompressorを適用し、サブ周波数をクリアに保ちます。`
      }
    },
    abletonDevices: ['Operator', 'Drift', 'Utility', 'EQ Eight', 'Auto Filter'],
  },
  {
    id: 'kick_bass_relationship',
    category: 'mixing',
    keywords: ['kick', 'bass', 'phase', 'sidechain', 'lufs', 'eq', 'קיק', 'בס', 'מיקס', 'פאזה', 'bombo', 'mezcla'],
    titleEn: 'Kick & Bass Phase Alignment & EQ Separation',
    titleHe: 'תיאום פאזה והפרדת תדרים בין הקיק לבס',
    summaryEn: 'Managing sub frequency overlap between kick drum and bass synth.',
    summaryHe: 'ניהול חפיפת התדרים הנמוכים (Sub) בין הקיק לבס במיקס.',
    detailedAdviceEn: `For maximum punch and low-end clarity:
1. Frequency Division: If Kick is tuned to 55Hz (A0), high-pass the Bass above 45-50Hz or set the Kick transient higher.
2. Phase Check: Zoom into Ableton's arrangement audio clips. Make sure Kick's decay waveform pushes UP (+) when Bass starts.
3. Utility Plugin: Use Ableton Utility on both tracks. Turn Bass Mono ON below 120Hz.
4. Compression: Apply Sidechain compression on Bass triggered by Kick with 10ms Attack and 80ms Release.`,
    detailedAdviceHe: `להשגת פאנץ' ובהירות מרבית בתדרים הנמוכים:
1. חלוקת תדרים: אם הקיק מכוון ל-55Hz, בצע Cut בס ב-45-50Hz.
2. בדיקת פאזה: בצע זום לגל הקול ב-Arrangement View של Ableton. ודא שגל הקיק עולה למעלה (+) כשתו הבס מתחיל.
3. אפקט Utility: שים Utility על שני הערוצים והפעל Bass Mono ב-120Hz.
4. קומפרסיה: הפעל Sidechain compression על הבס שמקבל טריגר מהקיק עם Attack של 10ms ו-Release של 80ms.`,
    translations: {
      es: {
        title: 'Alineación de fase y separación EQ entre Bombo y Bajo',
        summary: 'Gestión de la superposición de frecuencias subgraves entre el bombo y el sintetizador de bajo.',
        detailedAdvice: `Para obtener máxima pegada y claridad en los graves:
1. División de Frecuencias: Si el Bombo está afinado a 55Hz, filtra el bajo con paso alto por encima de 45-50Hz.
2. Comprobación de Fase: Haz zoom en los clips de audio en Arrangement View. Verifica que la onda del bombo coincida en fase con el bajo.
3. Plugin Utility: Usa Utility en ambas pistas y activa Bass Mono por debajo de 120Hz.
4. Compresión: Aplica compresión Sidechain en el bajo disparada por el bombo (Ataque 10ms, Release 80ms).`
      },
      pt: {
        title: 'Alinhamento de fase e separação de EQ entre Kick e Baixo',
        summary: 'Gerenciamento da sobreposição de frequências subgraves entre o kick e o sintetizador de baixo.',
        detailedAdvice: `Para máximo punch e clareza nos subgraves:
1. Divisão de Frequência: Se o Kick estiver afinado em 55Hz, corte o baixo abaixo de 45-50Hz.
2. Verificação de Fase: Dê zoom no áudio no Arrangement View para garantir que as formas de onda somem em fase positiva.
3. Plugin Utility: Utilize Utility em ambos os canais com Bass Mono abaixo de 120Hz.
4. Compressão: Aplique Sidechain no baixo com Attack de 10ms e Release de 80ms.`
      }
    },
    abletonDevices: ['Utility', 'Compressor', 'EQ Eight', 'Spectrum'],
  },
  {
    id: 'psytrance_lead_sound_design',
    category: 'sound_design',
    keywords: ['lead', 'synth', 'psytrance', 'wavetable', 'fm', 'arpeggiator', 'ליד', 'סינתזציה', 'סאונד', 'sintetizador'],
    titleEn: 'Psytrance FM & Wavetable Lead Design',
    titleHe: 'עיצוב ליד פסיטראנס בשיטת FM ו-Wavetable',
    summaryEn: 'Designing resonant, sharp Psytrance leads with Ableton Wavetable and Operator.',
    summaryHe: 'בניית ליד חד ומהדהד לפסיטראנס בעזרת Wavetable ו-Operator.',
    detailedAdviceEn: `Creating dynamic Psytrance synth leads:
1. Synth Choice: Load Ableton Wavetable or Operator.
2. Modulation: Modulate Filter Cutoff with LFO or Envelope.
3. Effects Chain: Insert Delay (1/8D or 1/16th) + Reverb (Decay 1.8s, High Cut 4kHz) + Saturator (Drive 2-3dB).
4. MIDI Technique: Use Arpeggiator plugin at 1/16 rate with Gate set to 60-70%.`,
    detailedAdviceHe: `יצירת ליד פסיטראנס דינמי:
1. בחירת סינתיסייזר: טען את Wavetable או Operator ב-Ableton.
2. מודולציה: חבר LFO או Envelope ל-Filter Cutoff.
3. שרשרת אפקטים: Delay (מקצב 1/8D) + Reverb (זמן דעיכה 1.8 שניות) + Saturator (דרייב 2-3dB).
4. תבנית MIDI: השתמש באפקט Arpeggiator במקצב 1/16 עם Gate של 60-70%.`,
    translations: {
      es: {
        title: 'Diseño de Leads Psytrance con Wavetable y FM',
        summary: 'Creación de leads resonantes y afilados usando Wavetable y Operator en Ableton.',
        detailedAdvice: `Para crear leads de sintetizador dinámicos para Psytrance:
1. Elección de sintetizador: Carga Wavetable u Operator en Ableton Live 12.
2. Modulación: Modula el Filter Cutoff con un LFO o envolvente.
3. Cadena de efectos: Inserta Delay (1/8D o 1/16) + Reverb (Decay 1.8s) + Saturator (Drive 2-3dB).
4. Técnica MIDI: Usa el plugin Arpeggiator a velocidad de 1/16 con Gate en 60-70%.`
      }
    },
    abletonDevices: ['Wavetable', 'Operator', 'Delay', 'Reverb', 'Arpeggiator', 'Saturator'],
  },
  {
    id: 'arrangement_structure_145bpm',
    category: 'psytrance',
    keywords: ['arrangement', 'structure', 'breakdown', 'drop', 'build', 'מבנה', 'ארנג׳מנט', 'דרופ', 'בנייה', 'estructura', 'arreglo'],
    titleEn: '145 BPM Psytrance Track Arrangement',
    titleHe: 'מבנה ארנג׳מנט לקטע פסיטראנס ב-145 BPM',
    summaryEn: 'Standard 16-bar block arrangements for Full-On & Progressive Psytrance.',
    summaryHe: 'חלוקה למבנים של 16 תיבות (Bars) בפסיטראנס.',
    detailedAdviceEn: `Standard Psytrance arrangement blocks:
- Intro (16-32 Bars): Atmosphere, Kick/Bass entrance, minimal percussion.
- Verse / Drive (32 Bars): Full Kick + Bass + Closed Hi-hats + Snare on 2 & 4.
- Breakdown (16-32 Bars): Remove Kick & Bass. Introduce pad, lead melody, vocals.
- Build-Up (16 Bars): Pitch bend sweeps, snare roll acceleration (1/8 -> 1/16 -> 1/32).
- Main Drop (32-64 Bars): Full energy, primary lead melody, FM glitches, rolling bassline.`,
    detailedAdviceHe: `חלוקת ארנג׳מנט סטנדרטית לפסיטראנס:
- אינטרו (16-32 תיבות): אווירה, כניסה הדרגתית של קיק ובס, פרקשן מינימלי.
- וורס / דרייב (32 תיבות): קיק + בס מלא + היי-האט פתוח/סגור + סנייר ב-2 ו-4.
- ברייקדאון (16-32 תיבות): הוצאת הקיק והבס. כניסת פאד, מלודיה ווקאל.
- בילד-אפ (16 תיבות): עליית תדרים (Sweeps), עליית קצב של הסנייר (1/8 -> 1/16 -> 1/32).
- דרופ ראשי (32-64 תיבות): אנרגיה בשיא, מלודית ליד ראשית, אלמנטים של FM, ובס רולינג.`,
    translations: {
      es: {
        title: 'Estructura de arreglo para tema Psytrance a 145 BPM',
        summary: 'Estructuras estándar en bloques de 16 compases para Full-On y Progressive Psytrance.',
        detailedAdvice: `Bloques estándar de arreglo para Psytrance:
- Intro (16-32 compases): Atmósfera, entrada gradual de Bombo y Bajo, percusión mínima.
- Verse / Drive (32 compases): Bombo + Bajo completos + Charles cerrados + Caja en 2 y 4.
- Breakdown (16-32 compases): Quitar Bombo y Bajo. Introducir pads, melodías lead y vocales.
- Build-Up (16 compases): Barridos de tono, aceleración de redoble de caja (1/8 -> 1/16 -> 1/32).
- Drop Principal (32-64 compases): Máxima energía, melodía lead principal, efectos FM y bajo rolling.`
      }
    },
    abletonDevices: ['Locators', 'Arranger', 'Auto Filter'],
  },
];

export function getLocalizedTopic(topic: KnowledgeTopic, lang: string): { title: string; summary: string; detailedAdvice: string } {
  if (lang === 'he') {
    return {
      title: topic.titleHe,
      summary: topic.summaryHe,
      detailedAdvice: topic.detailedAdviceHe,
    };
  }

  if (topic.translations && topic.translations[lang]) {
    return topic.translations[lang];
  }

  // If specific translation not available, fall back to English
  return {
    title: topic.titleEn,
    summary: topic.summaryEn,
    detailedAdvice: topic.detailedAdviceEn,
  };
}

export function queryKnowledgeBase(query: string, genre?: string): KnowledgeTopic | null {
  const q = query.toLowerCase();
  for (const topic of MUSIC_KNOWLEDGE_BASE) {
    if (topic.keywords.some((kw) => q.includes(kw.toLowerCase()))) {
      return topic;
    }
  }
  // Default to rolling bass if genre is psytrance
  if (genre?.toLowerCase().includes('psy')) {
    return MUSIC_KNOWLEDGE_BASE[0];
  }
  return MUSIC_KNOWLEDGE_BASE[0];
}

