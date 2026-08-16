import { app, BrowserWindow, ipcMain, dialog, shell, screen, desktopCapturer } from 'electron';
import path from 'path';
import fs from 'fs';
import os from 'os';
import http from 'http';
import { spawn, exec } from 'child_process';
import { GoogleGenAI } from '@google/genai';

let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;
let appReadyTriggered = false;
let activePullReq: http.ClientRequest | null = null;

const boundsFilePath = () => path.join(app.getPath('userData'), 'window-bounds.json');
const aiSettingsPath = () => path.join(app.getPath('userData'), 'ai-settings.json');

// Helper to mask API keys for safe UI presentation
function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '';
  return `${key.slice(0, 4)}••••••••••••${key.slice(-4)}`;
}

interface StoredAISettings {
  mode: 'local-first' | 'local-only' | 'cloud-only' | 'auto';
  localEndpoint: string;
  localModel: string;
  cloudProvider: 'gemini';
  cloudModel: string;
  privacyMode: boolean;
  fallbackEnabled: boolean;
  apiKey: string;
  userLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

function loadAISettings(): StoredAISettings {
  try {
    const filePath = aiSettingsPath();
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return {
        mode: data.mode || 'local-first',
        localEndpoint: data.localEndpoint || 'http://localhost:11434',
        localModel: data.localModel || 'qwen3.5:9b',
        cloudProvider: 'gemini',
        cloudModel: data.cloudModel || 'gemini-3.6-flash',
        privacyMode: Boolean(data.privacyMode),
        fallbackEnabled: data.fallbackEnabled !== false,
        apiKey: data.apiKey || process.env.GEMINI_API_KEY || '',
        userLevel: data.userLevel || 'Intermediate',
      };
    }
  } catch (err) {
    console.warn('Failed to read ai-settings.json:', err);
  }

  return {
    mode: 'local-first',
    localEndpoint: 'http://localhost:11434',
    localModel: 'qwen3.5:9b',
    cloudProvider: 'gemini',
    cloudModel: 'gemini-3.6-flash',
    privacyMode: false,
    fallbackEnabled: true,
    apiKey: process.env.GEMINI_API_KEY || '',
    userLevel: 'Intermediate',
  };
}

function saveAISettings(settings: Partial<StoredAISettings>): StoredAISettings {
  const current = loadAISettings();
  const updated: StoredAISettings = {
    ...current,
    ...settings,
  };

  try {
    fs.writeFileSync(aiSettingsPath(), JSON.stringify(updated, null, 2), 'utf8');
    if (updated.apiKey) {
      process.env.GEMINI_API_KEY = updated.apiKey;
    }
  } catch (err) {
    console.error('Failed to write ai-settings.json:', err);
  }

  return updated;
}

function getGeminiClient(customKey?: string) {
  const settings = loadAISettings();
  const apiKey = customKey || settings.apiKey || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Diagnostic Telemetry State
const diagnosticsState = {
  lastRequestTime: 'None',
  lastResponseTimeMs: 0,
  lastStatus: 'Idle',
  lastError: 'None',
  totalRequests: 0,
};

function withTimeout<T>(promise: Promise<T>, ms = 25000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`AI Request timed out after ${Math.round(ms / 1000)} seconds.`));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function generateContentWithFallback(
  ai: GoogleGenAI,
  preferredModel: string,
  contents: any,
  config?: any,
  timeoutMs = 20000
): Promise<{ response: any; modelUsed: string; fallbackUsed: boolean }> {
  const candidates = Array.from(
    new Set([preferredModel, 'gemini-3.1-flash-lite', 'gemini-flash-latest'])
  );

  let lastError: any = null;

  for (let i = 0; i < candidates.length; i++) {
    const model = candidates[i];
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents,
          config,
        }),
        timeoutMs
      );
      return {
        response,
        modelUsed: model,
        fallbackUsed: model !== preferredModel,
      };
    } catch (err: any) {
      lastError = err;
      const errStr = String(err?.message || err);

      // Stop retrying if invalid key or rate limit / quota exhausted
      if (
        errStr.includes('API_KEY_INVALID') ||
        errStr.includes('API key not valid') ||
        errStr.includes('429') ||
        errStr.includes('RESOURCE_EXHAUSTED') ||
        errStr.includes('quota')
      ) {
        throw err;
      }

      console.warn(`[Electron] Model ${model} failed (${errStr}). Trying next candidate if available...`);
    }
  }

  throw lastError || new Error('All Gemini model candidates failed.');
}

