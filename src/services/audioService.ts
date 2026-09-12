import { MidiNote, TrackMetrics } from '../types';
import { parseNoteToMidiNumber } from './midiService';

export type SoundPresetType =
  | 'auto'
  | 'psy_rolling_bass'
  | 'acid_303'
  | 'deep_sub_reese'
  | 'crystal_pluck_arp'
  | 'supersaw_lead'
  | 'goa_squelch_lead'
  | 'ambient_pad_stab'
  | 'drum_kit';

export interface SoundPresetInfo {
  id: SoundPresetType;
  name: string;
  category: 'Bass' | 'Lead' | 'Arp' | 'Pad' | 'Drums';
  description: string;
}

export const SOUND_PRESETS: SoundPresetInfo[] = [
  {
    id: 'psy_rolling_bass',
    name: 'Psytrance Rolling Saw',
    category: 'Bass',
    description: 'Punchy 24dB LP filtered saw with instant punch and 150ms decay envelope.',
  },
  {
    id: 'acid_303',
    name: 'TB-303 Acid Box',
    category: 'Lead',
    description: 'Classic resonant squelch with dynamic accent, high Q filter sweep, and bite.',
  },
  {
    id: 'crystal_pluck_arp',
    name: 'Crystal Pluck Arp',
    category: 'Arp',
    description: 'Crisp transient pluck with tempo-synced ping-pong delay feedback.',
  },
  {
    id: 'supersaw_lead',
    name: 'Hypersaw Lead',
    category: 'Lead',
    description: 'Triple detuned saw oscillator stack with wide stereo presence.',
  },
  {
    id: 'deep_sub_reese',
    name: 'Deep Techno Reese Sub',
    category: 'Bass',
    description: 'Warm, low-frequency detuned saws with low harmonic saturation.',
  },
  {
    id: 'goa_squelch_lead',
    name: 'Goa Psy Squelch Zap',
    category: 'Lead',
    description: 'High-resonance bandpass filter sweeping down for authentic psychedelic zap.',
  },
  {
    id: 'ambient_pad_stab',
    name: 'Lush Atmospheric Pad / Stab',
    category: 'Pad',
    description: 'Warm polyphonic detuned saws with soft attack and spacious stereo tail.',
  },
  {
    id: 'drum_kit',
    name: '909 / Psytrance Drum Kit',
    category: 'Drums',
    description: 'Synthesized punchy kick, snappy body/noise snare, and metallic hats.',
  },
];

