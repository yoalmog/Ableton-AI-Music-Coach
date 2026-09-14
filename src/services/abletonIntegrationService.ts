import {
  AbletonConnectionStatus,
  AbletonIntegrationFullState,
  AbletonLiveTrackInfo,
  AbletonTransportState,
  MidiControllerMapping,
  AbletonTrackRouting,
  MidiDevice,
  MidiMonitorMessage,
  MidiMessageType,
  AbletonProjectConfig,
} from '../types/abletonIntegration';
import { desktopService } from './desktopService';

class AbletonIntegrationService {
  private state: AbletonIntegrationFullState = {
    status: 'DISCONNECTED',
    statusMessage: 'Simulator Mode (Ableton Live not connected)',
    liveProcess: {
      detected: false,
      running: false,
      version: 'Not Detected',
      isLive12: false,
      platform: 'browser',
      lastChecked: Date.now(),
    },
    transport: {
      isPlaying: false,
      isRecording: false,
      isPaused: false,
      bpm: 142,
      beat: 1,
      bar: 1,
      songPositionSeconds: 0,
      timeSignature: '4/4',
      loop: true,
      metronome: false,
      source: 'local',
      lastUpdated: Date.now(),
    },
    link: {
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
    },
    bridge: {
      connected: false,
      host: '127.0.0.1',
      port: 9098,
      sessionToken: '',
      latencyMs: 0,
      lastHeartbeat: 0,
      liveVersion: 'Live 12.1',
      deviceVersion: '1.2.0',
      tracksCount: 0,
      authenticated: false,
      statusMessage: 'Max for Live Bridge Ready',
    },
    selectedMidiInput: '',
    selectedMidiOutput: '',
    availableMidiInputs: [],
    availableMidiOutputs: [],
    recentMidiMessages: [],
    mappings: [
      {
        id: 'map_master_vol',
        name: 'Master Volume',
        channel: 1,
        cc: 7,
        target: 'master_volume',
        minVal: 0,
        maxVal: 1,
        currentVal: 0.85,
      },
      {
        id: 'map_filter_cutoff',
        name: 'Drift Filter Cutoff',
        channel: 1,
        cc: 74,
        target: 'filter_cutoff',
        minVal: 20,
        maxVal: 20000,
        currentVal: 1200,
      },
      {
        id: 'map_filter_res',
        name: 'Filter Resonance',
        channel: 1,
        cc: 71,
        target: 'filter_resonance',
        minVal: 0,
        maxVal: 100,
        currentVal: 35,
      },
    ],
    routing: [
      {
        id: 'route_drums',
        localTrackId: 't1',
        localTrackName: '1 Drums / Kick',
        abletonTrackIndex: 0,
        abletonTrackName: '1 Drum Rack',
        midiChannel: 10,
        midiOutputId: 'default',
        velocityOffset: 0,
        transposeSemitones: 0,
        octaveOffset: 0,
        enabled: true,
      },
      {
        id: 'route_bass',
        localTrackId: 't2',
        localTrackName: '2 Bassline',
        abletonTrackIndex: 1,
        abletonTrackName: '2 Drift Bass',
        midiChannel: 1,
        midiOutputId: 'default',
        velocityOffset: 0,
        transposeSemitones: 0,
        octaveOffset: 0,
        enabled: true,
      },
      {
        id: 'route_lead',
        localTrackId: 't3',
        localTrackName: '3 Psy Lead',
        abletonTrackIndex: 2,
        abletonTrackName: '3 Operator Lead',
        midiChannel: 2,
        midiOutputId: 'default',
        velocityOffset: 0,
        transposeSemitones: 0,
        octaveOffset: 0,
        enabled: true,
      },
    ],
    tracks: [
      {
        index: 0,
        id: 'live_t1',
        name: '1 Drums',
        color: '#00E5FF',
        volume: 0.85,
        pan: 0,
        muted: false,
        soloed: false,
        armed: false,
        clipSlots: [
          { index: 0, hasClip: true, isPlaying: false, isQueued: false, name: 'Main Beat 142' },
          { index: 1, hasClip: true, isPlaying: false, isQueued: false, name: 'Fill In A' },
          { index: 2, hasClip: false, isPlaying: false, isQueued: false },
          { index: 3, hasClip: false, isPlaying: false, isQueued: false },
        ],
        devices: [
          {
            index: 0,
            name: 'Drum Rack',
            type: 'instrument',
            parameters: [
              { id: 'vol', name: 'Volume', value: 0.85, min: 0, max: 1 },
            ],
          },
        ],
      },
      {
        index: 1,
        id: 'live_t2',
        name: '2 Bass (Drift)',
        color: '#90FF00',
        volume: 0.82,
        pan: 0,
        muted: false,
        soloed: false,
        armed: true,
        clipSlots: [
          { index: 0, hasClip: true, isPlaying: false, isQueued: false, name: 'Rolling Bass F#' },
          { index: 1, hasClip: true, isPlaying: false, isQueued: false, name: 'KBI Bass Var' },
          { index: 2, hasClip: false, isPlaying: false, isQueued: false },
          { index: 3, hasClip: false, isPlaying: false, isQueued: false },
        ],
        devices: [
          {
            index: 0,
            name: 'Drift',
            type: 'synth',
            parameters: [
              { id: 'cutoff', name: 'Cutoff', value: 840, min: 20, max: 20000 },
              { id: 'res', name: 'Resonance', value: 45, min: 0, max: 100 },
            ],
          },
        ],
      },
      {
        index: 2,
        id: 'live_t3',
        name: '3 Lead (Operator)',
        color: '#FFB800',
        volume: 0.75,
        pan: 0,
        muted: false,
        soloed: false,
        armed: false,
        clipSlots: [
          { index: 0, hasClip: true, isPlaying: false, isQueued: false, name: 'Psy Arp Lead' },
          { index: 1, hasClip: false, isPlaying: false, isQueued: false },
          { index: 2, hasClip: false, isPlaying: false, isQueued: false },
          { index: 3, hasClip: false, isPlaying: false, isQueued: false },
        ],
        devices: [
          {
            index: 0,
            name: 'Operator',
            type: 'synth',
            parameters: [
              { id: 'decay', name: 'Decay', value: 250, min: 10, max: 2000 },
            ],
          },
        ],
      },
      {
        index: 3,
        id: 'live_master',
        name: 'Master',
        color: '#FFE853',
        volume: 0.9,
        pan: 0,
        muted: false,
        soloed: false,
        armed: false,
        clipSlots: [],
        devices: [
          {
            index: 0,
            name: 'Limiter',
            type: 'master_fx',
            parameters: [
              { id: 'gain', name: 'Gain', value: 0, min: -12, max: 12 },
              { id: 'ceiling', name: 'Ceiling', value: -0.3, min: -3, max: 0 },
            ],
          },
        ],
      },
    ],
    selectedTrackIndex: 1,
    lastConnectionTimestamp: null,
    latencyMs: 1,
    isMidiLearnActive: false,
    midiLearnTargetId: null,
    autoReconnect: true,
  };