function getIconPath() {
  const iconInBuild = path.join(__dirname, '../build/icon.ico');
  const iconInBuildPng = path.join(__dirname, '../build/icon.png');
  const iconInDist = path.join(__dirname, '../dist/branding/symbol.png');
  if (fs.existsSync(iconInBuild)) return iconInBuild;
  if (fs.existsSync(iconInBuildPng)) return iconInBuildPng;
  if (fs.existsSync(iconInDist)) return iconInDist;
  return undefined;
}

function getSavedBounds() {
  try {
    const file = boundsFilePath();
    if (fs.existsSync(file)) {
      const bounds = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (bounds && bounds.width && bounds.height) {
        return bounds;
      }
    }
  } catch (e) {
    console.warn('Could not read saved window bounds:', e);
  }
  return null;
}

function saveBounds(bounds: { x?: number; y?: number; width: number; height: number }) {
  try {
    fs.writeFileSync(boundsFilePath(), JSON.stringify(bounds), 'utf8');
  } catch (e) {
    console.warn('Could not save window bounds:', e);
  }
}

function ensureVisibleOnSomeDisplay(bounds: { x?: number; y?: number; width: number; height: number }) {
  if (bounds.x === undefined || bounds.y === undefined) return false;
  const displays = screen.getAllDisplays();
  const visible = displays.some((display) => {
    const displayBounds = display.bounds;
    return (
      bounds.x! >= displayBounds.x &&
      bounds.y! >= displayBounds.y &&
      bounds.x! + bounds.width <= displayBounds.x + displayBounds.width &&
      bounds.y! + bounds.height <= displayBounds.y + displayBounds.height
    );
  });
  return visible;
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 640,
    height: 440,
    frame: false,
    transparent: false,
    backgroundColor: '#0A0A0A',
    resizable: false,
    center: true,
    show: true,
    alwaysOnTop: true,
    icon: getIconPath(),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const splashPathCandidate1 = path.join(__dirname, 'splash.html');
  const splashPathCandidate2 = path.join(__dirname, '../electron/splash.html');

  if (fs.existsSync(splashPathCandidate1)) {
    splashWindow.loadFile(splashPathCandidate1);
  } else if (fs.existsSync(splashPathCandidate2)) {
    splashWindow.loadFile(splashPathCandidate2);
  }
}

function transitionToMain() {
  if (appReadyTriggered) return;
  appReadyTriggered = true;

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
  }

  if (splashWindow && !splashWindow.isDestroyed()) {
    let opacity = 1.0;
    const fadeInterval = setInterval(() => {
      opacity -= 0.15;
      if (opacity <= 0) {
        clearInterval(fadeInterval);
        if (splashWindow && !splashWindow.isDestroyed()) {
          splashWindow.close();
          splashWindow = null;
        }
      } else if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.setOpacity(opacity);
      }
    }, 30);
  }
}

function createWindow() {
  createSplashWindow();

  let savedBounds = getSavedBounds();
  if (savedBounds && !ensureVisibleOnSomeDisplay(savedBounds)) {
    savedBounds = null;
  }

  const windowOptions: any = {
    minWidth: 1024,
    minHeight: 700,
    title: 'Ableton AI Music Coach',
    backgroundColor: '#0A0A0A',
    autoHideMenuBar: true,
    icon: getIconPath(),
    webPreferences: {
      preload: fs.existsSync(path.join(__dirname, 'preload.js'))
        ? path.join(__dirname, 'preload.js')
        : fs.existsSync(path.join(__dirname, '../dist-electron/preload.js'))
        ? path.join(__dirname, '../dist-electron/preload.js')
        : path.join(__dirname, 'preload.ts'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
  };

  if (savedBounds) {
    windowOptions.x = savedBounds.x;
    windowOptions.y = savedBounds.y;
    windowOptions.width = savedBounds.width;
    windowOptions.height = savedBounds.height;
  } else {
    windowOptions.width = 1280;
    windowOptions.height = 820;
    windowOptions.center = true;
  }

  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      transitionToMain();
    }, 1500);
  });

  mainWindow.on('resize', () => {
    if (mainWindow) saveBounds(mainWindow.getBounds());
  });

  mainWindow.on('move', () => {
    if (mainWindow) saveBounds(mainWindow.getBounds());
  });

  const isDev = process.env.NODE_ENV !== 'production' && !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  setTimeout(() => {
    transitionToMain();
  }, 10000);
}

