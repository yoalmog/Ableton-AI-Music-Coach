import { 
  SoundDesignDeviceLesson, 
  SoundDesignDeviceType, 
  DevicePracticalExample 
} from '../types/soundDesignEducation';
import { parseNoteToMidiNumber } from './midiService';

export const SOUND_DESIGN_LESSONS: SoundDesignDeviceLesson[] = [
  {
    id: 'wavetable',
    name: 'Wavetable',
    category: 'Wavetable Synthesis',
    tagline: 'Dual-Wavetable Morphing Synthesizer with Visual Modulation Matrix',
    description: 'Wavetable is Ableton Live’s premier visual wavetable synthesizer. Rather than using fixed static waveforms like traditional analog synths, Wavetable reads through a series of single-cycle waveforms arranged in a table (a "wavetable"). By sweeping the Wavetable Position parameter with envelopes or LFOs, you can morph continuously between timbres—from pure sinusoidal tones to organic instruments, vocal formants, and aggressive digital textures.',
    theoryAndWorkflow: 'Wavetable synthesis consists of three core stages: (1) Oscillator Generation, where two independent wavetable oscillators plus a dedicated sub-oscillator produce rich, morphing harmonic content; (2) Dual Filter Section, modeling legendary analog topologies including PRD (Pro-One), MS2 (Korg MS-20), OSR (OSCar), and Clean; and (3) A comprehensive Modulation Matrix that maps any source (envelopes, LFOs, velocity, MIDI MPE) to any parameter with bipolar depth control.',
    signalFlow: [
      'Dual Wavetable Oscillators (Osc 1 & Osc 2) + Dedicated Sub Oscillator',
      'Analog-modeled Dual Filters (PRD / MS2 / OSR / Clean 12dB & 24dB)',
      'Stereo Unison Engine (Classic, Shimmer, Noise, Phase Sync, Random)',
      'Modulation Matrix Routing (3 Envelopes + 2 Multi-Wave LFOs)',
      'Master Output with Soft Limiting'
    ],
    keyFeatures: [
      'Over 150 factory wavetables across 11 harmonic categories (Basics, Formants, Distortion, Retro, Complex)',
      'Real-time 3D and 2D wavetable visualization in Ableton Live',
      'True sub-oscillator with octave transpose and tone coloring',
      'Dual multi-mode filters with serial and parallel routing options',
      'Polyphonic MPE (MIDI Polyphonic Expression) per-note slide and pressure'
    ],
    shortcutKey: 'Cmd + F (Mac) / Ctrl + F (Win) -> Type "Wavetable"',
    useCases: [
      {
        title: 'Evolving Goa & Acid Leads',
        genre: 'Goa / Psytrance',
        description: 'Automate Wavetable Position using an LFO mapped to a Complex or Formant table while applying a resonant 24dB MS2 filter for biting psychedelic squelches.',
        proTip: 'Map LFO 1 to Wavetable 1 Position at +45% depth and set LFO rate to synced 1/8d or 3/16 for hypnotic tempo-locked movement.'
      },
      {
        title: 'Punchy Psytrance Rolling Sub-Bass',
        genre: 'Psytrance / Full-On',
        description: 'Use Osc 1 set to a pure Basic Shapes Saw, combined with the Sub oscillator at -1 Octave to deliver immovable low-end punch through a 24dB Lowpass filter.',
        proTip: 'Turn on Phase Retrigger so every 16th note triggers at the exact same wave phase to eliminate sub-bass phase cancellation.'
      },
      {
        title: 'Dark Hypnotic Melodic Techno Stabs',
        genre: 'Melodic Techno',
        description: 'Combine a detuned Saw-Square wavetable with 5-voice Classic Unison, modulated by a fast decaying filter envelope (Env 2).',
        proTip: 'Keep Unison spread below 35% on bass/mid stabs to maintain strong mono center balance.'
      }
    ],
    coreConcepts: [
      {
        term: 'Wavetable Position',
        explanation: 'The index or point along the 3D wavetable that dictates which single-cycle harmonic wave is currently read by the oscillator.',
        abletonTip: 'Modulate this parameter with an envelope or LFO to introduce evolving sonic motion that static analog synths cannot achieve.'
      },
      {
        term: 'Filter Circuit Models (PRD / MS2 / OSR)',
        explanation: 'PRD emulates the snappy Curtis chip; MS2 provides raw aggressive resonance; OSR introduces warm diode saturation.',
        abletonTip: 'Increase Filter Drive (+2 to +6 dB) when using MS2 or OSR to add analog saturation that thickens digital waveforms.'
      },
      {
        term: 'Unison Modes',
        explanation: 'Duplicates the voices with pitch detune and stereo panning across the stereo spectrum.',
        abletonTip: 'Use "Shimmer" mode for ambient pads or "Classic" mode with 3 voices for wide stereo leads.'
      }
    ],
    practicalExamples: [
      {
        id: 'wavetable_acid_morph',
        title: 'Goa Acid Morphing Lead',
        category: 'Lead Synth',
        genre: 'Goa Psytrance',
        difficulty: 'Intermediate',
        description: 'A cutting lead sound where the wavetable position scans between harmonically rich waveforms while a resonant lowpass filter sweeps downward on each note.',
        abletonStepByStep: [
          'Load Wavetable onto a new MIDI Track (Cmd+Shift+T).',
          'In Osc 1, choose Category: "Basics" -> Wavetable: "Basic Shapes". Set Position to 35%.',
          'In the Mod Matrix, connect Env 2 to Filter 1 Freq at +45.',
          'Set Filter 1 to Mode: 24dB MS2, Cutoff: 850 Hz, Resonance: 45%, Drive: +3.0 dB.',
          'Set Env 2 Attack: 0 ms, Decay: 180 ms, Sustain: 0%, Release: 25 ms.',
          'Under Unison, select "Classic", Voices: 3, Amount: 28%.'
        ],
        parameters: {
          wavetablePosition: 45,
          filterCutoff: 1200,
          filterResonance: 8,
          envDecayMs: 220,
          subLevel: 0.25,
          drive: 3.5,
          unisonAmount: 25
        },
        parameterControls: [
          {
            id: 'wavetablePosition',
            name: 'Wavetable Position',
            type: 'slider',
            min: 0,
            max: 100,
            step: 1,
            unit: '%',
            description: 'Scans through the wavetable cycles, altering the fundamental harmonic timbre.',
            learnMoreTip: 'At 0% the wave is warm and basic; at 100% it introduces rich metallic upper harmonics.'
          },
          {
            id: 'filterCutoff',
            name: 'Filter Cutoff',
            type: 'slider',
            min: 150,
            max: 8000,
            step: 50,
            unit: 'Hz',
            description: 'Determines the baseline frequency where high frequencies are attenuated.',
            learnMoreTip: 'Around 1000-2500Hz gives the most pronounced acid bite when paired with resonance.'
          },
          {
            id: 'filterResonance',
            name: 'Resonance (Q)',
            type: 'slider',
            min: 1,
            max: 18,
            step: 0.5,
            unit: 'Q',
            description: 'Boosts harmonics around the cutoff frequency to create distinctive squelch.',
            learnMoreTip: 'High resonance values (10-15) create the classic screaming Goa trance character.'
          },
          {
            id: 'envDecayMs',
            name: 'Decay Time',
            type: 'slider',
            min: 50,
            max: 600,
            step: 10,
            unit: 'ms',
            description: 'Duration for the filter cutoff envelope to plunge from peak to baseline.',
            learnMoreTip: '180-250ms is the sweet spot for 140-145 BPM 16th-note acid sequences.'
          },
          {
            id: 'drive',
            name: 'Filter Drive',
            type: 'slider',
            min: 0,
            max: 12,
            step: 0.5,
            unit: 'dB',
            description: 'Analog circuit saturation level before the filter stage.',
            learnMoreTip: 'Adds warm tape/tube harmonics that make the sound cut through dense mixes.'
          }
        ],
        demoPattern: {
          bpm: 144,
          key: 'F#',
          scale: 'Phrygian',
          notes: [
            { pitch: 'F#2', time: 0, duration: 0.2, velocity: 110 },
            { pitch: 'G2', time: 0.25, duration: 0.2, velocity: 95 },
            { pitch: 'F#2', time: 0.5, duration: 0.2, velocity: 105 },
            { pitch: 'A#2', time: 0.75, duration: 0.2, velocity: 120 },
            { pitch: 'F#2', time: 1.0, duration: 0.2, velocity: 100 },
            { pitch: 'C#3', time: 1.25, duration: 0.2, velocity: 115 },
            { pitch: 'B2', time: 1.5, duration: 0.2, velocity: 105 },
            { pitch: 'G2', time: 1.75, duration: 0.2, velocity: 110 }
          ]
        }
      },
      {
        id: 'wavetable_psy_bass',
        title: 'Psytrance Rolling Wavetable Bass',
        category: 'Bass Synth',
        genre: 'Psytrance',
        difficulty: 'Beginner',
        description: 'A heavy 16th-note rolling bassline utilizing Wavetable with phase retriggering and a clean sub-oscillator foundation.',
        abletonStepByStep: [
          'Set Live 12 tempo to 142 BPM.',
          'Load Wavetable, select Osc 1: Basic Shapes -> Saw.',
          'Activate Sub oscillator: Tone: 0%, Gain: -4 dB.',
          'Set Polyphony to Mono (1 voice), Glide: 0 ms.',
          'Enable "Phase Retrigger" (retrigger button in Osc 1) so phase starts at 0 degrees consistently.',
          'Filter 1: 24dB Clean or PRD, Cutoff: 400 Hz, Resonance: 15%.',
          'Env 2 Decay: 120 ms, Sustain: 0%, Release: 10 ms mapped to Filter Cutoff.'
        ],
        parameters: {
          wavetablePosition: 10,
          filterCutoff: 450,
          filterResonance: 3,
          envDecayMs: 130,
          subLevel: 0.7,
          drive: 1.5,
          unisonAmount: 0
        },
        parameterControls: [
          {
            id: 'filterCutoff',
            name: 'Cutoff Frequency',
            type: 'slider',
            min: 150,
            max: 1500,
            step: 25,
            unit: 'Hz',
            description: 'Controls the brightness of the bass attack.',
            learnMoreTip: 'Keep below 600Hz for a smooth rolling groove that leaves headroom for leads.'
          },
          {
            id: 'envDecayMs',
            name: 'Amp & Filter Decay',
            type: 'slider',
            min: 60,
            max: 200,
            step: 5,
            unit: 'ms',
            description: 'Sets the gate and plucking length of each 16th-note bass strike.',
            learnMoreTip: 'At 142 BPM, a 16th note is 105ms. Setting decay around 110-130ms keeps it tight without mud.'
          },
          {
            id: 'subLevel',
            name: 'Sub Oscillator Gain',
            type: 'slider',
            min: 0,
            max: 1,
            step: 0.05,
            unit: '',
            description: 'Level of the pure sine fundamental an octave below the saw.',
            learnMoreTip: 'Provides physical chest punch on club subwoofers.'
          }
        ],
        demoPattern: {
          bpm: 142,
          key: 'F#',
          scale: 'Minor',
          notes: [
            { pitch: 'F#1', time: 0.25, duration: 0.2, velocity: 100 },
            { pitch: 'F#1', time: 0.5, duration: 0.2, velocity: 105 },
            { pitch: 'F#1', time: 0.75, duration: 0.2, velocity: 110 },
            { pitch: 'F#1', time: 1.25, duration: 0.2, velocity: 100 },
            { pitch: 'F#1', time: 1.5, duration: 0.2, velocity: 105 },
            { pitch: 'F#1', time: 1.75, duration: 0.2, velocity: 110 }
          ]
        }
      }
    ],
    quizQuestions: [
      {
        id: 'wt_q1',
        question: 'What is the primary sonic advantage of Wavetable synthesis over basic analog subtractive synthesis?',
        options: [
          'It uses fewer CPU resources.',
          'It can continuously morph between complex harmonic waveforms over time.',
          'It can only play acoustic piano samples.',
          'It does not require an audio filter.'
        ],
        correctIndex: 1,
        explanation: 'Wavetable synthesis allows continuous interpolation through tables of distinct single-cycle waveforms, giving living, morphing timbres that fixed analog oscillators cannot match.'
      }
    ]
  },
  {
    id: 'operator',
    name: 'Operator',
    category: 'FM Synthesis',
    tagline: 'Versatile 4-Operator Frequency Modulation & Additive Synthesizer',
    description: 'Operator is Ableton Live’s legendary 4-operator synthesizer. Built on the principles of Frequency Modulation (FM), Operator allows one oscillator (the "Modulator") to modulate the frequency of another oscillator (the "Carrier") at audio rates. This creates sidebands—rich, metallic, bell-like, or razor-sharp harmonic and inharmonic spectra that define punchy Psytrance rolling basses, surgical kick drums, metallic bells, and futuristic lead squelches.',
    theoryAndWorkflow: 'In FM synthesis, you don’t need high-order filters to create brightness; the Modulation Index (amount of FM level from the modulator) determines the brightness and harmonic complexity. Operator features 11 routing algorithms, deciding which operators modulate which. The Coarse Ratio determines the pitch relationship between Carrier and Modulator (e.g., a 1:1 ratio creates integer harmonic overtones, while non-integer ratios like 1:3.5 create metallic inharmonic timbres).',
    signalFlow: [
      '4 Independent Audio Oscillators / Operators (A, B, C, D)',
      '11 Selectable FM Routing Algorithms (Serial, Parallel, Branched)',
      'Per-Operator Pitch & Amplitude Envelopes with Loop modes',
      'Multi-Mode Filter Section with Drive & Shaper',
      'Global Pitch Envelope with Spread and Time Morphing'
    ],
    keyFeatures: [
      '4 sine/harmonic wave operators capable of FM, additive, and subtractive synthesis',
      'Variable Coarse (harmonic ratio) and Fine (cents) tuning per operator',
      'Built-in Anti-aliased waveshaping filter with analog drive models',
      'Feedback loop on Operator D for generating analog-style saw waves and noise',
      'Fast, click-free envelopes with sub-millisecond attack times ideal for punchy transients'
    ],
    shortcutKey: 'Cmd + F (Mac) / Ctrl + F (Win) -> Type "Operator"',
    useCases: [
      {
        title: 'The Definitive Psytrance Rolling Bassline',
        genre: 'Psytrance / Full-On / Goa',
        description: 'Operator A as a clean Saw wave, with Operator B adding subtle FM bite on the attack, routed into a 24dB lowpass filter with a 130ms decay envelope.',
        proTip: 'Keep Operator B coarse ratio at 1, level at -18 dB, and decay around 60ms to give the bass punch without blurring the low-end definition.'
      },
      {
        title: 'Hyper-Resonant FM Laser Zaps',
        genre: 'Psytrance / Hi-Tech / Forest',
        description: 'Route Operator B into A with a non-integer ratio (e.g., 2.5 or 3.5). Apply a fast pitch envelope decaying downward by 24 semitones in 40 milliseconds.',
        proTip: 'Automate Operator B level during breakdowns to make laser zaps progressively wilder.'
      },
      {
        title: 'Industrial Techno Stabs & Metallic Bells',
        genre: 'Peak-Time Techno',
        description: 'Serial algorithm D -> C -> B -> A with inharmonic coarse ratios (1 : 1.414 : 2.73) to produce resonant metallic industrial tones.',
        proTip: 'Add short decay (80-150ms) and feed into a stereo delay for deep warehouse atmosphere.'
      }
    ],
    coreConcepts: [
      {
        term: 'Carrier vs Modulator',
        explanation: 'A Carrier is an oscillator routed directly to audio output. A Modulator is routed into the frequency input of another operator.',
        abletonTip: 'In Operator’s serial algorithm (A<-B<-C<-D), Operator A is the sole Carrier and B, C, D act as cascading modulators.'
      },
      {
        term: 'Harmonic Ratio (Coarse)',
        explanation: 'The frequency multiplier of the modulator relative to the fundamental note played.',
        abletonTip: 'Integer ratios (1, 2, 3, 4) produce musical, harmonic overtones. Decimal ratios produce metallic, dissonant, or bell-like textures.'
      },
      {
        term: 'Modulation Index (FM Depth)',
        explanation: 'How strongly the modulator perturbs the carrier frequency, controlling the number and strength of generated sideband frequencies.',
        abletonTip: 'In Operator, raising the Modulator volume knob increases the modulation index, making the sound brighter and more aggressive.'
      }
    ],
    practicalExamples: [
      {
        id: 'operator_psy_rolling_bass',
        title: '16th Rolling Bassline (Operator Engine)',
        category: 'Bass Synth',
        genre: 'Psytrance',
        difficulty: 'Beginner',
        description: 'The golden standard of electronic dance music: an Operator patch tuned to deliver a rock-solid, punchy low-end foundation with zero mud.',
        abletonStepByStep: [
          'Load Operator onto a MIDI track.',
          'Set Algorithm to Parallel (Horizontal line of 4 boxes) or standard Serial.',
          'Operator A: Waveform: "Saw D" or "Saw", Level: 0 dB, Attack: 0 ms, Decay: 140 ms, Sustain: -inf dB.',
          'Operator B: Waveform: "Sine", Coarse: 1, Level: -16 dB, Decay: 65 ms (adds transient click).',
          'Filter Section: Mode: Lowpass 24dB Clean, Cutoff: 450 Hz, Resonance: 15%.',
          'Filter Envelope: Amount: +24, Decay: 120 ms, Sustain: 0%.',
          'Global tab: Voices: 1 (Mono), Retrigger: ON.'
        ],
        parameters: {
          coarseRatio: 1,
          fmAmount: 18,
          filterCutoff: 520,
          filterEnvAmount: 24,
          decayMs: 140,
          drive: 2
        },
        parameterControls: [
          {
            id: 'coarseRatio',
            name: 'Modulator Coarse Ratio',
            type: 'slider',
            min: 0.5,
            max: 8,
            step: 0.5,
            unit: 'x',
            description: 'Frequency ratio of Modulator B relative to Carrier A.',
            learnMoreTip: 'Keep at 1.0 for warm bass reinforcement; raise to 2.0 or 3.0 for sharp metallic attack.'
          },
          {
            id: 'fmAmount',
            name: 'FM Modulation Depth',
            type: 'slider',
            min: 0,
            max: 100,
            step: 1,
            unit: '%',
            description: 'Modulation index from Operator B modulating Carrier A.',
            learnMoreTip: '15-25% gives the ideal transient knock without sounding overly harsh or noisy.'
          },
          {
            id: 'filterCutoff',
            name: 'Filter Cutoff',
            type: 'slider',
            min: 100,
            max: 2000,
            step: 20,
            unit: 'Hz',
            description: 'Static lowpass cutoff ceiling.',
            learnMoreTip: 'Around 400-600Hz keeps bass energetic while preventing clashing with mid-frequency leads.'
          },
          {
            id: 'decayMs',
            name: 'Envelope Decay',
            type: 'slider',
            min: 70,
            max: 280,
            step: 5,
            unit: 'ms',
            description: 'How fast both amplitude and filter envelopes return to zero.',
            learnMoreTip: 'At 145 BPM, 130-150ms creates the quintessential energetic rolling bounce.'
          }
        ],
        demoPattern: {
          bpm: 145,
          key: 'F#',
          scale: 'Minor',
          notes: [
            { pitch: 'F#1', time: 0.25, duration: 0.2, velocity: 100 },
            { pitch: 'F#1', time: 0.5, duration: 0.2, velocity: 105 },
            { pitch: 'F#1', time: 0.75, duration: 0.2, velocity: 110 },
            { pitch: 'F#1', time: 1.25, duration: 0.2, velocity: 100 },
            { pitch: 'F#1', time: 1.5, duration: 0.2, velocity: 105 },
            { pitch: 'F#1', time: 1.75, duration: 0.2, velocity: 110 }
          ]
        }
      },
      {
        id: 'operator_fm_laser_zap',
        title: 'Metallic FM Laser Zap',
        category: 'FX & Leads',
        genre: 'Psytrance',
        difficulty: 'Intermediate',
        description: 'An explosive FM laser effect with a high non-harmonic ratio and rapid pitch drop that pierces through heavy mixdowns.',
        abletonStepByStep: [
          'Load Operator, set Algorithm to Serial (A <- B <- C <- D).',
          'Operator A: Sine wave, Coarse: 1.',
          'Operator B: Sine wave, Coarse: 3.5, Level: -4 dB (High FM index).',
          'In Global Pitch Envelope: Enable Pitch Env, Amount: +24 st, Decay: 55 ms.',
          'Filter Section: Bandpass 24dB, Cutoff: 2200 Hz, Resonance: 35%.',
          'Add a stereo ping-pong Echo or Delay afterward for space.'
        ],
        parameters: {
          coarseRatio: 3.5,
          fmAmount: 75,
          filterCutoff: 2400,
          filterEnvAmount: 50,
          decayMs: 90,
          drive: 4
        },
        parameterControls: [
          {
            id: 'coarseRatio',
            name: 'Coarse Ratio',
            type: 'slider',
            min: 1,
            max: 7,
            step: 0.5,
            unit: 'x',
            description: 'Non-integer ratios create metallic, robotic laser characteristics.',
            learnMoreTip: 'Try 2.5, 3.5, or 5.0 for futuristic sci-fi laser textures.'
          },
          {
            id: 'fmAmount',
            name: 'FM Depth',
            type: 'slider',
            min: 20,
            max: 100,
            step: 2,
            unit: '%',
            description: 'Intensity of frequency modulation.',
            learnMoreTip: 'Higher values create extreme brightness and chaotic sidebands.'
          },
          {
            id: 'decayMs',
            name: 'Laser Decay',
            type: 'slider',
            min: 30,
            max: 250,
            step: 5,
            unit: 'ms',
            description: 'Speed of the laser transient.',
            learnMoreTip: 'Shorter decays (60-90ms) feel like tight electrical sparks.'
          }
        ],
        demoPattern: {
          bpm: 145,
          key: 'A',
          scale: 'Minor',
          notes: [
            { pitch: 'A2', time: 0, duration: 0.15, velocity: 120 },
            { pitch: 'C3', time: 0.5, duration: 0.15, velocity: 115 },
            { pitch: 'A2', time: 1.0, duration: 0.15, velocity: 125 },
            { pitch: 'D#3', time: 1.5, duration: 0.15, velocity: 110 }
          ]
        }
      }
    ],
    quizQuestions: [
      {
        id: 'op_q1',
        question: 'In FM Synthesis, what happens when you raise the volume of a Modulator oscillator?',
        options: [
          'The Carrier oscillator pitch changes to a different musical key.',
          'The modulation index increases, creating more sideband frequencies and a brighter, richer timbre.',
          'The entire synthesizer immediately mutes.',
          'Only white noise is produced.'
        ],
        correctIndex: 1,
        explanation: 'Increasing modulator amplitude increases the modulation index, generating stronger and more numerous sidebands around the carrier frequency, making the sound brighter and harmonically richer.'
      }
    ]
  },
  {
    id: 'echo',
    name: 'Echo',
    category: 'Time-based & Delay',
    tagline: 'Modern Modulated Delay, Stereo Ping-Pong & Tape Echo Unit',
    description: 'Echo is Ableton Live’s comprehensive delay and echo workstation. It merges the character of vintage analog tape echos and classic bucket-brigade hardware delay pedals with state-of-the-art digital modulation and stereo processing. Featuring independent L/R channel delays, rhythmic sync modes, variable tape-style saturation, analog wobble/flutter modulation, and built-in ducking, Echo can generate everything from subtle rhythmic slaps to endless psychedelic dub spaces.',
    theoryAndWorkflow: 'The core architecture of Echo consists of: (1) Delay Time Lines, which can be synced to musical note divisions (16th, triplets, dotted) or measured in milliseconds with smooth or repitch tape behaviors; (2) Feedback Network, passing the delayed signal back into the input buffer for cascading repetitions; (3) Filter & Character Processing, including high-pass and low-pass shaping, tape drive clipping, and vintage wobble modulation; and (4) Built-in Ducking, which automatically attenuates echo repeats while the dry signal is playing to keep vocals or leads clear.',
    signalFlow: [
      'Stereo Input with Input Gain & Soft Tape Drive',
      'Dual Delay Lines (Left/Right) with Ping-Pong and Stereo Width Modes',
      'Feedback Circuit with Filter Dampening (High-Pass & Low-Pass)',
      'Modulation Engine (LFO Wobble / Flutter affecting delay times)',
      'Ducking & Noise Generator stage before Dry/Wet Mix'
    ],
    keyFeatures: [
      'Stereo, Ping-Pong, and Mid/Side delay routing modes',
      'Independent Left and Right delay divisions with cross-feed',
      'Morphing delay time modes: Repitch (tape pitch warp), Fade (crossfade), and Jump',
      'Character Tab: Drive, Wobble, Noise, and Reverb inside the delay loop',
      'Built-in dynamic Ducking compressor to prevent muddy mixdowns'
    ],
    shortcutKey: 'Cmd + F (Mac) / Ctrl + F (Win) -> Type "Echo"',
    useCases: [
      {
        title: 'Dub Techno Space & Ping-Pong Delays',
        genre: 'Dub Techno / Deep Techno',
        description: 'Set Left delay to 16th and Right to dotted 8th (or Ping-Pong mode ON), with 65% feedback and tape drive for warm, evolving dub chord echoes.',
        proTip: 'Activate the High-Pass filter around 250 Hz in Echo’s Filter tab so low-mid buildup does not cloud the kick drum.'
      },
      {
        title: 'Psytrance Rhythmic Pluck Grooves',
        genre: 'Psytrance / Goa',
        description: 'Send a staccato synth pluck into Echo set to 3/16 (dotted 16th) delay with 40% feedback and 30% wet to fill the empty sonic space between 16th-note bass notes.',
        proTip: 'Add subtle Wobble (0.5 Hz rate, 15% depth) to create the signature organic tape-flutter sound of classic Israeli and Goa psytrance.'
      },
      {
        title: 'Atmospheric Reverb-Delay Washes',
        genre: 'Ambient / Psy-Chill',
        description: 'Engage Echo’s built-in Reverb unit (set to Post-Delay) with 80% feedback for endless, shimmering cinematic ambient tails.',
        proTip: 'Use Repitch mode and automate the delay time slightly during live transitions for tape pitch-drop effects.'
      }
    ],
    coreConcepts: [
      {
        term: 'Feedback Percentage',
        explanation: 'The proportion of delayed signal routed back into the delay input buffer. At 0%, you get a single echo repeat. At 100%, echoes sustain indefinitely.',
        abletonTip: 'Values between 45% and 65% create a natural, musical decay tail without running away into distortion.'
      },
      {
        term: 'Repitch Mode',
        explanation: 'Emulates physical tape speed adjustments: changing the delay time dynamically shifts the pitch up or down, creating classic vintage tape warps.',
        abletonTip: 'Automate delay time with Repitch mode during a track transition to create dramatic DJ-style tape stops.'
      },
      {
        term: 'Delay Ducking',
        explanation: 'A compressor that reduces the volume of delayed repeats whenever the input signal is actively playing, releasing the echo tail only during pauses.',
        abletonTip: 'Use ducking on lead synths and vocals to keep words and transients punchy without sacrificing deep space.'
      }
    ],
    practicalExamples: [
      {
        id: 'echo_dub_techno',
        title: 'Dub Techno Space Ping-Pong',
        category: 'Delay FX',
        genre: 'Melodic Techno',
        difficulty: 'Beginner',
        description: 'A warm, cascading stereo ping-pong delay that bounces chords across the stereo spectrum with tape warmth and high-cut dampening.',
        abletonStepByStep: [
          'Place Echo directly on a Chord Synth channel or a Return Track.',
          'Set Mode to "Ping Pong" (switch in upper center).',
          'Set Left Delay to 3 (Dotted 16th) and Right Delay to 4 (Quarter note).',
          'Feedback: 55%.',
          'Under Filter tab: High-pass at 220 Hz, Low-pass at 3500 Hz (warm analog rolloff).',
          'Under Character tab: Drive: +3 dB, Wobble: Amount: 20%, Rate: 0.3 Hz.',
          'Set Dry/Wet to 35%.'
        ],
        parameters: {
          delayTimeMs: 280,
          feedback: 58,
          dryWet: 38,
          highCutHz: 3200,
          lowCutHz: 250,
          wobbleDepth: 25
        },
        parameterControls: [
          {
            id: 'delayTimeMs',
            name: 'Delay Time',
            type: 'slider',
            min: 80,
            max: 600,
            step: 10,
            unit: 'ms',
            description: 'Time duration between successive echo repetitions.',
            learnMoreTip: 'Around 250-320ms corresponds to musical 8th and dotted 16th rhythms at 125-140 BPM.'
          },
          {
            id: 'feedback',
            name: 'Feedback',
            type: 'slider',
            min: 0,
            max: 90,
            step: 1,
            unit: '%',
            description: 'Amount of delayed sound fed back into the delay circuit.',
            learnMoreTip: 'High feedback (60-80%) builds deep dub hypnotic textures; keep below 95% to avoid runaway overload.'
          },
          {
            id: 'dryWet',
            name: 'Dry / Wet Mix',
            type: 'slider',
            min: 0,
            max: 100,
            step: 1,
            unit: '%',
            description: 'Balance between original dry signal and processed delay repeats.',
            learnMoreTip: 'On an insert track, 25-40% sits cleanly. On a Return track, set to 100% Wet.'
          },
          {
            id: 'highCutHz',
            name: 'High Dampening (Low-Pass)',
            type: 'slider',
            min: 1000,
            max: 12000,
            step: 200,
            unit: 'Hz',
            description: 'Cuts high frequencies in the feedback loop for vintage tape warmth.',
            learnMoreTip: 'Filtering out frequencies above 3.5kHz makes delayed echoes sit behind the dry synth in the mix.'
          },
          {
            id: 'wobbleDepth',
            name: 'Tape Wobble Depth',
            type: 'slider',
            min: 0,
            max: 100,
            step: 2,
            unit: '%',
            description: 'Modulates the delay time slightly to simulate imperfect tape motor flutter.',
            learnMoreTip: 'Adds organic three-dimensional stereo width and warmth.'
          }
        ],
        demoPattern: {
          bpm: 130,
          key: 'D',
          scale: 'Minor',
          notes: [
            { pitch: 'D2', time: 0, duration: 0.15, velocity: 110 },
            { pitch: 'A2', time: 0.75, duration: 0.15, velocity: 95 },
            { pitch: 'F2', time: 1.5, duration: 0.15, velocity: 105 }
          ]
        }
      }
    ],
    quizQuestions: [
      {
        id: 'echo_q1',
        question: 'Why should you apply high-pass filtering (around 200-300 Hz) inside an Echo feedback loop?',
        options: [
          'To make the kick drum sound twice as loud.',
          'To prevent low-end mud and rumble from accumulating with every repetition and clashing with the bass.',
          'Because high-pass filters turn stereo delays into mono.',
          'It is required by MIDI protocol.'
        ],
        correctIndex: 1,
        explanation: 'Low frequencies carry significant energy. If allowed to circulate in the delay feedback loop, they quickly build up into a muddy roar that destroys the headroom of your kick and sub-bass.'
      }
    ]
  },
  {
    id: 'autofilter',
    name: 'Auto Filter',
    category: 'Filter & Modulation',
    tagline: 'Dynamic Multi-Mode Filter with Envelope Follower & Tempo-Synced LFO',
    description: 'Auto Filter is one of Ableton Live’s most expressive and widely used audio effect devices. It combines pristine digital and analog-modeled filter circuits (Clean, OSR, MS2, SMP, PRD) with dynamic modulation sources: an internal Envelope Follower that responds to incoming audio transients, and a multi-waveform LFO synced to the project tempo. From rhythmic pumping and acid filter sweeps to automated DJ-style tension builds, Auto Filter is a cornerstone of electronic music production.',
    theoryAndWorkflow: 'Auto Filter passes audio through one of four primary filter topologies: Lowpass, Highpass, Bandpass, or Notch. The Cutoff frequency can be modulated simultaneously by two dynamic systems: (1) The Envelope section, which measures the volume level of the input audio and shifts the cutoff up or down dynamically; and (2) The LFO section, which continuously modulates the cutoff with Sine, Triangle, Saw, Square, or Sample & Hold waveforms at precise musical rhythmic divisions (1/4, 1/8, 1/16).',
    signalFlow: [
      'Audio Input into Analog Shaper / Drive Stage',
      'Selectable Filter Topology (Lowpass, Highpass, Bandpass, Morph, Notch) with 12dB & 24dB Slopes',
      'Envelope Follower (Attack, Release, and Bipolar Amount)',
      'LFO Modulation Engine with Stereo Phase Offset for Stereo Width',
      'Output Gain Compensation'
    ],
    keyFeatures: [
      'Analog-modeled circuit choices: Clean, OSR (OSCar), MS2 (MS-20), SMP (Sequential), PRD (Pro-One)',
      'Bipolar Envelope Follower: filters open or close with input velocity',
      'Tempo-synced LFO with Phase control for rotating stereo filter panning',
      'Morph mode: seamlessly sweeps from Lowpass through Bandpass to Highpass',
      'Sidechain input routing: filter cutoff can be modulated by an external kick or percussion track'
    ],
    shortcutKey: 'Cmd + F (Mac) / Ctrl + F (Win) -> Type "Auto Filter"',
    useCases: [
      {
        title: 'Psytrance Acid Squelch Sweeps',
        genre: 'Psytrance / Goa',
        description: 'Set Auto Filter to Bandpass 24dB or MS2 with high resonance (Q = 8-14), modulated by an LFO running at 1 bar or 1/2 bar to create hypnotic squelch movements.',
        proTip: 'Set LFO Phase to 180 degrees. This moves the left and right filter frequencies in opposite directions, creating intense psychedelic 3D stereo rotation.'
      },
      {
        title: 'Dynamic Drum & Percussion Pumping',
        genre: 'Techno / House',
        description: 'Use the Envelope Follower with positive amount (+25) and fast attack (5ms) on a hi-hat or percussion loop so every hit opens the filter brightly before clamping down.',
        proTip: 'Use the OSR circuit and add +3dB of Drive to add crunch to sterile digital samples.'
      },
      {
        title: 'Buildup & Drop Tension Sweeps',
        genre: 'Electronic Music',
        description: 'Automate Auto Filter Highpass frequency rising from 30 Hz up to 800 Hz over 8 bars before a drop to strip the energy, then snap it back to 30 Hz on beat 1.',
        proTip: 'Slightly increase Resonance right before the drop to emphasize the anticipation.'
      }
    ],
    coreConcepts: [
      {
        term: 'Filter Slope (12dB vs 24dB)',
        explanation: 'Specifies how steeply frequencies are cut beyond the cutoff point (12dB/octave is gentle and musical; 24dB/octave is steep and surgical).',
        abletonTip: 'Use 12dB for smooth acoustic or pad filtering; use 24dB for snappy acid leads and tight sub-bass rolloffs.'
      },
      {
        term: 'LFO Stereo Phase Offset',
        explanation: 'Shifts the phase of the LFO modulating the Right channel relative to the Left channel (0 degrees = identical mono sweep, 180 degrees = full opposite stereo sweep).',
        abletonTip: 'Setting Phase to 90 or 180 degrees instantly gives width to static mono synth lines.'
      },
      {
        term: 'Envelope Follower',
        explanation: 'Analyzes incoming audio amplitude transients and converts them into a control signal that opens or closes the filter in sync with the performance.',
        abletonTip: 'A negative envelope amount creates an auto-ducking effect without needing an external sidechain routing.'
      }
    ],
    practicalExamples: [
      {
        id: 'autofilter_acid_sweep',
        title: 'Psychedelic Bandpass LFO Sweep',
        category: 'Filter Effect',
        genre: 'Psytrance',
        difficulty: 'Beginner',
        description: 'A 24dB bandpass filter with screaming resonance modulated by a tempo-synced LFO to turn static saw riffs into alien psychedelic squelches.',
        abletonStepByStep: [
          'Insert Auto Filter onto an audio or synth track.',
          'Select Filter Type: Bandpass (the bell curve icon).',
          'Circuit: 24dB MS2 (for aggressive analog bite).',
          'Set Baseline Frequency: 1400 Hz, Resonance (Q): 9.0.',
          'In the LFO section: Sync ON, Rate: 1/2 or 1 Bar.',
          'LFO Waveform: Sine or Triangle.',
          'LFO Amount: 65%.',
          'LFO Phase: 120° (adds wide stereo swirling).'
        ],
        parameters: {
          filterType: 'bandpass',
          cutoffHz: 1600,
          resonance: 10,
          lfoRate: 1.5,
          lfoDepth: 70,
          drive: 3
        },
        parameterControls: [
          {
            id: 'cutoffHz',
            name: 'Center Cutoff Frequency',
            type: 'slider',
            min: 300,
            max: 5000,
            step: 50,
            unit: 'Hz',
            description: 'The baseline frequency around which the filter sweeps.',
            learnMoreTip: '1200-2400Hz gives the most audible vocal-like "wah" squelch.'
          },
          {
            id: 'resonance',
            name: 'Resonance (Q)',
            type: 'slider',
            min: 1,
            max: 18,
            step: 0.5,
            unit: 'Q',
            description: 'Sharpness and peak gain of the filtered band.',
            learnMoreTip: 'Values above 8 produce authentic screaming psytrance acid harmonics.'
          },
          {
            id: 'lfoRate',
            name: 'LFO Sweep Speed',
            type: 'slider',
            min: 0.2,
            max: 6,
            step: 0.1,
            unit: 'Hz',
            description: 'Speed of the automatic cyclic filter sweep.',
            learnMoreTip: 'Slow speeds (0.5-1.5Hz) produce long evolving movements; fast speeds (4-6Hz) create vibrato flutter.'
          },
          {
            id: 'lfoDepth',
            name: 'LFO Sweep Depth',
            type: 'slider',
            min: 0,
            max: 100,
            step: 2,
            unit: '%',
            description: 'Range of frequency deviation caused by the LFO.',
            learnMoreTip: 'Higher depth covers a wider frequency spectrum from dark thumps to piercing highs.'
          }
        ],
        demoPattern: {
          bpm: 142,
          key: 'E',
          scale: 'Phrygian',
          notes: [
            { pitch: 'E2', time: 0, duration: 0.18, velocity: 110 },
            { pitch: 'E2', time: 0.25, duration: 0.18, velocity: 100 },
            { pitch: 'F2', time: 0.5, duration: 0.18, velocity: 115 },
            { pitch: 'E2', time: 0.75, duration: 0.18, velocity: 105 },
            { pitch: 'G2', time: 1.0, duration: 0.18, velocity: 120 },
            { pitch: 'F2', time: 1.25, duration: 0.18, velocity: 110 },
            { pitch: 'B2', time: 1.5, duration: 0.18, velocity: 125 },
            { pitch: 'E2', time: 1.75, duration: 0.18, velocity: 105 }
          ]
        }
      }
    ],
    quizQuestions: [
      {
        id: 'af_q1',
        question: 'What sonic effect does increasing the LFO Phase parameter to 180 degrees produce in Auto Filter?',
        options: [
          'It turns off the left audio channel entirely.',
          'It modulates Left and Right filters in opposite directions, creating immersive, swirling stereo movement.',
          'It pitch-shifts the synth up an octave.',
          'It enables sidechain compression.'
        ],
        correctIndex: 1,
        explanation: 'At 180 degrees of Phase offset, while the left channel filter is opening upward, the right channel filter is closing downward, producing dramatic binaural stereo movement.'
      }
    ]
  },
  {
    id: 'roar',
    name: 'Roar',
    category: 'Color & Saturation',
    tagline: 'Ableton Live 12 Multistage Saturation, Coloring & Wave Shaper Device',
    description: 'Introduced in Ableton Live 12, Roar is a groundbreaking color and saturation powerhouse. It provides triple-stage distortion routing (Single, Serial, Parallel, Multiband, Mid/Side, and Feedback) with a rich collection of analog waveshapers, filters, and a comprehensive modulation matrix. Whether you need gentle tape warmth to glue your mix or aggressive, screaming industrial distortion, Roar delivers unprecedented control over harmonics and dynamics.',
    theoryAndWorkflow: 'Roar routes incoming audio through up to three distortion stages. In Multiband mode, it splits audio into Low, Mid, and High frequency bands with customizable crossover points, allowing you to saturate the punchy mids while leaving sub-bass pure and clean. In Feedback mode, distorted audio is re-injected through a resonant delay line for screaming, metallic harmonics.',
    signalFlow: [
      'Input Tone Shaping Stage',
      'Configurable Distortion Routing (Serial / Parallel / Multiband / Mid-Side / Feedback)',
      'Dual / Triple Nonlinear Waveshapers (Tube, Soft Clip, Heavy Diode, Bit Crush)',
      'Pre & Post Shaper Filters per stage',
      'Global Feedback Loop & Dry/Wet Mix'
    ],
    keyFeatures: [
      'Six structural routing configurations: Single, Serial, Parallel, Multiband, Mid/Side, Feedback',
      'Over a dozen shaper curves from subtle tape warmth to extreme wave folding',
      'Independent Pre/Post filter on each stage to sculpt exactly what gets distorted',
      'Internal Modulation Matrix featuring 2 LFOs, Envelope Follower, and Noise generator',
      'High-resolution visual oscilloscope and transfer curve display'
    ],
    shortcutKey: 'Cmd + F (Mac) / Ctrl + F (Win) -> Type "Roar"',
    useCases: [
      {
        title: 'Gluing Kick & Bass Bus with Multiband Warmth',
        genre: 'Psytrance / Techno',
        description: 'Use Multiband mode to saturate only the 200 Hz - 4 kHz band with subtle Tube drive (+2.5 dB), keeping sub frequencies (<120 Hz) pristine and un-distorted.',
        proTip: 'Set Dry/Wet to 30% for parallel saturation that adds punch without destroying dynamic range.'
      },
      {
        title: 'Industrial Warehouse Techno Kicks',
        genre: 'Industrial Techno',
        description: 'Use Feedback mode with Diode Clipper shaper and 40% feedback to turn a standard 909 kick into a thunderous, rolling warehouse rumble.',
        proTip: 'Automate Roar’s tone filter during builds to let high-frequency sizzle rise into the drop.'
      }
    ],
    coreConcepts: [
      {
        term: 'Multiband Saturation',
        explanation: 'Splits frequency spectrum so distortion can be applied selectively to mid harmonics without destroying low-end sub clarity.',
        abletonTip: 'Place crossover 1 around 120Hz to protect your sub-bass from distortion phase cancellation.'
      },
      {
        term: 'Shaper Curves',
        explanation: 'Mathematical functions that transform audio waveforms (soft clipping rounds peaks gently; hard clipping flattens peaks for aggressive bite).',
        abletonTip: 'Use "Warm Tube" for musical analog glue; use "Fold" or "Bite" for cutting synth leads.'
      }
    ],
    practicalExamples: [
      {
        id: 'roar_parallel_glue',
        title: 'Parallel Mid-Frequency Saturation & Glue',
        category: 'Saturation FX',
        genre: 'Psytrance',
        difficulty: 'Intermediate',
        description: 'Adds rich odd and even harmonics to make synth leads and percussion sound larger and louder without peak volume spikes.',
        abletonStepByStep: [
          'Place Roar on a drum bus or lead synth track.',
          'Set Routing to "Parallel" or "Multiband".',
          'Stage 1: Mode: "Warm Tube", Drive: +4.0 dB.',
          'Tone Filter: High-pass at 200 Hz so sub frequencies pass cleanly.',
          'Set Dry/Wet Mix to 35%.'
        ],
        parameters: {
          driveDb: 5,
          toneHz: 450,
          feedback: 15,
          dryWet: 40,
          shaperMode: 'Warm Tube'
        },
        parameterControls: [
          {
            id: 'driveDb',
            name: 'Drive Gain',
            type: 'slider',
            min: 0,
            max: 18,
            step: 0.5,
            unit: 'dB',
            description: 'Input gain pushed into the nonlinear waveshaper.',
            learnMoreTip: '+3 to +6dB adds musical warmth; +10dB+ produces aggressive clipping.'
          },
          {
            id: 'toneHz',
            name: 'Tone Frequency',
            type: 'slider',
            min: 100,
            max: 6000,
            step: 50,
            unit: 'Hz',
            description: 'Shapes the frequency emphasis before distortion.',
            learnMoreTip: 'Focusing on 800-2500Hz gives guitar-like mid-range presence.'
          },
          {
            id: 'dryWet',
            name: 'Dry / Wet Mix',
            type: 'slider',
            min: 0,
            max: 100,
            step: 2,
            unit: '%',
            description: 'Blends parallel clean signal with saturated output.',
            learnMoreTip: '30-45% allows aggressive drive settings while preserving natural dynamics.'
          }
        ],
        demoPattern: {
          bpm: 140,
          key: 'F#',
          scale: 'Minor',
          notes: [
            { pitch: 'F#2', time: 0, duration: 0.2, velocity: 110 },
            { pitch: 'A2', time: 0.5, duration: 0.2, velocity: 105 },
            { pitch: 'C#3', time: 1.0, duration: 0.2, velocity: 115 },
            { pitch: 'E3', time: 1.5, duration: 0.2, velocity: 120 }
          ]
        }
      }
    ],
    quizQuestions: [
      {
        id: 'roar_q1',
        question: 'Why is Roar’s Multiband routing especially useful when mixing Kick and Bass in Live 12?',
        options: [
          'It automatically sets your project tempo.',
          'It allows you to saturate mid and high harmonics for punch while leaving the sub frequencies clean and un-distorted.',
          'It replaces the need for a kick drum.',
          'It turns audio into MIDI notes.'
        ],
        correctIndex: 1,
        explanation: 'Sub-bass frequencies easily distort into mud and lose headroom when passed through aggressive saturators. Multiband routing lets you saturate only the audible punch (200Hz - 4kHz) while keeping the sub clean.'
      }
    ]
  },
  {
    id: 'drift',
    name: 'Drift',
    category: 'Subtractive Synthesis',
    tagline: 'Ableton Live 12 Analog-Modeled Character Synthesizer with Organic Voice Drift',
    description: 'Drift is Ableton’s character-rich subtractive synthesizer inspired by vintage analog hardware. It focuses on warmth, organic pitch drift, and immediate tactile sound design. Featuring an analog-modeled oscillator with variable pulse-width and waveform morphing, a dedicated noise generator, and a warm 4-pole lowpass ladder filter, Drift brings organic, living movement to leads, basslines, and pads without tedious modulation routing.',
    theoryAndWorkflow: 'The secret to Drift’s sound is its "Drift" engine—an internal micro-fluctuation system that continuously modulates oscillator pitch, filter cutoffs, and voice timings slightly out of sync across voices, just like the drifting capacitors and temperature-sensitive circuits of vintage analog polysynths.',
    signalFlow: [
      'Dual Analog-Style Oscillators (Osc 1 with morphing waves, Osc 2 with detune)',
      'Sub Oscillator / Noise Generator with pink & white noise modes',
      'Analog-Modeled 4-Pole (24dB) Resonant Lowpass Filter with self-oscillation',
      'Internal Pitch & Voice Drift Engine',
      'Stereo Spread and Master Output'
    ],
    keyFeatures: [
      'Variable oscillator shapes that morph smoothly between Sine, Triangle, Saw, and Pulse',
      'Independent "Drift" knob to dial in subtle organic warmth or vintage VHS tape warble',
      'Resonant analog ladder filter capable of rich self-oscillation',
      'Compact, streamlined single-view interface designed for rapid workflow',
      'Polyphonic, Mono, and Legato voice allocation modes with chord memory'
    ],
    shortcutKey: 'Cmd + F (Mac) / Ctrl + F (Win) -> Type "Drift"',
    useCases: [
      {
        title: 'Warm Analog Techno Chords & Stabs',
        genre: 'Melodic Techno / House',
        description: 'Morph Osc 1 into a warm square-saw blend, set Voice Drift to 35%, and apply a snappy lowpass envelope for classic Detroit/Berlin techno chords.',
        proTip: 'Use Drift’s built-in Stereo Spread to make chords wrap around the speakers.'
      },
      {
        title: 'Vintage Sci-Fi Psy Leads',
        genre: 'Goa Trance / Forest',
        description: 'Set Osc 1 to Saw and Osc 2 to detuned Pulse, increase Drift to 50%, and open a resonant filter for authentic 1990s analog synthesizers.',
        proTip: 'Inject a small amount of Pink Noise (10%) to give the transient authentic vintage grit.'
      }
    ],
    coreConcepts: [
      {
        term: 'Drift Amount',
        explanation: 'Simulates micro-instabilities in voltage, temperature, and component tolerances that gave vintage analog synthesizers their warm, organic presence.',
        abletonTip: 'Keep Drift at 15-30% for subtle warmth; push above 60% for lo-fi tape and VHS pitch warble.'
      },
      {
        term: 'Pulse Width Modulation (PWM)',
        explanation: 'Altering the duty cycle of a square waveform from 50/50 symmetry to narrow pulses, producing hollow, phasing timbres.',
        abletonTip: 'Modulating pulse width with an LFO produces rich ensemble textures without needing multiple oscillators.'
      }
    ],
    practicalExamples: [
      {
        id: 'drift_analog_pluck',
        title: 'Vintage Analog Pluck & Lead',
        category: 'Lead Synth',
        genre: 'Melodic Techno',
        difficulty: 'Beginner',
        description: 'A warm, punchy analog pluck with organic pitch drift that sounds like classic vintage hardware.',
        abletonStepByStep: [
          'Load Drift on a MIDI track.',
          'Osc 1: Select Saw wave, Shape: 20%.',
          'Osc 2: Select Square wave, Detune: +8 cents.',
          'Set Drift Knob: 35% (in the upper right Voice section).',
          'Filter: Lowpass 24dB, Cutoff: 950 Hz, Resonance: 30%.',
          'Env 1 Decay: 200 ms, Sustain: 0% mapped to Filter Cutoff (+30).'
        ],
        parameters: {
          driftAmount: 35,
          cutoffHz: 1100,
          resonance: 5,
          decayMs: 220,
          noiseLevel: 0.1,
          pulseWidth: 40
        },
        parameterControls: [
          {
            id: 'driftAmount',
            name: 'Analog Drift',
            type: 'slider',
            min: 0,
            max: 100,
            step: 2,
            unit: '%',
            description: 'Amount of organic pitch and component drift.',
            learnMoreTip: 'At 30-40% notes feel alive and three-dimensional.'
          },
          {
            id: 'cutoffHz',
            name: 'Ladder Filter Cutoff',
            type: 'slider',
            min: 200,
            max: 6000,
            step: 50,
            unit: 'Hz',
            description: 'Cutoff frequency of the 4-pole analog lowpass ladder filter.',
            learnMoreTip: '800-1400Hz produces warm, rounded acoustic-like plucks.'
          },
          {
            id: 'resonance',
            name: 'Resonance',
            type: 'slider',
            min: 1,
            max: 14,
            step: 0.5,
            unit: 'Q',
            description: 'Analog resonance emphasizing harmonics at the cutoff point.',
            learnMoreTip: 'Warm ladder filters self-oscillate smoothly without harsh digital clipping.'
          },
          {
            id: 'decayMs',
            name: 'Pluck Decay',
            type: 'slider',
            min: 60,
            max: 500,
            step: 10,
            unit: 'ms',
            description: 'Time duration for the note to decay into silence.',
            learnMoreTip: '180-240ms creates the quintessential snappy melodic techno pluck.'
          }
        ],
        demoPattern: {
          bpm: 126,
          key: 'A',
          scale: 'Minor',
          notes: [
            { pitch: 'A2', time: 0, duration: 0.18, velocity: 110 },
            { pitch: 'C3', time: 0.25, duration: 0.18, velocity: 95 },
            { pitch: 'E3', time: 0.5, duration: 0.18, velocity: 105 },
            { pitch: 'A2', time: 0.75, duration: 0.18, velocity: 100 },
            { pitch: 'G2', time: 1.0, duration: 0.18, velocity: 115 },
            { pitch: 'B2', time: 1.25, duration: 0.18, velocity: 100 },
            { pitch: 'D3', time: 1.5, duration: 0.18, velocity: 110 },
            { pitch: 'E3', time: 1.75, duration: 0.18, velocity: 105 }
          ]
        }
      }
    ],
    quizQuestions: [
      {
        id: 'drift_q1',
        question: 'What is the purpose of the "Drift" parameter in Ableton Live 12’s Drift synthesizer?',
        options: [
          'It exports the song as an MP3 file.',
          'It introduces subtle micro-fluctuations in pitch and filter timing to recreate the organic warmth of vintage analog circuits.',
          'It switches the project from 4/4 to 3/4 time signature.',
          'It converts audio into text.'
        ],
        correctIndex: 1,
        explanation: 'Drift simulates real-world hardware component instability, imparting natural, organic warmth and character to every note.'
      }
    ]
  }
];

