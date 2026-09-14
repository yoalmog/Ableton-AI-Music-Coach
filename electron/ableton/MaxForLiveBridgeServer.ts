import http from 'http';
import crypto from 'crypto';
import { EventEmitter } from 'events';
import {
  MaxForLiveBridgeState,
  AbletonLiveTrackInfo,
  AbletonTransportState,
} from '../../src/types/abletonIntegration';

export interface BridgeCommand {
  type:
    | 'HANDSHAKE'
    | 'HEARTBEAT'
    | 'SET_TEMPO'
    | 'TRANSPORT_PLAY'
    | 'TRANSPORT_STOP'
    | 'TRANSPORT_RECORD'
    | 'SET_TRACK_VOLUME'
    | 'SET_TRACK_PAN'
    | 'SET_TRACK_MUTE'
    | 'SET_TRACK_SOLO'
    | 'SET_TRACK_ARM'
    | 'FIRE_CLIP'
    | 'STOP_CLIP'
    | 'FIRE_SCENE'
    | 'SET_DEVICE_PARAM'
    | 'GET_SONG_STATE'
    | 'UPDATE_TRACKS'
    | 'MIDI_EVENT';
  payload?: any;
  token?: string;
  source?: string;
  timestamp?: number;
}

export class MaxForLiveBridgeServer extends EventEmitter {
  private server: http.Server | null = null;
  private port: number = 9098;
  private host: string = '127.0.0.1';
  private sessionToken: string = '';
  private sseClients: Set<http.ServerResponse> = new Set();
  private wsClients: Set<any> = new Set();
  private isConnected: boolean = false;
  private lastHeartbeat: number = 0;
  private latencyMs: number = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;

  // Cached Live state
  private tracks: AbletonLiveTrackInfo[] = [];
  private transport: AbletonTransportState = {
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
  };

  constructor(port: number = 9098) {
    super();
    this.port = port;
    this.sessionToken = this.generateSessionToken();
  }

  private generateSessionToken(): string {
    return 'aamc_' + crypto.randomBytes(16).toString('hex');
  }

  public getSessionToken(): string {
    return this.sessionToken;
  }

  public getPort(): number {
    return this.port;
  }

  public getState(): MaxForLiveBridgeState {
    return {
      connected: this.isConnected,
      host: this.host,
      port: this.port,
      sessionToken: this.sessionToken,
      latencyMs: this.latencyMs,
      lastHeartbeat: this.lastHeartbeat,
      liveVersion: 'Live 12.1',
      deviceVersion: '1.2.0',
      tracksCount: this.tracks.length,
      authenticated: true,
      statusMessage: this.isConnected
        ? `Connected to Ableton Live 12 (${this.latencyMs}ms)`
        : 'Bridge listening on localhost:9098 (Waiting for Max for Live device)',
    };
  }

  public start(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.server) {
        resolve(true);
        return;
      }