// IPC Handlers
ipcMain.handle('desktop:get-platform', () => process.platform);
ipcMain.handle('desktop:get-version', () => app.getVersion() || '1.0.0');
ipcMain.handle('desktop:get-user-data-path', () => app.getPath('userData'));

ipcMain.on('desktop:app-ready', () => {
  transitionToMain();
});

ipcMain.on('desktop:report-progress', (_event, data) => {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.webContents.send('splash-progress', data);
  }
});

ipcMain.handle('desktop:open-file-dialog', async (_event, options) => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    title: options?.title || 'Open File',
    filters: options?.filters || [
      { name: 'Ableton AI Music Coach Project (*.aamc)', extensions: ['aamc'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  });

  if (result.canceled || result.filePaths.length === 0) return null;
  const filePath = result.filePaths[0];
  const content = fs.readFileSync(filePath, 'utf8');
  return { filePath, content };
});

ipcMain.handle('desktop:save-file-dialog', async (_event, options) => {
  if (!mainWindow) return null;
  const result = await dialog.showSaveDialog(mainWindow, {
    title: options?.title || 'Save Project',
    defaultPath: options?.defaultPath || 'MyTrack.aamc',
    filters: options?.filters || [
      { name: 'Ableton AI Music Coach Project (*.aamc)', extensions: ['aamc'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (result.canceled || !result.filePath) return null;
  return result.filePath;
});

ipcMain.handle('desktop:choose-folder', async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle('desktop:save-project-file', async (_event, { filePath, dataStr }) => {
  fs.writeFileSync(filePath, dataStr, 'utf8');
  return { success: true, filePath };
});

ipcMain.handle('desktop:load-project-file', async (_event, filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  return content;
});

ipcMain.handle('desktop:export-midi-file', async (_event, { fileName, binaryBuffer }) => {
  if (!mainWindow) return null;
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export MIDI File for Ableton Live 12',
    defaultPath: fileName || 'pattern.mid',
    filters: [{ name: 'MIDI File (*.mid)', extensions: ['mid'] }],
  });

  if (result.canceled || !result.filePath) return null;

  const buffer = Buffer.from(binaryBuffer);
  fs.writeFileSync(result.filePath, buffer);
  return { success: true, filePath: result.filePath };
});

ipcMain.handle('desktop:open-external', async (_event, url) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    await shell.openExternal(url);
  }
});

ipcMain.handle('desktop:get-screen-sources', async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['window', 'screen'],
      thumbnailSize: { width: 1920, height: 1080 },
      fetchWindowIcons: true,
    });
    return sources.map((s) => ({
      id: s.id,
      name: s.name,
      thumbnail: s.thumbnail.toDataURL(),
      appIcon: s.appIcon ? s.appIcon.toDataURL() : null,
      isAbleton: s.name.toLowerCase().includes('ableton') || s.name.toLowerCase().includes('live'),
    }));
  } catch (err: any) {
    console.error('Failed to get screen sources in Electron:', err);
    return [];
  }
});

// AI Settings Handlers
ipcMain.handle('ai:get-settings', () => {
  const settings = loadAISettings();
  return {
    ...settings,
    apiKeySet: Boolean(settings.apiKey),
    apiKeyMasked: maskApiKey(settings.apiKey),
  };
});

ipcMain.handle('ai:save-settings', (_event, newSettings: Partial<StoredAISettings>) => {
  const saved = saveAISettings(newSettings);
  return {
    success: true,
    maskedKey: maskApiKey(saved.apiKey),
    settings: saved,
  };
});

ipcMain.handle('ai:get-diagnostics', () => {
  const settings = loadAISettings();
  return {
    settings,
    isDesktop: true,
    environment: process.env.NODE_ENV || 'production',
    telemetry: { ...diagnosticsState },
  };
});

