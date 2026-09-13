import { Course, CourseModule, Lesson } from '../types/lesson';
import { COURSES_DATA } from '../data/coursesData';
import { debugLog } from '../utils/debug';
import { apiUrl } from './apiConfig';

const LOCAL_COURSES_KEY = 'aamc_custom_courses_v1';

function getAuthToken(): string {
  try {
    const raw = localStorage.getItem('aamc_auth_session');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token) return parsed.token;
    }
  } catch {
    // fallback
  }
  return 'gst_producer';
}

export class CourseService {
  /**
   * Loads all courses from API or local fallback
   */
  public async getCourses(): Promise<Course[]> {
    try {
      const res = await fetch(apiUrl('/api/courses'));
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.courses) && data.courses.length > 0) {
          // Merge with any local custom offline courses
          const localCustom = this.getLocalCustomCourses();
          const combined = [...data.courses];
          localCustom.forEach((c) => {
            if (!combined.some((item) => item.id === c.id)) {
              combined.push(c);
            }
          });
          return combined;
        }
      }
    } catch (err) {
      debugLog.warn('Could not fetch courses from server, using local data:', err);
    }

    // Fallback: COURSES_DATA + local custom
    const localCustom = this.getLocalCustomCourses();
    return [...COURSES_DATA, ...localCustom];
  }

  /**
   * Retrieves single course
   */
  public async getCourseById(id: string): Promise<Course | null> {
    try {
      const res = await fetch(`/api/courses/${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.course) return data.course;
      }
    } catch {
      // fallback
    }

    const all = await this.getCourses();
    return all.find((c) => c.id === id) || null;
  }

  /**
   * Creates a new course and persists to server + localStorage
   */
  public async createCourse(course: Partial<Course>): Promise<Course> {
    const newCourse: Course = {
      id: course.id || `course_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: course.title || 'Untitled Course',
      subtitle: course.subtitle || 'Course Description',
      description: course.description || '',
      genre: course.genre || 'Psytrance',
      iconName: course.iconName || 'Disc',
      modules: course.modules || [],
      lessons: course.lessons || [],
      isCustom: true,
      author: course.author || 'Producer Instructor',
    };

    try {
      const token = getAuthToken();
      const res = await fetch(apiUrl('/api/courses'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course: newCourse }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.course) {
          this.saveLocalCustomCourse(data.course);
          return data.course;
        }
      }
    } catch (err) {
      debugLog.warn('Error saving course to API, saving locally:', err);
    }

    this.saveLocalCustomCourse(newCourse);
    return newCourse;
  }

  /**
   * Updates an existing course
   */
  public async updateCourse(id: string, courseData: Partial<Course>): Promise<Course> {
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/courses/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course: courseData }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.course) {
          this.saveLocalCustomCourse(data.course);
          return data.course;
        }
      }
    } catch (err) {
      debugLog.warn('Error updating course in API, saving locally:', err);
    }

    const all = await this.getCourses();
    const existing = all.find((c) => c.id === id);
    const updated = { ...(existing || {}), ...courseData, id } as Course;
    this.saveLocalCustomCourse(updated);
    return updated;
  }

  /**
   * Deletes a course
   */
  public async deleteCourse(id: string): Promise<boolean> {
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/courses/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        this.removeLocalCustomCourse(id);
        return true;
      }
    } catch (err) {
      debugLog.warn('Error deleting course via API:', err);
    }

    this.removeLocalCustomCourse(id);
    return true;
  }

  // --- Local custom courses helpers ---
  public getLocalCustomCourses(): Course[] {
    try {
      const raw = localStorage.getItem(LOCAL_COURSES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveLocalCustomCourse(course: Course) {
    try {
      const list = this.getLocalCustomCourses();
      const idx = list.findIndex((c) => c.id === course.id);
      if (idx >= 0) {
        list[idx] = course;
      } else {
        list.push(course);
      }
      localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(list));
    } catch (e) {
      debugLog.warn('Could not save custom course locally:', e);
    }
  }

  private removeLocalCustomCourse(id: string) {
    try {
      const list = this.getLocalCustomCourses().filter((c) => c.id !== id);
      localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(list));
    } catch (e) {
      debugLog.warn('Could not remove custom course locally:', e);
    }
  }
}

export const courseService = new CourseService();
