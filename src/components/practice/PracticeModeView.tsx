import React from 'react';
import {
  Award,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Play
} from 'lucide-react';
import { PracticeExercise, AAMCProject } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface PracticeModeViewProps {
  project: AAMCProject;
  onOpenCoach: () => void;
}

export const PracticeModeView: React.FC<PracticeModeViewProps> = ({
  project,
  onOpenCoach,
}) => {
  const { t, language } = useLanguage();
  const isHe = language === 'he';
  const translate = React.useCallback((key: string) => (t ? t(key) : key), [t]);

  const exercises: PracticeExercise[] = isHe ? [
    {
      id: 'ex_1',
      title: 'אתגר 1: באס פסיכודלי מתגלגל (16th-Note) במפתח F#',
      genre: 'Psytrance',
      difficulty: 'מתחיל',
      goalDescription: 'סנתז באס מתגלגל פאנצ\'י באמצעות Ableton Operator עם attack של 0ms, decay של 165ms, ומסנן LP של 24dB.',
      abletonSetupInstructions: '1. טען Operator ברצועה 2.\n2. צייר תווי F#1 בעמדות גריד 16: 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15, 16.\n3. הוסף Utility עבור מונו לבאס ב-120Hz.',
      targetMetricsOrNotes: 'הקצה הנמוך חייב להישאר הדוק מבלי לחפוף לטרנזיינט הקיק.',
      hints: ['הגדר Filter Env Amount ל-+24 ב-Operator.', 'High-pass ב-30Hz באמצעות EQ Eight.'],
    },
    {
      id: 'ex_2',
      title: 'אתגר 2: יצירת סאב רמבל (Sub Rumble) לטכנו',
      genre: 'Techno',
      difficulty: 'בינוני',
      goalDescription: 'צור רמבל מחסן באמצעות דיליי מקבילי לקיק, Saturator (דרייב +4dB), ו-Auto Filter (LPF ב-160Hz).',
      abletonSetupInstructions: '1. קבץ קיק לתוך Audio Effect Rack.\n2. צור ערוץ "Rumble" עם Delay (1/16) -> Saturator -> Auto Filter.\n3. בצע Sidechain לרמבל מהקיק הראשי.',
      targetMetricsOrNotes: 'הרמבל חייב לרדת כאשר הקיק מכה.',
      hints: ['אפשר Soft Clip ב-Saturator.', 'חתוך גבוה מעל 160Hz בערוץ הרמבל.'],
    },
  ] : [
    {
      id: 'ex_1',
      title: 'Challenge 1: 16th-Note Rolling Psy Bass in F#',
      genre: 'Psytrance',
      difficulty: 'Beginner',
      goalDescription: 'Synthesize a punchy rolling bassline using Ableton Operator with 0ms attack, 165ms decay, and a 24dB LP filter.',
      abletonSetupInstructions: '1. Load Operator on Track 2.\n2. Draw F#1 notes on 16th grid positions 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15, 16.\n3. Add Utility for Bass Mono at 120Hz.',
      targetMetricsOrNotes: 'Low end must remain tight without overlapping kick transient.',
      hints: ['Set Filter Env Amount to +24 in Operator.', 'High-pass at 30Hz using EQ Eight.'],
    },
    {
      id: 'ex_2',
      title: 'Challenge 2: Techno Sub Rumble Creation',
      genre: 'Techno',
      difficulty: 'Intermediate',
      goalDescription: 'Create a warehouse sub rumble using Kick parallel delay, Saturator (+4dB drive), and Auto Filter (LPF at 160Hz).',
      abletonSetupInstructions: '1. Group Kick into Audio Effect Rack.\n2. Create "Rumble" chain with Delay (1/16) -> Saturator -> Auto Filter.\n3. Sidechain rumble from main kick.',
      targetMetricsOrNotes: 'Rumble must duck when kick strikes.',
      hints: ['Enable Soft Clip on Saturator.', 'Cut highs above 160Hz on rumble channel.'],
    },
  ];

  const [completed, setCompleted] = React.useState<Record<string, boolean>>({});

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-[#E0E0E0] font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A1A1A] border border-[#333] p-5 rounded-lg">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#90FF00] uppercase tracking-widest font-mono">
            <Award className="w-3.5 h-3.5" />
            <span>{translate('practice.banner')}</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">{translate('practice.title')}</h1>
          <p className="text-xs text-[#888] mt-0.5">
            {translate('practice.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((ex) => {
          const isDone = completed[ex.id];
          return (
            <div key={ex.id} className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#00E5FF] bg-[#121212] border border-[#333] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    {ex.genre} • {ex.difficulty}
                  </span>
                  {isDone && (
                    <span className="text-[10px] font-mono text-[#90FF00] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{translate('practice.completed')}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white">{ex.title}</h3>
                <p className="text-xs text-[#CCC] leading-relaxed">{ex.goalDescription}</p>

                <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] space-y-1.5">
                  <div className="text-[10px] font-bold text-[#666] uppercase font-mono tracking-wider">
                    {translate('practice.setupGuide')}
                  </div>
                  <p className="text-xs text-[#BBB] font-mono whitespace-pre-line leading-relaxed">
                    {ex.abletonSetupInstructions}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#2A2A2A] flex items-center justify-between">
                <button
                  onClick={onOpenCoach}
                  className="text-xs text-[#90FF00] hover:underline font-semibold cursor-pointer"
                >
                  {translate('practice.getAiHints')}
                </button>

                <button
                  onClick={() => setCompleted({ ...completed, [ex.id]: !isDone })}
                  className={`px-3.5 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer border ${
                    isDone
                      ? 'bg-[#121212] text-[#90FF00] border-[#333]'
                      : 'bg-[#90FF00] hover:bg-[#80e600] text-black border-[#90FF00]'
                  }`}
                >
                  {isDone ? `✓ ${translate('practice.completed')}` : translate('practice.markComplete')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
