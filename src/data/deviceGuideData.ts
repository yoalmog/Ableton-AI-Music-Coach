import { AbletonDevice } from '../types';

export const ABLETON_DEVICES: AbletonDevice[] = [
  {
    id: 'operator',
    name: 'Operator',
    category: 'Synth',
    description: 'Ableton’s iconic FM and additive synthesizer. Famous for razor-sharp Psytrance rolling basslines, punchy kick drums, and metallic FM lead zaps.',
    keyParameters: [
      { name: 'Oscillator Waveform', recommendedSetting: 'Saw / Square / Sine', purpose: 'Selects the core harmonic raw material.' },
      { name: 'Filter Frequency & Decay', recommendedSetting: '600 Hz cutoff, 165ms decay', purpose: 'Controls low-pass envelope plucking.' },
      { name: 'Envelope Amount', recommendedSetting: '+12 to +28', purpose: 'Determines how bright the attack transient sounds.' },
    ],
    psytranceUseCases: [
      '16th Note Rolling Basslines (Saw wave + 24dB LP filter envelope)',
      'FM Laser Zaps & Squelches (FM routing algorithm A<-B<-C<-D)',
      'Custom Synthesized Sub Kicks'
    ],
    technoUseCases: [
      'Industrial Metallic Offbeat Stabs',
      'Sub Bass Waves',
      'FM Noise Rises'
    ],
    shortcutKey: 'Cmd+F / Ctrl+F "Operator"',
  },
  {
    id: 'wavetable',
    name: 'Wavetable',
    category: 'Synth',
    description: 'Dual-wavetable synthesizer with rich visual modulation matrix. Perfect for evolving Goa acid lines, metallic morphing textures, and complex psy bass.',
    keyParameters: [
      { name: 'Wavetable Position', recommendedSetting: 'Automated via LFO 1', purpose: 'Morphs timbre over time for organic movement.' },
      { name: 'Filter 1 Mode', recommendedSetting: '24dB PRD or MS2', purpose: 'Provides analog-style drive and self-oscillating resonance.' },
    ],
    psytranceUseCases: [
      'Evolving Goa Acid Leads',
      'Sub-bass morphing with Sub oscillator',
      'Atmospheric alien sweeps'
    ],
    technoUseCases: [
      'Dark hypnotic chord stabs',
      'Raw industrial textures'
    ]
  },
  {
    id: 'roar',
    name: 'Roar',
    category: 'Audio Effect',
    description: 'Ableton Live 12’s flagship saturation, distortion, and coloring effect. Features triple-stage routing, multiband capabilities, and feedback matrix.',
    keyParameters: [
      { name: 'Drive / Shaper Mode', recommendedSetting: 'Tube / Soft Clip / Tube Warm', purpose: 'Adds rich odd harmonics to glue kick and bass.' },
      { name: 'Multiband Split', recommendedSetting: 'Low / Mid / High split at 120Hz and 2.5kHz', purpose: 'Saturates high end without dirtying sub frequencies.' },
    ],
    psytranceUseCases: [
      'Gluing Kick & Bass together into a solid punchy unit',
      'Harmonic warmth on Goa Lead synths',
      'Crushed percussion loops'
    ],
    technoUseCases: [
      'Warehouse Techno Kick Rumble overdrive',
      'Raw industrial hi-hat distortion'
    ]
  },
  {
    id: 'saturator',
    name: 'Saturator',
    category: 'Audio Effect',
    description: 'Classic warmth and wave-shaping distortion device in Live 12. Essential for soft clipping transients to gain loudness.',
    keyParameters: [
      { name: 'Drive', recommendedSetting: '+1.5 dB to +4.0 dB', purpose: 'Increases harmonic weight.' },
      { name: 'Base / Soft Clip', recommendedSetting: 'Soft Clip ON', purpose: 'Prevents digital harshness while boosting perceived loudness.' },
    ],
    psytranceUseCases: [
      'Kick drum transient rounding',
      'Psytrance bass harmonic enrichment'
    ],
    technoUseCases: [
      'Techno Rumble distortion'
    ]
  },
  {
    id: 'utility',
    name: 'Utility',
    category: 'Audio Effect',
    description: 'Essential Swiss-Army knife plugin for gain staging, phase inversion, and mono low-end management.',
    keyParameters: [
      { name: 'Bass Mono', recommendedSetting: 'ON at 120 Hz', purpose: 'Collapses all sub frequencies under 120Hz strictly to mono.' },
      { name: 'Gain', recommendedSetting: 'Automation gain staging', purpose: 'Controls track volume without affecting mixer faders.' },
      { name: 'Phase L/R', recommendedSetting: 'Phase Invert', purpose: 'Aligning phase between kick and bass.' }
    ],
    psytranceUseCases: [
      'Mandatory on Master, Bass, and Kick channels for 100% Mono Sub'
    ],
    technoUseCases: [
      'Mono low-end and stereo width expansion on hi-hats'
    ]
  }
];