      this.server = http.createServer((req, res) => {
        // Enforce Localhost Only Access
        const clientIp = req.socket.remoteAddress || '';
        const isLocal =
          clientIp === '127.0.0.1' ||
          clientIp === '::1' ||
          clientIp === '::ffff:127.0.0.1' ||
          clientIp === 'localhost';

        if (!isLocal) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Forbidden: Localhost only' }));
          return;
        }

        // CORS for localhost
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-AAMC-Token');

        if (req.method === 'OPTIONS') {
          res.writeHead(204);
          res.end();
          return;
        }

        const url = new URL(req.url || '/', `http://${this.host}:${this.port}`);

        // Route: Status & Handshake
        if (url.pathname === '/status' || url.pathname === '/api/status') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              ok: true,
              connected: this.isConnected,
              port: this.port,
              sessionToken: this.sessionToken,
              latencyMs: this.latencyMs,
              tracksCount: this.tracks.length,
              transport: this.transport,
            })
          );
          return;
        }

        // Route: SSE Real-Time Event Stream
        if (url.pathname === '/api/events' || url.pathname === '/events') {
          const token = url.searchParams.get('token') || req.headers['x-aamc-token'];
          if (token && token !== this.sessionToken) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized: Invalid token' }));
            return;
          }

          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          });
          res.write(`data: ${JSON.stringify({ type: 'CONNECTED', token: this.sessionToken })}\n\n`);

          this.sseClients.add(res);
          this.setConnectedState(true);

          req.on('close', () => {
            this.sseClients.delete(res);
            if (this.sseClients.size === 0 && this.wsClients.size === 0) {
              this.setConnectedState(false);
            }
          });
          return;
        }

        // Route: POST /api/command
        if (url.pathname === '/api/command' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
            if (body.length > 512 * 1024) {
              req.destroy();
            }
          });

          req.on('end', () => {
            try {
              const command: BridgeCommand = JSON.parse(body || '{}');
              const authPassed =
                !command.token ||
                command.token === this.sessionToken ||
                req.headers['x-aamc-token'] === this.sessionToken;

              if (!authPassed && command.type !== 'HANDSHAKE') {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: false, error: 'Unauthorized' }));
                return;
              }

              const result = this.handleIncomingCommand(command);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ ok: true, result }));
            } catch (err: any) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ ok: false, error: err.message }));
            }
          });
          return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint Not Found' }));
      });

      this.server.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`[Bridge] Port ${this.port} in use, trying ${this.port + 1}...`);
          this.port += 1;
          this.server?.close();
          this.server = null;
          this.start().then(resolve);
        } else {
          console.error('[Bridge] Server error:', err);
          resolve(false);
        }
      });

      this.server.listen(this.port, this.host, () => {
        console.log(`[Bridge] Max for Live Bridge running on http://${this.host}:${this.port}`);
        this.startHeartbeatMonitor();
        resolve(true);
      });
    });
  }

  public stop() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.server) {
      this.server.close();
      this.server = null;
    }
    this.sseClients.clear();
    this.wsClients.clear();
    this.setConnectedState(false);
  }

  private startHeartbeatMonitor() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected && Date.now() - this.lastHeartbeat > 8000) {
        console.log('[Bridge] Live heartbeat timeout, setting disconnected state');
        this.setConnectedState(false);
      }
    }, 3000);
  }

  private setConnectedState(connected: boolean) {
    if (this.isConnected !== connected) {
      this.isConnected = connected;
      this.emit('connection-change', {
        connected: this.isConnected,
        state: this.getState(),
      });
    }
  }

  /**
   * Handle command coming from Ableton / Max for Live device
   */
  public handleIncomingCommand(command: BridgeCommand): any {
    this.lastHeartbeat = Date.now();
    this.setConnectedState(true);

    if (command.timestamp) {
      this.latencyMs = Math.max(1, Math.round(Date.now() - command.timestamp));
    }

    switch (command.type) {
      case 'HANDSHAKE':
        return {
          sessionToken: this.sessionToken,
          protocolVersion: '1.2.0',
          appName: 'Ableton AI Music Coach',
        };

      case 'HEARTBEAT':
        return { pong: Date.now(), latencyMs: this.latencyMs };

      case 'SET_TEMPO':
        if (typeof command.payload?.bpm === 'number') {
          const bpm = Math.max(20, Math.min(999, command.payload.bpm));
          this.transport.bpm = bpm;
          this.transport.source = 'ableton';
          this.transport.lastUpdated = Date.now();
          this.emit('transport-change', { ...this.transport });
        }
        return { bpm: this.transport.bpm };

      case 'TRANSPORT_PLAY':
        this.transport.isPlaying = true;
        this.transport.isPaused = false;
        this.transport.source = 'ableton';
        this.transport.lastUpdated = Date.now();
        this.emit('transport-change', { ...this.transport });
        return { isPlaying: true };

      case 'TRANSPORT_STOP':
        this.transport.isPlaying = false;
        this.transport.source = 'ableton';
        this.transport.lastUpdated = Date.now();
        this.emit('transport-change', { ...this.transport });
        return { isPlaying: false };

      case 'TRANSPORT_RECORD':
        this.transport.isRecording = Boolean(command.payload?.recording);
        this.transport.source = 'ableton';
        this.transport.lastUpdated = Date.now();
        this.emit('transport-change', { ...this.transport });
        return { isRecording: this.transport.isRecording };

      case 'UPDATE_TRACKS':
        if (Array.isArray(command.payload?.tracks)) {
          this.tracks = command.payload.tracks;
          this.emit('tracks-update', this.tracks);
        }
        return { tracksCount: this.tracks.length };

      case 'MIDI_EVENT':
        this.emit('midi-event', command.payload);
        return { received: true };

      default:
        this.emit('custom-command', command);
        return { status: 'handled' };
    }
  }

  /**
   * Broadcast an event to Max for Live device
   */
  public broadcastToLive(type: string, payload: any) {
    const dataStr = JSON.stringify({
      type,
      payload,
      token: this.sessionToken,
      timestamp: Date.now(),
    });

    for (const client of this.sseClients) {
      try {
        client.write(`data: ${dataStr}\n\n`);
      } catch {
        this.sseClients.delete(client);
      }
    }
  }

  public sendTransportPlay(bpm?: number) {
    this.transport.isPlaying = true;
    if (bpm) this.transport.bpm = bpm;
    this.broadcastToLive('TRANSPORT_PLAY', { bpm: this.transport.bpm });
  }

  public sendTransportStop() {
    this.transport.isPlaying = false;
    this.broadcastToLive('TRANSPORT_STOP', {});
  }

  public sendTempo(bpm: number) {
    this.transport.bpm = bpm;
    this.broadcastToLive('SET_TEMPO', { bpm });
  }

  public sendTrackVolume(trackIndex: number, volume: number) {
    this.broadcastToLive('SET_TRACK_VOLUME', { trackIndex, volume });
  }

  public sendTrackPan(trackIndex: number, pan: number) {
    this.broadcastToLive('SET_TRACK_PAN', { trackIndex, pan });
  }

  public sendTrackMute(trackIndex: number, muted: boolean) {
    this.broadcastToLive('SET_TRACK_MUTE', { trackIndex, muted });
  }

  public sendTrackSolo(trackIndex: number, soloed: boolean) {
    this.broadcastToLive('SET_TRACK_SOLO', { trackIndex, soloed });
  }

  public sendTrackArm(trackIndex: number, armed: boolean) {
    this.broadcastToLive('SET_TRACK_ARM', { trackIndex, armed });
  }

  public sendFireClip(trackIndex: number, clipIndex: number) {
    this.broadcastToLive('FIRE_CLIP', { trackIndex, clipIndex });
  }

  public sendStopClip(trackIndex: number) {
    this.broadcastToLive('STOP_CLIP', { trackIndex });
  }

  public sendDeviceParam(trackIndex: number, deviceIndex: number, paramId: string, value: number) {
    this.broadcastToLive('SET_DEVICE_PARAM', { trackIndex, deviceIndex, paramId, value });
  }

  public sendMidiNote(channel: number, pitch: number, velocity: number, durationMs: number) {
    this.broadcastToLive('MIDI_NOTE', { channel, pitch, velocity, durationMs });
  }

  public getTracks(): AbletonLiveTrackInfo[] {
    return this.tracks;
  }

  public getTransport(): AbletonTransportState {
    return this.transport;
  }
}
