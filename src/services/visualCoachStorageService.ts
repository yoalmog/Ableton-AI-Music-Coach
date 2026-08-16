import {
  UserVisualLessonProgress,
  VisualCoachMemory,
  VisualLearningMode,
  VisualLesson,
  UserUploadedImage,
} from '../types/visualLesson';

const PROGRESS_STORAGE_KEY = 'aamc_visual_coach_progress';
const MEMORY_STORAGE_KEY = 'aamc_visual_coach_memory';
const USER_SCREENSHOTS_KEY = 'aamc_visual_coach_screenshots';
const CUSTOM_LESSONS_KEY = 'aamc_visual_custom_lessons';
const UPLOADED_IMAGES_KEY = 'aamc_visual_uploaded_images';

export class VisualCoachStorageService {
  public getAllProgress(): Record<string, UserVisualLessonProgress> {
    try {
      const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  public getLessonProgress(lessonId: string): UserVisualLessonProgress {
    const all = this.getAllProgress();
    if (all[lessonId]) {
      return all[lessonId];
    }
    return {
      lessonId,
      currentStepIndex: 0,
      completedStepIndexes: [],
      isCompleted: false,
      learningMode: 'guided',
      timeSpentSeconds: 0,
      helpRequestCount: 0,
      mistakesCount: 0,
      lastAccessedAt: new Date().toISOString(),
    };
  }

  public saveLessonProgress(progress: UserVisualLessonProgress): void {
    try {
      const all = this.getAllProgress();
      all[progress.lessonId] = {
        ...progress,
        lastAccessedAt: new Date().toISOString(),
      };
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(all));

      // Update memory summary
      this.updateMemoryOnProgress(progress);
    } catch (err) {
      console.warn('Failed to save visual lesson progress:', err);
    }
  }

  public completeStep(lessonId: string, stepIndex: number): UserVisualLessonProgress {
    const progress = this.getLessonProgress(lessonId);
    if (!progress.completedStepIndexes.includes(stepIndex)) {
      progress.completedStepIndexes.push(stepIndex);
    }
    progress.currentStepIndex = stepIndex + 1;
    this.saveLessonProgress(progress);
    return progress;
  }

  public setLessonCompleted(lessonId: string, totalSteps: number): UserVisualLessonProgress {
    const progress = this.getLessonProgress(lessonId);
    progress.isCompleted = true;
    progress.completedStepIndexes = Array.from({ length: totalSteps }, (_, i) => i);
    this.saveLessonProgress(progress);
    return progress;
  }

  public getMemory(): VisualCoachMemory {
    try {
      const data = localStorage.getItem(MEMORY_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}

    return {
      completedLessonIds: [],
      struggledTopics: [],
      totalTimeMinutes: 0,
      lastActiveLessonId: 'psy-kick-bass-01',
      lastActiveStepIndex: 0,
    };
  }

  public saveMemory(memory: VisualCoachMemory): void {
    try {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memory));
    } catch {}
  }

  public recordMistake(lessonId: string, topic: string): void {
    const memory = this.getMemory();
    if (!memory.struggledTopics.includes(topic)) {
      memory.struggledTopics.push(topic);
      this.saveMemory(memory);
    }

    const progress = this.getLessonProgress(lessonId);
    progress.mistakesCount = (progress.mistakesCount || 0) + 1;
    this.saveLessonProgress(progress);
  }

  public recordHelpRequest(lessonId: string): void {
    const progress = this.getLessonProgress(lessonId);
    progress.helpRequestCount = (progress.helpRequestCount || 0) + 1;
    this.saveLessonProgress(progress);
  }

  public getSavedScreenshot(lessonId: string): string | null {
    try {
      const data = localStorage.getItem(`${USER_SCREENSHOTS_KEY}_${lessonId}`);
      return data || null;
    } catch {
      return null;
    }
  }

  public saveScreenshot(lessonId: string, dataUrl: string): void {
    try {
      localStorage.setItem(`${USER_SCREENSHOTS_KEY}_${lessonId}`, dataUrl);
    } catch (err) {
      console.warn('Failed to save user screenshot:', err);
    }
  }

  public removeScreenshot(lessonId: string): void {
    try {
      localStorage.removeItem(`${USER_SCREENSHOTS_KEY}_${lessonId}`);
    } catch {}
  }

  // -------------------------------------------------------------
  // CUSTOM LESSONS PERSISTENCE
  // -------------------------------------------------------------
  public getCustomLessons(): VisualLesson[] {
    try {
      const data = localStorage.getItem(CUSTOM_LESSONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveCustomLesson(lesson: VisualLesson): void {
    try {
      const existing = this.getCustomLessons();
      const index = existing.findIndex((l) => l.id === lesson.id);
      if (index >= 0) {
        existing[index] = lesson;
      } else {
        existing.push(lesson);
      }
      localStorage.setItem(CUSTOM_LESSONS_KEY, JSON.stringify(existing));
    } catch (err) {
      console.warn('Failed to save custom visual lesson:', err);
    }
  }

  public deleteCustomLesson(lessonId: string): void {
    try {
      const existing = this.getCustomLessons().filter((l) => l.id !== lessonId);
      localStorage.setItem(CUSTOM_LESSONS_KEY, JSON.stringify(existing));
    } catch {}
  }

  // -------------------------------------------------------------
  // UPLOADED IMAGES PERSISTENCE
  // -------------------------------------------------------------
  public getUploadedImages(): UserUploadedImage[] {
    try {
      const data = localStorage.getItem(UPLOADED_IMAGES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveUploadedImage(image: UserUploadedImage): void {
    try {
      const existing = this.getUploadedImages();
      existing.unshift(image);
      localStorage.setItem(UPLOADED_IMAGES_KEY, JSON.stringify(existing.slice(0, 30)));
    } catch (err) {
      console.warn('Failed to save uploaded image:', err);
    }
  }

  public deleteUploadedImage(imageId: string): void {
    try {
      const existing = this.getUploadedImages().filter((img) => img.id !== imageId);
      localStorage.setItem(UPLOADED_IMAGES_KEY, JSON.stringify(existing));
    } catch (err) {
      console.warn('Failed to delete uploaded image:', err);
    }
  }

  private updateMemoryOnProgress(progress: UserVisualLessonProgress): void {
    const memory = this.getMemory();
    memory.lastActiveLessonId = progress.lessonId;
    memory.lastActiveStepIndex = progress.currentStepIndex;

    if (progress.isCompleted && !memory.completedLessonIds.includes(progress.lessonId)) {
      memory.completedLessonIds.push(progress.lessonId);
    }

    this.saveMemory(memory);
  }
}

export const visualCoachStorageService = new VisualCoachStorageService();
