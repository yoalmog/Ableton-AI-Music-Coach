import React, { useState } from 'react';
import {
  Play,
  Download,
  Lock,
  Unlock,
  Wand2,
  Trash2,
  Plus,
  Sliders,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { MidiNote, MidiPattern, KeyType, ScaleType } from '../../types';
import { parseNoteToMidiNumber, midiService } from '../../services/midiService';
import { audioService } from '../../services/audioService';

interface PianoRollEditorProps {
  pattern: MidiPattern;
  onChange: (updatedPattern: MidiPattern) => void;
  rootKey: KeyType;
  scale: ScaleType;
}

// Full 2 octave rows from C1 to B2 for grid display
const PITCH_ROWS = [
  'B2', 'A#2', 'A2', 'G#2', 'G2', 'F#2', 'F2', 'E2', 'D#2', 'D2', 'C#2', 'C2',
  'B1', 'A#1', 'A1', 'G#1', 'G1', 'F#1', 'F1', 'E1', 'D#1', 'D1', 'C#1', 'C1',
];

const SCALE_SEMITONES: Record<ScaleType, number[]> = {
  'Minor': [0, 2, 3, 5, 7, 8, 10],
  'Phrygian': [0, 1, 3, 5, 7, 8, 10],
  'Dorian': [0, 2, 3, 5, 7, 9, 10],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
  'Phrygian Dominant': [0, 1, 4, 5, 7, 8, 10],
  'Aeolian': [0, 2, 3, 5, 7, 8, 10],
  'Major': [0, 2, 4, 5, 7, 9, 11],
  'Locrian': [0, 1, 3, 5, 6, 8, 10],
};

const NOTE_NAME_TO_SEMITONE: Record<string, number> = {
  'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
  'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
};

export const PianoRollEditor: React.FC<PianoRollEditorProps> = ({
  pattern,
  onChange,
  rootKey,
  scale,
}) => {
  const [scaleLockEnabled, setScaleLockEnabled] = useState(true);
  const [selectedGridSnap, setSelectedGridSnap] = useState<number>(0.25); // 0.25 = 16th note
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(null);

  const totalBeats = 4; // 1 bar = 4 beats
  const totalSubdivisions = totalBeats / selectedGridSnap;

  // Check if a pitch string is inside the selected root key and scale
  const isPitchInScale = (pitchStr: string) => {
    const noteNameMatch = pitchStr.match(/^([A-G][#]?)/);
    if (!noteNameMatch) return true;
    const noteName = noteNameMatch[1];
    const rootSemitone = NOTE_NAME_TO_SEMITONE[rootKey] ?? 0;
    const noteSemitone = NOTE_NAME_TO_SEMITONE[noteName] ?? 0;

    const interval = (noteSemitone - rootSemitone + 12) % 12;
    const allowedIntervals = SCALE_SEMITONES[scale] || SCALE_SEMITONES['Minor'];
    return allowedIntervals.includes(interval);
  };

  const handleGridCellClick = (pitch: string, beatIndex: number) => {
    const time = beatIndex * selectedGridSnap;
    const existingIndex = pattern.notes.findIndex(
      (n) => n.pitch === pitch && Math.abs(n.time - time) < 0.05
    );

    if (existingIndex >= 0) {
      // Remove note
      const updatedNotes = pattern.notes.filter((_, idx) => idx !== existingIndex);
      onChange({ ...pattern, notes: updatedNotes });
      setSelectedNoteIndex(null);
    } else {
      // Add note
      const newNote: MidiNote = {
        pitch,
        time,
        duration: selectedGridSnap,
        velocity: 100,
      };
      const updatedNotes = [...pattern.notes, newNote];
      onChange({ ...pattern, notes: updatedNotes });
      audioService.playPsyBassNote(pitch, 0, selectedGridSnap * 0.8);
    }
  };

  // Transpose all notes up or down semitones
  const handleTranspose = (semitones: number) => {
    const updatedNotes = pattern.notes.map((n) => {
      const midiNum = parseNoteToMidiNumber(n.pitch) + semitones;
      const octave = Math.floor(midiNum / 12) - 1;
      const notesArray = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const name = notesArray[midiNum % 12];
      return { ...n, pitch: `${name}${octave}` };
    });
    onChange({ ...pattern, notes: updatedNotes });
  };

  // Quantize all notes to grid
  const handleQuantize = () => {
    const updatedNotes = pattern.notes.map((n) => {
      const quantizedTime = Math.round(n.time / selectedGridSnap) * selectedGridSnap;
      return { ...n, time: quantizedTime };
    });
    onChange({ ...pattern, notes: updatedNotes });
  };

  // Humanize velocity
  const handleHumanize = () => {
    const updatedNotes = pattern.notes.map((n) => {
      const delta = Math.floor(Math.random() * 20) - 10; // -10 to +10
      const velocity = Math.min(127, Math.max(40, n.velocity + delta));
      return { ...n, velocity };
    });
    onChange({ ...pattern, notes: updatedNotes });
  };

  // Snap all notes to current scale lock
  const handleSnapToScale = () => {
    const rootSemitone = NOTE_NAME_TO_SEMITONE[rootKey] ?? 0;
    const allowedIntervals = SCALE_SEMITONES[scale] || SCALE_SEMITONES['Minor'];
    const notesArray = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    const updatedNotes = pattern.notes.map((n) => {
      const midiNum = parseNoteToMidiNumber(n.pitch);
      let noteSemitone = midiNum % 12;
      let interval = (noteSemitone - rootSemitone + 12) % 12;

      if (!allowedIntervals.includes(interval)) {
        // Find nearest allowed interval
        let closestInterval = allowedIntervals[0];
        let minDiff = 99;
        allowedIntervals.forEach((allowed) => {
          const diff = Math.abs(allowed - interval);
          if (diff < minDiff) {
            minDiff = diff;
            closestInterval = allowed;
          }
        });
        const targetSemitone = (rootSemitone + closestInterval) % 12;
        const octave = Math.floor(midiNum / 12) - 1;
        const newPitch = `${notesArray[targetSemitone]}${octave}`;
        return { ...n, pitch: newPitch };
      }
      return n;
    });

    onChange({ ...pattern, notes: updatedNotes });
  };

  const handlePlayPattern = () => {
    audioService.playMidiPattern(pattern.notes, pattern.bpm);
  };

  const handleExportMidi = async () => {
    await midiService.exportPattern(pattern);
  };

  return (
    <div className="bg-[#181818] border border-[#333] rounded-lg p-4 space-y-4 font-sans select-none">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#333] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPattern}
            className="px-3 py-1.5 bg-[#90FF00] hover:bg-[#a6ff26] text-black text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>PREVIEW AUDIO</span>
          </button>

          <button
            onClick={handleExportMidi}
            className="px-3 py-1.5 bg-[#252525] hover:bg-[#333] border border-[#444] text-[#00E5FF] text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT .MID</span>
          </button>
        </div>

        {/* Grid & Scale Lock Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-[#888]">
            <span className="font-mono">GRID:</span>
            <select
              value={selectedGridSnap}
              onChange={(e) => setSelectedGridSnap(Number(e.target.value))}
              className="bg-[#121212] border border-[#333] rounded px-2 py-1 text-xs text-white font-mono"
            >
              <option value={1}>1/4 Beat</option>
              <option value={0.5}>1/8 Note</option>
              <option value={0.25}>1/16 Note</option>
              <option value={0.125}>1/32 Note</option>
            </select>
          </div>

          <button
            onClick={() => setScaleLockEnabled(!scaleLockEnabled)}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              scaleLockEnabled
                ? 'bg-[#90FF00]/10 text-[#90FF00] border border-[#90FF00]/40'
                : 'bg-[#222] text-[#666] border border-[#333]'
            }`}
          >
            {scaleLockEnabled ? <Lock className="w-3.5 h-3.5 text-[#90FF00]" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>SCALE LOCK ({rootKey} {scale})</span>
          </button>
        </div>
      </div>

      {/* Action Tools Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-[#121212] p-2 rounded border border-[#2A2A2A] text-xs">
        <button
          onClick={handleQuantize}
          className="px-2.5 py-1 bg-[#222] hover:bg-[#333] text-[#CCC] rounded font-mono cursor-pointer"
        >
          QUANTIZE
        </button>

        <button
          onClick={handleHumanize}
          className="px-2.5 py-1 bg-[#222] hover:bg-[#333] text-[#CCC] rounded font-mono cursor-pointer"
        >
          HUMANIZE VELOCITY
        </button>

        <button
          onClick={handleSnapToScale}
          className="px-2.5 py-1 bg-[#222] hover:bg-[#333] text-[#90FF00] rounded font-mono flex items-center gap-1 cursor-pointer"
        >
          <Wand2 className="w-3 h-3 text-[#90FF00]" />
          <span>SNAP TO SCALE</span>
        </button>

        <div className="flex items-center gap-1 border-l border-[#333] pl-2 ml-auto">
          <span className="text-[10px] font-mono text-[#666]">OCTAVE:</span>
          <button
            onClick={() => handleTranspose(12)}
            className="p-1 bg-[#222] hover:bg-[#333] text-white rounded cursor-pointer"
            title="Transpose +1 Octave"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleTranspose(-12)}
            className="p-1 bg-[#222] hover:bg-[#333] text-white rounded cursor-pointer"
            title="Transpose -1 Octave"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Grid Canvas Matrix */}
      <div className="overflow-x-auto border border-[#333] rounded bg-[#0E0E0E]">
        <div className="min-w-[640px]">
          {PITCH_ROWS.map((pitch) => {
            const pitchInScale = isPitchInScale(pitch);
            if (scaleLockEnabled && !pitchInScale) {
              return null; // Hide non-scale rows when scale lock is active
            }

            return (
              <div key={pitch} className="flex h-6 border-b border-[#222] text-[10px] font-mono">
                {/* Pitch Label Sidebar */}
                <div
                  className={`w-16 shrink-0 border-r border-[#333] flex items-center px-2 font-bold select-none ${
                    pitchInScale ? 'bg-[#181818] text-[#90FF00]' : 'bg-[#121212] text-[#555]'
                  }`}
                >
                  {pitch}
                </div>

                {/* Subdivisions Row Cells */}
                <div className="flex-1 flex">
                  {Array.from({ length: totalSubdivisions }).map((_, stepIdx) => {
                    const cellTime = stepIdx * selectedGridSnap;
                    const hasNote = pattern.notes.some(
                      (n) => n.pitch === pitch && Math.abs(n.time - cellTime) < 0.05
                    );
                    const isQuarterBeat = stepIdx % (1 / selectedGridSnap) === 0;

                    return (
                      <div
                        key={stepIdx}
                        onClick={() => handleGridCellClick(pitch, stepIdx)}
                        className={`flex-1 border-r h-full cursor-pointer transition-colors ${
                          isQuarterBeat ? 'border-[#333]' : 'border-[#1A1A1A]'
                        } ${
                          hasNote
                            ? 'bg-[#90FF00] hover:bg-[#a6ff26] shadow-[0_0_8px_rgba(144,255,0,0.5)]'
                            : 'hover:bg-[#252525]'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#666]">
        <span>TOTAL NOTES: {pattern.notes.length}</span>
        <span>GRID SNAP: {selectedGridSnap} BEAT</span>
      </div>
    </div>
  );
};
