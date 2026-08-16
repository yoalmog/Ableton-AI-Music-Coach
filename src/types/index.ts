import { VisualLesson, UserVisualLessonProgress, UserUploadedImage } from './visualLesson';

export type ViewType =
  | 'dashboard'
  | 'visualcoach'
  | 'producer'
  | 'lessons'
  | 'coursemap'
  | 'buildtrack'
  | 'glossary'
  | 'theory'
  | 'eartraining'
  | 'practice'
  | 'midi'
  | 'drums'
  | 'bass'
  | 'sounddesign'
  | 'analyzer'
  | 'mixassistant'
  | 'arrangement'
  | 'prompts'
  | 'versions'
  | 'settings'
  | 'account'
  | 'classroom';

export type GenreType = 
  | 'Psytrance'
  | 'Goa Psytrance'
  | 'Full-On Psytrance'
  | 'Progressive Psytrance'
  | 'Dark Psy'
  | 'Forest'
  | 'Hi-Tech'
  | 'Techno'
  | 'Peak-Time Techno'
  | 'Melodic Techno'
  | 'Electronic Music';

export type KeyType = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
export type ScaleType = 'Minor' | 'Phrygian' | 'Dorian' | 'Harmonic Minor' | 'Aeolian' | 'Major' | 'Phrygian Dominant' | 'Locrian';

export interface MidiNote {
  pitch: string; // e.g. "F#1"
  time: number;  // in beats (e.g. 0, 0.25, 0.5)
  duration: number; // in beats
  velocity: number; // 0 - 127
}

export interface MidiPattern {
  id: string;
  name: string;
  type: 'bassline' | 'lead' | 'drum' | 'arp' | 'acid' | 'chord' | 'pad';
  genre: GenreType;
  bpm: number;
  key: KeyType;
  scale: ScaleType;
  timeSignature: string;
  notes: MidiNote[];
  abletonTips?: string;
  createdAt: string;
}

export interface DrumStep {
  active: boolean;
  velocity: number; // 0 - 127
}

export interface DrumTrack {
  id: string;
  name: string;
  midiPitch: string; // e.g. C1 for Kick
  steps: DrumStep[]; // usually 16 or 32 steps
  muted?: boolean;
  soloed?: boolean;
  volume?: number; // 0 - 1
}

export interface DrumPattern {
  id: string;
  name: string;
  genre: GenreType;
  bpm: number;
  tracks: DrumTrack[];
  swing: number; // 0 - 100
}

export type BassPatternType = 'K-B-B-B' | 'K-B-B-B-B-B-B-B' | 'Triplet' | 'Goa Gallop' | 'Techno Rumble' | 'Offbeat' | 'Syncopated';

export interface BassSettings {
  patternType: BassPatternType;
  rootKey: KeyType;
  octave: number; // usually 1
  cutoffHz: number;
  decayMs: number;
  resonance: number; // 0 - 100
  subLevel: number; // 0 - 1
  driveAmount: number; // 0 - 100
  sidechainAmount: number; // 0 - 100
}

export interface AbletonDevice {
  id: string;
  name: string; // e.g. "Operator", "Wavetable", "Roar", "EQ Eight", "Saturator", "Utility"
  category: 'Synth' | 'Audio Effect' | 'MIDI Effect' | 'Max for Live';
  description: string;
  keyParameters: { name: string; recommendedSetting: string; purpose: string }[];
  psytranceUseCases: string[];
  technoUseCases: string[];
  shortcutKey?: string;
}

export interface SoundDesignRecipe {
  id: string;
  title: string;
  genre: GenreType;
  targetSound: 'Rolling Sub Bass' | 'Goa Acid Lead' | 'Psy Squelch / Zap' | 'Techno Sub Rumble' | 'Melodic Techno Stab' | 'Atmospheric Pad';
  abletonDevicesUsed: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTimeMin: number;
  steps: {
    stepNumber: number;
    title: string;
    deviceName: string;
    instructions: string;
    parameters: { paramName: string; value: string }[];
  }[];
  proTip: string;
}

export * from './lesson';
export * from './learning';
export * from './visualLesson';

