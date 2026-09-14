import { ipcMain, dialog, shell, BrowserWindow, Menu } from 'electron';
import path from 'path';
import fs from 'fs';
import { AbletonLiveDetector } from './AbletonLiveDetector';
import { MaxForLiveBridgeServer } from './MaxForLiveBridgeServer';
import { M4LDeviceGenerator } from './M4LDeviceGenerator';
import {
  AbletonConnectionStatus,
  AbletonIntegrationFullState,
  AbletonLinkState,
  MidiDevice,
  AbletonTrackRouting,
  MidiControllerMapping,
} from '../../src/types/abletonIntegration';

export class AbletonIntegrationMain {
  private detector: AbletonLiveDetector;
  private bridgeServer: MaxForLiveBridgeServer;
  private mainWindow: BrowserWindow | null = null;
  private status: AbletonConnectionStatus = 'DISCONNECTED';
  private autoReconnect: boolean = true;
  private scanTimer: NodeJS.Timeout | null = null;

  // Link state
  private linkState: AbletonLinkState = {
    enabled: true,
    isConnected: false,
    peers: 0,
    bpm: 142,
    beat: 1,
    phase: 0,
    quantum: 4,
    isPlaying: false,
    startStopSync: true,
    latencyMs: 1,
  };

  private selectedMidiInput: string = 'Virtual MIDI In';
  private selectedMidiOutput: string = 'Virtual MIDI Out';
  private mappings: MidiControllerMapping[] = [];
  private routing: AbletonTrackRouting[] = [];

  constructor() {
    this.detector = new AbletonLiveDetector();
    this.bridgeServer = new MaxForLiveBridgeServer(9098);
  }

  public async init(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;

    // Start Bridge Server
    await this.bridgeServer.start();

    // Setup Bridge Event Listeners
    this.bridgeServer.on('connection-change', ({ connected }) => {
      this.status = connected ? 'CONNECTED' : 'DISCONNECTED';
      this.notifyRenderer();
    });

    this.bridgeServer.on('transport-change', (transport) => {
      this.linkState.bpm = transport.bpm;
      this.linkState.isPlaying = transport.isPlaying;
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send('ableton:transport-update', transport);
      }
      this.notifyRenderer();
    });

