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
        subtitle: 'Optimal Sub Frequencies & Harmonic Foundations',
        description: 'Set up your Ableton Live 12 project for maximum energy and clean low-end clarity.',
        durationMinutes: 10,
        difficulty: 'Beginner',
        genre: 'Psytrance',
        tags: ['bpm', 'key', 'scale', 'phrygian', 'project-setup', 'low-end'],
        learningObjectives: [
          {
            id: 'obj_psy1_1',
            category: 'concept',
            description: 'Understand the mathematical relationship between root key frequencies (e.g., F#1 at 46.2Hz) and subwoofer physical air displacement.',
          },
          {
            id: 'obj_psy1_2',
            category: 'workflow',
            description: 'Configure Ableton Live 12 Control Bar Tempo to 142 BPM and set 4/4 time signature.',
          },
          {
            id: 'obj_psy1_3',
            category: 'practical',
            description: 'Enable Scale Mode in Ableton Live 12 MIDI Editor set to F# Phrygian for dark, hypnotic melodies.',
          },
        ],
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
            parameterHighlights: [
              { param: 'Tempo', value: '142.00', unit: 'BPM', purpose: 'Establishes driving festival pace' },
              { param: 'Time Signature', value: '4/4', unit: 'Bar', purpose: 'Standard electronic grid' },
            ],
            audioExampleType: 'kick',
            shortcutKey: 'Tap Tempo (T)',
            proTip: 'In Live 12, click the Tempo text field and type "142" followed by Enter. Use key shortcut T to tap tempo if sketching ideas.',
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
            parameterHighlights: [
              { param: 'Root Key', value: 'F#1', unit: '46.2 Hz', purpose: 'Optimal subwoofer displacement' },
              { param: 'Scale', value: 'Phrygian', unit: 'Mode', purpose: 'Dark hypnotic harmonic flavor' },
            ],
            audioExampleType: 'psybass',
            shortcutKey: 'K (Toggle Scale Highlight in Live 12)',
            proTip: 'In Ableton 12 MIDI Editor, press "K" to lock the piano roll to scale notes only so you never draw out-of-key notes.',
          },
        ],
        quiz: [
          {
            id: 'q_psy1_1',
            question: 'Why is F#1 (46.2 Hz) widely considered the golden root key for Psytrance low end?',
            options: [
              'Because it falls in the sweet spot (40-50Hz) where subwoofers generate maximum air displacement without clipping headroom.',
              'Because Ableton Live 12 only allows basslines in F#.',
              'Because F#1 is the highest octave note audible to human ears.',
              'It makes hi-hats sound brighter automatically.'
            ],
            correctIndex: 0,
            explanation: 'Subwoofers reproduce 40Hz-50Hz with maximum physical air displacement without blowing out digital headroom or causing muddy sub frequencies.',
            objectiveId: 'obj_psy1_1',
          },
          {
            id: 'q_psy1_2',
            question: 'Which scale mode is famous for providing dark, hypnotic Goa and Full-On Psytrance vibes?',
            options: [
              'Major Scale',
              'Phrygian Scale',
              'Lydian Scale',
              'Pentatonic Major'
            ],
            correctIndex: 1,
            explanation: 'Phrygian scale features a minor 2nd interval that immediately delivers dark, mystical Middle-Eastern and hypnotic psytrance flavors.',
            objectiveId: 'obj_psy1_3',
          }
        ]
      },
      {
        id: 'psy_l2',
        title: 'Lesson 2: Synthesizing the Ultimate Psytrance Kick',
        subtitle: '160ms Tail Tuning & Transient Processing',
        description: 'Craft a tight, 160ms kick with sub punch and click transient using Operator or Drum Rack.',
        durationMinutes: 15,
        difficulty: 'Intermediate',
        genre: 'Psytrance',
        tags: ['kick', 'sound-design', 'operator', 'eq-eight', 'utility', 'sub-mono'],
        prerequisites: ['psy_l1'],
        learningObjectives: [
          {
            id: 'obj_psy2_1',
            category: 'concept',
            description: 'Master the 3-phase anatomy of a Psytrance kick: Click Transient (1-10ms), Body Pitch Sweep (10-60ms), and Sub Tail (60-160ms).',
          },
          {
            id: 'obj_psy2_2',
            category: 'practical',
            description: 'Apply high-pass filtering (30Hz 48dB/octave) and mono centering (120Hz) on the Kick channel using Ableton Utility & EQ Eight.',
          },
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Kick Length & Envelope Anatomy',
            contentMarkdown: `A Psytrance kick must NOT bleed into the 16th-note bassline.
Target total kick length: **150ms - 180ms**.

Components of a Psytrance Kick:
1. **Click Transient (1-10ms)**: Cuts through high frequencies (2kHz - 8kHz).
2. **Body Sweep (10-60ms)**: Fast pitch drop from 200Hz down to root.
3. **Sub Tail (60-160ms)**: Solid sustain tuned strictly to the track's key (e.g. F# at 46.2Hz).`,
            abletonInstruction: 'Load Drum Rack or Simpler onto Track 1. Name the track "KICK".',
            parameterHighlights: [
              { param: 'Kick Length', value: '160', unit: 'ms', purpose: 'Leaves 16th gap for rolling bass' },
              { param: 'Tuning', value: 'F#1', unit: '46.2 Hz', purpose: 'Exact key tuning with bass' },
            ],
            audioExampleType: 'kick',
            interactiveMidiExample: {
              id: 'midi_ex_kick1',
              title: 'Four-on-the-Floor Kick Pattern',
              description: 'Standard 4/4 Kick on quarter note beats (1.1, 2.1, 3.1, 4.1).',
              bpm: 142,
              key: 'F#',
              scale: 'Phrygian',
              type: 'drum',
              notes: [
                { pitch: 'C1', time: 0, duration: 0.25, velocity: 127 },
                { pitch: 'C1', time: 1, duration: 0.25, velocity: 127 },
                { pitch: 'C1', time: 2, duration: 0.25, velocity: 127 },
                { pitch: 'C1', time: 3, duration: 0.25, velocity: 127 },
              ],
              abletonTips: 'Drop sample into Simpler in One-Shot mode. Set Fade Out to 160ms.',
            },
            proTip: 'Never leave a Kick length longer than 180ms in 142 BPM Psytrance, or it will overlap beat 1.2 where the first bass note triggers.',
          },
          {
            stepNumber: 2,
            title: 'Ableton Utility & EQ Eight Setup',
            contentMarkdown: `Insert **Utility** plugin on the Kick channel.
- Enable **Bass Mono** set to **120Hz** (ensures sub frequencies are centered).
- Insert **EQ Eight**: High-pass filter at **30Hz** (48dB/octave) to cut silent, power-wasting sub rumble.`,
            abletonInstruction: 'Drag Utility and EQ Eight from Audio Effects onto the Kick track chain.',
            parameterHighlights: [
              { param: 'Utility Bass Mono', value: '120', unit: 'Hz', purpose: 'Collapses low-end to mono' },
              { param: 'EQ Eight HPF', value: '30', unit: 'Hz (48dB/oct)', purpose: 'Removes sub-audible mud' },
            ],
            audioExampleType: 'kick',
            proTip: 'In Ableton 12, right-click Utility Gain and map it to a Macro knob for quick gain staging.',
          }
        ],
        quiz: [
          {
            id: 'q_psy2_1',
            question: 'What happens if a Psytrance kick length exceeds 200ms at 142 BPM?',
            options: [
              'It collides with the first 16th-note bassline note on beat 1.2, causing muddy phase cancellation.',
              'The tempo automatically slows down to 120 BPM.',
              'The kick pitch increases by an octave.',
              'Ableton Live displays an error.'
            ],
            correctIndex: 0,
            explanation: 'At 142 BPM, a 16th note lasts ~105ms. The kick strikes on beat 1.1, so its tail must drop to zero before beat 1.2 (~105ms-160ms) to allow the bass attack to pop cleanly.',
            objectiveId: 'obj_psy2_1',
          }
        ]
      },
      {
        id: 'psy_l3',
        title: 'Lesson 3: The Rolling 16th Psytrance Bassline',
        subtitle: 'K-B-B-B Patterning & Operator Filter Envelope Plucks',
        description: 'Program KB-BB-BB-BB patterns and synthesize a razor-sharp saw bass in Operator.',
        durationMinutes: 20,
        difficulty: 'Intermediate',
        genre: 'Psytrance',
        tags: ['bassline', 'k-b-b-b', 'rolling-bass', 'operator', 'filter-decay', 'midi-pattern'],
        prerequisites: ['psy_l1', 'psy_l2'],
        learningObjectives: [
          {
            id: 'obj_psy3_1',
            category: 'practical',
            description: 'Program the classic K-B-B-B 16th note rolling bassline pattern with velocity ramping (95 -> 100 -> 105).',
          },
          {
            id: 'obj_psy3_2',
            category: 'workflow',
            description: 'Synthesize a sharp rolling saw bass in Operator with 165ms Filter Decay and +24 Envelope Amount.',
          },
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'K-B-B-B Pattern Programming',
            contentMarkdown: `The classic Psytrance bassline plays on 16th notes with the kick taking the 1st beat:
- **Beat 1.1**: Kick (C1)
- **Beat 1.2**: Bass (F#1) - Velocity 95
- **Beat 1.3**: Bass (F#1) - Velocity 100
- **Beat 1.4**: Bass (F#1) - Velocity 105 (Accented drive into next kick)

This leaves room for the kick body while creating a relentless rolling machine feel!`,
            abletonInstruction: 'Create a 1-bar MIDI clip on Track 2 "BASS". Draw F#1 notes on 16th grid positions 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15, 16.',
            parameterHighlights: [
              { param: 'Note Length', value: '1/16th', unit: 'Grid', purpose: 'Standard 16th pulse' },
              { param: 'Gate Duration', value: '75', unit: '%', purpose: 'Prevents note overlapping' },
              { param: 'Velocity Accent', value: '95 -> 105', unit: 'Vel', purpose: 'Forward momentum' },
            ],
            audioExampleType: 'psybass',
            interactiveMidiExample: {
              id: 'midi_ex_bass1',
              title: 'K-B-B-B Rolling 16th Bassline Pattern',
              description: 'Interactive 16th rolling bass pattern in F#1 Phrygian.',
              bpm: 142,
              key: 'F#',
              scale: 'Phrygian',
              type: 'bassline',
              notes: [
                { pitch: 'F#1', time: 0.25, duration: 0.18, velocity: 95 },
                { pitch: 'F#1', time: 0.50, duration: 0.18, velocity: 100 },
                { pitch: 'F#1', time: 0.75, duration: 0.18, velocity: 105 },
                { pitch: 'F#1', time: 1.25, duration: 0.18, velocity: 95 },
                { pitch: 'F#1', time: 1.50, duration: 0.18, velocity: 100 },
                { pitch: 'F#1', time: 1.75, duration: 0.18, velocity: 105 },
                { pitch: 'F#1', time: 2.25, duration: 0.18, velocity: 95 },
                { pitch: 'F#1', time: 2.50, duration: 0.18, velocity: 100 },
                { pitch: 'F#1', time: 2.75, duration: 0.18, velocity: 105 },
                { pitch: 'F#1', time: 3.25, duration: 0.18, velocity: 95 },
                { pitch: 'F#1', time: 3.50, duration: 0.18, velocity: 100 },
                { pitch: 'F#1', time: 3.75, duration: 0.18, velocity: 105 },
              ],
              abletonTips: 'Export this pattern to .mid and drag directly onto your Operator track in Ableton Live 12.',
            },
            proTip: 'Slightly shorten note durations (Gate to 75%) so each note releases before the next note triggers.',
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
            parameterHighlights: [
              { param: 'Osc A Wave', value: 'Sawtooth', unit: 'Waveform', purpose: 'Rich harmonic content' },
              { param: 'Filter Cutoff', value: '600', unit: 'Hz', purpose: 'Tames excessive top sizzle' },
              { param: 'Filter Envelope Decay', value: '165', unit: 'ms', purpose: 'Snappy pluck tightness' },
              { param: 'Envelope Amount', value: '+24', unit: 'Amount', purpose: 'Controls filter sweep depth' },
            ],
            audioExampleType: 'psybass',
            proTip: 'In Ableton Live 12 Operator, ensure Voice Count is set to 1 (Mono) with Retrigger enabled on Osc A.',
          }
        ],
        quiz: [
          {
            id: 'q_psy3_1',
            question: 'What is the primary function of Filter Envelope Decay (e.g., 165ms) in an Operator Psytrance bass patch?',
            options: [
              'It controls how fast the low-pass filter snaps shut, determining the pluckiness and tightness of each bass note.',
              'It changes the tempo of the song automatically.',
              'It adds stereo reverb to the sub frequencies.',
              'It turns the sawtooth wave into a sine wave.'
            ],
            correctIndex: 0,
            explanation: 'The filter envelope decay controls how rapidly the filter closes after note attack. At 165ms, it gives a tight, percussive pluck ideal for 142 BPM rolling bass.',
            objectiveId: 'obj_psy3_2',
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
        subtitle: 'Parallel Processing, Reverb Decay & Sidechain Ducking',
        description: 'Transform a standard kick into a dark, driving sub-bass rumble using Delay & Reverb processing.',
        durationMinutes: 15,
        difficulty: 'Intermediate',
        genre: 'Techno',
        tags: ['techno', 'sub-rumble', 'delay', 'reverb', 'sidechain', 'saturator', 'parallel-processing'],
        learningObjectives: [
          {
            id: 'obj_tech1_1',
            category: 'practical',
            description: 'Build a parallel Audio Effect Rack with "Dry Kick" and "Sub Rumble" chains in Ableton Live 12.',
          },
          {
            id: 'obj_tech1_2',
            category: 'concept',
            description: 'Apply Low Pass filtering (160Hz) and heavy sidechain ducking to preserve sub punch and avoid phase distortion.',
          },
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Creating the Parallel Rumble Chain in Ableton Live 12',
            contentMarkdown: `Techno tracks obtain their signature warehouse driving energy from the **Kick Sub Rumble**.

How to set up in Ableton Live 12:
1. Group your Kick track or create an **Audio Effect Rack** (Cmd+G / Ctrl+G).
2. Create two chains: "Dry" and "Rumble".
3. On the Rumble chain, insert **Delay** (1/16th time) or **Reverb** (Decay 1.2s, 100% Wet).
4. Insert **Saturator** (Drive: +4dB to +6dB, Soft Clip enabled).
5. Insert **Auto Filter** (Low Pass filter cutting everything above **160 Hz**).
6. Insert **Compressor**: Trigger sidechain from the Dry Kick chain so the rumble ducks whenever the main kick strikes!`,
            abletonInstruction: 'In Ableton Live 12, select Kick track, press Cmd+G / Ctrl+G to create Audio Effect Rack. Create "Dry" chain and "Rumble" chain.',
            parameterHighlights: [
              { param: 'Rumble LPF Cutoff', value: '160', unit: 'Hz', purpose: 'Removes mud and harsh highs' },
              { param: 'Saturator Drive', value: '+5.0', unit: 'dB', purpose: 'Generates warm sub harmonics' },
              { param: 'Sidechain Ducking', value: '-12', unit: 'dB', purpose: 'Carves room for primary kick strike' },
            ],
            audioExampleType: 'technorumble',
            interactiveMidiExample: {
              id: 'midi_ex_rumble1',
              title: 'Peak-Time Techno Kick & Offbeat Rumble Grid',
              description: 'Driving 132 BPM techno kick grid with 16th note rumble pulses.',
              bpm: 132,
              key: 'C',
              scale: 'Minor',
              type: 'drum',
              notes: [
                { pitch: 'C1', time: 0, duration: 0.25, velocity: 127 },
                { pitch: 'C1', time: 1, duration: 0.25, velocity: 127 },
                { pitch: 'C1', time: 2, duration: 0.25, velocity: 127 },
                { pitch: 'C1', time: 3, duration: 0.25, velocity: 127 },
              ],
              abletonTips: 'Try inserting the new Ableton Live 12 "Roar" saturation device on the Rumble chain for aggressive color.',
            },
            proTip: 'Always check your Techno Rumble in MONO using Ableton Utility Bass Mono to ensure no low-end phase cancellation occurs.',
          }
        ],
        quiz: [
          {
            id: 'q_tech1_1',
            question: 'Why is sidechain compression applied to the Techno Sub Rumble chain triggered from the main kick?',
            options: [
              'To duck the rumble when the kick hits, preventing sub clash and creating a pumping offbeat groove.',
              'To make the kick play backward.',
              'To change the key of the song.',
              'To turn off the audio engine.'
            ],
            correctIndex: 0,
            explanation: 'When the main kick strikes, sidechain ducking pulls down the rumble volume for 50-100ms, preventing two sub signals from overloading the master output.',
            objectiveId: 'obj_tech1_2',
          }
        ]
      }
    ]
  }
];
