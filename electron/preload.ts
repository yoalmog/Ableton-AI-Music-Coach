import { contextBridge, ipcRenderer } from 'electron';

// Expose safe desktop abstraction layer to the renderer process
const apiBridge = {
  isDesktop: () => true,
  getPlatform: () => ipcRenderer.invoke('desktop:get-platform'),
  getAppVersion: () => ipcRenderer.invoke('desktop:get-version'),
  getUserDataPath: () => ipcRenderer.invoke('desktop:get-user-data-path'),
  
  // Dialogs and File operations
  openFileDialog: (options?: any) => ipcRenderer.invoke('desktop:open-file-dialog', options),
  saveFileDialog: (options?: any) => ipcRenderer.invoke('desktop:save-file-dialog', options),
  chooseFolder: () => ipcRenderer.invoke('desktop:choose-folder'),
  
  // Project (.aamc) handling
  saveProjectFile: (filePath: string, dataStr: string) => ipcRenderer.invoke('desktop:save-project-file', { filePath, dataStr }),
  loadProjectFile: (filePath: string) => ipcRenderer.invoke('desktop:load-project-file', filePath),
  
  // MIDI export
  exportMidiFile: (fileName: string, binaryBuffer: ArrayBuffer) => ipcRenderer.invoke('desktop:export-midi-file', { fileName, binaryBuffer }),
  
  // System shell
  openExternalUrl: (url: string) => ipcRenderer.invoke('desktop:open-external', url),

  // Splash & Initialization lifecycle
  appReady: () => ipcRenderer.send('desktop:app-ready'),
  reportProgress: (msg: string, percent: number) => ipcRenderer.send('desktop:report-progress', { msg, percent }),

  // AI Pipeline Desktop Bridge
  ai: {
    getSettings: () => ipcRenderer.invoke('ai:get-settings'),
    saveSettings: (settings: any) => ipcRenderer.invoke('ai:save-settings', settings),
    testConnection: (params?: any) => ipcRenderer.invoke('ai:test-connection', params),
    chat: (data: { message: string; history?: any[]; context?: any }) => ipcRenderer.invoke('ai:chat', data),
    generatePattern: (params: any) => ipcRenderer.invoke('ai:generate-pattern', params),
    analyzeTrack: (params: any) => ipcRenderer.invoke('ai:analyze-track', params),
    getDiagnostics: () => ipcRenderer.invoke('ai:get-diagnostics'),
  },

  // Ollama One-Click Native Bridge
  ollama: {
    checkStatus: () => ipcRenderer.invoke('ollama:check-status'),
    startService: () => ipcRenderer.invoke('ollama:start-service'),
    restartService: () => ipcRenderer.invoke('ollama:restart-service'),
    getModels: () => ipcRenderer.invoke('ollama:get-models'),
    pullModel: (modelName: string) => ipcRenderer.invoke('ollama:pull-model', { modelName }),
    cancelPull: () => ipcRenderer.invoke('ollama:cancel-pull'),
    testModel: (modelName?: string) => ipcRenderer.invoke('ollama:test-model', { modelName }),
    getHardwareInfo: () => ipcRenderer.invoke('ollama:get-hardware-info'),
    openDownload: () => ipcRenderer.invoke('ollama:open-download'),
    onPullProgress: (callback: (data: any) => void) => {
      const listener = (_event: any, data: any) => callback(data);
      ipcRenderer.on('ollama:pull-progress', listener);
      return () => {
        ipcRenderer.removeListener('ollama:pull-progress', listener);
      };
    },
  },
};

contextBridge.exposeInMainWorld('desktopAPI', apiBridge);
contextBridge.exposeInMainWorld('electronAPI', apiBridge);

