import React from 'react';
import { AbletonTrackSim, AbletonClipSim } from '../../types/abletonSimulator';
import { Plus, Volume2, Mic, Eye, EyeOff, Music } from 'lucide-react';

interface AbletonTrackSimulatorProps {
  tracks: AbletonTrackSim[];
  selectedTrackId: string | null;
  onSelectTrack: (trackId: string) => void;
  onCreateMidiTrack: () => void;
  onToggleMute: (trackId: string) => void;
  onToggleSolo: (trackId: string) => void;
  onToggleArm: (trackId: string) => void;
  onChangeVolume: (trackId: string, vol: number) => void;
  isRTL?: boolean;
}

export const AbletonTrackSimulator: React.FC<AbletonTrackSimulatorProps> = ({
  tracks,
  selectedTrackId,
  onSelectTrack,
  onCreateMidiTrack,
  onToggleMute,
  onToggleSolo,
  onToggleArm,
  onChangeVolume,
  isRTL = false,
}) => {
  return (
    <div className="w-full h-full bg-[#181818] flex flex-col text-xs font-sans text-gray-200 select-none border-l border-[#2B2B2B]">
      {/* Header bar */}
      <div className="h-8 px-2.5 bg-[#242424] border-b border-[#303030] flex items-center justify-between">
        <span className="font-mono text-gray-300 font-bold text-[11px]">TRACKS & MIXER</span>
        <button
          onClick={onCreateMidiTrack}
          className="px-2 py-1 rounded bg-[#333] hover:bg-[#444] text-[#FFE853] text-[10px] font-mono flex items-center gap-1 cursor-pointer"
          title="Insert MIDI Track (Ctrl+Shift+T)"
        >
          <Plus className="w-3 h-3" />
          <span>+ MIDI Track</span>
        </button>
      </div>

      {/* Tracks List */}
      <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-[#242424]">
        {tracks.map((track, idx) => {
          const isSelected = track.id === selectedTrackId;
          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className={`p-2 transition-colors cursor-pointer flex flex-col gap-1.5 ${
                isSelected ? 'bg-[#2A2A2A] border-l-4' : 'hover:bg-[#202020]'
              }`}
              style={{ borderLeftColor: isSelected ? track.color : 'transparent' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: track.color }}
                  />
                  <span className={`font-mono text-[11px] ${isSelected ? 'text-[#FFE853] font-bold' : 'text-gray-200'}`}>
                    {track.name}
                  </span>
                </div>
                <span className="text-[9px] uppercase px-1 py-0.5 rounded bg-[#151515] text-gray-400 font-mono">
                  {track.type}
                </span>
              </div>

              {/* Controls row (Mute, Solo, Arm, Fader) */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1">
                  {/* Active / Mute button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMute(track.id);
                    }}
                    className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold cursor-pointer ${
                      !track.muted ? 'bg-[#FFE853] text-black' : 'bg-[#333] text-gray-500'
                    }`}
                    title="Track Activator (Mute)"
                  >
                    {idx + 1}
                  </button>

                  {/* Solo button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSolo(track.id);
                    }}
                    className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold cursor-pointer ${
                      track.soloed ? 'bg-[#00E5FF] text-black' : 'bg-[#333] text-gray-500'
                    }`}
                    title="Solo"
                  >
                    S
                  </button>

                  {/* Record Arm button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleArm(track.id);
                    }}
                    className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold cursor-pointer ${
                      track.armed ? 'bg-[#FF3333] text-white' : 'bg-[#333] text-gray-500'
                    }`}
                    title="Record Arm"
                  >
                    ●
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-1.5 flex-1 justify-end">
                  <Volume2 className="w-3 h-3 text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={track.volume}
                    onChange={(e) => {
                      e.stopPropagation();
                      onChangeVolume(track.id, Number(e.target.value));
                    }}
                    className="w-16 accent-[#FFE853] cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-gray-400 w-7 text-right">
                    {Math.round(track.volume * 100)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
