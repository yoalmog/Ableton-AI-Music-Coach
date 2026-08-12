export interface MistakeRecord {
  id: string;
  category: string;
  concept: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  firstDetected: string;
  lastDetected: string;
  occurrences: number;
  resolved: boolean;
  recommendedExercise: string;
}

export interface StrengthRecord {
  skill: string;
  level: number;
  evidence: string;
  lastVerified: string;
}

export interface ProjectHealth {
  drums: number;
  bass: number;
  music: number;
  arrangement: number;
  mixing: number;
  mastering: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  language: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  primaryGoal: string;
  favoriteGenres: string[];
  preferredSubgenres: string[];
  learningStyle: 'visual' | 'auditory' | 'hands-on';
  dailyPracticeMinutes: number;
  producerLevel: number;
  xp: number;
  streak: number;
  completedLessons: string[];
  currentCourse: string;
  currentLesson: string;
  currentStep: number;
  skills: Record<string, number>; // 0-100
  weaknesses: string[];
  strengths: string[];
  recentMistakes: MistakeRecord[];
  masteredConcepts: string[];
  challengeResults: any[];
  earTrainingResults: any[];
  practiceHistory: any[];
  aiPreferences: {
    mode: 'TEACHER' | 'PRODUCER' | 'MIXING COACH' | 'SOUND DESIGNER' | 'ARRANGEMENT COACH' | 'EAR TRAINER' | 'PRACTICE COACH';
    provider: 'ollama' | 'gemini' | 'offline';
    model: string;
    explainWhy: boolean;
  };
}