ipcMain.handle('ai:test-connection', async (_event, params?: { customKey?: string; customModel?: string }) => {
  const settings = loadAISettings();
  const apiKey = params?.customKey || settings.apiKey || process.env.GEMINI_API_KEY;
  const modelName = params?.customModel || settings.cloudModel || 'gemini-3.6-flash';

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    diagnosticsState.lastStatus = 'Missing Key';
    diagnosticsState.lastError = 'API Key missing';
    return {
      ok: false,
      statusMessage: 'Gemini API Key is missing. Please enter your API Key in Settings.',
    };
  }

  const startTime = Date.now();
  diagnosticsState.lastRequestTime = new Date().toLocaleTimeString();
  diagnosticsState.totalRequests += 1;

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' },
      },
    });

    const { response, modelUsed, fallbackUsed } = await generateContentWithFallback(
      ai,
      modelName,
      'Ping. Respond with "CONNECTED: Ableton AI Music Coach Engine Online".',
      { temperature: 0.1 },
      20000
    );

    const duration = Date.now() - startTime;
    diagnosticsState.lastResponseTimeMs = duration;
    diagnosticsState.lastStatus = 'Connected';
    diagnosticsState.lastError = 'None';

    const statusMsg = fallbackUsed
      ? `✓ Gemini Connected (${modelUsed} • Fallback from ${modelName} due to demand/timeout • ${duration}ms)`
      : `✓ Gemini Connected (${modelUsed} • ${duration}ms)`;

    return {
      ok: true,
      statusMessage: statusMsg,
      modelUsed,
      responseTimeMs: duration,
    };
  } catch (err: any) {
    const duration = Date.now() - startTime;
    diagnosticsState.lastResponseTimeMs = duration;
    diagnosticsState.lastStatus = 'Error';

    const errStr = String(err?.message || err);
    diagnosticsState.lastError = errStr;

    if (errStr.includes('API_KEY_INVALID') || errStr.includes('API key not valid')) {
      console.warn('Gemini API Key is invalid.');
      return { ok: false, statusMessage: '✕ Invalid API Key. Please verify your Gemini API Key.' };
    } else if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota')) {
      console.warn('Gemini API rate limit or free tier quota reached (429). Local AI is active.');
      return {
        ok: false,
        statusMessage: '✕ Quota Exceeded for this API Key. Please use Local AI (Ollama) or enter your custom Gemini API key in Settings.',
      };
    } else if (errStr.includes('503') || errStr.includes('UNAVAILABLE') || errStr.includes('high demand')) {
      console.warn('Gemini Cloud models busy (503). Local AI active.');
      return {
        ok: false,
        statusMessage: '✕ Cloud models are currently experiencing high demand (503). Local AI (Ollama) is available for offline use.',
      };
    }
    console.warn('Gemini test connection note:', errStr);
    return { ok: false, statusMessage: `✕ Connection error: ${errStr}` };
  }
});

ipcMain.handle('ai:chat', async (_event, { message, history, context }: { message: string; history?: any[]; context?: any }) => {
  const settings = loadAISettings();
  const ai = getGeminiClient();

  if (!ai) {
    return {
      reply: 'Gemini API Key is not configured in Cloud settings. Use Local AI (Ollama) or add your API key.',
      offline: true,
    };
  }

  const startTime = Date.now();
  diagnosticsState.lastRequestTime = new Date().toLocaleTimeString();
  diagnosticsState.totalRequests += 1;

  try {
    const modelName = settings.cloudModel || 'gemini-3.6-flash';

    let promptText = `User Query: ${message}\n\n`;
    if (context) {
      promptText += `Project Context:\n`;
      promptText += `- Genre: ${context.genre || 'Psytrance'}\n`;
      promptText += `- Tempo: ${context.bpm || 142} BPM\n`;
      promptText += `- Key: ${context.key || 'F#'} ${context.scale || 'Minor'}\n`;
      promptText += `- UI Language: ${context.language || 'he'}\n`;
      promptText += `- User Experience Level: ${settings.userLevel}\n\n`;
    }

    if (history && history.length > 0) {
      promptText += `Recent Conversation History:\n`;
      history.slice(-8).forEach((h: any) => {
        promptText += `${h.sender === 'user' ? 'User' : 'Coach'}: ${h.text}\n`;
      });
      promptText += `\nRespond to the latest query specifically:`;
    }

    const { response, modelUsed } = await generateContentWithFallback(
      ai,
      modelName,
      promptText,
      { temperature: 0.7 },
      20000
    );

    const duration = Date.now() - startTime;
    diagnosticsState.lastResponseTimeMs = duration;
    diagnosticsState.lastStatus = 'Success';
    diagnosticsState.lastError = 'None';

    return {
      reply: response.text || 'No response text returned from AI.',
      offline: false,
      modelUsed,
    };
  } catch (err: any) {
    console.error('IPC ai:chat error:', err);
    const duration = Date.now() - startTime;
    diagnosticsState.lastResponseTimeMs = duration;
    diagnosticsState.lastStatus = 'Error';

    const errStr = String(err?.message || err);
    diagnosticsState.lastError = errStr;

    return {
      reply: `AI Request Failure: ${errStr}.`,
      offline: true,
    };
  }
});

