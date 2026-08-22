import {
  AbletonLessonDefinition,
  AbletonLessonStep,
  AbletonSimulatorState,
  SimulatorActionType,
  SimulatorLearningMode,
  SimulatorValidationResult,
  NormalizedRect,
} from '../types/abletonSimulator';
import { ABLETON_SIMULATOR_LESSONS } from '../data/abletonSimulatorLessons';
import { AbletonActionValidator } from '../components/simulator/AbletonActionValidator';

export type LessonStateMachineState =
  | 'IDLE'
  | 'WAITING_FOR_ACTION'
  | 'VALIDATING'
  | 'STEP_SUCCESS'
  | 'STEP_FAILED'
  | 'HINT_ACTIVE'
  | 'LESSON_COMPLETED';

export interface DragEventData {
  startNormalized: { x: number; y: number };
  currentNormalized: { x: number; y: number };
  delta: { x: number; y: number };
  dropTargetId?: string;
  sourceTargetId?: string;
  isDragging: boolean;
}

export interface LessonEngineState {
  stateMachine: LessonStateMachineState;
  lesson: AbletonLessonDefinition | null;
  currentStepIndex: number;
  currentStep: AbletonLessonStep | null;
  learningMode: SimulatorLearningMode;
  validationResult: SimulatorValidationResult | null;
  score: number;
  mistakesCount: number;
  hintsUsedCount: number;
  activeHintLevel: number; // 0 = none, 1 = text hint, 2 = visual spotlight/arrow, 3 = auto-guidance
  isDragging: boolean;
  activeDragData: DragEventData | null;
  lastActionTimestamp: number;
  history: {
    stepIndex: number;
    actionType: SimulatorActionType;
    targetId: string;
    passed: boolean;
    timestamp: number;
  }[];
}

export class AbletonLessonEngine {
  private static instance: AbletonLessonEngine;
  private state: LessonEngineState;
  private listeners: Set<(state: LessonEngineState) => void> = new Set();
  private autoAdvanceTimer: any = null;

  private constructor() {
    this.state = this.getInitialState();
  }

  public static getInstance(): AbletonLessonEngine {
    if (!AbletonLessonEngine.instance) {
      AbletonLessonEngine.instance = new AbletonLessonEngine();
    }
    return AbletonLessonEngine.instance;
  }

  private getInitialState(): LessonEngineState {
    const defaultLesson = ABLETON_SIMULATOR_LESSONS[0] || null;
    return {
      stateMachine: defaultLesson ? 'WAITING_FOR_ACTION' : 'IDLE',
      lesson: defaultLesson,
      currentStepIndex: 0,
      currentStep: defaultLesson?.steps[0] || null,
      learningMode: 'guided',
      validationResult: null,
      score: 0,
      mistakesCount: 0,
      hintsUsedCount: 0,
      activeHintLevel: 0,
      isDragging: false,
      activeDragData: null,
      lastActionTimestamp: Date.now(),
      history: [],
    };
  }

  public getState(): LessonEngineState {
    return { ...this.state };
  }

