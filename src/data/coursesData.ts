import { Course } from '../types';

export const COURSES_DATA: Course[] = [
  {
    id: 'psytrance_masterclass',
    title: 'Psytrance Production Masterclass',
    subtitle: 'From Kick & Bass alignment to explosive festival drops in Ableton Live 12',
    genre: 'Psytrance',
    iconName: 'Zap',
    description: 'Master Full-On, Goa, and Progressive Psytrance production using Ableton Live 12 stock synths, Roar saturation, Operator, and MIDI generator workflows.',
    lessons: [
      {
        id: 'psy_l1',
        title: 'Lesson 1: Psytrance BPM, Keys & Scale Foundations',
        description: 'Set up your Ableton Live 12 project for maximum energy and clean low-end clarity.',
        durationMinutes: 10,
        difficulty: 'Beginner',
        genre: 'Psytrance',
        steps: [
          {
            stepNumber: 1,
            title: 'Set Ableton Tempo & Time Signature',
            contentMarkdown: `Psytrance thrives between **138 BPM** (Progressive Psy) and **145 BPM** (Full-On & Goa Psy).

In Ableton Live 12:
1. Set the main **Control Bar Tempo** to **142 BPM**.
2. Set Time Signature to **4/4**.
3. Enable the **Metronome** (or default quarter-note click) to establish the driving pulse.`,
            abletonInstruction: 'Click top left tempo box in Ableton Live 12, type 142, press Enter.',
            parameterHighlights: [{ param: 'Tempo', value: '142.00 BPM' }],
          },
          {
            stepNumber: 2,
            title: 'Choosing Key & Root Scale for Low-End Weight',
            contentMarkdown: `Subwoofers produce optimal punch between **40Hz and 55Hz**.

Recommended Psytrance Root Keys:
- **F#1 (46.2 Hz)** - The undisputed golden key for Psytrance low end.
- **G1 (49.0 Hz)** - Massive festival presence.
- **E1 (41.2 Hz)** - Deep rolling sub weight.

Recommended Scales:
- **Phrygian Scale**: Gives that iconic dark, hypnotic, Middle-Eastern Goa psy feel.
- **Minor Scale**: Energetic and melodic driving feel.`,
            abletonInstruction: 'In Ableton 12 MIDI Editor, open Scale mode, set Root to F# and Scale to Phrygian.',
            parameterHighlights: [{ param: 'Root Key', value: 'F#' }, { param: 'Scale', value: 'Phrygian' }],
          },
        ],
        quiz: [
          {
            question: 'Why is F# (46.2 Hz) widely considered a ideal root key for Psytrance?',
            options: [
              'Because it matches the natural resonance frequency of subwoofers (40-50Hz)',
              'Because Ableton Live only plays bass in F#',
              'Because it is the highest note on the piano',
              'It makes the snare sound louder'
            ],
            correctIndex: 0,
            explanation: 'Subwoofers reproduce 40Hz-50Hz with maximum physical air displacement without blowing out headroom.'
          }
        ]
      },
      {
        id: 'psy_l2',
        title: 'Lesson 2: Synthesizing the Ultimate Psytrance Kick',
        description: 'Craft a tight, 160ms kick with sub punch and click transient using Operator or Drum Rack.',
        durationMinutes: 15,
        difficulty: 'Intermediate',
        genre: 'Psytrance',
        steps: [
          {
            stepNumber: 1,
            title: 'Kick Length & Envelope Anatomy',
            contentMarkdown: `A Psytrance kick must NOT bleed into the 16th-note bassline.
Target total kick length: **150ms - 180ms**.

Components of a Psytrance Kick:
1. **Click Transient (1-10ms)**: Cuts through high frequencies (2kHz - 8kHz).
2. **Body Sweep (10-60ms)**: Fast pitch drop from 200Hz down to root.
3. **Sub Tail (60-160ms)**: Solid sustain tuned strictly to the track's key (e.g. F# at 46Hz).`,
            abletonInstruction: 'Load Drum Rack or Simpler onto Track 1. Name the track "KICK".',
            parameterHighlights: [{ param: 'Kick Length', value: '160 ms' }, { param: 'Tuning', value: 'F#1 (46Hz)' }],
          },
          {
            stepNumber: 2,
            title: 'Ableton Utility & EQ Eight Setup',
            contentMarkdown: `Insert **Utility** plugin on the Kick channel.
- Enable **Bass Mono** set to **120Hz** (ensures sub frequencies are centered).
- Insert **EQ Eight**: High-pass filter at **30Hz** (48dB/octave) to cut silent, power-wasting sub rumble.`,
            abletonInstruction: 'Drag Utility and EQ Eight from Audio Effects onto the Kick track chain.',
            parameterHighlights: [{ param: 'Utility Bass Mono', value: '120 Hz' }, { param: 'EQ Eight HPF', value: '30 Hz (48dB)' }],
          }
        ]
      },
      {
        id: 'psy_l3',
        title: 'Lesson 3: The Rolling 16th Psytrance Bassline',
        description: 'Program KB-BB-BB-BB patterns and synthesize a razor-sharp saw bass in Operator.',
        durationMinutes: 20,
        difficulty: 'Intermediate',
        genre: 'Psytrance',
        steps: [
          {
            stepNumber: 1,
            title: 'K-B-B-B Pattern Programming',
            contentMarkdown: `The classic Psytrance bassline plays on 16th notes with the kick taking the 1st beat:
- **Beat 1**: Kick (C1)
- **Beat 1.2**: Bass (F#1) - Velocity 95
- **Beat 1.3**: Bass (F#1) - Velocity 100
- **Beat 1.4**: Bass (F#1) - Velocity 105 (Accented drive into next kick)

This leaves room for the kick body while creating a relentless rolling machine feel!`,
            abletonInstruction: 'Create a 1-bar MIDI clip on Track 2 "BASS". Draw F#1 notes on 16th grid positions 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15, 16.',
            parameterHighlights: [{ param: 'Note Length', value: '1/16th' }, { param: 'Gate / Note Duration', value: '75%' }],
          },
          {
            stepNumber: 2,
            title: 'Operator Bass Synth Sound Design',
            contentMarkdown: `Load **Operator** onto the Bass track:
1. **Oscillator A**: Sawtooth Wave, Coarse 0.5 (or Octave 1).
2. **Filter**: 24dB Low Pass. Cutoff around **600 Hz**, Resonance 0.
3. **Filter Envelope**: Attack: 0.00ms, Decay: **165ms**, Sustain: 0.00, Release: 1.00ms.
4. **Envelope Amount**: Dial to +24 for snappy pluck brightness!`,
            abletonInstruction: 'In Operator: Osc A = Saw, Filter = 24dB LP, Envelope Decay = 165ms, Env Amount = +24.',
            parameterHighlights: [{ param: 'Filter Envelope Decay', value: '165 ms' }, { param: 'Env Amount', value: '+24' }],
          }
        ]
      }
    ]
  },
  {
    id: 'techno_masterclass',
    title: 'Peak-Time & Melodic Techno Masterclass',
    subtitle: 'Industrial rumbles, hypnotic stabs, and Driving 132 BPM energy in Live 12',
    genre: 'Techno',
    iconName: 'Activity',
    description: 'Learn how to construct massive sub-rumbles, dark synth stabs, and industrial drum grooves with Ableton Live 12 devices like Roar, Meld, and Saturator.',
    lessons: [
      {
        id: 'tech_l1',
        title: 'Lesson 1: Designing the Techno Kick Sub Rumble',
        description: 'Transform a standard kick into a dark, driving sub-bass rumble using Delay & Reverb processing.',
        durationMinutes: 15,
        difficulty: 'Intermediate',
        genre: 'Techno',
        steps: [
          {
            stepNumber: 1,
            title: 'Creating the Parallel Rumble Chain in Ableton Live 12',
            contentMarkdown: `Techno tracks obtain their signature warehouse driving energy from the **Kick Sub Rumble**.

How to set up in Ableton Live 12:
1. Group your Kick track or create a **Send / Return Channel**.
2. Insert **Delay** (Set time to 1/16th note, 0% Dry/Wet on dry, 100% Wet on rumble branch).
3. Insert **Saturator** (Drive: +4dB to +6dB, Soft Clip enabled).
4. Insert **Auto Filter** (Low Pass filter cutting everything above **160 Hz**).
5. Insert **Compressor** or **Auto Filter Sidechain**: Trigger sidechain from clean Kick track so the rumble dips whenever the main kick strikes!`,
            abletonInstruction: 'In Ableton Live 12, select Kick track, press Cmd+G / Ctrl+G to create Audio Effect Rack. Create "Dry" chain and "Rumble" chain.',
            parameterHighlights: [{ param: 'Rumble LPF Cutoff', value: '160 Hz' }, { param: 'Saturator Drive', value: '+5.0 dB' }],
          }
        ]
      }
    ]
  }
];
