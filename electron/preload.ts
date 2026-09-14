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
  
  // Screen & Window Capturing for Visual Ableton Coach
  getScreenSources: () => ipcRenderer.invoke('desktop:get-screen-sources'),

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

  // Ableton Live 12 Dedicated Integration Bridge
  ableton: {
    getStatus: () => ipcRenderer.invoke('ableton:get-status'),
    scanProcesses: () => ipcRenderer.invoke('ableton:scan-processes'),
    connect: () => ipcRenderer.invoke('ableton:connect'),
    disconnect: () => ipcRenderer.invoke('ableton:disconnect'),
    sendTransport: (action: 'play' | 'stop', bpm?: number) => ipcRenderer.invoke('ableton:send-transport', { action, bpm }),
    sendTempo: (bpm: number) => ipcRenderer.invoke('ableton:send-tempo', { bpm }),
    sendTrackControl: (params: any) => ipcRenderer.invoke('ableton:send-track-control', params),
    sendMidiNote: (params: { channel: number; pitch: number; velocity: number; durationMs: number }) =>
      ipcRenderer.invoke('ableton:send-midi-note', params),
    exportM4LDevice: () => ipcRenderer.invoke('ableton:export-m4l-device'),
    revealAudioFile: (relativePath: string) => ipcRenderer.invoke('ableton:reveal-audio-file', { relativePath }),
    saveMappings: (params: { mappings?: any[]; routing?: any[] }) => ipcRenderer.invoke('ableton:save-mappings', params),
    
    // Event listeners
    onStateUpdate: (callback: (state: any) => void) => {
      const listener = (_event: any, state: any) => callback(state);
      ipcRenderer.on('ableton:state-update', listener);
      return () => {
        ipcRenderer.removeListener('ableton:state-update', listener);
      };
    },
    onTransportUpdate: (callback: (transport: any) => void) => {
      const listener = (_event: any, transport: any) => callback(transport);
      ipcRenderer.on('ableton:transport-update', listener);
      return () => {
        ipcRenderer.removeListener('ableton:transport-update', listener);
      };
    },
    onTracksUpdate: (callback: (tracks: any[]) => void) => {
      const listener = (_event: any, tracks: any[]) => callback(tracks);
      ipcRenderer.on('ableton:tracks-update', listener);
      return () => {
        ipcRenderer.removeListener('ableton:tracks-update', listener);
      };
    },
    onMenuAction: (callback: (action: string, payload?: any) => void) => {
      const channels = [
        'menu:new-project',
        'menu:open-project',
        'menu:save-project',
        'menu:save-project-as',
        'menu:export-midi',
        'menu:open-ableton-panel',
        'menu:export-m4l',
        'menu:toggle-link',
        'menu:toggle-midi-learn',
        'menu:navigate',
        'menu:open-ableton-help',
        'menu:open-coach',
      ];
      const listeners = channels.map((ch) => {
        const handler = (_event: any, payload: any) => callback(ch, payload);
        ipcRenderer.on(ch, handler);
        return { ch, handler };
      });
      return () => {
        listeners.forEach(({ ch, handler }) => ipcRenderer.removeListener(ch, handler));
      };
    },
  },
};

contextBridge.exposeInMainWorld('desktopAPI', apiBridge);
contextBridge.exposeInMainWorld('electronAPI', apiBridge);

