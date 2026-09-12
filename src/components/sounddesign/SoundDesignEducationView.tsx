import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders,
  Play,
  Square,
  Volume2,
  Sparkles,
  Zap,
  Activity,
  Layers,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Radio,
  ArrowRight,
  Info,
  Wand2,
  Bookmark
} from 'lucide-react';
import { 
  soundDesignLessonService, 
  SOUND_DESIGN_LESSONS 
} from '../../services/soundDesignLessonService';
import { 
  SoundDesignDeviceType, 
  SoundDesignDeviceLesson, 
  DevicePracticalExample 
} from '../../types/soundDesignEducation';
import { aiService } from '../../services/aiService';

interface SoundDesignEducationViewProps {
  initialDeviceId?: SoundDesignDeviceType;
  onOpenCoachWithPrompt?: (prompt: string) => void;
}

export const SoundDesignEducationView: React.FC<SoundDesignEducationViewProps> = ({
  initialDeviceId = 'wavetable',
  onOpenCoachWithPrompt
}) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<SoundDesignDeviceType>(initialDeviceId);
  const [currentLesson, setCurrentLesson] = useState<SoundDesignDeviceLesson>(() => {
    return soundDesignLessonService.getLesson(initialDeviceId) || SOUND_DESIGN_LESSONS[0];
  });
  const [selectedExample, setSelectedExample] = useState<DevicePracticalExample>(() => {
    const lesson = soundDesignLessonService.getLesson(initialDeviceId) || SOUND_DESIGN_LESSONS[0];
    return lesson.practicalExamples[0];
  });
  const [activeParams, setActiveParams] = useState<Record<string, any>>(() => {
    const lesson = soundDesignLessonService.getLesson(initialDeviceId) || SOUND_DESIGN_LESSONS[0];
    return { ...lesson.practicalExamples[0].parameters };
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBypassed, setIsBypassed] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiExplanationText, setAiExplanationText] = useState<string | null>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  // Canvas ref for visualizer
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Switch device
  const handleSelectDevice = (deviceId: SoundDesignDeviceType) => {
    soundDesignLessonService.stopPlayback();
    setIsPlaying(false);
    setActiveStepIndex(null);
    setSelectedDeviceId(deviceId);
    const lesson = soundDesignLessonService.getLesson(deviceId) || SOUND_DESIGN_LESSONS[0];
    setCurrentLesson(lesson);
    const ex = lesson.practicalExamples[0];
    setSelectedExample(ex);
    setActiveParams({ ...ex.parameters });
    setAiExplanationText(null);
  };

  // Switch practical example
  const handleSelectExample = (ex: DevicePracticalExample) => {
    soundDesignLessonService.stopPlayback();
    setIsPlaying(false);
    setActiveStepIndex(null);
    setSelectedExample(ex);
    setActiveParams({ ...ex.parameters });
    setAiExplanationText(null);
  };

  // Change a parameter
  const handleParamChange = (key: string, value: any) => {
    setActiveParams((prev) => {
      const next = { ...prev, [key]: value };
      soundDesignLessonService.updateLiveParameter(key, value);
      return next;
    });
  };

  // Reset to default parameters
  const handleResetParams = () => {
    setActiveParams({ ...selectedExample.parameters });
    Object.entries(selectedExample.parameters).forEach(([k, v]) => {
      soundDesignLessonService.updateLiveParameter(k, v);
    });
  };

  // Toggle Play / Stop
  const handleTogglePlay = () => {
    if (isPlaying) {
      soundDesignLessonService.stopPlayback();
      setIsPlaying(false);
      setActiveStepIndex(null);
    } else {
      soundDesignLessonService.setBypass(isBypassed);
      soundDesignLessonService.playDevicePattern(
        selectedDeviceId,
        selectedExample,
        activeParams,
        true,
        (step) => setActiveStepIndex(step)
      );
      setIsPlaying(true);
    }
  };

  // Toggle Bypass
  const handleToggleBypass = () => {
    const nextBypass = !isBypassed;
    setIsBypassed(nextBypass);
    soundDesignLessonService.setBypass(nextBypass);
  };

  // Audition single note
  const handleAuditionNote = (pitch: string) => {
    soundDesignLessonService.playSingleAudition(selectedDeviceId, pitch, activeParams, 0.45);
  };

  // Generate Custom Experiment
  const handleGenerateExperiment = async () => {
    setIsGenerating(true);
    try {
      const res = await aiService.generateSoundDesignExperiment(
        selectedDeviceId,
        selectedExample.genre,
        `Unique ${selectedExample.genre} variation with cutting transient response`
      );
      if (res?.parameters) {
        setActiveParams(res.parameters);
        Object.entries(res.parameters).forEach(([k, v]) => {
          soundDesignLessonService.updateLiveParameter(k, v);
        });
      }
      if (res?.aiExplanation) {
        setAiExplanationText(res.aiExplanation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Stop playback on unmount
  useEffect(() => {
    return () => {
      soundDesignLessonService.stopPlayback();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Audio Visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = soundDesignLessonService.getAnalyser();
    const bufferLength = analyser ? analyser.frequencyBinCount : 128;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.fillStyle = '#0F0F0F';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#222222';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (analyser && isPlaying) {
        analyser.getByteTimeDomainData(dataArray);

        // Waveform
        ctx.lineWidth = 2;
        ctx.strokeStyle = isBypassed ? '#888888' : '#00E5FF';
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();

        // Frequency bars overlay
        const freqArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(freqArray);
        const barWidth = (width / 32) - 2;
        let barX = 2;
        for (let i = 0; i < 32; i++) {
          const barHeight = (freqArray[i * 4] / 255) * (height * 0.7);
          ctx.fillStyle = isBypassed 
            ? 'rgba(120, 120, 120, 0.25)' 
            : i < 10 
            ? 'rgba(144, 255, 0, 0.35)' 
            : 'rgba(0, 229, 255, 0.35)';
          ctx.fillRect(barX, height - barHeight, barWidth, barHeight);
          barX += barWidth + 2;
        }
      } else {
        // Idle line
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isBypassed]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#E0E0E0] font-sans pb-12">
      {/* Device Selector Tabs */}
      <div className="bg-[#181818] border border-[#2E2E2E] rounded-xl p-3 shadow-md">
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#90FF00] animate-pulse"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#90FF00]">
              Ableton Live 12 Interactive Sound Design Academy
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#888] hidden sm:inline">
            Real Web Audio DSP Engine • No Mock Sound
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SOUND_DESIGN_LESSONS.map((d) => {
            const isSelected = selectedDeviceId === d.id;
            return (
              <button
                key={d.id}
                onClick={() => handleSelectDevice(d.id)}
                className={`p-3 rounded-lg text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#252525] border-[#00E5FF] text-white shadow-lg'
                    : 'bg-[#121212] border-[#2A2A2A] text-[#888] hover:text-[#E0E0E0] hover:bg-[#1C1C1C]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold font-mono uppercase">{d.name}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]"></span>
                  )}
                </div>
                <div className="text-[10px] text-[#777] truncate font-mono">{d.category}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Lesson Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Device Theory, Signal Flow & Use Cases (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Device Header Card */}
          <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-mono px-3 py-1 rounded bg-[#121212] text-[#00E5FF] border border-[#2E2E2E]">
                {currentLesson.category}
              </span>
              <span className="text-[11px] font-mono text-[#888] bg-[#141414] px-2.5 py-1 rounded border border-[#282828]">
                Shortcut: {currentLesson.shortcutKey}
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{currentLesson.name}</h1>
              <p className="text-xs font-mono text-[#90FF00] mt-1">{currentLesson.tagline}</p>
            </div>

            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              {currentLesson.description}
            </p>

            {/* Signal Flow Diagram */}
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#00E5FF]">
                <Layers className="w-3.5 h-3.5" />
                <span>Internal Signal Flow Architecture</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {currentLesson.signalFlow.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-[#202020] text-[#90FF00] text-[10px] font-mono font-bold flex items-center justify-center shrink-0 border border-[#333]">
                      {idx + 1}
                    </span>
                    <span className="text-[#BBB] font-mono">{stage}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Sound Design Concepts */}
            <div className="space-y-2.5 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#888] font-mono">
                Key Technical Concepts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentLesson.coreConcepts.map((concept, cIdx) => (
                  <div key={cIdx} className="bg-[#141414] p-3.5 rounded-lg border border-[#282828] space-y-1.5">
                    <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#90FF00]" />
                      <span>{concept.term}</span>
                    </div>
                    <p className="text-xs text-[#AAA] leading-relaxed">
                      {concept.explanation}
                    </p>
                    <div className="text-[11px] font-mono text-[#90FF00] bg-[#181818] p-1.5 rounded mt-1 border border-[#222]">
                      Tip: {concept.abletonTip}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Use Cases */}
            <div className="space-y-2.5 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#888] font-mono">
                Genre Applications & Production Use Cases
              </h3>
              <div className="space-y-2.5">
                {currentLesson.useCases.map((uc, uIdx) => (
                  <div key={uIdx} className="bg-[#141414] p-3.5 rounded-lg border border-[#282828] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{uc.title}</span>
                      <span className="text-[10px] font-mono text-[#00E5FF] bg-[#1C1C1C] px-2 py-0.5 rounded border border-[#333]">
                        {uc.genre}
                      </span>
                    </div>
                    <p className="text-xs text-[#BBB] leading-relaxed">{uc.description}</p>
                    <div className="text-[11px] text-[#90FF00] font-mono flex items-center gap-1 mt-1">
                      <Zap className="w-3 h-3 shrink-0" />
                      <span>{uc.proTip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ableton Live 12 Step-by-Step Translation */}
          <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#90FF00]" />
              <h3 className="text-sm font-bold text-white">How to Replicate in Ableton Live 12</h3>
            </div>
            <p className="text-xs text-[#888]">
              Follow these exact sequential steps inside your Ableton Live 12 project to recreate the identical sound:
            </p>
            <div className="space-y-2 pt-1">
              {selectedExample.abletonStepByStep.map((step, sIdx) => (
                <div key={sIdx} className="flex items-start gap-2.5 text-xs text-[#CCC] bg-[#121212] p-2.5 rounded border border-[#252525]">
                  <span className="font-mono text-[#90FF00] font-bold shrink-0">{sIdx + 1}.</span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Concept Quiz */}
          {currentLesson.quizQuestions.length > 0 && (
            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#00E5FF]" />
                <h3 className="text-sm font-bold text-white">Device Mastery Check</h3>
              </div>
              {currentLesson.quizQuestions.map((q) => {
                const selected = selectedAnswers[q.id];
                const submitted = quizSubmitted[q.id];
                const isCorrect = selected === q.correctIndex;

                return (
                  <div key={q.id} className="bg-[#121212] p-4 rounded-lg border border-[#2A2A2A] space-y-3">
                    <p className="text-xs font-semibold text-white leading-relaxed">{q.question}</p>
                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-[#1A1A1A] border-[#333] text-[#CCC] hover:bg-[#222]';
                        if (submitted) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-[#1E3A1E] border-[#90FF00] text-[#90FF00] font-bold';
                          } else if (optIdx === selected) {
                            btnStyle = 'bg-[#3A1E1E] border-[#FF4D4D] text-[#FF9999]';
                          }
                        } else if (selected === optIdx) {
                          btnStyle = 'bg-[#252525] border-[#00E5FF] text-white font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={submitted}
                            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`w-full text-left p-2.5 rounded text-xs border transition-colors cursor-pointer flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {submitted && optIdx === q.correctIndex && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#90FF00] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {!submitted && selected !== undefined && (
                      <button
                        onClick={() => setQuizSubmitted((prev) => ({ ...prev, [q.id]: true }))}
                        className="px-3.5 py-1.5 rounded bg-[#90FF00] text-black font-bold text-xs cursor-pointer hover:bg-[#7BD600] transition-colors"
                      >
                        Submit Answer
                      </button>
                    )}

                    {submitted && (
                      <div className={`p-2.5 rounded text-xs leading-relaxed border ${
                        isCorrect ? 'bg-[#182818] border-[#90FF00]/40 text-[#90FF00]' : 'bg-[#281818] border-[#FF5555]/40 text-[#FF9999]'
                      }`}>
                        <div className="font-bold font-mono uppercase mb-0.5">
                          {isCorrect ? '✓ Correct!' : '✗ Explanation:'}
                        </div>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Real Audio Experimentation Lab (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5 space-y-5 sticky top-4 shadow-xl">
            {/* Audition Header */}
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-[#00E5FF]">
                  <Volume2 className="w-4 h-4" />
                  <span>Real Audio Audition Rack</span>
                </div>
                <div className="text-[11px] text-[#888] font-mono mt-0.5">
                  Web Audio Synthesizer • Live Parameters
                </div>
              </div>

              {/* A/B Bypass Button */}
              <button
                onClick={handleToggleBypass}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer border ${
                  isBypassed
                    ? 'bg-[#FF4444]/20 border-[#FF4444] text-[#FF8888]'
                    : 'bg-[#121212] border-[#333] text-[#888] hover:text-white'
                }`}
                title="A/B compare dry audio vs processed device audio"
              >
                {isBypassed ? 'BYPASS ON (DRY)' : 'BYPASS OFF (WET)'}
              </button>
            </div>

            {/* Practical Example Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-[#777] font-bold">
                Practical Lesson Example
              </label>
              <div className="flex flex-col gap-1.5">
                {currentLesson.practicalExamples.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => handleSelectExample(ex)}
                    className={`text-left p-2.5 rounded border transition-all cursor-pointer ${
                      selectedExample.id === ex.id
                        ? 'bg-[#242424] border-[#90FF00] text-white'
                        : 'bg-[#121212] border-[#282828] text-[#888] hover:bg-[#181818]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{ex.title}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#161616] text-[#90FF00] border border-[#333]">
                        {ex.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#888] mt-1 line-clamp-2 leading-relaxed">
                      {ex.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time Oscilloscope Canvas */}
            <div className="bg-[#0C0C0C] border border-[#282828] rounded-lg p-2 space-y-1">
              <div className="flex items-center justify-between px-1 text-[10px] font-mono text-[#666]">
                <span>AUDIO OSCILLOSCOPE & FFT</span>
                <span>{isPlaying ? (isBypassed ? 'MONITORING DRY' : 'MONITORING WET') : 'IDLE'}</span>
              </div>
              <canvas
                ref={canvasRef}
                width={380}
                height={90}
                className="w-full h-[90px] rounded bg-black"
              />
            </div>

            {/* Primary Audition Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-mono font-bold text-xs cursor-pointer transition-all ${
                  isPlaying
                    ? 'bg-[#FF3333] hover:bg-[#DD2222] text-white shadow-lg'
                    : 'bg-[#90FF00] hover:bg-[#7AD400] text-black shadow-lg'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>STOP LOOP</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>PLAY DEMO PATTERN ({selectedExample.demoPattern.bpm} BPM)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetParams}
                className="p-2.5 rounded-lg bg-[#141414] border border-[#2E2E2E] text-[#888] hover:text-white cursor-pointer transition-colors"
                title="Reset parameters to example defaults"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Instant Note Audition Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-mono text-[#777] uppercase flex items-center justify-between">
                <span>Direct Key Audition</span>
                <span>Click to test note</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {['F#1', 'A1', 'C2', 'F#2'].map((pitch) => (
                  <button
                    key={pitch}
                    onClick={() => handleAuditionNote(pitch)}
                    className="py-1.5 px-2 rounded bg-[#141414] border border-[#282828] text-xs font-mono font-bold text-[#CCC] hover:border-[#00E5FF] hover:text-[#00E5FF] cursor-pointer transition-all active:scale-95"
                  >
                    {pitch}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Parameter Sliders */}
            <div className="space-y-3.5 pt-2 border-t border-[#252525]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Device Parameters
                </span>
                <span className="text-[10px] text-[#888] font-mono">Live DSP Control</span>
              </div>

              <div className="space-y-3">
                {selectedExample.parameterControls.map((ctrl) => {
                  const val = activeParams[ctrl.id] ?? (ctrl.min || 0);

                  return (
                    <div key={ctrl.id} className="bg-[#121212] p-3 rounded-lg border border-[#222] space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{ctrl.name}</span>
                        <span className="font-mono font-bold text-[#90FF00]">
                          {val} {ctrl.unit}
                        </span>
                      </div>

                      <input
                        type="range"
                        min={ctrl.min ?? 0}
                        max={ctrl.max ?? 100}
                        step={ctrl.step ?? 1}
                        value={val}
                        onChange={(e) => handleParamChange(ctrl.id, Number(e.target.value))}
                        className="w-full h-1.5 bg-[#252525] rounded-lg appearance-none cursor-pointer accent-[#90FF00]"
                      />

                      <div className="text-[10px] text-[#777] leading-tight font-mono">
                        {ctrl.learnMoreTip}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Custom Experiment Generator */}
            <div className="bg-[#121212] border border-[#2E2E2E] rounded-lg p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                  <Wand2 className="w-3.5 h-3.5 text-[#90FF00]" />
                  <span>AI Experiment Generator</span>
                </div>
                <span className="text-[9px] font-mono text-[#00E5FF] uppercase">AIService</span>
              </div>

              <p className="text-xs text-[#888]">
                Generate an algorithmic sound design variation with altered harmonic balance to test this device's versatility.
              </p>

              <button
                disabled={isGenerating}
                onClick={handleGenerateExperiment}
                className="w-full py-2 px-3 rounded bg-[#202020] hover:bg-[#282828] border border-[#3A3A3A] text-xs font-mono font-bold text-[#90FF00] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Synthesizing Experiment...' : 'Generate New Experiment'}</span>
              </button>

              {aiExplanationText && (
                <div className="p-2.5 rounded bg-[#181818] border border-[#333] text-xs text-[#CCC] space-y-1 font-mono">
                  <div className="text-[10px] font-bold text-[#00E5FF] uppercase">AI Coach Insights:</div>
                  <div className="whitespace-pre-line text-[11px] leading-relaxed">{aiExplanationText}</div>
                </div>
              )}
            </div>

            {/* Ask AI Coach Shortcut */}
            {onOpenCoachWithPrompt && (
              <button
                onClick={() => onOpenCoachWithPrompt(`Explain how to optimize ${currentLesson.name} for modern Psytrance and Techno production in Ableton Live 12.`)}
                className="w-full py-2 px-3 rounded bg-[#141414] hover:bg-[#1C1C1C] border border-[#282828] text-xs text-[#AAA] hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-colors font-mono"
              >
                <span>Ask AI Coach About {currentLesson.name}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
