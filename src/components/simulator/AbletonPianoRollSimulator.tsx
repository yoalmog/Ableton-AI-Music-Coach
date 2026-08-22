import React, { useState } from 'react';
import { MidiNote, KeyType, ScaleType } from '../../types';
import { Play, Trash2, CheckCircle2, RotateCcw, Volume2, Sparkles } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface AbletonPianoRollSimulatorProps {
  notes: MidiNote[];
  onChangeNotes: (notes: MidiNote[]) => void;
  onValidate?: () => void;
  rootKey?: KeyType;
  scale?: ScaleType;
  bpm?: number;
  expectedPatternDesc?: string;
  isRTL?: boolean;
}

const PITCHES = ['B1', 'A#1', 'A1', 'G#1', 'G1', 'F#1', 'F1', 'E1', 'D#1', 'D1', 'C#1', 'C1'];
const STEPS = 16; // 1 Bar of 16th notes (0.0, 0.25, 0.5, 0.75, 1.0, 1.25, etc.)

export const AbletonPianoRollSimulator: React.FC<AbletonPianoRollSimulatorProps> = ({
  notes,
  onChangeNotes,
  onValidate,
  rootKey = 'F#',
  scale = 'Minor',
  bpm = 142,
  expectedPatternDesc,
  isRTL = false,
}) => {
  const [selectedVelocity, setSelectedVelocity] = useState<number>(100);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);

  const toggleNote = (pitch: string, stepIndex: number) => {
    const time = stepIndex * 0.25; // 16th note step
    const existingIndex = notes.findIndex(
      (n) => n.pitch === pitch && Math.abs(n.time - time) < 0.1
    );

    let updated: MidiNote[];
    if (existingIndex >= 0) {
      // Remove note
      updated = notes.filter((_, i) => i !== existingIndex);
    } else {
      // Add note
      const newNote: MidiNote = {
        pitch,
        time,
        duration: 0.25,
        velocity: selectedVelocity,
      };
      updated = [...notes, newNote];

      // Play audio synth preview for feedback
      try {
        audioService.playPsyBassNote(pitch, 0, 0.18);
      } catch (e) {
        // audio context fallback
      }
    }

    onChangeNotes(updated);
  };

  const handleClear = () => {
    onChangeNotes([]);
  };

  const handleQuantize = () => {
    // Snap all notes to exact 0.25 grid
    const quantized = notes.map((n) => ({
      ...n,
      time: Math.round(n.time / 0.25) * 0.25,
      duration: 0.25,
    }));
    onChangeNotes(quantized);
  };

  const handlePresetRollingBass = () => {
    const pattern: MidiNote[] = [
      { pitch: 'F#1', time: 0.25, duration: 0.25, velocity: 95 },
      { pitch: 'F#1', time: 0.5, duration: 0.25, velocity: 105 },
      { pitch: 'F#1', time: 0.75, duration: 0.25, velocity: 100 },
      { pitch: 'F#1', time: 1.25, duration: 0.25, velocity: 95 },
      { pitch: 'F#1', time: 1.5, duration: 0.25, velocity: 105 },
      { pitch: 'F#1', time: 1.75, duration: 0.25, velocity: 100 },
      { pitch: 'F#1', time: 2.25, duration: 0.25, velocity: 95 },
      { pitch: 'F#1', time: 2.5, duration: 0.25, velocity: 105 },
      { pitch: 'F#1', time: 2.75, duration: 0.25, velocity: 100 },
      { pitch: 'F#1', time: 3.25, duration: 0.25, velocity: 95 },
      { pitch: 'F#1', time: 3.5, duration: 0.25, velocity: 105 },
      { pitch: 'F#1', time: 3.75, duration: 0.25, velocity: 100 },
    ];
    onChangeNotes(pattern);
  };

  return (
    <div className="w-full h-full bg-[#1A1A1A] flex flex-col text-gray-200 font-sans select-none border border-[#2E2E2E]">
      {/* Top MIDI Editor Bar (Ableton Live 12 Styled) */}
      <div className="h-9 px-3 bg-[#242424] border-b border-[#303030] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#FFE853] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#FFE853]" />
            <span>CLIP: 2-Bass (MIDI Editor)</span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">Scale: {rootKey} {scale}</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">Grid: 1/16</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePresetRollingBass}
            className="px-2 py-1 rounded bg-[#333] hover:bg-[#444] text-[#FFE853] text-[11px] font-mono flex items-center gap-1 cursor-pointer"
            title="Load Rolling Bass Pattern"
          >
            <Sparkles className="w-3 h-3 text-[#FFE853]" />
            <span>Psy 16th Preset</span>
          </button>
          <button
            onClick={handleQuantize}
            className="px-2 py-1 rounded bg-[#333] hover:bg-[#444] text-gray-200 text-[11px] font-mono cursor-pointer"
          >
            Quantize
          </button>
          <button
            onClick={handleClear}
            className="px-2 py-1 rounded bg-[#333] hover:bg-[#444] text-red-400 hover:text-red-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Grid Timeline Header (Beats 1.1, 1.2, 1.3, 1.4...) */}
      <div className="h-6 bg-[#202020] border-b border-[#2C2C2C] flex">
        <div className="w-16 shrink-0 border-r border-[#2C2C2C] bg-[#1C1C1C] flex items-center justify-center text-[10px] text-gray-400 font-mono">
          KEYS
        </div>
        <div className="flex-1 grid grid-cols-16 text-[10px] text-gray-400 font-mono divide-x divide-[#282828]">
          {Array.from({ length: STEPS }).map((_, step) => {
            const beat = Math.floor(step / 4) + 1;
            const sub = (step % 4) + 1;
            const isKickSlot = sub === 1;
            return (
              <div
                key={step}
                className={`flex items-center justify-center ${
                  isKickSlot ? 'bg-[#282828] text-[#00E5FF] font-bold' : ''
                }`}
              >
                {beat}.{sub}
              </div>
            );
          })}
        </div>
      </div>

      {/* Piano Roll Grid Canvas */}
      <div className="flex-1 overflow-y-auto min-h-0 flex bg-[#161616]">
        {/* Left Piano Keyboard Strip */}
        <div className="w-16 shrink-0 bg-[#1C1C1C] border-r border-[#2E2E2E] flex flex-col divide-y divide-[#282828]">
          {PITCHES.map((pitch) => {
            const isSharp = pitch.includes('#');
            const isRoot = pitch.startsWith(rootKey);
            return (
              <div
                key={pitch}
                className={`h-7 flex items-center justify-between px-2 text-[11px] font-mono select-none ${
                  isRoot
                    ? 'bg-[#FFE853]/20 text-[#FFE853] font-bold border-l-2 border-[#FFE853]'
                    : isSharp
                    ? 'bg-[#121212] text-gray-400'
                    : 'bg-[#2A2A2A] text-gray-200'
                }`}
              >
                <span>{pitch}</span>
                {isRoot && <span className="text-[9px] text-[#FFE853]">ROOT</span>}
              </div>
            );
          })}
        </div>

        {/* Note Grid Matrix */}
        <div className="flex-1 flex flex-col divide-y divide-[#242424]">
          {PITCHES.map((pitch) => {
            const isRoot = pitch.startsWith(rootKey);
            return (
              <div key={pitch} className="h-7 grid grid-cols-16 divide-x divide-[#242424]">
                {Array.from({ length: STEPS }).map((_, step) => {
                  const time = step * 0.25;
                  const isKickStep = (step % 4) === 0;
                  const hasNote = notes.some(
                    (n) => n.pitch === pitch && Math.abs(n.time - time) < 0.1
                  );

                  return (
                    <div
                      key={step}
                      onClick={() => toggleNote(pitch, step)}
                      className={`relative cursor-pointer transition-colors ${
                        hasNote
                          ? 'bg-[#FFE853] hover:bg-[#FFF280] shadow-[inset_0_0_0_1px_#000]'
                          : isKickStep
                          ? 'bg-[#1E1E1E] hover:bg-[#282828]'
                          : isRoot
                          ? 'bg-[#191919] hover:bg-[#242424]'
                          : 'hover:bg-[#222222]'
                      }`}
                    >
                      {/* Note Graphic Bar */}
                      {hasNote && (
                        <div className="absolute inset-0.5 rounded-sm bg-[#FFE853] flex items-center justify-center text-[9px] text-black font-bold font-mono">
                          {pitch}
                        </div>
                      )}
                      {/* Beat 1 Kick Marker for Educational Psytrance Layout */}
                      {isKickStep && !hasNote && (
                        <div className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-600 font-mono pointer-events-none opacity-40">
                          KICK
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Velocity Strip */}
      <div className="h-10 bg-[#1F1F1F] border-t border-[#2E2E2E] px-3 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-[11px]">VELOCITY:</span>
          <input
            type="range"
            min="1"
            max="127"
            value={selectedVelocity}
            onChange={(e) => setSelectedVelocity(Number(e.target.value))}
            className="w-28 accent-[#FFE853] cursor-pointer"
          />
          <span className="text-[#FFE853] font-bold">{selectedVelocity}</span>
        </div>

        <div className="text-[11px] text-gray-400">
          Notes Placed: <span className="text-white font-bold">{notes.length}</span>
        </div>
      </div>
    </div>
  );
};
