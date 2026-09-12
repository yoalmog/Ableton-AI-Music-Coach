import React, { useState, useEffect, useRef } from 'react';
import {
  AbletonSimulatorState,
  AbletonLessonDefinition,
  AbletonLessonStep,
  SimulatorLearningMode,
  AbletonViewMode,
  SimulatorValidationResult,
  SimulatorActionType,
} from '../../types/abletonSimulator';
import { ABLETON_SIMULATOR_LESSONS } from '../../data/abletonSimulatorLessons';
import { CORE_TUTORIAL_LESSONS } from '../../data/coreTutorialLessons';
import { REFERENCE_IMAGE_LIBRARY } from '../../data/referenceImageLibrary';
import { TutorialLesson } from '../../types/workspaceReference';
import { TeachingLayout, TeachingLayoutMode } from './TeachingLayout';
import { AbletonViewport } from './AbletonViewport';
import { AbletonLessonPanel } from './AbletonLessonPanel';
import { AbletonLessonEditor } from './AbletonLessonEditor';
import { AbletonActionValidatorFeedback } from './AbletonActionValidator';
import { WorkspaceReference } from './WorkspaceReference';
import { abletonLessonEngine, LessonEngineState } from '../../services/abletonLessonEngine';
import {
  Maximize2,
  Minimize2,
  Sparkles,
  RotateCcw,
  BookOpen,
  Layout,
  Music,
  Sliders,
  Layers,
  Upload,
  Bot,
  HelpCircle,
  Award,
  CheckCircle,
  Flame,
  ArrowRight,
  Split,
  Eye,
  Compass,
} from 'lucide-react';
import { AAMCProject } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface AbletonSimulatorProps {
  project?: AAMCProject;
  onBackToDashboard?: () => void;
  onOpenCoachWithMessage?: (msg: string) => void;
}

