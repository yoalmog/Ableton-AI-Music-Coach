import React from 'react';
import { Sliders, Activity, Zap, Waves, Volume2, Sparkles, Filter } from 'lucide-react';

interface AbletonDeviceSimulatorProps {
  deviceType: 'drift' | 'operator' | 'roar' | 'eqEight' | 'compressor' | 'glueCompressor' | 'saturator';
  params: Record<string, any>;
  onChangeParam: (deviceType: string, paramName: string, value: any) => void;
  isRTL?: boolean;
}

export const AbletonDeviceSimulator: React.FC<AbletonDeviceSimulatorProps> = ({
  deviceType,
  params = {},
  onChangeParam,
  isRTL = false,
}) => {
  const p = (params || {}) as Record<string, any>;

  switch (deviceType) {
    case 'compressor': {
      const threshold = p.threshold ?? 0;
      const ratio = p.ratio ?? 4;
      const attack = p.attack ?? 2;
      const release = p.release ?? 50;
      const sidechainEnabled = p.sidechainEnabled ?? false;
      const sidechainSource = p.sidechainSource ?? '1 Kick';

      return (
        <div className="w-full h-full bg-[#202020] border border-[#3A3A3A] rounded flex flex-col text-xs font-sans text-gray-200 select-none">
          {/* Compressor Title Bar */}
          <div className="h-7 px-2.5 bg-[#2B2B2B] border-b border-[#353535] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFE853]" />
              <span className="font-bold text-[#FFE853] font-mono">Compressor</span>
            </div>
            {/* Sidechain expansion toggle */}
            <button
              onClick={() => onChangeParam('compressor', 'sidechainEnabled', !sidechainEnabled)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 cursor-pointer ${
                sidechainEnabled ? 'bg-[#FFE853] text-black font-bold' : 'bg-[#333] text-gray-300 hover:bg-[#444]'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Sidechain</span>
            </button>
          </div>

          {/* Device Controls Grid */}
          <div className="flex-1 p-3 flex gap-4 items-center overflow-x-auto">
            {/* Sidechain Routing Subpanel */}
            {sidechainEnabled && (
              <div className="p-2.5 bg-[#181818] rounded border border-[#FFE853]/40 flex flex-col gap-2 min-w-[140px]">
                <div className="text-[10px] text-[#FFE853] font-mono font-bold">SIDECHAIN ROUTING</div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400">Audio From:</span>
                  <select
                    value={sidechainSource}
                    onChange={(e) => onChangeParam('compressor', 'sidechainSource', e.target.value)}
                    className="bg-[#262626] border border-[#3C3C3C] text-[#FFE853] text-[11px] rounded px-1.5 py-1 font-mono cursor-pointer"
                  >
                    <option value="none">-- None --</option>
                    <option value="1 Kick">1-Kick (Pre-FX)</option>
                    <option value="Percussion">2-Percussion</option>
                    <option value="Breaks">3-Breaks</option>
                  </select>
                </div>
              </div>
            )}

            {/* Threshold Slider */}
            <div className="flex flex-col items-center gap-1.5 min-w-[70px]">
              <span className="text-[10px] text-gray-400 font-mono">Threshold</span>
              <input
                type="range"
                min="-40"
                max="0"
                step="0.5"
                value={threshold}
                onChange={(e) => onChangeParam('compressor', 'threshold', Number(e.target.value))}
                className="h-20 -rotate-90 accent-[#FFE853] cursor-pointer my-4"
              />
              <span className="text-[#FFE853] font-mono font-bold">{threshold} dB</span>
            </div>

            {/* Ratio Slider / Knob */}
            <div className="flex flex-col items-center gap-1.5 min-w-[65px]">
              <span className="text-[10px] text-gray-400 font-mono">Ratio</span>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={ratio}
                onChange={(e) => onChangeParam('compressor', 'ratio', Number(e.target.value))}
                className="w-16 accent-[#00E5FF] cursor-pointer"
              />
              <span className="text-[#00E5FF] font-mono font-bold">{ratio}:1</span>
            </div>

            {/* Attack & Release */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] text-gray-400 font-mono">Attack:</span>
                <span className="text-gray-200 font-mono font-bold">{attack} ms</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] text-gray-400 font-mono">Release:</span>
                <span className="text-gray-200 font-mono font-bold">{release} ms</span>
              </div>
            </div>

            {/* Gain Reduction Meter */}
            <div className="flex flex-col items-center gap-1 ml-auto">
              <span className="text-[10px] text-red-400 font-mono">GR (dB)</span>
              <div className="w-4 h-24 bg-[#141414] rounded border border-[#333] relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 right-0 bg-[#FF5555] transition-all"
                  style={{ height: `${Math.min(100, Math.abs(threshold) * 2)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'drift': {
      const cutoff = p.cutoff ?? 840;
      const resonance = p.resonance ?? 45;
      const osc1Shape = p.osc1Shape ?? 'Saw';
      const osc2Shape = p.osc2Shape ?? 'Pulse';

      return (
        <div className="w-full h-full bg-[#202020] border border-[#3A3A3A] rounded flex flex-col text-xs font-sans text-gray-200 select-none">
          <div className="h-7 px-2.5 bg-[#2B2B2B] border-b border-[#353535] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF764D]" />
              <span className="font-bold text-[#FF764D] font-mono">Drift Synth</span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">Ableton Live 12 Engine</span>
          </div>

          <div className="flex-1 p-3 flex gap-6 items-center overflow-x-auto">
            {/* Oscillators */}
            <div className="flex flex-col gap-2 p-2.5 bg-[#181818] rounded border border-[#333]">
              <span className="text-[10px] text-[#FF764D] font-mono font-bold">OSCILLATORS</span>
              <div className="flex gap-2">
                {['Saw', 'Pulse', 'Sin', 'Noise'].map((shape) => (
                  <button
                    key={shape}
                    onClick={() => onChangeParam('drift', 'osc1Shape', shape)}
                    className={`px-2 py-1 rounded text-[10px] font-mono ${
                      osc1Shape === shape ? 'bg-[#FF764D] text-black font-bold' : 'bg-[#2A2A2A] text-gray-300'
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Section */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] text-cyan-400 font-mono font-bold">FILTER (CLEAN 12)</span>
              <div className="flex gap-4 items-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-400">Cutoff</span>
                  <input
                    type="range"
                    min="100"
                    max="15000"
                    step="50"
                    value={cutoff}
                    onChange={(e) => onChangeParam('drift', 'cutoff', Number(e.target.value))}
                    className="w-24 accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-cyan-400 font-mono font-bold">{cutoff} Hz</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-400">Resonance</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={resonance}
                    onChange={(e) => onChangeParam('drift', 'resonance', Number(e.target.value))}
                    className="w-20 accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-cyan-400 font-mono font-bold">{resonance}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'eqEight': {
      const lowCutEnabled = p.lowCutEnabled ?? true;
      const lowCutFreq = p.lowCutFreq ?? 30;

      return (
        <div className="w-full h-full bg-[#202020] border border-[#3A3A3A] rounded flex flex-col text-xs font-sans text-gray-200 select-none">
          <div className="h-7 px-2.5 bg-[#2B2B2B] border-b border-[#353535] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" />
              <span className="font-bold text-[#00E5FF] font-mono">EQ Eight</span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">8-Band Parametric</span>
          </div>

          <div className="flex-1 p-3 flex gap-6 items-center">
            {/* Band 1 Low-cut controls */}
            <div className="flex flex-col gap-2 p-2.5 bg-[#181818] rounded border border-[#00E5FF]/40">
              <span className="text-[10px] text-[#00E5FF] font-mono font-bold">BAND 1 (LOW CUT 48dB)</span>
              <button
                onClick={() => onChangeParam('eqEight', 'lowCutEnabled', !lowCutEnabled)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                  lowCutEnabled ? 'bg-[#00E5FF] text-black' : 'bg-[#333] text-gray-400'
                }`}
              >
                {lowCutEnabled ? 'Low-Cut ON (30Hz)' : 'Low-Cut OFF'}
              </button>
            </div>

            {/* Frequency curve display */}
            <div className="flex-1 h-24 bg-[#141414] rounded border border-[#333] relative flex items-end p-2 overflow-hidden">
              <div className="w-full border-b border-[#00E5FF]/60 relative h-12">
                {/* 30Hz high-pass roll-off curve */}
                <svg className="w-full h-full stroke-[#00E5FF] fill-none stroke-2">
                  <path d="M 0 48 Q 40 46 70 24 T 300 24" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      );
    }

    default:
      return (
        <div className="w-full h-full bg-[#202020] border border-[#3A3A3A] rounded flex items-center justify-center text-xs text-gray-400 font-mono">
          <span>{deviceType.toUpperCase()} SIMULATOR VIEW</span>
        </div>
      );
  }
};
