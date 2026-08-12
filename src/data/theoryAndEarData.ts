import { KeyType, ScaleType } from '../types';

export interface TheoryTopic {
  id: string;
  title: string;
  category: 'Scales & Modes' | 'Intervals & Chords' | 'Rhythm & Groove' | 'Tension & Release';
  summary: string;
  detailedContent: string;
  exampleRoot: KeyType;
  exampleScale: ScaleType;
  notesSequence: string[];
  abletonTip: string;
}

export interface EarTrainingExercise {
  id: string;
  title: string;
  type: 'EQ' | 'Compression' | 'Distortion' | 'Reverb' | 'Pitch' | 'Rhythm' | 'Stereo';
  questionText: string;
  audioExampleType: 'kick' | 'bass' | 'lead' | 'drums';
  options: { label: string; isCorrect: boolean; explanation: string }[];
  hint: string;
}

export const THEORY_TOPICS: TheoryTopic[] = [
  {
    id: 'th_phrygian_dominant',
    title: 'Phrygian Dominant Scale (The Goa / Psy Secret)',
    category: 'Scales & Modes',
    summary: 'The 5th mode of Harmonic Minor. Contains a minor 2nd and major 3rd, creating an exotic, dark, hypnotic Middle-Eastern vibe heavily used in Goa Psytrance.',
    detailedContent: 'Phrygian Dominant formula: Root - b2 - 3 - 4 - 5 - b6 - b7. In F#: F# - G - A# - B - C# - D - E. The b2 interval (G) right above F# creates instant tension, while the major 3rd (A#) creates the iconic Goa Psytrance atmosphere.',
    exampleRoot: 'F#',
    exampleScale: 'Phrygian Dominant',
    notesSequence: ['F#1', 'G1', 'A#1', 'B1', 'C#2', 'D2', 'E2', 'F#2'],
    abletonTip: 'In Ableton Live 12 Clip View, enable "Scale", select Root F# and Scale "Phrygian Dominant" (or Harmonic Minor mode 5). All key rows highlight automatically!',
  },
  {
    id: 'th_harmonic_minor',
    title: 'Harmonic Minor & The Raised 7th Lead',
    category: 'Scales & Modes',
    summary: 'Harmonic Minor features a raised 7th (Major 7th) which creates an augmented 2nd interval that sounds mysterious and dramatic.',
    detailedContent: 'Harmonic Minor formula: Root - 2 - b3 - 4 - 5 - b6 - 7. In F#: F# - G# - A - B - C# - D - E#. The jump between D (b6) and E# (7) spans 3 semitones (augmented 2nd), producing a signature dark cinematic tension.',
    exampleRoot: 'F#',
    exampleScale: 'Harmonic Minor',
    notesSequence: ['F#1', 'G#1', 'A1', 'B1', 'C#2', 'D2', 'E#2', 'F#2'],
    abletonTip: 'Use Harmonic Minor for acid lead arpeggiators. The E# leading tone naturally pulls back to the F# root note on beat 1.',
  },
  {
    id: 'th_syncopation',
    title: 'Syncopation & 16th-Note Offbeat Accents',
    category: 'Rhythm & Groove',
    summary: 'Syncopation places emphasis on weak beats or offbeats (such as the 2nd, 3rd, or 4th sixteenth of a beat), creating forward momentum.',
    detailedContent: 'In a 4/4 bar with 16 sixteenth notes (1-e-&-a 2-e-&-a...), placing the loudest note velocity on the "e" or "a" rather than the main beat "1" or "&" creates an infectious bounce.',
    exampleRoot: 'F#',
    exampleScale: 'Minor',
    notesSequence: ['F#1', 'F#1', 'F#1', 'F#1'],
    abletonTip: 'In Live 12 MIDI Editor, select 16th notes on the "a" offbeats and raise velocity by +15 compared to main beat notes.',
  },
  {
    id: 'th_intervals_fifths',
    title: 'Power Intervals: Perfect 5ths & Octaves in Sub Bass',
    category: 'Intervals & Chords',
    summary: 'Sub basslines usually stay strictly on Root + Octave, while power leads utilize Perfect 5ths (7 semitones) for massive energy.',
    detailedContent: 'A Perfect 5th above F# is C#. Jumping between F#1 and C#2 in a bassline or lead pattern provides strong harmonic stability while adding pitch variation.',
    exampleRoot: 'F#',
    exampleScale: 'Minor',
    notesSequence: ['F#1', 'F#1', 'C#2', 'F#1'],
    abletonTip: 'Use Operator Pitch Envelope to drop 7 semitones (Perfect 5th) on lead stabs for a punchy synth strike.',
  },
];

