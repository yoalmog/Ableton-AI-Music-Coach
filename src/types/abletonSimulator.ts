import { GenreType, KeyType, ScaleType, MidiNote } from './index';
import { LocalizedText } from './visualLesson';

export type AbletonViewMode =
  | 'arrangement'
  | 'session'
  | 'mixer'
  | 'device'
  | 'pianoroll'
  | 'browser'
  | 'automation';

export type SimulatorActionType =
  | 'CLICK'
  | 'DOUBLE_CLICK'
  | 'RIGHT_CLICK'
  | 'DRAG'
  | 'DROP'
  | 'SLIDER'
  | 'KNOB'
  | 'SELECT'
  | 'TYPE'
  | 'KEYBOARD_SHORTCUT'
  | 'MIDI_NOTE'
  | 'TOGGLE'
  | 'WAIT';

export type SimulatorLearningMode = 'guided' | 'practice' | 'exam';

export interface NormalizedRect {
  x: number; // 0.0 to 1.0 relative to screenshot/canvas width
  y: number; // 0.0 to 1.0 relative to screenshot/canvas height
  width: number; // 0.0 to 1.0
  height: number; // 0.0 to 1.0
}

export interface SimulatorInteractiveTarget {
  id: string;
  name: LocalizedText;
  rect: NormalizedRect;
  actionType: SimulatorActionType;
  expectedValue?: any;
  currentValue?: any;
  tooltip?: LocalizedText;
  highlight?: boolean;
  arrowDirection?: 'up' | 'down' | 'left' | 'right';
  category?: 'transport' | 'browser' | 'track' | 'clip' | 'device' | 'mixer' | 'piano-roll';
}

export interface AbletonClipSim {
  id: string;
  name: string;
  trackId: string;
  startTime: number;
  length: number;
  color: string;
  notes?: MidiNote[];
  selected?: boolean;
}

export interface AbletonTrackSim {
  id: string;
  name: string;
  type: 'midi' | 'audio' | 'return' | 'master';
  color: string;
  volume: number; // 0 to 1
  pan: number; // -1 to 1
  muted: boolean;
  soloed: boolean;
  armed: boolean;
  clips: AbletonClipSim[];
  devices: string[];
  active?: boolean;
}

export interface SimulatorValidationResult {
  pass: boolean;
  message: LocalizedText;
  scoreBonus?: number;
}

export interface AbletonLessonStep {
  id: string | number;
  title: LocalizedText;
  instruction: LocalizedText;
  why: LocalizedText;
  hint: LocalizedText;
  exactAction: LocalizedText;
  targetId: string;
  targetRect: NormalizedRect;
  expectedAction: SimulatorActionType;
  expectedValue?: any;
  arrowDirection?: 'up' | 'down' | 'left' | 'right';
  spotlightRadius?: number;
  expectedPianoRollNotes?: { pitch: string; time: number; duration: number }[];
  validation?: (state: AbletonSimulatorState, actionData?: any) => SimulatorValidationResult;
  deviceTarget?: {
    deviceType: string;
    parameterName: string;
    targetValue: number | string | boolean;
    tolerance?: number;
  };
}

export interface AbletonLessonDefinition {
  id: string;
  category: 'beginner' | 'psytrance' | 'goa' | 'techno' | 'mixing' | 'custom';
  title: LocalizedText;
  subtitle?: LocalizedText;
  description: LocalizedText;
  genre: GenreType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  screenshotKey: string; // e.g. 'arrangement-live12', 'piano-roll-bass', 'drift-device', 'custom-uploaded'
  screenshotUri?: string;
  initialState: Partial<AbletonSimulatorState>;
  steps: AbletonLessonStep[];
  isCustom?: boolean;
  author?: string;
  createdAt?: string;
}

export interface AbletonSimulatorState {
  viewMode: AbletonViewMode;
  bpm: number;
  timeSignature: string;
  isPlaying: boolean;
  isRecording: boolean;
  metronome: boolean;
  loop: boolean;
  selectedTrackId: string | null;
  selectedClipId: string | null;
  selectedDeviceId: string | null;
  key: KeyType;
  scale: ScaleType;
  tracks: AbletonTrackSim[];
  pianoRollNotes: MidiNote[];
  deviceParameters: {
    drift?: {
      osc1Shape: string;
      osc2Shape: string;
      cutoff: number;
      resonance: number;
      env2Decay: number;
      driftAmount: number;
      volume: number;
    };
    operator?: {
      algorithm: number;
      oscACoarse: number;
      oscBCoarse: number;
      cutoff: number;
      filterEnvAmount: number;
      decay: number;
    };
    roar?: {
      routing: 'single' | 'serial' | 'parallel' | 'multiband';
      drive: number;
      tone: number;
      bias: number;
      feedback: number;
    };
    eqEight?: {
      band1Gain: number;
      band1Freq: number;
      band2Freq: number;
      lowCutEnabled: boolean;
      lowCutFreq: number;
    };
    compressor?: {
      threshold: number; // dB
      ratio: number;
      attack: number; // ms
      release: number; // ms
      sidechainEnabled: boolean;
      sidechainSource: string;
      gainReduction: number;
    };
    glueCompressor?: {
      threshold: number;
      makeup: number;
      ratio: 2 | 4 | 10;
      attack: number;
      release: number;
    };
    saturator?: {
      drive: number;
      curve: string;
      output: number;
      softClip: boolean;
    };
    [device: string]: any;
  };
  activeLessonId: string | null;
  currentStepIndex: number;
  mistakesCount: number;
  hintsUsedCount: number;
  mode: SimulatorLearningMode;
  score: number;
  completed: boolean;
  screenshotUri?: string | null;
  screenshotDimensions?: { width: number; height: number };
}

export interface IntegrationModeState {
  mode: 'simulator' | 'manual' | 'live_link_ready';
  isLiveConnected: boolean;
  statusMessage: LocalizedText;
}
