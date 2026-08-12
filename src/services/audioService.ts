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
}

export const audioService = new AudioService();
