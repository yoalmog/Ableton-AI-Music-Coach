import React from 'react';
import {
  Sliders,
  Sparkles,
  Zap,
  Activity,
  Layers,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { ABLETON_DEVICES } from '../../data/deviceGuideData';
import { SOUND_DESIGN_RECIPES } from '../../data/soundDesignData';
import { SoundDesignRecipe, AbletonDevice } from '../../types';

export const SoundDesignLabView: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'recipes' | 'devices'>('recipes');
  const [selectedRecipe, setSelectedRecipe] = React.useState<SoundDesignRecipe>(SOUND_DESIGN_RECIPES[0]);
  const [selectedDevice, setSelectedDevice] = React.useState<AbletonDevice>(ABLETON_DEVICES[0]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-[#E0E0E0] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A1A1A] border border-[#333] p-5 rounded-lg">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest font-mono">
            <Sliders className="w-3.5 h-3.5" />
            <span>Ableton Live 12 Sound Design Laboratory</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Synth Patch & Effect Recipes</h1>
          <p className="text-xs text-[#888] mt-0.5">
            Master Operator, Wavetable, Drift, Meld, and Roar to synthesize signature Psytrance, Goa, and Techno sounds.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#121212] p-1 rounded border border-[#333]">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`px-3.5 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer uppercase tracking-wider ${
              activeTab === 'recipes'
                ? 'bg-[#252525] text-[#90FF00] border border-[#444]'
                : 'text-[#888] hover:text-[#E0E0E0]'
            }`}
          >
            Sound Recipes
          </button>
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-3.5 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer uppercase tracking-wider ${
              activeTab === 'devices'
                ? 'bg-[#252525] text-[#90FF00] border border-[#444]'
                : 'text-[#888] hover:text-[#E0E0E0]'
            }`}
          >
            Device Library
          </button>
        </div>
      </div>

      {activeTab === 'recipes' ? (
        /* Recipes Tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recipe List */}
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 space-y-2 h-fit">
            <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-widest px-1">
              Patch Recipes
            </h3>

            <div className="space-y-1.5">
              {SOUND_DESIGN_RECIPES.map((r) => {
                const isSelected = selectedRecipe.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRecipe(r)}
                    className={`w-full text-left p-3 rounded transition-colors border cursor-pointer ${
                      isSelected
                        ? 'bg-[#252525] border-[#90FF00] text-white font-bold'
                        : 'bg-[#121212] border-[#2A2A2A] text-[#888] hover:text-[#E0E0E0] hover:bg-[#181818]'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-[#00E5FF]">{r.genre}</div>
                    <div className="text-xs font-bold mt-0.5">{r.title}</div>
                    <div className="text-[10px] text-[#666] mt-1 flex justify-between">
                      <span>{r.difficulty}</span>
                      <span>~{r.estimatedTimeMin} mins</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recipe Detail Runner */}
          <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-5">
            <div className="border-b border-[#2A2A2A] pb-3">
              <span className="text-[10px] font-mono text-[#90FF00] bg-[#121212] border border-[#333] px-2.5 py-1 rounded">
                Target: {selectedRecipe.targetSound}
              </span>
              <h2 className="text-lg font-bold text-white mt-2">{selectedRecipe.title}</h2>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-[#888]">
                <span>Devices Used:</span>
                <span className="font-mono text-[#E0E0E0] font-semibold">
                  {selectedRecipe.abletonDevicesUsed.join(' → ')}
                </span>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3.5">
              {selectedRecipe.steps.map((st) => (
                <div key={st.stepNumber} className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#252525] text-[#90FF00] text-[10px] font-bold font-mono flex items-center justify-center border border-[#333]">
                      {st.stepNumber}
                    </span>
                    <h4 className="text-xs font-bold text-white">{st.title}</h4>
                    <span className="text-[10px] font-mono text-[#666] bg-[#181818] px-2 py-0.5 rounded border border-[#2A2A2A]">
                      Device: {st.deviceName}
                    </span>
                  </div>

                  <p className="text-xs text-[#CCC] leading-relaxed pl-7">{st.instructions}</p>

                  <div className="grid grid-cols-2 gap-2 pl-7 pt-1">
                    {st.parameters.map((p, pIdx) => (
                      <div key={pIdx} className="bg-[#181818] p-2 rounded border border-[#2A2A2A]">
                        <div className="text-[10px] text-[#666] font-mono">{p.paramName}</div>
                        <div className="text-xs font-mono font-bold text-[#90FF00]">{p.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pro Tip Box */}
            <div className="bg-[#121212] border border-[#333] p-3.5 rounded flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#90FF00] shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] font-bold text-[#90FF00] uppercase tracking-wider font-mono">
                  Pro Producer Secret
                </div>
                <p className="text-xs text-[#BBB] mt-0.5 leading-relaxed font-mono">
                  {selectedRecipe.proTip}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Devices Library Tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 space-y-2 h-fit">
            <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-widest px-1">
              Ableton Live 12 Stock Devices
            </h3>

            <div className="space-y-1.5">
              {ABLETON_DEVICES.map((d) => {
                const isSelected = selectedDevice.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDevice(d)}
                    className={`w-full text-left p-3 rounded transition-colors border cursor-pointer ${
                      isSelected
                        ? 'bg-[#252525] border-[#90FF00] text-white font-bold'
                        : 'bg-[#121212] border-[#2A2A2A] text-[#888] hover:text-[#E0E0E0] hover:bg-[#181818]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{d.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101010] text-[#90FF00] border border-[#333]">
                        {d.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-5">
            <div className="border-b border-[#2A2A2A] pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">{selectedDevice.name}</h2>
                <span className="text-[10px] font-mono text-[#00E5FF] bg-[#121212] border border-[#333] px-2.5 py-1 rounded">
                  {selectedDevice.category}
                </span>
              </div>
              <p className="text-xs text-[#AAA] mt-1.5 leading-relaxed">{selectedDevice.description}</p>
            </div>

            {/* Key Parameters */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-[#666] uppercase tracking-widest font-mono">
                Key Parameters & Recommended Settings
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedDevice.keyParameters.map((kp, idx) => (
                  <div key={idx} className="bg-[#121212] p-3 rounded border border-[#2A2A2A]">
                    <div className="text-xs font-bold text-white">{kp.name}</div>
                    <div className="text-xs font-mono font-bold text-[#90FF00] mt-0.5">
                      {kp.recommendedSetting}
                    </div>
                    <div className="text-[10px] text-[#888] mt-1">{kp.purpose}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Genre Use Cases */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] space-y-1.5">
                <div className="text-xs font-bold text-[#90FF00] font-mono">Psytrance Applications</div>
                <ul className="text-xs text-[#BBB] space-y-1 list-disc list-inside">
                  {selectedDevice.psytranceUseCases.map((uc, i) => (
                    <li key={i}>{uc}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] space-y-1.5">
                <div className="text-xs font-bold text-[#00E5FF] font-mono">Techno Applications</div>
                <ul className="text-xs text-[#BBB] space-y-1 list-disc list-inside">
                  {selectedDevice.technoUseCases.map((uc, i) => (
                    <li key={i}>{uc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
