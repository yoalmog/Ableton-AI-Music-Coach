import { ClassroomProgress, HotspotTarget, AbletonSearchTopic, InteractiveLesson } from '../types/classroom';
import { ABLETON_CLASSROOM_COURSES, ABLETON_SEARCH_TOPICS } from '../data/classroomLessons';

const STORAGE_KEY = 'aamc-classroom-progress';

const DEFAULT_PROGRESS: ClassroomProgress = {
  currentCourseId: 'beginner_core',
  currentLessonId: 'mod1_1_overview',
  currentStepIndex: 0,
  completedLessonIds: [],
  completedStepIds: [],
  quizScores: {},
  hintsUsedCount: 0,
  totalXp: 0,
  difficultyMode: 'beginner',
  skillLevels: {
    interface: 10,
    midi: 0,
    drums: 0,
    soundDesign: 0,
    mixing: 0,
    arrangement: 0
  },
  lastAccessedAt: new Date().toISOString()
};

class ClassroomService {
  private progress: ClassroomProgress;

  constructor() {
    this.progress = this.loadProgress();
  }

  private loadProgress(): ClassroomProgress {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read classroom progress from localStorage:', e);
    }
    return { ...DEFAULT_PROGRESS };
  }

  public saveProgress(): void {
    try {
      this.progress.lastAccessedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
    } catch (e) {
      console.error('Failed to persist classroom progress:', e);
    }
  }

  public getProgress(): ClassroomProgress {
    return { ...this.progress };
  }

  public setDifficultyMode(mode: 'beginner' | 'advanced'): void {
    this.progress.difficultyMode = mode;
    this.saveProgress();
  }

  public setCourseAndLesson(courseId: string, lessonId: string): void {
    this.progress.currentCourseId = courseId;
    this.progress.currentLessonId = lessonId;
    this.progress.currentStepIndex = 0;
    this.saveProgress();
  }

  public getCurrentCourse() {
    return ABLETON_CLASSROOM_COURSES.find(c => c.id === this.progress.currentCourseId) || ABLETON_CLASSROOM_COURSES[0];
  }

  public getCurrentLesson(): InteractiveLesson | undefined {
    const course = this.getCurrentCourse();
    return course.lessons.find(l => l.id === this.progress.currentLessonId) || course.lessons[0];
  }

  public incrementHintCount(): void {
    this.progress.hintsUsedCount += 1;
    this.saveProgress();
  }

  public completeStep(stepId: string, rewardXp: number = 25): { isLessonCompleted: boolean; nextStepIndex: number } {
    if (!this.progress.completedStepIds.includes(stepId)) {
      this.progress.completedStepIds.push(stepId);
      this.progress.totalXp += rewardXp;
    }

    const currentLesson = this.getCurrentLesson();
    if (!currentLesson) {
      return { isLessonCompleted: false, nextStepIndex: 0 };
    }

    const isLastStep = this.progress.currentStepIndex >= currentLesson.steps.length - 1;

    if (isLastStep) {
      if (!this.progress.completedLessonIds.includes(currentLesson.id)) {
        this.progress.completedLessonIds.push(currentLesson.id);
        this.progress.totalXp += currentLesson.completionRewardXp || 100;

        // Update skill metrics based on category
        this.updateSkillTreeForLesson(currentLesson.category);
      }
      this.saveProgress();
      return { isLessonCompleted: true, nextStepIndex: this.progress.currentStepIndex };
    } else {
      this.progress.currentStepIndex += 1;
      this.saveProgress();
      return { isLessonCompleted: false, nextStepIndex: this.progress.currentStepIndex };
    }
  }

  public saveQuizScore(lessonId: string, scorePercentage: number): void {
    this.progress.quizScores[lessonId] = scorePercentage;
    this.progress.totalXp += Math.round((scorePercentage / 100) * 50);
    this.saveProgress();
  }

  private updateSkillTreeForLesson(category: string): void {
    const skills = this.progress.skillLevels;
    const cat = category.toLowerCase();

    if (cat.includes('getting started') || cat.includes('interface')) {
      skills.interface = Math.min(100, skills.interface + 25);
    } else if (cat.includes('midi')) {
      skills.midi = Math.min(100, skills.midi + 25);
    } else if (cat.includes('drums') || cat.includes('electronic')) {
      skills.drums = Math.min(100, skills.drums + 25);
    } else if (cat.includes('instruments') || cat.includes('sound design')) {
      skills.soundDesign = Math.min(100, skills.soundDesign + 25);
    } else if (cat.includes('effects') || cat.includes('mixing')) {
      skills.mixing = Math.min(100, skills.mixing + 25);
    } else if (cat.includes('arrangement') || cat.includes('automation')) {
      skills.arrangement = Math.min(100, skills.arrangement + 25);
    }
  }

  public searchTopics(query: string): AbletonSearchTopic[] {
    if (!query.trim()) return ABLETON_SEARCH_TOPICS;
    const q = query.toLowerCase().trim();
    return ABLETON_SEARCH_TOPICS.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.nameHe.includes(q) ||
        t.whatItDoes.toLowerCase().includes(q) ||
        t.whatItDoesHe.includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }

  public getAiClassroomContext(): string {
    const course = this.getCurrentCourse();
    const lesson = this.getCurrentLesson();
    const currentStep = lesson?.steps[this.progress.currentStepIndex];

    return `
[INTERACTIVE ABLETON CLASSROOM CONTEXT]
- Simulator Version: Ableton Live 12 Educational Simulator
- Current Course: ${course.title} (${course.id})
- Current Lesson: ${lesson ? lesson.title : 'None'}
- Current Step (${this.progress.currentStepIndex + 1}/${lesson?.steps.length || 1}): ${currentStep ? currentStep.title : 'N/A'}
- Instruction: "${currentStep ? currentStep.instruction : 'N/A'}"
- Target Element: ${currentStep ? currentStep.targetElement : 'N/A'}
- Objective: ${lesson ? lesson.objective : 'N/A'}
- Completed Lessons Count: ${this.progress.completedLessonIds.length}
- Difficulty Mode: ${this.progress.difficultyMode.toUpperCase()}
- Student Total XP: ${this.progress.totalXp}
- Hints Used So Far: ${this.progress.hintsUsedCount}
- Student Skills: Interface: ${this.progress.skillLevels.interface}%, MIDI: ${this.progress.skillLevels.midi}%, SoundDesign: ${this.progress.skillLevels.soundDesign}%, Mixing: ${this.progress.skillLevels.mixing}%
    `.trim();
  }
}

export const classroomService = new ClassroomService();
