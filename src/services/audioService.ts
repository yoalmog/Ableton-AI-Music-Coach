import { MidiNote, TrackMetrics } from '../types';
import { parseNoteToMidiNumber } from './midiService';

export class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isPlaying: boolean = false;
  private bpm: number = 142;
  private activeOscillators: OscillatorNode[] = [];

  constructor() {
    // Lazy AudioContext setup
  }

  private initAudio() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(vol: number) {
    this.initAudio();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public getAnalyser(): AnalyserNode | null {
    this.initAudio();
    return this.analyser;
  }

  /**
   * Synthesizes a Psytrance / Techno Kick drum note
   */
  public playKick(timeOffset: number = 0) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + timeOffset;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Pitch envelope (Pitch drops fast from 160Hz to 48Hz for punch)
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(46, t + 0.12);

    // Amplitude envelope
    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  /**
   * Synthesizes a Psytrance Saw Bassline note
   */
  public playPsyBassNote(noteStr: string, timeOffset: number = 0, durationSec: number = 0.18, cutoffHz: number = 800) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + timeOffset;
    const midiNum = parseNoteToMidiNumber(noteStr);
    const freq = 440 * Math.pow(2, (midiNum - 69) / 12);

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    // Filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoffHz + 600, t);
    filter.frequency.exponentialRampToValueAtTime(120, t + durationSec);
    filter.Q.setValueAtTime(6, t);

    // Amp Envelope
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + durationSec);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + durationSec + 0.05);
  }

  /**
   * Synthesizes a Hi-Hat / Percussion sound
   */
  public playHiHat(timeOffset: number = 0, isOpen: boolean = false) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + timeOffset;
    const bufferSize = this.ctx.sampleRate * (isOpen ? 0.2 : 0.05);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (isOpen ? 0.18 : 0.04));

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(t);
  }

  /**
   * Play a full array of MidiNote objects in real-time
   */
  public playMidiPattern(notes: MidiNote[], bpm: number = 142) {
    this.initAudio();
    if (!this.ctx) return;

    const secondsPerBeat = 60 / bpm;

    notes.forEach((note) => {
      const timeOffset = note.time * secondsPerBeat;
      const durationSec = Math.max(0.08, note.duration * secondsPerBeat);

      if (note.pitch.startsWith('C1')) {
        this.playKick(timeOffset);
      } else if (note.pitch.startsWith('F#1') || note.pitch.startsWith('G1')) {
        this.playHiHat(timeOffset);
      } else {
        this.playPsyBassNote(note.pitch, timeOffset, durationSec);
      }
    });
  }

  /**
   * Estimate LUFS / RMS / Peak audio analysis from frequency data
   */
  public calculateMetrics(): TrackMetrics {
    this.initAudio();
    if (!this.analyser) {
      return { lufs: -14.2, rms: -16.0, peak: -1.2, lowMidRatio: 1.1, stereoWidth: 1.0 };
    }

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    let max = 0;
    let lowEnergy = 0;
    let midEnergy = 0;

    for (let i = 0; i < bufferLength; i++) {
      const val = dataArray[i] / 255;
      sum += val * val;
      if (val > max) max = val;

      if (i < bufferLength * 0.2) lowEnergy += val;
      else if (i < bufferLength * 0.6) midEnergy += val;
    }

    const rmsVal = Math.sqrt(sum / bufferLength);
    const rmsDb = rmsVal > 0 ? 20 * Math.log10(rmsVal) : -60;
    const peakDb = max > 0 ? 20 * Math.log10(max) : -60;
    const lufsDb = Math.max(-60, rmsDb - 3.1); // Approximate LUFS calculation

    const lowMidRatio = midEnergy > 0 ? Number((lowEnergy / midEnergy).toFixed(2)) : 1.2;

    return {
      lufs: Number(lufsDb.toFixed(1)),
      rms: Number(rmsDb.toFixed(1)),
      peak: Number(peakDb.toFixed(1)),
      lowMidRatio,
      stereoWidth: 1.1,
    };
  }

  /**
   * Play A/B Comparison Audio Examples for Before vs After processing
   */
  public playABExample(type: 'kick_eq' | 'bass_sidechain' | 'reverb_dry_wet' | 'lead_distortion', mode: 'before' | 'after') {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    if (type === 'kick_eq') {
      // Play 4 Kick beats
      for (let i = 0; i < 4; i++) {
        const offset = i * 0.42;
        if (mode === 'before') {
          // Muddy un-EQed kick (lows boomy, sub muddy)
          this.playKickRaw(offset, false);
        } else {
          // EQed punchy kick with sub sweep & high-pass 30Hz
          this.playKickRaw(offset, true);
        }
      }
    } else if (type === 'bass_sidechain') {
      // Play Kick + Bass loop
      for (let i = 0; i < 4; i++) {
        const kickOffset = i * 0.42;
        this.playKick(kickOffset);
        // 3 16th bass notes
        for (let b = 1; b <= 3; b++) {
          const bassOffset = kickOffset + b * 0.105;
          if (mode === 'before') {
            // No sidechain: bass plays loud right over kick tail causing mud
            this.playPsyBassNote('F#1', bassOffset, 0.1, 1200);
          } else {
            // With sidechain: bass ducked on 1st note, clean pluck
            const duckCutoff = b === 1 ? 400 : 800;
            this.playPsyBassNote('F#1', bassOffset, 0.09, duckCutoff);
          }
        }
      }
    } else if (type === 'reverb_dry_wet') {
      const t = this.ctx.currentTime;
      this.playSynthPluck('F#2', 0, mode === 'after');
      this.playSynthPluck('A2', 0.2, mode === 'after');
      this.playSynthPluck('C#3', 0.4, mode === 'after');
    } else if (type === 'lead_distortion') {
      this.playPsyLeadNote('F#2', 0, mode === 'after');
      this.playPsyLeadNote('A2', 0.2, mode === 'after');
      this.playPsyLeadNote('C#3', 0.4, mode === 'after');
    }
  }

  private playKickRaw(offset: number, withEq: boolean) {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime + offset;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(withEq ? 180 : 120, t);
    osc.frequency.exponentialRampToValueAtTime(withEq ? 48 : 80, t + 0.14);

    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (withEq ? 0.16 : 0.28));

    const filter = this.ctx.createBiquadFilter();
    filter.type = withEq ? 'highpass' : 'lowpass';
    filter.frequency.setValueAtTime(withEq ? 32 : 350, t);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  private playSynthPluck(pitch: string, offset: number, withReverb: boolean) {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime + offset;
    const midiNum = parseNoteToMidiNumber(pitch);
    const freq = 440 * Math.pow(2, (midiNum - 69) / 12);

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);

    if (withReverb) {
      // Simple delay/reverb echo simulation
      const delay = this.ctx.createDelay();
      delay.delayTime.setValueAtTime(0.18, t);
      const feedback = this.ctx.createGain();
      feedback.gain.setValueAtTime(0.4, t);

      gain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(this.masterGain);
    }

    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  private playPsyLeadNote(pitch: string, offset: number, withDistortion: boolean) {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime + offset;
    const midiNum = parseNoteToMidiNumber(pitch);
    const freq = 440 * Math.pow(2, (midiNum - 69) / 12);

    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(withDistortion ? 3500 : 1200, t);
    filter.Q.setValueAtTime(withDistortion ? 8 : 2, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  /**
   * Ear Training Audio Player
   */
  public playEarTrainingSample(category: string, mode: 'A' | 'B') {
    this.initAudio();
    if (category === 'EQ') {
      this.playABExample('kick_eq', mode === 'A' ? 'before' : 'after');
    } else if (category === 'Compression') {
      this.playABExample('bass_sidechain', mode === 'A' ? 'before' : 'after');
    } else if (category === 'Reverb & Delay') {
      this.playABExample('reverb_dry_wet', mode === 'A' ? 'before' : 'after');
    } else if (category === 'Distortion') {
      this.playABExample('lead_distortion', mode === 'A' ? 'before' : 'after');
    } else {
      this.playABExample('kick_eq', mode === 'A' ? 'before' : 'after');
    }
  }
}

export const audioService = new AudioService();
