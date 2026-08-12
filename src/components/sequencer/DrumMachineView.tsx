import { parseNoteToMidiNumber } from '../../services/midiService';
import React from 'react';
import {
  Grid,
  Play,
  Square,
  Download,
  RotateCcw,
  Volume2,
  Sliders,
  Check
} from 'lucide-react';
import { DrumPattern, DrumTrack, AAMCProject } from '../../types';
import { audioService } from '../../services/audioService';
import { midiService } from '../../services/midiService';
import { useLanguage } from '../../context/LanguageContext';

interface DrumMachineViewProps {
  project: AAMCProject;
  onProjectChange: (p: AAMCProject) => void;
}

export const DrumMachineView: React.FC<DrumMachineViewProps> = ({
  project,
  onProjectChange,
}) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [bpm, setBpm] = React.useState(project.bpm || 142);
  const [swing, setSwing] = React.useState(0);
  const [exportSuccess, setExportSuccess] = React.useState(false);

  // Initialize 16-step drum pattern
  const [drumPattern, setDrumPattern] = React.useState<DrumPattern>(() => {
    const defaultTracks: DrumTrack[] = [
      {
        id: 'kick',
        name: 'Psy Kick',
        midiPitch: 'C1',
        steps: Array.from({ length: 16 }, (_, i) => ({ active: i % 4 === 0, velocity: 120 })),
      },
      {
        id: 'hat_closed',
        name: 'Cyber Hat',
        midiPitch: 'F#1',
        steps: Array.from({ length: 16 }, (_, i) => ({ active: i % 2 === 1, velocity: 95 })),
      },
      {
        id: 'clap',
        name: 'Snare / Clap',
        midiPitch: 'D1',
        steps: Array.from({ length: 16 }, (_, i) => ({ active: i === 4 || i === 12, velocity: 110 })),
      },
      {
        id: 'perc',
        name: 'Goa Percussion',
        midiPitch: 'A#1',
        steps: Array.from({ length: 16 }, (_, i) => ({ active: i === 6 || i === 14, velocity: 85 })),
      },
    ];

    return {
      id: `drum_${Date.now()}`,
      name: `${project.genre} 16-Step Drum Groove`,
      genre: project.genre,
      bpm,
      tracks: defaultTracks,
      swing: 0,
    };
  });

  const currentStepRef = React.useRef(currentStep);
  React.useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  // Step Sequencer Playback Interval
  React.useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      const intervalMs = (60000 / bpm) / 4; // 16th notes
      timer = setInterval(() => {
        const next = (currentStepRef.current + 1) % 16;
        setCurrentStep(next);

        // Trigger audio for active steps at 'next'
        drumPattern.tracks.forEach((tr) => {
          if (tr.steps[next]?.active) {
            if (tr.id === 'kick') audioService.playKick(0);
            else if (tr.id === 'hat_closed') audioService.playHiHat(0, false);
            else if (tr.id === 'clap') audioService.playHiHat(0, true);
            else audioService.playPsyBassNote('G2', 0, 0.08);
          }
        });
      }, intervalMs);
    } else {
      setCurrentStep(0);
    }
    return () => clearInterval(timer);
  }, [isPlaying, bpm, drumPattern]);

  const toggleStep = (trackId: string, stepIndex: number) => {
    setDrumPattern((prev) => ({
      ...prev,
      tracks: prev.tracks.map((tr) => {
        if (tr.id !== trackId) return tr;
        const newSteps = [...tr.steps];
        newSteps[stepIndex] = {
          ...newSteps[stepIndex],
          active: !newSteps[stepIndex].active,
        };
        return { ...tr, steps: newSteps };
      }),
    }));
  };

  const handleExportMidi = async () => {
    const ok = await midiService.exportDrumPattern(drumPattern);
    if (ok) {
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2500);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-[#E0E0E0] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A1A1A] border border-[#333] p-5 rounded-lg">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#90FF00] uppercase tracking-widest font-mono">
            <Grid className="w-3.5 h-3.5" />
            <span>{t('drumGen.banner')}</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">{t('drumGen.title')}</h1>
          <p className="text-xs text-[#888] mt-0.5">
            {t('drumGen.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-wider ${
              isPlaying
                ? 'bg-[#FF3366] text-white'
                : 'bg-[#90FF00] hover:bg-[#80e600] text-black'
            }`}
          >
            {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? t('drumGen.stop') : t('drumGen.start')}</span>
          </button>

          <button
            onClick={handleExportMidi}
            className="bg-[#252525] hover:bg-[#333] text-[#00E5FF] border border-[#444] px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-wider"
          >
            {exportSuccess ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{exportSuccess ? t('drumGen.exported') : t('drumGen.export')}</span>
          </button>
        </div>
      </div>

      {/* Sequencer Grid */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-5">
        {/* Top Controls */}
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-[#666] uppercase font-mono block">{t('drumGen.tempo')}</span>
              <span className="text-xs font-bold font-mono text-[#90FF00]">{bpm} BPM</span>
            </div>

            <div className="h-5 w-px bg-[#333]" />

            <div>
              <span className="text-[10px] text-[#666] uppercase font-mono block">{t('drumGen.activeStep')}</span>
              <span className="text-xs font-bold font-mono text-[#00E5FF]">Step {currentStep + 1} / 16</span>
            </div>
          </div>

          <div className="text-[10px] text-[#888] font-mono bg-[#121212] border border-[#333] px-3 py-1 rounded">
            {t('drumGen.pitchMap')}
          </div>
        </div>

        {/* Tracks Step Grid */}
        <div className="space-y-3">
          {drumPattern.tracks.map((tr) => (
            <div key={tr.id} className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#90FF00]" />
                  <span>{tr.name}</span>
                  <span className="text-[10px] font-mono text-[#666]">({tr.midiPitch})</span>
                </div>
              </div>

              {/* 16 Step Buttons */}
              <div className="grid grid-cols-16 gap-1.5 pt-1">
                {tr.steps.map((st, stepIdx) => {
                  const isCurrent = currentStep === stepIdx && isPlaying;
                  const beatGroup = Math.floor(stepIdx / 4);
                  return (
                    <button
                      key={stepIdx}
                      onClick={() => toggleStep(tr.id, stepIdx)}
                      className={`h-10 rounded-xs flex flex-col items-center justify-center text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                        st.active
                          ? isCurrent
                            ? 'bg-white text-black border-[#90FF00] scale-105 shadow'
                            : 'bg-[#90FF00] text-black border-[#90FF00]'
                          : isCurrent
                          ? 'bg-[#333] text-[#00E5FF] border-[#00E5FF]'
                          : beatGroup % 2 === 0
                          ? 'bg-[#1A1A1A] border-[#2A2A2A] text-[#666] hover:border-[#444]'
                          : 'bg-[#151515] border-[#2A2A2A] text-[#666] hover:border-[#444]'
                      }`}
                      title={`Step ${stepIdx + 1}`}
                    >
                      <span>{stepIdx + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
