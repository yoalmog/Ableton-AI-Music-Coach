import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const resourcesSoundsDir = path.join(rootDir, 'resources', 'sounds');
const publicSoundsDir = path.join(rootDir, 'public', 'sounds');

const SAMPLE_RATE = 44100;

function createWavBuffer(samples, sampleRate = SAMPLE_RATE) {
  const numChannels = 1;
  const numSamples = samples.length;
  const dataSize = numSamples * numChannels * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // Linear PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * 2, 28);
  buffer.writeUInt16LE(numChannels * 2, 32);
  buffer.writeUInt16LE(16, 34); // 16-bit

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write 16-bit samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = s < 0 ? s * 0x8000 : s * 0x7fff;
    buffer.writeInt16LE(Math.floor(intSample), offset);
    offset += 2;
  }

  return buffer;
}

// Procedural audio synthesizers for each category
function synthKick(duration = 0.5, pitchStart = 160, pitchEnd = 45, punch = 0.8) {
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  let phase = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / duration;
    const freq = pitchEnd + (pitchStart - pitchEnd) * Math.exp(-progress * 25);
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const click = progress < 0.015 ? Math.sin(2 * Math.PI * 1800 * t) * (1 - progress / 0.015) * punch : 0;
    const body = Math.sin(phase) * Math.exp(-progress * 7);
    const amp = Math.max(0, 1 - progress);
    samples[i] = (body + click) * amp * 0.95;
  }
  return samples;
}

function synthSnare(duration = 0.4, pitch = 220, snap = 0.7) {
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  let phase = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / duration;
    phase += (2 * Math.PI * pitch) / SAMPLE_RATE;
    const tone = Math.sin(phase) * Math.exp(-progress * 15);
    const noise = (Math.random() * 2 - 1) * Math.exp(-progress * 9) * snap;
    samples[i] = (tone * 0.4 + noise * 0.6) * Math.max(0, 1 - progress);
  }
  return samples;
}

function synthHiHat(duration = 0.15, isOpen = false) {
  const dur = isOpen ? 0.35 : duration;
  const numSamples = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  let lastNoise = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / dur;
    const raw = Math.random() * 2 - 1;
    // High-pass filter
    const filtered = raw - lastNoise * 0.75;
    lastNoise = raw;
    const decayRate = isOpen ? 6 : 28;
    samples[i] = filtered * Math.exp(-progress * decayRate) * 0.65;
  }
  return samples;
}

function synthClap(duration = 0.3) {
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / duration;
    let env = Math.exp(-progress * 14);
    // 3 mini pre-claps
    if (t < 0.012) env *= 0.6;
    else if (t < 0.024) env *= 0.8;
    else if (t < 0.036) env *= 1.0;
    samples[i] = (Math.random() * 2 - 1) * env * 0.8;
  }
  return samples;
}

function synthPerc(duration = 0.25, freq = 450) {
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  let phase = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / duration;
    const curFreq = freq * Math.exp(-progress * 10);
    phase += (2 * Math.PI * curFreq) / SAMPLE_RATE;
    samples[i] = Math.sin(phase) * Math.exp(-progress * 12) * 0.75;
  }
  return samples;
}

function synthBass(duration = 0.6, baseFreq = 55, filterEnv = true, type = 'saw') {
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  let phase = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / duration;
    phase += (2 * Math.PI * baseFreq) / SAMPLE_RATE;
    let raw = 0;
    if (type === 'saw') {
      raw = 2 * ((phase / (2 * Math.PI)) % 1) - 1;
    } else if (type === 'square') {
      raw = Math.sin(phase) >= 0 ? 0.8 : -0.8;
    } else {
      raw = Math.sin(phase) + 0.3 * Math.sin(phase * 2);
    }
    const filter = filterEnv ? Math.exp(-progress * 6) : 1;
    samples[i] = Math.tanh(raw * (1.2 + filter * 2)) * Math.exp(-progress * 3.5) * 0.8;
  }
  return samples;
}

function synthLead(duration = 1.0, freq = 440, type = 'supersaw') {
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  const detunes = [-1.015, -1.007, 1.0, 1.007, 1.015];
  const phases = detunes.map(() => Math.random() * Math.PI * 2);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / duration;
    let sum = 0;
    for (let d = 0; d < detunes.length; d++) {
      phases[d] += (2 * Math.PI * freq * detunes[d]) / SAMPLE_RATE;
      sum += (2 * ((phases[d] / (2 * Math.PI)) % 1) - 1);
    }
    const env = progress < 0.05 ? progress / 0.05 : Math.exp(-progress * 2.5);
    samples[i] = Math.tanh((sum / detunes.length) * 1.5) * env * 0.7;
  }
  return samples;
}

