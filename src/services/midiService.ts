import { MidiNote, MidiPattern, DrumPattern, BassSettings, KeyType, ScaleType, AAMCProject } from '../types';
import { desktopService } from './desktopService';

// Standard MIDI constants
const TICKS_PER_QUARTER = 480;

// Note name to MIDI number map (C-1 = 0, C1 = 24, F#1 = 30)
const NOTE_TO_MIDI: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
  'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
};

export function parseNoteToMidiNumber(noteStr: string): number {
  if (!noteStr) return 36; // Default C2
  const match = noteStr.match(/^([A-G][#b]?)(-?\d+)$/i);
  if (!match) return 36;

  const noteName = match[1].toUpperCase();
  const octave = parseInt(match[2], 10);
  const semitone = NOTE_TO_MIDI[noteName] ?? 0;

  // MIDI note 60 is C4 (in standard DAW notation C1 = 24, C2 = 36)
  return (octave + 1) * 12 + semitone;
}

export const SCALE_INTERVALS: Record<string, number[]> = {
  Minor: [0, 2, 3, 5, 7, 8, 10],
  Phrygian: [0, 1, 3, 5, 7, 8, 10],
  Dorian: [0, 2, 3, 5, 7, 9, 10],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
  Aeolian: [0, 2, 3, 5, 7, 8, 10],
  Major: [0, 2, 4, 5, 7, 9, 11],
};

const MIDI_TO_NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function midiNumberToNoteString(midiNum: number): string {
  const octave = Math.floor(midiNum / 12) - 1;
  const semitone = midiNum % 12;
  return `${MIDI_TO_NOTE_NAMES[semitone]}${octave}`;
}

export function getScaleMidiNotes(rootKey: KeyType, scale: ScaleType, octaves: number[] = [1, 2, 3, 4]): number[] {
  const rootSemitone = NOTE_TO_MIDI[rootKey] ?? 6;
  const intervals = SCALE_INTERVALS[scale] || SCALE_INTERVALS.Minor;
  const result: number[] = [];

  octaves.forEach((oct) => {
    const baseMidi = (oct + 1) * 12 + rootSemitone;
    intervals.forEach((interval) => {
      result.push(baseMidi + interval);
    });
  });

  return result.sort((a, b) => a - b);
}

export function getScaleNoteStrings(rootKey: KeyType, scale: ScaleType, octaves: number[] = [1, 2, 3, 4]): string[] {
  return getScaleMidiNotes(rootKey, scale, octaves).map(midiNumberToNoteString);
}

interface MidiEventInternal {
  tick: number;
  type: 'noteOn' | 'noteOff';
  pitch: number;
  velocity: number;
  channel: number; // 0 - 15
}

export class MidiService {
  /**
   * Encodes an array of MIDI notes into a valid Standard MIDI File (.mid) binary ArrayBuffer
   */
  public createMidiFileBuffer(notes: MidiNote[], bpm: number = 142, channel: number = 0): ArrayBuffer {
    const events: MidiEventInternal[] = [];

    // Process all notes into noteOn and noteOff events
    notes.forEach((note) => {
      const pitch = parseNoteToMidiNumber(note.pitch);
      const startTick = Math.round(note.time * TICKS_PER_QUARTER);
      const durationTicks = Math.round(note.duration * TICKS_PER_QUARTER);
      const endTick = startTick + Math.max(10, durationTicks);

      events.push({
        tick: startTick,
        type: 'noteOn',
        pitch,
        velocity: Math.min(127, Math.max(1, note.velocity)),
        channel,
      });

      events.push({
        tick: endTick,
        type: 'noteOff',
        pitch,
        velocity: 0,
        channel,
      });
    });

    // Sort events by tick
    events.sort((a, b) => a.tick - b.tick);

    // Build MIDI File Header & Track Data
    const trackBytes: number[] = [];

    // Tempo Event (Set Tempo: microseconds per quarter note)
    const tempoMicroSec = Math.round(60000000 / bpm);
    trackBytes.push(
      0x00, // Delta time 0
      0xFF, 0x51, 0x03, // Meta event Set Tempo
      (tempoMicroSec >> 16) & 0xFF,
      (tempoMicroSec >> 8) & 0xFF,
      tempoMicroSec & 0xFF
    );

    let lastTick = 0;

    events.forEach((ev) => {
      const deltaTick = ev.tick - lastTick;
      lastTick = ev.tick;

      // Write variable length quantity (VLQ) for delta time
      const vlqBytes = this.toVLQ(deltaTick);
      trackBytes.push(...vlqBytes);

      // Status byte
      const statusByte = (ev.type === 'noteOn' ? 0x90 : 0x80) | (ev.channel & 0x0F);
      trackBytes.push(statusByte, ev.pitch & 0x7F, ev.velocity & 0x7F);
    });

    // End of Track Meta Event
    trackBytes.push(0x00, 0xFF, 0x2F, 0x00);

    // Construct full MIDI File Byte Array
    const headerBytes = [
      0x4D, 0x54, 0x68, 0x64, // "MThd"
      0x00, 0x00, 0x00, 0x06, // Chunk size 6
      0x00, 0x00,             // Format 0 (single track)
      0x00, 0x01,             // 1 Track
      (TICKS_PER_QUARTER >> 8) & 0xFF, TICKS_PER_QUARTER & 0xFF, // Ticks per quarter note
    ];

    const trackHeaderBytes = [
      0x4D, 0x54, 0x72, 0x6B, // "MTrk"
      (trackBytes.length >> 24) & 0xFF,
      (trackBytes.length >> 16) & 0xFF,
      (trackBytes.length >> 8) & 0xFF,
      trackBytes.length & 0xFF,
    ];

    const fullBytes = new Uint8Array([...headerBytes, ...trackHeaderBytes, ...trackBytes]);
    return fullBytes.buffer;
  }

  /**
   * Helper to write Variable Length Quantity for MIDI delta times
   */
  private toVLQ(value: number): number[] {
    let buffer = value & 0x7F;
    const bytes: number[] = [];
    while ((value >>= 7) > 0) {
      buffer <<= 8;
      buffer |= 0x80 | (value & 0x7F);
    }
    while (true) {
      bytes.push(buffer & 0xFF);
      if (buffer & 0x80) {
        buffer >>= 8;
      } else {
        break;
      }
    }
    return bytes;
  }

  /**
   * Export a complete AAMCProject to a MIDI file
   */
  public async exportProjectMidi(project: AAMCProject): Promise<boolean> {
    const allNotes: MidiNote[] = [];
    if (project.midiPatterns && project.midiPatterns.length > 0) {
      project.midiPatterns.forEach((pat) => {
        if (pat.notes) {
          allNotes.push(...pat.notes);
        }
      });
    }
    if (allNotes.length === 0) {
      const defaultNotes = this.generatePsyBassline('K-B-B-B', project.key || 'F#', project.bpm || 142);
      allNotes.push(...defaultNotes);
    }
    const buffer = this.createMidiFileBuffer(allNotes, project.bpm || 142);
    const fileName = `${(project.name || 'Project').replace(/\s+/g, '_')}_MIDI.mid`;
    return await desktopService.exportMIDI(fileName, buffer);
  }

  /**
   * Export a MidiPattern to a file
   */
  public async exportPattern(pattern: MidiPattern): Promise<boolean> {
    const buffer = this.createMidiFileBuffer(pattern.notes, pattern.bpm);
    const fileName = `${pattern.genre.replace(/\s+/g, '_')}_${pattern.type}_${pattern.name.replace(/\s+/g, '_')}.mid`;
    return await desktopService.exportMIDI(fileName, buffer);
  }

  /**
   * Convert Drum Sequencer Pattern to MIDI notes and export
   */
  public async exportDrumPattern(drumPattern: DrumPattern): Promise<boolean> {
    const notes: MidiNote[] = [];
    
    drumPattern.tracks.forEach((tr) => {
      tr.steps.forEach((step, stepIndex) => {
        if (step.active) {
          notes.push({
            pitch: tr.midiPitch,
            time: stepIndex * 0.25, // 16th note steps
            duration: 0.2,
            velocity: step.velocity || 100,
          });
        }
      });
    });

    const buffer = this.createMidiFileBuffer(notes, drumPattern.bpm, 9); // Channel 10 for MIDI drums
    const fileName = `${drumPattern.genre.replace(/\s+/g, '_')}_DrumRack_Pattern.mid`;
    return await desktopService.exportMIDI(fileName, buffer);
  }

  /**
   * Generate Rolling Psytrance Bassline MIDI Pattern
   */
  public generatePsyBassline(patternType: string, rootKey: KeyType, bpm: number = 142): MidiNote[] {
    const notes: MidiNote[] = [];
    const pitch = `${rootKey}1`; // Low bass octave

    // 4 bars of 16th notes
    const totalBars = 4;
    const totalSixteenths = totalBars * 16;

    for (let s = 0; s < totalSixteenths; s++) {
      const beatInBar = (s % 16);
      const isKickStep = (beatInBar % 4 === 0);

      if (patternType === 'K-B-B-B') {
        // Kick on 0, Bass on 1, 2, 3
        if (!isKickStep) {
          notes.push({
            pitch,
            time: s * 0.25,
            duration: 0.21,
            velocity: beatInBar % 2 === 1 ? 95 : 105,
          });
        }
      } else if (patternType === 'Goa Gallop') {
        // K-B-B (Kick, offbeat, offbeat 16th)
        if (beatInBar % 4 === 1 || beatInBar % 4 === 2) {
          notes.push({
            pitch,
            time: s * 0.25,
            duration: 0.18,
            velocity: beatInBar % 4 === 2 ? 110 : 95,
          });
        }
      } else if (patternType === 'Triplet') {
        // Triplet feel
        notes.push({
          pitch,
          time: s * 0.25,
          duration: 0.19,
          velocity: 100,
        });
      } else {
        // Techno Offbeat
        if (beatInBar % 2 === 1) {
          notes.push({
            pitch,
            time: s * 0.25,
            duration: 0.24,
            velocity: 110,
          });
        }
      }
    }

    return notes;
  }

  /**
   * Generate complete musical patterns (Bassline, Lead, Drums, Arp, Acid 303)
   * dynamically tailored by Key, Scale, BPM, Energy, and Genre with rich variations.
   */
  public generateMusicalPattern(params: {
    type: 'bassline' | 'lead' | 'drum' | 'arp' | 'acid' | string;
    genre: string;
    bpm: number;
    key: KeyType;
    scale: ScaleType;
    energy: number;
    seed?: number;
  }): { notes: MidiNote[]; name: string; timeSignature: string; abletonTips?: string } {
    const { type, genre, bpm, key, scale, energy } = params;
    const seed = params.seed ?? Math.floor(Math.random() * 100000);
    const random = (offset: number) => {
      const x = Math.sin(seed + offset) * 10000;
      return x - Math.floor(x);
    };

    const scaleMidiLow = getScaleMidiNotes(key, scale, [1, 2]);
    const scaleMidiMid = getScaleMidiNotes(key, scale, [2, 3, 4]);
    const scaleMidiHigh = getScaleMidiNotes(key, scale, [3, 4, 5]);

    const rootMidiLow = parseNoteToMidiNumber(`${key}1`);
    const rootMidiMid = parseNoteToMidiNumber(`${key}2`);
    const rootMidiHigh = parseNoteToMidiNumber(`${key}3`);

    const notes: MidiNote[] = [];
    const totalBars = energy >= 6 ? 4 : 2;
    const totalBeats = totalBars * 4;
    let patternName = `${genre} ${type.charAt(0).toUpperCase() + type.slice(1)} (${key} ${scale})`;

    if (type === 'bassline') {
      const bassStyles = ['Rolling Psy (K-B-B-B)', 'Goa Gallop', 'Triplet Drive', 'Psy-Tech Offbeat'];
      const styleIdx = Math.floor(random(1) * bassStyles.length);
      const chosenStyle = bassStyles[styleIdx];
      patternName = `${genre} ${chosenStyle} (${key})`;

      for (let bar = 0; bar < totalBars; bar++) {
        for (let step = 0; step < 16; step++) {
          const globalBeat = bar * 4 + step * 0.25;
          const isKick = step % 4 === 0;

          if (chosenStyle.startsWith('Rolling')) {
            if (!isKick) {
              // Higher energy adds pitch variation on turnaround steps
              let pitchMidi = rootMidiLow;
              if (energy >= 7 && (bar === 1 || bar === 3) && step >= 13) {
                // Turnaround octave hop or scale degree 2
                const hopDegree = scaleMidiLow[1] || rootMidiMid;
                pitchMidi = random(bar * 16 + step) > 0.4 ? hopDegree : rootMidiMid;
              }
              const vel = step % 4 === 1 ? 92 : step % 4 === 2 ? 104 : 110;
              notes.push({
                pitch: midiNumberToNoteString(pitchMidi),
                time: Number(globalBeat.toFixed(3)),
                duration: 0.21,
                velocity: Math.min(127, vel + Math.floor(energy * 1.5)),
              });
            }
          } else if (chosenStyle === 'Goa Gallop') {
            // Gallop on 16th 1 & 2
            if (step % 4 === 1 || step % 4 === 2) {
              const pitchMidi = (energy >= 8 && step === 14) ? rootMidiMid : rootMidiLow;
              notes.push({
                pitch: midiNumberToNoteString(pitchMidi),
                time: Number(globalBeat.toFixed(3)),
                duration: 0.18,
                velocity: step % 4 === 2 ? 112 : 96,
              });
            }
          } else if (chosenStyle === 'Triplet Drive') {
            // Triplet syncopated feel
            if (step % 4 !== 0) {
              const isAccent = step === 7 || step === 15;
              notes.push({
                pitch: isAccent && energy >= 6 ? midiNumberToNoteString(scaleMidiLow[2] || rootMidiLow) : `${key}1`,
                time: Number(globalBeat.toFixed(3)),
                duration: 0.19,
                velocity: isAccent ? 115 : 95,
              });
            }
          } else {
            // Offbeat Bass
            if (step % 4 === 2) {
              notes.push({
                pitch: `${key}1`,
                time: Number(globalBeat.toFixed(3)),
                duration: 0.24,
                velocity: 110,
              });
            }
          }
        }
      }
    } else if (type === 'lead') {
      patternName = `${genre} Psy Hook (${key} ${scale})`;
      const notePool = scaleMidiHigh.length > 0 ? scaleMidiHigh : [rootMidiHigh, rootMidiHigh + 3, rootMidiHigh + 7];
      
      // Generate structured melodic motifs across bars
      for (let bar = 0; bar < totalBars; bar++) {
        const isVariationBar = bar % 2 === 1;
        const stepsInBar = 16;

        for (let s = 0; s < stepsInBar; s += 2) {
          const randVal = random(seed + bar * 32 + s);
          // Higher energy = higher note probability
          const threshold = energy >= 8 ? 0.35 : energy >= 5 ? 0.5 : 0.65;

          if (randVal > threshold) {
            const poolIdx = Math.floor(random(seed * 2 + bar * 16 + s) * notePool.length);
            const pitchMidi = notePool[poolIdx];
            const beat = bar * 4 + s * 0.25;
            const duration = random(bar + s) > 0.6 ? 0.45 : 0.22;
            const velocity = Math.min(127, Math.floor(85 + random(s) * 35 + energy * 2));

            notes.push({
              pitch: midiNumberToNoteString(pitchMidi),
              time: Number(beat.toFixed(3)),
              duration: Number(duration.toFixed(3)),
              velocity,
            });
          }
        }
      }
    } else if (type === 'drum') {
      patternName = `${genre} Drum Rack Groove`;
      for (let bar = 0; bar < totalBars; bar++) {
        // Kick on 0, 1, 2, 3
        for (let beat = 0; beat < 4; beat++) {
          notes.push({
            pitch: 'C1', // Standard Kick
            time: bar * 4 + beat,
            duration: 0.2,
            velocity: 120,
          });

          // Snare / Clap on beat 1 & 3 (2 & 4 in 1-based index)
          if (beat === 1 || beat === 3) {
            notes.push({
              pitch: 'D1', // Snare
              time: bar * 4 + beat,
              duration: 0.2,
              velocity: 110,
            });
          }

          // Open Hi-Hat on offbeat (0.5, 1.5, 2.5, 3.5)
          notes.push({
            pitch: 'A#1', // Open Hat
            time: bar * 4 + beat + 0.5,
            duration: 0.18,
            velocity: 100,
          });
        }

        // Closed Hi-Hats on 16th grid
        for (let s = 0; s < 16; s++) {
          if (s % 2 === 1 && s % 4 !== 2) {
            notes.push({
              pitch: 'F#1', // Closed Hat
              time: bar * 4 + s * 0.25,
              duration: 0.12,
              velocity: s % 4 === 1 ? 85 : 95,
            });
          }
        }

        // Crash on Bar 1
        if (bar === 0) {
          notes.push({
            pitch: 'C#2', // Crash Cymbal
            time: 0,
            duration: 0.8,
            velocity: 115,
          });
        }
      }
    } else if (type === 'arp') {
      patternName = `${genre} Trance Matrix Arp (${key} ${scale})`;
      const arpNotes = scaleMidiMid;
      let noteIndex = 0;
      const stepDuration = 0.25; // 16th notes

      for (let bar = 0; bar < totalBars; bar++) {
        for (let s = 0; s < 16; s++) {
          const beat = bar * 4 + s * stepDuration;
          const noteMidi = arpNotes[noteIndex % arpNotes.length];
          const isAccent = s % 4 === 0 || s === 14;
          
          notes.push({
            pitch: midiNumberToNoteString(noteMidi),
            time: Number(beat.toFixed(3)),
            duration: 0.19,
            velocity: isAccent ? 115 : 90 + Math.floor((s % 4) * 5),
          });

          // Arp direction motion
          if (energy >= 7) {
            noteIndex = (noteIndex + 2) % arpNotes.length;
          } else {
            noteIndex = (noteIndex + 1) % arpNotes.length;
          }
        }
      }
    } else if (type === 'acid') {
      patternName = `${genre} TB-303 Acid Sequence (${key})`;
      const acidPool = [rootMidiLow, rootMidiMid, scaleMidiLow[1] || rootMidiLow + 1, scaleMidiLow[2] || rootMidiLow + 3, scaleMidiLow[4] || rootMidiLow + 7];

      for (let bar = 0; bar < totalBars; bar++) {
        for (let s = 0; s < 16; s++) {
          const beat = bar * 4 + s * 0.25;
          const r = random(seed + bar * 16 + s);

          // Rest probability
          if (r > 0.28) {
            const noteIdx = Math.floor(random(seed * 3 + bar * 8 + s) * acidPool.length);
            const pitchMidi = acidPool[noteIdx];
            const isSlide = random(bar * 10 + s) > 0.65;
            const isAccent = random(bar * 5 + s) > 0.6;
            const duration = isSlide ? 0.38 : 0.18;
            const velocity = isAccent ? 127 : 88;

            notes.push({
              pitch: midiNumberToNoteString(pitchMidi),
              time: Number(beat.toFixed(3)),
              duration: Number(duration.toFixed(3)),
              velocity,
            });
          }
        }
      }
    }

    // Sort notes by time then pitch
    notes.sort((a, b) => a.time - b.time || parseNoteToMidiNumber(a.pitch) - parseNoteToMidiNumber(b.pitch));

    return {
      notes,
      name: patternName,
      timeSignature: '4/4',
    };
  }
}

export const midiService = new MidiService();
