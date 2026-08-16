import React from 'react';
import { AAMCProject } from '../../types';

interface InstructionalImageRendererProps {
  // Can be a bundled diagram key, custom image URI (data URL / blob / remote), or fallback key
  diagramType?: string;
  imageUri?: string;
  customImageUri?: string | null;
  defaultImageKey?: string;
  beforeImageKey?: string;
  afterImageKey?: string;
  beforeImageUri?: string;
  afterImageUri?: string;
  isBeforeAfterMode?: boolean;
  splitPosition?: number; // 0 - 100
  project?: AAMCProject;
  altText?: string;
  className?: string;
}

export const InstructionalImageRenderer: React.FC<InstructionalImageRendererProps> = ({
  diagramType,
  imageUri,
  customImageUri,
  defaultImageKey = 'waveform_kick_bass',
  beforeImageKey,
  afterImageKey,
  beforeImageUri,
  afterImageUri,
  isBeforeAfterMode = false,
  splitPosition = 50,
  project,
  altText = 'Instructional Music Production Graphic',
  className = '',
}) => {
  const bpm = project?.bpm || 142;
  const rootKey = project?.key || 'F#';
  const effectiveKey = diagramType || defaultImageKey;

  // Render a specific visual surface (image URI or high-definition pedagogical SVG diagram)
  const renderSurface = (keyOrUri?: string, uriOverride?: string) => {
    // 1. If an explicit custom or uploaded image URI is provided, render it directly
    const directUri = uriOverride || (keyOrUri && (keyOrUri.startsWith('data:') || keyOrUri.startsWith('http') || keyOrUri.startsWith('blob:') || keyOrUri.startsWith('/')) ? keyOrUri : null);

    if (directUri) {
      return (
        <img
          src={directUri}
          alt={altText}
          className="w-full h-full object-contain select-none"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      );
    }

    const key = keyOrUri || effectiveKey;

    // 2. High-Definition Vector Diagrams for Music Production
    switch (key) {
      // -------------------------------------------------------------
      // A. WAVEFORM: KICK DRUM
      // -------------------------------------------------------------
      case 'waveform_kick':
      case 'psy_kick_waveform':
        return (
          <svg viewBox="0 0 1000 600" className="w-full h-full bg-[#111317] select-none">
            <defs>
              <linearGradient id="kickGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="18%" stopColor="#90FF00" />
                <stop offset="60%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#3366FF" />
              </linearGradient>
              <linearGradient id="gridGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E232D" />
                <stop offset="100%" stopColor="#14171E" />
              </linearGradient>
            </defs>

            {/* Grid & Ruler */}
            <rect x="0" y="0" width="1000" height="600" fill="url(#gridGrad)" />
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 100} y1="40" x2={i * 100} y2="560" stroke="#252C39" strokeWidth="1" />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h-${i}`} x1="40" y1={60 + i * 60} x2="960" y2={60 + i * 60} stroke="#252C39" strokeWidth="1" />
            ))}
            <line x1="40" y1="300" x2="960" y2="300" stroke="#3A4659" strokeWidth="2" />

            {/* Time Marker Bar */}
            <rect x="40" y="20" width="920" height="24" fill="#181D26" rx="4" />
            <text x="50" y="37" fill="#8E9AA8" fontSize="12" fontFamily="monospace">0.0 ms (Transient Click)</text>
            <text x="250" y="37" fill="#8E9AA8" fontSize="12" fontFamily="monospace">35.0 ms (Body Punch)</text>
            <text x="600" y="37" fill="#8E9AA8" fontSize="12" fontFamily="monospace">110.0 ms (Sub Tail Decay)</text>
            <text x="880" y="37" fill="#8E9AA8" fontSize="12" fontFamily="monospace">160 ms (1/16 beat)</text>

            {/* Kick Waveform Path */}
            <path
              d="M 50 300 
                 C 55 100, 65 80, 75 480 
                 C 85 120, 100 150, 120 440 
                 C 140 180, 170 200, 200 400 
                 C 240 220, 280 240, 320 370 
                 C 380 250, 440 260, 500 345 
                 C 580 270, 660 280, 730 325 
                 C 800 290, 870 295, 930 305 
                 L 950 300"
              fill="none"
              stroke="url(#kickGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Kick Envelope Fill Area */}
            <path
              d="M 50 300 
                 C 55 100, 65 80, 75 480 
                 C 85 120, 100 150, 120 440 
                 C 140 180, 170 200, 200 400 
                 C 240 220, 280 240, 320 370 
                 C 380 250, 440 260, 500 345 
                 C 580 270, 660 280, 730 325 
                 C 800 290, 870 295, 930 305 
                 L 950 300 Z"
              fill="#00E5FF"
              fillOpacity="0.08"
            />

            {/* Region Annotations */}
            <rect x="50" y="70" width="130" height="460" fill="#00E5FF" fillOpacity="0.06" stroke="#00E5FF" strokeDasharray="4 4" rx="6" />
            <text x="60" y="95" fill="#00E5FF" fontSize="13" fontWeight="bold">TRANSIENT (CLICK)</text>
            <text x="60" y="115" fill="#A0C8D0" fontSize="11">High-frequency beater (2kHz - 8kHz)</text>

            <rect x="200" y="150" width="220" height="300" fill="#90FF00" fillOpacity="0.06" stroke="#90FF00" strokeDasharray="4 4" rx="6" />
            <text x="210" y="175" fill="#90FF00" fontSize="13" fontWeight="bold">BODY PUNCH (80Hz - 120Hz)</text>
            <text x="210" y="195" fill="#C0E0B0" fontSize="11">Chest punch fundamental</text>

            <rect x="460" y="220" width="470" height="170" fill="#3366FF" fillOpacity="0.06" stroke="#3366FF" strokeDasharray="4 4" rx="6" />
            <text x="470" y="245" fill="#7099FF" fontSize="13" fontWeight="bold">SUB TAIL & DECAY (40Hz - 60Hz)</text>
            <text x="470" y="265" fill="#B0C5FF" fontSize="11">Decays smoothly before Bass Note 1 arrives at 16th note mark</text>
          </svg>
        );

      // -------------------------------------------------------------
      // B. WAVEFORM: KICK + ROLLING BASS (PHASE & ALIGNMENT)
      // -------------------------------------------------------------
      case 'waveform_kick_bass':
      case 'psy_kb_alignment':
        return (
          <svg viewBox="0 0 1000 600" className="w-full h-full bg-[#0E1116] select-none">
            <rect x="0" y="0" width="1000" height="600" fill="#0E1116" />
            
            {/* Header / Beat Grid */}
            <rect x="30" y="20" width="940" height="36" fill="#171C24" rx="6" />
            <text x="50" y="44" fill="#90FF00" fontSize="14" fontWeight="bold" fontFamily="monospace">BEAT 1.1 (KICK)</text>
            <text x="290" y="44" fill="#00E5FF" fontSize="14" fontWeight="bold" fontFamily="monospace">1.2 (BASS 1 - DUCKED)</text>
            <text x="530" y="44" fill="#00E5FF" fontSize="14" fontWeight="bold" fontFamily="monospace">1.3 (BASS 2 - ACCENT)</text>
            <text x="770" y="44" fill="#00E5FF" fontSize="14" fontWeight="bold" fontFamily="monospace">1.4 (BASS 3 - ROLLING)</text>

            {/* Vertical 16th Beat Dividers */}
            <line x1="270" y1="65" x2="270" y2="540" stroke="#FF0055" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="510" y1="65" x2="510" y2="540" stroke="#2A3444" strokeWidth="1" />
            <line x1="750" y1="65" x2="750" y2="540" stroke="#2A3444" strokeWidth="1" />

            {/* Center Zero Line */}
            <line x1="30" y1="300" x2="970" y2="300" stroke="#283240" strokeWidth="2" />

            {/* Kick Waveform (Left Section) */}
            <path
              d="M 40 300 C 45 90, 55 70, 65 510 C 75 110, 90 140, 110 460 C 130 170, 155 200, 180 410 C 210 230, 235 270, 255 315 L 265 300"
              fill="none"
              stroke="#90FF00"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Bass 1 (1.2) - Ducked under Kick tail */}
            <path
              d="M 275 300 C 295 240, 320 220, 345 380 C 370 230, 400 240, 430 360 C 460 260, 485 275, 500 300"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Bass 2 (1.3) - Full Peak Body */}
            <path
              d="M 515 300 C 535 150, 560 130, 585 470 C 610 140, 640 160, 670 440 C 700 200, 725 230, 740 300"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Bass 3 (1.4) - Driving Rolling Tail */}
            <path
              d="M 755 300 C 775 170, 800 150, 825 450 C 850 160, 880 180, 910 420 C 940 220, 960 250, 970 300"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Sidechain Gap / Phase Alignment Indicator */}
            <rect x="250" y="80" width="40" height="440" fill="#FF0055" fillOpacity="0.12" stroke="#FF0055" strokeWidth="1.5" rx="4" />
            <text x="270" y="110" fill="#FF0055" fontSize="12" fontWeight="bold" textAnchor="middle">PHASE GAP</text>
            <text x="270" y="130" fill="#FF88A0" fontSize="10" textAnchor="middle">Sidechain / Cut</text>

            {/* Bottom Status Legend */}
            <rect x="30" y="525" width="940" height="55" fill="#141820" rx="8" />
            <text x="50" y="555" fill="#E0E0E0" fontSize="12">
              <tspan fill="#90FF00" fontWeight="bold">● KICK (138-145 BPM):</tspan> Ends cleanly before 1.2 &nbsp;|&nbsp; 
              <tspan fill="#00E5FF" fontWeight="bold">● BASS 1 (16th note):</tspan> Tuned to {rootKey}1 (approx 46-55 Hz) &nbsp;|&nbsp; 
              <tspan fill="#FFB800" fontWeight="bold">● SIDECHAIN DUCK:</tspan> Prevents low-end phase collision
            </text>
          </svg>
        );

      // -------------------------------------------------------------
      // C. HARDWARE / PLUGIN COMPRESSOR INTERFACE
      // -------------------------------------------------------------
      case 'compressor_ui':
      case 'mixing_compressor':
        return (
          <svg viewBox="0 0 1000 600" className="w-full h-full bg-[#16181D] select-none">
            {/* Outer Chassis */}
            <rect x="20" y="20" width="960" height="560" rx="14" fill="#1E222A" stroke="#2F3644" strokeWidth="3" />
            
            {/* Header Panel */}
            <rect x="40" y="40" width="920" height="50" rx="8" fill="#14171E" />
            <circle cx="65" cy="65" r="8" fill="#90FF00" />
            <text x="85" y="70" fill="#FFFFFF" fontSize="18" fontWeight="bold" letterSpacing="1.5">PRO DYNAMICS COMPRESSOR // LIVE 12</text>
            <text x="830" y="70" fill="#00E5FF" fontSize="13" fontFamily="monospace">PEAK / RMS</text>

            {/* Gain Reduction Meter Display */}
            <rect x="40" y="110" width="920" height="130" rx="8" fill="#0B0D11" stroke="#252C39" />
            <text x="60" y="135" fill="#8898AA" fontSize="11" fontFamily="monospace">GAIN REDUCTION (dB)</text>
            <line x1="60" y1="170" x2="940" y2="170" stroke="#1E2633" strokeWidth="2" />
            {[-24, -18, -12, -9, -6, -3, -1, 0].map((db, i) => {
              const xPos = 60 + i * 125;
              return (
                <g key={i}>
                  <line x1={xPos} y1="160" x2={xPos} y2="180" stroke="#3A4659" strokeWidth="1.5" />
                  <text x={xPos} y="200" fill="#718294" fontSize="10" textAnchor="middle" fontFamily="monospace">{db}</text>
                </g>
              );
            })}
            {/* Active GR Needle / Bar */}
            <rect x="435" y="152" width="505" height="16" fill="url(#grGrad)" rx="3" />
            <defs>
              <linearGradient id="grGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#90FF00" />
                <stop offset="60%" stopColor="#FFB800" />
                <stop offset="100%" stopColor="#FF0055" />
              </linearGradient>
            </defs>
            <text x="435" y="145" fill="#FFB800" fontSize="13" fontWeight="bold" fontFamily="monospace">-6.2 dB GR</text>

            {/* Main Knob Controls Grid */}
            {/* Knob 1: THRESHOLD */}
            <g transform="translate(90, 270)">
              <circle cx="60" cy="70" r="55" fill="#14171E" stroke="#00E5FF" strokeWidth="4" />
              <line x1="60" y1="70" x2="25" y2="40" stroke="#00E5FF" strokeWidth="5" strokeLinecap="round" />
              <text x="60" y="155" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle">THRESHOLD</text>
              <rect x="15" y="165" width="90" height="24" rx="4" fill="#0A0C10" />
              <text x="60" y="181" fill="#00E5FF" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">-18.0 dB</text>
            </g>

            {/* Knob 2: RATIO */}
            <g transform="translate(260, 270)">
              <circle cx="60" cy="70" r="55" fill="#14171E" stroke="#90FF00" strokeWidth="4" />
              <line x1="60" y1="70" x2="75" y2="20" stroke="#90FF00" strokeWidth="5" strokeLinecap="round" />
              <text x="60" y="155" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle">RATIO</text>
              <rect x="15" y="165" width="90" height="24" rx="4" fill="#0A0C10" />
              <text x="60" y="181" fill="#90FF00" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">4.0 : 1</text>
            </g>

            {/* Knob 3: ATTACK */}
            <g transform="translate(430, 270)">
              <circle cx="60" cy="70" r="55" fill="#14171E" stroke="#FFB800" strokeWidth="3" />
              <line x1="60" y1="70" x2="35" y2="95" stroke="#FFB800" strokeWidth="5" strokeLinecap="round" />
              <text x="60" y="155" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle">ATTACK</text>
              <rect x="15" y="165" width="90" height="24" rx="4" fill="#0A0C10" />
              <text x="60" y="181" fill="#FFB800" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">15.0 ms</text>
            </g>

            {/* Knob 4: RELEASE */}
            <g transform="translate(600, 270)">
              <circle cx="60" cy="70" r="55" fill="#14171E" stroke="#FFB800" strokeWidth="3" />
              <line x1="60" y1="70" x2="85" y2="35" stroke="#FFB800" strokeWidth="5" strokeLinecap="round" />
              <text x="60" y="155" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle">RELEASE</text>
              <rect x="15" y="165" width="90" height="24" rx="4" fill="#0A0C10" />
              <text x="60" y="181" fill="#FFB800" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">60.0 ms</text>
            </g>

            {/* Knob 5: MAKEUP GAIN */}
            <g transform="translate(770, 270)">
              <circle cx="60" cy="70" r="55" fill="#14171E" stroke="#00E5FF" strokeWidth="3" />
              <line x1="60" y1="70" x2="90" y2="70" stroke="#00E5FF" strokeWidth="5" strokeLinecap="round" />
              <text x="60" y="155" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle">MAKEUP GAIN</text>
              <rect x="15" y="165" width="90" height="24" rx="4" fill="#0A0C10" />
              <text x="60" y="181" fill="#00E5FF" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">+4.5 dB</text>
            </g>

            {/* Bottom Footer Info */}
            <rect x="40" y="490" width="920" height="60" rx="8" fill="#12151B" />
            <text x="60" y="525" fill="#90FF00" fontSize="12" fontWeight="bold">💡 SIDECHAIN MODE:</text>
            <text x="210" y="525" fill="#A8B8C8" fontSize="12">Internal Filter Enabled (Low Cut 120 Hz) — Prevents sub pumping</text>
          </svg>
        );

      // -------------------------------------------------------------
      // D. PARAMETRIC EQ FREQUENCY SPECTRUM (20Hz - 20kHz)
      // -------------------------------------------------------------
      case 'eq_spectrum':
      case 'mixing_eq':
        return (
          <svg viewBox="0 0 1000 600" className="w-full h-full bg-[#0D1017] select-none">
            {/* Background Grid */}
            <rect x="0" y="0" width="1000" height="600" fill="#0D1017" />
            
            {/* Frequency Bands Background Shading */}
            {/* Sub Band */}
            <rect x="50" y="50" width="150" height="460" fill="#3366FF" fillOpacity="0.08" />
            <text x="125" y="80" fill="#5588FF" fontSize="12" fontWeight="bold" textAnchor="middle">SUB (20-60Hz)</text>

            {/* Bass Band */}
            <rect x="200" y="50" width="180" height="460" fill="#00E5FF" fillOpacity="0.06" />
            <text x="290" y="80" fill="#00E5FF" fontSize="12" fontWeight="bold" textAnchor="middle">BASS (60-250Hz)</text>

            {/* Low-Mid Band (Mud Zone) */}
            <rect x="380" y="50" width="220" height="460" fill="#FFB800" fillOpacity="0.08" />
            <text x="490" y="80" fill="#FFB800" fontSize="12" fontWeight="bold" textAnchor="middle">LOW-MIDS / MUD (250-800Hz)</text>

            {/* Highs & Air */}
            <rect x="600" y="50" width="350" height="460" fill="#90FF00" fillOpacity="0.06" />
            <text x="775" y="80" fill="#90FF00" fontSize="12" fontWeight="bold" textAnchor="middle">HIGHS & AIR (4kHz-20kHz)</text>

            {/* Grid Lines */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`db-${i}`} x1="50" y1={80 + i * 50} x2="950" y2={80 + i * 50} stroke="#1A2230" strokeWidth="1" />
            ))}
            <line x1="50" y1="280" x2="950" y2="280" stroke="#37455C" strokeWidth="2" />
            <text x="30" y="284" fill="#889CB5" fontSize="11" fontFamily="monospace">0dB</text>

            {/* Parametric EQ Curve */}
            <path
              d="M 50 480 
                 C 90 480, 110 460, 130 280 
                 C 200 280, 240 230, 280 230 
                 C 320 230, 360 280, 420 280 
                 C 460 280, 480 340, 500 340 
                 C 520 340, 540 280, 600 280 
                 C 680 280, 750 250, 840 210 
                 L 950 210"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* EQ Fill */}
            <path
              d="M 50 480 
                 C 90 480, 110 460, 130 280 
                 C 200 280, 240 230, 280 230 
                 C 320 230, 360 280, 420 280 
                 C 460 280, 480 340, 500 340 
                 C 520 340, 540 280, 600 280 
                 C 680 280, 750 250, 840 210 
                 L 950 210 L 950 280 L 50 280 Z"
              fill="#00E5FF"
              fillOpacity="0.12"
            />

            {/* Node 1: Low Cut (High Pass Filter) */}
            <circle cx="130" cy="280" r="10" fill="#FF0055" stroke="#FFFFFF" strokeWidth="2" />
            <text x="130" y="260" fill="#FF0055" fontSize="12" fontWeight="bold" textAnchor="middle">① HPF (30Hz)</text>

            {/* Node 2: Bass Punch Boost */}
            <circle cx="280" cy="230" r="10" fill="#90FF00" stroke="#FFFFFF" strokeWidth="2" />
            <text x="280" y="210" fill="#90FF00" fontSize="12" fontWeight="bold" textAnchor="middle">② +2.5dB @ 85Hz</text>

            {/* Node 3: Mud Clean Notch */}
            <circle cx="500" cy="340" r="10" fill="#FFB800" stroke="#FFFFFF" strokeWidth="2" />
            <text x="500" y="370" fill="#FFB800" fontSize="12" fontWeight="bold" textAnchor="middle">③ -3.5dB @ 320Hz (Mud Cut)</text>

            {/* Node 4: High Air Shelf */}
            <circle cx="840" cy="210" r="10" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="2" />
            <text x="840" y="190" fill="#00E5FF" fontSize="12" fontWeight="bold" textAnchor="middle">④ +3.0dB High Shelf (10kHz)</text>

            {/* Frequency Axis */}
            <rect x="50" y="520" width="900" height="35" rx="6" fill="#141B26" />
            {['20Hz', '50Hz', '100Hz', '250Hz', '500Hz', '1kHz', '2kHz', '5kHz', '10kHz', '20kHz'].map((hz, i) => (
              <text key={i} x={70 + i * 92} y="542" fill="#7E93AC" fontSize="11" fontFamily="monospace">{hz}</text>
            ))}
          </svg>
        );

      // -------------------------------------------------------------
      // E. MIDI PIANO ROLL (ROLLING BASS & PATTERNS)
      // -------------------------------------------------------------
      case 'piano_roll_bass':
      case 'psy_piano_roll':
        return (
          <svg viewBox="0 0 1000 600" className="w-full h-full bg-[#15171C] select-none">
            {/* Piano Keys Sidebar */}
            <rect x="0" y="0" width="100" height="600" fill="#1E222A" />
            {['G1', 'F#1', 'F1', 'E1', 'D#1', 'D1', 'C#1', 'C1'].map((note, i) => {
              const isSharp = note.includes('#');
              const yPos = 40 + i * 65;
              return (
                <g key={i}>
                  <rect x="0" y={yPos} width="100" height="60" fill={isSharp ? '#0D0F14' : '#2A303C'} stroke="#15171C" />
                  <text x="80" y={yPos + 35} fill={note === `${rootKey}1` ? '#90FF00' : '#A4B4C6'} fontSize="13" fontWeight="bold" textAnchor="end">{note}</text>
                </g>
              );
            })}

            {/* Grid Area */}
            <rect x="100" y="0" width="900" height="600" fill="#12141A" />
            {/* 16th Note Columns */}
            {Array.from({ length: 16 }).map((_, i) => {
              const isBeat = i % 4 === 0;
              const xPos = 100 + i * 56.25;
              return (
                <g key={i}>
                  <line x1={xPos} y1="0" x2={xPos} y2="520" stroke={isBeat ? '#333D4F' : '#1C2330'} strokeWidth={isBeat ? 2 : 1} />
                  {isBeat && (
                    <text x={xPos + 5} y="25" fill="#8EA0B6" fontSize="11" fontFamily="monospace">1.{i / 4 + 1}</text>
                  )}
                </g>
              );
            })}

            {/* Pitch Rows */}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1="100" y1={40 + i * 65} x2="1000" y2={40 + i * 65} stroke="#1C2330" strokeWidth="1" />
            ))}

            {/* Root Note Highlight Line (F#1 or Project Key) */}
            <rect x="100" y="105" width="900" height="60" fill="#90FF00" fillOpacity="0.06" />

            {/* Active 16th Rolling Bass MIDI Notes (K B B B) */}
            {/* Beat 1: K (Kick - Rest/Sidechain gap), B1, B2, B3 */}
            <rect x="156.25" y="112" width="48" height="46" rx="4" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="180" y="140" fill="#000" fontSize="11" fontWeight="bold" textAnchor="middle">B1</text>

            <rect x="212.5" y="112" width="48" height="46" rx="4" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="236" y="140" fill="#000" fontSize="11" fontWeight="bold" textAnchor="middle">B2</text>

            <rect x="268.75" y="112" width="48" height="46" rx="4" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="292" y="140" fill="#000" fontSize="11" fontWeight="bold" textAnchor="middle">B3</text>

            {/* Beat 2: K, B1, B2, B3 */}
            <rect x="381.25" y="112" width="48" height="46" rx="4" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="437.5" y="112" width="48" height="46" rx="4" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="493.75" y="112" width="48" height="46" rx="4" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Beat 3: K, B1, B2, B3 */}
            <rect x="606.25" y="112" width="48" height="46" rx="4" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="662.5" y="112" width="48" height="46" rx="4" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="718.75" y="112" width="48" height="46" rx="4" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Beat 4: Variation note on G1 */}
            <rect x="831.25" y="112" width="48" height="46" rx="4" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="887.5" y="47" width="48" height="46" rx="4" fill="#FFB800" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="911" y="75" fill="#000" fontSize="11" fontWeight="bold" textAnchor="middle">G1</text>
            <rect x="943.75" y="112" width="48" height="46" rx="4" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Bottom Velocity Lane */}
            <rect x="100" y="520" width="900" height="80" fill="#0F1117" strokeTop="#222" />
            <text x="110" y="540" fill="#667788" fontSize="10" fontFamily="monospace">VELOCITY LANE (MIDI 0 - 127)</text>
            {/* Velocity Stems */}
            {[
              { x: 180, v: 95 }, { x: 236, v: 110 }, { x: 292, v: 120 },
              { x: 405, v: 95 }, { x: 461, v: 110 }, { x: 517, v: 120 },
              { x: 630, v: 95 }, { x: 686, v: 110 }, { x: 742, v: 120 },
              { x: 855, v: 95 }, { x: 911, v: 127 }, { x: 967, v: 120 },
            ].map((stem, i) => (
              <g key={i}>
                <line x1={stem.x} y1="595" x2={stem.x} y2={595 - stem.v * 0.4} stroke="#90FF00" strokeWidth="3" />
                <circle cx={stem.x} cy={595 - stem.v * 0.4} r="4" fill="#90FF00" />
              </g>
            ))}
          </svg>
        );

      // -------------------------------------------------------------
      // F. SYNTHESIZER SIGNAL FLOW (OSC -> FILTER -> AMP + ENV/LFO)
      // -------------------------------------------------------------
      case 'synth_signal_flow':
      case 'sound_design_synth':
        return (
          <svg viewBox="0 0 1000 600" className="w-full h-full bg-[#11141A] select-none">
            {/* Header */}
            <rect x="30" y="20" width="940" height="45" rx="8" fill="#1A1F29" />
            <text x="50" y="50" fill="#FFFFFF" fontSize="16" fontWeight="bold">SYNTHESIZER SIGNAL FLOW (SUBTRACTIVE & FM ARCHITECTURE)</text>

            {/* Block 1: OSCILLATORS (Sound Source) */}
            <g transform="translate(50, 90)">
              <rect x="0" y="0" width="220" height="260" rx="10" fill="#181D26" stroke="#00E5FF" strokeWidth="2" />
              <text x="20" y="30" fill="#00E5FF" fontSize="14" fontWeight="bold">1. OSCILLATORS</text>
              <rect x="15" y="45" width="190" height="55" rx="6" fill="#11141A" />
              <text x="25" y="70" fill="#FFF" fontSize="12">OSC A: Sawtooth / Wavetable</text>
              <text x="25" y="88" fill="#8899AA" fontSize="10">Pitch: {rootKey}1 (Harmonics)</text>

              <rect x="15" y="110" width="190" height="55" rx="6" fill="#11141A" />
              <text x="25" y="135" fill="#FFF" fontSize="12">OSC B: Sub Sine (-1 Oct)</text>
              <text x="25" y="153" fill="#8899AA" fontSize="10">Pure low-end foundation</text>

              <rect x="15" y="175" width="190" height="70" rx="6" fill="#11141A" />
              <text x="25" y="200" fill="#FFB800" fontSize="12">NOISE / FM MOD</text>
              <text x="25" y="220" fill="#8899AA" fontSize="10">Transient click injection</text>
            </g>

            {/* Arrow 1 */}
            <path d="M 270 220 L 340 220" stroke="#00E5FF" strokeWidth="4" markerEnd="url(#arrowCyan)" />

            {/* Block 2: FILTER (Timbre Shaping) */}
            <g transform="translate(350, 90)">
              <rect x="0" y="0" width="240" height="260" rx="10" fill="#181D26" stroke="#90FF00" strokeWidth="2" />
              <text x="20" y="30" fill="#90FF00" fontSize="14" fontWeight="bold">2. LOWPASS FILTER (24dB)</text>
              
              {/* Filter Graph */}
              <rect x="15" y="45" width="210" height="110" rx="6" fill="#0F1218" />
              <path d="M 25 100 L 120 100 Q 150 70 170 140 L 215 150" fill="none" stroke="#90FF00" strokeWidth="3" />
              <text x="25" y="70" fill="#90FF00" fontSize="11" fontWeight="bold">CUTOFF: 850 Hz</text>
              <text x="130" y="70" fill="#FFB800" fontSize="11">RES: 35%</text>

              {/* Filter Drive */}
              <rect x="15" y="165" width="210" height="80" rx="6" fill="#11141A" />
              <text x="25" y="190" fill="#FFF" fontSize="12">DRIVE / SATURATION</text>
              <text x="25" y="210" fill="#A8B8C8" fontSize="10">Adds warmth and odd harmonics</text>
            </g>

            {/* Arrow 2 */}
            <path d="M 590 220 L 660 220" stroke="#90FF00" strokeWidth="4" />

            {/* Block 3: AMPLIFIER & FX */}
            <g transform="translate(670, 90)">
              <rect x="0" y="0" width="260" height="260" rx="10" fill="#181D26" stroke="#FF0055" strokeWidth="2" />
              <text x="20" y="30" fill="#FF0055" fontSize="14" fontWeight="bold">3. VCA / AMPLIFIER & OUTPUT</text>

              <rect x="15" y="45" width="230" height="90" rx="6" fill="#11141A" />
              <text x="25" y="70" fill="#FFF" fontSize="12">VOLUME ENVELOPE (ADSR)</text>
              <text x="25" y="90" fill="#8899AA" fontSize="10">Attack: 0.5ms | Decay: 120ms</text>
              <text x="25" y="110" fill="#8899AA" fontSize="10">Sustain: 0% | Release: 15ms</text>

              <rect x="15" y="145" width="230" height="100" rx="6" fill="#11141A" />
              <text x="25" y="170" fill="#00E5FF" fontSize="12">MASTER OUTPUT / MONO SUB</text>
              <text x="25" y="190" fill="#8899AA" fontSize="10">Tuned Output Volume: -6.0 dB</text>
              <text x="25" y="210" fill="#90FF00" fontSize="10">Utility: Bass Mono &lt; 120 Hz</text>
            </g>

            {/* Bottom Modulation Rack (Envelopes + LFOs) */}
            <g transform="translate(50, 375)">
              <rect x="0" y="0" width="880" height="190" rx="10" fill="#141820" stroke="#3A4659" />
              <text x="25" y="30" fill="#FFB800" fontSize="14" fontWeight="bold">MODULATION ENGINE (ENVELOPES & LFOs)</text>

              {/* Envelope 1 (Pitch Env) */}
              <rect x="25" y="45" width="260" height="125" rx="6" fill="#0E1117" />
              <text x="35" y="70" fill="#00E5FF" fontSize="12" fontWeight="bold">PITCH ENVELOPE (Fast Click)</text>
              <path d="M 40 145 L 60 90 L 110 145 L 260 145" fill="none" stroke="#00E5FF" strokeWidth="2.5" />
              <text x="35" y="160" fill="#718294" fontSize="10">+24 Semitones Decay in 8ms</text>

              {/* Envelope 2 (Filter Env) */}
              <rect x="310" y="45" width="260" height="125" rx="6" fill="#0E1117" />
              <text x="320" y="70" fill="#90FF00" fontSize="12" fontWeight="bold">FILTER ENVELOPE (Cutoff Pluck)</text>
              <path d="M 325 145 L 335 90 L 410 145 L 545 145" fill="none" stroke="#90FF00" strokeWidth="2.5" />
              <text x="320" y="160" fill="#718294" fontSize="10">Attack: 1ms | Decay: 95ms Pluck</text>

              {/* LFO 1 */}
              <rect x="595" y="45" width="285" height="125" rx="6" fill="#0E1117" />
              <text x="605" y="70" fill="#FF0055" fontSize="12" fontWeight="bold">LFO 1 (Synced 1/16 Modulation)</text>
              <path d="M 610 120 Q 640 80 670 120 T 730 120 T 790 120 T 850 120" fill="none" stroke="#FF0055" strokeWidth="2.5" />
              <text x="605" y="160" fill="#718294" fontSize="10">Rate: 1/16 Sync | Target: Wavetable Pos</text>
            </g>
          </svg>
        );

      // -------------------------------------------------------------
      // G. 16-STEP DRUM PATTERN GRID (PSY / TECHNO)
      // -------------------------------------------------------------
      case 'drum_pattern_grid':
      case 'drums_sequencer':
        return (
          <svg viewBox="0 0 1000 600" className="w-full h-full bg-[#101318] select-none">
            {/* Header */}
            <rect x="30" y="20" width="940" height="40" rx="6" fill="#191F2B" />
            <text x="50" y="46" fill="#FFFFFF" fontSize="15" fontWeight="bold">16-STEP DRUM GRID // {bpm} BPM</text>

            {/* Grid Header Steps */}
            {Array.from({ length: 16 }).map((_, i) => {
              const x = 160 + i * 50;
              const isBeat = i % 4 === 0;
              return (
                <g key={i}>
                  <rect x={x} y="75" width="44" height="24" rx="4" fill={isBeat ? '#252F40' : '#141820'} />
                  <text x={x + 22} y="91" fill={isBeat ? '#90FF00' : '#8898AA'} fontSize="11" fontWeight="bold" textAnchor="middle">{i + 1}</text>
                </g>
              );
            })}

            {/* Track 1: KICK (1, 5, 9, 13) */}
            <g transform="translate(30, 110)">
              <rect x="0" y="0" width="120" height="60" rx="6" fill="#1C2330" />
              <text x="20" y="36" fill="#90FF00" fontSize="14" fontWeight="bold">KICK (4/4)</text>
              {Array.from({ length: 16 }).map((_, i) => {
                const active = i % 4 === 0;
                return (
                  <rect key={i} x={130 + i * 50} y="5" width="44" height="50" rx="6" fill={active ? '#90FF00' : '#171B24'} stroke="#252E3E" />
                );
              })}
            </g>

            {/* Track 2: OPEN HAT (Offbeat: 3, 7, 11, 15) */}
            <g transform="translate(30, 180)">
              <rect x="0" y="0" width="120" height="60" rx="6" fill="#1C2330" />
              <text x="20" y="36" fill="#00E5FF" fontSize="14" fontWeight="bold">OPEN HAT</text>
              {Array.from({ length: 16 }).map((_, i) => {
                const active = i % 4 === 2;
                return (
                  <rect key={i} x={130 + i * 50} y="5" width="44" height="50" rx="6" fill={active ? '#00E5FF' : '#171B24'} stroke="#252E3E" />
                );
              })}
            </g>

            {/* Track 3: CLOSED HAT (16ths with velocity groove) */}
            <g transform="translate(30, 250)">
              <rect x="0" y="0" width="120" height="60" rx="6" fill="#1C2330" />
              <text x="20" y="36" fill="#FFB800" fontSize="14" fontWeight="bold">CLOSED HAT</text>
              {Array.from({ length: 16 }).map((_, i) => {
                return (
                  <rect key={i} x={130 + i * 50} y="5" width="44" height="50" rx="6" fill={i % 2 === 1 ? '#FFB800' : '#886600'} stroke="#252E3E" />
                );
              })}
            </g>

            {/* Track 4: CLAP / SNARE (5, 13) */}
            <g transform="translate(30, 320)">
              <rect x="0" y="0" width="120" height="60" rx="6" fill="#1C2330" />
              <text x="20" y="36" fill="#FF0055" fontSize="14" fontWeight="bold">CLAP / SNARE</text>
              {Array.from({ length: 16 }).map((_, i) => {
                const active = i === 4 || i === 12;
                return (
                  <rect key={i} x={130 + i * 50} y="5" width="44" height="50" rx="6" fill={active ? '#FF0055' : '#171B24'} stroke="#252E3E" />
                );
              })}
            </g>

            {/* Track 5: PERCUSSION / CRASH */}
            <g transform="translate(30, 390)">
              <rect x="0" y="0" width="120" height="60" rx="6" fill="#1C2330" />
              <text x="20" y="36" fill="#9D4EDD" fontSize="14" fontWeight="bold">PERCUSSION</text>
              {Array.from({ length: 16 }).map((_, i) => {
                const active = i === 6 || i === 10 || i === 14;
                return (
                  <rect key={i} x={130 + i * 50} y="5" width="44" height="50" rx="6" fill={active ? '#9D4EDD' : '#171B24'} stroke="#252E3E" />
                );
              })}
            </g>

            {/* Explanatory Footer */}
            <rect x="30" y="470" width="940" height="90" rx="8" fill="#161C26" />
            <text x="50" y="505" fill="#90FF00" fontSize="13" fontWeight="bold">💡 PSYTRANCE & TECHNO GROOVE ANATOMY:</text>
            <text x="50" y="530" fill="#A8B8C8" fontSize="12">
              The Offbeat Open Hat on steps 3, 7, 11, 15 creates the essential forward driving momentum against the 4/4 Kick.
            </text>
          </svg>
        );

      // -------------------------------------------------------------
      // H. ARRANGEMENT TIMELINE (ENERGY & STRUCTURE)
      // -------------------------------------------------------------
      case 'arrangement_timeline':
      case 'psy_arrangement':
        return (
          <svg viewBox="0 0 1000 600" className="w-full h-full bg-[#0E1116] select-none">
            <rect x="30" y="20" width="940" height="40" rx="6" fill="#181D26" />
            <text x="50" y="46" fill="#FFFFFF" fontSize="15" fontWeight="bold">ARRANGEMENT TIMELINE & ENERGY MAP (7:00 MIN)</text>

            {/* Arrangement Blocks */}
            <g transform="translate(30, 80)">
              {/* Intro (1-32) */}
              <rect x="0" y="0" width="130" height="120" rx="6" fill="#00E5FF" fillOpacity="0.2" stroke="#00E5FF" strokeWidth="2" />
              <text x="65" y="40" fill="#00E5FF" fontSize="13" fontWeight="bold" textAnchor="middle">INTRO</text>
              <text x="65" y="65" fill="#FFF" fontSize="11" textAnchor="middle">Bars 1 - 32</text>
              <text x="65" y="85" fill="#8899AA" fontSize="10" textAnchor="middle">Atmosphere & Perc</text>

              {/* Build 1 (33-64) */}
              <rect x="135" y="0" width="130" height="120" rx="6" fill="#FFB800" fillOpacity="0.2" stroke="#FFB800" strokeWidth="2" />
              <text x="200" y="40" fill="#FFB800" fontSize="13" fontWeight="bold" textAnchor="middle">BUILD 1</text>
              <text x="200" y="65" fill="#FFF" fontSize="11" textAnchor="middle">Bars 33 - 64</text>
              <text x="200" y="85" fill="#8899AA" fontSize="10" textAnchor="middle">Snare Roll & Rise</text>

              {/* Drop 1 (65-128) */}
              <rect x="270" y="0" width="220" height="120" rx="6" fill="#90FF00" fillOpacity="0.25" stroke="#90FF00" strokeWidth="2" />
              <text x="380" y="40" fill="#90FF00" fontSize="14" fontWeight="bold" textAnchor="middle">DROP 1 (FULL K&B)</text>
              <text x="380" y="65" fill="#FFF" fontSize="11" textAnchor="middle">Bars 65 - 128</text>
              <text x="380" y="85" fill="#8899AA" fontSize="10" textAnchor="middle">Rolling Bass + First Lead</text>

              {/* Main Breakdown (129-160) */}
              <rect x="495" y="0" width="150" height="120" rx="6" fill="#9D4EDD" fillOpacity="0.2" stroke="#9D4EDD" strokeWidth="2" />
              <text x="570" y="40" fill="#9D4EDD" fontSize="13" fontWeight="bold" textAnchor="middle">BREAKDOWN</text>
              <text x="570" y="65" fill="#FFF" fontSize="11" textAnchor="middle">Bars 129 - 160</text>
              <text x="570" y="85" fill="#8899AA" fontSize="10" textAnchor="middle">No Kick / Melodic Theme</text>

              {/* Climax Build 2 (161-192) */}
              <rect x="650" y="0" width="110" height="120" rx="6" fill="#FF0055" fillOpacity="0.2" stroke="#FF0055" strokeWidth="2" />
              <text x="705" y="40" fill="#FF0055" fontSize="13" fontWeight="bold" textAnchor="middle">BUILD 2</text>
              <text x="705" y="65" fill="#FFF" fontSize="11" textAnchor="middle">Bars 161-192</text>

              {/* Main Peak Drop (193-256) */}
              <rect x="765" y="0" width="175" height="120" rx="6" fill="#90FF00" fillOpacity="0.35" stroke="#90FF00" strokeWidth="2" />
              <text x="852" y="40" fill="#90FF00" fontSize="14" fontWeight="bold" textAnchor="middle">PEAK DROP</text>
              <text x="852" y="65" fill="#FFF" fontSize="11" textAnchor="middle">Bars 193 - 256</text>
            </g>

            {/* Energy Curve Line */}
            <g transform="translate(30, 230)">
              <rect x="0" y="0" width="940" height="200" rx="8" fill="#121620" />
              <text x="20" y="30" fill="#8899AA" fontSize="11" fontFamily="monospace">ENERGY / TENSION CURVE (1 - 10)</text>
              
              {/* Curve Path */}
              <path
                d="M 10 170 
                   L 130 140 
                   L 260 70 
                   L 270 20 
                   L 490 20 
                   L 500 170 
                   L 640 140 
                   L 760 10 
                   L 930 10"
                fill="none"
                stroke="#FFB800"
                strokeWidth="4"
              />
            </g>

            {/* Footer Rules */}
            <rect x="30" y="450" width="940" height="110" rx="8" fill="#161C26" />
            <text x="50" y="480" fill="#00E5FF" fontSize="13" fontWeight="bold">ARRANGEMENT GOLDEN RULE:</text>
            <text x="50" y="505" fill="#E0E0E0" fontSize="12">
              Introduce or remove a sonic element every 16 or 32 bars to keep listener engagement without fatiguing the ears.
            </text>
            <text x="50" y="530" fill="#90FF00" fontSize="11">
              • Track Duration: 6:45 - 7:30 min &nbsp;|&nbsp; Key: {rootKey} Phrygian &nbsp;|&nbsp; Master Target: -8.0 LUFS
            </text>
          </svg>
        );

      // -------------------------------------------------------------
      // I. TB-303 ACID PATTERN & FILTER
      // -------------------------------------------------------------
      case '303_acid_pattern':
      case 'goa_acid_303':
        return (
          <svg viewBox="0 0 1000 600" className="w-full h-full bg-[#1A1813] select-none">
            {/* Chassis */}
            <rect x="30" y="20" width="940" height="560" rx="14" fill="#24211A" stroke="#443D2F" strokeWidth="3" />
            
            {/* Header */}
            <rect x="50" y="40" width="900" height="50" rx="8" fill="#171510" />
            <text x="70" y="72" fill="#FFB800" fontSize="20" fontWeight="bold" letterSpacing="2">BASS LINE ACID SYNTHESIZER 303</text>

            {/* Knobs Section */}
            <g transform="translate(60, 110)">
              {/* Knob 1: TUNING */}
              <g transform="translate(30, 0)">
                <circle cx="50" cy="50" r="40" fill="#151410" stroke="#FFB800" strokeWidth="3" />
                <line x1="50" y1="50" x2="50" y2="15" stroke="#FFB800" strokeWidth="4" />
                <text x="50" y="115" fill="#FFF" fontSize="12" fontWeight="bold" textAnchor="middle">TUNING</text>
              </g>

              {/* Knob 2: CUTOFF */}
              <g transform="translate(180, 0)">
                <circle cx="50" cy="50" r="40" fill="#151410" stroke="#90FF00" strokeWidth="4" />
                <line x1="50" y1="50" x2="80" y2="30" stroke="#90FF00" strokeWidth="5" />
                <text x="50" y="115" fill="#90FF00" fontSize="13" fontWeight="bold" textAnchor="middle">CUTOFF FREQ</text>
                <text x="50" y="132" fill="#90FF00" fontSize="10" textAnchor="middle">1.2 kHz</text>
              </g>

              {/* Knob 3: RESONANCE */}
              <g transform="translate(330, 0)">
                <circle cx="50" cy="50" r="40" fill="#151410" stroke="#FF0055" strokeWidth="4" />
                <line x1="50" y1="50" x2="85" y2="50" stroke="#FF0055" strokeWidth="5" />
                <text x="50" y="115" fill="#FF0055" fontSize="13" fontWeight="bold" textAnchor="middle">RESONANCE</text>
                <text x="50" y="132" fill="#FF0055" fontSize="10" textAnchor="middle">85% Squelch</text>
              </g>

              {/* Knob 4: ENV MOD */}
              <g transform="translate(480, 0)">
                <circle cx="50" cy="50" r="40" fill="#151410" stroke="#00E5FF" strokeWidth="3" />
                <line x1="50" y1="50" x2="75" y2="25" stroke="#00E5FF" strokeWidth="4" />
                <text x="50" y="115" fill="#00E5FF" fontSize="12" fontWeight="bold" textAnchor="middle">ENV MOD</text>
              </g>

              {/* Knob 5: DECAY */}
              <g transform="translate(630, 0)">
                <circle cx="50" cy="50" r="40" fill="#151410" stroke="#FFB800" strokeWidth="3" />
                <line x1="50" y1="50" x2="65" y2="18" stroke="#FFB800" strokeWidth="4" />
                <text x="50" y="115" fill="#FFF" fontSize="12" fontWeight="bold" textAnchor="middle">DECAY</text>
              </g>

              {/* Knob 6: ACCENT */}
              <g transform="translate(770, 0)">
                <circle cx="50" cy="50" r="40" fill="#151410" stroke="#90FF00" strokeWidth="4" />
                <line x1="50" y1="50" x2="80" y2="35" stroke="#90FF00" strokeWidth="5" />
                <text x="50" y="115" fill="#90FF00" fontSize="12" fontWeight="bold" textAnchor="middle">ACCENT</text>
              </g>
            </g>

            {/* 16-Step Pattern with Slide & Accent Switches */}
            <g transform="translate(50, 270)">
              <rect x="0" y="0" width="900" height="200" rx="8" fill="#14120E" stroke="#332B1F" />
              <text x="20" y="30" fill="#FFB800" fontSize="13" fontWeight="bold">16-STEP ACID PATTERN & SLIDE / ACCENT MATRIX</text>

              {/* Steps */}
              {Array.from({ length: 16 }).map((_, i) => {
                const x = 20 + i * 54;
                const hasSlide = i === 2 || i === 6 || i === 10 || i === 14;
                const hasAccent = i === 0 || i === 4 || i === 10;
                return (
                  <g key={i}>
                    {/* Step button */}
                    <rect x={x} y="45" width="46" height="40" rx="4" fill="#242018" stroke="#443A28" />
                    <text x={x + 23} y="70" fill="#FFF" fontSize="11" fontWeight="bold" textAnchor="middle">{i + 1}</text>

                    {/* Accent LED */}
                    <rect x={x} y="95" width="46" height="24" rx="3" fill={hasAccent ? '#90FF00' : '#181E10'} stroke="#2A3818" />
                    <text x={x + 23} y="111" fill={hasAccent ? '#000' : '#556644'} fontSize="9" fontWeight="bold" textAnchor="middle">ACC</text>

                    {/* Slide LED */}
                    <rect x={x} y="125" width="46" height="24" rx="3" fill={hasSlide ? '#00E5FF' : '#101C24'} stroke="#1C303E" />
                    <text x={x + 23} y="141" fill={hasSlide ? '#000' : '#335566'} fontSize="9" fontWeight="bold" textAnchor="middle">SLIDE</text>
                  </g>
                );
              })}
            </g>

            {/* Footer */}
            <rect x="50" y="490" width="900" height="60" rx="8" fill="#1C1812" />
            <text x="70" y="525" fill="#90FF00" fontSize="12" fontWeight="bold">💡 ACID TIP:</text>
            <text x="160" y="525" fill="#C8B898" fontSize="12">
              Slide ties notes together with pitch glide, while Accent opens both the volume and filter cutoff momentarily.
            </text>
          </svg>
        );

      // Default Fallback
      default:
        return (
          <svg viewBox="0 0 1000 600" className="w-full h-full bg-[#12141A] select-none">
            <rect x="0" y="0" width="1000" height="600" fill="#12141A" />
            <rect x="40" y="40" width="920" height="520" rx="12" fill="#181C26" stroke="#2E3747" strokeWidth="2" />
            <circle cx="500" cy="260" r="60" fill="#90FF00" fillOpacity="0.1" stroke="#90FF00" strokeWidth="3" />
            <text x="500" y="270" fill="#90FF00" fontSize="32" fontWeight="bold" textAnchor="middle">♫</text>
            <text x="500" y="360" fill="#FFFFFF" fontSize="18" fontWeight="bold" textAnchor="middle">
              {altText}
            </text>
            <text x="500" y="390" fill="#8898AA" fontSize="13" textAnchor="middle">
              Visual Music Production Learning Engine
            </text>
          </svg>
        );
    }
  };

  // -------------------------------------------------------------
  // BEFORE / AFTER SPLIT COMPARISON MODE
  // -------------------------------------------------------------
  if (isBeforeAfterMode && (beforeImageKey || beforeImageUri) && (afterImageKey || afterImageUri)) {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#0A0A0A] select-none ${className}`}>
        {/* Full "After" Image (Background) */}
        <div className="absolute inset-0 w-full h-full">
          {renderSurface(afterImageKey, afterImageUri)}
          <div className="absolute top-3 right-3 bg-[#90FF00] text-black text-[10px] font-bold px-2 py-0.5 rounded shadow">
            AFTER / PROCESSED
          </div>
        </div>

        {/* Clipped "Before" Image (Foreground Layer) */}
        <div
          className="absolute inset-0 h-full overflow-hidden border-r-2 border-[#00E5FF] shadow-2xl"
          style={{ width: `${splitPosition}%` }}
        >
          <div className="w-[1000px] h-[600px] max-w-none max-h-none">
            {renderSurface(beforeImageKey, beforeImageUri)}
          </div>
          <div className="absolute top-3 left-3 bg-[#FF0055] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            BEFORE / DRY
          </div>
        </div>

        {/* Drag Split Line Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-[#00E5FF] -ml-0.5 pointer-events-none flex items-center justify-center shadow-[0_0_10px_#00E5FF]"
          style={{ left: `${splitPosition}%` }}
        >
          <div className="w-6 h-6 rounded-full bg-[#00E5FF] text-black text-xs font-bold flex items-center justify-center shadow-lg">
            ↔
          </div>
        </div>
      </div>
    );
  }

  // Normal Single-Surface Render
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#0A0A0A] flex items-center justify-center ${className}`}>
      {renderSurface(imageUri || customImageUri || diagramType || defaultImageKey)}
    </div>
  );
};
