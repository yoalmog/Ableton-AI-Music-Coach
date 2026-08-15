import { AAMCProject, GenreType, KeyType, ScaleType } from '../types';
import { desktopService } from './desktopService';
import { debugLog } from '../utils/debug';

const RECENT_PROJECTS_KEY = 'aamc_recent_projects';
const ACTIVE_PROJECT_KEY = 'aamc_active_project';
const LOCAL_PROJECTS_KEY = 'aamc_local_projects';

export class ProjectService {
  /**
   * Create a fresh default .aamc project
   */
  public createNewProject(
    name: string = 'My Psytrance Track',
    genre: GenreType = 'Psytrance',
    bpm: number = 142,
    key: KeyType = 'F#',
    scale: ScaleType = 'Minor'
  ): AAMCProject {
    const now = new Date().toISOString();
    const project: AAMCProject = {
      format: 'AAMC',
      id: `aamc_${Date.now()}`,
      version: 1,
      name,
      genre,
      subgenre: 'Full-On Psytrance',
      bpm,
      key,
      scale,
      completedLessonIds: [],
      midiPatterns: [],
      userNotes: '',
      aiNotes: [
        `Started project in ${key} ${scale} at ${bpm} BPM.`,
        `Focus area: Ableton Live 12 Kick & Bass alignment and Operator sound design.`
      ],
      createdAt: now,
      updatedAt: now,
    };
    this.saveActiveProject(project);
    return project;
  }

  /**
   * Get active project from local storage or fallback to new project
   */
  public getActiveProject(): AAMCProject {
    try {
      const raw = localStorage.getItem(ACTIVE_PROJECT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.name) {
          // Normalize fields if needed
          return {
            format: 'AAMC',
            id: parsed.id || `aamc_${Date.now()}`,
            version: 1,
            name: parsed.name,
            genre: parsed.genre || 'Psytrance',
            subgenre: parsed.subgenre || 'Full-On Psytrance',
            bpm: parsed.bpm || 142,
            key: parsed.key || 'F#',
            scale: parsed.scale || 'Minor',
            completedLessonIds: parsed.completedLessonIds || [],
            midiPatterns: parsed.midiPatterns || [],
            userNotes: parsed.userNotes || '',
            aiNotes: parsed.aiNotes || [],
            createdAt: parsed.createdAt || new Date().toISOString(),
            updatedAt: parsed.updatedAt || new Date().toISOString(),
          };
        }
      }
    } catch (err) {
      debugLog.warn('Failed to parse active project from localStorage:', err);
    }
    return this.createNewProject('My Psytrance Track', 'Psytrance', 142, 'F#', 'Minor');
  }

  /**
   * Persist active project to local storage
   */
  public saveActiveProject(project: AAMCProject): void {
    try {
      project.updatedAt = new Date().toISOString();
      localStorage.setItem(ACTIVE_PROJECT_KEY, JSON.stringify(project));
      this.saveLocalProject(project);
    } catch (err) {
      debugLog.warn('Failed to persist active project to localStorage:', err);
    }
  }

  /**
   * Get all local projects stored in browser
   */
  public getLocalProjects(): AAMCProject[] {
    try {
      const raw = localStorage.getItem(LOCAL_PROJECTS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      debugLog.warn('Failed to read local projects:', err);
    }
    return [];
  }

  /**
   * Upsert a project into local projects list
   */
  public saveLocalProject(project: AAMCProject): void {
    try {
      const list = this.getLocalProjects().filter((p) => p.id !== project.id);
      list.unshift(project);
      // Keep up to 25 local projects
      const trimmed = list.slice(0, 25);
      localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(trimmed));
      this.addRecentProject(project.name, undefined, project.genre);
    } catch (err) {
      debugLog.warn('Failed to save to local projects list:', err);
    }
  }

  /**
   * Delete a project from local storage
   */
  public deleteLocalProject(projectId: string): void {
    try {
      const list = this.getLocalProjects().filter((p) => p.id !== projectId);
      localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(list));
    } catch (err) {
      debugLog.warn('Failed to delete local project:', err);
    }
  }

  /**
   * Get list of recent project file paths / names stored in client settings
   */
  public getRecentProjects(): { name: string; path?: string; updatedAt: string; genre: GenreType }[] {
    try {
      const stored = localStorage.getItem(RECENT_PROJECTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      debugLog.warn('Failed to load recent projects:', e);
    }
    return [
      { name: 'Goa_Sunrise_142BPM.aamc', updatedAt: new Date().toISOString(), genre: 'Goa Psytrance' },
      { name: 'Techno_Rumble_132BPM.aamc', updatedAt: new Date().toISOString(), genre: 'Techno' },
    ];
  }

  /**
   * Add a project to recent projects list
   */
  public addRecentProject(name: string, filePath?: string, genre: GenreType = 'Psytrance') {
    const list = this.getRecentProjects().filter((p) => p.name !== name && p.path !== filePath);
    list.unshift({
      name,
      path: filePath,
      updatedAt: new Date().toISOString(),
      genre,
    });
    // Keep top 10
    const trimmed = list.slice(0, 10);
    try {
      localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(trimmed));
    } catch (e) {
      debugLog.warn('Failed to save recent projects:', e);
    }
  }

  /**
   * Save active project
   */
  public async saveProject(project: AAMCProject, existingPath?: string): Promise<{ success: boolean; filePath?: string }> {
    project.updatedAt = new Date().toISOString();
    const res = await desktopService.saveProject(project, existingPath);
    if (res.success) {
      this.addRecentProject(project.name, res.filePath, project.genre);
    }
    return res;
  }

  /**
   * Load project from disk/file
   */
  public async loadProject(): Promise<{ project: AAMCProject; filePath: string } | null> {
    const res = await desktopService.loadProject();
    if (res) {
      let p: any = res.project;
      // Graceful migration
      if (!p.format || p.format !== 'AAMC' || typeof p.version === 'string') {
        p.format = 'AAMC';
        p.version = 1;
        p.bpm = p.bpm || 142;
        p.genre = p.genre || 'Psytrance';
        p.key = p.key || 'F#';
        p.scale = p.scale || 'Minor';
      }
      this.addRecentProject(p.name, res.filePath, p.genre);
      return { project: p as AAMCProject, filePath: res.filePath };
    }
    return res;
  }
}

export const projectService = new ProjectService();
