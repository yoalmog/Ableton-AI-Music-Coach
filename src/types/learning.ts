import { GenreType, KeyType, ScaleType } from './index';

export type UserLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type ExplanationLevel = 'Simple' | 'Beginner' | 'Producer' | 'Technical';

export interface UserProducerProfile {
  level: UserLevel;
  favoriteGenres: GenreType[];
  primaryGoal: 'Learn Ableton' | 'Make Psytrance' | 'Make Techno' | 'Finish my first track' | 'Improve mixing' | 'Improve sound design';
  producerScore: number;
  xp: number;
  streakDays: number;
  lastPracticeDate?: string;
  skills: {
    rhythm: number;      // 0 - 100
    bass: number;        // 0 - 100
    drums: number;       // 0 - 100
    soundDesign: number; // 0 - 100
    arrangement: number; // 0 - 100
    mixing: number;      // 0 - 100
    theory: number;      // 0 - 100
    earTraining: number; // 0 - 100
  };
  weaknesses: string[];
  mistakes: { topic: string; count: number; lastOccurred: string }[];
  completedModuleIds: string[];
  dailyMissionCompletedDate?: string;
}

export interface LearningModuleNode {
  id: string;
  numberStr: string;
  title: string;
  titleHe?: string;
  description?: string;
  descriptionHe?: string;
  category: 'Basics' | 'Rhythm & Bass' | 'Synthesis' | 'Arrangement' | 'Mixing & Mastering';
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skillsLearned: string[];
  prerequisiteIds: string[];
  isLocked?: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  titleHe?: string;
  genreFocus: string;
  description: string;
  descriptionHe?: string;
  modules: LearningModuleNode[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  category: 'Rhythm' | 'Synthesis' | 'Dynamics' | 'FX' | 'Mixing' | 'Mastering';
  shortDef: string;
  shortDefHe?: string;
  simpleDef: string;
  simpleDefHe?: string;
  producerDef: string;
  producerDefHe?: string;
  technicalDef: string;
  technicalDefHe?: string;
  example: string;
  exampleHe?: string;
  relatedTermIds: string[];
}

export interface EarTrainingExercise {
  id: string;
  title: string;
  titleHe?: string;
  category: 'EQ' | 'Compression' | 'Reverb & Delay' | 'Stereo Width' | 'Distortion' | 'Phase' | 'Mix Balance';
  question: string;
  questionHe?: string;
  optionA: { label: string; labelHe?: string; type: string };
  optionB: { label: string; labelHe?: string; type: string };
  correctOption: 'A' | 'B';
  explanation: string;
  explanationHe?: string;
}

export interface DailyMission {
  id: string;
  date: string;
  title: string;
  titleHe?: string;
  description: string;
  descriptionHe?: string;
  taskType: 'rhythm' | 'bass' | 'earTraining' | 'quiz' | 'theory';
  xpReward: number;
  completed: boolean;
}
