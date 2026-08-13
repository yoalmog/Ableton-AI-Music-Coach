import { GenreType, KeyType, ScaleType } from './index';

export type LearningMode = 'simulator' | 'real_ableton';
export type DifficultyMode = 'beginner' | 'advanced';

export type HotspotTarget =
  | 'browser'
  | 'browser_instruments'
  | 'browser_effects'
  | 'browser_samples'
  | 'transport_play'
  | 'transport_stop'
  | 'transport_record'
  | 'bpm_input'
  | 'time_sig'
  | 'metronome'
  | 'midi_track_header'
  | 'audio_track_header'
  | 'add_midi_track_btn'
  | 'add_audio_track_btn'
  | 'track_mute'
  | 'track_solo'
  | 'track_arm'
  | 'track_volume'
  | 'track_pan'
  | 'track_send'
  | 'clip_slot'
  | 'piano_roll'
  | 'piano_roll_grid'
  | 'piano_roll_draw'
  | 'piano_roll_quantize'
  | 'device_chain'
  | 'operator_osc'
  | 'operator_filter'
  | 'operator_env'
  | 'wavetable_pos'
  | 'wavetable_filter'
  | 'drum_rack_pad'
  | 'mixer'
  | 'master_track'
  | 'view_toggle_arrangement'
  | 'view_toggle_session'
  | 'automation_btn';

export interface InteractiveLessonStep {
  id: string;
  title: string;
  titleHe: string;
  instruction: string;
  instructionHe: string;
  targetElement: HotspotTarget;
  explanation: string;
  explanationHe: string;
  why: string;
  whyHe: string;
  hint1: string;
  hint1He: string;
  hint2: string;
  hint2He: string;
  answer: string;
  answerHe: string;
  actionType: 'click' | 'value_change' | 'draw_note' | 'load_device' | 'toggle_mode' | 'arm_track';
  targetValue?: any;
  successMessage: string;
  successMessageHe: string;
  realAbletonChecklist: string[];
  realAbletonChecklistHe: string[];
}

export interface LessonQuizQuestion {
  question: string;
  questionHe: string;
  options: string[];
  optionsHe: string[];
  correctIndex: number;
  explanation: string;
  explanationHe: string;
}

export interface PracticalChallenge {
  title: string;
  titleHe: string;
  description: string;
  descriptionHe: string;
  requiredElements: HotspotTarget[];
}

export interface InteractiveLesson {
  id: string;
  title: string;
  titleHe: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string; // Module name or Course name
  categoryHe: string;
  moduleIndex: number;
  objective: string;
  objectiveHe: string;
  durationMinutes: number;
  steps: InteractiveLessonStep[];
  quiz?: LessonQuizQuestion[];
  practiceChallenge?: PracticalChallenge;
  completionRewardXp: number;
}

export interface ClassroomCourse {
  id: string;
  title: string;
  titleHe: string;
  subtitle: string;
  subtitleHe: string;
  genre?: GenreType;
  icon: string;
  description: string;
  descriptionHe: string;
  lessons: InteractiveLesson[];
}

export interface SkillNode {
  id: string;
  title: string;
  titleHe: string;
  category: string;
  requiredLessonIds: string[];
  unlocked: boolean;
  level: number; // 0 - 100
  icon: string;
}

export interface ClassroomProgress {
  currentCourseId: string;
  currentLessonId: string;
  currentStepIndex: number;
  completedLessonIds: string[];
  completedStepIds: string[];
  quizScores: Record<string, number>; // lessonId -> percentage
  hintsUsedCount: number;
  totalXp: number;
  difficultyMode: DifficultyMode;
  skillLevels: {
    interface: number;
    midi: number;
    drums: number;
    soundDesign: number;
    mixing: number;
    arrangement: number;
  };
  lastAccessedAt: string;
}

export interface AbletonSearchTopic {
  id: string;
  name: string;
  nameHe: string;
  targetElement: HotspotTarget;
  category: string;
  categoryHe: string;
  whatItDoes: string;
  whatItDoesHe: string;
  whyItMatters: string;
  whyItMattersHe: string;
  whenToUse: string;
  whenToUseHe: string;
  howToUse: string;
  howToUseHe: string;
  beginnerMistake: string;
  beginnerMistakeHe: string;
}