export const AbletonSimulator: React.FC<AbletonSimulatorProps> = ({
  project,
  onBackToDashboard,
  onOpenCoachWithMessage,
}) => {
  const { language, isRTL, t } = useLanguage();
  const isHe = language === 'he';

  // Mode: 'tutorial' (Real Reference + Simulator) vs 'direct_daw' (Full screen interactive simulator)
  const [viewStyle, setViewStyle] = useState<'tutorial' | 'direct_daw'>('tutorial');
  const [isReferenceGalleryOpen, setIsReferenceGalleryOpen] = useState<boolean>(false);
  const [selectedGalleryRefKey, setSelectedGalleryRefKey] = useState<string>('ref-session-view');

  // Custom Lessons from storage
  const [customLessons, setCustomLessons] = useState<AbletonLessonDefinition[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Combine Core Reference Tutorial Lessons with Psytrance and standard lessons
  const [activeTutorialIndex, setActiveTutorialIndex] = useState<number>(0);
  const activeTutorialLesson = CORE_TUTORIAL_LESSONS[activeTutorialIndex] || CORE_TUTORIAL_LESSONS[0];

  const allStandardLessons = [...ABLETON_SIMULATOR_LESSONS, ...customLessons];
  const [activeLessonId, setActiveLessonId] = useState<string>(ABLETON_SIMULATOR_LESSONS[0].id);
  const activeStandardLesson =
    allStandardLessons.find((l) => l.id === activeLessonId) || ABLETON_SIMULATOR_LESSONS[0];

  // Engine state subscription
  const [engineState, setEngineState] = useState<LessonEngineState>(abletonLessonEngine.getState());

  // Simulator Interactive Virtual State
  const [state, setState] = useState<AbletonSimulatorState>({
    viewMode: 'arrangement',
    bpm: project?.bpm || 142,
    timeSignature: '4/4',
    isPlaying: false,
    isRecording: false,
    metronome: false,
    loop: true,
    selectedTrackId: 't2',
    selectedClipId: null,
    selectedDeviceId: 'drift',
    key: project?.key || 'F#',
    scale: project?.scale || 'Minor',
    tracks: [
      { id: 't1', name: '1 Kick', type: 'audio', color: '#00E5FF', volume: 0.85, pan: 0, muted: false, soloed: false, armed: false, clips: [], devices: ['EQ Eight'] },
      { id: 't2', name: '2 Bass', type: 'midi', color: '#90FF00', volume: 0.82, pan: 0, muted: false, soloed: false, armed: true, clips: [], devices: ['Drift', 'Compressor'] },
      { id: 't3', name: '3 Lead', type: 'midi', color: '#FFB800', volume: 0.75, pan: 0, muted: false, soloed: false, armed: false, clips: [], devices: ['Operator'] },
      { id: 't4', name: 'Main', type: 'master', color: '#FFE853', volume: 0.9, pan: 0, muted: false, soloed: false, armed: false, clips: [], devices: ['Limiter'] },
    ],
    pianoRollNotes: [],
    deviceParameters: {
      drift: {
        osc1Shape: 'Saw',
        osc2Shape: 'Pulse',
        cutoff: 840,
        resonance: 45,
        env2Decay: 350,
        driftAmount: 15,
        volume: 0.8,
      },
      operator: {
        algorithm: 1,
        oscACoarse: 1,
        oscBCoarse: 2,
        cutoff: 3500,
        filterEnvAmount: 40,
        decay: 250,
      },
      compressor: {
        threshold: 0,
        ratio: 4,
        attack: 2,
        release: 50,
        sidechainEnabled: false,
        sidechainSource: '1 Kick',
        gainReduction: 0,
      },
      eqEight: {
        band1Gain: 0,
        band1Freq: 30,
        band2Freq: 120,
        lowCutEnabled: true,
        lowCutFreq: 30,
      },
    },
    activeLessonId: activeStandardLesson.id,
    currentStepIndex: 0,
    mistakesCount: 0,
    hintsUsedCount: 0,
    mode: 'guided',
    score: 0,
    completed: false,
    screenshotUri: activeStandardLesson.screenshotUri || null,
  });

  // Subscribe to Lesson Engine
  useEffect(() => {
    const unsubscribe = abletonLessonEngine.subscribe((newEngineState) => {
      setEngineState(newEngineState);
    });
    return () => unsubscribe();
  }, []);

  // Initialize and load active lesson into state and engine
  useEffect(() => {
    if (viewStyle === 'tutorial') {
      // Map TutorialLesson into engine definition
      const mappedLesson: AbletonLessonDefinition = {
        id: activeTutorialLesson.id,
        category: 'beginner',
        title: activeTutorialLesson.title,
        subtitle: activeTutorialLesson.subtitle,
        description: activeTutorialLesson.description,
        genre: 'Psytrance',
        difficulty: activeTutorialLesson.difficulty,
        screenshotKey: 'arrangement-live12',
        initialState: activeTutorialLesson.initialState || {},
        steps: activeTutorialLesson.steps.map((s, idx) => ({
          id: s.id,
          title: s.title,
          instruction: s.instruction,
          why: s.explanation,
          hint: s.hint || { en: 'Observe the highlighted area in the reference image.', he: 'התבונן באזור המסומן בתמונת הייחוס.' },
          exactAction: s.instruction,
          targetId: s.simulatorTargetId || 'tempo-bpm',
          targetRect: s.simulatorTargetRect || { x: 0.045, y: 0.015, width: 0.065, height: 0.035 },
          expectedAction: s.expectedAction || 'CLICK',
          expectedValue: s.expectedValue,
          arrowDirection: s.arrowDirection || 'down',
          validation: s.validation,
          deviceTarget: s.deviceTarget,
          referenceImageId: s.referenceImageId,
          activeHotspotId: s.activeHotspotId,
          referenceTargetRect: s.referenceTargetRect,
        })),
      };

      abletonLessonEngine.loadLesson(mappedLesson, engineState.learningMode);
    } else {
      abletonLessonEngine.loadLesson(activeStandardLesson, engineState.learningMode);
    }
  }, [activeLessonId, activeTutorialIndex, viewStyle]);

  const currentStep = engineState.currentStep || activeStandardLesson.steps[engineState.currentStepIndex];

  // Action Dispatcher to AbletonLessonEngine & ActionValidator
  const handleActionTrigger = (targetId: string, actionType: SimulatorActionType, payload?: any) => {
    // 1. Process with AbletonLessonEngine
    const result = abletonLessonEngine.processAction(
      actionType,
      targetId,
      state,
      payload
    );

    // 2. Synchronize simulator interactive state if passed
    if (result.pass) {
      if (targetId === 'tempo-bpm' && currentStep?.expectedValue) {
        setState((prev) => ({ ...prev, bpm: Number(currentStep.expectedValue) }));
      } else if (targetId === 'create-midi-track') {
        setState((prev) => ({
          ...prev,
          tracks: [
            ...prev.tracks,
            {
              id: `t${prev.tracks.length + 1}`,
              name: `${prev.tracks.length + 1} MIDI`,
              type: 'midi',
              color: '#90FF00',
              volume: 0.8,
              pan: 0,
              muted: false,
              soloed: false,
              armed: true,
              clips: [],
              devices: [],
            },
          ],
        }));
      } else if (targetId.startsWith('track-select-') || targetId === 'select-track-bass') {
        const trackId = currentStep?.expectedValue || 't2';
        setState((prev) => ({ ...prev, selectedTrackId: trackId }));
      }
    }
  };

  const handleUpdateSimulatorState = (patch: Partial<AbletonSimulatorState>) => {
    setState((prev) => {
      const updated = { ...prev, ...patch };
      // Check if parameter update satisfies active step
      if (currentStep?.deviceTarget) {
        const { deviceType, parameterName } = currentStep.deviceTarget;
        if (patch.deviceParameters?.[deviceType] && patch.deviceParameters[deviceType][parameterName] !== undefined) {
          handleActionTrigger(currentStep.targetId, currentStep.expectedAction, patch.deviceParameters[deviceType][parameterName]);
        }
      }
      return updated;
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleAskCoach = () => {
    const activeTitle = viewStyle === 'tutorial' ? activeTutorialLesson.title : activeStandardLesson.title;
    const prompt = isHe
      ? `אני עובד עכשיו בסימולטור של Ableton Live 12 בשיעור "${activeTitle.he}", שלב ${engineState.currentStepIndex + 1}: "${currentStep?.instruction?.he}". ה-BPM הנוכחי הוא ${state.bpm}, הערוץ הנבחר הוא "${state.selectedTrackId}". איך אני מבצע את השלב הזה בצורה הנכונה?`
      : `I am working in the Ableton Live 12 Training Simulator on lesson "${activeTitle.en}", step ${engineState.currentStepIndex + 1}: "${currentStep?.instruction?.en}". Current BPM is ${state.bpm}. How do I perform this step?`;

    if (onOpenCoachWithMessage) {
      onOpenCoachWithMessage(prompt);
    }
  };

  return (
    <div
      ref={containerRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full h-full flex flex-col bg-[#101010] text-[#E0E0E0] select-none font-sans overflow-hidden"
    >
      {/* ========================================================================= */}
      {/* TOP NAVIGATION & TUTORIAL vs DIRECT SIMULATOR MODE SWITCHER               */}
      {/* ========================================================================= */}
      <div className="h-11 px-3 bg-[#181818] border-b border-[#2B2B2B] flex items-center justify-between gap-2 shrink-0 z-30">
        {/* Left: Brand, Lesson Selector */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-bold font-mono text-xs text-[#FFE853]">
            <span className="w-2.5 h-2.5 rounded bg-[#FFE853]" />
            <span className="hidden sm:inline">ABLETON LIVE 12</span>
            <span className="text-gray-400 font-normal">SIMULATOR</span>
          </div>

          {/* Tutorial Lesson Selector */}
          {viewStyle === 'tutorial' ? (
            <select
              value={activeTutorialIndex}
              onChange={(e) => setActiveTutorialIndex(Number(e.target.value))}
              className="bg-[#242424] border border-cyan-500/40 text-cyan-200 text-xs rounded px-2 py-1 font-mono cursor-pointer max-w-[200px] sm:max-w-[260px] truncate"
            >
              {CORE_TUTORIAL_LESSONS.map((l, idx) => (
                <option key={l.id} value={idx}>
                  {l.title[language] || l.title.he || l.title.en}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={activeLessonId}
              onChange={(e) => setActiveLessonId(e.target.value)}
              className="bg-[#242424] border border-[#3A3A3A] text-gray-100 text-xs rounded px-2 py-1 font-mono cursor-pointer max-w-[200px] sm:max-w-[260px] truncate"
            >
              {allStandardLessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title[language] || l.title.he || l.title.en}
                </option>
              ))}
            </select>
          )}

          {/* Reference Library Button */}
          <button
            onClick={() => setIsReferenceGalleryOpen(true)}
            className="px-2 py-1 rounded bg-[#242424] hover:bg-[#333] text-gray-300 hover:text-cyan-300 border border-[#333] hover:border-cyan-500/40 text-xs font-mono flex items-center gap-1 cursor-pointer"
            title="Browse all official Ableton workspace references"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">{isHe ? 'ספריית תמונות ייחוס' : 'Reference Library'}</span>
          </button>
        </div>

        {/* Center: Teaching Mode Switcher (Tutorial Mode with Real Reference vs Direct DAW) */}
        <div className="flex items-center gap-1 bg-[#121212] p-1 rounded-lg border border-[#2B2B2B] text-xs font-mono">
          <button
            onClick={() => setViewStyle('tutorial')}
            className={`px-2.5 py-0.5 rounded cursor-pointer flex items-center gap-1.5 ${
              viewStyle === 'tutorial'
                ? 'bg-cyan-500 text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Split className="w-3 h-3" />
            <span className="hidden sm:inline">{isHe ? 'מצב לימוד עם תמונות ייחוס' : 'Reference Tutorial'}</span>
          </button>
          <button
            onClick={() => setViewStyle('direct_daw')}
            className={`px-2.5 py-0.5 rounded cursor-pointer flex items-center gap-1.5 ${
              viewStyle === 'direct_daw'
                ? 'bg-[#FFE853] text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span className="hidden sm:inline">{isHe ? 'סימולטור מלא' : 'Full Simulator'}</span>
          </button>
        </div>

        {/* Right: AI Coach & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Ask AI Teacher button */}
          <button
            onClick={handleAskCoach}
            className="px-2.5 py-1 rounded bg-[#242424] hover:bg-[#333] border border-[#383838] hover:border-[#FFE853] text-gray-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Bot className="w-3.5 h-3.5 text-[#FFE853]" />
            <span className="hidden sm:inline">{isHe ? 'שאל מאמן AI' : 'Ask AI Teacher'}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded bg-[#242424] hover:bg-[#333] text-gray-300 hover:text-white border border-[#383838] cursor-pointer"
            title="Simulator Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT: TUTORIAL TEACHING LAYOUT OR DIRECT DAW SIMULATOR            */}
      {/* ========================================================================= */}
      <div className="flex-1 relative flex overflow-hidden">
        {viewStyle === 'tutorial' ? (
          <TeachingLayout
            lesson={activeTutorialLesson}
            currentStepIndex={engineState.currentStepIndex}
            simulatorState={state}
            validationResult={engineState.validationResult}
            score={engineState.score}
            mistakesCount={engineState.mistakesCount}
            hintsUsedCount={engineState.hintsUsedCount}
            learningMode={engineState.learningMode}
            onNextStep={() => {
              if (engineState.currentStepIndex >= activeTutorialLesson.steps.length - 1) {
                const nextIndex = (activeTutorialIndex + 1) % CORE_TUTORIAL_LESSONS.length;
                setActiveTutorialIndex(nextIndex);
              } else {
                abletonLessonEngine.nextStep();
              }
            }}
            onPrevStep={() => abletonLessonEngine.prevStep()}
            onRestartLesson={() => abletonLessonEngine.resetLesson()}
            onUpdateSimulatorState={handleUpdateSimulatorState}
            onActionTrigger={handleActionTrigger}
            onRequestHint={() => abletonLessonEngine.requestHint()}
            onAskAiCoach={handleAskCoach}
            lang={language}
            isRTL={isRTL}
          />
        ) : (
          <div className="flex-1 w-full h-full relative flex overflow-hidden">
            {/* The Ableton Live 12 Viewport (Canvas + Synchronized Overlay) */}
            <div className="flex-1 w-full h-full min-h-0 min-w-0 relative">
              <AbletonViewport
                state={state}
                currentStep={currentStep}
                learningMode={engineState.learningMode}
                screenshotUri={state.screenshotUri}
                onUpdateState={handleUpdateSimulatorState}
                onActionTrigger={handleActionTrigger}
                lang={language}
                isRTL={isRTL}
              />
            </div>

            {/* Real-Time Action Validator Feedback Toast Overlay */}
            <div className="absolute top-4 right-4 z-40 max-w-sm w-full pointer-events-none">
              <AbletonActionValidatorFeedback
                validationResult={engineState.validationResult}
                currentStep={currentStep}
                score={engineState.score}
                learningMode={engineState.learningMode}
                lang={language}
                isRTL={isRTL}
                onShowHint={() => abletonLessonEngine.requestHint()}
              />
            </div>

            {/* Dedicated Learning Panel */}
            <div className="absolute bottom-4 left-4 z-40 max-w-md w-full sm:w-auto shadow-2xl">
              <AbletonLessonPanel
                lesson={activeStandardLesson}
                currentStepIndex={engineState.currentStepIndex}
                learningMode={engineState.learningMode}
                validationResult={engineState.validationResult}
                score={engineState.score}
                mistakesCount={engineState.mistakesCount}
                hintsUsedCount={engineState.hintsUsedCount}
                onNextStep={() => abletonLessonEngine.nextStep()}
                onPrevStep={() => abletonLessonEngine.prevStep()}
                onShowMe={() => abletonLessonEngine.setLearningMode('guided')}
                onUseHint={() => abletonLessonEngine.requestHint()}
                onChangeMode={(mode) => abletonLessonEngine.setLearningMode(mode)}
                onAskAiCoach={handleAskCoach}
                lang={language}
                isRTL={isRTL}
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ALL REFERENCE IMAGES GALLERY MODAL                                         */}
      {/* ========================================================================= */}
      {isReferenceGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#333] rounded-xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="h-12 px-4 bg-[#202020] border-b border-[#2D2D2D] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-gray-100 font-mono">
                  {isHe ? 'ספריית תמונות ייחוס רשמיות של Ableton Live' : 'Official Ableton Live Reference Library'}
                </h3>
              </div>
              <button
                onClick={() => setIsReferenceGalleryOpen(false)}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar with all workspaces */}
              <div className="w-56 bg-[#141414] border-r border-[#262626] p-2 flex flex-col gap-1 overflow-y-auto">
                <span className="text-[10px] font-mono text-gray-500 uppercase px-2 py-1">
                  {isHe ? 'סביבות עבודה' : 'Workspaces'}
                </span>
                {Object.values(REFERENCE_IMAGE_LIBRARY).map((refItem) => (
                  <button
                    key={refItem.id}
                    onClick={() => setSelectedGalleryRefKey(refItem.id)}
                    className={`px-2.5 py-1.5 rounded text-xs font-mono text-left transition-colors cursor-pointer ${
                      selectedGalleryRefKey === refItem.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#222]'
                    }`}
                  >
                    {refItem.title[language] || refItem.title.he || refItem.title.en}
                  </button>
                ))}
              </div>

              {/* Main Reference Viewer */}
              <div className="flex-1 p-3 bg-[#0E0E0E] flex flex-col min-h-0">
                {REFERENCE_IMAGE_LIBRARY[selectedGalleryRefKey] && (
                  <WorkspaceReference
                    reference={REFERENCE_IMAGE_LIBRARY[selectedGalleryRefKey]}
                    lang={language}
                    isRTL={isRTL}
                    onSwitchToSimulator={() => {
                      setIsReferenceGalleryOpen(false);
                      setViewStyle('direct_daw');
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Calibration & Custom Lesson Editor Modal */}
      {isEditorOpen && (
        <AbletonLessonEditor
          onSaveLesson={(newLesson) => {
            setCustomLessons((prev) => [...prev, newLesson]);
            setActiveLessonId(newLesson.id);
          }}
          onClose={() => setIsEditorOpen(false)}
          lang={language}
          isRTL={isRTL}
        />
      )}
    </div>
  );
};