export const EAR_TRAINING_EXERCISES: EarTrainingExercise[] = [
  {
    id: 'ear_eq_mud',
    title: 'Identifying Muddy Frequency Regions',
    type: 'EQ',
    questionText: 'When a Psytrance lead synth sounds "boxy" or "cloudy", which frequency band usually contains the unwanted build-up that should be cut with EQ Eight?',
    audioExampleType: 'lead',
    options: [
      { label: '30 Hz - 60 Hz', isCorrect: false, explanation: 'This is the sub-bass domain (kick & bass fundamental).' },
      { label: '250 Hz - 400 Hz', isCorrect: true, explanation: 'Correct! The 200-400Hz region is where mud/boxiness accumulates in synths and snares.' },
      { label: '2 kHz - 4 kHz', isCorrect: false, explanation: 'This is the presence/harshness region.' },
      { label: '10 kHz - 15 kHz', isCorrect: false, explanation: 'This is the air and high-end sizzle band.' },
    ],
    hint: 'Think of the lower-mid frequency range between sub-bass and clear vocal presence.',
  },
  {
    id: 'ear_comp_sidechain',
    title: 'Detecting Sidechain Pumping',
    type: 'Compression',
    questionText: 'What is the primary indicator that Auto Filter or Compressor sidechain ducking is set too aggressively on a bassline?',
    audioExampleType: 'bass',
    options: [
      { label: 'The bass disappears for almost half a beat after every kick strike.', isCorrect: true, explanation: 'Correct! An overly long sidechain release time eats into the first bass notes, destroying groove.' },
      { label: 'The high frequencies sound distorted and metallic.', isCorrect: false, explanation: 'That is caused by clipping or bitcrushing.' },
      { label: 'The stereo width becomes too wide.', isCorrect: false, explanation: 'Sidechain compression affects amplitude/ducking, not stereo width directly.' },
      { label: 'The pitch shifts up by 1 octave.', isCorrect: false, explanation: 'Compression does not affect pitch.' },
    ],
    hint: 'Listen to the timing of the bass volume returning after the kick drum hits.',
  },
  {
    id: 'ear_stereo_mono',
    title: 'Mono Compatibility below 120Hz',
    type: 'Stereo',
    questionText: 'Why MUST sub-bass frequencies below 120Hz be set to 100% Mono in Ableton Live 12 Utility?',
    audioExampleType: 'bass',
    options: [
      { label: 'To make the file download size smaller.', isCorrect: false, explanation: 'Mono setting in Utility does not change file storage size.' },
      { label: 'Stereo sub frequencies cause phase cancellation on club sound systems and subwoofer systems.', isCorrect: true, explanation: 'Correct! Club sound systems sum sub-bass to mono; stereo sub phase differences cause complete bass dropout.' },
      { label: 'To make the synth play twice as loud.', isCorrect: false, explanation: 'Monoing low-end prevents phase cancellation, not a volume boost.' },
      { label: 'To automatically quantize MIDI notes.', isCorrect: false, explanation: 'Utility is an audio device, not a MIDI quantizer.' },
    ],
    hint: 'Consider how massive nightclub subwoofers handle left/right low-frequency audio channels.',
  },
];
