import { KeyType, ScaleType, GenreType, MidiNote, MidiPattern } from './index';

export interface LearningObjective {
  id: string;
  description: string;
  category: 'concept' | 'practical' | 'workflow' | 'listening';
}

export interface ParameterHighlight {
  param: string;
  value: string;
  unit?: string;
  purpose?: string;
}

export interface InteractiveMidiExample {
  id: string;
  title: string;
  description: string;
  bpm: number;
  key: KeyType;
  scale: ScaleType;
  type: 'bassline' | 'lead' | 'drum' | 'arp' | 'acid' | 'chord' | 'pad';
  notes: MidiNote[];
  abletonTips?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  objectiveId?: string;
}

export interface LessonContentBlock {
  type: 'text' | 'midi_example' | 'ableton_instruction' | 'parameters' | 'pro_tip' | 'audio_sample';
  title?: string;
  textMarkdown?: string;
  abletonInstruction?: string;
  parameterHighlights?: ParameterHighlight[];
  audioExampleType?: 'kick' | 'psybass' | 'technorumble' | 'acid' | 'drums' | 'synth';
  interactiveMidiExample?: InteractiveMidiExample;
  proTip?: string;
  shortcutKey?: string;
}

export interface LessonStep {
  stepNumber: number;
  title: string;
  contentMarkdown: string;
  abletonInstruction: string;
  parameterHighlights?: ParameterHighlight[];
  audioExampleType?: 'kick' | 'psybass' | 'technorumble' | 'acid' | 'drums' | 'synth';
  interactiveMidiExample?: InteractiveMidiExample;
  recommendedMidiPattern?: MidiPattern;
  proTip?: string;
  shortcutKey?: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  objective?: string; // High-level primary objective summary
  learningObjectives: LearningObjective[];
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  genre: GenreType;
  tags?: string[];
  prerequisites?: string[]; // IDs of preceding required lessons
  content?: LessonContentBlock[]; // Content array representation
  steps: LessonStep[];            // Step-by-step curriculum representation
  quiz?: QuizQuestion[];
  offlineBundleVersion?: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  genre: GenreType;
  iconName: string;
  description: string;
  lessons: Lesson[];
}

export interface QuizAttempt {
  timestamp: string;
  scorePercentage: number;
  selectedAnswers: Record<number, number>;
}

export interface UserLessonProgress {
  lessonId: string;
  completedStepIndexes: number[];
  isCompleted: boolean;
  lastAccessedAt: string;
  quizBestScore?: number;
  quizAttempts: QuizAttempt[];
  userNotes: string;
  isBookmarked: boolean;
}

export interface LessonFilterOptions {
  genre?: GenreType | 'All';
  difficulty?: 'All' | 'Beginner' | 'Intermediate' | 'Advanced';
  tag?: string;
  searchQuery?: string;
  onlyBookmarked?: boolean;
}

export interface OfflineCourseManifest {
  version: string;
  lastUpdated: string;
  totalCourses: number;
  totalLessons: number;
  offlineReady: boolean;
  bundleChecksum?: string;
}