    this.bridgeServer.on('tracks-update', (tracks) => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send('ableton:tracks-update', tracks);
      }
      this.notifyRenderer();
    });

    // Start background process scanner (every 4 seconds)
    this.startPeriodicScan();

    // Register all IPC handlers
    this.registerIpcHandlers();

    // Build Native Windows Menus
    this.setupNativeApplicationMenu();
  }

  private startPeriodicScan() {
    if (this.scanTimer) clearInterval(this.scanTimer);
    this.scanTimer = setInterval(async () => {
      const info = await this.detector.scan();
      if (info.running && this.status === 'DISCONNECTED') {
        this.status = this.bridgeServer.getState().connected ? 'CONNECTED' : 'DETECTING';
      }
      this.notifyRenderer();
    }, 4000);
  }

  public getFullState(): AbletonIntegrationFullState {
    const processInfo = this.detector.getCachedInfo();
    const bridgeState = this.bridgeServer.getState();
    const transport = this.bridgeServer.getTransport();
    const tracks = this.bridgeServer.getTracks();

    let computedStatus: AbletonConnectionStatus = this.status;
    let statusMessage = 'Simulator Mode (Ableton Live disconnected)';

    if (bridgeState.connected) {
      computedStatus = 'CONNECTED';
      statusMessage = `Connected to Ableton Live 12 (${bridgeState.latencyMs}ms)`;
    } else if (processInfo.running) {
      computedStatus = 'DETECTING';
      statusMessage = `Ableton Live 12 process detected (${processInfo.version}). Ready for Link/Bridge sync.`;
    } else if (processInfo.detected) {
      statusMessage = 'Ableton Live 12 is installed. Launch Ableton to link.';
    }

    const availableInputs: MidiDevice[] = [
      { id: 'web-midi-default', name: 'Virtual DAW Controller', manufacturer: 'AAMC Native', state: 'connected', type: 'input' },
      { id: 'ableton-live-midi-in', name: 'Ableton Live 12 MIDI In', manufacturer: 'Ableton', state: 'connected', type: 'input', isVirtual: true },
      { id: 'loopmidi-in-1', name: 'loopMIDI Port 1', manufacturer: 'Tobias Erichsen', state: 'connected', type: 'input' },
    ];

    const availableOutputs: MidiDevice[] = [
      { id: 'web-midi-out-default', name: 'Virtual DAW Synth Out', manufacturer: 'AAMC Native', state: 'connected', type: 'output' },
      { id: 'ableton-live-midi-out', name: 'Ableton Live 12 MIDI Out', manufacturer: 'Ableton', state: 'connected', type: 'output', isVirtual: true },
      { id: 'loopmidi-out-1', name: 'loopMIDI Port 1', manufacturer: 'Tobias Erichsen', state: 'connected', type: 'output' },
    ];

    return {
      status: computedStatus,
      statusMessage,
      liveProcess: processInfo,
      transport,
      link: {
        ...this.linkState,
        peers: processInfo.running || bridgeState.connected ? 1 : 0,
        isConnected: processInfo.running || bridgeState.connected,
      },
      bridge: bridgeState,
      selectedMidiInput: this.selectedMidiInput,
      selectedMidiOutput: this.selectedMidiOutput,
      availableMidiInputs: availableInputs,
      availableMidiOutputs: availableOutputs,
      recentMidiMessages: [],
      mappings: this.mappings,
      routing: this.routing,
      tracks,
      selectedTrackIndex: 0,
      lastConnectionTimestamp: bridgeState.lastHeartbeat || null,
      latencyMs: bridgeState.latencyMs,
      isMidiLearnActive: false,
      midiLearnTargetId: null,
      autoReconnect: this.autoReconnect,
    };
  }

  private notifyRenderer() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('ableton:state-update', this.getFullState());
    }
  }

  private registerIpcHandlers() {
    // 1. Get current connection & process state
    ipcMain.handle('ableton:get-status', async () => {
      await this.detector.scan();
      return this.getFullState();
    });

    // 2. Scan processes immediately
    ipcMain.handle('ableton:scan-processes', async () => {
      const info = await this.detector.scan();
      return info;
    });

    // 3. Connect / Reconnect
    ipcMain.handle('ableton:connect', async () => {
      this.status = 'CONNECTING';
      this.notifyRenderer();
      await this.detector.scan();
      await this.bridgeServer.start();
      setTimeout(() => {
        this.status = this.bridgeServer.getState().connected ? 'CONNECTED' : 'DISCONNECTED';
        this.notifyRenderer();
      }, 500);
      return this.getFullState();
    });

    // 4. Disconnect
    ipcMain.handle('ableton:disconnect', async () => {
      this.status = 'DISCONNECTED';
      this.notifyRenderer();
      return this.getFullState();
    });

    // 5. Send Transport commands
    ipcMain.handle('ableton:send-transport', async (_event, { action, bpm }) => {
      if (action === 'play') {
        this.bridgeServer.sendTransportPlay(bpm);
        this.linkState.isPlaying = true;
      } else if (action === 'stop') {
        this.bridgeServer.sendTransportStop();
        this.linkState.isPlaying = false;
      }
      return { success: true };
    });

    // 6. Send Tempo / BPM
    ipcMain.handle('ableton:send-tempo', async (_event, { bpm }) => {
      this.linkState.bpm = bpm;
      this.bridgeServer.sendTempo(bpm);
      return { success: true, bpm };
    });

    // 7. Track controls (Volume, Pan, Mute, Solo, Arm, Clip)
    ipcMain.handle('ableton:send-track-control', async (_event, params) => {
      const { type, trackIndex, value, clipIndex, deviceIndex, paramId } = params;
      switch (type) {
        case 'volume':
          this.bridgeServer.sendTrackVolume(trackIndex, value);
          break;
        case 'pan':
          this.bridgeServer.sendTrackPan(trackIndex, value);
          break;
        case 'mute':
          this.bridgeServer.sendTrackMute(trackIndex, Boolean(value));
          break;
        case 'solo':
          this.bridgeServer.sendTrackSolo(trackIndex, Boolean(value));
          break;
        case 'arm':
          this.bridgeServer.sendTrackArm(trackIndex, Boolean(value));
          break;
        case 'fire_clip':
          this.bridgeServer.sendFireClip(trackIndex, clipIndex);
          break;
        case 'stop_clip':
          this.bridgeServer.sendStopClip(trackIndex);
          break;
        case 'device_param':
          this.bridgeServer.sendDeviceParam(trackIndex, deviceIndex, paramId, value);
          break;
      }
      return { success: true };
    });

    // 8. Forward MIDI Note to Ableton Track
    ipcMain.handle('ableton:send-midi-note', async (_event, { channel, pitch, velocity, durationMs }) => {
      this.bridgeServer.sendMidiNote(channel || 1, pitch || 60, velocity || 100, durationMs || 250);
      return { success: true };
    });

    // 9. Export Max for Live device package
    ipcMain.handle('ableton:export-m4l-device', async () => {
      if (!this.mainWindow) return { success: false };
      const defaultDir = path.join(
        process.env.USERPROFILE || process.env.HOME || '',
        'Documents',
        'Ableton',
        'User Library',
        'Presets',
        'MIDI Effects',
        'Max MIDI Effect'
      );

      const res = await dialog.showOpenDialog(this.mainWindow, {
        title: 'Select Destination Folder for Ableton Live 12 Companion Device',
        defaultPath: fs.existsSync(defaultDir) ? defaultDir : undefined,
        properties: ['openDirectory', 'createDirectory'],
      });

      if (res.canceled || res.filePaths.length === 0) {
        return { success: false, cancelled: true };
      }

      const targetPath = res.filePaths[0];
      const result = M4LDeviceGenerator.exportDevicePackage(targetPath);
      if (result.success) {
        shell.showItemInFolder(path.join(targetPath, 'AAMC_Live12_Bridge.js'));
      }
      return result;
    });

    // 10. Sound Library -> Reveal / Send to Ableton
    ipcMain.handle('ableton:reveal-audio-file', async (_event, { relativePath }) => {
      try {
        const fullPath = path.join(process.cwd(), relativePath.startsWith('/') ? relativePath.slice(1) : relativePath);
        if (fs.existsSync(fullPath)) {
          shell.showItemInFolder(fullPath);
          return { success: true, path: fullPath };
        }
        return { success: false, error: 'File not found on disk' };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    });

    // 11. Save / Update Mappings & Routing
    ipcMain.handle('ableton:save-mappings', async (_event, { mappings, routing }) => {
      if (mappings) this.mappings = mappings;
      if (routing) this.routing = routing;
      return { success: true };
    });
  }

  /**
   * Setup native Windows menu bar with Ableton integration shortcuts
   */
  public setupNativeApplicationMenu() {
    const isMac = process.platform === 'darwin';

    const template: any[] = [
      ...(isMac ? [{ role: 'appMenu' }] : []),
      {
        label: 'File',
        submenu: [
          {
            label: 'New Project',
            accelerator: 'CmdOrCtrl+N',
            click: () => this.sendToRenderer('menu:new-project'),
          },
          {
            label: 'Open Project...',
            accelerator: 'CmdOrCtrl+O',
            click: () => this.sendToRenderer('menu:open-project'),
          },
          {
            label: 'Save Project',
            accelerator: 'CmdOrCtrl+S',
            click: () => this.sendToRenderer('menu:save-project'),
          },
          {
            label: 'Save Project As...',
            accelerator: 'CmdOrCtrl+Shift+S',
            click: () => this.sendToRenderer('menu:save-project-as'),
          },
          { type: 'separator' },
          {
            label: 'Export MIDI to Ableton Live...',
            accelerator: 'CmdOrCtrl+Shift+E',
            click: () => this.sendToRenderer('menu:export-midi'),
          },
          { type: 'separator' },
          isMac ? { role: 'close' } : { role: 'quit' },
        ],
      },
      {
        label: 'Ableton Live',
        submenu: [
          {
            label: 'Ableton Connection Manager...',
            accelerator: 'CmdOrCtrl+Shift+A',
            click: () => this.sendToRenderer('menu:open-ableton-panel'),
          },
          {
            label: 'Rescan Ableton Live 12 Processes',
            accelerator: 'F5',
            click: async () => {
              await this.detector.scan();
              this.notifyRenderer();
            },
          },
          { type: 'separator' },
          {
            label: 'Export Max for Live Bridge Device...',
            click: () => this.sendToRenderer('menu:export-m4l'),
          },
          {
            label: 'Toggle Ableton Link Sync',
            accelerator: 'CmdOrCtrl+L',
            click: () => this.sendToRenderer('menu:toggle-link'),
          },
          { type: 'separator' },
          {
            label: 'MIDI Learn Mode',
            accelerator: 'CmdOrCtrl+M',
            click: () => this.sendToRenderer('menu:toggle-midi-learn'),
          },
        ],
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Dashboard',
            accelerator: 'CmdOrCtrl+1',
            click: () => this.sendToRenderer('menu:navigate', 'dashboard'),
          },
          {
            label: 'Ableton Live Simulator / DAW',
            accelerator: 'CmdOrCtrl+2',
            click: () => this.sendToRenderer('menu:navigate', 'simulator'),
          },
          {
            label: 'MIDI Pattern Generator',
            accelerator: 'CmdOrCtrl+3',
            click: () => this.sendToRenderer('menu:navigate', 'midi'),
          },
          {
            label: 'Drum Machine Sequencer',
            accelerator: 'CmdOrCtrl+4',
            click: () => this.sendToRenderer('menu:navigate', 'drums'),
          },
          {
            label: 'Bassline Generator',
            accelerator: 'CmdOrCtrl+5',
            click: () => this.sendToRenderer('menu:navigate', 'bass'),
          },
          {
            label: 'Sound Design Lab & Library',
            accelerator: 'CmdOrCtrl+6',
            click: () => this.sendToRenderer('menu:navigate', 'sounddesign'),
          },
          {
            label: 'Settings & Ableton Live Config',
            accelerator: 'CmdOrCtrl+7',
            click: () => this.sendToRenderer('menu:navigate', 'settings'),
          },
          { type: 'separator' },
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'togglefullscreen' },
        ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Ableton Live 12 Connection Guide',
            click: () => this.sendToRenderer('menu:open-ableton-help'),
          },
          {
            label: 'Ask AI Music Coach...',
            accelerator: 'CmdOrCtrl+K',
            click: () => this.sendToRenderer('menu:open-coach'),
          },
          { type: 'separator' },
          {
            label: 'Official Ableton Live 12 Manual',
            click: () => shell.openExternal('https://www.ableton.com/en/manual/live-concepts/'),
          },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private sendToRenderer(channel: string, data?: any) {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(channel, data);
    }
  }
}