  public subscribe(listener: (state: LessonEngineState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (err) {
        console.error('AbletonLessonEngine subscription error:', err);
      }
    });
  }

  /**
   * Load and initialize a new lesson
   */
  public loadLesson(
    lesson: AbletonLessonDefinition,
    mode: SimulatorLearningMode = 'guided'
  ): void {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }

    this.state = {
      stateMachine: 'WAITING_FOR_ACTION',
      lesson,
      currentStepIndex: 0,
      currentStep: lesson.steps[0] || null,
      learningMode: mode,
      validationResult: null,
      score: 0,
      mistakesCount: 0,
      hintsUsedCount: 0,
      activeHintLevel: mode === 'guided' ? 2 : 0,
      isDragging: false,
      activeDragData: null,
      lastActionTimestamp: Date.now(),
      history: [],
    };

    this.notify();
  }

  /**
   * Set Learning Mode (Guided, Practice, Exam)
   */
  public setLearningMode(mode: SimulatorLearningMode): void {
    this.state.learningMode = mode;
    if (mode === 'guided') {
      this.state.activeHintLevel = Math.max(this.state.activeHintLevel, 2);
    } else {
      this.state.activeHintLevel = 0;
    }
    this.notify();
  }

  /**
   * Process interactive student action through the validation state machine
   */
  public processAction(
    actionType: SimulatorActionType,
    targetId: string,
    simulatorState: AbletonSimulatorState,
    payload?: any
  ): SimulatorValidationResult {
    const currentStep = this.state.currentStep;
    if (!currentStep || this.state.stateMachine === 'LESSON_COMPLETED') {
      return {
        pass: false,
        message: {
          en: 'No active step to validate.',
          he: 'אין שלב פעיל לאימות.',
          es: 'No hay ningún paso activo para validar.',
        },
      };
    }

    this.state.stateMachine = 'VALIDATING';
    this.notify();

    // Check action against validation logic
    const result = AbletonActionValidator.validateStep(
      currentStep,
      simulatorState,
      actionType,
      payload
    );

    const now = Date.now();
    this.state.lastActionTimestamp = now;
    this.state.history.push({
      stepIndex: this.state.currentStepIndex,
      actionType,
      targetId,
      passed: result.pass,
      timestamp: now,
    });

    if (result.pass) {
      // Success branch
      this.state.stateMachine = 'STEP_SUCCESS';
      this.state.validationResult = result;
      
      const bonus = result.scoreBonus ?? (this.state.learningMode === 'exam' ? 25 : 15);
      // Deduct points if hints were used
      const hintPenalty = this.state.activeHintLevel > 0 ? this.state.activeHintLevel * 2 : 0;
      this.state.score += Math.max(5, bonus - hintPenalty);

      this.notify();

      // Schedule transition to next step
      if (this.autoAdvanceTimer) {
        clearTimeout(this.autoAdvanceTimer);
      }
      this.autoAdvanceTimer = setTimeout(() => {
        this.nextStep();
      }, 1200);
    } else {
      // Failure branch
      this.state.stateMachine = 'STEP_FAILED';
      this.state.validationResult = result;
      this.state.mistakesCount += 1;
      this.notify();
    }

    return result;
  }

  /**
   * Process Keyboard Shortcut action (e.g. Ctrl+Shift+T, Ctrl+Shift+M, Space, Tab)
   */
  public processKeyboardShortcut(
    shortcutString: string,
    simulatorState: AbletonSimulatorState
  ): SimulatorValidationResult | null {
    const currentStep = this.state.currentStep;
    if (!currentStep) return null;

    const normalizedShortcut = shortcutString.toLowerCase().trim();
    const expected = (currentStep.expectedValue || '').toString().toLowerCase().trim();

    // Direct match with expected shortcut or action type
    if (
      currentStep.expectedAction === 'KEYBOARD_SHORTCUT' ||
      normalizedShortcut === expected ||
      (currentStep.targetId === 'create-midi-track' && (normalizedShortcut.includes('shift+t') || normalizedShortcut.includes('ctrl+shift+t') || normalizedShortcut.includes('cmd+shift+t') || normalizedShortcut.includes('meta+shift+t'))) ||
      (currentStep.targetId === 'insert-midi-clip' && (normalizedShortcut.includes('shift+m') || normalizedShortcut.includes('ctrl+shift+m') || normalizedShortcut.includes('cmd+shift+m')))
    ) {
      return this.processAction(
        'KEYBOARD_SHORTCUT',
        currentStep.targetId,
        simulatorState,
        shortcutString
      );
    }

    return null;
  }

  /**
   * Handle Drag & Drop operations with normalized relative coordinates
   */
  public startDrag(
    startPos: { x: number; y: number },
    sourceTargetId?: string
  ): void {
    this.state.isDragging = true;
    this.state.activeDragData = {
      startNormalized: startPos,
      currentNormalized: startPos,
      delta: { x: 0, y: 0 },
      sourceTargetId,
      isDragging: true,
    };
    this.notify();
  }

  public updateDrag(currentPos: { x: number; y: number }): void {
    if (!this.state.isDragging || !this.state.activeDragData) return;

    const delta = {
      x: currentPos.x - this.state.activeDragData.startNormalized.x,
      y: currentPos.y - this.state.activeDragData.startNormalized.y,
    };

    this.state.activeDragData = {
      ...this.state.activeDragData,
      currentNormalized: currentPos,
      delta,
    };
    this.notify();
  }

  public endDrag(
    dropPos: { x: number; y: number },
    dropTargetId: string | undefined,
    simulatorState: AbletonSimulatorState
  ): SimulatorValidationResult | null {
    if (!this.state.isDragging) return null;

    const currentStep = this.state.currentStep;
    this.state.isDragging = false;
    this.state.activeDragData = null;

    if (!currentStep) {
      this.notify();
      return null;
    }

    // Evaluate drop zone
    const result = this.processAction(
      'DRAG',
      dropTargetId || currentStep.targetId,
      simulatorState,
      { dropPos, dropTargetId }
    );

    return result;
  }

  /**
   * Request / escalate hint level
   */
  public requestHint(): number {
    this.state.hintsUsedCount += 1;
    this.state.activeHintLevel = Math.min(3, this.state.activeHintLevel + 1);
    this.state.stateMachine = 'HINT_ACTIVE';
    this.notify();
    return this.state.activeHintLevel;
  }

  /**
   * Reset hint back to basic
   */
  public clearHint(): void {
    this.state.activeHintLevel = this.state.learningMode === 'guided' ? 2 : 0;
    if (this.state.stateMachine === 'HINT_ACTIVE') {
      this.state.stateMachine = 'WAITING_FOR_ACTION';
    }
    this.notify();
  }

  /**
   * Advance to the next step
   */
  public nextStep(): void {
    if (!this.state.lesson) return;

    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }

    const nextIndex = this.state.currentStepIndex + 1;
    if (nextIndex < this.state.lesson.steps.length) {
      this.state.currentStepIndex = nextIndex;
      this.state.currentStep = this.state.lesson.steps[nextIndex];
      this.state.stateMachine = 'WAITING_FOR_ACTION';
      this.state.validationResult = null;
      this.state.activeHintLevel = this.state.learningMode === 'guided' ? 2 : 0;
    } else {
      this.state.stateMachine = 'LESSON_COMPLETED';
    }

    this.notify();
  }

  /**
   * Return to previous step
   */
  public prevStep(): void {
    if (!this.state.lesson) return;

    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }

    if (this.state.currentStepIndex > 0) {
      const prevIndex = this.state.currentStepIndex - 1;
      this.state.currentStepIndex = prevIndex;
      this.state.currentStep = this.state.lesson.steps[prevIndex];
      this.state.stateMachine = 'WAITING_FOR_ACTION';
      this.state.validationResult = null;
      this.state.activeHintLevel = this.state.learningMode === 'guided' ? 2 : 0;
      this.notify();
    }
  }

  /**
   * Jump directly to step index
   */
  public jumpToStep(stepIndex: number): void {
    if (!this.state.lesson) return;
    if (stepIndex >= 0 && stepIndex < this.state.lesson.steps.length) {
      this.state.currentStepIndex = stepIndex;
      this.state.currentStep = this.state.lesson.steps[stepIndex];
      this.state.stateMachine = 'WAITING_FOR_ACTION';
      this.state.validationResult = null;
      this.state.activeHintLevel = this.state.learningMode === 'guided' ? 2 : 0;
      this.notify();
    }
  }

  /**
   * Reset the active lesson
   */
  public resetLesson(): void {
    if (!this.state.lesson) return;
    this.loadLesson(this.state.lesson, this.state.learningMode);
  }
}

export const abletonLessonEngine = AbletonLessonEngine.getInstance();
