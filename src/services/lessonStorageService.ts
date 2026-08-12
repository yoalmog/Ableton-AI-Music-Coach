import {
  Course,
  Lesson,
  UserLessonProgress,
  LessonFilterOptions,
  OfflineCourseManifest,
  GenreType,
  QuizAttempt,
} from '../types';
import { COURSES_DATA } from '../data/coursesData';

const PROGRESS_STORAGE_KEY = 'aamc_offline_lesson_progress_v2';
const MANIFEST_VERSION = '1.2.0';

export class LessonStorageService {
  private progressCache: Record<string, UserLessonProgress> = {};
  private manifest: OfflineCourseManifest;

  constructor() {
    this.manifest = {
      version: MANIFEST_VERSION,
      lastUpdated: new Date().toISOString(),
      totalCourses: COURSES_DATA.length,
      totalLessons: COURSES_DATA.reduce((acc, c) => acc + c.lessons.length, 0),
      offlineReady: true,
      bundleChecksum: 'AAMC-OFFLINE-LOCAL-BUNDLED-V1',
    };
    this.loadProgressFromStorage();
  }

  /**
   * Reads persistent progress from localStorage with safe fallback handling
   */
  private loadProgressFromStorage(): void {
    try {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (raw) {
        this.progressCache = JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[LessonStorageService] Could not read progress from localStorage:', err);
      this.progressCache = {};
    }
  }

  /**
   * Persists progress map to localStorage
   */
  private saveProgressToStorage(): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(this.progressCache));
    } catch (err) {
      console.error('[LessonStorageService] Failed to persist progress to localStorage:', err);
    }
  }

  /**
   * Get the offline manifest metadata
   */
  public getManifest(): OfflineCourseManifest {
    return { ...this.manifest };
  }

  /**
   * Get all courses bundled offline
   */
  public getAllCourses(): Course[] {
    return COURSES_DATA;
  }

  /**
   * Find a course and lesson by ID
   */
  public getLessonById(lessonId: string): { course: Course; lesson: Lesson } | null {
    for (const course of COURSES_DATA) {
      const lesson = course.lessons.find((l) => l.id === lessonId);
      if (lesson) {
        return { course, lesson };
      }
    }
    return null;
  }

  /**
   * Retrieve user progress for a given lesson
   */
  public getLessonProgress(lessonId: string): UserLessonProgress {
    if (!this.progressCache[lessonId]) {
      this.progressCache[lessonId] = {
        lessonId,
        completedStepIndexes: [],
        isCompleted: false,
        lastAccessedAt: new Date().toISOString(),
        quizAttempts: [],
        userNotes: '',
        isBookmarked: false,
      };
    }
    return this.progressCache[lessonId];
  }

  /**
   * Toggle completion of a specific step in a lesson
   */
  public toggleStepCompletion(lessonId: string, stepIndex: number, totalSteps: number): UserLessonProgress {
    const progress = this.getLessonProgress(lessonId);
    const set = new Set(progress.completedStepIndexes);

    if (set.has(stepIndex)) {
      set.delete(stepIndex);
    } else {
      set.add(stepIndex);
    }

    progress.completedStepIndexes = Array.from(set).sort((a, b) => a - b);
    progress.isCompleted = progress.completedStepIndexes.length >= totalSteps;
    progress.lastAccessedAt = new Date().toISOString();

    this.progressCache[lessonId] = progress;
    this.saveProgressToStorage();
    return { ...progress };
  }

  /**
   * Save a quiz attempt score and evaluate progress
   */
  public submitQuizAttempt(
    lessonId: string,
    answers: Record<number, number>,
    totalQuestions: number,
    correctCount: number
  ): { scorePercentage: number; progress: UserLessonProgress } {
    const progress = this.getLessonProgress(lessonId);
    const scorePercentage = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);

    const attempt: QuizAttempt = {
      timestamp: new Date().toISOString(),
      scorePercentage,
      selectedAnswers: answers,
    };

    progress.quizAttempts.push(attempt);
    if (progress.quizBestScore === undefined || scorePercentage > progress.quizBestScore) {
      progress.quizBestScore = scorePercentage;
    }

    progress.lastAccessedAt = new Date().toISOString();
    this.progressCache[lessonId] = progress;
    this.saveProgressToStorage();

    return { scorePercentage, progress: { ...progress } };
  }

  /**
   * Save custom user offline production notes for a lesson
   */
  public saveUserNotes(lessonId: string, notes: string): UserLessonProgress {
    const progress = this.getLessonProgress(lessonId);
    progress.userNotes = notes;
    progress.lastAccessedAt = new Date().toISOString();

    this.progressCache[lessonId] = progress;
    this.saveProgressToStorage();
    return { ...progress };
  }

  /**
   * Toggle bookmarking status of a lesson
   */
  public toggleBookmark(lessonId: string): boolean {
    const progress = this.getLessonProgress(lessonId);
    progress.isBookmarked = !progress.isBookmarked;
    progress.lastAccessedAt = new Date().toISOString();

    this.progressCache[lessonId] = progress;
    this.saveProgressToStorage();
    return progress.isBookmarked;
  }

  /**
   * Filter and search offline lessons
   */
  public filterLessons(options: LessonFilterOptions): Lesson[] {
    const allLessons: Lesson[] = [];
    COURSES_DATA.forEach((course) => {
      course.lessons.forEach((lesson) => {
        allLessons.push(lesson);
      });
    });

    return allLessons.filter((lesson) => {
      // Genre filter
      if (options.genre && options.genre !== 'All' && lesson.genre !== options.genre) {
        return false;
      }

      // Difficulty filter
      if (options.difficulty && options.difficulty !== 'All' && lesson.difficulty !== options.difficulty) {
        return false;
      }

      // Tag filter
      if (options.tag && (!lesson.tags || !lesson.tags.includes(options.tag))) {
        return false;
      }

      // Bookmarked filter
      if (options.onlyBookmarked) {
        const prog = this.progressCache[lesson.id];
        if (!prog || !prog.isBookmarked) return false;
      }

      // Search query filter
      if (options.searchQuery && options.searchQuery.trim().length > 0) {
        const q = options.searchQuery.toLowerCase().trim();
        const inTitle = lesson.title.toLowerCase().includes(q);
        const inDesc = lesson.description.toLowerCase().includes(q);
        const inSubtitle = lesson.subtitle?.toLowerCase().includes(q) || false;
        const inObjectives = lesson.learningObjectives.some((o) => o.description.toLowerCase().includes(q));
        const inTags = lesson.tags?.some((t) => t.toLowerCase().includes(q)) || false;

        if (!inTitle && !inDesc && !inSubtitle && !inObjectives && !inTags) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Generate an overall completion and score summary for the user
   */
  public getOverallSummary(): {
    totalLessons: number;
    completedLessons: number;
    completionPercentage: number;
    averageQuizScore: number;
    bookmarkedCount: number;
    totalStudyMinutesCompleted: number;
  } {
    let totalLessons = 0;
    let completedLessons = 0;
    let quizScoreSum = 0;
    let quizCount = 0;
    let bookmarkedCount = 0;
    let totalStudyMinutesCompleted = 0;

    COURSES_DATA.forEach((course) => {
      course.lessons.forEach((lesson) => {
        totalLessons++;
        const prog = this.progressCache[lesson.id];
        if (prog) {
          if (prog.isCompleted) {
            completedLessons++;
            totalStudyMinutesCompleted += lesson.durationMinutes;
          }
          if (prog.isBookmarked) {
            bookmarkedCount++;
          }
          if (prog.quizBestScore !== undefined) {
            quizScoreSum += prog.quizBestScore;
            quizCount++;
          }
        }
      });
    });

    const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const averageQuizScore = quizCount > 0 ? Math.round(quizScoreSum / quizCount) : 0;

    return {
      totalLessons,
      completedLessons,
      completionPercentage,
      averageQuizScore,
      bookmarkedCount,
      totalStudyMinutesCompleted,
    };
  }

  /**
   * Export offline progress JSON for user backup
   */
  public exportProgressData(): string {
    return JSON.stringify({
      manifest: this.manifest,
      exportedAt: new Date().toISOString(),
      progress: this.progressCache,
    }, null, 2);
  }

  /**
   * Import offline progress JSON
   */
  public importProgressData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed.progress === 'object') {
        this.progressCache = parsed.progress;
        this.saveProgressToStorage();
        return true;
      }
      return false;
    } catch (err) {
      console.error('[LessonStorageService] Error importing progress data:', err);
      return false;
    }
  }
}

export const lessonStorageService = new LessonStorageService();
