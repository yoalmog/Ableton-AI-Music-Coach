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
}

export const MUSIC_KNOWLEDGE_BASE: KnowledgeTopic[] = [
  {
    id: 'psytrance_rolling_bass',
    category: 'psytrance',
    keywords: ['bass', 'rolling', 'psytrance', 'kick', '145', 'sub', 'f minor', 'בס', 'רולינג', 'פסיטראנס'],
    titleEn: 'Rolling Psytrance Bassline (145 BPM)',
    titleHe: 'בס רולינג פסיטראנס (145 BPM)',
    summaryEn: 'Creating a tight 16th-note rolling bassline synchronized with the kick drum.',
    summaryHe: 'יצירת בס רולינג מתודק של 16-תים מסונכרן באופן מושלם עם הקיק.',
    detailedAdviceEn: `To build a authentic rolling Psytrance bassline at 145 BPM in F Minor:
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
    abletonDevices: ['Operator', 'Drift', 'Utility', 'EQ Eight', 'Auto Filter'],
  },
  {
    id: 'kick_bass_relationship',
    category: 'mixing',
    keywords: ['kick', 'bass', 'phase', 'sidechain', 'lufs', 'eq', 'קיק', 'בס', 'מיקס', 'פאזה'],
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
    abletonDevices: ['Utility', 'Compressor', 'EQ Eight', 'Spectrum'],
  },
  {
    id: 'psytrance_lead_sound_design',
    category: 'sound_design',
    keywords: ['lead', 'synth', 'psytrance', 'wavetable', 'fm', 'arpeggiator', 'ליד', 'סינתזציה', 'סאונד'],
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
    abletonDevices: ['Wavetable', 'Operator', 'Delay', 'Reverb', 'Arpeggiator', 'Saturator'],
  },
  {
    id: 'arrangement_structure_145bpm',
    category: 'psytrance',
    keywords: ['arrangement', 'structure', 'breakdown', 'drop', 'build', 'מבנה', 'ארנג׳מנט', 'דרופ', 'בנייה'],
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
    abletonDevices: ['Locators', 'Arranger', 'Auto Filter'],
  },
];

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
