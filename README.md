# 🎛️ Ableton AI Music Coach

An AI-powered music production teacher and desktop workstation for **Ableton Live 12**, specializing in:
- **Psytrance** (Full-On, Night Psy)
- **Goa Psytrance** (Acid Melodies, Hypnotic Scales)
- **Progressive Psytrance**
- **Techno** (Peak Time, Industrial Sub Rumbles)
- **Melodic Techno** & Electronic Music

---

## 🚀 Architecture Overview

Designed from day one as a **native Windows desktop application** with desktop abstraction layers, while remaining 100% usable in web/browser mode:

```
React UI (TypeScript + Vite)
      ↓
Application Services (AIService, AudioService, MidiService, ProjectService)
      ↓
Desktop Abstraction Layer (desktopService.ts)
      ↓
Electron Preload (preload.ts with contextBridge)
      ↓
Electron Main Process (main.ts with secure IPC)
      ↓
Windows File System (.aamc project files & .mid exports)
```

### Key Security & Architecture Highlights
- **Context Isolation**: `contextIsolation: true` & `nodeIntegration: false`. No direct Node API exposure to renderer.
- **Project Format**: Real `.aamc` project file system storing track settings, BPM, key, MIDI patterns, and AI notes.
- **Native MIDI Export**: Encodes binary Standard MIDI Files (`.mid`) for 1-click drag-and-drop into Ableton Live 12.
- **Offline Mode Support**: Works without an internet connection using local synthesizer presets and built-in production guides.

## 🛠️ Environment Variables & Gemini Setup

To use the AI Coach features, you need a Gemini API Key.
Create a `.env` file in the root based on `.env.example`:

```env
GEMINI_API_KEY="your_api_key_here"
```

If the API key is not present or there is no network connection, the application will automatically enter **Offline Mode**, providing local offline fallbacks for all AI functionality without crashing.

---

## 🛠️ Package Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `tsx server.ts` | Start full-stack Express + Vite dev environment |
| `npm run build` | `vite build && esbuild server.ts ...` | Build web application & server bundle |
| `npm run start` | `node dist/server.cjs` | Run production full-stack server |
| `npm run electron:dev` | `tsx electron/main.ts` | Launch Electron desktop application in development |
| `npm run electron:build`| `npm run build && esbuild electron/main.ts ...` | Compile Electron main & preload scripts |
| `npm run dist:win` | `npm run electron:build && electron-builder --win` | Generate Windows `Ableton-AI-Music-Coach-Setup.exe` |

---

## 📦 Windows Executable & Installer Packaging

### 1. Generating NSIS Executable
To package the application into a standalone Windows installer and portable executable:
```bash
npm run dist:win
```
The output files will be created under `release/`:
- `Ableton-AI-Music-Coach-Setup.exe` (NSIS Installer)
- `Ableton-AI-Music-Coach-Portable.exe` (Portable Executable)

### 2. Generating Custom Inno Setup Installer
An automated Inno Setup script template is located at `installer/InnoSetupScript.iss`.
Compile it with **Inno Setup 6+** on Windows to produce `release/installer/Ableton-AI-Music-Coach-Setup.exe`.

---

## 📁 Project Structure

```
├── electron/
│   ├── main.ts              # Electron main process & IPC handlers
│   └── preload.ts           # Secure contextBridge exposing window.desktopAPI
├── installer/
│   └── InnoSetupScript.iss  # Inno Setup script for automated Windows installation
├── src/
│   ├── components/          # Views: Dashboard, Lessons, MIDI, Drums, Bass, Sound Design, Analyzer, Arrangement, Practice, Settings
│   ├── data/                # Courses, Devices, Sound Design recipes
│   ├── services/
│   │   ├── desktopService.ts# Platform Abstraction Layer (Electron vs Web)
│   │   ├── audioService.ts  # Web Audio API Synthesizer & Spectrum Analyzer
│   │   ├── midiService.ts   # Pure TypeScript Standard MIDI File (.mid) binary encoder
│   │   ├── projectService.ts# .aamc project creation, loading & saving
│   │   └── aiService.ts     # AI Co-Producer service with Gemini provider & offline fallbacks
│   └── types/               # TypeScript interfaces & domain types
├── electron-builder.yml     # Windows NSIS & Portable installer configuration
├── server.ts                # Express full-stack server proxying Gemini API calls
└── package.json
```

---

## 🎵 Features Included

1. **Ableton Live 12 Masterclasses**: Step-by-step curriculum for Operator, Wavetable, Roar, Kick/Bass phase alignment, and sidechain compression.
2. **Interactive MIDI Generator**: Visual piano roll with 1-click `.mid` export for Ableton Live.
3. **16-Step Drum Machine**: Program electronic kick, snare, hi-hats, and percussion loops.
4. **Psytrance & Techno Bass Generator**: Synthesize 16th rolling basslines, Goa gallops, and techno rumbles.
5. **Sound Design Laboratory**: Device breakdowns and patch recipes for Operator FM, Wavetable acid, and Roar overdrive.
6. **Track Spectrum Analyzer**: Live frequency visualizer, LUFS/RMS loudness meter, and AI mix assessment.
7. **Arrangement Blueprint**: 128-bar timeline guides for Psytrance and Techno drops.
8. **AI Co-Producer Assistant**: Real-time studio assistant for Ableton Live 12 device questions.

---

## 📄 License
Apache-2.0
