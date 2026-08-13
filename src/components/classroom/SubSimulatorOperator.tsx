import React, { useState } from 'react';
import { Cpu, Zap, Activity, Sliders } from 'lucide-react';
import { audioSynthesizer } from '../../utils/audioSynthesizer';
import { useLanguage } from '../../context/LanguageContext';

interface SubSimulatorOperatorProps {
  onParameterChange?: (param: string, val: number) => void;
  isHighlighted?: boolean;
}

export const SubSimulatorOperator: React.FC<SubSimulatorOperatorProps> = ({
  onParameterChange,
  isHighlighted = false
}) => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D' | 'Filter'>('A');
  const [decay, setDecay] = useState(150);
  const [cutoff, setCutoff] = useState(850);
  const [algorithm, setAlgorithm] = useState(1);

  const handleDecayChange = (val: number) => {
    setDecay(val);
    audioSynthesizer.playOperatorTone(val, cutoff);
    if (onParameterChange) onParameterChange('decay', val);
  };

  const handleCutoffChange = (val: number) => {
    setCutoff(val);
    audioSynthesizer.playOperatorTone(decay, val);
    if (onParameterChange) onParameterChange('cutoff', val);
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`bg-[#1E1E1E] border rounded-lg p-3 ${isHighlighted ? 'border-amber-400 ring-2 ring-amber-400/50 animate-pulse' : 'border-[#333]'}`}>
      {/* Device Header */}
      <div className="flex items-center justify-between border-b border-[#333] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="font-bold text-amber-400 text-xs tracking-wide uppercase">{t('simulator.operatorTitle')}</span>
          <span className="text-[10px] bg-[#2A2A2A] text-gray-300 px-1.5 py-0.5 rounded font-mono">{t('simulator.educationalModel')}</span>
        </div>

        <div className="flex items-center gap-1 bg-[#141414] p-0.5 rounded border border-[#2B2B2B]">
          {(['A', 'B', 'C', 'D', 'Filter'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded transition ${
                activeTab === tab ? 'bg-amber-500 text-black font-bold' : 'text-[#888] hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Operator UI Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Oscillator Section */}
        <div className="bg-[#151515] p-2.5 rounded border border-[#2A2A2A] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold border-b border-[#252525] pb-1">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {t('simulator.oscillator')} {activeTab}</span>
            <span className="text-[9px] text-[#888]">{t('simulator.sineWave')}</span>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-[#AAA] mb-1">
              <span>{t('simulator.decayTime')}</span>
              <span className="text-amber-400 font-mono">{decay} ms</span>
            </div>
            <input
              type="range"
              min="20"
              max="2000"
              value={decay}
              onChange={e => handleDecayChange(Number(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-[#2A2A2A] rounded cursor-pointer"
            />
          </div>

          <div className="text-[9px] text-[#777]">
            {t('simulator.decayTip')}
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-[#151515] p-2.5 rounded border border-[#2A2A2A] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold border-b border-[#252525] pb-1">
            <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {t('simulator.filterLowPass')}</span>
            <span className="text-[9px] text-[#888]">{t('simulator.filter24db')}</span>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-[#AAA] mb-1">
              <span>{t('simulator.cutoffFrequency')}</span>
              <span className="text-emerald-400 font-mono">{cutoff} Hz</span>
            </div>
            <input
              type="range"
              min="50"
              max="15000"
              value={cutoff}
              onChange={e => handleCutoffChange(Number(e.target.value))}
              className="w-full accent-emerald-400 h-1.5 bg-[#2A2A2A] rounded cursor-pointer"
            />
          </div>

          <div className="text-[9px] text-[#777]">
            {t('simulator.cutoffTip')}
          </div>
        </div>

        {/* Algorithm Diagram */}
        <div className="bg-[#151515] p-2.5 rounded border border-[#2A2A2A] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-cyan-400 font-semibold border-b border-[#252525] pb-1">
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> {t('simulator.fmAlgorithm')}</span>
            <span className="text-[9px] text-[#888]">{t('simulator.parallelSerial')}</span>
          </div>

          <div className="flex items-center justify-center gap-1 py-2">
            <div className="w-6 h-6 rounded bg-amber-500 text-black font-bold flex items-center justify-center text-[10px]">A</div>
            <span className="text-[#666]">←</span>
            <div className="w-6 h-6 rounded bg-amber-500/40 text-amber-300 font-bold flex items-center justify-center text-[10px]">B</div>
            <span className="text-[#666]">←</span>
            <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-400/60 font-bold flex items-center justify-center text-[10px]">C</div>
          </div>

          <div className="text-[9px] text-[#777] text-center">
            {t('simulator.algorithmTip')}
          </div>
        </div>
      </div>
    </div>
  );
};
