import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson, LessonStep } from '../../types/lesson';
import { ExplanationLevel } from '../../types/learning';
import { useLanguage } from '../../context/LanguageContext';
import { AudioBeforeAfterPlayer } from './AudioBeforeAfterPlayer';
import { audioService } from '../../services/audioService';
import { CheckCircle2, ChevronRight, ChevronLeft, HelpCircle, Volume2, Sparkles, BookOpen, Layers } from 'lucide-react';

interface StepByStepGuidedModeProps {
  lesson: Lesson;
  onFinishLesson?: () => void;
  onBackToLibrary?: () => void;
}

export const StepByStepGuidedMode: React.FC<StepByStepGuidedModeProps> = ({
  lesson,
  onFinishLesson,
  onBackToLibrary,
}) => {
  const { isRtl } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedStepIndices, setCompletedStepIndices] = useState<number[]>([]);
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>('Producer');
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);

  const steps = lesson.content || [];
  const currentStep = steps[currentStepIndex] || steps[0];
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleToggleStepComplete = (idx: number) => {
    if (completedStepIndices.includes(idx)) {
      setCompletedStepIndices(completedStepIndices.filter((i) => i !== idx));
    } else {
      setCompletedStepIndices([...completedStepIndices, idx]);
    }
  };

  const handleNext = () => {
    if (!completedStepIndices.includes(currentStepIndex)) {
      setCompletedStepIndices([...completedStepIndices, currentStepIndex]);
    }
    if (isLastStep) {
      if (onFinishLesson) onFinishLesson();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handlePlayDemoAudio = () => {
    audioService.playABExample('kick_eq', 'after');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-[#222232]">
        <button
          onClick={onBackToLibrary}
          className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-[#181824] border border-[#2a2a3c] transition flex items-center gap-1.5"
        >
          {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span>{isRtl ? 'חזור לספרייה' : 'Back to Library'}</span>
        </button>

        {/* Explain Level Switcher */}
        <div className="flex items-center gap-1 bg-[#141420] border border-[#232336] p-1 rounded-xl">
          <span className="text-[11px] text-gray-400 px-2 font-semibold flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
            {isRtl ? 'רמת הסבר:' : 'Level:'}
          </span>
          {(['Simple', 'Beginner', 'Producer', 'Technical'] as ExplanationLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setExplanationLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                explanationLevel === lvl
                  ? 'bg-[#90FF00]/10 text-[#90FF00] border border-[#90FF00]/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>
            {isRtl ? 'שיעור מודרך:' : 'GUIDED LESSON:'} {isRtl && lesson.titleHe ? lesson.titleHe : lesson.title}
          </span>
          <span className="text-[#90FF00] font-bold">
            STEP {currentStepIndex + 1} OF {steps.length}
          </span>
        </div>
        <div className="h-2 w-full bg-[#1e1e2d] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#90FF00] to-[#00E5FF] transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Card */}
      <motion.div
        key={currentStepIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#12121a] border border-[#222232] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#222232]">
          <div>
            <span className="text-xs font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-2.5 py-1 rounded-lg">
              STEP {currentStepIndex + 1}
            </span>
            <h2 className="text-xl font-bold text-white mt-2">
              {currentStep ? (isRtl && currentStep.titleHe ? currentStep.titleHe : currentStep.title) : lesson.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowWhyModal(!showWhyModal)}
              className="px-3 py-2 rounded-xl bg-[#221c38] border border-[#8B5CF6]/40 text-[#A78BFA] hover:bg-[#2c2448] text-xs font-bold transition flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-[#A78BFA]" />
              <span>{isRtl ? 'למה? (WHY?)' : 'WHY?'}</span>
            </button>

            <button
              onClick={handlePlayDemoAudio}
              className="px-3 py-2 rounded-xl bg-[#1b263b] border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#223352] text-xs font-bold transition flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4 text-[#00E5FF]" />
              <span>{isRtl ? 'השמע דוגמה' : 'Listen'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Explanation Level Content */}
        <div className="space-y-4">
          <div className="bg-[#181824] border border-[#262638] p-5 rounded-xl text-sm leading-relaxed text-gray-200">
            {explanationLevel === 'Simple' && (
              <p className="text-xs text-[#90FF00]">
                💡 {isRtl ? 'הסבר פשוט:' : 'Simple Explanation:'}{' '}
                {isRtl
                  ? 'כוונן את הכפתור כדי לנקות צלילים נמוכים מדי שמעמיסים על הרמקולים.'
                  : 'Adjust this control to clean up muddy low-end frequencies.'}
              </p>
            )}

            {explanationLevel === 'Beginner' && (
              <p className="text-sm">
                {currentStep
                  ? isRtl && currentStep.instructionHe
                    ? currentStep.instructionHe
                    : currentStep.instruction
                  : lesson.objective}
              </p>
            )}

            {explanationLevel === 'Producer' && (
              <p className="text-sm font-medium leading-relaxed">
                {currentStep
                  ? isRtl && currentStep.instructionHe
                    ? currentStep.instructionHe
                    : currentStep.instruction
                  : lesson.objective}
              </p>
            )}

            {explanationLevel === 'Technical' && (
              <p className="text-xs font-mono text-[#00E5FF]">
                ⚙️ {isRtl ? 'עומק DSP וטכני:' : 'Technical DSP Depth:'}{' '}
                {isRtl
                  ? 'Biquad filter coefficient calculation with 24dB/octave slope magnitude attenuation.'
                  : 'Biquad filter coefficient calculation with 24dB/octave slope magnitude attenuation.'}
              </p>
            )}
          </div>

          {/* Ableton Parameters Highlighted */}
          {currentStep?.parameters && currentStep.parameters.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {isRtl ? 'פרמטרים מומלצים ב-Ableton Live 12' : 'Ableton Live 12 Parameters'}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {currentStep.parameters.map((p, idx) => (
                  <div key={idx} className="bg-[#181826] border border-[#28283d] p-3 rounded-xl">
                    <span className="text-[11px] text-gray-400 block">{p.paramName}</span>
                    <span className="text-sm font-mono font-bold text-[#90FF00]">{p.recommendedValue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Embedded A/B Audio Comparison */}
          <AudioBeforeAfterPlayer
            type="kick_eq"
            title={isRtl ? 'הדגמת A/B לשלב זה' : 'A/B Audio Comparison for this Step'}
          />
        </div>

        {/* WHY Modal Overlay */}
        <AnimatePresence>
          {showWhyModal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#1c182e] border border-[#8B5CF6]/40 p-5 rounded-xl space-y-2 text-sm text-gray-200"
            >
              <h4 className="font-bold text-[#A78BFA] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{isRtl ? 'למה הפעולה הזו חיונית במוזיקה?' : 'Why is this step musically essential?'}</span>
              </h4>
              <p className="text-xs leading-relaxed text-gray-300">
                {isRtl
                  ? 'תדרים נמוכים לא מעובדים חופפים את תדר היסוד של הבאס. חיתוך או כיוונון מדויק שומר על בהירות, מונע ביטול פאזה (Phase Cancellation) ומעניק לטראק עוצמה של מועדונים.'
                  : 'Unprocessed low frequencies overlap the bass fundamental. Surgical adjustment preserves clarity, prevents phase cancellation, and gives your track club-ready power.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation & Done Checkbox */}
        <div className="pt-6 border-t border-[#222232] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => handleToggleStepComplete(currentStepIndex)}
            className={`px-4 py-2.5 rounded-xl border font-bold text-xs transition flex items-center gap-2 ${
              completedStepIndices.includes(currentStepIndex)
                ? 'bg-[#90FF00]/20 border-[#90FF00] text-[#90FF00]'
                : 'bg-[#181824] border-[#2a2a3c] text-gray-300 hover:border-gray-500'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isRtl ? 'ביצעתי שלב זה ב-Ableton (✓ Done)' : 'I Did This in Ableton (Done)'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-4 py-2.5 rounded-xl bg-[#181824] border border-[#2a2a3c] text-gray-300 disabled:opacity-40 text-xs font-bold transition"
            >
              {isRtl ? 'הקודם' : 'Previous'}
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#90FF00] to-[#00E5FF] text-black font-bold text-xs hover:opacity-90 transition flex items-center gap-2"
            >
              <span>{isLastStep ? (isRtl ? 'סים שיעור' : 'Finish Lesson') : isRtl ? 'הבא' : 'Next'}</span>
              {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
