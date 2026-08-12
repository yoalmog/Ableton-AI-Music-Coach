import { PromptTemplate } from '../types';

export const PROMPT_LIBRARY: PromptTemplate[] = [
  {
    id: 'p_psy_bass',
    title: 'Dark Rolling Psytrance Bassline in F# Minor',
    category: 'Psytrance',
    targetDeviceOrTopic: 'Operator / Wavetable',
    promptText: 'Explain step-by-step how to synthesize a rolling 16th Psytrance sub bass in F# minor at 142 BPM using Ableton Live 12 Operator. Include exact filter cutoff Hz, envelope attack/decay ms, Saturator drive dB, and Utility mono settings.',
  },
  {
    id: 'p_goa_acid',
    title: 'Resonant Goa Acid Lead Sweep',
    category: 'Goa',
    targetDeviceOrTopic: 'Drift / Roar',
    promptText: 'How do I create a 90s Goa Psytrance TB-303 style acid lead sweep in Ableton Live 12 Drift synth? Show envelope modulation, 24dB ladder filter resonance settings, and Roar distortion routing.',
  },
  {
    id: 'p_fullon_squelch',
    title: 'Full-On Psytrance Grid Zap / Squelch',
    category: 'Full-On',
    targetDeviceOrTopic: 'Wavetable / Delay',
    promptText: 'Provide the exact parameters for a squelchy Psytrance FX zap in Wavetable. Include LFO frequency, pitch envelope drop, and ping-pong delay send settings.',
  },
  {
    id: 'p_techno_rumble',
    title: 'Peak-Time Techno Kick & Sub Rumble',
    category: 'Techno',
    targetDeviceOrTopic: 'Audio Effect Rack / Delay / Saturator',
    promptText: 'Explain how to build a Techno sub-rumble Audio Effect Rack branch in Ableton Live 12 using Reverb -> Overdrive -> Auto Filter (Lowpass at 140Hz) -> Compressor sidechained to Kick C1.',
  },
  {
    id: 'p_melodic_stab',
    title: 'Melodic Techno Minor Chord Stab',
    category: 'Techno',
    targetDeviceOrTopic: 'Meld / Hybrid Reverb',
    promptText: 'How do I sound design a deep Melodic Techno chord stab using Ableton Live 12 Meld synth and Hybrid Reverb? Provide chord notes, filter decay, and chorus settings.',
  },
  {
    id: 'p_mix_kick_bass',
    title: 'Fixing Kick & Bass Low-End Masking',
    category: 'Mixing',
    targetDeviceOrTopic: 'EQ Eight / Auto Filter Sidechain',
    promptText: 'My kick and bass are clashing around 60Hz-100Hz in F# Minor. Give me a 4-step checklist to clean up the low end, align phase, and adjust Auto Filter sidechain ducking in Ableton Live 12.',
  },
  {
    id: 'p_arr_breakdown',
    title: 'Building a 32-Bar Epic Breakdown',
    category: 'Arrangement',
    targetDeviceOrTopic: 'Arrangement View / Automation',
    promptText: 'Give me a 32-bar breakdown arrangement blueprint for a 142 BPM Psytrance track. Detail what instruments stop, how filter automation sweeps, and how the riser builds to the main drop.',
  },
];
