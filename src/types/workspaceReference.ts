import { LocalizedText } from './visualLesson';
import { NormalizedRect, SimulatorActionType, AbletonSimulatorState, SimulatorValidationResult } from './abletonSimulator';

export type WorkspaceType =
  | 'SESSION_VIEW'
  | 'ARRANGEMENT_VIEW'
  | 'MIXER'
  | 'BROWSER'
  | 'CLIP_VIEW'
  | 'MIDI_EDITOR'
  | 'DEVICE_VIEW'
  | 'AUDIO_EDITOR'
  | 'AUTOMATION'
  | 'TRANSPORT'
  | 'CONTROL_BAR'
  | 'PREFERENCES'
  | 'WORKFLOW';

export interface ReferenceSourceInfo {
  name: string; // e.g. "Ableton Live 12 Reference Manual"
  url: string;  // e.g. "https://www.ableton.com/en/manual/live-concepts/"
  section?: string;
  copyright?: string;
}

export interface ReferenceHotspot {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  rect: NormalizedRect;
  category?: 'overview' | 'control' | 'navigation' | 'audio' | 'midi' | 'device' | 'routing';
  mappedSimulatorTarget?: string; // e.g. 'session-scene-launch', 'tempo-bpm', 'mixer-fader-t2'
  pulseColor?: string;
}

export interface ReferenceImageItem {
  id: string;
  title: LocalizedText;
  workspace: WorkspaceType;
  description: LocalizedText;
  imageUrl?: string;
  imageSource?: string; // Direct image source URI or asset path
  svgGraphic?: string; // High-detail crisp vector representation of Ableton UI
  source: ReferenceSourceInfo;
  hotspots: ReferenceHotspot[];
  badge?: string; // e.g. "Official Ableton Manual"
}

export type TutorialStepType =
  | 'observe'     // Step 1: Look at real workspace reference
  | 'understand'  // Step 2: Understand highlighted region / concept
  | 'try'         // Step 3: Switch focus to simulator
  | 'do'          // Step 4: Perform interactive action
  | 'verify'      // Step 5: Validate action in simulator
  | 'workflow';   // Step 6: Multi-stage workflow (e.g. Session -> Arrangement capture)

export interface TutorialLessonStep {
  id: string | number;
  type: TutorialStepType;
  title: LocalizedText;
  instruction: LocalizedText;
  explanation: LocalizedText;
  why?: LocalizedText;
  hint?: LocalizedText;
  referenceImageId?: string;
  activeHotspotId?: string;
  referenceTargetRect?: NormalizedRect;
  simulatorTargetId?: string;
  simulatorTargetRect?: NormalizedRect;
  expectedAction?: SimulatorActionType;
  expectedValue?: any;
  arrowDirection?: 'up' | 'down' | 'left' | 'right';
  validation?: (state: AbletonSimulatorState, actionData?: any) => SimulatorValidationResult;
  deviceTarget?: {
    deviceType: string;
    parameterName: string;
    targetValue: number | string | boolean;
    tolerance?: number;
  };
}

export interface TutorialLesson {
  id: string;
  title: LocalizedText;
  subtitle?: LocalizedText;
  description: LocalizedText;
  workspace: WorkspaceType;
  category: 'core_interface' | 'workflow' | 'psytrance' | 'synthesis' | 'mixing' | 'arranging';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  referenceImages: ReferenceImageItem[];
  steps: TutorialStepStepWrapper[];
  initialState?: Partial<AbletonSimulatorState>;
  badge?: string;
}

export type TutorialStepStepWrapper = TutorialLessonStep;
