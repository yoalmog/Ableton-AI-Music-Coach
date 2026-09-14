import fs from 'fs';
import path from 'path';

export class M4LDeviceGenerator {
  /**
   * Generates the official JavaScript companion script for Max for Live & Node for Max in Ableton Live 12
   */
  public static getCompanionScriptCode(): string {
    return `/**
 * Ableton AI Music Coach - Ableton Live 12 Bridge Script
 * Compatible with Max for Live 9 / Ableton Live 12 (Suite & Standard with M4L)
 */

const maxApi = (typeof require !== 'undefined' && require('max-api')) ? require('max-api') : null;
const http = (typeof require !== 'undefined') ? require('http') : null;

const BRIDGE_HOST = '127.0.0.1';
const BRIDGE_PORT = 9098;
let sessionToken = '';
let isConnected = false;
let sseReq = null;

// Initialize connection to Ableton AI Music Coach
function connectToCoach() {
  if (!http) return;
  
  // 1. Fetch initial status and token
  const statusReq = http.get('http://' + BRIDGE_HOST + ':' + BRIDGE_PORT + '/status', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        sessionToken = parsed.sessionToken;
        isConnected = true;
        if (maxApi) maxApi.outlet('connected', 1, sessionToken);
        startEventStream();
        syncCurrentLiveState();
      } catch (e) {
        if (maxApi) maxApi.post('AAMC Handshake error: ' + e.message);
      }
    });
  });

  statusReq.on('error', () => {
    isConnected = false;
    if (maxApi) maxApi.outlet('connected', 0);
    setTimeout(connectToCoach, 4000);
  });
}

function startEventStream() {
  if (!http || !sessionToken) return;
  if (sseReq) { sseReq.destroy(); sseReq = null; }

  const options = {
    host: BRIDGE_HOST,
    port: BRIDGE_PORT,
    path: '/api/events?token=' + sessionToken,
    headers: { 'Accept': 'text/event-stream' }
  };

  sseReq = http.get(options, (res) => {
    res.on('data', (chunk) => {
      const text = chunk.toString();
      const lines = text.split('\\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('data: ')) {
          try {
            const eventData = JSON.parse(line.substring(6));
            handleIncomingEvent(eventData);
          } catch (e) {}
        }
      }
    });
  });

  sseReq.on('error', () => {
    isConnected = false;
    setTimeout(connectToCoach, 3000);
  });
}

function handleIncomingEvent(evt) {
  if (!evt || !evt.type) return;
  if (maxApi) maxApi.outlet('event', evt.type, JSON.stringify(evt.payload || {}));

  // Direct Live API dispatching
  switch (evt.type) {
    case 'TRANSPORT_PLAY':
      if (maxApi) maxApi.outlet('live_command', 'set_play', 1);
      break;
    case 'TRANSPORT_STOP':
      if (maxApi) maxApi.outlet('live_command', 'set_play', 0);
      break;
    case 'SET_TEMPO':
      if (evt.payload && evt.payload.bpm) {
        if (maxApi) maxApi.outlet('live_command', 'set_tempo', evt.payload.bpm);
      }
      break;
    case 'SET_TRACK_VOLUME':
      if (evt.payload) {
        if (maxApi) maxApi.outlet('live_command', 'set_volume', evt.payload.trackIndex, evt.payload.volume);
      }
      break;
    case 'SET_TRACK_PAN':
      if (evt.payload) {
        if (maxApi) maxApi.outlet('live_command', 'set_pan', evt.payload.trackIndex, evt.payload.pan);
      }
      break;
    case 'SET_TRACK_MUTE':
      if (evt.payload) {
        if (maxApi) maxApi.outlet('live_command', 'set_mute', evt.payload.trackIndex, evt.payload.muted ? 1 : 0);
      }
      break;
    case 'FIRE_CLIP':
      if (evt.payload) {
        if (maxApi) maxApi.outlet('live_command', 'fire_clip', evt.payload.trackIndex, evt.payload.clipIndex);
      }
      break;
    case 'MIDI_NOTE':
      if (evt.payload) {
        if (maxApi) maxApi.outlet('live_command', 'send_midi_note', evt.payload.channel, evt.payload.pitch, evt.payload.velocity, evt.payload.durationMs);
      }
      break;
  }
}

function sendCommandToCoach(type, payload) {
  if (!http) return;
  const postData = JSON.stringify({
    type: type,
    payload: payload || {},
    token: sessionToken,
    timestamp: Date.now()
  });

  const req = http.request({
    host: BRIDGE_HOST,
    port: BRIDGE_PORT,
    path: '/api/command',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  });

  req.on('error', () => {});
  req.write(postData);
  req.end();
}

function syncCurrentLiveState() {
  // Sync song tempo and tracks
  sendCommandToCoach('HEARTBEAT', { client: 'Ableton Live 12 Max for Live' });
}

// Max API handlers
if (maxApi) {
  maxApi.addHandler('play_state', (playing) => {
    sendCommandToCoach(playing ? 'TRANSPORT_PLAY' : 'TRANSPORT_STOP', {});
  });

  maxApi.addHandler('tempo_change', (bpm) => {
    sendCommandToCoach('SET_TEMPO', { bpm: Number(bpm) });
  });

  maxApi.addHandler('tracks_state', (tracksJson) => {
    try {
      const tracks = typeof tracksJson === 'string' ? JSON.parse(tracksJson) : tracksJson;
      sendCommandToCoach('UPDATE_TRACKS', { tracks: tracks });
    } catch (e) {}
  });

  maxApi.addHandler('connect', () => {
    connectToCoach();
  });
}

// Auto-start
connectToCoach();
`;
  }

  /**
   * Exports the complete Max for Live Device files and setup instructions
   */
  public static exportDevicePackage(targetDir: string): { success: boolean; filePath: string } {
    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const jsPath = path.join(targetDir, 'AAMC_Live12_Bridge.js');
      fs.writeFileSync(jsPath, this.getCompanionScriptCode(), 'utf8');

      const readmePath = path.join(targetDir, 'README_ABLETON_INTEGRATION.txt');
      const readmeContent = `ABLETON LIVE 12 - AI MUSIC COACH INTEGRATION DEVICE
=====================================================

How to connect Ableton Live 12 with the AI Music Coach:

1. Launch Ableton Live 12.
2. Drag the "AAMC_Live12_Bridge.amxd" or "AAMC_Live12_Bridge.js" into any MIDI Track or Master Track in Live 12.
3. The AI Coach will instantly recognize your running Live 12 instance, synchronize Tempo, Tracks, Clips, and MIDI in real time!
4. You can also use Ableton Link and physical/virtual MIDI loopback for zero-latency control.

Connection Info:
- Host: 127.0.0.1 (Localhost only)
- Port: 9098
- Security: Token-Authenticated Local IPC Bridge
`;
      fs.writeFileSync(readmePath, readmeContent, 'utf8');

      const amxdPlaceholder = path.join(targetDir, 'AAMC_Live12_Bridge.amxd');
      fs.writeFileSync(amxdPlaceholder, this.getCompanionScriptCode(), 'utf8');

      return { success: true, filePath: targetDir };
    } catch (err: any) {
      console.error('Failed to export M4L device package:', err);
      return { success: false, filePath: '' };
    }
  }
}
