import { AAMCProject, GenreType, KeyType, ScaleType } from '../types';
import { desktopService } from './desktopService';
import { debugLog } from '../utils/debug';

const RECENT_PROJECTS_KEY = 'aamc_recent_projects';

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
    return {
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
