import React from 'react';
import {
  Layers,
  Sparkles,
  Play,
  Sliders,
  ChevronRight,
  Info
} from 'lucide-react';
import { AAMCProject, ArrangementSection } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ArrangementGuideViewProps {
  project: AAMCProject;
}

export const ArrangementGuideView: React.FC<ArrangementGuideViewProps> = ({ project }) => {
  const { t, language } = useLanguage();
  const isHe = language === 'he';
  const translate = React.useCallback((key: string) => (t ? t(key) : key), [t]);

  const [selectedSection, setSelectedSection] = React.useState<ArrangementSection | null>(null);

  // Preset 128-bar arrangement sections for Psytrance / Techno
  const sections: ArrangementSection[] = isHe ? [
    {
      id: 'sec_1',
      name: '1. מבוא אטמוספרי',
      startBar: 1,
      lengthBars: 16,
      colorHex: '#3b82f6',
      energyLevel: 3,
      elementsActive: ['פאד אטמוספרי', 'אפקט מצלתיים הפוכים', 'קיק ממוסנן'],
      abletonInstructions: 'הכנס בהדרגה פאד עם Auto Filter. הוסף מצלתיים הפוכים כל 8 תיבות לציון מבנה של 16 תיבות.',
    },
    {
      id: 'sec_2',
      name: '2. כניסת קיק ובאס',
      startBar: 17,
      lengthBars: 16,
      colorHex: '#f59e0b',
      energyLevel: 7,
      elementsActive: ['קיק (C1)', 'באס מתגלגל (F#1)', 'היי-האט סגור'],
      abletonInstructions: 'בטל Mute לקיק הראשי ולבאס המתגלגל. הוסף היי-האט סגור באופביט.',
    },
    {
      id: 'sec_3',
      name: '3. כלי הקשה וסטאבים',
      startBar: 33,
      lengthBars: 16,
      colorHex: '#06b6d4',
      energyLevel: 8,
      elementsActive: ['קיק', 'באס', 'היי-האט סגור', 'היי-האט פתוח', 'כלי הקשה בסגנון גואה', 'FM Zap'],
      abletonInstructions: 'הכנס כלי הקשה של גואה וצלילי FM Zap מזדמנים (אחד כל 4 תיבות) לבניית מומנטום קצבי.',
    },
    {
      id: 'sec_4',
      name: '4. טיס חומצי (Acid Lead) ובנייה',
      startBar: 49,
      lengthBars: 16,
      colorHex: '#a855f7',
      energyLevel: 8.5,
      elementsActive: ['קיק', 'באס', 'תופים מלאים', 'סינת\' Acid (מסונן)'],
      abletonInstructions: 'הכנס Wavetable Acid Lead עם LP Filter ממוכן מ-300Hz עד 2kHz.',
    },
    {
      id: 'sec_5',
      name: '5. ברייקדאון ראשי (Main Breakdown)',
      startBar: 65,
      lengthBars: 16,
      colorHex: '#ec4899',
      energyLevel: 5,
      elementsActive: ['סינת\' Acid (ללא סינון)', 'אטמוספירה', 'רול סנייר FX'],
      abletonInstructions: 'חתוך את הקיק והבאס לחלוטין! תן לסינת\' ה-Acid לנוע בחופשיות. בנה רול סנייר ב-4 התיבות האחרונות.',
    },
    {
      id: 'sec_6',
      name: '6. דרופ שיא (PEAK DROP)',
      startBar: 81,
      lengthBars: 32,
      colorHex: '#ef4444',
      energyLevel: 10,
      elementsActive: ['קיק ובאס מלאים', 'תופים מלאים', 'Acid Lead מלא', 'מצילת Crash'],
      abletonInstructions: 'הכנס בבת אחת קיק, באס מתגלגל וליד בתיבה 81. מקטע אנרגיית השיא של הטראק!',
    },
    {
      id: 'sec_7',
      name: '7. אאוטרו ומיקס אאוט',
      startBar: 113,
      lengthBars: 16,
      colorHex: '#64748b',
      energyLevel: 4,
      elementsActive: ['קיק', 'באס', 'היי-האט ממוסנן'],
      abletonInstructions: 'הסר ליד ואפקטים. סנן את הגבוהים של הבאס כדי שהדיג\'יי יוכל לעבור לטראק הבא.',
    },
  ] : [
    {
      id: 'sec_1',
      name: '1. Atmospheric Intro',
      startBar: 1,
      lengthBars: 16,
      colorHex: '#3b82f6',
      energyLevel: 3,
      elementsActive: ['Atmospheric Pad', 'Reverse Cymbal FX', 'Filtered Kick'],
      abletonInstructions: 'Fade in pad with Auto Filter. Place reverse cymbals every 8 bars to mark 16-bar phrasing.',
    },
    {
      id: 'sec_2',
      name: '2. Kick & Bass Entrance',
      startBar: 17,
      lengthBars: 16,
      colorHex: '#f59e0b',
      energyLevel: 7,
      elementsActive: ['Kick (C1)', 'Rolling Bass (F#1)', 'Closed Hi-Hat'],
      abletonInstructions: 'Unmute main Kick and Rolling Bass. Add closed hi-hat on offbeats (beats 1.2, 1.4, 2.2, 2.4).',
    },
    {
      id: 'sec_3',
      name: '3. Percussion & Perc Stabs',
      startBar: 33,
      lengthBars: 16,
      colorHex: '#06b6d4',
      energyLevel: 8,
      elementsActive: ['Kick', 'Bass', 'Closed Hat', 'Open Hat', 'Goa Percs', 'FM Zap'],
      abletonInstructions: 'Introduce Goa Percs and occasional FM Zaps (1 per 4 bars) to build rhythmic momentum.',
    },
    {
      id: 'sec_4',
      name: '4. Lead Acid Tease & Build',
      startBar: 49,
      lengthBars: 16,
      colorHex: '#a855f7',
      energyLevel: 8.5,
      elementsActive: ['Kick', 'Bass', 'Full Drums', 'Acid Lead (Filtered)'],
      abletonInstructions: 'Introduce Wavetable Acid Lead with LP Filter automated from 300Hz up to 2kHz.',
    },
    {
      id: 'sec_5',
      name: '5. Main Breakdown',
      startBar: 65,
      lengthBars: 16,
      colorHex: '#ec4899',
      energyLevel: 5,
      elementsActive: ['Acid Lead (Unfiltered)', 'Atmosphere', 'FX Snare Roll'],
      abletonInstructions: 'Cut Kick and Bass completely! Let the Acid synth sweep freely. Build snare roll in last 4 bars.',
    },
    {
      id: 'sec_6',
      name: '6. PEAK DROP',
      startBar: 81,
      lengthBars: 32,
      colorHex: '#ef4444',
      energyLevel: 10,
      elementsActive: ['FULL KICK & BASS', 'Full Drums', 'Full Acid Lead', 'Crash Cymbal'],
      abletonInstructions: 'SLAM Kick, Rolling Bass, and Lead simultaneously at Bar 81. Maximum energy section of the track!',
    },
    {
      id: 'sec_7',
      name: '7. Outro & Mix Out',
      startBar: 113,
      lengthBars: 16,
      colorHex: '#64748b',
      energyLevel: 4,
      elementsActive: ['Kick', 'Bass', 'Filtered Hat'],
      abletonInstructions: 'Remove Lead and FX. Filter out bass highs so DJ can transition to next track.',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-[#E0E0E0] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A1A1A] border border-[#333] p-5 rounded-lg">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>{translate('arrangement.banner')}</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            {translate('arrangement.title').replace('{genre}', project.genre)}
          </h1>
          <p className="text-xs text-[#888] mt-0.5">
            {translate('arrangement.subtitle')}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-[#90FF00] bg-[#121212] border border-[#333] px-3 py-1 rounded font-bold uppercase tracking-wider">
            {translate('arrangement.barsInfo').replace('{bpm}', String(project.bpm))}
          </span>
        </div>
      </div>

      {/* Visual Timeline Section */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-5">
        <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-widest font-mono">
          {translate('arrangement.timelineMap')}
        </h3>

        {/* Bar Numbers Header */}
        <div className="flex text-[10px] text-[#666] font-mono justify-between px-1 border-b border-[#2A2A2A] pb-2">
          <span>Bar 1</span>
          <span>Bar 33</span>
          <span>Bar 65 (Breakdown)</span>
          <span>Bar 81 (Peak Drop)</span>
          <span>Bar 113</span>
          <span>Bar 128</span>
        </div>

        {/* Timeline Blocks */}
        <div className="flex w-full gap-1.5 h-20 bg-[#121212] p-2 rounded border border-[#2A2A2A] overflow-x-auto">
          {sections.map((sec) => {
            const flexWidth = sec.lengthBars;
            const isSelected = selectedSection?.id === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec)}
                style={{ flex: flexWidth }}
                className={`h-full rounded p-2 text-left flex flex-col justify-between transition-colors cursor-pointer relative overflow-hidden border ${
                  isSelected
                    ? 'border-[#90FF00] bg-[#252525]'
                    : 'border-[#2A2A2A] bg-[#181818] hover:border-[#444]'
                }`}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ backgroundColor: sec.colorHex }}
                />
                <div className="relative z-10 text-xs font-bold text-white truncate">
                  {sec.name}
                </div>
                <div className="relative z-10 text-[9px] font-mono text-[#AAA]">
                  Bars {sec.startBar}-{sec.startBar + sec.lengthBars - 1} ({sec.lengthBars}b)
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail Box for Selected Section */}
        {selectedSection ? (
          <div className="bg-[#121212] p-4 rounded border border-[#2A2A2A] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
              <h4 className="text-xs font-bold text-[#90FF00] font-mono">{selectedSection.name}</h4>
              <span className="text-[10px] font-mono text-[#888]">
                Bars {selectedSection.startBar} to {selectedSection.startBar + selectedSection.lengthBars - 1}
              </span>
            </div>

            <p className="text-xs text-[#CCC] font-mono leading-relaxed">
              {selectedSection.abletonInstructions}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-[#666] self-center uppercase font-mono">{translate('arrangement.activeElements')}</span>
              {selectedSection.elementsActive.map((el, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono bg-[#181818] border border-[#2A2A2A] text-[#00E5FF] px-2 py-0.5 rounded"
                >
                  ✓ {el}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] text-xs text-[#888] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#00E5FF] shrink-0" />
            <span>{translate('arrangement.hint')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
