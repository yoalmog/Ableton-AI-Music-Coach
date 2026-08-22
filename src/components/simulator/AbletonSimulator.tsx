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
import { AbletonViewport } from './AbletonViewport';
import { AbletonLessonPanel } from './AbletonLessonPanel';
import { AbletonLessonEditor } from './AbletonLessonEditor';
import { AbletonActionValidatorFeedback } from './AbletonActionValidator';
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
} from 'lucide-react';
import { AAMCProject } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { visualCoachStorageService } from '../../services/visualCoachStorageService';

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

  // Custom Lessons from storage
  const [customLessons, setCustomLessons] = useState<AbletonLessonDefinition[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const allLessons = [...ABLETON_SIMULATOR_LESSONS, ...customLessons];
  const [activeLessonId, setActiveLessonId] = useState<string>(ABLETON_SIMULATOR_LESSONS[0].id);
  const activeLesson =
    allLessons.find((l) => l.id === activeLessonId) || ABLETON_SIMULATOR_LESSONS[0];

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
    activeLessonId: activeLesson.id,
    currentStepIndex: 0,
    mistakesCount: 0,
    hintsUsedCount: 0,
    mode: 'guided',
    score: 0,
    completed: false,
    screenshotUri: activeLesson.screenshotUri || null,
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
    abletonLessonEngine.loadLesson(activeLesson, engineState.learningMode);

    if (activeLesson.initialState) {
      setState((prev) => ({
        ...prev,
        ...activeLesson.initialState,
        activeLessonId: activeLesson.id,
        currentStepIndex: 0,
        mistakesCount: 0,
        hintsUsedCount: 0,
        screenshotUri: activeLesson.screenshotUri || null,
        completed: false,
      }));
    }
  }, [activeLessonId]);

  const currentStep = engineState.currentStep || activeLesson.steps[engineState.currentStepIndex];

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
    const prompt = isHe
      ? `אני עובד עכשיו בסימולטור של Ableton Live 12 בשיעור "${activeLesson.title.he}", שלב ${engineState.currentStepIndex + 1}: "${currentStep?.instruction.he}". ה-BPM הנוכחי הוא ${state.bpm}, הערוץ הנבחר הוא "${state.selectedTrackId}". איך אני מבצע את השלב הזה בצורה הנכונה?`
      : `I am working in the Ableton Live 12 Training Simulator on lesson "${activeLesson.title.en}", step ${engineState.currentStepIndex + 1}: "${currentStep?.instruction.en}". Current BPM is ${state.bpm}. How do I perform this step?`;

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
      {/* TOP SIMULATOR NAVIGATION & VIEW SWITCHER                                   */}
      {/* ========================================================================= */}
      <div className="h-11 px-3 bg-[#181818] border-b border-[#2B2B2B] flex items-center justify-between gap-2 shrink-0 z-30">
        {/* Left: Brand, Honesty Badge & Lesson Dropdown */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-bold font-mono text-xs text-[#FFE853]">
            <span className="w-2.5 h-2.5 rounded bg-[#FFE853]" />
            <span className="hidden sm:inline">ABLETON LIVE 12</span>
            <span className="text-gray-400 font-normal">SIMULATOR</span>
          </div>

          {/* Lesson Selector */}
          <select
            value={activeLessonId}
            onChange={(e) => setActiveLessonId(e.target.value)}
            className="bg-[#242424] border border-[#3A3A3A] text-gray-100 text-xs rounded px-2 py-1 font-mono cursor-pointer max-w-[200px] sm:max-w-[260px] truncate"
          >
            {allLessons.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title[language] || l.title.he || l.title.en}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsEditorOpen(true)}
            className="px-2 py-1 rounded bg-[#242424] hover:bg-[#333] text-gray-300 hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer"
            title="Calibrate screenshot and create custom lesson"
          >
            <Upload className="w-3.5 h-3.5 text-[#FFE853]" />
            <span className="hidden md:inline">{isHe ? 'כיול צילום מסך' : 'Calibrate Screenshot'}</span>
          </button>
        </div>

        {/* Center: Workspace View Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#121212] p-1 rounded border border-[#2B2B2B] text-xs font-mono">
          <button
            onClick={() => setState((prev) => ({ ...prev, viewMode: 'arrangement' }))}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              state.viewMode === 'arrangement'
                ? 'bg-[#FFE853] text-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Arrangement
          </button>
          <button
            onClick={() => setState((prev) => ({ ...prev, viewMode: 'pianoroll' }))}
            className={`px-2 py-0.5 rounded cursor-pointer flex items-center gap-1 ${
              state.viewMode === 'pianoroll'
                ? 'bg-[#FFE853] text-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Music className="w-3 h-3" />
            <span>Piano Roll</span>
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
      {/* MAIN SIMULATOR VIEWPORT + FLOATING HUDs                                   */}
      {/* ========================================================================= */}
      <div className="flex-1 relative flex overflow-hidden">
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

        {/* Lesson Completion Celebration Modal */}
        {engineState.stateMachine === 'LESSON_COMPLETED' && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#181818] border border-[#FFE853]/60 rounded-xl p-6 max-w-md w-full text-center shadow-2xl flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#FFE853] text-black flex items-center justify-center shadow-[0_0_24px_rgba(255,232,83,0.5)]">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono text-[#FFE853]">
                  {isHe ? 'השיעור הושלם בהצלחה!' : 'Lesson Completed!'}
                </h3>
                <p className="text-gray-300 text-xs mt-1">
                  {activeLesson.title[language] || activeLesson.title.he || activeLesson.title.en}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full bg-[#121212] p-3 rounded-lg border border-[#2B2B2B] text-xs font-mono">
                <div className="flex flex-col items-center">
                  <span className="text-gray-400 text-[10px] uppercase">{isHe ? 'ניקוד' : 'Score'}</span>
                  <span className="text-[#FFE853] font-bold text-base">{engineState.score}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-gray-400 text-[10px] uppercase">{isHe ? 'טעויות' : 'Mistakes'}</span>
                  <span className="text-rose-400 font-bold text-base">{engineState.mistakesCount}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-gray-400 text-[10px] uppercase">{isHe ? 'רמזים' : 'Hints'}</span>
                  <span className="text-cyan-400 font-bold text-base">{engineState.hintsUsedCount}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => abletonLessonEngine.resetLesson()}
                  className="flex-1 py-2 rounded bg-[#2A2A2A] hover:bg-[#3A3A3A] text-gray-200 text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isHe ? 'תרגל שוב' : 'Practice Again'}</span>
                </button>
                <button
                  onClick={() => {
                    const nextLessonIndex = (allLessons.findIndex((l) => l.id === activeLessonId) + 1) % allLessons.length;
                    setActiveLessonId(allLessons[nextLessonIndex].id);
                  }}
                  className="flex-1 py-2 rounded bg-[#FFE853] hover:bg-[#FFF080] text-black font-bold text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <span>{isHe ? 'השיעור הבא' : 'Next Lesson'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Learning Panel (Docked on Desktop, Floating on Mobile) */}
        <div className="absolute bottom-4 left-4 z-40 max-w-md w-full sm:w-auto shadow-2xl">
          <AbletonLessonPanel
            lesson={activeLesson}
            currentStepIndex={engineState.currentStepIndex}
            learningMode={engineState.learningMode}
            validationResult={engineState.validationResult}
            score={engineState.score}
            mistakesCount={engineState.mistakesCount}
            hintsUsedCount={engineState.hintsUsedCount}
            onNextStep={() => abletonLessonEngine.nextStep()}
            onPrevStep={() => abletonLessonEngine.prevStep()}
            onShowMe={() => {
              abletonLessonEngine.setLearningMode('guided');
            }}
            onUseHint={() => {
              abletonLessonEngine.requestHint();
            }}
            onChangeMode={(mode) => abletonLessonEngine.setLearningMode(mode)}
            onAskAiCoach={handleAskCoach}
            lang={language}
            isRTL={isRTL}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM HONESTY DISCLAIMER BAR                                             */}
      {/* ========================================================================= */}
      <div className="h-6 bg-[#0D0D0D] border-t border-[#202020] px-3 flex items-center justify-between text-[10px] text-gray-500 font-mono shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFE853]" />
          <span>Ableton Live 12 Training Simulator (Educational Representation)</span>
        </div>
        <div className="hidden sm:block">
          {isHe
            ? 'בצע את הפעולות בסימולטור ותרגל במקביל ב-Ableton Live'
            : 'Practice actions in simulator and repeat in real Ableton Live'}
        </div>
      </div>

      {/* Screenshot Calibration & Lesson Editor Modal */}
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
