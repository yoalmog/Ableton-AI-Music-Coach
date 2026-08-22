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
   * Generate complete musical patterns (Bassline, Lead, Drums, Arp, Acid 303, Melodic Stabs)
   * dynamically tailored by Key, Scale, BPM, Energy, Genre, and Subgenre with rich variations.
   */
  public generateMusicalPattern(params: {
    type: 'bassline' | 'lead' | 'drum' | 'arp' | 'acid' | 'stab' | string;
    genre: string;
    subgenre?: string;
    bpm: number;
    key: KeyType;
    scale: ScaleType;
    energy: number;
    seed?: number;
  }): { notes: MidiNote[]; name: string; timeSignature: string; abletonTips?: string } {
    const { type, genre, bpm, key, scale, energy } = params;
    const subgenre = params.subgenre || '';
    const seed = params.seed ?? Math.floor(Math.random() * 1000000);
    
    const random = (offset: number) => {
      const x = Math.sin(seed + offset * 1.6180339887) * 10000;
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
    let patternName = `${genre} ${type.charAt(0).toUpperCase() + type.slice(1)} (${key} ${scale})`;
    let abletonTip = '';

    const normalizedGenre = (genre || '').toLowerCase();
    const normalizedSubgenre = (subgenre || '').toLowerCase();

    if (type === 'bassline') {
      // 1. PSYTRANCE BASSLINES
      if (normalizedGenre.includes('psy') || normalizedSubgenre.includes('rolling') || normalizedSubgenre.includes('full-on') || normalizedSubgenre.includes('progressive')) {
        const isProgressive = normalizedSubgenre.includes('prog') || (bpm <= 139);
        const isOffbeat = normalizedSubgenre.includes('offbeat');
        const isTriplet = normalizedSubgenre.includes('triplet');
        
        if (isOffbeat) {
          patternName = `Psy-Tech Offbeat Bass (${key}1)`;
          abletonTip = `In Ableton Live 12: Load Operator on Bass track. OSC A = Saw, 24dB Lowpass at 650Hz. Set Release to 150ms. Apply Utility with Bass Mono at 120Hz.`;
          for (let bar = 0; bar < totalBars; bar++) {
            for (let step = 0; step < 16; step++) {
              const beat = bar * 4 + step * 0.25;
              if (step % 4 === 2) {
                // Main 8th offbeat
                notes.push({
                  pitch: `${key}1`,
                  time: Number(beat.toFixed(3)),
                  duration: 0.22,
                  velocity: 112,
                });
              } else if (energy >= 7 && (step % 4 === 3) && (bar === 1 || bar === 3)) {
                // Ghost pickup note on high energy
                notes.push({
                  pitch: midiNumberToNoteString(scaleMidiLow[1] || rootMidiLow),
                  time: Number(beat.toFixed(3)),
                  duration: 0.14,
                  velocity: 82,
                });
              }
            }
          }
        } else if (isTriplet) {
          patternName = `Psy Triplet Bass (${key}1)`;
          abletonTip = `Ableton Tip: Set MIDI Grid to 1/16T. Sidechain Auto Filter or Ducking from Kick track. Use Live 12 Roar for mid-range saturation above 200Hz.`;
          for (let bar = 0; bar < totalBars; bar++) {
            for (let beat = 0; beat < 4; beat++) {
              // 3 triplet notes in the beat, leaving beat start for kick
              const beatStart = bar * 4 + beat;
              notes.push({
                pitch: `${key}1`,
                time: Number((beatStart + 0.333).toFixed(3)),
                duration: 0.28,
                velocity: 96,
              });
              notes.push({
                pitch: `${key}1`,
                time: Number((beatStart + 0.666).toFixed(3)),
                duration: 0.28,
                velocity: energy >= 7 && beat === 3 ? 116 : 104,
              });
            }
          }
        } else {
          // Standard Rolling K-B-B-B or Full-On Bass
          patternName = `${genre} Rolling Bass (${key}1)`;
          abletonTip = `In Ableton Live 12: Load Operator. Osc A: Saw wave, Coarse 0.5/1. Filter: 24dB LP with cutoff around 600-750Hz and Decay 160ms. Add EQ Eight high-pass at 30Hz (48dB slope).`;
          for (let bar = 0; bar < totalBars; bar++) {
            for (let step = 0; step < 16; step++) {
              const isKick = step % 4 === 0;
              const beat = bar * 4 + step * 0.25;

              if (!isKick) {
                let pitchMidi = rootMidiLow;
                // High energy turnaround variations on bars 2 & 4
                if (energy >= 6 && (bar === 1 || bar === 3) && step >= 13) {
                  const r = random(bar * 16 + step);
                  if (r > 0.6) {
                    pitchMidi = rootMidiMid; // Octave turnaround
                  } else if (r > 0.3 && scaleMidiLow.length > 1) {
                    pitchMidi = scaleMidiLow[1]; // 2nd scale degree pickup
                  }
                }

                // Dynamic velocity contour: step 1 (softer) -> step 2 (medium) -> step 3 (driving punch)
                const baseVel = step % 4 === 1 ? 92 : step % 4 === 2 ? 104 : 114;
                const dynamicVel = Math.min(127, baseVel + Math.floor(energy * 1.3));

                notes.push({
                  pitch: midiNumberToNoteString(pitchMidi),
                  time: Number(beat.toFixed(3)),
                  duration: 0.21,
                  velocity: dynamicVel,
                });
              }
            }
          }
        }
      }
      // 2. GOA ACID BASSLINES
      else if (normalizedGenre.includes('goa') || normalizedSubgenre.includes('acid') || normalizedSubgenre.includes('303')) {
        patternName = `Goa Acid 303 Bassline (${key})`;
        abletonTip = `In Ableton Live 12: Use Drift or Operator with Saw wave. Insert Auto Filter with high resonance (Q=6) modulated by Envelope Decay. Insert Saturator with Warm Tube curve.`;
        const acidPool = [rootMidiLow, rootMidiMid, scaleMidiLow[1] || rootMidiLow + 1, scaleMidiLow[2] || rootMidiLow + 3, scaleMidiLow[4] || rootMidiLow + 7];

        for (let bar = 0; bar < totalBars; bar++) {
          for (let step = 0; step < 16; step++) {
            const beat = bar * 4 + step * 0.25;
            const r = random(seed + bar * 16 + step);

            // Goa Acid: 16th driving acid notes with selective accents and octave jumps
            if (step % 4 !== 0 || r > 0.4) {
              const noteIdx = Math.floor(random(seed * 3 + bar * 8 + step) * acidPool.length);
              const pitchMidi = acidPool[noteIdx];
              const isAccent = (step % 4 === 2) || (r > 0.7 && energy >= 6);
              const isSlide = r > 0.75 && energy >= 7;

              notes.push({
                pitch: midiNumberToNoteString(pitchMidi),
                time: Number(beat.toFixed(3)),
                duration: isSlide ? 0.38 : 0.18,
                velocity: isAccent ? 127 : 94,
              });
            }
          }
        }
      }
      // 3. TECHNO BASSLINES (Rumble / Offbeat / Driving / Minimal)
      else if (normalizedGenre.includes('techno') || normalizedSubgenre.includes('rumble') || normalizedSubgenre.includes('minimal')) {
        const isRumble = normalizedSubgenre.includes('rumble') || (energy <= 5);
        if (isRumble) {
          patternName = `Techno Sub Rumble Bass (${key}1)`;
          abletonTip = `In Ableton Live 12: Reverb + Delay on Kick return channel -> 100% Wet -> Overdrive -> Auto Filter (LP 140Hz) -> Sidechain Compressor keyed from Dry Kick.`;
          for (let bar = 0; bar < totalBars; bar++) {
            for (let step = 0; step < 16; step++) {
              const isKick = step % 4 === 0;
              const beat = bar * 4 + step * 0.25;

              if (!isKick) {
                // Sub rumble ghost notes on 16ths
                const vel = step % 4 === 2 ? 108 : 88;
                notes.push({
                  pitch: `${key}1`,
                  time: Number(beat.toFixed(3)),
                  duration: 0.23,
                  velocity: vel,
                });
              }
            }
          }
        } else {
          patternName = `Techno Driving 16th Bass (${key}1)`;
          abletonTip = `In Ableton Live 12: Load Wavetable with Modern Sub wavetable. Add Roar in Mid/Side mode for wide gritty mids while keeping sub centered.`;
          for (let bar = 0; bar < totalBars; bar++) {
            for (let step = 0; step < 16; step++) {
              const beat = bar * 4 + step * 0.25;
              const isAccent = step === 2 || step === 6 || step === 10 || step === 14;
              notes.push({
                pitch: `${key}1`,
                time: Number(beat.toFixed(3)),
                duration: 0.20,
                velocity: isAccent ? 116 : 90,
              });
            }
          }
        }
      }
      // 4. ELECTRONIC / MELODIC SYNTH BASS
      else {
        patternName = `${genre} Groove Synth Bass (${key} ${scale})`;
        abletonTip = `In Ableton Live 12: Load Drift synth. Set Mode to Poly/Mono, Glide to 40ms. Cut low mids around 350Hz on EQ Eight for punchy mix clarity.`;
        const groovePool = [rootMidiLow, rootMidiMid, scaleMidiLow[2] || rootMidiLow + 3, scaleMidiLow[4] || rootMidiLow + 7];

        for (let bar = 0; bar < totalBars; bar++) {
          for (let step = 0; step < 16; step += 2) {
            const beat = bar * 4 + step * 0.25;
            const r = random(seed + bar * 8 + step);
            if (r > 0.25) {
              const noteIdx = Math.floor(random(seed * 2 + step) * groovePool.length);
              const pitchMidi = groovePool[noteIdx];
              notes.push({
                pitch: midiNumberToNoteString(pitchMidi),
                time: Number(beat.toFixed(3)),
                duration: 0.35,
                velocity: Math.min(127, 95 + Math.floor(energy * 3)),
              });
            }
          }
        }
      }
    } else if (type === 'lead') {
      patternName = `${genre} Melodic Lead (${key} ${scale})`;
      abletonTip = `In Ableton Live 12: Use Wavetable or Operator (FM synthesis with Sine algorithm). Add Hybrid Reverb with Shimmer algorithm and Echo with dotted 8th note sync.`;
      const notePool = scaleMidiHigh.length > 0 ? scaleMidiHigh : [rootMidiHigh, rootMidiHigh + 3, rootMidiHigh + 7, rootMidiHigh + 10];

      for (let bar = 0; bar < totalBars; bar++) {
        const stepResolution = energy >= 7 ? 16 : 8;
        const stepSize = 16 / stepResolution;

        for (let s = 0; s < 16; s += stepSize) {
          const beat = bar * 4 + s * 0.25;
          const r = random(seed + bar * 32 + s);
          const threshold = energy >= 8 ? 0.3 : energy >= 5 ? 0.45 : 0.6;

          if (r > threshold) {
            const poolIdx = Math.floor(random(seed * 3 + bar * 16 + s) * notePool.length);
            const pitchMidi = notePool[poolIdx];
            const duration = random(bar + s) > 0.5 ? 0.45 : 0.22;
            const velocity = Math.min(127, Math.floor(88 + random(s) * 32 + energy * 2));

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
      abletonTip = `In Ableton Live 12: Load Drum Bus on Drum group. Drive +15%, Crunch 20%, Boom frequency tuned to ${key}1 (approx ${Math.round(440 * Math.pow(2, (rootMidiLow - 69) / 12))}Hz).`;
      for (let bar = 0; bar < totalBars; bar++) {
        // Kick on 0, 1, 2, 3
        for (let beat = 0; beat < 4; beat++) {
          notes.push({
            pitch: 'C1', // Kick
            time: bar * 4 + beat,
            duration: 0.2,
            velocity: 124,
          });

          // Snare / Clap on beat 1 & 3 (2 & 4 in 1-based index)
          if (beat === 1 || beat === 3) {
            notes.push({
              pitch: 'D1', // Snare / Clap
              time: bar * 4 + beat,
              duration: 0.2,
              velocity: 114,
            });
          }

          // Open Hi-Hat on offbeats (0.5, 1.5, 2.5, 3.5)
          notes.push({
            pitch: 'A#1', // Open Hat
            time: bar * 4 + beat + 0.5,
            duration: 0.18,
            velocity: 102,
          });
        }

        // Closed 16th Hi-Hats
        for (let s = 0; s < 16; s++) {
          if (s % 2 === 1 && s % 4 !== 2) {
            notes.push({
              pitch: 'F#1', // Closed Hat
              time: bar * 4 + s * 0.25,
              duration: 0.12,
              velocity: s % 4 === 1 ? 86 : 98,
            });
          }
        }

        // Crash on Bar 1
        if (bar === 0) {
          notes.push({
            pitch: 'C#2', // Crash
            time: 0,
            duration: 0.8,
            velocity: 118,
          });
        }
      }
    } else if (type === 'arp') {
      patternName = `${genre} Matrix Arpeggio (${key} ${scale})`;
      abletonTip = `In Ableton Live 12: Insert MIDI Effect 'Arpeggiator' or play this pattern directly into Drift. Use Auto Pan with 16th sync for hypnotic binaural motion.`;
      const arpNotes = scaleMidiMid.length > 0 ? scaleMidiMid : [rootMidiMid, rootMidiMid + 3, rootMidiMid + 7, rootMidiMid + 10];
      let noteIndex = 0;

      for (let bar = 0; bar < totalBars; bar++) {
        for (let s = 0; s < 16; s++) {
          const beat = bar * 4 + s * 0.25;
          const noteMidi = arpNotes[noteIndex % arpNotes.length];
          const isAccent = s % 4 === 0 || s === 14;

          notes.push({
            pitch: midiNumberToNoteString(noteMidi),
            time: Number(beat.toFixed(3)),
            duration: 0.20,
            velocity: isAccent ? 120 : 92 + ((s % 4) * 4),
          });

          if (energy >= 7) {
            noteIndex = (noteIndex + 2) % arpNotes.length;
          } else {
            noteIndex = (noteIndex + 1) % arpNotes.length;
          }
        }
      }
    } else if (type === 'acid') {
      patternName = `${genre} TB-303 Acid Sequence (${key})`;
      abletonTip = `In Ableton Live 12: Add Saturator with 'Soft Sine' curve and Roar with Multiband distortion. Automate Auto Filter Cutoff & Resonance during track build-ups.`;
      const acidPool = [rootMidiLow, rootMidiMid, scaleMidiLow[1] || rootMidiLow + 1, scaleMidiLow[2] || rootMidiLow + 3, scaleMidiLow[4] || rootMidiLow + 7, rootMidiHigh];

      for (let bar = 0; bar < totalBars; bar++) {
        for (let s = 0; s < 16; s++) {
          const beat = bar * 4 + s * 0.25;
          const r = random(seed + bar * 16 + s);

          if (r > 0.22) {
            const noteIdx = Math.floor(random(seed * 3 + bar * 8 + s) * acidPool.length);
            const pitchMidi = acidPool[noteIdx];
            const isSlide = random(bar * 10 + s) > 0.65;
            const isAccent = random(bar * 5 + s) > 0.55;

            notes.push({
              pitch: midiNumberToNoteString(pitchMidi),
              time: Number(beat.toFixed(3)),
              duration: isSlide ? 0.40 : 0.18,
              velocity: isAccent ? 127 : 90,
            });
          }
        }
      }
    } else if (type === 'stab') {
      patternName = `${genre} Melodic Stabs (${key} ${scale})`;
      abletonTip = `In Ableton Live 12: Load Meld synth with Subtractive engine. Insert Echo with ping-pong feedback (35%) and EQ Eight band-pass at 1.2kHz.`;
      const chordNotes = [rootMidiMid, scaleMidiMid[2] || rootMidiMid + 3, scaleMidiMid[4] || rootMidiMid + 7];

      for (let bar = 0; bar < totalBars; bar++) {
        // Syncopated stab hits (e.g. 1.5, 2.75, 3.5)
        const hitSteps = [3, 7, 11, 14];
        hitSteps.forEach((s) => {
          const beat = bar * 4 + s * 0.25;
          chordNotes.forEach((pitchMidi) => {
            notes.push({
              pitch: midiNumberToNoteString(pitchMidi),
              time: Number(beat.toFixed(3)),
              duration: 0.18,
              velocity: Math.min(127, 105 + Math.floor(energy * 2)),
            });
          });
        });
      }
    }

    // Mathematical sanitization & sorting
    const validatedNotes = notes.filter((n) => {
      const midiNum = parseNoteToMidiNumber(n.pitch);
      return !isNaN(midiNum) && midiNum >= 0 && midiNum <= 127 && !isNaN(n.time) && n.time >= 0 && !isNaN(n.duration) && n.duration > 0 && !isNaN(n.velocity) && n.velocity >= 1 && n.velocity <= 127;
    });

    validatedNotes.sort((a, b) => a.time - b.time || parseNoteToMidiNumber(a.pitch) - parseNoteToMidiNumber(b.pitch));

    return {
      notes: validatedNotes,
      name: patternName,
      timeSignature: '4/4',
      abletonTips: abletonTip,
    };
  }
}

export const midiService = new MidiService();

