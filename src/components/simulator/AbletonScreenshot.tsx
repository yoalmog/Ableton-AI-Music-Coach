import React from 'react';
import { AbletonSimulatorState, AbletonViewMode } from '../../types/abletonSimulator';
import { AbletonPianoRollSimulator } from './AbletonPianoRollSimulator';
import { AbletonDeviceSimulator } from './AbletonDeviceSimulator';
import { AbletonTrackSimulator } from './AbletonTrackSimulator';
import { Play, Square, Circle, Repeat, Activity, Volume2, Sparkles, Sliders, Folder, Music, Search } from 'lucide-react';
import { MidiNote } from '../../types';

interface AbletonScreenshotProps {
  state: AbletonSimulatorState;
  screenshotUri?: string | null;
  onUpdateState: (patch: Partial<AbletonSimulatorState>) => void;
  onActionTrigger?: (targetId: string, actionType: any, value?: any) => void;
  isRTL?: boolean;
}

export const AbletonScreenshot: React.FC<AbletonScreenshotProps> = ({
  state,
  screenshotUri,
  onUpdateState,
  onActionTrigger,
  isRTL = false,
}) => {
  // If user provided a real Ableton screenshot (PNG, JPG, WEBP), render it directly as the visual canvas
  if (screenshotUri) {
    return (
      <div className="relative w-full h-full bg-[#181818] overflow-hidden select-none flex items-center justify-center">
        <img
          src={screenshotUri}
          alt="Ableton Live 12 Screenshot"
          className="w-full h-full object-contain pointer-events-none"
          referrerPolicy="no-referrer"
        />
        {/* Visual Badge confirming screenshot loaded */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur border border-[#FFE853]/40 text-[#FFE853] px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#FFE853] animate-pulse" />
          <span>ABLETON LIVE 12 SCREENSHOT CANVAS</span>
        </div>
      </div>
    );
  }

  // Otherwise, render the high-definition interactive Ableton Live 12 workspace
  const activeTrack = state.tracks.find((t) => t.id === state.selectedTrackId) || state.tracks[0];

  return (
    <div className="relative w-full h-full bg-[#1E1E1E] text-[#D8D8D8] flex flex-col select-none overflow-hidden font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP CONTROL BAR (ABLETON LIVE 12 TRANSPORT)                             */}
      {/* ========================================================================= */}
      <div className="h-10 bg-[#2B2B2B] border-b border-[#181818] flex items-center justify-between px-3 text-xs font-mono shrink-0 shadow-sm">
        {/* Left: Link / Tap / BPM / Time Signature */}
        <div className="flex items-center gap-2.5">
          {/* Link button */}
          <div className="px-1.5 py-0.5 rounded bg-[#383838] text-gray-300 text-[10px] font-bold">
            Link
          </div>

          {/* Tap Tempo */}
          <button
            onClick={() => onActionTrigger?.('tempo-tap', 'CLICK')}
            className="px-2 py-0.5 rounded bg-[#383838] hover:bg-[#484848] text-gray-200 text-[10px] font-bold cursor-pointer"
          >
            Tap
          </button>

          {/* BPM Value Control */}
          <div
            onClick={() => {
              const nextBpm = state.bpm === 142 ? 140 : 142;
              onUpdateState({ bpm: nextBpm });
              onActionTrigger?.('tempo-bpm', 'CLICK', nextBpm);
            }}
            className={`px-2 py-0.5 rounded border flex items-center gap-1 cursor-pointer transition-colors ${
              state.bpm === 142
                ? 'bg-[#FFE853] text-black border-[#FFE853] font-bold'
                : 'bg-[#1C1C1C] text-[#FFE853] border-[#383838] hover:border-[#FFE853]'
            }`}
            title="Click to toggle / set 142 BPM"
          >
            <span className="text-[12px] font-bold">{state.bpm.toFixed(2)}</span>
            <span className="text-[9px] opacity-70">BPM</span>
          </div>

          {/* Time Signature */}
          <div className="px-2 py-0.5 rounded bg-[#1C1C1C] border border-[#383838] text-gray-300 text-[11px] font-bold">
            {state.timeSignature}
          </div>

          {/* Metronome */}
          <button
            onClick={() => {
              const nextMetro = !state.metronome;
              onUpdateState({ metronome: nextMetro });
              onActionTrigger?.('transport-metronome', 'TOGGLE', nextMetro);
            }}
            className={`w-7 h-6 rounded flex items-center justify-center cursor-pointer transition-colors ${
              state.metronome ? 'bg-[#FFE853] text-black font-bold' : 'bg-[#383838] text-gray-300 hover:bg-[#484848]'
            }`}
            title="Metronome"
          >
            ●●
          </button>
        </div>

        {/* Center: Arrangement Position & Transport (Play, Stop, Record) */}
        <div className="flex items-center gap-2">
          {/* Position counter */}
          <div className="px-2.5 py-0.5 rounded bg-[#1C1C1C] border border-[#383838] text-[#00E5FF] text-[11px] font-bold">
            57. 3. 1
          </div>

          {/* Play */}
          <button
            onClick={() => {
              const nextPlay = !state.isPlaying;
              onUpdateState({ isPlaying: nextPlay });
              onActionTrigger?.('transport-play', 'CLICK', nextPlay);
            }}
            className={`w-7 h-6 rounded flex items-center justify-center cursor-pointer ${
              state.isPlaying ? 'bg-[#90FF00] text-black' : 'bg-[#383838] text-gray-200 hover:bg-[#484848]'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Stop */}
          <button
            onClick={() => {
              onUpdateState({ isPlaying: false });
              onActionTrigger?.('transport-stop', 'CLICK');
            }}
            className="w-7 h-6 rounded bg-[#383838] hover:bg-[#484848] text-gray-200 flex items-center justify-center cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Record */}
          <button
            onClick={() => {
              const nextRec = !state.isRecording;
              onUpdateState({ isRecording: nextRec });
              onActionTrigger?.('transport-rec', 'CLICK', nextRec);
            }}
            className={`w-7 h-6 rounded flex items-center justify-center cursor-pointer ${
              state.isRecording ? 'bg-[#FF3333] text-white animate-pulse' : 'bg-[#383838] text-gray-200 hover:bg-[#484848]'
            }`}
          >
            <Circle className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Loop toggle */}
          <button
            onClick={() => {
              const nextLoop = !state.loop;
              onUpdateState({ loop: nextLoop });
              onActionTrigger?.('transport-loop', 'TOGGLE', nextLoop);
            }}
            className={`w-7 h-6 rounded flex items-center justify-center cursor-pointer ${
              state.loop ? 'bg-[#FFE853] text-black font-bold' : 'bg-[#383838] text-gray-300'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Key & Scale, CPU & Workspace View Selectors */}
        <div className="flex items-center gap-2">
          {/* Key / Scale Indicator */}
          <div className="px-2 py-0.5 rounded bg-[#1C1C1C] border border-[#383838] text-[#FFE853] text-[11px] font-bold">
            {state.key} {state.scale}
          </div>

          {/* CPU usage */}
          <div className="px-2 py-0.5 rounded bg-[#1C1C1C] text-gray-400 text-[10px]">
            CPU: 14%
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE (BROWSER + ARRANGEMENT / PIANO ROLL + TRACKS)            */}
      {/* ========================================================================= */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left: Ableton Live 12 Browser */}
        <div className="w-52 bg-[#242424] border-r border-[#181818] flex flex-col text-xs font-sans text-gray-300 shrink-0">
          <div className="p-2 border-b border-[#303030] flex items-center gap-1.5 bg-[#1E1E1E]">
            <Search className="w-3 h-3 text-gray-400" />
            <span className="text-[11px] text-gray-400 font-mono">Search (Ctrl+F)</span>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 p-2 space-y-3 font-mono text-[11px]">
            {/* Collections */}
            <div>
              <div className="text-[10px] text-gray-500 font-bold mb-1">COLLECTIONS</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-1.5 py-0.5 rounded hover:bg-[#333] cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#90FF00]" />
                  <span>Favorites</span>
                </div>
                <div className="flex items-center gap-2 px-1.5 py-0.5 rounded hover:bg-[#333] cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                  <span>Drums & Synths</span>
                </div>
                <div className="flex items-center gap-2 px-1.5 py-0.5 rounded hover:bg-[#333] cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#FFE853]" />
                  <span>Mixing Tools</span>
                </div>
              </div>
            </div>

            {/* Library Categories */}
            <div>
              <div className="text-[10px] text-gray-500 font-bold mb-1">LIBRARY</div>
              <div className="space-y-0.5 text-gray-300">
                {['Sounds', 'Drums', 'Instruments', 'Audio Effects', 'MIDI Effects', 'Modulators', 'Max for Live', 'Plug-ins', 'Clips', 'Samples'].map((cat) => (
                  <div
                    key={cat}
                    className="px-1.5 py-0.5 rounded hover:bg-[#333] hover:text-[#FFE853] cursor-pointer flex items-center gap-1.5"
                  >
                    <Folder className="w-3 h-3 text-gray-400" />
                    <span>{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Arrangement / Piano Roll / Session View */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#161616] overflow-hidden">
          {state.viewMode === 'pianoroll' ? (
            <AbletonPianoRollSimulator
              notes={state.pianoRollNotes}
              onChangeNotes={(notes) => {
                onUpdateState({ pianoRollNotes: notes });
                onActionTrigger?.('pianoroll-change', 'MIDI_NOTE', notes);
              }}
              rootKey={state.key}
              scale={state.scale}
              bpm={state.bpm}
              isRTL={isRTL}
            />
          ) : (
            /* Arrangement Timeline View */
            <div className="flex-1 flex flex-col overflow-hidden bg-[#181818]">
              {/* Beat Rulers Bar */}
              <div className="h-6 bg-[#222222] border-b border-[#2C2C2C] flex text-[10px] font-mono text-gray-400 px-2 items-center divide-x divide-[#2C2C2C]">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex-1 px-2">
                    {i * 8 + 1}
                  </div>
                ))}
              </div>

              {/* Tracks Timeline lanes */}
              <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-[#222222]">
                {state.tracks.map((track) => {
                  const isSelected = track.id === state.selectedTrackId;
                  return (
                    <div
                      key={track.id}
                      onClick={() => {
                        onUpdateState({ selectedTrackId: track.id });
                        onActionTrigger?.(`track-select-${track.id}`, 'CLICK', track.id);
                      }}
                      className={`h-16 flex items-center px-2 relative transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#252525]' : 'bg-[#1C1C1C] hover:bg-[#202020]'
                      }`}
                    >
                      {/* Left Track Mini Tag */}
                      <div
                        className="w-2 h-full absolute left-0 top-0 bottom-0"
                        style={{ backgroundColor: track.color }}
                      />

                      {/* Mock Clips in lane */}
                      <div
                        className="h-12 ml-4 mr-2 rounded px-2.5 flex items-center justify-between text-xs font-mono font-bold shadow"
                        style={{
                          backgroundColor: track.color,
                          color: '#000000',
                          width: `${Math.max(40, 70 - Math.random() * 20)}%`,
                        }}
                      >
                        <span>{track.name} [Clip]</span>
                        <span className="text-[10px] opacity-80">142 BPM</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom: Device View / Chain */}
          <div className="h-44 bg-[#1F1F1F] border-t border-[#141414] p-1.5 flex gap-2 overflow-x-auto shrink-0">
            {/* Device 1: Selected Track Instrument (Drift/Operator/Compressor) */}
            <div className="flex-1 min-w-[320px] h-full">
              <AbletonDeviceSimulator
                deviceType={(state.selectedDeviceId as any) || 'drift'}
                params={state.deviceParameters[state.selectedDeviceId || 'drift'] || {}}
                onChangeParam={(dev, param, val) => {
                  const updatedDevs = {
                    ...state.deviceParameters,
                    [dev]: {
                      ...(state.deviceParameters[dev] || {}),
                      [param]: val,
                    },
                  };
                  onUpdateState({ deviceParameters: updatedDevs });
                  onActionTrigger?.(`${dev}-${param}`, 'SLIDER', val);
                }}
                isRTL={isRTL}
              />
            </div>
          </div>
        </div>

        {/* Right: Ableton Track List & Mix Controls */}
        <div className="w-56 bg-[#1A1A1A] shrink-0">
          <AbletonTrackSimulator
            tracks={state.tracks}
            selectedTrackId={state.selectedTrackId}
            onSelectTrack={(trackId) => {
              onUpdateState({ selectedTrackId: trackId });
              onActionTrigger?.(`track-select-${trackId}`, 'CLICK', trackId);
            }}
            onCreateMidiTrack={() => {
              const newId = `t_${Date.now()}`;
              const newTrack = {
                id: newId,
                name: `${state.tracks.length + 1} Synth`,
                type: 'midi' as const,
                color: '#FFE853',
                volume: 0.8,
                pan: 0,
                muted: false,
                soloed: false,
                armed: true,
                clips: [],
                devices: ['Drift'],
              };
              onUpdateState({ tracks: [...state.tracks, newTrack], selectedTrackId: newId });
              onActionTrigger?.('create-midi-track', 'CLICK', newId);
            }}
            onToggleMute={(trackId) => {
              const updated = state.tracks.map((t) =>
                t.id === trackId ? { ...t, muted: !t.muted } : t
              );
              onUpdateState({ tracks: updated });
            }}
            onToggleSolo={(trackId) => {
              const updated = state.tracks.map((t) =>
                t.id === trackId ? { ...t, soloed: !t.soloed } : t
              );
              onUpdateState({ tracks: updated });
            }}
            onToggleArm={(trackId) => {
              const updated = state.tracks.map((t) =>
                t.id === trackId ? { ...t, armed: !t.armed } : t
              );
              onUpdateState({ tracks: updated });
            }}
            onChangeVolume={(trackId, vol) => {
              const updated = state.tracks.map((t) =>
                t.id === trackId ? { ...t, volume: vol } : t
              );
              onUpdateState({ tracks: updated });
            }}
            isRTL={isRTL}
          />
        </div>
      </div>
    </div>
  );
};