ipcMain.handle('ai:generate-pattern', async (_event, params: any) => {
  const settings = loadAISettings();
  const ai = getGeminiClient();

  if (!ai) {
    return { offline: true };
  }

  try {
    const { type, genre, bpm, key, scale, energy } = params || {};
    const promptText = `Generate a musical MIDI pattern as a JSON object for Ableton Live 12.
Type: ${type || "bassline"}, Genre: ${genre || "Psytrance"}, BPM: ${bpm || 142}, Key: ${key || "F#"}, Scale: ${scale || "Minor"}, Energy Level: ${energy || 80}/100.
Return JSON ONLY matching structure:
{
  "name": "Pattern Name",
  "notes": [ { "pitch": "F#1", "time": 0.25, "duration": 0.2, "velocity": 100 } ],
  "abletonTips": "Specific Operator or Drift synth setup tips in Ableton Live 12"
}`;

    const { response, modelUsed } = await generateContentWithFallback(
      ai,
      settings.cloudModel || "gemini-3.6-flash",
      promptText,
      { responseMimeType: "application/json", temperature: 0.6 },
      20000
    );

    let parsed: any = null;
    try {
      const text = response.text || "{}";
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.warn("Failed to parse JSON response in Electron IPC pattern generation:", e);
    }

    if (!parsed || !Array.isArray(parsed.notes)) {
      return { offline: true };
    }

    const pattern = {
      id: `pat_${Date.now()}`,
      name: parsed.name || `${genre || "Psytrance"} ${type || "bassline"} (${key || "F#"})`,
      type: type || "bassline",
      genre: genre || "Psytrance",
      bpm: Number(bpm) || 142,
      key: key || "F#",
      scale: scale || "Minor",
      timeSignature: "4/4",
      notes: parsed.notes,
      abletonTips: parsed.abletonTips || "In Ableton Live 12, load Operator or Drift on an Instrument Track.",
      createdAt: new Date().toISOString(),
    };

    return { offline: false, pattern, modelUsed };
  } catch (err: any) {
    console.error("IPC ai:generate-pattern error:", err);
    return { offline: true };
  }
});

ipcMain.handle('ai:analyze-track', async (_event, params: any) => {
  const settings = loadAISettings();
  const ai = getGeminiClient();

  if (!ai) {
    return { offline: true };
  }

  try {
    const { genre, lufs, rms, peak, lowMidRatio, stereoWidth, userNotes } = params || {};
    const promptText = `Analyze this audio mix for Ableton Live 12 mastering:
Genre: ${genre || "Psytrance"}, LUFS: ${lufs} dB, RMS: ${rms} dB, Peak: ${peak} dB, Low-Mid Ratio: ${lowMidRatio}, Stereo Width: ${stereoWidth}.
User Notes: ${userNotes || "None"}.
Return JSON ONLY matching structure:
{
  "overallRating": "Summary rating",
  "loudnessAssessment": "LUFS assessment",
  "spectralBalance": "EQ assessment",
  "dynamicsAndWidth": "Stereo width assessment",
  "actionableSteps": ["Step 1", "Step 2", "Step 3", "Step 4"]
}`;

    const { response } = await generateContentWithFallback(
      ai,
      settings.cloudModel || "gemini-3.6-flash",
      promptText,
      { responseMimeType: "application/json", temperature: 0.4 },
      20000
    );

    let parsed: any = null;
    try {
      const text = response.text || "{}";
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.warn("Failed to parse JSON response in Electron IPC track analysis:", e);
    }

    if (!parsed || !parsed.actionableSteps) {
      return { offline: true };
    }

    return { offline: false, analysis: parsed };
  } catch (err: any) {
    console.error("IPC ai:analyze-track error:", err);
    return { offline: true };
  }
});

