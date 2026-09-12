import express, { Request, Response } from 'express';
import { dbStore } from './dbStore.js';

export const courseRouter = express.Router();
export const userRouter = express.Router();

function getAuthUser(req: Request) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  const session = dbStore.getSession(token);
  if (session) {
    return dbStore.getUserById(session.userId);
  }

  if (token.startsWith('gst_')) {
    return {
      userId: token,
      email: `${token}@guest.local`,
      displayName: 'Guest Producer',
      isGuest: true,
    } as any;
  }

  return null;
}

// ----------------------------------------------------
// USER PROJECTS & PROGRESS API ROUTES (/api/user)
// ----------------------------------------------------

// Get user projects
userRouter.get('/projects', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Authentication required to access projects.' });
  }

  const projects = dbStore.getUserProjects(user.userId);
  return res.json({ ok: true, projects });
});

// Save or update a user project
userRouter.post('/projects', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Authentication required to save projects.' });
  }

  const project = req.body?.project;
  if (!project || !project.name) {
    return res.status(400).json({ ok: false, error: 'Valid project payload is required.' });
  }

  const saved = dbStore.saveUserProject(user.userId, project);
  return res.json({ ok: true, project: saved });
});

// Delete a user project
userRouter.delete('/projects/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Authentication required to delete projects.' });
  }

  const projectId = req.params.id;
  const deleted = dbStore.deleteUserProject(user.userId, projectId);
  return res.json({ ok: true, deleted });
});

// Get user course progress
userRouter.get('/course-progress', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Authentication required to view course progress.' });
  }

  const progress = dbStore.getUserCourseProgress(user.userId);
  return res.json({ ok: true, progress });
});

// Save user course progress
userRouter.post('/course-progress', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Authentication required to save course progress.' });
  }

  const { courseId, progressData } = req.body || {};
  if (!courseId || !progressData) {
    return res.status(400).json({ ok: false, error: 'CourseId and progressData are required.' });
  }

  const updated = dbStore.saveUserCourseProgress(user.userId, courseId, progressData);
  return res.json({ ok: true, courseId, progress: updated });
});

// ----------------------------------------------------
// COURSE MANAGEMENT API ROUTES (/api/courses)
// ----------------------------------------------------

// Get all courses
courseRouter.get('/', (_req: Request, res: Response) => {
  try {
    const courses = dbStore.getCourses();
    return res.json({ ok: true, courses });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Could not fetch courses.' });
  }
});

// Get course by id
courseRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;
    const course = dbStore.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ ok: false, error: 'Course not found.' });
    }
    return res.json({ ok: true, course });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Could not fetch course.' });
  }
});

// Create new course
courseRouter.post('/', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const courseData = req.body?.course || req.body;

  if (!courseData || !courseData.title) {
    return res.status(400).json({ ok: false, error: 'Course title is required.' });
  }

  const newCourse = {
    ...courseData,
    author: user ? user.displayName : 'Producer Instructor',
    authorId: user ? user.userId : null,
    isCustom: true,
  };

  const saved = dbStore.saveCourse(newCourse);
  return res.json({ ok: true, course: saved, message: 'Course created successfully.' });
});

// Update existing course
courseRouter.put('/:id', (req: Request, res: Response) => {
  const courseId = req.params.id;
  const existing = dbStore.getCourseById(courseId);
  const courseData = req.body?.course || req.body;

  if (!courseData) {
    return res.status(400).json({ ok: false, error: 'Course update payload required.' });
  }

  const updatedCourse = {
    ...(existing || {}),
    ...courseData,
    id: courseId,
  };

  const saved = dbStore.saveCourse(updatedCourse);
  return res.json({ ok: true, course: saved, message: 'Course updated successfully.' });
});

// Delete course
courseRouter.delete('/:id', (req: Request, res: Response) => {
  const courseId = req.params.id;
  const deleted = dbStore.deleteCourse(courseId);
  return res.json({ ok: true, deleted, message: deleted ? 'Course deleted.' : 'Course not found.' });
});
