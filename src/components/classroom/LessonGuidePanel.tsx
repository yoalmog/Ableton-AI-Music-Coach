import React, { useState } from 'react';
import { Lightbulb, HelpCircle, CheckCircle, ArrowRight, Bot, CheckSquare, Sparkles, AlertCircle } from 'lucide-react';
import { InteractiveLessonStep, LearningMode } from '../../types/classroom';
import { useLanguage } from '../../context/LanguageContext';

interface LessonGuidePanelProps {
  step: InteractiveLessonStep;
  currentStepIndex: number;
  totalSteps: number;
  mode: LearningMode;
  onNextStep: () => void;
  onOpenAiCoach: () => void;
  onHintUsed: () => void;
  onToggleMode: (mode: LearningMode) => void;
  isStepVerified?: boolean;
}

export const LessonGuidePanel: React.FC<LessonGuidePanelProps> = ({
  step,
  currentStepIndex,
  totalSteps,
  mode,
  onNextStep,
  onOpenAiCoach,
  onHintUsed,
  onToggleMode,
  isStepVerified = false
}) => {
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [checkedChecklist, setCheckedChecklist] = useState<Record<number, boolean>>({});
  const { language, isRTL } = useLanguage();

  const handleShowHint = () => {
    if (hintLevel < 3) {
      setHintLevel(prev => prev + 1);
      onHintUsed();
    }
  };

  const toggleChecklistItem = (idx: number) => {
    setCheckedChecklist(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-[#1A1A1A] border border-[#333] rounded-xl p-4 md:p-5 space-y-4 shadow-xl flex flex-col justify-between"
    >
      {/* Mode Switch Header */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
        <div className="flex items-center gap-1.5 bg-[#121212] p-1 rounded-lg border border-[#2B2B2B]">
          <button
            onClick={() => onToggleMode('simulator')}
            className={`px-3 py-1 rounded text-xs font-semibold transition ${
              mode === 'simulator'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-[#888] hover:text-white'
            }`}
          >
            {language === 'he' ? 'סימולטור (Simulator)' : 'Mode 1: Simulator'}
          </button>
          <button
            onClick={() => onToggleMode('real_ableton')}
            className={`px-3 py-1 rounded text-xs font-semibold transition ${
              mode === 'real_ableton'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-[#888] hover:text-white'
            }`}
          >
            {language === 'he' ? 'אבלטון אמיתי (Real Ableton)' : 'Mode 2: Real Ableton'}
          </button>
        </div>

        <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full">
          {language === 'he' ? 'שלב' : 'Step'} {currentStepIndex + 1} / {totalSteps}
        </span>
      </div>

      {/* Step Title & Instruction */}
      <div className="space-y-2">
        <h4 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          {language === 'he' ? step.titleHe : step.title}
        </h4>

        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs md:text-sm font-medium leading-relaxed">
          {language === 'he' ? step.instructionHe : step.instruction}
        </div>
      </div>

      {/* WHY Section */}
      <div className="p-3 bg-[#141414] border border-[#2A2A2A] rounded-xl text-xs space-y-1">
        <span className="text-[#888] font-bold block uppercase tracking-wider text-[10px]">
          {language === 'he' ? 'למה עושים את זה? (WHY)' : 'WHY THIS MATTERS'}
        </span>
        <p className="text-gray-300 leading-normal">
          {language === 'he' ? step.whyHe : step.why}
        </p>
      </div>

      {/* Mode 2: Real Ableton Checklist */}
      {mode === 'real_ableton' && (
        <div className="p-3.5 bg-[#141414] border border-[#2B2B2B] rounded-xl space-y-2">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4" />
            {language === 'he' ? 'ביצוע ב-Ableton Live 12 האמיתי:' : 'Try It in Real Ableton Live 12:'}
          </span>
          <div className="space-y-2">
            {(language === 'he' ? step.realAbletonChecklistHe : step.realAbletonChecklist).map((item, idx) => {
              const isChecked = !!checkedChecklist[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleChecklistItem(idx)}
                  className="flex items-center gap-2 cursor-pointer text-xs text-gray-200 hover:text-white"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                      isChecked ? 'bg-amber-500 border-amber-400 text-black' : 'border-[#444] bg-[#222]'
                    }`}
                  >
                    {isChecked && <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                  <span className={isChecked ? 'line-through text-[#888]' : ''}>{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tiered Hint System */}
      <div className="space-y-2">
        {hintLevel > 0 && (
          <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-cyan-200 space-y-1">
            <span className="font-bold block text-cyan-400 text-[10px] uppercase">
              {language === 'he' ? 'רמז 1:' : 'HINT 1:'}
            </span>
            <p>{language === 'he' ? step.hint1He : step.hint1}</p>
          </div>
        )}

        {hintLevel > 1 && (
          <div className="p-3 bg-cyan-950/60 border border-cyan-400/50 rounded-xl text-xs text-cyan-100 space-y-1">
            <span className="font-bold block text-cyan-300 text-[10px] uppercase">
              {language === 'he' ? 'רמז 2 (ממוקד):' : 'HINT 2 (DETAILED):'}
            </span>
            <p>{language === 'he' ? step.hint2He : step.hint2}</p>
          </div>
        )}

        {hintLevel > 2 && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-400/50 rounded-xl text-xs text-emerald-200 space-y-1">
            <span className="font-bold block text-emerald-300 text-[10px] uppercase">
              {language === 'he' ? 'התשובה המדויקת:' : 'EXACT ACTION:'}
            </span>
            <p>{language === 'he' ? step.answerHe : step.answer}</p>
          </div>
        )}
      </div>

      {/* Action Buttons Bar */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2A2A2A]">
        <button
          onClick={handleShowHint}
          disabled={hintLevel >= 3}
          className="py-2 px-3 bg-[#222] hover:bg-[#2D2D2D] text-gray-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          {hintLevel === 0
            ? (language === 'he' ? 'קבל רמז' : 'Get Hint')
            : hintLevel === 1
            ? (language === 'he' ? 'רמז נוסף' : 'More Hints')
            : (language === 'he' ? 'הצג תשובה' : 'Show Answer')}
        </button>

        <button
          onClick={onOpenAiCoach}
          className="py-2 px-3 bg-[#222] hover:bg-[#2D2D2D] text-cyan-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <Bot className="w-3.5 h-3.5" />
          {language === 'he' ? 'שאל מורה AI' : 'Ask AI Teacher'}
        </button>
      </div>

      {/* Proceed Step Button */}
      <button
        onClick={onNextStep}
        className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
      >
        <span>{language === 'he' ? 'ביצעתי! המשך לשלב הבא' : 'Step Completed! Next Step'}</span>
        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
      </button>
    </div>
  );
};