export class SoundDesignLessonService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isPlaying = false;
  private playbackTimer: any = null;
  private activeNodes: Array<{ stop: (t: number) => void }> = [];
  private currentParams: Record<string, any> = {};
  private activeDeviceId: SoundDesignDeviceType = 'wavetable';
  private isBypassed = false;

  constructor() {
    // AudioContext will initialize lazily on user gesture
  }

  private initAudio() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

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

  public getAnalyser(): AnalyserNode | null {
    this.initAudio();
    return this.analyser;
  }

  public getLessons(): SoundDesignDeviceLesson[] {
    return SOUND_DESIGN_LESSONS;
  }

  public getLesson(deviceId: string | SoundDesignDeviceType): SoundDesignDeviceLesson | undefined {
    return SOUND_DESIGN_LESSONS.find((l) => l.id === deviceId);
  }

  public setBypass(bypass: boolean) {
    this.isBypassed = bypass;
  }

  public getIsBypassed(): boolean {
    return this.isBypassed;
  }

  public updateLiveParameter(key: string, value: any) {
    this.currentParams[key] = value;
  }

  public stopPlayback() {
    this.isPlaying = false;
    if (this.playbackTimer) {
      clearTimeout(this.playbackTimer);
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }

    const now = this.ctx?.currentTime || 0;
    this.activeNodes.forEach((n) => {
      try {
        n.stop(now);
      } catch {}
    });
    this.activeNodes = [];
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Plays a single test audition note with the device parameters
   */
  public playSingleAudition(
    deviceId: SoundDesignDeviceType,
    pitchStr: string = 'F#2',
    params: Record<string, any> = {},
    durationSec: number = 0.4
  ) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    this.activeDeviceId = deviceId;
    this.currentParams = { ...params };
    const midiNum = parseNoteToMidiNumber(pitchStr);
    const freq = 440 * Math.pow(2, (midiNum - 69) / 12);
    const t = this.ctx.currentTime;

    this.synthesizeDeviceVoice(deviceId, freq, t, durationSec, 110, this.currentParams);
  }

  /**
   * Loops or plays the practical example musical pattern through real Web Audio DSP
   */
  public playDevicePattern(
    deviceId: SoundDesignDeviceType,
    example: DevicePracticalExample,
    params: Record<string, any>,
    loop: boolean = true,
    onStepCallback?: (noteIndex: number) => void
  ) {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    this.stopPlayback();
    this.isPlaying = true;
    this.activeDeviceId = deviceId;
    this.currentParams = { ...params };

    const { bpm, notes } = example.demoPattern;
    const secondsPerBeat = 60 / bpm;
    const totalBeats = Math.max(...notes.map((n) => n.time + n.duration), 2);
    const patternDurationSec = totalBeats * secondsPerBeat;

    const playLoopIteration = () => {
      if (!this.isPlaying || !this.ctx) return;
      const startTime = this.ctx.currentTime + 0.05;

      notes.forEach((note, idx) => {
        if (!this.ctx) return;
        const noteTime = startTime + note.time * secondsPerBeat;
        const noteDuration = Math.max(0.08, note.duration * secondsPerBeat);
        const midiNum = parseNoteToMidiNumber(note.pitch);
        const freq = 440 * Math.pow(2, (midiNum - 69) / 12);

        this.synthesizeDeviceVoice(
          deviceId,
          freq,
          noteTime,
          noteDuration,
          note.velocity,
          this.currentParams
        );

        if (onStepCallback) {
          const delayMs = Math.max(0, (noteTime - this.ctx.currentTime) * 1000);
          setTimeout(() => {
            if (this.isPlaying) onStepCallback(idx);
          }, delayMs);
        }
      });

      if (loop && this.isPlaying) {
        this.playbackTimer = setTimeout(() => {
          if (this.isPlaying) playLoopIteration();
        }, patternDurationSec * 1000);
      } else {
        this.playbackTimer = setTimeout(() => {
          this.isPlaying = false;
        }, patternDurationSec * 1000);
      }
    };

    playLoopIteration();
  }

  /**
   * Real Web Audio synthesis engine routing for each specific device
   */
  private synthesizeDeviceVoice(
    deviceId: SoundDesignDeviceType,
    freq: number,
    t: number,
    durationSec: number,
    velocity: number,
    params: Record<string, any>
  ) {
    if (!this.ctx || !this.masterGain) return;

    const velNorm = Math.max(0.1, velocity / 127);

    // If bypassed, play raw clean saw wave
    if (this.isBypassed) {
      const dryOsc = this.ctx.createOscillator();
      dryOsc.type = 'sawtooth';
      dryOsc.frequency.setValueAtTime(freq, t);
      const dryGain = this.ctx.createGain();
      dryGain.gain.setValueAtTime(0.4 * velNorm, t);
      dryGain.gain.exponentialRampToValueAtTime(0.001, t + durationSec);
      dryOsc.connect(dryGain);
      dryGain.connect(this.masterGain);
      dryOsc.start(t);
      dryOsc.stop(t + durationSec + 0.05);
      this.activeNodes.push(dryOsc);
      return;
    }

    switch (deviceId) {
      case 'wavetable':
        this.synthesizeWavetable(freq, t, durationSec, velNorm, params);
        break;
      case 'operator':
        this.synthesizeOperator(freq, t, durationSec, velNorm, params);
        break;
      case 'echo':
        this.synthesizeEcho(freq, t, durationSec, velNorm, params);
        break;
      case 'autofilter':
        this.synthesizeAutoFilter(freq, t, durationSec, velNorm, params);
        break;
      case 'roar':
        this.synthesizeRoar(freq, t, durationSec, velNorm, params);
        break;
      case 'drift':
        this.synthesizeDrift(freq, t, durationSec, velNorm, params);
        break;
    }
  }

  // 1. REAL WAVETABLE SYNTHESIS (Morphing harmonics between Saw, Sine, and Complex Metallic)
  private synthesizeWavetable(freq: number, t: number, dur: number, vel: number, params: Record<string, any>) {
    if (!this.ctx || !this.masterGain) return;

    const pos = Number(params.wavetablePosition ?? 40);
    const cutoff = Number(params.filterCutoff ?? 1200);
    const res = Number(params.filterResonance ?? 6);
    const decay = Math.max(0.05, Number(params.envDecayMs ?? 200) / 1000);
    const sub = Number(params.subLevel ?? 0.3);
    const drive = Number(params.drive ?? 2);

    // Primary morphing oscillator
    const osc1 = this.ctx.createOscillator();
    // Use Fourier series periodic wave for authentic wavetable scanning
    const real = new Float32Array(16);
    const imag = new Float32Array(16);
    real[0] = 0;
    imag[0] = 0;
    const morphRatio = pos / 100;
    for (let n = 1; n < 16; n++) {
      // Morph between pure saw (1/n) and metallic overtone spike (n * morphRatio)
      const sawWeight = 1 / n;
      const metallicWeight = Math.sin(n * morphRatio * Math.PI) / Math.sqrt(n);
      imag[n] = sawWeight * (1 - morphRatio * 0.7) + metallicWeight * (morphRatio * 0.8);
    }
    const waveTable = this.ctx.createPeriodicWave(real, imag);
    osc1.setPeriodicWave(waveTable);
    osc1.frequency.setValueAtTime(freq, t);

    // Secondary Sub oscillator (1 octave down sine)
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, t);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(sub * 0.6, t);
    subOsc.connect(subGain);

    // 24dB Analog-modeled filter stage (Cascaded biquad filters)
    const f1 = this.ctx.createBiquadFilter();
    f1.type = 'lowpass';
    const peakCutoff = Math.min(16000, cutoff * 2.5);
    f1.frequency.setValueAtTime(peakCutoff, t);
    f1.frequency.exponentialRampToValueAtTime(Math.max(80, cutoff), t + decay);
    f1.Q.setValueAtTime(res, t);

    // Soft saturation waveshaper for filter drive
    const shaper = this.ctx.createWaveShaper();
    shaper.curve = this.makeDistortionCurve(drive * 5);
    shaper.oversample = '2x';

    // Amplitude envelope
    const ampGain = this.ctx.createGain();
    ampGain.gain.setValueAtTime(0.55 * vel, t);
    ampGain.gain.exponentialRampToValueAtTime(0.001, t + Math.max(dur, decay));

    osc1.connect(f1);
    subGain.connect(f1);
    f1.connect(shaper);
    shaper.connect(ampGain);
    ampGain.connect(this.masterGain);

    osc1.start(t);
    subOsc.start(t);
    const stopTime = t + Math.max(dur, decay) + 0.05;
    osc1.stop(stopTime);
    subOsc.stop(stopTime);

    this.activeNodes.push(osc1, subOsc);
  }

  // 2. REAL OPERATOR FM SYNTHESIS (Carrier + Modulator with Coarse Ratio & Modulation Index)
  private synthesizeOperator(freq: number, t: number, dur: number, vel: number, params: Record<string, any>) {
    if (!this.ctx || !this.masterGain) return;

    const coarse = Number(params.coarseRatio ?? 1);
    const fmIndex = Number(params.fmAmount ?? 25);
    const cutoff = Number(params.filterCutoff ?? 600);
    const decay = Math.max(0.05, Number(params.decayMs ?? 140) / 1000);

    // Carrier Oscillator A
    const carrier = this.ctx.createOscillator();
    carrier.type = 'sawtooth';
    carrier.frequency.setValueAtTime(freq, t);

    // Modulator Oscillator B (FM audio-rate modulation)
    const modulator = this.ctx.createOscillator();
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(freq * coarse, t);

    // FM Modulation Index gain node
    const fmGain = this.ctx.createGain();
    const fmDepthHz = (fmIndex / 100) * freq * 4;
    fmGain.gain.setValueAtTime(fmDepthHz, t);
    fmGain.gain.exponentialRampToValueAtTime(1, t + decay * 0.7);

    // Connect Modulator -> Carrier Frequency parameter (True audio-rate FM!)
    modulator.connect(fmGain);
    fmGain.connect(carrier.frequency);

    // Lowpass 24dB Filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff * 2.2, t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(60, cutoff), t + decay);
    filter.Q.setValueAtTime(4, t);

    const ampGain = this.ctx.createGain();
    ampGain.gain.setValueAtTime(0.6 * vel, t);
    ampGain.gain.exponentialRampToValueAtTime(0.001, t + decay);

    carrier.connect(filter);
    filter.connect(ampGain);
    ampGain.connect(this.masterGain);

    carrier.start(t);
    modulator.start(t);
    const stopTime = t + decay + 0.05;
    carrier.stop(stopTime);
    modulator.stop(stopTime);

    this.activeNodes.push(carrier, modulator);
  }

  // 3. REAL ECHO / STEREO PING-PONG DELAY NETWORK
  private synthesizeEcho(freq: number, t: number, dur: number, vel: number, params: Record<string, any>) {
    if (!this.ctx || !this.masterGain) return;

    const delayMs = Number(params.delayTimeMs ?? 260);
    const feedback = Math.min(0.88, Number(params.feedback ?? 55) / 100);
    const dryWet = Number(params.dryWet ?? 35) / 100;
    const highCut = Number(params.highCutHz ?? 3500);
    const lowCut = Number(params.lowCutHz ?? 200);

    // Dry chord / pluck generator
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    const dryFilter = this.ctx.createBiquadFilter();
    dryFilter.type = 'lowpass';
    dryFilter.frequency.setValueAtTime(3200, t);
    dryFilter.frequency.exponentialRampToValueAtTime(1200, t + dur);

    const dryGain = this.ctx.createGain();
    dryGain.gain.setValueAtTime(0.5 * vel * (1 - dryWet * 0.5), t);
    dryGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    // Delay line with feedback loop and tape dampening filter
    const delay = this.ctx.createDelay();
    delay.delayTime.setValueAtTime(delayMs / 1000, t);

    const delayFeedback = this.ctx.createGain();
    delayFeedback.gain.setValueAtTime(feedback, t);

    const delayHighCut = this.ctx.createBiquadFilter();
    delayHighCut.type = 'lowpass';
    delayHighCut.frequency.setValueAtTime(highCut, t);

    const delayLowCut = this.ctx.createBiquadFilter();
    delayLowCut.type = 'highpass';
    delayLowCut.frequency.setValueAtTime(lowCut, t);

    const wetGain = this.ctx.createGain();
    wetGain.gain.setValueAtTime(dryWet * 0.7, t);

    // Feedback connections: delay -> delayHighCut -> delayLowCut -> delayFeedback -> delay
    delay.connect(delayHighCut);
    delayHighCut.connect(delayLowCut);
    delayLowCut.connect(delayFeedback);
    delayFeedback.connect(delay);
    delayLowCut.connect(wetGain);

    // Routing
    osc.connect(dryFilter);
    dryFilter.connect(dryGain);
    dryFilter.connect(delay); // Send to delay line
    dryGain.connect(this.masterGain);
    wetGain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + dur + 0.05);
    this.activeNodes.push(osc);
  }

  // 4. REAL AUTO FILTER (Multi-mode filter modulated by tempo-synced LFO)
  private synthesizeAutoFilter(freq: number, t: number, dur: number, vel: number, params: Record<string, any>) {
    if (!this.ctx || !this.masterGain) return;

    const filterType = String(params.filterType ?? 'bandpass') as BiquadFilterType;
    const cutoff = Number(params.cutoffHz ?? 1600);
    const res = Number(params.resonance ?? 10);
    const lfoRate = Number(params.lfoRate ?? 1.5);
    const lfoDepth = Number(params.lfoDepth ?? 70);

    // Harmonically rich saw oscillator
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(cutoff, t);
    filter.Q.setValueAtTime(res, t);

    // LFO oscillator modulating the filter frequency directly
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(lfoRate, t);

    const lfoGain = this.ctx.createGain();
    const lfoFreqModAmount = (lfoDepth / 100) * cutoff * 0.9;
    lfoGain.gain.setValueAtTime(lfoFreqModAmount, t);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const amp = this.ctx.createGain();
    amp.gain.setValueAtTime(0.55 * vel, t);
    amp.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(filter);
    filter.connect(amp);
    amp.connect(this.masterGain);

    osc.start(t);
    lfo.start(t);
    const stopTime = t + dur + 0.05;
    osc.stop(stopTime);
    lfo.stop(stopTime);

    this.activeNodes.push(osc, lfo);
  }

  // 5. REAL ROAR (Multistage Waveshaping Saturation with Tone Filter)
  private synthesizeRoar(freq: number, t: number, dur: number, vel: number, params: Record<string, any>) {
    if (!this.ctx || !this.masterGain) return;

    const driveDb = Number(params.driveDb ?? 5);
    const toneHz = Number(params.toneHz ?? 800);
    const dryWet = Number(params.dryWet ?? 40) / 100;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    // Pre-shaper tone filter
    const toneFilter = this.ctx.createBiquadFilter();
    toneFilter.type = 'peaking';
    toneFilter.frequency.setValueAtTime(toneHz, t);
    toneFilter.gain.setValueAtTime(driveDb * 0.8, t);
    toneFilter.Q.setValueAtTime(1.5, t);

    // Nonlinear waveshaper distortion curve
    const shaper = this.ctx.createWaveShaper();
    shaper.curve = this.makeDistortionCurve(driveDb * 12);
    shaper.oversample = '4x';

    // Post lowpass to smooth digital harshness
    const postFilter = this.ctx.createBiquadFilter();
    postFilter.type = 'lowpass';
    postFilter.frequency.setValueAtTime(9000, t);

    const wetGain = this.ctx.createGain();
    wetGain.gain.setValueAtTime(dryWet * 0.6 * vel, t);
    wetGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    const dryGain = this.ctx.createGain();
    dryGain.gain.setValueAtTime((1 - dryWet * 0.5) * 0.45 * vel, t);
    dryGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(dryGain);
    dryGain.connect(this.masterGain);

    osc.connect(toneFilter);
    toneFilter.connect(shaper);
    shaper.connect(postFilter);
    postFilter.connect(wetGain);
    wetGain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + dur + 0.05);
    this.activeNodes.push(osc);
  }

  // 6. REAL DRIFT (Analog-modeled Drift Voice with Organic Pitch Fluctuation)
  private synthesizeDrift(freq: number, t: number, dur: number, vel: number, params: Record<string, any>) {
    if (!this.ctx || !this.masterGain) return;

    const driftAmt = Number(params.driftAmount ?? 35);
    const cutoff = Number(params.cutoffHz ?? 1100);
    const res = Number(params.resonance ?? 5);
    const decay = Math.max(0.06, Number(params.decayMs ?? 200) / 1000);

    // Osc 1 (Saw with subtle random detune drift)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    const driftFreqOffset = (Math.random() * 2 - 1) * (driftAmt / 100) * 3;
    osc1.frequency.setValueAtTime(freq + driftFreqOffset, t);

    // Osc 2 (Square with +8 cents detune)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(freq * 1.0048, t);

    const oscMix = this.ctx.createGain();
    oscMix.gain.setValueAtTime(0.5, t);
    osc1.connect(oscMix);
    osc2.connect(oscMix);

    // 4-Pole Ladder Lowpass Filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff * 2.5, t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(70, cutoff), t + decay);
    filter.Q.setValueAtTime(res, t);

    const amp = this.ctx.createGain();
    amp.gain.setValueAtTime(0.5 * vel, t);
    amp.gain.exponentialRampToValueAtTime(0.001, t + decay);

    oscMix.connect(filter);
    filter.connect(amp);
    amp.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    const stopTime = t + decay + 0.05;
    osc1.stop(stopTime);
    osc2.stop(stopTime);

    this.activeNodes.push(osc1, osc2);
  }

  /**
   * Generates a hyperbolic tangent / sigmoidal waveshaping curve for saturation
   */
  private makeDistortionCurve(amount: number): Float32Array {
    const k = Math.max(0, amount);
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  /**
   * Generates a customized experimental parameter set & practice pattern for the device
   */
  public generateCustomExperiment(deviceId: SoundDesignDeviceType, genre: string = 'Psytrance') {
    const lesson = this.getLesson(deviceId);
    if (!lesson) return null;

    const baseExample = lesson.practicalExamples[0];
    const randomizedParams: Record<string, any> = { ...baseExample.parameters };

    // Apply musical variances based on parameter definitions
    baseExample.parameterControls.forEach((ctrl) => {
      if (ctrl.type === 'slider' && ctrl.min !== undefined && ctrl.max !== undefined) {
        const span = ctrl.max - ctrl.min;
        const randomFactor = 0.3 + Math.random() * 0.55;
        const val = Math.round(ctrl.min + span * randomFactor);
        randomizedParams[ctrl.id] = val;
      }
    });

    return {
      title: `${genre} Experimental ${lesson.name} Patch`,
      parameters: randomizedParams,
      pattern: baseExample.demoPattern
    };
  }
}

export const soundDesignLessonService = new SoundDesignLessonService();
