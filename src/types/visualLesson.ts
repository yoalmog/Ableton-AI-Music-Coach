import { GenreType } from './index';

export type VisualLessonCategory =
  | 'beginner'
  | 'psytrance'
  | 'goa'
  | 'progressive'
  | 'techno'
  | 'melodic-techno'
  | 'mixing'
  | 'sound-design'
  | 'custom'
  | 'electronic';

export type VisualLearningMode = 'guided' | 'practice' | 'challenge';

export type AnnotationType =
  | 'spotlight'
  | 'arrow'
  | 'rectangle'
  | 'circle'
  | 'glow'
  | 'zoom'
  | 'number'
  | 'marker'
  | 'textBubble'
  | 'pointer'
  | 'line'
  | 'region'
  | 'before_after'
  | 'blur';

export type AnnotationColor = 'lime' | 'cyan' | 'amber' | 'red' | 'purple' | 'blue' | 'green';

export type ArrowDirection =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface LocalizedText {
  en: string;
  he: string;
  es?: string;
  [lang: string]: string | undefined;
}

export interface ScreenAnnotation {
  id: string;
  type: AnnotationType;
  // Normalized coordinates (0.0 to 1.0)
  x: number;
  y: number;
  width?: number;
  height?: number;
  // Optional second point for line / arrow / vector
  endX?: number;
  endY?: number;
  label?: LocalizedText;
  description?: LocalizedText;
  color?: AnnotationColor;
  direction?: ArrowDirection;
  markerNumber?: number;
  pulse?: boolean;
  angle?: number;
  targetHitRadius?: number; // For challenge mode hit testing
}

export interface VisualAnimationStep {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  action: 'click' | 'drag' | 'hover' | 'type';
  text?: LocalizedText;
  durationMs: number;
}

export interface VisualParameterHighlight {
  param: string;
  value: string;
  unit?: string;
  purpose?: string;
}

export type InstructionalImageType =
  | 'bundled_diagram'
  | 'uploaded'
  | 'project'
  | 'url'
  | 'screenshot';

export interface VisualLessonStep {
  id: number;
  title: LocalizedText;
  instruction: LocalizedText;
  why: LocalizedText;
  exactAction: LocalizedText;
  expectedResult: LocalizedText;
  proTip?: LocalizedText;
  shortcutKey?: string;
  parameterHighlights?: VisualParameterHighlight[];
  // Image specification: Can be any instructional image (diagram, waveform, synth UI, compressor, user upload, screenshot)
  imageUri?: string;
  imageType?: InstructionalImageType;
  diagramType?: string;
  defaultImageKey: string;
  customImageUri?: string;
  beforeImageKey?: string;
  afterImageKey?: string;
  beforeImageUri?: string;
  afterImageUri?: string;
  beforeDesc?: LocalizedText;
  afterDesc?: LocalizedText;
  annotations: ScreenAnnotation[];
  zoomTarget?: {
    x: number;
    y: number;
    width: number;
    height: number;
    zoomLevel: number;
  };
  animationSequence?: VisualAnimationStep[];
  verificationQuestion?: LocalizedText;
  verificationCriteria?: string;
  audioPreviewType?: string;
  altText?: LocalizedText;
}

export interface VisualLesson {
  id: string;
  courseId: string;
  category: VisualLessonCategory;
  title: LocalizedText;
  subtitle?: LocalizedText;
  description: LocalizedText;
  genre: GenreType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  abletonVersion?: string;
  tags: string[];
  steps: VisualLessonStep[];
  isCustom?: boolean;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VisualCourseCategoryMeta {
  id: VisualLessonCategory;
  name: LocalizedText;
  desc: LocalizedText;
  iconName: string;
  color: string;
  totalLessons: number;
}

export interface UserVisualLessonProgress {
  lessonId: string;
  currentStepIndex: number;
  completedStepIndexes: number[];
  isCompleted: boolean;
  learningMode: VisualLearningMode;
  timeSpentSeconds: number;
  helpRequestCount: number;
  mistakesCount: number;
  lastAccessedAt: string;
  customScreenshotUri?: string;
  challengeScores?: { [stepIndex: number]: number };
}

export interface VisualCoachMemory {
  completedLessonIds: string[];
  struggledTopics: string[]; // e.g. ["sidechain", "operator-envelopes", "compressor-threshold"]
  totalTimeMinutes: number;
  lastActiveLessonId: string;
  lastActiveStepIndex: number;
  customLessons?: VisualLesson[];
}

export interface UserUploadedImage {
  id: string;
  name: string;
  uri: string;
  type: string;
  width?: number;
  height?: number;
  uploadedAt: string;
  sizeBytes?: number;
}