function synthPad(duration = 1.6, rootFreq = 220) {
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  const freqs = [rootFreq, rootFreq * 1.2599, rootFreq * 1.4983, rootFreq * 2]; // minor chord
  const phases = freqs.map(() => 0);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / duration;
    let chord = 0;
    for (let f = 0; f < freqs.length; f++) {
      phases[f] += (2 * Math.PI * freqs[f]) / SAMPLE_RATE;
      chord += Math.sin(phases[f]) + 0.2 * Math.sin(phases[f] * 2);
    }
    // Smooth attack and release envelope
    const attack = Math.min(1, t / 0.3);
    const release = Math.max(0, (duration - t) / 0.4);
    const env = attack * release;
    samples[i] = (chord / freqs.length) * env * 0.8;
  }
  return samples;
}

function synthKeys(duration = 1.2, freq = 261.63) {
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  let p1 = 0, p2 = 0, p3 = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / duration;
    p1 += (2 * Math.PI * freq) / SAMPLE_RATE;
    p2 += (2 * Math.PI * freq * 2.001) / SAMPLE_RATE;
    p3 += (2 * Math.PI * freq * 3.003) / SAMPLE_RATE;
    const tone = Math.sin(p1) + 0.4 * Math.sin(p2) * Math.exp(-progress * 4) + 0.15 * Math.sin(p3) * Math.exp(-progress * 8);
    const env = Math.exp(-progress * 3.2);
    samples[i] = tone * env * 0.75;
  }
  return samples;
}

function synthFX(duration = 1.5, type = 'uplifter') {
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  let phase = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / duration;
    if (type === 'uplifter') {
      const curFreq = 150 + Math.pow(progress, 2.2) * 3200;
      phase += (2 * Math.PI * curFreq) / SAMPLE_RATE;
      const noise = (Math.random() * 2 - 1) * 0.3 * progress;
      samples[i] = (Math.sin(phase) * 0.6 + noise) * progress * 0.7;
    } else if (type === 'downlifter') {
      const curFreq = 1200 * Math.exp(-progress * 4) + 60;
      phase += (2 * Math.PI * curFreq) / SAMPLE_RATE;
      samples[i] = Math.sin(phase) * Math.max(0, 1 - progress) * 0.75;
    } else if (type === 'impact') {
      const curFreq = 90 * Math.exp(-progress * 8) + 40;
      phase += (2 * Math.PI * curFreq) / SAMPLE_RATE;
      const sub = Math.sin(phase) * Math.exp(-progress * 4);
      const boom = (Math.random() * 2 - 1) * Math.exp(-progress * 12);
      samples[i] = (sub * 0.7 + boom * 0.4) * Math.max(0, 1 - progress * 0.8);
    } else {
      // Glitch / Sweep
      const sweep = Math.sin(2 * Math.PI * (400 + Math.sin(t * 40) * 300) * t);
      samples[i] = sweep * Math.exp(-progress * 3) * 0.6;
    }
  }
  return samples;
}

// Generate 20 Waveform peak samples for thumbnail visualization
function generateWaveformPeaks(samples, numPeaks = 32) {
  const peaks = [];
  const chunkSize = Math.floor(samples.length / numPeaks);
  for (let i = 0; i < numPeaks; i++) {
    let max = 0;
    const start = i * chunkSize;
    const end = Math.min(samples.length, start + chunkSize);
    for (let j = start; j < end; j++) {
      const abs = Math.abs(samples[j]);
      if (abs > max) max = abs;
    }
    peaks.push(Math.round(Math.min(1, max) * 100) / 100);
  }
  return peaks;
}