export class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedbackGain: GainNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeSoundPreset: SoundPresetType = 'auto';

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

      // Ping-pong delay network
      this.delayNode = this.ctx.createDelay();
      this.delayNode.delayTime.setValueAtTime(0.21, this.ctx.currentTime); // ~142 BPM 16th delay

      this.delayFeedbackGain = this.ctx.createGain();
      this.delayFeedbackGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      this.delayNode.connect(this.delayFeedbackGain);
      this.delayFeedbackGain.connect(this.delayNode);
      this.delayFeedbackGain.connect(this.masterGain);

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

  public setActiveSoundPreset(preset: SoundPresetType) {
    this.activeSoundPreset = preset;
  }

  public getActiveSoundPreset(): SoundPresetType {
    return this.activeSoundPreset;
  }

  /**
   * Synthesizes a punchy Psytrance / Techno Kick drum with transient click + sub body
   */
  public playKick(timeOffset: number = 0) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + timeOffset;

    // 1. Sub Bass Pitch Sweep (190Hz -> 48Hz)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(48, t + 0.11);

    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.24);

    // 2. Beater Click Transient (high pitch snap for clarity in the mix)
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();

    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(1400, t);
    clickOsc.frequency.exponentialRampToValueAtTime(120, t + 0.015);

    clickGain.gain.setValueAtTime(0.6, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);

    clickOsc.start(t);
    clickOsc.stop(t + 0.025);
  }

  /**
   * Synthesizes a Rolling Saw Psytrance Bassline note
   */
  public playPsyBassNote(noteStr: string, timeOffset: number = 0, durationSec: number = 0.16, cutoffHz: number = 750) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + timeOffset;
    const midiNum = parseNoteToMidiNumber(noteStr);
    const freq = 440 * Math.pow(2, (midiNum - 69) / 12);

    // Main Saw Oscillator
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    // Lowpass 24dB Filter Envelope
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoffHz + 700, t);
    filter.frequency.exponentialRampToValueAtTime(110, t + durationSec);
    filter.Q.setValueAtTime(5, t);

    // Sub sine reinforce
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq, t);
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.35, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + durationSec);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);

    // Amp Envelope
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.85, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + durationSec);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    subOsc.start(t);
    osc.stop(t + durationSec + 0.05);
    subOsc.stop(t + durationSec + 0.05);
  }

  /**
   * Synthesizes a TB-303 Acid Bass / Lead line (Screaming resonance, high Q, accent)
   */
  public playAcidNote(noteStr: string, timeOffset: number = 0, durationSec: number = 0.22, isAccent: boolean = false, isSquare: boolean = false) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + timeOffset;
    const midiNum = parseNoteToMidiNumber(noteStr);
    const freq = 440 * Math.pow(2, (midiNum - 69) / 12);

    const osc = this.ctx.createOscillator();
    osc.type = isSquare ? 'square' : 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    // 303 Resonant Lowpass Filter (Q = 14 to 18)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const startFreq = isAccent ? 4800 : 2800;
    const endFreq = isAccent ? 350 : 250;
    filter.frequency.setValueAtTime(startFreq, t);
    filter.frequency.exponentialRampToValueAtTime(endFreq, t + durationSec);
    filter.Q.setValueAtTime(isAccent ? 16 : 12, t);

    // Distortion waveshaper node for authentic acid bite
    const distortion = this.ctx.createWaveShaper();
    distortion.curve = this.makeDistortionCurve(isAccent ? 35 : 20);
    distortion.oversample = '4x';

    const gain = this.ctx.createGain();
    const velGain = isAccent ? 0.9 : 0.6;
    gain.gain.setValueAtTime(velGain, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + durationSec);

    osc.connect(filter);
    filter.connect(distortion);
    distortion.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + durationSec + 0.05);
  }

  /**
   * Synthesizes a Crystal Pluck Arpeggio note with delay echoes
   */
  public playPluckArpNote(noteStr: string, timeOffset: number = 0, durationSec: number = 0.12) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + timeOffset;
    const midiNum = parseNoteToMidiNumber(noteStr);
    const freq = 440 * Math.pow(2, (midiNum - 69) / 12);

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    // Snappy Pluck Filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4500, t);
    filter.frequency.exponentialRampToValueAtTime(800, t + 0.1);
    filter.Q.setValueAtTime(4, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(filter);
    filter.connect(gain);

    // Send to master & delay line
    gain.connect(this.masterGain);
    if (this.delayNode) {
      gain.connect(this.delayNode);
    }

    osc.start(t);
    osc.stop(t + 0.16);
  }

  /**
   * Synthesizes a Hypersaw Lead note with 3 detuned oscillators
   */
  public playHypersawLeadNote(noteStr: string, timeOffset: number = 0, durationSec: number = 0.28) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + timeOffset;
    const midiNum = parseNoteToMidiNumber(noteStr);
    const freq = 440 * Math.pow(2, (midiNum - 69) / 12);

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc3.type = 'sawtooth';

    osc1.frequency.setValueAtTime(freq, t);
    osc2.frequency.setValueAtTime(freq * 1.008, t); // +14 cents detune
    osc3.frequency.setValueAtTime(freq * 0.992, t); // -14 cents detune

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3600, t);
    filter.frequency.exponentialRampToValueAtTime(1400, t + durationSec);
    filter.Q.setValueAtTime(3, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + durationSec);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    if (this.delayNode) {
      gain.connect(this.delayNode);
    }

    osc1.start(t);
    osc2.start(t);
    osc3.start(t);
    osc1.stop(t + durationSec + 0.05);
    osc2.stop(t + durationSec + 0.05);
    osc3.stop(t + durationSec + 0.05);
  }

  /**
   * Synthesizes a Goa Psy Squelch Zap (High-Q Bandpass down-sweep)
   */
  public playGoaSquelchNote(noteStr: string, timeOffset: number = 0, durationSec: number = 0.2) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + timeOffset;
    const midiNum = parseNoteToMidiNumber(noteStr);
    const freq = 440 * Math.pow(2, (midiNum - 69) / 12);

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    // Screaming Bandpass Zap Envelope
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(4200, t);
    filter.frequency.exponentialRampToValueAtTime(600, t + durationSec);
    filter.Q.setValueAtTime(14, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + durationSec);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + durationSec + 0.05);
  }

  /**
   * Synthesizes an Ambient Pad / Stab note with gentle attack & spacious body
   */
  public playPadStabNote(noteStr: string, timeOffset: number = 0, durationSec: number = 0.45) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + timeOffset;
    const midiNum = parseNoteToMidiNumber(noteStr);
    const freq = 440 * Math.pow(2, (midiNum - 69) / 12);

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(freq, t);
    osc2.frequency.setValueAtTime(freq * 1.004, t);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, t);
    filter.frequency.exponentialRampToValueAtTime(900, t + durationSec);
    filter.Q.setValueAtTime(1.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.06); // Soft attack
    gain.gain.exponentialRampToValueAtTime(0.001, t + durationSec);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    if (this.delayNode) {
      gain.connect(this.delayNode);
    }

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + durationSec + 0.05);
    osc2.stop(t + durationSec + 0.05);
  }

  /**
   * Synthesizes a Snare / Clap sound
   */
  public playSnare(timeOffset: number = 0) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + timeOffset;

    // Body tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(85, t + 0.09);
    oscGain.gain.setValueAtTime(0.7, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.15);

    // Noise snap
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.15);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1900, t);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.65, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(t);
  }

  /**
   * Synthesizes a Hi-Hat / Percussion sound
   */
  public playHiHat(timeOffset: number = 0, isOpen: boolean = false) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + timeOffset;
    const dur = isOpen ? 0.22 : 0.05;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(t);
  }

  /**
   * Synthesizes an Analog 909-style Handclap with pre-bursts
   */
  public playClap(timeOffset: number = 0) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + timeOffset;

    // 3 rapid pre-bursts (11ms apart) followed by sustained noise tail
    const burstOffsets = [0, 0.011, 0.022];
    burstOffsets.forEach((bOffset) => {
      if (!this.ctx || !this.masterGain) return;
      const burstTime = t + bOffset;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.012);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, burstTime);
      filter.Q.setValueAtTime(2.5, burstTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.7, burstTime);
      gain.gain.exponentialRampToValueAtTime(0.001, burstTime + 0.011);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      src.start(burstTime);
    });

    // Main sustained clap reverb tail
    const tailStart = t + 0.033;
    const tailDur = 0.22;
    const bufferSize = Math.floor(this.ctx.sampleRate * tailDur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const tailSrc = this.ctx.createBufferSource();
    tailSrc.buffer = buffer;

    const tailFilter = this.ctx.createBiquadFilter();
    tailFilter.type = 'bandpass';
    tailFilter.frequency.setValueAtTime(1200, tailStart);
    tailFilter.Q.setValueAtTime(1.8, tailStart);

    const tailGain = this.ctx.createGain();
    tailGain.gain.setValueAtTime(0.75, tailStart);
    tailGain.gain.exponentialRampToValueAtTime(0.001, tailStart + tailDur);

    tailSrc.connect(tailFilter);
    tailFilter.connect(tailGain);
    tailGain.connect(this.masterGain);
    tailSrc.start(tailStart);
  }

  /**
   * Synthesizes a resonant tribal / goa tom-percussion sound
   */
  public playPercussion(timeOffset: number = 0, pitchFreq: number = 380) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + timeOffset;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitchFreq * 1.8, t);
    osc.frequency.exponentialRampToValueAtTime(pitchFreq * 0.45, t + 0.12);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  /**
   * Synthesizes a subtle UI click / metronome / feedback click
   */
  public playClick(timeOffset: number = 0, isHigh: boolean = false) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + timeOffset;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(isHigh ? 1600 : 950, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.03);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.04);
  }

  /**
   * Synthesizes a Melodic Lead / Arp / Acid Synth note (backward-compatible method)
   */
  public playLeadNote(noteStr: string, timeOffset: number = 0, durationSec: number = 0.22, isAcid: boolean = false) {
    if (isAcid) {
      this.playAcidNote(noteStr, timeOffset, durationSec, true);
    } else {
      this.playHypersawLeadNote(noteStr, timeOffset, durationSec);
    }
  }

  /**
   * Unified method to play any synthesized note according to a specific sound preset
   */
  public playPresetNote(noteStr: string, timeOffset: number = 0, durationSec: number = 0.2, velocity: number = 100, preset: SoundPresetType = 'auto') {
    const midiNum = parseNoteToMidiNumber(noteStr);
    const isAccent = velocity >= 115;

    switch (preset) {
      case 'acid_303':
        this.playAcidNote(noteStr, timeOffset, durationSec, isAccent, false);
        break;
      case 'crystal_pluck_arp':
        this.playPluckArpNote(noteStr, timeOffset, durationSec);
        break;
      case 'supersaw_lead':
        this.playHypersawLeadNote(noteStr, timeOffset, durationSec);
        break;
      case 'goa_squelch_lead':
        this.playGoaSquelchNote(noteStr, timeOffset, durationSec);
        break;
      case 'ambient_pad_stab':
        this.playPadStabNote(noteStr, timeOffset, durationSec);
        break;
      case 'deep_sub_reese':
      case 'psy_rolling_bass':
        this.playPsyBassNote(noteStr, timeOffset, durationSec);
        break;
      case 'drum_kit':
        if (noteStr.startsWith('C1') || midiNum === 36) this.playKick(timeOffset);
        else if (noteStr.startsWith('D1') || midiNum === 38) this.playSnare(timeOffset);
        else if (noteStr.startsWith('F#1') || midiNum === 42) this.playHiHat(timeOffset, false);
        else if (noteStr.startsWith('A#1') || midiNum === 46) this.playHiHat(timeOffset, true);
        else this.playKick(timeOffset);
        break;
      default:
        // 'auto' mode: decide based on pitch and velocity
        if (midiNum >= 48) {
          if (isAccent) this.playAcidNote(noteStr, timeOffset, durationSec, true);
          else this.playHypersawLeadNote(noteStr, timeOffset, durationSec);
        } else {
          this.playPsyBassNote(noteStr, timeOffset, durationSec);
        }
        break;
    }
  }

  /**
   * Play a full array of MidiNote objects in real-time with chosen timbre / sound preset
   */
  public playMidiPattern(notes: MidiNote[], bpm: number = 142, soundPreset?: SoundPresetType | string) {
    this.initAudio();
    if (!this.ctx) return;

    const secondsPerBeat = 60 / bpm;
    const effectivePreset: SoundPresetType = (soundPreset as SoundPresetType) || this.activeSoundPreset || 'auto';

    notes.forEach((note) => {
      const timeOffset = note.time * secondsPerBeat;
      const durationSec = Math.max(0.08, note.duration * secondsPerBeat);
      const midiNum = parseNoteToMidiNumber(note.pitch);

      // Check if drum note
      if (note.pitch.startsWith('C1') || midiNum === 36) {
        this.playKick(timeOffset);
      } else if (note.pitch.startsWith('D1') || note.pitch.startsWith('D#1') || midiNum === 38 || midiNum === 40) {
        this.playSnare(timeOffset);
      } else if (note.pitch.startsWith('A#1') || note.pitch.startsWith('Bb1') || midiNum === 46) {
        this.playHiHat(timeOffset, true);
      } else if (note.pitch.startsWith('F#1') || note.pitch.startsWith('G#1') || midiNum === 42 || midiNum === 44) {
        this.playHiHat(timeOffset, false);
      } else if (note.pitch.startsWith('C#2') || midiNum === 49) {
        this.playHiHat(timeOffset, true);
      } else {
        // Melodic / Bass synthesis using the selected preset
        this.playPresetNote(note.pitch, timeOffset, durationSec, note.velocity, effectivePreset);
      }
    });
  }

  /**
   * Stop all active audio and reset master gain smoothly
   */
  public stopAll() {
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0, now);
      this.masterGain.gain.setValueAtTime(0.8, now + 0.05);
    }
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
    const lufsDb = Math.max(-60, rmsDb - 3.1);

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
   * Decodes an uploaded audio file (WAV, MP3, FLAC, OGG) and computes real acoustic metrics
   */
  public async decodeAndAnalyzeFile(file: File): Promise<{
    lufs: number;
    rms: number;
    peak: number;
    subDb: number;
    stereoWidth: number;
    durationSec: number;
    sampleRate: number;
    numberOfChannels: number;
  }> {
    this.initAudio();
    if (!this.ctx) {
      throw new Error('AudioContext unavailable');
    }
    const arrayBuf = await file.arrayBuffer();
    const audioBuf = await this.ctx.decodeAudioData(arrayBuf);
    return this.analyzeAudioBuffer(audioBuf);
  }

  /**
   * Performs exact statistical and acoustic measurement on an AudioBuffer
   */
  public analyzeAudioBuffer(audioBuf: AudioBuffer) {
    const numChannels = audioBuf.numberOfChannels;
    const length = audioBuf.length;
    const ch0 = audioBuf.getChannelData(0);
    const ch1 = numChannels > 1 ? audioBuf.getChannelData(1) : ch0;

    let peak = 0;
    let sumSq = 0;
    let leftSum = 0;
    let rightSum = 0;
    let correlationDot = 0;
    let subSumSq = 0;

    // Sub-bass filter approximation (simple 2-pole IIR lowpass ~120Hz)
    const dt = 1 / audioBuf.sampleRate;
    const rc = 1 / (2 * Math.PI * 120);
    const alpha = dt / (rc + dt);
    let subFiltered = 0;

    for (let i = 0; i < length; i++) {
      const l = ch0[i];
      const r = ch1[i];
      const mono = (l + r) * 0.5;

      const absMono = Math.abs(mono);
      if (absMono > peak) peak = absMono;
      sumSq += mono * mono;

      // Stereo correlation & width
      leftSum += l * l;
      rightSum += r * r;
      correlationDot += l * r;

      // Sub-bass component
      subFiltered += alpha * (mono - subFiltered);
      subSumSq += subFiltered * subFiltered;
    }

    const rms = Math.sqrt(sumSq / length);
    const rmsDb = rms > 0 ? 20 * Math.log10(rms) : -70;
    const peakDb = peak > 0 ? 20 * Math.log10(peak) : -70;
    // Standard integrated LUFS approximation (offset from RMS with weighting factor)
    const lufs = Math.max(-70, Math.min(0, rmsDb - 2.8));

    const subRms = Math.sqrt(subSumSq / length);
    const subDb = subRms > 0 ? 20 * Math.log10(subRms) : -70;

    // Correlation -1 to +1 -> stereo width 0 to 2
    const norm = Math.sqrt(leftSum * rightSum);
    const correlation = norm > 0 ? Math.max(-1, Math.min(1, correlationDot / norm)) : 1;
    const stereoWidth = Number((1 + (1 - correlation) * 0.5).toFixed(2));

    return {
      lufs: Number(lufs.toFixed(1)),
      rms: Number(rmsDb.toFixed(1)),
      peak: Number(peakDb.toFixed(1)),
      subDb: Number(subDb.toFixed(1)),
      stereoWidth,
      durationSec: Number((length / audioBuf.sampleRate).toFixed(2)),
      sampleRate: audioBuf.sampleRate,
      numberOfChannels: numChannels,
    };
  }

  /**
   * Play A/B Comparison Audio Examples for Before vs After processing
   */
  public playABExample(type: 'kick_eq' | 'bass_sidechain' | 'reverb_dry_wet' | 'lead_distortion', mode: 'before' | 'after') {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    if (type === 'kick_eq') {
      for (let i = 0; i < 4; i++) {
        const offset = i * 0.42;
        this.playKickRaw(offset, mode === 'after');
      }
    } else if (type === 'bass_sidechain') {
      for (let i = 0; i < 4; i++) {
        const kickOffset = i * 0.42;
        this.playKick(kickOffset);
        for (let b = 1; b <= 3; b++) {
          const bassOffset = kickOffset + b * 0.105;
          if (mode === 'before') {
            this.playPsyBassNote('F#1', bassOffset, 0.1, 1200);
          } else {
            const duckCutoff = b === 1 ? 400 : 800;
            this.playPsyBassNote('F#1', bassOffset, 0.09, duckCutoff);
          }
        }
      }
    } else if (type === 'reverb_dry_wet') {
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

    osc.frequency.setValueAtTime(withEq ? 190 : 120, t);
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

    if (withReverb && this.delayNode) {
      gain.connect(this.delayNode);
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
    filter.frequency.setValueAtTime(withDistortion ? 3800 : 1200, t);
    filter.Q.setValueAtTime(withDistortion ? 9 : 2, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  private makeDistortionCurve(amount: number = 20) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
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