// --- Ollama Management IPC Handlers ---

ipcMain.handle('ollama:check-status', async () => {
  const endpoint = 'http://localhost:11434';
  let running = false;
  let version = '';

  try {
    const res = await fetch(`${endpoint}/api/version`);
    if (res.ok) {
      const data = await res.json();
      running = true;
      version = data.version || '0.1.0';
    }
  } catch {
    running = false;
  }

  let installed = running;
  if (!installed) {
    const localAppData = process.env.LOCALAPPDATA || '';
    const possiblePaths = [
      path.join(localAppData, 'Programs', 'Ollama', 'ollama.exe'),
      path.join(process.env.ProgramFiles || '', 'Ollama', 'ollama.exe'),
      '/usr/local/bin/ollama',
      '/usr/bin/ollama',
    ];
    installed = possiblePaths.some((p) => p && fs.existsSync(p));

    if (!installed) {
      installed = await new Promise<boolean>((resolve) => {
        const cmd = process.platform === 'win32' ? 'where ollama' : 'which ollama';
        exec(cmd, (err) => resolve(!err));
      });
    }
  }

  return { installed, running, version, endpoint };
});

ipcMain.handle('ollama:start-service', async () => {
  try {
    const localAppData = process.env.LOCALAPPDATA || '';
    let ollamaPath = 'ollama';

    const winPath = path.join(localAppData, 'Programs', 'Ollama', 'ollama.exe');
    if (process.platform === 'win32' && fs.existsSync(winPath)) {
      ollamaPath = winPath;
    }

    const proc = spawn(ollamaPath, ['serve'], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
    });
    proc.unref();

    const startTime = Date.now();
    while (Date.now() - startTime < 10000) {
      await new Promise((r) => setTimeout(r, 800));
      try {
        const res = await fetch('http://localhost:11434/api/tags');
        if (res.ok) return { success: true, message: 'Ollama service started successfully.' };
      } catch {}
    }

    return { success: false, message: 'Started Ollama process, waiting for service...' };
  } catch (err: any) {
    return { success: false, message: `Failed to start Ollama: ${err.message}` };
  }
});