// Build 120 Sound specifications
const SOUND_DEFINITIONS = [
  // DRUMS (20)
  { cat: 'Drums', name: 'Kick Deep Psy 01', fn: () => synthKick(0.45, 180, 48, 0.9), bpm: 142, key: 'F#', tags: ['Kick', 'Psytrance', 'Punchy'] },
  { cat: 'Drums', name: 'Kick Tight Goa 02', fn: () => synthKick(0.38, 210, 52, 0.95), bpm: 144, key: 'G', tags: ['Kick', 'Goa', 'Tight'] },
  { cat: 'Drums', name: 'Kick Sub Heavy 03', fn: () => synthKick(0.52, 150, 42, 0.85), bpm: 138, key: 'E', tags: ['Kick', 'Sub', 'Heavy'] },
  { cat: 'Drums', name: 'Kick Acoustic Punch 04', fn: () => synthKick(0.42, 170, 55, 0.75), bpm: 128, key: 'A', tags: ['Kick', 'Acoustic', 'Natural'] },
  { cat: 'Drums', name: 'Snare Crack 01', fn: () => synthSnare(0.35, 230, 0.8), bpm: 142, key: 'F#', tags: ['Snare', 'Bright', 'Snap'] },
  { cat: 'Drums', name: 'Snare Fat Layer 02', fn: () => synthSnare(0.42, 195, 0.65), bpm: 140, key: 'G', tags: ['Snare', 'Fat', 'Layer'] },
  { cat: 'Drums', name: 'Snare 909 Vintage 03', fn: () => synthSnare(0.3, 250, 0.85), bpm: 135, key: 'A', tags: ['Snare', 'Vintage', '909'] },
  { cat: 'Drums', name: 'Snare Acoustic Rim 04', fn: () => synthSnare(0.25, 300, 0.5), bpm: 125, key: 'D', tags: ['Snare', 'Rimshot', 'Crisp'] },
  { cat: 'Drums', name: 'HiHat Closed Tight 01', fn: () => synthHiHat(0.08, false), bpm: 142, key: 'None', tags: ['HiHat', 'Closed', '16th'] },
  { cat: 'Drums', name: 'HiHat Closed Bright 02', fn: () => synthHiHat(0.1, false), bpm: 144, key: 'None', tags: ['HiHat', 'Closed', 'Bright'] },
  { cat: 'Drums', name: 'HiHat Closed Dark 03', fn: () => synthHiHat(0.09, false), bpm: 138, key: 'None', tags: ['HiHat', 'Closed', 'Dark'] },
  { cat: 'Drums', name: 'HiHat Open Sizzle 01', fn: () => synthHiHat(0.35, true), bpm: 142, key: 'None', tags: ['HiHat', 'Open', 'Offbeat'] },
  { cat: 'Drums', name: 'HiHat Open 909 02', fn: () => synthHiHat(0.4, true), bpm: 140, key: 'None', tags: ['HiHat', 'Open', '909'] },
  { cat: 'Drums', name: 'HiHat Open Velvet 03', fn: () => synthHiHat(0.45, true), bpm: 130, key: 'None', tags: ['HiHat', 'Open', 'Smooth'] },
  { cat: 'Drums', name: 'Clap Stereo Wide 01', fn: () => synthClap(0.28), bpm: 142, key: 'None', tags: ['Clap', 'Stereo', 'Wide'] },
  { cat: 'Drums', name: 'Clap Tight Club 02', fn: () => synthClap(0.22), bpm: 138, key: 'None', tags: ['Clap', 'Club', 'Crisp'] },
  { cat: 'Drums', name: 'Perc Shaker Loop 01', fn: () => synthPerc(0.18, 520), bpm: 142, key: 'None', tags: ['Perc', 'Shaker', 'Groove'] },
  { cat: 'Drums', name: 'Perc Woodblock Click 02', fn: () => synthPerc(0.15, 680), bpm: 140, key: 'None', tags: ['Perc', 'Wood', 'Click'] },
  { cat: 'Drums', name: 'Perc Conga High 03', fn: () => synthPerc(0.24, 380), bpm: 135, key: 'None', tags: ['Perc', 'Conga', 'Tribal'] },
  { cat: 'Drums', name: 'Perc Metal Clink 04', fn: () => synthPerc(0.2, 920), bpm: 144, key: 'None', tags: ['Perc', 'Metallic', 'Transient'] },

  // BASS (20)
  { cat: 'Bass', name: 'Bass Psy Rolling F# 01', fn: () => synthBass(0.5, 46.25, true, 'saw'), bpm: 142, key: 'F#', tags: ['Bass', 'Psytrance', 'Rolling'] },
  { cat: 'Bass', name: 'Bass Psy Saw G 02', fn: () => synthBass(0.48, 49.0, true, 'saw'), bpm: 144, key: 'G', tags: ['Bass', 'Goa', 'Saw'] },
  { cat: 'Bass', name: 'Bass Deep Sub E 03', fn: () => synthBass(0.65, 41.2, false, 'sine'), bpm: 138, key: 'E', tags: ['Bass', 'Sub', 'Clean'] },
  { cat: 'Bass', name: 'Bass Acid Resonant 04', fn: () => synthBass(0.45, 55.0, true, 'saw'), bpm: 142, key: 'A', tags: ['Bass', 'Acid', '303'] },
  { cat: 'Bass', name: 'Bass Reese Heavy 05', fn: () => synthBass(0.8, 43.65, false, 'square'), bpm: 136, key: 'F', tags: ['Bass', 'Reese', 'Detuned'] },
  { cat: 'Bass', name: 'Bass FM Pluck 06', fn: () => synthBass(0.4, 46.25, true, 'sine'), bpm: 142, key: 'F#', tags: ['Bass', 'FM', 'Punchy'] },
  { cat: 'Bass', name: 'Bass Slap Punch 07', fn: () => synthBass(0.38, 55.0, true, 'saw'), bpm: 130, key: 'A', tags: ['Bass', 'Punchy', 'Transient'] },
  { cat: 'Bass', name: 'Bass Dark Techno D 08', fn: () => synthBass(0.55, 36.71, true, 'saw'), bpm: 132, key: 'D', tags: ['Bass', 'Techno', 'Rumble'] },
  { cat: 'Bass', name: 'Bass Offbeat Trance 09', fn: () => synthBass(0.42, 49.0, true, 'saw'), bpm: 138, key: 'G', tags: ['Bass', 'Trance', 'Offbeat'] },
  { cat: 'Bass', name: 'Bass Distortion Roar 10', fn: () => synthBass(0.52, 46.25, true, 'square'), bpm: 142, key: 'F#', tags: ['Bass', 'Drive', 'Saturated'] },
  { cat: 'Bass', name: 'Bass Square Wobble 11', fn: () => synthBass(0.6, 51.91, true, 'square'), bpm: 140, key: 'G#', tags: ['Bass', 'Square', 'Mid'] },
  { cat: 'Bass', name: 'Bass Nu-Disco Funk 12', fn: () => synthBass(0.44, 58.27, true, 'saw'), bpm: 124, key: 'A#', tags: ['Bass', 'Funk', 'Disco'] },
  { cat: 'Bass', name: 'Bass Modular Sine Sub 13', fn: () => synthBass(0.7, 38.89, false, 'sine'), bpm: 142, key: 'D#', tags: ['Bass', 'Modular', 'PureSub'] },
  { cat: 'Bass', name: 'Bass Cyberpunk Growl 14', fn: () => synthBass(0.58, 43.65, true, 'saw'), bpm: 110, key: 'F', tags: ['Bass', 'Cyberpunk', 'Gritty'] },
  { cat: 'Bass', name: 'Bass Pluck Short 15', fn: () => synthBass(0.28, 46.25, true, 'saw'), bpm: 144, key: 'F#', tags: ['Bass', 'Short', 'Pluck'] },
  { cat: 'Bass', name: 'Bass Dubstep Wobble 16', fn: () => synthBass(0.62, 41.2, true, 'square'), bpm: 140, key: 'E', tags: ['Bass', 'Wobble', 'Heavy'] },
  { cat: 'Bass', name: 'Bass 808 Boom C 17', fn: () => synthBass(0.85, 32.7, false, 'sine'), bpm: 130, key: 'C', tags: ['Bass', '808', 'Trap'] },
  { cat: 'Bass', name: 'Bass Melodic Drive 18', fn: () => synthBass(0.48, 55.0, true, 'saw'), bpm: 134, key: 'A', tags: ['Bass', 'Drive', 'Melodic'] },
  { cat: 'Bass', name: 'Bass Neuro Stabs 19', fn: () => synthBass(0.5, 46.25, true, 'saw'), bpm: 145, key: 'F#', tags: ['Bass', 'Neuro', 'Psy'] },
  { cat: 'Bass', name: 'Bass Warm Analog 20', fn: () => synthBass(0.58, 49.0, true, 'saw'), bpm: 142, key: 'G', tags: ['Bass', 'Analog', 'Warm'] },

  // LEADS (20)
  { cat: 'Leads', name: 'Lead Psy Scream 01', fn: () => synthLead(1.1, 740, 'supersaw'), bpm: 142, key: 'F#', tags: ['Lead', 'Psytrance', 'Screamer'] },
  { cat: 'Leads', name: 'Lead Supersaw Anthem 02', fn: () => synthLead(1.4, 554.37, 'supersaw'), bpm: 138, key: 'C#', tags: ['Lead', 'Trance', 'Supersaw'] },
  { cat: 'Leads', name: 'Lead Acid Squelch 03', fn: () => synthLead(0.8, 880, 'saw'), bpm: 144, key: 'A', tags: ['Lead', 'Acid', '303'] },
  { cat: 'Leads', name: 'Lead Pluck Poly 04', fn: () => synthLead(0.65, 659.25, 'saw'), bpm: 142, key: 'E', tags: ['Lead', 'Pluck', 'Melodic'] },
  { cat: 'Leads', name: 'Lead Square Chiptune 05', fn: () => synthLead(0.9, 587.33, 'saw'), bpm: 130, key: 'D', tags: ['Lead', 'Square', 'Retro'] },
  { cat: 'Leads', name: 'Lead Modular Glitch 06', fn: () => synthLead(0.75, 783.99, 'supersaw'), bpm: 145, key: 'G', tags: ['Lead', 'Modular', 'Psy'] },
  { cat: 'Leads', name: 'Lead Vocal Formant 07', fn: () => synthLead(1.2, 523.25, 'supersaw'), bpm: 136, key: 'C', tags: ['Lead', 'Formant', 'Talk'] },
  { cat: 'Leads', name: 'Lead Bright Sync 08', fn: () => synthLead(1.0, 740, 'saw'), bpm: 142, key: 'F#', tags: ['Lead', 'Sync', 'Cutting'] },
  { cat: 'Leads', name: 'Lead Goa Spiral 09', fn: () => synthLead(1.3, 622.25, 'supersaw'), bpm: 146, key: 'D#', tags: ['Lead', 'Goa', 'Hypnotic'] },
  { cat: 'Leads', name: 'Lead Euro Euphoria 10', fn: () => synthLead(1.5, 493.88, 'supersaw'), bpm: 140, key: 'B', tags: ['Lead', 'Trance', 'Huge'] },
  { cat: 'Leads', name: 'Lead Distorted Metal 11', fn: () => synthLead(0.95, 740, 'saw'), bpm: 142, key: 'F#', tags: ['Lead', 'Distortion', 'Raw'] },
  { cat: 'Leads', name: 'Lead Flute Synth 12', fn: () => synthLead(1.1, 587.33, 'saw'), bpm: 128, key: 'D', tags: ['Lead', 'Soft', 'Airy'] },
  { cat: 'Leads', name: 'Lead Sine Solo 13', fn: () => synthLead(1.2, 880, 'saw'), bpm: 135, key: 'A', tags: ['Lead', 'Sine', 'Expressive'] },
  { cat: 'Leads', name: 'Lead Mono Portamento 14', fn: () => synthLead(1.0, 698.46, 'supersaw'), bpm: 140, key: 'F', tags: ['Lead', 'Glide', 'Mono'] },
  { cat: 'Leads', name: 'Lead Brass Synth 15', fn: () => synthLead(1.3, 523.25, 'supersaw'), bpm: 132, key: 'C', tags: ['Lead', 'Brass', 'Punchy'] },
  { cat: 'Leads', name: 'Lead Bell Metallic 16', fn: () => synthLead(0.85, 987.77, 'saw'), bpm: 142, key: 'B', tags: ['Lead', 'Bell', 'Chime'] },
  { cat: 'Leads', name: 'Lead Dark Cyber 17', fn: () => synthLead(1.05, 440, 'saw'), bpm: 125, key: 'A', tags: ['Lead', 'Cyber', 'Dark'] },
  { cat: 'Leads', name: 'Lead Psy Laser 18', fn: () => synthLead(0.7, 1046.5, 'supersaw'), bpm: 145, key: 'C', tags: ['Lead', 'Laser', 'Fast'] },
  { cat: 'Leads', name: 'Lead Rave Stabs 19', fn: () => synthLead(0.8, 554.37, 'saw'), bpm: 140, key: 'C#', tags: ['Lead', 'Rave', 'Stab'] },
  { cat: 'Leads', name: 'Lead Warm Horizon 20', fn: () => synthLead(1.4, 740, 'supersaw'), bpm: 138, key: 'F#', tags: ['Lead', 'Warm', 'Lush'] },

  // SYNTHS (20)
  { cat: 'Synths', name: 'Synth Psy Stab F# 01', fn: () => synthPad(0.9, 185), bpm: 142, key: 'F#', tags: ['Synth', 'Stab', 'Psytrance'] },
  { cat: 'Synths', name: 'Synth Wavetable Sweep 02', fn: () => synthPad(1.5, 220), bpm: 140, key: 'A', tags: ['Synth', 'Wavetable', 'Sweep'] },
  { cat: 'Synths', name: 'Synth Ambient Drone 03', fn: () => synthPad(2.0, 146.83), bpm: 120, key: 'D', tags: ['Synth', 'Ambient', 'Drone'] },
  { cat: 'Synths', name: 'Synth FM Bell Texture 04', fn: () => synthPad(1.2, 329.63), bpm: 135, key: 'E', tags: ['Synth', 'FM', 'Bell'] },
  { cat: 'Synths', name: 'Synth Warm Pad Lush 05', fn: () => synthPad(1.8, 185), bpm: 138, key: 'F#', tags: ['Synth', 'Pad', 'Warm'] },
  { cat: 'Synths', name: 'Synth Arp Pattern G 06', fn: () => synthPad(0.8, 196), bpm: 144, key: 'G', tags: ['Synth', 'Arp', 'Sequenced'] },
  { cat: 'Synths', name: 'Synth Chord Minor Stab 07', fn: () => synthPad(0.75, 220), bpm: 142, key: 'A', tags: ['Synth', 'Chord', 'Minor'] },
  { cat: 'Synths', name: 'Synth Analog Strings 08', fn: () => synthPad(1.6, 261.63), bpm: 130, key: 'C', tags: ['Synth', 'Strings', 'Analog'] },
  { cat: 'Synths', name: 'Synth Goa Bubble 09', fn: () => synthPad(0.7, 370), bpm: 145, key: 'F#', tags: ['Synth', 'Goa', 'Resonant'] },
  { cat: 'Synths', name: 'Synth Dark Soundscape 10', fn: () => synthPad(2.2, 130.81), bpm: 110, key: 'C', tags: ['Synth', 'Dark', 'Cinematic'] },
  { cat: 'Synths', name: 'Synth Detuned Stab 11', fn: () => synthPad(0.85, 246.94), bpm: 140, key: 'B', tags: ['Synth', 'Detuned', 'Punchy'] },
  { cat: 'Synths', name: 'Synth Choir Synth 12', fn: () => synthPad(1.7, 220), bpm: 135, key: 'A', tags: ['Synth', 'Choir', 'Ethereal'] },
  { cat: 'Synths', name: 'Synth Pulsing Gate 13', fn: () => synthPad(1.0, 185), bpm: 142, key: 'F#', tags: ['Synth', 'Gated', 'Rhythm'] },
  { cat: 'Synths', name: 'Synth Cosmic Texture 14', fn: () => synthPad(1.9, 293.66), bpm: 125, key: 'D', tags: ['Synth', 'Space', 'Texture'] },
  { cat: 'Synths', name: 'Synth Deep Modular Hit 15', fn: () => synthPad(0.95, 164.81), bpm: 138, key: 'E', tags: ['Synth', 'Modular', 'Impact'] },
  { cat: 'Synths', name: 'Synth Organic Glass 16', fn: () => synthPad(1.3, 392.0), bpm: 132, key: 'G', tags: ['Synth', 'Glass', 'Bright'] },
  { cat: 'Synths', name: 'Synth Ice Crystalline 17', fn: () => synthPad(1.4, 440), bpm: 140, key: 'A', tags: ['Synth', 'Crystalline', 'Airy'] },
  { cat: 'Synths', name: 'Synth Techno Sequence 18', fn: () => synthPad(0.65, 146.83), bpm: 134, key: 'D', tags: ['Synth', 'Techno', 'Sequence'] },
  { cat: 'Synths', name: 'Synth Ethereal Shimmer 19', fn: () => synthPad(1.8, 370), bpm: 136, key: 'F#', tags: ['Synth', 'Shimmer', 'Dream'] },
  { cat: 'Synths', name: 'Synth Granular Clouds 20', fn: () => synthPad(2.1, 220), bpm: 120, key: 'A', tags: ['Synth', 'Granular', 'Cloud'] },

  // KEYS (20)
  { cat: 'Keys', name: 'Keys Rhodes Warm C 01', fn: () => synthKeys(1.3, 261.63), bpm: 120, key: 'C', tags: ['Keys', 'Rhodes', 'Warm'] },
  { cat: 'Keys', name: 'Keys Electric Piano F# 02', fn: () => synthKeys(1.2, 370), bpm: 142, key: 'F#', tags: ['Keys', 'EPiano', 'Psy'] },
  { cat: 'Keys', name: 'Keys Grand Piano A 03', fn: () => synthKeys(1.5, 220), bpm: 128, key: 'A', tags: ['Keys', 'Grand', 'Acoustic'] },
  { cat: 'Keys', name: 'Keys Organ Vintage 04', fn: () => synthKeys(1.1, 293.66), bpm: 130, key: 'D', tags: ['Keys', 'Organ', 'B3'] },
  { cat: 'Keys', name: 'Keys Clavinet Funk 05', fn: () => synthKeys(0.7, 329.63), bpm: 124, key: 'E', tags: ['Keys', 'Clav', 'Funk'] },
  { cat: 'Keys', name: 'Keys Wurlitzer Classic 06', fn: () => synthKeys(1.25, 246.94), bpm: 118, key: 'B', tags: ['Keys', 'Wurlitzer', 'Vintage'] },
  { cat: 'Keys', name: 'Keys Dark Upright 07', fn: () => synthKeys(1.4, 196), bpm: 110, key: 'G', tags: ['Keys', 'Upright', 'Mellow'] },
  { cat: 'Keys', name: 'Keys FM Bell Piano 08', fn: () => synthKeys(1.15, 370), bpm: 138, key: 'F#', tags: ['Keys', 'DX7', '80s'] },
  { cat: 'Keys', name: 'Keys Toy Piano Crisp 09', fn: () => synthKeys(0.8, 523.25), bpm: 135, key: 'C', tags: ['Keys', 'Toy', 'Bright'] },
  { cat: 'Keys', name: 'Keys LoFi Felt Piano 10', fn: () => synthKeys(1.6, 220), bpm: 85, key: 'A', tags: ['Keys', 'LoFi', 'Felt'] },
  { cat: 'Keys', name: 'Keys Harpsichord Baroque 11', fn: () => synthKeys(0.9, 440), bpm: 120, key: 'A', tags: ['Keys', 'Harpsichord', 'Bright'] },
  { cat: 'Keys', name: 'Keys Celestial Celeste 12', fn: () => synthKeys(1.2, 659.25), bpm: 126, key: 'E', tags: ['Keys', 'Celeste', 'Magical'] },
  { cat: 'Keys', name: 'Keys Vibraphone Mallet 13', fn: () => synthKeys(1.35, 392), bpm: 130, key: 'G', tags: ['Keys', 'Vibes', 'Mallet'] },
  { cat: 'Keys', name: 'Keys Neo-Soul Chords 14', fn: () => synthKeys(1.4, 277.18), bpm: 92, key: 'C#', tags: ['Keys', 'Soul', 'Smooth'] },
  { cat: 'Keys', name: 'Keys Music Box 15', fn: () => synthKeys(1.0, 783.99), bpm: 115, key: 'G', tags: ['Keys', 'MusicBox', 'Tiny'] },
  { cat: 'Keys', name: 'Keys Honky-Tonk 16', fn: () => synthKeys(1.1, 261.63), bpm: 130, key: 'C', tags: ['Keys', 'HonkyTonk', 'Detuned'] },
  { cat: 'Keys', name: 'Keys Church Organ Pipe 17', fn: () => synthKeys(1.8, 174.61), bpm: 90, key: 'F', tags: ['Keys', 'PipeOrgan', 'Cathedral'] },
  { cat: 'Keys', name: 'Keys Kalimba Thumb 18', fn: () => synthKeys(0.85, 587.33), bpm: 125, key: 'D', tags: ['Keys', 'Kalimba', 'Acoustic'] },
  { cat: 'Keys', name: 'Keys Glass Piano 19', fn: () => synthKeys(1.3, 440), bpm: 138, key: 'A', tags: ['Keys', 'Glass', 'Ethereal'] },
  { cat: 'Keys', name: 'Keys Psy Ambient Rhodes 20', fn: () => synthKeys(1.7, 370), bpm: 142, key: 'F#', tags: ['Keys', 'PsyAmbient', 'Space'] },

  // FX (20)
  { cat: 'FX', name: 'FX Psy Uplifter 1 Bar 01', fn: () => synthFX(1.4, 'uplifter'), bpm: 142, key: 'None', tags: ['FX', 'Riser', 'Build'] },
  { cat: 'FX', name: 'FX Huge Drop Riser 02', fn: () => synthFX(2.0, 'uplifter'), bpm: 140, key: 'None', tags: ['FX', 'Riser', 'Huge'] },
  { cat: 'FX', name: 'FX Downlifter Sub Impact 03', fn: () => synthFX(1.6, 'downlifter'), bpm: 142, key: 'None', tags: ['FX', 'Downlifter', 'Release'] },
  { cat: 'FX', name: 'FX Heavy Sub Drop 04', fn: () => synthFX(1.2, 'downlifter'), bpm: 138, key: 'None', tags: ['FX', 'SubDrop', 'Boom'] },
  { cat: 'FX', name: 'FX Psytrance Laser Sweep 05', fn: () => synthFX(0.8, 'glitch'), bpm: 144, key: 'None', tags: ['FX', 'Laser', 'Psy'] },
  { cat: 'FX', name: 'FX Cosmic Impact 06', fn: () => synthFX(1.8, 'impact'), bpm: 135, key: 'None', tags: ['FX', 'Impact', 'Cinematic'] },
  { cat: 'FX', name: 'FX Noise Sweep White 07', fn: () => synthFX(1.3, 'uplifter'), bpm: 142, key: 'None', tags: ['FX', 'Noise', 'WhiteNoise'] },
  { cat: 'FX', name: 'FX Glitch Transition 08', fn: () => synthFX(0.7, 'glitch'), bpm: 142, key: 'None', tags: ['FX', 'Glitch', 'Digital'] },
  { cat: 'FX', name: 'FX Acid Zap 09', fn: () => synthFX(0.5, 'glitch'), bpm: 145, key: 'None', tags: ['FX', 'Zap', 'Acid'] },
  { cat: 'FX', name: 'FX Reverse Crash 10', fn: () => synthFX(1.5, 'uplifter'), bpm: 138, key: 'None', tags: ['FX', 'Cymbal', 'Reverse'] },
  { cat: 'FX', name: 'FX Reverb Tail Boom 11', fn: () => synthFX(1.9, 'impact'), bpm: 130, key: 'None', tags: ['FX', 'Boom', 'Tail'] },
  { cat: 'FX', name: 'FX Radio Stutter 12', fn: () => synthFX(0.9, 'glitch'), bpm: 140, key: 'None', tags: ['FX', 'Radio', 'Stutter'] },
  { cat: 'FX', name: 'FX Shamanic Shimmer 13', fn: () => synthFX(1.4, 'downlifter'), bpm: 142, key: 'None', tags: ['FX', 'Organic', 'Psy'] },
  { cat: 'FX', name: 'FX Cyber Sirens 14', fn: () => synthFX(1.2, 'glitch'), bpm: 134, key: 'None', tags: ['FX', 'Siren', 'Cyber'] },
  { cat: 'FX', name: 'FX Deep Sub Boom 15', fn: () => synthFX(1.5, 'impact'), bpm: 140, key: 'None', tags: ['FX', 'SubBoom', '808'] },
  { cat: 'FX', name: 'FX Alien Transmission 16', fn: () => synthFX(1.3, 'glitch'), bpm: 146, key: 'None', tags: ['FX', 'Alien', 'SciFi'] },
  { cat: 'FX', name: 'FX Tension Drone 17', fn: () => synthFX(2.2, 'downlifter'), bpm: 120, key: 'None', tags: ['FX', 'Tension', 'Atmosphere'] },
  { cat: 'FX', name: 'FX Vinyl Scratch 18', fn: () => synthFX(0.45, 'glitch'), bpm: 125, key: 'None', tags: ['FX', 'Vinyl', 'Scratch'] },
  { cat: 'FX', name: 'FX Modular Beep 19', fn: () => synthFX(0.6, 'glitch'), bpm: 142, key: 'None', tags: ['FX', 'Beep', 'Modular'] },
  { cat: 'FX', name: 'FX Final Grand Slam 20', fn: () => synthFX(2.0, 'impact'), bpm: 142, key: 'None', tags: ['FX', 'Slam', 'Climax'] },
];

