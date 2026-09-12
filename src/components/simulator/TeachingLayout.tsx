import React, { useState } from 'react';
import {
  TutorialLesson,
  TutorialLessonStep,
  ReferenceImageItem,
  ReferenceHotspot,
} from '../../types/workspaceReference';
import {
  AbletonSimulatorState,
  SimulatorLearningMode,
  SimulatorValidationResult,
  SimulatorActionType,
} from '../../types/abletonSimulator';
import { WorkspaceReference } from './WorkspaceReference';
import { AbletonViewport } from './AbletonViewport';
import { AbletonActionValidatorFeedback } from './AbletonActionValidator';
import {
  Layout,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
  Split,
  Eye,
  Sliders,
  Award,
  Bot,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type TeachingLayoutMode = 'compare' | 'reference' | 'simulator';

interface TeachingLayoutProps {
  lesson: TutorialLesson;
  currentStepIndex: number;
  simulatorState: AbletonSimulatorState;
  validationResult: SimulatorValidationResult | null;
  score: number;
  mistakesCount: number;
  hintsUsedCount: number;
  learningMode: SimulatorLearningMode;
  onNextStep: () => void;
  onPrevStep: () => void;
  onRestartLesson: () => void;
  onUpdateSimulatorState: (patch: Partial<AbletonSimulatorState>) => void;
  onActionTrigger: (targetId: string, actionType: SimulatorActionType, payload?: any) => void;
  onRequestHint: () => void;
  onAskAiCoach?: () => void;
  lang?: string;
  isRTL?: boolean;
}

export const TeachingLayout: React.FC<TeachingLayoutProps> = ({
  lesson,
  currentStepIndex,
  simulatorState,
  validationResult,
  score,
  mistakesCount,
  hintsUsedCount,
  learningMode,
  onNextStep,
  onPrevStep,
  onRestartLesson,
  onUpdateSimulatorState,
  onActionTrigger,
  onRequestHint,
  onAskAiCoach,
  lang = 'he',
  isRTL = false,
}) => {
  const [layoutMode, setLayoutMode] = useState<TeachingLayoutMode>('compare');
  const [activeReferenceIndex, setActiveReferenceIndex] = useState<number>(0);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);

  const isHe = lang === 'he';
  const steps = lesson.steps;
  const currentStep = steps[currentStepIndex] || steps[0];
  const isLastStep = currentStepIndex >= steps.length - 1;

  // Active reference image for current step
  const referenceImages = lesson.referenceImages || [];
  const currentReferenceImage: ReferenceImageItem =
    referenceImages.find((r) => r.id === currentStep.referenceImageId) ||
    referenceImages[activeReferenceIndex] ||
    referenceImages[0];

  // Determine active hotspot
  const activeHotspot = currentReferenceImage?.hotspots.find(
    (h) => h.id === currentStep.activeHotspotId
  );

  const handleSelectHotspot = (hotspot: ReferenceHotspot) => {
    // If hotspot has a mapped simulator target, trigger feedback or highlight
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full h-full flex flex-col bg-[#0F0F0F] text-[#E0E0E0] select-none font-sans overflow-hidden"
    >
      {/* ========================================================================= */}
      {/* 1. TOP LESSON HEADER & VIEWPORT MODE SELECTOR                             */}
      {/* ========================================================================= */}
      <div className="h-12 px-3 bg-[#181818] border-b border-[#2A2A2A] flex items-center justify-between gap-3 shrink-0 z-30">
        {/* Left: Lesson title, step indicator & workspace badge */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{lesson.workspace}</span>
          </div>

          <h2 className="text-xs font-bold text-gray-100 truncate">
            {lesson.title[lang] || lesson.title.he || lesson.title.en}
          </h2>

          <span className="hidden sm:inline text-xs text-gray-400 font-mono">
            ({currentStepIndex + 1}/{steps.length})
          </span>
        </div>

        {/* Center: Viewport Mode Switcher (Reference | Compare | Simulator) */}
        <div className="flex items-center gap-1 bg-[#101010] p-1 rounded-lg border border-[#2D2D2D] text-xs font-mono">
          <button
            onClick={() => setLayoutMode('reference')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              layoutMode === 'reference'
                ? 'bg-cyan-500 text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Focus on official Ableton Live reference image"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isHe ? 'תמונת ייחוס' : 'Reference'}</span>
          </button>

          <button
            onClick={() => setLayoutMode('compare')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              layoutMode === 'compare'
                ? 'bg-[#FFE853] text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Side-by-side comparison: Real Ableton vs Interactive Simulator"
          >
            <Split className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isHe ? 'השוואה צד-בצד' : 'Compare'}</span>
          </button>

          <button
            onClick={() => setLayoutMode('simulator')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              layoutMode === 'simulator'
                ? 'bg-[#90FF00] text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Focus on live interactive simulator"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isHe ? 'סימולטור' : 'Simulator'}</span>
          </button>
        </div>

        {/* Right: AI Coach & Step Controls */}
        <div className="flex items-center gap-2">
          {onAskAiCoach && (
            <button
              onClick={onAskAiCoach}
              className="px-2.5 py-1 rounded bg-[#242424] hover:bg-[#303030] border border-[#3A3A3A] hover:border-[#FFE853] text-gray-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Bot className="w-3.5 h-3.5 text-[#FFE853]" />
              <span className="hidden lg:inline">{isHe ? 'שאל מאמן AI' : 'Ask AI Coach'}</span>
            </button>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={onPrevStep}
              disabled={currentStepIndex === 0}
              className={`p-1.5 rounded border border-[#333] cursor-pointer ${
                currentStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-[#181818] text-gray-500'
                  : 'bg-[#252525] hover:bg-[#333] text-gray-200'
              }`}
              title="Previous Step"
            >
              {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <button
              onClick={onNextStep}
              className="px-2.5 py-1 rounded bg-[#FFE853] hover:bg-[#FFF080] text-black font-bold text-xs font-mono flex items-center gap-1 cursor-pointer shadow"
              title="Next Step"
            >
              <span>{isLastStep ? (isHe ? 'סיום' : 'Finish') : isHe ? 'הבא' : 'Next'}</span>
              {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STEP INSTRUCTION BANNER (STEP-BY-STEP PEDAGOGY)                        */}
      {/* ========================================================================= */}
      <div className="px-4 py-2 bg-[#141414] border-b border-[#242424] flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Step phase badge */}
          <div
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
              currentStep.type === 'observe'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : currentStep.type === 'understand'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {currentStep.type === 'observe'
              ? isHe
                ? 'שלב 1: התבונן'
                : 'Step 1: Look'
              : currentStep.type === 'understand'
              ? isHe
                ? 'שלב 2: הבן'
                : 'Step 2: Understand'
              : isHe
              ? 'שלב 3: תרגל'
              : 'Step 3: Try It'}
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-100">
              {currentStep.instruction[lang] ||
                currentStep.instruction.he ||
                currentStep.instruction.en}
            </span>
            <span className="text-[11px] text-gray-400 line-clamp-1">
              {currentStep.explanation[lang] ||
                currentStep.explanation.he ||
                currentStep.explanation.en}
            </span>
          </div>
        </div>

        {/* Quick hint button */}
        {currentStep.hint && (
          <button
            onClick={() => {
              onRequestHint();
              setShowHintModal(true);
            }}
            className="px-2 py-1 rounded bg-[#242424] hover:bg-[#303030] border border-[#383838] text-yellow-300 text-xs font-mono flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden sm:inline">{isHe ? 'רמז' : 'Hint'}</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE VIEWPORT (SPLIT / REFERENCE / SIMULATOR)                */}
      {/* ========================================================================= */}
      <div className="flex-1 relative flex overflow-hidden p-2 gap-2 bg-[#0B0B0B]">
        {/* VIEW A: Real Workspace Reference */}
        {(layoutMode === 'compare' || layoutMode === 'reference') && currentReferenceImage && (
          <div
            className={`h-full min-h-0 flex flex-col transition-all duration-200 ${
              layoutMode === 'compare' ? 'w-full lg:w-1/2' : 'w-full'
            }`}
          >
            <WorkspaceReference
              reference={currentReferenceImage}
              activeHotspotId={currentStep.activeHotspotId}
              highlightedRect={currentStep.referenceTargetRect}
              onSelectHotspot={handleSelectHotspot}
              onNavigatePrev={() =>
                setActiveReferenceIndex((p) =>
                  p > 0 ? p - 1 : referenceImages.length - 1
                )
              }
              onNavigateNext={() =>
                setActiveReferenceIndex((p) =>
                  p < referenceImages.length - 1 ? p + 1 : 0
                )
              }
              hasPrev={referenceImages.length > 1}
              hasNext={referenceImages.length > 1}
              lang={lang}
              isRTL={isRTL}
              onSwitchToSimulator={() => setLayoutMode('simulator')}
            />
          </div>
        )}

        {/* VIEW B: Interactive Live Simulator */}
        {(layoutMode === 'compare' || layoutMode === 'simulator') && (
          <div
            className={`h-full min-h-0 flex flex-col transition-all duration-200 relative ${
              layoutMode === 'compare' ? 'w-full lg:w-1/2' : 'w-full'
            }`}
          >
            <div className="w-full h-full rounded-lg overflow-hidden border border-[#2B2B2B] shadow-xl relative">
              <AbletonViewport
                state={simulatorState}
                currentStep={currentStep as any}
                learningMode={learningMode}
                screenshotUri={simulatorState.screenshotUri}
                onUpdateState={onUpdateSimulatorState}
                onActionTrigger={onActionTrigger}
                lang={lang}
                isRTL={isRTL}
              />
            </div>

            {/* Validation Feedback Overlay */}
            <div className="absolute top-3 right-3 z-40 max-w-xs w-full pointer-events-none">
              <AbletonActionValidatorFeedback
                validationResult={validationResult}
                currentStep={currentStep as any}
                score={score}
                learningMode={learningMode}
                lang={lang}
                isRTL={isRTL}
                onShowHint={onRequestHint}
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. FOOTER STATUS BAR WITH SOURCE ATTRIBUTION & PROGRESS                   */}
      {/* ========================================================================= */}
      <div className="h-6 bg-[#0E0E0E] border-t border-[#202020] px-3 flex items-center justify-between text-[10px] text-gray-500 font-mono shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFE853]" />
          <span>
            {isHe
              ? 'מודל למידה דו-שכבתי: תמונת ייחוס רשמית (Ableton) + סימולטור אינטראקטיבי'
              : 'Dual-Layer Architecture: Real Ableton Reference + Interactive Simulator'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-400">
            {isHe ? 'ניקוד:' : 'Score:'} <strong className="text-[#FFE853]">{score}</strong>
          </span>
          <button
            onClick={onRestartLesson}
            className="flex items-center gap-1 hover:text-gray-300 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isHe ? 'איפוס' : 'Restart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