ipcMain.handle('ollama:restart-service', async () => {
  if (process.platform === 'win32') {
    exec('taskkill /F /IM ollama.exe /T', () => {});
    exec('taskkill /F /IM "Ollama app.exe" /T', () => {});
  } else {
    exec('pkill -f ollama', () => {});
  }
  await new Promise((r) => setTimeout(r, 1500));
  try {
    const localAppData = process.env.LOCALAPPDATA || '';
    let ollamaPath = 'ollama';
    const winPath = path.join(localAppData, 'Programs', 'Ollama', 'ollama.exe');
    if (process.platform === 'win32' && fs.existsSync(winPath)) {
      ollamaPath = winPath;
    }
    const proc = spawn(ollamaPath, ['serve'], { detached: true, stdio: 'ignore', windowsHide: true });
    proc.unref();
    return { success: true, message: 'Ollama service restarted.' };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
});

ipcMain.handle('ollama:get-models', async () => {
  try {
    const res = await fetch('http://localhost:11434/api/tags');
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.models || !Array.isArray(data.models)) return [];

    return data.models.map((m: any) => {
      const sizeBytes = m.size || 0;
      const sizeGB = sizeBytes ? (sizeBytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB' : '';
      return {
        id: m.name || m.model,
        name: m.name || m.model,
        sizeBytes,
        sizeHuman: sizeGB,
        family: m.details?.family || 'Qwen',
        modifiedAt: m.modified_at,
      };
    });
  } catch {
    return [];
  }
});

ipcMain.handle('ollama:pull-model', async (_event, { modelName }: { modelName: string }) => {
  const targetModel = modelName || 'qwen3.5:4b';

  return new Promise((resolve, reject) => {
    if (activePullReq) {
      activePullReq.destroy();
      activePullReq = null;
    }

    const postData = JSON.stringify({ name: targetModel, stream: true });

    let lastBytes = 0;
    let lastTime = Date.now();

    const req = http.request(
      'http://localhost:11434/api/pull',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let buffer = '';

        res.on('data', (chunk) => {
          buffer += chunk.toString('utf8');
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const data = JSON.parse(line);
              const completed = Number(data.completed || 0);
              const total = Number(data.total || 0);
              const status = data.status || 'pulling';

              const now = Date.now();
              const timeDiffSec = (now - lastTime) / 1000;
              let speedMBs = 0;

              if (timeDiffSec > 0.5 && completed > lastBytes) {
                const bytesDiff = completed - lastBytes;
                speedMBs = Math.round((bytesDiff / (1024 * 1024 * timeDiffSec)) * 10) / 10;
                lastBytes = completed;
                lastTime = now;
              }

              const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
              const completedGB = (completed / (1024 * 1024 * 1024)).toFixed(2);
              const totalGB = (total / (1024 * 1024 * 1024)).toFixed(2);
              const etaSeconds = speedMBs > 0 && total > completed ? Math.round((total - completed) / (speedMBs * 1024 * 1024)) : 0;

              const progressObj = {
                modelName: targetModel,
                status,
                percent,
                completedBytes: completed,
                totalBytes: total,
                completedHuman: `${completedGB} GB`,
                totalHuman: `${totalGB} GB`,
                speedMBs,
                etaSeconds,
              };

              if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('ollama:pull-progress', progressObj);
              }
            } catch {}
          }
        });

        res.on('end', () => {
          activePullReq = null;
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('ollama:pull-progress', {
              modelName: targetModel,
              status: 'success',
              percent: 100,
              completedHuman: '3.4 GB',
              totalHuman: '3.4 GB',
              speedMBs: 0,
              etaSeconds: 0,
            });
          }
          resolve({ success: true, modelName: targetModel });
        });
      }
    );

    req.on('error', (err) => {
      activePullReq = null;
      reject(err);
    });

    req.write(postData);
    req.end();
    activePullReq = req;
  });
});

ipcMain.handle('ollama:cancel-pull', async () => {
  if (activePullReq) {
    activePullReq.destroy();
    activePullReq = null;
    return { success: true, message: 'Download cancelled.' };
  }
  return { success: false, message: 'No active download.' };
});

ipcMain.handle('ollama:test-model', async (_event, { modelName }: { modelName?: string }) => {
  const modelToTest = modelName || 'qwen3.5:4b';
  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelToTest,
        prompt: 'Respond with exactly: LOCAL AI READY',
        stream: false,
      }),
    });

    if (!res.ok) {
      return { ok: false, reply: `HTTP Error ${res.status}` };
    }

    const data = await res.json();
    const reply = String(data.response || '').trim();
    const isReady = reply.toUpperCase().includes('LOCAL AI READY') || reply.length > 0;

    return { ok: isReady, reply };
  } catch (err: any) {
    return { ok: false, reply: err.message || 'Failed to connect to local model' };
  }
});

ipcMain.handle('ollama:get-hardware-info', async () => {
  try {
    const totalRamGB = Math.round(os.totalmem() / (1024 * 1024 * 1024));
    let recommendedModel = 'qwen3.5:4b';
    let description = 'Recommended • Standard 8-16 GB System RAM';

    if (totalRamGB < 8) {
      recommendedModel = 'qwen3.5:2b';
      description = 'Low Memory Mode • <8 GB RAM';
    } else if (totalRamGB >= 32) {
      recommendedModel = 'qwen3.5:27b';
      description = 'High Performance Mode • 32+ GB RAM Workstation';
    } else if (totalRamGB >= 16) {
      recommendedModel = 'qwen3.5:9b';
      description = 'Enhanced Intelligence Mode • 16-32 GB RAM';
    }

    return {
      totalRamGB,
      recommendedModel,
      description,
    };
  } catch {
    return {
      totalRamGB: 16,
      recommendedModel: 'qwen3.5:4b',
      description: 'Hardware info unavailable',
    };
  }
});

ipcMain.handle('ollama:open-download', async () => {
  shell.openExternal('https://ollama.com/download');
  return { success: true };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
