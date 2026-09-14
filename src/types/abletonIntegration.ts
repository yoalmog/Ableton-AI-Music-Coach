export type AbletonConnectionStatus =
  | 'DISCONNECTED'
  | 'DETECTING'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'ERROR'
  | 'UNSUPPORTED';

export interface AbletonLiveProcessInfo {
  detected: boolean;
  running: boolean;
  version: string;
  installPath?: string;
  pid?: number;
  isLive12: boolean;
  platform: string;
  lastChecked: number;
}

export interface AbletonLinkState {
  enabled: boolean;
  isConnected: boolean;
  peers: number;
  bpm: number;
  beat: number;
  phase: number;
  quantum: number;
  isPlaying: boolean;
  startStopSync: boolean;
  latencyMs: number;
}

export interface MidiDevice {
  id: string;
  name: string;
  manufacturer?: string;
  state: 'connected' | 'disconnected';
  type: 'input' | 'output';
  isVirtual?: boolean;
}

export type MidiMessageType =
  | 'NOTE_ON'
  | 'NOTE_OFF'
  | 'CONTROL_CHANGE'
  | 'PITCH_BEND'
  | 'AFTERTOUCH'
  | 'PROGRAM_CHANGE'
  | 'CLOCK'
  | 'START'
  | 'STOP'
  | 'CONTINUE'
  | 'SYSTEM_EXCLUSIVE';

export interface MidiMonitorMessage {
  id: string;
  timestamp: number;
  timeFormatted: string;
  type: MidiMessageType;
  channel: number;
  noteName?: string;
  noteNumber?: number;
  velocity?: number;
  ccNumber?: number;
  ccValue?: number;
  pitchBend?: number;
  program?: number;
  rawData: number[];
  source: string;
}

export interface MidiControllerMapping {
  id: string;
  name: string;
  channel: number; // 1-16 (0 = any)
  cc: number; // 0-127
  target:
    | 'master_volume'
    | 'tempo'
    | 'filter_cutoff'
    | 'filter_resonance'
    | 'delay_send'
    | 'reverb_send'
    | 'track_volume'
    | 'track_pan'
    | 'track_mute'
    | 'track_solo'
    | 'custom_ableton_param';
  trackIndex?: number;
  paramName?: string;
  minVal: number;
  maxVal: number;
  currentVal: number;
  inverted?: boolean;
}

export interface AbletonTrackRouting {
  id: string;
  localTrackId: string;
  localTrackName: string;
  abletonTrackIndex: number;
  abletonTrackName: string;
  midiChannel: number; // 1-16
  midiOutputId: string;
  velocityOffset: number; // -64 to +64
  transposeSemitones: number; // -36 to +36
  octaveOffset: number; // -3 to +3
  enabled: boolean;
}

export interface MaxForLiveBridgeState {
  connected: boolean;
  host: string;
  port: number;
  sessionToken: string;
  latencyMs: number;
  lastHeartbeat: number;
  liveVersion: string;
  deviceVersion: string;
  tracksCount: number;
  authenticated: boolean;
  statusMessage?: string;
}

export interface AbletonClipSlot {
  index: number;
  hasClip: boolean;
  isPlaying: boolean;
  isQueued: boolean;
  name?: string;
  color?: string;
  length?: number;
}

export interface AbletonDeviceParam {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  displayValue?: string;
}

export interface AbletonLiveTrackInfo {
  index: number;
  id: string;
  name: string;
  color: string;
  volume: number; // 0.0 to 1.0
  pan: number; // -1.0 to 1.0
  muted: boolean;
  soloed: boolean;
  armed: boolean;
  clipSlots: AbletonClipSlot[];
  devices: Array<{
    index: number;
    name: string;
    type: string;
    parameters: AbletonDeviceParam[];
  }>;
}

export interface AbletonTransportState {
  isPlaying: boolean;
  isRecording: boolean;
  isPaused: boolean;
  bpm: number;
  beat: number;
  bar: number;
  songPositionSeconds: number;
  timeSignature: string;
  loop: boolean;
  metronome: boolean;
  source: 'local' | 'ableton' | 'link';
  lastUpdated: number;
}

export interface AbletonProjectConfig {
  enabled: boolean;
  linkEnabled: boolean;
  midiInput: string;
  midiOutput: string;
  transportSync: boolean;
  tempoSync: boolean;
  maxForLiveEnabled: boolean;
  mappings: MidiControllerMapping[];
  routing: AbletonTrackRouting[];
  lastConnectedTime?: string;
}

export interface AbletonIntegrationFullState {
  status: AbletonConnectionStatus;
  statusMessage: string;
  liveProcess: AbletonLiveProcessInfo;
  transport: AbletonTransportState;
  link: AbletonLinkState;
  bridge: MaxForLiveBridgeState;
  selectedMidiInput: string;
  selectedMidiOutput: string;
  availableMidiInputs: MidiDevice[];
  availableMidiOutputs: MidiDevice[];
  recentMidiMessages: MidiMonitorMessage[];
  mappings: MidiControllerMapping[];
  routing: AbletonTrackRouting[];
  tracks: AbletonLiveTrackInfo[];
  selectedTrackIndex: number;
  lastConnectionTimestamp: number | null;
  latencyMs: number;
  isMidiLearnActive: boolean;
  midiLearnTargetId: string | null;
  autoReconnect: boolean;
}