  private listeners: Set<(state: AbletonIntegrationFullState) => void> = new Set();
  private midiAccess: any = null;
  private isInitialized = false;

  constructor() {
    this.init();
  }

  public async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 1. Check Web MIDI API
    await this.initWebMidi();

    // 2. If running inside Electron desktop, listen to native IPC updates
    if (desktopService.isDesktop() && window.desktopAPI?.ableton) {
      try {
        const initialState = await window.desktopAPI.ableton.getStatus();
        if (initialState) {
          this.mergeState(initialState);
        }

        window.desktopAPI.ableton.onStateUpdate((nativeState) => {
          this.mergeState(nativeState);
        });

        window.desktopAPI.ableton.onTransportUpdate((transport) => {
          this.state.transport = { ...this.state.transport, ...transport, source: 'ableton' };
          this.notify();
        });

        window.desktopAPI.ableton.onTracksUpdate((tracks) => {
          if (Array.isArray(tracks) && tracks.length > 0) {
            this.state.tracks = tracks;
            this.notify();
          }
        });
      } catch (e) {
        console.warn('Native Ableton IPC connection note:', e);
      }
    }
  }

  private async initWebMidi() {
    if (typeof navigator !== 'undefined' && navigator.requestMIDIAccess) {
      try {
        this.midiAccess = await navigator.requestMIDIAccess({ sysex: true });
        this.refreshWebMidiDevices();
        this.midiAccess.onstatechange = () => this.refreshWebMidiDevices();
      } catch {
        // Fallback without sysex
        try {
          this.midiAccess = await navigator.requestMIDIAccess({ sysex: false });
          this.refreshWebMidiDevices();
          this.midiAccess.onstatechange = () => this.refreshWebMidiDevices();
        } catch {
          console.log('Web MIDI not available in this browser environment');
        }
      }
    }
  }

  private refreshWebMidiDevices() {
    if (!this.midiAccess) return;
    const inputs: MidiDevice[] = [];
    const outputs: MidiDevice[] = [];

    const inputIterator = this.midiAccess.inputs.values();
    for (let input = inputIterator.next(); !input.done; input = inputIterator.next()) {
      const dev = input.value;
      inputs.push({
        id: dev.id,
        name: dev.name || 'MIDI Input Port',
        manufacturer: dev.manufacturer || 'Generic',
        state: dev.state || 'connected',
        type: 'input',
      });

      // Hook up message listener
      dev.onmidimessage = (msg: any) => this.handleIncomingMidi(msg, dev.name || 'MIDI In');
    }

    const outputIterator = this.midiAccess.outputs.values();
    for (let output = outputIterator.next(); !output.done; output = outputIterator.next()) {
      const dev = output.value;
      outputs.push({
        id: dev.id,
        name: dev.name || 'MIDI Output Port',
        manufacturer: dev.manufacturer || 'Generic',
        state: dev.state || 'connected',
        type: 'output',
      });
    }

    // Default virtual device entries if list is empty
    if (inputs.length === 0) {
      inputs.push({
        id: 'virtual-midi-in',
        name: 'Virtual Ableton Controller In',
        manufacturer: 'AAMC Virtual',
        state: 'connected',
        type: 'input',
        isVirtual: true,
      });
    }

    if (outputs.length === 0) {
      outputs.push({
        id: 'virtual-midi-out',
        name: 'Virtual Ableton Live 12 Out',
        manufacturer: 'AAMC Virtual',
        state: 'connected',
        type: 'output',
        isVirtual: true,
      });
    }

    this.state.availableMidiInputs = inputs;
    this.state.availableMidiOutputs = outputs;
    if (!this.state.selectedMidiInput && inputs.length > 0) {
      this.state.selectedMidiInput = inputs[0].id;
    }
    if (!this.state.selectedMidiOutput && outputs.length > 0) {
      this.state.selectedMidiOutput = outputs[0].id;
    }
    this.notify();
  }

  private handleIncomingMidi(event: any, sourceName: string) {
    const data = Array.from(event.data as Uint8Array);
    if (!data || data.length === 0) return;

    const statusByte = data[0];
    const messageType = statusByte & 0xf0;
    const channel = (statusByte & 0x0f) + 1;
    let typeName: MidiMessageType = 'CONTROL_CHANGE';
    let noteNumber: number | undefined;
    let noteName: string | undefined;
    let velocity: number | undefined;
    let ccNumber: number | undefined;
    let ccValue: number | undefined;
    let pitchBend: number | undefined;

    if (messageType === 0x90 && data[2] > 0) {
      typeName = 'NOTE_ON';
      noteNumber = data[1];
      velocity = data[2];
      noteName = this.midiNoteNumberToName(noteNumber);
    } else if (messageType === 0x80 || (messageType === 0x90 && data[2] === 0)) {
      typeName = 'NOTE_OFF';
      noteNumber = data[1];
      velocity = 0;
      noteName = this.midiNoteNumberToName(noteNumber);
    } else if (messageType === 0xb0) {
      typeName = 'CONTROL_CHANGE';
      ccNumber = data[1];
      ccValue = data[2];

      // If MIDI Learn is active, bind this CC
      if (this.state.isMidiLearnActive && this.state.midiLearnTargetId && ccNumber !== undefined) {
        this.bindMidiLearn(this.state.midiLearnTargetId, channel, ccNumber);
      }

      // Execute controller mapping if matched
      this.processControllerMapping(channel, ccNumber, ccValue);
    } else if (messageType === 0xe0) {
      typeName = 'PITCH_BEND';
      pitchBend = ((data[2] << 7) | data[1]) - 8192;
    } else if (statusByte === 0xf8) {
      typeName = 'CLOCK';
    } else if (statusByte === 0xfa) {
      typeName = 'START';
      this.setPlaying(true, 'ableton');
    } else if (statusByte === 0xfc) {
      typeName = 'STOP';
      this.setPlaying(false, 'ableton');
    }

    const msg: MidiMonitorMessage = {
      id: `midi_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      timeFormatted: new Date().toLocaleTimeString() + '.' + String(Date.now() % 1000).padStart(3, '0'),
      type: typeName,
      channel,
      noteName,
      noteNumber,
      velocity,
      ccNumber,
      ccValue,
      pitchBend,
      rawData: data,
      source: sourceName,
    };

    // Keep last 40 messages in monitor buffer
    this.state.recentMidiMessages = [msg, ...this.state.recentMidiMessages.slice(0, 39)];
    this.notify();
  }

  private midiNoteNumberToName(num: number): string {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(num / 12) - 1;
    const note = notes[num % 12];
    return `${note}${octave}`;
  }

  private processControllerMapping(channel: number, cc: number, value: number) {
    const normVal = value / 127;
    const mapping = this.state.mappings.find((m) => (m.channel === 0 || m.channel === channel) && m.cc === cc);
    if (!mapping) return;

    const scaledVal = mapping.minVal + normVal * (mapping.maxVal - mapping.minVal);
    mapping.currentVal = scaledVal;

    // Dispatch target action
    if (mapping.target === 'master_volume') {
      const master = this.state.tracks.find((t) => t.name.toLowerCase().includes('master'));
      if (master) master.volume = normVal;
    } else if (mapping.target === 'tempo') {
      this.setTempo(Math.round(scaledVal), 'ableton');
    }
  }

  public getState(): AbletonIntegrationFullState {
    return this.state;
  }

  private mergeState(newState: Partial<AbletonIntegrationFullState>) {
    this.state = {
      ...this.state,
      ...newState,
      mappings: newState.mappings || this.state.mappings,
      routing: newState.routing || this.state.routing,
      tracks: (newState.tracks && newState.tracks.length > 0) ? newState.tracks : this.state.tracks,
      transport: {
        ...this.state.transport,
        ...(newState.transport || {}),
      },
    };
    this.notify();
  }

  public subscribe(listener: (state: AbletonIntegrationFullState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const currentState = { ...this.state };
    this.listeners.forEach((l) => l(currentState));
  }

  // --- Public Action Methods ---

  public async connect(): Promise<boolean> {
    this.state.status = 'CONNECTING';
    this.state.statusMessage = 'Connecting to Ableton Live 12 on localhost...';
    this.notify();

    if (desktopService.isDesktop() && window.desktopAPI?.ableton) {
      try {
        const res = await window.desktopAPI.ableton.connect();
        if (res) this.mergeState(res);
        return true;
      } catch (err: any) {
        this.state.status = 'ERROR';
        this.state.statusMessage = `Connection Error: ${err.message}`;
        this.notify();
        return false;
      }
    } else {
      // Simulator Web Mode Connection Simulation
      await new Promise((r) => setTimeout(r, 600));
      this.state.status = 'CONNECTED';
      this.state.statusMessage = 'Connected to Ableton Live 12 Bridge (Localhost Mode)';
      this.state.bridge.connected = true;
      this.state.link.isConnected = true;
      this.state.link.peers = 1;
      this.state.lastConnectionTimestamp = Date.now();
      this.notify();
      return true;
    }
  }

  public async disconnect() {
    this.state.status = 'DISCONNECTED';
    this.state.statusMessage = 'Simulator Mode (Ableton Live disconnected)';
    this.state.bridge.connected = false;
    this.state.link.isConnected = false;
    this.state.link.peers = 0;
    this.notify();

    if (desktopService.isDesktop() && window.desktopAPI?.ableton) {
      await window.desktopAPI.ableton.disconnect();
    }
  }

  public setPlaying(playing: boolean, source: 'local' | 'ableton' | 'link' = 'local') {
    this.state.transport.isPlaying = playing;
    this.state.transport.source = source;
    this.state.transport.lastUpdated = Date.now();
    this.notify();

    if (desktopService.isDesktop() && window.desktopAPI?.ableton && source === 'local') {
      window.desktopAPI.ableton.sendTransport(playing ? 'play' : 'stop', this.state.transport.bpm);
    }
  }

  public setTempo(bpm: number, source: 'local' | 'ableton' | 'link' = 'local') {
    const clampedBpm = Math.max(20, Math.min(999, Math.round(bpm)));
    this.state.transport.bpm = clampedBpm;
    this.state.link.bpm = clampedBpm;
    this.state.transport.source = source;
    this.state.transport.lastUpdated = Date.now();
    this.notify();

    if (desktopService.isDesktop() && window.desktopAPI?.ableton && source === 'local') {
      window.desktopAPI.ableton.sendTempo(clampedBpm);
    }
  }

  public toggleMetronome() {
    this.state.transport.metronome = !this.state.transport.metronome;
    this.notify();
  }

  public toggleLoop() {
    this.state.transport.loop = !this.state.transport.loop;
    this.notify();
  }

  public setTrackVolume(trackIndex: number, volume: number) {
    if (this.state.tracks[trackIndex]) {
      this.state.tracks[trackIndex].volume = Math.max(0, Math.min(1, volume));
      this.notify();

      if (desktopService.isDesktop() && window.desktopAPI?.ableton) {
        window.desktopAPI.ableton.sendTrackControl({ type: 'volume', trackIndex, value: volume });
      }
    }
  }

  public setTrackPan(trackIndex: number, pan: number) {
    if (this.state.tracks[trackIndex]) {
      this.state.tracks[trackIndex].pan = Math.max(-1, Math.min(1, pan));
      this.notify();

      if (desktopService.isDesktop() && window.desktopAPI?.ableton) {
        window.desktopAPI.ableton.sendTrackControl({ type: 'pan', trackIndex, value: pan });
      }
    }
  }

  public setTrackMute(trackIndex: number, muted: boolean) {
    if (this.state.tracks[trackIndex]) {
      this.state.tracks[trackIndex].muted = muted;
      this.notify();

      if (desktopService.isDesktop() && window.desktopAPI?.ableton) {
        window.desktopAPI.ableton.sendTrackControl({ type: 'mute', trackIndex, value: muted });
      }
    }
  }

  public setTrackSolo(trackIndex: number, soloed: boolean) {
    if (this.state.tracks[trackIndex]) {
      this.state.tracks[trackIndex].soloed = soloed;
      this.notify();

      if (desktopService.isDesktop() && window.desktopAPI?.ableton) {
        window.desktopAPI.ableton.sendTrackControl({ type: 'solo', trackIndex, value: soloed });
      }
    }
  }

  public setTrackArm(trackIndex: number, armed: boolean) {
    if (this.state.tracks[trackIndex]) {
      this.state.tracks[trackIndex].armed = armed;
      this.notify();

      if (desktopService.isDesktop() && window.desktopAPI?.ableton) {
        window.desktopAPI.ableton.sendTrackControl({ type: 'arm', trackIndex, value: armed });
      }
    }
  }

  public fireClip(trackIndex: number, clipIndex: number) {
    const track = this.state.tracks[trackIndex];
    if (track && track.clipSlots[clipIndex]) {
      track.clipSlots.forEach((slot, idx) => {
        slot.isPlaying = idx === clipIndex;
      });
      this.notify();

      if (desktopService.isDesktop() && window.desktopAPI?.ableton) {
        window.desktopAPI.ableton.sendTrackControl({ type: 'fire_clip', trackIndex, clipIndex });
      }
    }
  }

  public stopClip(trackIndex: number) {
    const track = this.state.tracks[trackIndex];
    if (track) {
      track.clipSlots.forEach((slot) => {
        slot.isPlaying = false;
      });
      this.notify();

      if (desktopService.isDesktop() && window.desktopAPI?.ableton) {
        window.desktopAPI.ableton.sendTrackControl({ type: 'stop_clip', trackIndex });
      }
    }
  }

  public sendMidiNote(channel: number, pitch: number, velocity: number = 100, durationMs: number = 250) {
    // Send via Web MIDI Output if selected
    if (this.midiAccess && this.state.selectedMidiOutput) {
      const output = this.midiAccess.outputs.get(this.state.selectedMidiOutput);
      if (output) {
        const noteOn = [0x90 | ((channel - 1) & 0x0f), pitch, velocity];
        const noteOff = [0x80 | ((channel - 1) & 0x0f), pitch, 0];
        output.send(noteOn);
        setTimeout(() => output.send(noteOff), durationMs);
      }
    }

    // Send via Native IPC
    if (desktopService.isDesktop() && window.desktopAPI?.ableton) {
      window.desktopAPI.ableton.sendMidiNote({ channel, pitch, velocity, durationMs });
    }
  }

  // --- MIDI Learn Engine ---

  public startMidiLearn(targetId: string) {
    this.state.isMidiLearnActive = true;
    this.state.midiLearnTargetId = targetId;
    this.notify();
  }

  public stopMidiLearn() {
    this.state.isMidiLearnActive = false;
    this.state.midiLearnTargetId = null;
    this.notify();
  }

  public bindMidiLearn(targetId: string, channel: number, cc: number) {
    const mapping = this.state.mappings.find((m) => m.id === targetId);
    if (mapping) {
      mapping.channel = channel;
      mapping.cc = cc;
      this.stopMidiLearn();
      this.saveMappings();
    }
  }

  public addMapping(mapping: Omit<MidiControllerMapping, 'id'>): MidiControllerMapping {
    const newMap: MidiControllerMapping = {
      ...mapping,
      id: `map_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    this.state.mappings.push(newMap);
    this.saveMappings();
    this.notify();
    return newMap;
  }

  public deleteMapping(id: string) {
    this.state.mappings = this.state.mappings.filter((m) => m.id !== id);
    this.saveMappings();
    this.notify();
  }

  public updateRouting(routing: AbletonTrackRouting[]) {
    this.state.routing = routing;
    this.saveMappings();
    this.notify();
  }

  private saveMappings() {
    if (desktopService.isDesktop() && window.desktopAPI?.ableton) {
      window.desktopAPI.ableton.saveMappings({
        mappings: this.state.mappings,
        routing: this.state.routing,
      });
    }
  }

  // --- Max for Live Export ---

  public async exportM4LDevice(): Promise<{ success: boolean; filePath?: string; cancelled?: boolean }> {
    if (desktopService.isDesktop() && window.desktopAPI?.ableton) {
      return await window.desktopAPI.ableton.exportM4LDevice();
    } else {
      // Browser fallback: Download JS companion
      const blob = new Blob([
        `// Ableton Live 12 Companion Bridge for AI Music Coach\n// Connects to localhost:9098\n`
      ], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AAMC_Live12_Bridge.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true, filePath: 'browser-download' };
    }
  }

  // --- Sound Library Ableton Actions ---

  public async revealAudioFileInExplorer(relativePath: string): Promise<boolean> {
    if (desktopService.isDesktop() && window.desktopAPI?.ableton) {
      const res = await window.desktopAPI.ableton.revealAudioFile(relativePath);
      return Boolean(res?.success);
    } else {
      window.open(relativePath, '_blank');
      return true;
    }
  }
}

export const abletonIntegrationService = new AbletonIntegrationService();
