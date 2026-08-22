import React, { useState } from 'react';
import {
  AbletonLessonDefinition,
  AbletonLessonStep,
  SimulatorLearningMode,
  SimulatorValidationResult,
} from '../../types/abletonSimulator';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Eye,
  RotateCcw,
  Award,
  Trophy,
} from 'lucide-react';

interface AbletonLessonPanelProps {
  lesson: AbletonLessonDefinition;
  currentStepIndex: number;
  learningMode: SimulatorLearningMode;
  validationResult: SimulatorValidationResult | null;
  score: number;
  mistakesCount: number;
  hintsUsedCount: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onShowMe: () => void;
  onUseHint: () => void;
  onChangeMode: (mode: SimulatorLearningMode) => void;
  onAskAiCoach?: (prompt: string) => void;
  lang?: string;
  isRTL?: boolean;
}

export const AbletonLessonPanel: React.FC<AbletonLessonPanelProps> = ({
  lesson,
  currentStepIndex,
  learningMode,
  validationResult,
  score,
  mistakesCount,
  hintsUsedCount,
  onNextStep,
  onPrevStep,
  onShowMe,
  onUseHint,
  onChangeMode,
  onAskAiCoach,
  lang = 'he',
  isRTL = false,
}) => {
  const [showHintText, setShowHintText] = useState(false);
  const totalSteps = lesson.steps.length;
  const step: AbletonLessonStep = lesson.steps[currentStepIndex] || lesson.steps[0];

  const getText = (textObj?: any) => {
    if (!textObj) return '';
    return textObj[lang] || textObj.he || textObj.en || '';
  };

  const isLastStep = currentStepIndex >= totalSteps - 1;

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-[#181818] border border-[#2E2E2E] rounded-lg p-3 text-gray-200 font-sans shadow-xl flex flex-col gap-2.5 max-w-xl select-none"
    >
      {/* Header row */}
      <div className="flex items-center justify-between border-b border-[#282828] pb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFE853]" />
          <span className="font-bold text-[#FFE853] font-mono uppercase tracking-wider text-[11px]">
            ABLETON LIVE 12 TRAINING
          </span>
        </div>

        {/* Learning Mode Switcher (Guided / Practice / Exam) */}
        <div className="flex items-center gap-1 bg-[#121212] p-0.5 rounded border border-[#2B2B2B] text-[10px] font-mono">
          <button
            onClick={() => onChangeMode('guided')}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              learningMode === 'guided'
                ? 'bg-[#FFE853] text-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {lang === 'he' ? 'מודרך' : 'Guided'}
          </button>
          <button
            onClick={() => onChangeMode('practice')}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              learningMode === 'practice'
                ? 'bg-[#00E5FF] text-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {lang === 'he' ? 'תרגול' : 'Practice'}
          </button>
          <button
            onClick={() => onChangeMode('exam')}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              learningMode === 'exam'
                ? 'bg-[#FF0055] text-white font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {lang === 'he' ? 'מבחן' : 'Exam'}
          </button>
        </div>
      </div>

      {/* Step Counter & Lesson Title */}
      <div className="flex items-center justify-between text-xs">
        <div className="text-[#FFE853] font-bold font-mono">
          {lang === 'he'
            ? `שלב ${currentStepIndex + 1} מתוך ${totalSteps}`
            : `Step ${currentStepIndex + 1} of ${totalSteps}`}
        </div>
        <div className="text-gray-400 text-[11px] font-mono">
          {getText(lesson.title)}
        </div>
      </div>

      {/* Main Instruction Prompt */}
      <div className="bg-[#121212] p-2.5 rounded border border-[#262626] text-sm font-medium text-gray-100 leading-relaxed">
        {getText(step.instruction)}
      </div>

      {/* Validation Status Banner */}
      {validationResult && (
        <div
          className={`p-2 rounded text-xs flex items-center gap-2 border font-medium ${
            validationResult.pass
              ? 'bg-[#90FF00]/10 border-[#90FF00]/40 text-[#90FF00]'
              : 'bg-[#FF5555]/10 border-[#FF5555]/40 text-[#FF8888]'
          }`}
        >
          {validationResult.pass ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#90FF00]" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FF5555]" />
          )}
          <span>{getText(validationResult.message)}</span>
        </div>
      )}

      {/* Hint Text if revealed */}
      {showHintText && (
        <div className="bg-[#232014] border border-[#443818] text-amber-200 text-xs p-2 rounded flex items-start gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-[#FFE853] shrink-0 mt-0.5" />
          <span>{getText(step.hint)}</span>
        </div>
      )}

      {/* Action Buttons: [Show Me], [Hint], [Next Step], [Ask AI] */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#262626] text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              onShowMe();
            }}
            className="px-2.5 py-1 rounded bg-[#242424] hover:bg-[#323232] text-gray-300 text-[11px] flex items-center gap-1 cursor-pointer font-mono"
            title="Highlight exact control on screen"
          >
            <Eye className="w-3 h-3 text-[#FFE853]" />
            <span>{lang === 'he' ? 'הראה לי' : 'Show Me'}</span>
          </button>

          <button
            onClick={() => {
              setShowHintText((prev) => !prev);
              onUseHint();
            }}
            className="px-2.5 py-1 rounded bg-[#242424] hover:bg-[#323232] text-gray-300 text-[11px] flex items-center gap-1 cursor-pointer font-mono"
          >
            <HelpCircle className="w-3 h-3 text-cyan-400" />
            <span>{lang === 'he' ? 'רמז' : 'Hint'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {currentStepIndex > 0 && (
            <button
              onClick={onPrevStep}
              className="px-2 py-1 rounded bg-[#222] hover:bg-[#333] text-gray-300 text-[11px] cursor-pointer"
            >
              {lang === 'he' ? 'הקודם' : 'Back'}
            </button>
          )}

          <button
            onClick={onNextStep}
            className="px-3 py-1 rounded bg-[#FFE853] hover:bg-[#FFF080] text-black font-bold text-[11px] flex items-center gap-1 cursor-pointer font-mono"
          >
            <span>{isLastStep ? (lang === 'he' ? 'סיום שיעור ✓' : 'Complete ✓') : (lang === 'he' ? 'הבא' : 'Next')}</span>
            {!isLastStep && (isRTL ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />)}
          </button>
        </div>
      </div>

      {/* Stats bar (Score, Mistakes, Hints) in Exam / Practice mode */}
      <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono pt-1">
        <span>Score: <strong className="text-gray-300">{score} pts</strong></span>
        <span>Mistakes: <strong className="text-gray-300">{mistakesCount}</strong></span>
        <span>Hints: <strong className="text-gray-300">{hintsUsedCount}</strong></span>
      </div>
    </div>
  );
};