console.log(`Starting real Sound Library generation: ${SOUND_DEFINITIONS.length} audio assets...`);

// Ensure folders exist
const categories = ['Drums', 'Bass', 'Leads', 'Synths', 'Keys', 'FX'];
categories.forEach((c) => {
  fs.mkdirSync(path.join(resourcesSoundsDir, c), { recursive: true });
  fs.mkdirSync(path.join(publicSoundsDir, c), { recursive: true });
});

const metadataList = [];

SOUND_DEFINITIONS.forEach((item, index) => {
  const fileName = `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.wav`;
  const relativePath = `${item.cat}/${fileName}`;
  const resourceFilePath = path.join(resourcesSoundsDir, relativePath);
  const publicFilePath = path.join(publicSoundsDir, relativePath);

  // Generate audio samples
  const samples = item.fn();
  const wavBuffer = createWavBuffer(samples, SAMPLE_RATE);

  fs.writeFileSync(resourceFilePath, wavBuffer);
  fs.writeFileSync(publicFilePath, wavBuffer);

  const duration = Math.round((samples.length / SAMPLE_RATE) * 100) / 100;
  const size = wavBuffer.length;
  const waveform = generateWaveformPeaks(samples, 32);

  const meta = {
    id: `snd_${String(index + 1).padStart(3, '0')}`,
    name: item.name,
    category: item.cat,
    fileName,
    relativePath,
    format: 'WAV',
    duration,
    size,
    sampleRate: SAMPLE_RATE,
    channels: 1,
    bpm: item.bpm,
    key: item.key,
    tags: item.tags,
    waveform,
    installed: true,
    cached: false,
  };

  metadataList.push(meta);
});

// Save metadata files
const metaJson = JSON.stringify(metadataList, null, 2);
fs.writeFileSync(path.join(resourcesSoundsDir, 'library-metadata.json'), metaJson, 'utf8');
fs.writeFileSync(path.join(publicSoundsDir, 'library-metadata.json'), metaJson, 'utf8');

// Generate TypeScript source file
const tsSource = `// Automatically generated by scripts/generate-sound-library.js
export interface SoundAssetMetadata {
  id: string;
  name: string;
  category: 'Drums' | 'Bass' | 'Leads' | 'Synths' | 'Keys' | 'FX';
  fileName: string;
  relativePath: string;
  format: string;
  duration: number;
  size: number;
  sampleRate: number;
  channels: number;
  bpm: number;
  key: string;
  tags: string[];
  waveform: number[];
  installed: boolean;
  cached?: boolean;
}

export const SOUND_LIBRARY_METADATA: SoundAssetMetadata[] = ${metaJson};
`;

fs.writeFileSync(path.join(rootDir, 'src', 'data', 'soundLibraryData.ts'), tsSource, 'utf8');

console.log(`✓ Real Sound Library successfully built! Generated exactly ${SOUND_DEFINITIONS.length} WAV audio assets across 6 categories.`);
