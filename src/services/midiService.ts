import { MidiNote, MidiPattern, DrumPattern, BassSettings, KeyType } from '../types';
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
}

export const midiService = new MidiService();
