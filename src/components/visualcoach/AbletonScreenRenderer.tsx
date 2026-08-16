import React from 'react';
import { AAMCProject } from '../../types';

interface AbletonScreenRendererProps {
  imageKey: string;
  customImageUri?: string | null;
  beforeImageKey?: string;
  afterImageKey?: string;
  isBeforeAfterMode?: boolean;
  splitPosition?: number; // 0 to 100
  project?: AAMCProject;
  className?: string;
}

export const AbletonScreenRenderer: React.FC<AbletonScreenRendererProps> = ({
  imageKey,
  customImageUri,
  beforeImageKey,
  afterImageKey,
  isBeforeAfterMode = false,
  splitPosition = 50,
  project,
  className = '',
}) => {
  const bpm = project?.bpm || 142;
  const key = project?.key || 'F#';
  const scale = project?.scale || 'Phrygian';

  // If user provided an actual live screen capture or custom screenshot, render it directly
  if (customImageUri) {
    return (
      <div className={`relative w-full h-full bg-[#181818] overflow-hidden select-none ${className}`}>
        <img
          src={customImageUri}
          alt="Ableton Live 12 User Screen"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur border border-[#90FF00]/40 text-[#90FF00] px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#90FF00] animate-pulse" />
          <span>LIVE SCREEN CAPTURE</span>
        </div>
      </div>
    );
  }

  const renderScreenContent = (keyName: string) => {
    switch (keyName) {
      case 'operator-filter-envelope':
        return renderOperatorScreen(bpm, key, scale);
      case 'piano-roll-bass-16th':
        return renderPianoRollScreen(bpm, key, scale);
      case 'compressor-sidechain':
      case 'bass-with-sidechain':
        return renderCompressorSidechainScreen(bpm, key, scale);
      case 'bass-no-sidechain':
        return renderCompressorNoSidechainScreen(bpm, key, scale);
      case 'eq-eight-lowcut':
        return renderEqEightScreen(bpm, key, scale);
      case 'drift-synth-saw':
        return renderDriftScreen(bpm, key, scale);
      case 'browser-drag-operator':
        return renderBrowserScreen(bpm, key, scale);
      case 'arrangement-track-created':
        return renderArrangementTrackScreen(bpm, key, scale);
      case 'arrangement-overview':
      default:
        return renderArrangementOverviewScreen(bpm, key, scale);
    }
  };

  if (isBeforeAfterMode && beforeImageKey && afterImageKey) {
    return (
      <div className={`relative w-full h-full bg-[#181818] overflow-hidden select-none ${className}`}>
        {/* Before Layer */}
        <div className="absolute inset-0 w-full h-full">
          {renderScreenContent(beforeImageKey)}
          <div className="absolute bottom-3 left-3 bg-black/80 border border-[#FF0055]/50 text-[#FF0055] px-2 py-0.5 rounded text-[10px] font-mono font-bold">
            BEFORE (NO SIDECHAIN)
          </div>
        </div>

        {/* After Layer with Clip Path */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${splitPosition}%)` }}
        >
          {renderScreenContent(afterImageKey)}
          <div className="absolute bottom-3 right-3 bg-black/80 border border-[#90FF00]/50 text-[#90FF00] px-2 py-0.5 rounded text-[10px] font-mono font-bold">
            AFTER (WITH SIDECHAIN)
          </div>
        </div>

        {/* Split Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] pointer-events-none"
          style={{ left: `${splitPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#00E5FF] text-black text-[9px] font-bold flex items-center justify-center shadow-lg">
            ↔
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-[#1C1C1C] overflow-hidden select-none ${className}`}>
      {renderScreenContent(imageKey)}
    </div>
  );
};

// ----------------------------------------------------
// 1. ARRANGEMENT OVERVIEW SCREEN (Live 12 Authenticity)
// ----------------------------------------------------
function renderArrangementOverviewScreen(bpm: number, key: string, scale: string) {
  return (
    <div className="w-full h-full flex flex-col bg-[#1E1E1E] text-[#D0D0D0] font-sans text-xs select-none">
      {/* Top Control Bar */}
      <div className="h-8 bg-[#282828] border-b border-[#141414] flex items-center justify-between px-2 text-[11px]">
        <div className="flex items-center gap-2">
          {/* Link / Tap */}
          <div className="px-1.5 py-0.5 bg-[#1F1F1F] border border-[#3A3A3A] rounded text-[#888] font-bold text-[10px]">
            Link
          </div>
          <div className="px-1.5 py-0.5 bg-[#1F1F1F] border border-[#3A3A3A] rounded text-[#BBB] font-bold text-[10px]">
            TAP
          </div>
          {/* Tempo */}
          <div className="flex items-center bg-[#181818] border border-[#444] rounded px-2 py-0.5 text-[#90FF00] font-mono font-bold">
            <span>{bpm.toFixed(2)}</span>
            <span className="text-[#666] text-[9px] ml-1">BPM</span>
          </div>
          {/* Time Signature */}
          <div className="bg-[#181818] border border-[#444] rounded px-1.5 py-0.5 text-[#E0E0E0] font-mono font-bold">
            4 / 4
          </div>
          {/* Metronome */}
          <div className="w-5 h-5 rounded bg-[#90FF00]/20 border border-[#90FF00] text-[#90FF00] flex items-center justify-center font-bold text-[10px]">
            ●
          </div>
        </div>

        {/* Center Transport Buttons */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-[#333] border border-[#444] rounded flex items-center justify-center text-[#888] hover:text-white cursor-pointer">
            ◀
          </div>
          <div className="w-6 h-5 bg-[#90FF00] text-black font-bold rounded flex items-center justify-center cursor-pointer">
            ▶
          </div>
          <div className="w-5 h-5 bg-[#333] border border-[#444] rounded flex items-center justify-center text-[#AAA] cursor-pointer">
            ■
          </div>
          <div className="w-5 h-5 bg-[#FF0055]/30 border border-[#FF0055] text-[#FF0055] rounded-full flex items-center justify-center cursor-pointer text-[10px]">
            ●
          </div>
        </div>

        {/* Live 12 Scale Mode Indicator */}
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 bg-[#2B2818] border border-[#E5A93C]/40 rounded text-[#E5A93C] font-mono text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" />
            <span>SCALE: {key} {scale}</span>
          </div>
          <div className="px-1.5 py-0.5 bg-[#1F1F1F] border border-[#3A3A3A] rounded text-[#888] text-[10px]">
            Arrangement
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Browser Panel */}
        <div className="w-48 bg-[#232323] border-r border-[#141414] flex flex-col p-1.5 text-[11px] text-[#A0A0A0]">
          <div className="text-[9px] font-bold tracking-wider text-[#666] uppercase px-1 py-1">CATEGORIES</div>
          <div className="space-y-0.5">
            <div className="px-2 py-1 rounded bg-[#2E2E2E] text-white flex items-center gap-1.5">
              <span>🎛</span> Sounds
            </div>
            <div className="px-2 py-1 rounded hover:bg-[#2A2A2A] flex items-center gap-1.5">
              <span>🥁</span> Drums
            </div>
            <div className="px-2 py-1 rounded hover:bg-[#2A2A2A] text-[#00E5FF] flex items-center gap-1.5">
              <span>🎹</span> Instruments
            </div>
            <div className="px-2 py-1 rounded hover:bg-[#2A2A2A] text-[#90FF00] flex items-center gap-1.5">
              <span>⚡</span> Audio Effects
            </div>
            <div className="px-2 py-1 rounded hover:bg-[#2A2A2A] flex items-center gap-1.5">
              <span>🎚</span> MIDI Effects
            </div>
            <div className="px-2 py-1 rounded hover:bg-[#2A2A2A] flex items-center gap-1.5">
              <span>📦</span> Plug-ins
            </div>
          </div>
        </div>

        {/* Arrangement Timeline */}
        <div className="flex-1 flex flex-col bg-[#1A1A1A]">
          {/* Timeline Bar Ruler */}
          <div className="h-5 bg-[#252525] border-b border-[#141414] flex items-center text-[9px] font-mono text-[#777] px-2">
            <div className="w-20">1</div>
            <div className="w-20">5</div>
            <div className="w-20">9</div>
            <div className="w-20">13</div>
            <div className="w-20">17</div>
            <div className="w-20">21</div>
            <div className="w-20">25</div>
          </div>

          {/* Track Rows */}
          <div className="flex-1 flex flex-col">
            {/* Track 1: Kick */}
            <div className="h-16 border-b border-[#282828] flex">
              <div className="w-36 bg-[#2B2B2B] border-r border-[#141414] p-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-[#FF5500]">1 Kick</span>
                  <span className="w-3 h-3 bg-[#FF5500] rounded-sm" />
                </div>
                <div className="flex items-center gap-1 text-[9px] text-[#888]">
                  <span className="px-1 bg-[#1E1E1E] rounded text-white">S</span>
                  <span className="px-1 bg-[#1E1E1E] rounded">M</span>
                  <span className="font-mono text-[#00E5FF]">-1.2 dB</span>
                </div>
              </div>
              <div className="flex-1 bg-[#181818] relative flex items-center p-1">
                {/* 4 Kick Clips */}
                <div className="w-72 h-12 bg-[#FF5500]/25 border border-[#FF5500] rounded p-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#FF5500]">PsyKick_Punch_F#_142.wav</span>
                  <span className="text-[9px] font-mono text-[#999]">4/4 Audio</span>
                </div>
              </div>
            </div>

            {/* Track 2: Bass */}
            <div className="h-16 border-b border-[#282828] flex">
              <div className="w-36 bg-[#2B2B2B] border-r border-[#141414] p-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-[#00E5FF]">2 Bass</span>
                  <span className="w-3 h-3 bg-[#00E5FF] rounded-sm" />
                </div>
                <div className="flex items-center gap-1 text-[9px] text-[#888]">
                  <span className="px-1 bg-[#1E1E1E] rounded">S</span>
                  <span className="px-1 bg-[#1E1E1E] rounded">M</span>
                  <span className="font-mono text-[#00E5FF]">-3.0 dB</span>
                </div>
              </div>
              <div className="flex-1 bg-[#181818] relative flex items-center p-1">
                <div className="w-72 h-12 bg-[#00E5FF]/20 border border-[#00E5FF] rounded p-1 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-[#00E5FF]">PsyBass_Rolling_16th (MIDI)</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-xs ${
                          i % 4 === 0 ? 'bg-transparent' : 'bg-[#00E5FF]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Track 3: Acid Lead */}
            <div className="h-16 border-b border-[#282828] flex">
              <div className="w-36 bg-[#2B2B2B] border-r border-[#141414] p-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-[#90FF00]">3 Acid 303</span>
                  <span className="w-3 h-3 bg-[#90FF00] rounded-sm" />
                </div>
                <div className="flex items-center gap-1 text-[9px] text-[#888]">
                  <span className="px-1 bg-[#1E1E1E] rounded">S</span>
                  <span className="px-1 bg-[#1E1E1E] rounded">M</span>
                  <span className="font-mono text-[#90FF00]">-6.5 dB</span>
                </div>
              </div>
              <div className="flex-1 bg-[#181818] relative flex items-center p-1">
                <div className="w-72 h-12 bg-[#90FF00]/15 border border-[#90FF00]/50 rounded p-1 flex items-center">
                  <span className="text-[10px] font-mono text-[#90FF00]">303_Acid_Sequence (MIDI)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. OPERATOR DEVICE SCREEN (Filter Envelope & Osc)
// ----------------------------------------------------
function renderOperatorScreen(bpm: number, key: string, scale: string) {
  return (
    <div className="w-full h-full flex flex-col bg-[#1B1B1B] text-[#DDD] font-sans text-xs select-none">
      {/* Top Header */}
      <div className="h-7 bg-[#2A2A2A] border-b border-[#141414] flex items-center justify-between px-3 text-[11px]">
        <div className="flex items-center gap-2 font-bold text-[#00E5FF]">
          <span>🎹 Operator (Instrument)</span>
          <span className="text-[#777] font-normal text-[10px]">Track 2: Bass</span>
        </div>
        <div className="text-[10px] font-mono text-[#90FF00]">Ableton Live 12 FM Synth Engine</div>
      </div>

      {/* Operator Multi-Panel Grid */}
      <div className="flex-1 grid grid-cols-4 gap-1 p-2 bg-[#202020]">
        {/* Osc A */}
        <div className="bg-[#2A2A2A] border border-[#00E5FF]/40 rounded p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#00E5FF]">Oscillator A</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" />
          </div>
          <div className="space-y-1 my-1">
            <div className="text-[10px] text-[#888]">Waveform:</div>
            <div className="bg-[#181818] border border-[#444] rounded px-1.5 py-0.5 font-mono text-[#90FF00] font-bold">
              Saw D
            </div>
            <div className="flex justify-between text-[10px] text-[#AAA] pt-1">
              <span>Coarse: <strong className="text-white">1</strong></span>
              <span>Fine: <strong className="text-white">0</strong></span>
            </div>
            <div className="flex justify-between text-[10px] text-[#AAA]">
              <span>Level: <strong className="text-[#90FF00]">0.0 dB</strong></span>
            </div>
          </div>
          <div className="h-10 bg-[#161616] rounded border border-[#333] flex items-center justify-center">
            {/* Saw Waveform graphic */}
            <svg viewBox="0 0 100 40" className="w-full h-8 stroke-[#00E5FF] fill-none stroke-2">
              <path d="M 5,35 L 35,5 L 35,35 L 65,5 L 65,35 L 95,5 L 95,35" />
            </svg>
          </div>
        </div>

        {/* Osc B/C/D (Muted for Bass) */}
        <div className="bg-[#242424] border border-[#333] rounded p-2 opacity-60 flex flex-col justify-between">
          <span className="font-bold text-[#777]">Oscillator B (Off)</span>
          <div className="text-center text-[10px] text-[#666]">FM Sub Carrier Disabled for Pure Sub Cleanliness</div>
          <div className="h-10 bg-[#1A1A1A] rounded border border-[#2A2A2A]" />
        </div>

        {/* Filter Section */}
        <div className="bg-[#2A2A2A] border border-[#90FF00]/40 rounded p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#90FF00]">Filter (24dB LP)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#90FF00]" />
          </div>
          <div className="space-y-1 my-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-[#888]">Type:</span>
              <span className="font-mono text-white font-bold">Clean 24dB</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-[#888]">Cutoff:</span>
              <span className="font-mono text-[#90FF00] font-bold">420 Hz</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-[#888]">Resonance:</span>
              <span className="font-mono text-white">15 %</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-[#888]">Env Depth:</span>
              <span className="font-mono text-[#00E5FF] font-bold">+24.00</span>
            </div>
          </div>
          <div className="h-10 bg-[#161616] rounded border border-[#333] flex items-center justify-center">
            {/* Low Pass Curve graphic */}
            <svg viewBox="0 0 100 40" className="w-full h-8 stroke-[#90FF00] fill-none stroke-2">
              <path d="M 5,10 L 45,10 C 60,10 75,35 95,38" />
            </svg>
          </div>
        </div>

        {/* Filter Envelope Section */}
        <div className="bg-[#2A2A2A] border border-[#00E5FF]/40 rounded p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#00E5FF]">Filter Envelope</span>
            <span className="text-[10px] text-[#90FF00]">Fast Psy Snap</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] my-1 font-mono">
            <div className="bg-[#181818] p-1 rounded">
              <span className="text-[#888] block text-[8px]">ATTACK</span>
              <strong className="text-[#90FF00]">0.0 ms</strong>
            </div>
            <div className="bg-[#181818] p-1 rounded">
              <span className="text-[#888] block text-[8px]">DECAY</span>
              <strong className="text-[#00E5FF]">140 ms</strong>
            </div>
            <div className="bg-[#181818] p-1 rounded">
              <span className="text-[#888] block text-[8px]">SUSTAIN</span>
              <strong className="text-white">-inf dB</strong>
            </div>
            <div className="bg-[#181818] p-1 rounded">
              <span className="text-[#888] block text-[8px]">RELEASE</span>
              <strong className="text-white">10 ms</strong>
            </div>
          </div>
          <div className="h-10 bg-[#161616] rounded border border-[#333] flex items-center justify-center p-1">
            {/* Fast Decay Envelope graphic */}
            <svg viewBox="0 0 100 40" className="w-full h-8 stroke-[#00E5FF] fill-none stroke-2">
              <path d="M 5,35 L 8,5 L 55,35 L 95,35" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. PIANO ROLL SCREEN (Rolling 16ths in Live 12)
// ----------------------------------------------------
function renderPianoRollScreen(bpm: number, key: string, scale: string) {
  return (
    <div className="w-full h-full flex flex-col bg-[#1A1A1A] text-[#DDD] font-sans text-xs select-none">
      {/* Clip Header */}
      <div className="h-7 bg-[#282828] border-b border-[#141414] flex items-center justify-between px-3 text-[11px]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#00E5FF]">Clip: PsyBass_Rolling_16th</span>
          <span className="bg-[#181818] border border-[#444] px-1.5 py-0.5 rounded text-[10px] text-[#90FF00] font-mono">
            Length: 1.0.0 (1 Bar)
          </span>
          <span className="bg-[#2B2818] border border-[#E5A93C]/40 px-1.5 py-0.5 rounded text-[10px] text-[#E5A93C] font-mono">
            Scale: {key} {scale} (Live 12 Highlighted)
          </span>
        </div>
        <div className="text-[10px] font-mono text-[#888]">1/16 Grid • Draw Mode (B)</div>
      </div>

      {/* Grid Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Piano Keys */}
        <div className="w-16 bg-[#222] border-r border-[#141414] flex flex-col font-mono text-[9px]">
          {['G1', 'F#1 (Root)', 'F1', 'E1', 'D#1', 'D1', 'C#1'].map((note) => (
            <div
              key={note}
              className={`h-7 border-b border-[#333] flex items-center px-1.5 justify-between ${
                note.includes('Root') ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold' : 'text-[#888]'
              }`}
            >
              <span>{note}</span>
              {note.includes('Root') && <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />}
            </div>
          ))}
        </div>

        {/* 16th Note Grid Columns */}
        <div className="flex-1 flex flex-col bg-[#171717]">
          <div className="flex-1 grid grid-cols-16 gap-0 relative">
            {Array.from({ length: 16 }).map((_, stepIdx) => {
              const isKickStep = stepIdx % 4 === 0;
              const isBassStep = !isKickStep;

              return (
                <div
                  key={stepIdx}
                  className={`border-r border-[#242424] flex flex-col justify-center items-center p-0.5 relative ${
                    isKickStep ? 'bg-[#221818]/60' : 'bg-[#181818]'
                  }`}
                >
                  {/* Step Number Top */}
                  <span className="absolute top-1 text-[8px] font-mono text-[#555]">
                    {stepIdx + 1}
                  </span>

                  {/* Note placement at F#1 */}
                  {isBassStep ? (
                    <div className="w-full h-6 bg-[#00E5FF] rounded-xs shadow-[0_0_6px_#00E5FF]/60 flex items-center justify-center">
                      <span className="text-[8px] font-mono font-bold text-black">{key}1</span>
                    </div>
                  ) : (
                    <div className="w-full h-6 border border-dashed border-[#FF5500]/40 rounded-xs flex items-center justify-center">
                      <span className="text-[7px] font-mono text-[#FF5500]">KICK GAP</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Velocity Lane Bottom */}
          <div className="h-10 bg-[#1C1C1C] border-t border-[#333] flex items-end p-1 gap-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className={`w-1 rounded-t ${
                    i % 4 === 0 ? 'h-0' : i % 4 === 1 ? 'h-7 bg-[#90FF00]' : 'h-6 bg-[#00E5FF]'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. COMPRESSOR WITH SIDECHAIN SCREEN
// ----------------------------------------------------
function renderCompressorSidechainScreen(bpm: number, key: string, scale: string) {
  return (
    <div className="w-full h-full flex flex-col bg-[#1C1C1C] text-[#DDD] font-sans text-xs select-none">
      {/* Device Header */}
      <div className="h-7 bg-[#282828] border-b border-[#141414] flex items-center justify-between px-3 text-[11px]">
        <div className="flex items-center gap-2 font-bold text-[#90FF00]">
          <span>⚡ Compressor (Sidechain Active)</span>
          <span className="text-[#777] font-normal text-[10px]">Track 2: Bass</span>
        </div>
        <div className="text-[10px] font-mono text-[#00E5FF]">Gain Reduction Ducking -12dB</div>
      </div>

      <div className="flex-1 flex gap-2 p-2 bg-[#202020]">
        {/* Sidechain Routing Box */}
        <div className="w-48 bg-[#2A2A2A] border border-[#90FF00] rounded p-2 flex flex-col justify-between shadow-lg shadow-[#90FF00]/5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#90FF00] text-[11px]">Sidechain Panel</span>
            <span className="w-3 h-3 bg-[#90FF00] rounded-sm text-black text-[9px] font-bold flex items-center justify-center">
              ✓
            </span>
          </div>
          <div className="space-y-1.5 my-1">
            <div>
              <span className="text-[9px] text-[#888] block">AUDIO FROM:</span>
              <div className="bg-[#181818] border border-[#90FF00]/60 rounded px-2 py-1 font-mono text-[#90FF00] font-bold text-[11px]">
                1 - Kick (Pre FX)
              </div>
            </div>
            <div>
              <span className="text-[9px] text-[#888] block">GAIN:</span>
              <div className="bg-[#181818] border border-[#444] rounded px-2 py-0.5 font-mono text-white text-[10px]">
                0.0 dB
              </div>
            </div>
            <div>
              <span className="text-[9px] text-[#888] block">EQ FILTER:</span>
              <div className="bg-[#181818] border border-[#444] rounded px-2 py-0.5 font-mono text-[#AAA] text-[10px]">
                Off (Broadband)
              </div>
            </div>
          </div>
          <div className="text-[9px] text-[#90FF00] font-mono">Ducking Trigger: LOCKED</div>
        </div>

        {/* Compressor Main Controls */}
        <div className="flex-1 bg-[#2A2A2A] border border-[#3A3A3A] rounded p-2 flex flex-col justify-between">
          <div className="grid grid-cols-4 gap-2">
            {/* Threshold */}
            <div className="bg-[#181818] border border-[#00E5FF]/40 rounded p-1.5 flex flex-col items-center justify-center">
              <span className="text-[9px] text-[#888]">THRESHOLD</span>
              <strong className="text-sm font-mono text-[#00E5FF]">-18.0 dB</strong>
              <span className="text-[8px] text-[#666]">Ducking Depth</span>
            </div>

            {/* Ratio */}
            <div className="bg-[#181818] border border-[#444] rounded p-1.5 flex flex-col items-center justify-center">
              <span className="text-[9px] text-[#888]">RATIO</span>
              <strong className="text-sm font-mono text-white">4.00 : 1</strong>
              <span className="text-[8px] text-[#666]">Firm Ducking</span>
            </div>

            {/* Attack */}
            <div className="bg-[#181818] border border-[#444] rounded p-1.5 flex flex-col items-center justify-center">
              <span className="text-[9px] text-[#888]">ATTACK</span>
              <strong className="text-sm font-mono text-[#90FF00]">0.50 ms</strong>
              <span className="text-[8px] text-[#666]">Instant Dip</span>
            </div>

            {/* Release */}
            <div className="bg-[#181818] border border-[#444] rounded p-1.5 flex flex-col items-center justify-center">
              <span className="text-[9px] text-[#888]">RELEASE</span>
              <strong className="text-sm font-mono text-[#90FF00]">60.0 ms</strong>
              <span className="text-[8px] text-[#666]">Psy 16th Timing</span>
            </div>
          </div>

          {/* Gain Reduction Meter Display */}
          <div className="h-16 bg-[#161616] rounded border border-[#333] p-2 flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#888]">GR Meter (Live):</span>
            <div className="flex-1 mx-3 h-4 bg-[#222] rounded overflow-hidden relative">
              <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#FF5500] to-[#90FF00] w-3/4 rounded" />
              <div className="absolute top-0 bottom-0 right-0 bg-[#FF0055]/80 w-1/4" />
            </div>
            <span className="text-[10px] font-mono text-[#FF5500] font-bold">-12.4 dB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. COMPRESSOR WITHOUT SIDECHAIN SCREEN (Before view)
// ----------------------------------------------------
function renderCompressorNoSidechainScreen(bpm: number, key: string, scale: string) {
  return (
    <div className="w-full h-full flex flex-col bg-[#1C1C1C] text-[#DDD] font-sans text-xs select-none">
      <div className="h-7 bg-[#282828] border-b border-[#141414] flex items-center justify-between px-3 text-[11px]">
        <span className="font-bold text-[#FF0055]">⚡ Compressor (NO Sidechain • Muddy Clash)</span>
        <span className="text-[10px] font-mono text-[#888]">Kick + Bass Clashing at 46Hz</span>
      </div>
      <div className="flex-1 p-3 bg-[#202020] flex flex-col items-center justify-center gap-3">
        <div className="w-96 bg-[#2A2A2A] border border-[#FF0055]/40 rounded p-4 text-center">
          <div className="text-[#FF0055] font-bold text-sm mb-1">⚠️ No Sidechain Routing</div>
          <div className="text-xs text-[#AAA]">
            Bassline plays continuously on beat 1 without dipping for the Kick. Sub frequencies overlap causing distortion and muddy playback.
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 6. EQ EIGHT SCREEN (30Hz Low Cut)
// ----------------------------------------------------
function renderEqEightScreen(bpm: number, key: string, scale: string) {
  return (
    <div className="w-full h-full flex flex-col bg-[#1C1C1C] text-[#DDD] font-sans text-xs select-none">
      <div className="h-7 bg-[#282828] border-b border-[#141414] flex items-center justify-between px-3 text-[11px]">
        <span className="font-bold text-[#90FF00]">🎚 EQ Eight (Surgical Low Cut)</span>
        <span className="text-[10px] font-mono text-[#00E5FF]">Band 1: High Pass 4x @ 30.0 Hz</span>
      </div>
      <div className="flex-1 flex flex-col p-2 bg-[#202020]">
        {/* Spectrum Curve */}
        <div className="flex-1 bg-[#141414] border border-[#333] rounded p-2 relative flex items-center justify-center">
          <svg viewBox="0 0 400 120" className="w-full h-full stroke-[#90FF00] fill-none stroke-2">
            {/* Grid Lines */}
            <line x1="40" y1="0" x2="40" y2="120" stroke="#262626" strokeWidth="1" />
            <line x1="120" y1="0" x2="120" y2="120" stroke="#262626" strokeWidth="1" />
            <line x1="240" y1="0" x2="240" y2="120" stroke="#262626" strokeWidth="1" />
            <line x1="340" y1="0" x2="340" y2="120" stroke="#262626" strokeWidth="1" />

            {/* EQ High Pass Curve */}
            <path d="M 0,118 L 30,118 C 45,115 55,60 70,60 L 390,60" />
            <circle cx="60" cy="60" r="5" fill="#90FF00" />
            <text x="70" y="55" fill="#90FF00" fontSize="10" fontFamily="monospace">1 (30Hz)</text>
          </svg>
          <div className="absolute bottom-1 left-3 text-[9px] font-mono text-[#666]">20Hz</div>
          <div className="absolute bottom-1 left-28 text-[9px] font-mono text-[#666]">100Hz</div>
          <div className="absolute bottom-1 right-28 text-[9px] font-mono text-[#666]">1kHz</div>
          <div className="absolute bottom-1 right-3 text-[9px] font-mono text-[#666]">20kHz</div>
        </div>

        {/* Bands Row */}
        <div className="h-10 bg-[#2A2A2A] rounded mt-2 flex items-center justify-around px-2 text-[10px] font-mono">
          <span className="text-[#90FF00] font-bold">1: HP 4x (30Hz) ✓</span>
          <span className="text-[#888]">2: Bell (250Hz)</span>
          <span className="text-[#888]">3: Bell (800Hz)</span>
          <span className="text-[#888]">4: High Shelf (10kHz)</span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 7. DRIFT SCREEN (Live 12 Analog Synth)
// ----------------------------------------------------
function renderDriftScreen(bpm: number, key: string, scale: string) {
  return (
    <div className="w-full h-full flex flex-col bg-[#1C1C1C] text-[#DDD] font-sans text-xs select-none">
      <div className="h-7 bg-[#282828] border-b border-[#141414] flex items-center justify-between px-3 text-[11px]">
        <span className="font-bold text-[#FFB800]">🎹 Drift (Live 12 Analog Synthesizer)</span>
        <span className="text-[10px] font-mono text-[#90FF00]">303 Acid Mode</span>
      </div>
      <div className="flex-1 grid grid-cols-3 gap-2 p-2 bg-[#202020]">
        <div className="bg-[#2A2A2A] border border-[#FFB800]/40 rounded p-2">
          <div className="font-bold text-[#FFB800]">Oscillator 1</div>
          <div className="text-[10px] text-[#AAA] my-1">Shape: Saw • Octave: 0</div>
          <div className="text-[10px] text-[#90FF00]">Drift Tuning: 12%</div>
        </div>
        <div className="bg-[#2A2A2A] border border-[#00E5FF]/40 rounded p-2">
          <div className="font-bold text-[#00E5FF]">Filter (Ladder LP)</div>
          <div className="text-[10px] text-[#AAA] my-1">Cutoff: 650Hz • Res: 78%</div>
          <div className="text-[10px] text-[#90FF00]">Drive: +6dB</div>
        </div>
        <div className="bg-[#2A2A2A] border border-[#90FF00]/40 rounded p-2">
          <div className="font-bold text-[#90FF00]">Pitch / Glide</div>
          <div className="text-[10px] text-[#AAA] my-1">Mode: Mono (Legato)</div>
          <div className="text-[10px] text-[#00E5FF]">Glide Time: 45ms</div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 8. BROWSER SCREEN (Live 12 Tag-based Search)
// ----------------------------------------------------
function renderBrowserScreen(bpm: number, key: string, scale: string) {
  return (
    <div className="w-full h-full flex flex-col bg-[#1E1E1E] text-[#DDD] font-sans text-xs select-none">
      <div className="h-7 bg-[#282828] border-b border-[#141414] flex items-center justify-between px-3 text-[11px]">
        <span className="font-bold text-[#00E5FF]">📂 Browser: Instruments & Audio Effects</span>
        <span className="text-[10px] font-mono text-[#888]">Live 12 Smart Tags</span>
      </div>
      <div className="flex-1 flex bg-[#222]">
        <div className="w-56 bg-[#262626] border-r border-[#141414] p-2 space-y-1">
          <div className="px-2 py-1 bg-[#00E5FF]/20 text-[#00E5FF] font-bold rounded">
            Instruments
          </div>
          <div className="pl-4 py-0.5 text-[#90FF00] font-bold">▶ Operator</div>
          <div className="pl-4 py-0.5 text-[#DDD]">▶ Drift</div>
          <div className="pl-4 py-0.5 text-[#DDD]">▶ Meld</div>
          <div className="pl-4 py-0.5 text-[#DDD]">▶ Wavetable</div>
        </div>
        <div className="flex-1 p-3 bg-[#1A1A1A] flex flex-col justify-center items-center">
          <div className="border border-dashed border-[#90FF00] p-4 rounded text-center text-[#90FF00]">
            <span className="text-lg">⬇</span>
            <div className="font-bold">Drag Operator or Device to Track</div>
            <div className="text-[10px] text-[#888] mt-1">Target: Track 2 (Bass)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 9. ARRANGEMENT WITH NEW TRACK
// ----------------------------------------------------
function renderArrangementTrackScreen(bpm: number, key: string, scale: string) {
  return renderArrangementOverviewScreen(bpm, key, scale);
}
