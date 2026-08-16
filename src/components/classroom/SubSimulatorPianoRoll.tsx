import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Grid, Sliders, Volume2 } from 'lucide-react';
import { MidiNote } from '../../types';
import { audioSynthesizer } from '../../utils/audioSynthesizer';
import { useLanguage } from '../../context/LanguageContext';

interface SubSimulatorPianoRollProps {
  onNoteDraw?: (note: MidiNote) => void;
  isHighlighted?: boolean;
}

const PITCHES = ['C4', 'B3', 'A#3', 'A3', 'G#3', 'G3', 'F#3', 'F3', 'E3', 'D#3', 'D3', 'C3'];

export const SubSimulatorPianoRoll: React.FC<SubSimulatorPianoRollProps> = ({
  onNoteDraw,
  isHighlighted = false
}) => {
  const { t, isRTL } = useLanguage();
  const [notes, setNotes] = useState<MidiNote[]>([
    { pitch: 'C3', time: 0, duration: 1, velocity: 100 },
    { pitch: 'G3', time: 1, duration: 1, velocity: 90 },
    { pitch: 'A#3', time: 2, duration: 1, velocity: 95 },
    { pitch: 'C4', time: 3, duration: 1, velocity: 110 }
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBeat, setActiveBeat] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveBeat(prev => {
          const next = (prev + 1) % 16;
          // Play any notes on this beat
          notes.filter(n => Math.floor(n.time) === next).forEach(n => {
            audioSynthesizer.playNote(n.pitch, 0.2);
          });
          return next;
        });
      }, 150);
    } else {
      setActiveBeat(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, notes]);

  const handleCellClick = (pitch: string, beatIndex: number) => {
    const existingIndex = notes.findIndex(n => n.pitch === pitch && Math.floor(n.time) === beatIndex);
    if (existingIndex >= 0) {
      // Remove note
      const updated = notes.filter((_, i) => i !== existingIndex);
      setNotes(updated);
    } else {
      // Add note
      const newNote: MidiNote = { pitch, time: beatIndex, duration: 1, velocity: 100 };
      const updated = [...notes, newNote];
      setNotes(updated);
      audioSynthesizer.playNote(pitch, 0.3);
      if (onNoteDraw) onNoteDraw(newNote);
    }
  };

  const handleQuantize = () => {
    const quantized = notes.map(n => ({
      ...n,
      time: Math.round(n.time)
    }));
    setNotes(quantized);
  };

  const handleClear = () => {
    setNotes([]);
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`bg-[#1E1E1E] border rounded-lg p-3 ${isHighlighted ? 'border-amber-400 ring-2 ring-amber-400/50 animate-pulse' : 'border-[#333]'}`}>
      {/* Piano Roll Header Controls */}
      <div className="flex items-center justify-between border-b border-[#333] pb-2 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-400 flex items-center gap-1">
            <Grid className="w-3.5 h-3.5" /> {t('simulator.interactivePianoRoll')}
          </span>
          <span className="text-[#888] text-[10px] hidden sm:inline">{t('simulator.pianoRollInstruction')}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition ${
              isPlaying ? 'bg-amber-500 text-black' : 'bg-[#2A2A2A] hover:bg-[#353535] text-gray-200'
            }`}
          >
            <Play className="w-3 h-3 fill-current" /> {isPlaying ? t('simulator.stop') : t('simulator.playLoop')}
          </button>
          <button
            onClick={handleQuantize}
            className="px-2 py-1 bg-[#2A2A2A] hover:bg-[#353535] text-gray-300 rounded text-[10px] font-mono"
            title={t('simulator.quantize16th')}
          >
            {t('simulator.quantize16th')}
          </button>
          <button
            onClick={handleClear}
            className="px-2 py-1 bg-[#2A2A2A] hover:bg-[#353535] text-red-400 rounded text-[10px] flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> {t('common.clear')}
          </button>
        </div>
      </div>

      {/* Grid Canvas Area */}
      <div className="flex border border-[#2B2B2B] rounded bg-[#151515] overflow-x-auto">
        {/* Piano Keys Column */}
        <div className="w-12 shrink-0 border-e border-[#2B2B2B] bg-[#1A1A1A] select-none">
          {PITCHES.map(pitch => {
            const isAccidental = pitch.includes('#');
            return (
              <div
                key={pitch}
                className={`h-6 text-[9px] font-mono flex items-center px-1 border-b border-[#252525] ${
                  isAccidental ? 'bg-[#111] text-[#777]' : 'bg-[#222] text-[#CCC]'
                }`}
              >
                {pitch}
              </div>
            );
          })}
        </div>

        {/* 4-Bar Grid Beat Columns (16 Steps) */}
        <div className="flex-1 min-w-[320px] grid grid-cols-16 relative">
          {Array.from({ length: 16 }).map((_, step) => (
            <div
              key={step}
              className={`border-e ${
                step % 4 === 3 ? 'border-[#3D3D3D]' : 'border-[#222]'
              } ${isPlaying && activeBeat === step ? 'bg-amber-500/10' : ''}`}
            >
              {PITCHES.map(pitch => {
                const hasNote = notes.some(
                  n => n.pitch === pitch && Math.floor(n.time) === step
                );
                return (
                  <div
                    key={`${pitch}-${step}`}
                    onClick={() => handleCellClick(pitch, step)}
                    className={`h-6 border-b border-[#222] cursor-pointer transition ${
                      hasNote
                        ? 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                        : 'hover:bg-amber-400/20'
                    }`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Velocity Row */}
      <div className="mt-2 pt-2 border-t border-[#2B2B2B] flex items-center justify-between text-[10px] text-[#888]">
        <span className="flex items-center gap-1"><Sliders className="w-3 h-3" /> {t('simulator.noteVelocity')}</span>
        <span className="text-amber-400/80 font-mono">{t('simulator.gridAlignment')}</span>
      </div>
    </div>
  );
};
