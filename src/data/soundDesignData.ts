import { SoundDesignRecipe } from '../types';

export const SOUND_DESIGN_RECIPES: SoundDesignRecipe[] = [
  {
    id: 'recipe_psy_bass',
    title: 'Rolling Psytrance Saw Bass',
    genre: 'Psytrance',
    targetSound: 'Rolling Sub Bass',
    abletonDevicesUsed: ['Operator', 'Utility', 'EQ Eight', 'Saturator'],
    difficulty: 'Beginner',
    estimatedTimeMin: 5,
    proTip: 'Always check phase relationship between Kick and Bass using Utility Phase Invert button if low end sounds hollow.',
    steps: [
      {
        stepNumber: 1,
        title: 'Initialize Operator Synth',
        deviceName: 'Operator',
        instructions: 'Load Operator on a MIDI track. Select Algorithm D (parallel, 4 independent oscillators).',
        parameters: [
          { paramName: 'Osc A Waveform', value: 'Saw D (Sawtooth)' },
          { paramName: 'Osc A Coarse', value: '0.5 or 1 (Octave 1)' },
        ]
      },
      {
        stepNumber: 2,
        title: 'Configure Lowpass Filter & Envelope',
        deviceName: 'Operator',
        instructions: 'Select Filter section in Operator. Set to 24dB Low Pass.',
        parameters: [
          { paramName: 'Filter Cutoff', value: '550 Hz' },
          { paramName: 'Filter Resonance', value: '0.0' },
          { paramName: 'Filter Env Attack', value: '0.00 ms' },
          { paramName: 'Filter Env Decay', value: '165 ms' },
          { paramName: 'Filter Env Sustain', value: '0.0' },
          { paramName: 'Filter Env Amount', value: '+24' },
        ]
      },
      {
        stepNumber: 3,
        title: 'Mono Low End & EQ High Pass',
        deviceName: 'Utility & EQ Eight',
        instructions: 'Add Utility to make low frequencies mono, then high-pass below 30Hz.',
        parameters: [
          { paramName: 'Utility Bass Mono', value: 'ON (120 Hz)' },
          { paramName: 'EQ Eight Band 1 HPF', value: '30 Hz (48dB/oct)' },
        ]
      }
    ]
  },
  {
    id: 'recipe_goa_acid',
    title: 'Hypnotic Goa Acid Lead',
    genre: 'Goa Psytrance',
    targetSound: 'Goa Acid Lead',
    abletonDevicesUsed: ['Wavetable', 'Roar', 'Echo', 'Reverb'],
    difficulty: 'Intermediate',
    estimatedTimeMin: 8,
    proTip: 'Automate Wavetable Position and Resonance using Ableton LFO plugin to make the acid filter talk automatically!',
    steps: [
      {
        stepNumber: 1,
        title: 'Wavetable Acid Oscillator Setup',
        deviceName: 'Wavetable',
        instructions: 'Load Wavetable. Set Oscillator 1 to "Basic Shapes" or "Acid Saw".',
        parameters: [
          { paramName: 'Osc 1 Waveform', value: 'Sawtooth' },
          { paramName: 'Sub Oscillator', value: 'Tone 5, -1 Octave' },
          { paramName: 'Filter 1 Mode', value: 'MS2 (24dB Low Pass)' },
          { paramName: 'Filter Resonance', value: '65%' }
        ]
      },
      {
        stepNumber: 2,
        title: 'Add Live 12 Roar Coloration',
        deviceName: 'Roar',
        instructions: 'Insert Roar distortion. Select "Tube Soft" mode to add rich scream to the filter sweep.',
        parameters: [
          { paramName: 'Drive', value: '+3.5 dB' },
          { paramName: 'Feedback', value: '15%' },
          { paramName: 'Blend', value: '50% Dry/Wet' }
        ]
      }
    ]
  },
  {
    id: 'recipe_psy_zap',
    title: 'FM Cyber Squelch / Zap',
    genre: 'Psytrance',
    targetSound: 'Psy Squelch / Zap',
    abletonDevicesUsed: ['Operator', 'Delay'],
    difficulty: 'Intermediate',
    estimatedTimeMin: 6,
    proTip: 'Map pitch bend range to +24 semitones and use pitch wheel automation during drops!',
    steps: [
      {
        stepNumber: 1,
        title: 'Operator FM Routing',
        deviceName: 'Operator',
        instructions: 'Set Algorithm A (Frequency Modulation chain A <- B <- C <- D).',
        parameters: [
          { paramName: 'Osc A Wave', value: 'Sine' },
          { paramName: 'Osc B Wave', value: 'Sine, Coarse 3.0' },
          { paramName: 'Osc B Level', value: '-12 dB' },
          { paramName: 'Pitch Envelope', value: 'On, Decay 80ms, Amount +24' }
        ]
      }
    ]
  }
];
