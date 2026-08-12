import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { audioService } from '../../services/audioService';
import { Sparkles, CheckCircle2, Play, ChevronRight, ChevronLeft, Volume2, Layers, Award } from 'lucide-react';

export const BuildMyFirstTrackWizard: React.FC = () => {
  const { isRtl } = useLanguage();
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  const stages = [
    { id: 1, title: 'Project Setup', titleHe: 'הגדרת פרויקט וטמפו', desc: 'Set BPM to 145, Key to F# Minor in Ableton Live 12.', descHe: 'הגדר 145 BPM, סולם F# Minor ב-Ableton Live 12.' },
    { id: 2, title: 'Kick Drum', titleHe: 'בניית ה-Kick', desc: 'Synthesize punchy kick with Operator or Operator preset.', descHe: 'סנטז Kick עוצמתי ב-Operator או טען פריסט תוף.' },
    { id: 3, title: 'Rolling Bass', titleHe: 'תכנון Rolling Bass', desc: 'Synthesize K B B B saw bassline with 160ms decay.', descHe: 'צור באס מתגלגל K B B B עם decay של 160ms.' },
    { id: 4, title: 'Offbeat Hi-Hats', titleHe: 'היי-האטס קצביים', desc: 'Add 16th open hi-hat on offbeats with high-pass 7kHz.', descHe: 'הוסף היי-האט פתוח בתווי ה-16 עם פילטר 7kHz.' },
    { id: 5, title: 'Tribal Percussion', titleHe: 'פרקשן שבטי פסיכדלי', desc: 'Layer syncopated rimshots and closed hats.', descHe: 'הוסף פרקשן פוליריתמי ומקצבים נלווים.' },
    { id: 6, title: 'Psytrance Lead', titleHe: 'סינתזת ליד מוביל', desc: 'Create acid lead with Drift or Wavetable.', descHe: 'עצב ליד אסידי בעזרת Drift או Wavetable.' },
    { id: 7, title: 'Atmospheric FX', titleHe: 'אפקטים ואווירה (Zaps/Pads)', desc: 'Add FM zaps, reverse cymbals, and pad drones.', descHe: 'הוסף אפקטים פסיכדליים, זאפים ופדים.' },
    { id: 8, title: 'Breakdown Section', titleHe: 'בניית הברייקדאון (Breakdown)', desc: 'Filter out sub bass, introduce atmospheric pads.', descHe: 'חתוך את הבאס, הכנס פדים ואווירות.' },
    { id: 9, title: 'Tension Build-up', titleHe: 'עניית מתח (Build-up)', desc: 'Pitch snare roll, filter cutoff automation.', descHe: 'רול סנר בעל פיץ\' עולה ואוטומציית פילטר.' },
    { id: 10, title: 'The Main Drop', titleHe: 'הדרופ הראשי (Drop)', desc: 'Re-entry of full kick, rolling bass, and main lead.', descHe: 'חזרת ה-Kick והבאס במלוא העוצמה עם הליד.' },
    { id: 11, title: 'Arrangement Map', titleHe: 'מבנה השיר השלם (128-Bar Map)', desc: 'Extend track to 128 bars with intro, 2 drops, outro.', descHe: 'פרוס את השיר ל-128 תיבות עם אינטרו ואאוטרו.' },
    { id: 12, title: 'Mixing & EQ', titleHe: 'מיקס ואיזון תדרים', desc: 'Set Utility Bass Mono at 120Hz, sidechain kick & bass.', descHe: 'הגדר Utility Bass Mono ב-120Hz וסיידצ\'יין.' },
    { id: 13, title: 'Mastering & Export', titleHe: 'מאסטרינג וייצוא WAV', desc: 'Apply Limiter, measure -7 LUFS, export 24-bit WAV.', descHe: 'הפעל Limiter, מדוד -7 LUFS וייצא WAV.' },
  ];

  const stageObj = stages.find((s) => s.id === currentStage) || stages[0];

  const handleToggleDone = () => {
    if (completedStages.includes(currentStage)) {
      setCompletedStages(completedStages.filter((i) => i !== currentStage));
    } else {
      setCompletedStages([...completedStages, currentStage]);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#14141d] via-[#1a1a27] to-[#12121c] border border-[#232336] shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#90FF00]/20 to-[#00E5FF]/20 border border-[#90FF00]/40 flex items-center justify-center text-[#90FF00]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{isRtl ? 'בניית הטראק הראשון שלי' : 'Build My First Track'}</span>
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isRtl
                ? 'זרימת עבודה מודרכת בת 13 שלבים מהגדרת הפרויקט ועד למאסטרינג'
                : 'Guided 13-stage workflow from project setup to final master'}
            </p>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-xs text-gray-400 block">{isRtl ? 'התקדמות השלב' : 'Progress'}</span>
          <span className="text-lg font-bold text-[#90FF00]">
            {completedStages.length} / {stages.length} {isRtl ? 'שלבים' : 'Completed'}
          </span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stages Timeline Sidebar */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 bg-[#12121a] border border-[#222232] rounded-2xl p-4">
          {stages.map((s) => {
            const isCompleted = completedStages.includes(s.id);
            const isCurrent = currentStage === s.id;

            return (
              <button
                key={s.id}
                onClick={() => setCurrentStage(s.id)}
                className={`w-full p-3 rounded-xl border text-right transition flex items-center justify-between ${
                  isCurrent
                    ? 'bg-[#90FF00]/10 border-[#90FF00] text-white shadow-md shadow-[#90FF00]/10'
                    : isCompleted
                    ? 'bg-[#151520] border-[#222230] text-gray-300'
                    : 'bg-[#12121a] border-[#1e1e2c] text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                      isCompleted
                        ? 'bg-[#90FF00] text-black'
                        : isCurrent
                        ? 'bg-[#00E5FF] text-black'
                        : 'bg-[#1f1f2e] text-gray-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                  </div>
                  <span className="font-bold text-xs">{isRtl ? s.titleHe : s.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Stage Detail Workspace */}
        <div className="lg:col-span-2 bg-[#12121a] border border-[#222232] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#222232]">
            <div>
              <span className="text-xs font-mono font-bold text-[#90FF00] bg-[#90FF00]/10 border border-[#90FF00]/30 px-2.5 py-1 rounded-lg">
                STAGE {stageObj.id} OF 13
              </span>
              <h2 className="text-2xl font-bold text-white mt-2">{isRtl ? stageObj.titleHe : stageObj.title}</h2>
            </div>

            <button
              onClick={() => audioService.playABExample('kick_eq', 'after')}
              className="px-3 py-2 rounded-xl bg-[#1c2438] border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold transition flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isRtl ? 'השמע דוגמה' : 'Listen Demo'}</span>
            </button>
          </div>

          <div className="p-5 rounded-xl bg-[#181824] border border-[#262638] text-sm text-gray-200 leading-relaxed">
            {isRtl ? stageObj.descHe : stageObj.desc}
          </div>

          {/* Action Check */}
          <div className="pt-4 border-t border-[#222232] flex items-center justify-between">
            <button
              onClick={handleToggleDone}
              className={`px-5 py-3 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                completedStages.includes(currentStage)
                  ? 'bg-[#90FF00]/20 border border-[#90FF00] text-[#90FF00]'
                  : 'bg-[#181824] border border-[#2a2a3c] text-gray-300 hover:border-gray-500'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isRtl ? 'השלמתי שלב זה ב-Ableton (✓ Done)' : 'Mark Stage as Complete'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStage(Math.max(1, currentStage - 1))}
                disabled={currentStage === 1}
                className="px-4 py-2.5 rounded-xl bg-[#181824] border border-[#2a2a3c] text-xs font-bold disabled:opacity-40"
              >
                {isRtl ? 'הקודם' : 'Previous'}
              </button>
              <button
                onClick={() => setCurrentStage(Math.min(13, currentStage + 1))}
                disabled={currentStage === 13}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#90FF00] to-[#00E5FF] text-black text-xs font-bold"
              >
                {isRtl ? 'הבא' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