export interface TrackMetrics {
  lufs: number; // e.g. -8.5
  rms: number;  // e.g. -12.1
  peak: number; // e.g. -0.2
  lowMidRatio: number; // e.g. 1.4
  stereoWidth: number; // 0 (Mono) to 2 (Ultra wide)
}

export interface AnalysisResult {
  overallRating: string;
  loudnessAssessment: string;
  spectralBalance: string;
  dynamicsAndWidth: string;
  actionableSteps: string[];
}

export interface ArrangementSection {
  id: string;
  name: string; // e.g., "Intro", "Kick & Bass Entrance", "Atmospheric Build", "First Drop", "Main Breakdown", "Peak Drop", "Outro"
  startBar: number;
  lengthBars: number;
  colorHex: string;
  energyLevel: number; // 1 to 10
  elementsActive: string[]; // e.g. ['Kick', 'Bass', 'High Hats', 'Atmosphere']
  abletonInstructions: string;
}

export interface ArrangementBlueprint {
  id: string;
  title: string;
  genre: GenreType;
  totalBars: number;
  bpm: number;
  sections: ArrangementSection[];
}

export interface PracticeExercise {
  id: string;
  title: string;
  genre: GenreType;
  difficulty: string;
  goalDescription: string;
  abletonSetupInstructions: string;
  targetMetricsOrNotes: string;
  hints: string[];
}

// AI Producer Stage Definition (01 Project Setup -> 15 Final Review)
export interface ProducerStage {
  id: number;
  code: string;
  title: string;
  titleHe?: string;
  explanation: string;
  explanationHe?: string;
  objective: string;
  objectiveHe?: string;
  abletonInstructions: string;
  abletonInstructionsHe?: string;
  recommendedParams: { param: string; value: string }[];
  commonMistakes: string[];
  commonMistakesHe?: string[];
  listeningExercise: string;
  listeningExerciseHe?: string;
  category: 'Setup' | 'Rhythm & Bass' | 'Elements' | 'Sound Design' | 'Arrangement' | 'Mixing';
}

// Project Version Snapshot
export interface AAMCVersion {
  versionNumber: number;
  name: string;
  timestamp: string;
  stageCompleted: number;
  projectSnapshot: Partial<AAMCProject>;
}

// Prompt Template
export interface PromptTemplate {
  id: string;
  title: string;
  category: 'Psytrance' | 'Goa' | 'Full-On' | 'Techno' | 'Sound Design' | 'Mixing' | 'Arrangement';
  promptText: string;
  targetDeviceOrTopic: string;
}

// .aamc File Format
export interface AAMCProject {
  format: 'AAMC';
  id: string;
  version: number; // e.g. 1
  name: string;
  genre: GenreType;
  subgenre: string;
  bpm: number;
  key: KeyType;
  scale: ScaleType;
  trackLengthMinutes?: string; // e.g. "6:00"
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  productionStage?: number; // 1 to 15
  stageProgress?: Record<number, boolean>;
  currentLessonId?: string;
  completedLessonIds: string[];
  midiPatterns: MidiPattern[];
  drumPattern?: DrumPattern;
  bassSettings?: BassSettings;
  arrangementSections?: ArrangementSection[];
  versions?: AAMCVersion[];
  userNotes: string;
  aiNotes: string[];
  favorites?: { id: string; type: 'lesson' | 'pattern' | 'recipe' | 'prompt'; title: string }[];
  // Visual Music Production Learning Engine extension (.aamc backward compatible)
  visualLessons?: VisualLesson[];
  currentVisualLessonId?: string;
  currentVisualStepIndex?: number;
  visualLearningProgress?: Record<string, UserVisualLessonProgress>;
  projectImages?: UserUploadedImage[];
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  theme: 'dark' | 'synthwave' | 'ableton-light';
  accentColor: string;
  defaultGenre: GenreType;
  defaultBpm: number;
  defaultKey: KeyType;
  aiModel: string;
  offlineMode: boolean;
  autoSave: boolean;
  masterVolume: number;
  aiResponseMode?: 'Beginner' | 'Intermediate' | 'Advanced';
  explainWhyEnabled?: boolean;
}

export interface AISettings {
  provider: 'gemini' | 'offline';
  model: string;
  apiKey: string;
  enabled: boolean;
  userLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

