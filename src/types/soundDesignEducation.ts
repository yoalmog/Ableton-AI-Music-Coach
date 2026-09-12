import { GenreType, KeyType, ScaleType } from './index';

export type SoundDesignDeviceType = 
  | 'wavetable'
  | 'operator'
  | 'echo'
  | 'autofilter'
  | 'roar'
  | 'drift';

export interface DeviceParameterControl {
  id: string;
  name: string;
  type: 'slider' | 'select' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: string[];
  description: string;
  learnMoreTip: string;
}

export interface DevicePracticalExample {
  id: string;
  title: string;
  category: string;
  genre: GenreType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  abletonStepByStep: string[];
  parameters: Record<string, number | string | boolean>;
  parameterControls: DeviceParameterControl[];
  demoPattern: {
    bpm: number;
    key: KeyType;
    scale: ScaleType;
    notes: Array<{ pitch: string; time: number; duration: number; velocity: number }>;
  };
}

export interface DeviceUseCase {
  title: string;
  genre: string;
  description: string;
  proTip: string;
}

export interface DeviceCoreConcept {
  term: string;
  explanation: string;
  abletonTip: string;
}

export interface DeviceQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SoundDesignDeviceLesson {
  id: SoundDesignDeviceType;
  name: string;
  category: 'Wavetable Synthesis' | 'FM Synthesis' | 'Time-based & Delay' | 'Filter & Modulation' | 'Color & Saturation' | 'Subtractive Synthesis';
  tagline: string;
  description: string;
  theoryAndWorkflow: string;
  signalFlow: string[];
  keyFeatures: string[];
  shortcutKey: string;
  useCases: DeviceUseCase[];
  coreConcepts: DeviceCoreConcept[];
  practicalExamples: DevicePracticalExample[];
  quizQuestions: DeviceQuizQuestion[];
}
