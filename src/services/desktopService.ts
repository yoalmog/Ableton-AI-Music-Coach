import { AAMCProject } from '../types';
import { debugLog } from '../utils/debug';

declare global {
  interface Window {
    desktopAPI?: {
      isDesktop: () => boolean;
      getPlatform: () => Promise<string>;
      getAppVersion: () => Promise<string>;
      getUserDataPath: () => Promise<string>;
      openFileDialog: (options?: any) => Promise<{ filePath: string; content: string } | null>;
      saveFileDialog: (options?: any) => Promise<string | null>;
      chooseFolder: () => Promise<string | null>;
      saveProjectFile: (filePath: string, dataStr: string) => Promise<{ success: boolean; filePath: string }>;
      loadProjectFile: (filePath: string) => Promise<string>;
      exportMidiFile: (fileName: string, binaryBuffer: ArrayBuffer) => Promise<{ success: boolean; filePath: string } | null>;
      openExternalUrl: (url: string) => Promise<void>;
      appReady?: () => void;
      reportProgress?: (msg: string, percent: number) => void;
      ai?: {
        getSettings: () => Promise<any>;
        saveSettings: (settings: any) => Promise<{ success: boolean; maskedKey?: string }>;
        testConnection: (params?: any) => Promise<{ ok: boolean; statusMessage: string; modelUsed?: string }>;
        chat: (data: { message: string; history?: any[]; context?: any }) => Promise<{ reply: string; offline?: boolean; modelUsed?: string }>;
        generatePattern: (params: any) => Promise<{ pattern: any; offline?: boolean }>;
        analyzeTrack: (params: any) => Promise<{ analysis: any; offline?: boolean }>;
      };
    };
  }
}

export class DesktopService {
  /**
   * Returns true if running inside the Electron Desktop Shell
   */
  public isDesktop(): boolean {
    return Boolean(window.desktopAPI && window.desktopAPI.isDesktop());
  }

  /**
   * Get application platform
   */
  public async getPlatform(): Promise<string> {
    if (this.isDesktop() && window.desktopAPI) {
      return await window.desktopAPI.getPlatform();
    }
    return 'web';
  }

  /**
   * Get current application version
   */
  public async getAppVersion(): Promise<string> {
    if (this.isDesktop() && window.desktopAPI) {
      return await window.desktopAPI.getAppVersion();
    }
    return '1.0.0 (Web)';
  }

  /**
   * Get user data storage directory path
   */
  public async getUserDataPath(): Promise<string> {
    if (this.isDesktop() && window.desktopAPI) {
      return await window.desktopAPI.getUserDataPath();
    }
    return 'Browser Local Storage';
  }

  /**
   * Save .aamc project file (Native dialog in Electron, Download in Web)
   */
  public async saveProject(project: AAMCProject, existingFilePath?: string): Promise<{ success: boolean; filePath?: string }> {
    const jsonStr = JSON.stringify(project, null, 2);

    if (this.isDesktop() && window.desktopAPI) {
      let targetPath = existingFilePath;
      if (!targetPath) {
        const dialogPath = await window.desktopAPI.saveFileDialog({
          title: 'Save Ableton AI Music Coach Project',
          defaultPath: `${project.name.replace(/\s+/g, '_')}.aamc`,
          filters: [{ name: 'Ableton AI Music Coach Project (*.aamc)', extensions: ['aamc'] }],
        });
        if (!dialogPath) return { success: false };
        targetPath = dialogPath;
      }

      await window.desktopAPI.saveProjectFile(targetPath, jsonStr);
      return { success: true, filePath: targetPath };
    } else {
      // Browser Web Fallback: Trigger Blob Download
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/\s+/g, '_')}.aamc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true, filePath: 'browser-download' };
    }
  }

  /**
   * Open .aamc project file
   */
  public async loadProject(): Promise<{ project: AAMCProject; filePath: string } | null> {
    if (this.isDesktop() && window.desktopAPI) {
      const res = await window.desktopAPI.openFileDialog({
        title: 'Open .aamc Project',
        filters: [{ name: 'Ableton AI Music Coach Project (*.aamc)', extensions: ['aamc'] }],
      });
      if (!res) return null;
      try {
        const project = JSON.parse(res.content) as AAMCProject;
        return { project, filePath: res.filePath };
      } catch (err) {
        debugLog.error('Failed to parse .aamc file:', err);
        throw new Error('Invalid .aamc project file format');
      }
    } else {
      // Browser Fallback: HTML File Picker
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.aamc,application/json';
        input.onchange = (e: any) => {
          const file = e.target.files?.[0];
          if (!file) {
            resolve(null);
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const project = JSON.parse(event.target?.result as string) as AAMCProject;
              resolve({ project, filePath: file.name });
            } catch (err) {
              reject(new Error('Invalid .aamc project file format'));
            }
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        };
        input.click();
      });
    }
  }

  /**
   * Save MIDI Binary file (.mid)
   */
  public async exportMIDI(fileName: string, binaryBuffer: ArrayBuffer): Promise<boolean> {
    if (this.isDesktop() && window.desktopAPI) {
      const res = await window.desktopAPI.exportMidiFile(fileName, binaryBuffer);
      return Boolean(res && res.success);
    } else {
      // Browser Fallback: Blob Download
      const blob = new Blob([binaryBuffer], { type: 'audio/midi' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.endsWith('.mid') ? fileName : `${fileName}.mid`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    }
  }

  /**
   * Open external URL safely
   */
  public async openExternal(url: string): Promise<void> {
    if (this.isDesktop() && window.desktopAPI) {
      await window.desktopAPI.openExternalUrl(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}

export const desktopService = new DesktopService();
