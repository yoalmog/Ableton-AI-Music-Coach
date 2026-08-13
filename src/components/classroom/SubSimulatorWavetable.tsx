import React, { useState } from 'react';
import { Waves, Sliders, Activity } from 'lucide-react';
import { audioSynthesizer } from '../../utils/audioSynthesizer';
import { useLanguage } from '../../context/LanguageContext';

interface SubSimulatorWavetableProps {
  onParameterChange?: (param: string, val: number) => void;
  isHighlighted?: boolean;
}

export const SubSimulatorWavetable: React.FC<SubSimulatorWavetableProps> = ({
  onParameterChange,
  isHighlighted = false
}) => {
  const { t, isRTL } = useLanguage();
  const [position, setPosition] = useState(45);
  const [cutoff, setCutoff] = useState(1200);

  const handlePositionChange = (val: number) => {
    setPosition(val);
    audioSynthesizer.playWavetableTone(val, cutoff);
    if (onParameterChange) onParameterChange('wt_pos', val);
  };

  const handleCutoffChange = (val: number) => {
    setCutoff(val);
    audioSynthesizer.playWavetableTone(position, val);
    if (onParameterChange) onParameterChange('wt_cutoff', val);
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`bg-[#1E1E1E] border rounded-lg p-3 ${isHighlighted ? 'border-amber-400 ring-2 ring-amber-400/50 animate-pulse' : 'border-[#333]'}`}>
      <div className="flex items-center justify-between border-b border-[#333] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-cyan-400 text-xs tracking-wide uppercase">{t('simulator.wavetableTitle')}</span>
        </div>
        <span className="text-[10px] bg-[#2A2A2A] text-gray-300 px-1.5 py-0.5 rounded font-mono">{t('simulator.wavetableSub')}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Wavetable Position */}
        <div className="bg-[#151515] p-2.5 rounded border border-[#2A2A2A] space-y-2">
          <div className="flex justify-between text-[10px] text-[#AAA]">
            <span>{t('simulator.wavetablePos')}</span>
            <span className="text-cyan-400 font-mono">{position}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={position}
            onChange={e => handlePositionChange(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-[#2A2A2A] rounded cursor-pointer"
          />
          <div className="text-[9px] text-[#777]">
            {t('simulator.wavetablePosTip')}
          </div>
        </div>

        {/* Filter Cutoff */}
        <div className="bg-[#151515] p-2.5 rounded border border-[#2A2A2A] space-y-2">
          <div className="flex justify-between text-[10px] text-[#AAA]">
            <span>{t('simulator.filter1Cutoff')}</span>
            <span className="text-emerald-400 font-mono">{cutoff} Hz</span>
          </div>
          <input
            type="range"
            min="100"
            max="18000"
            value={cutoff}
            onChange={e => handleCutoffChange(Number(e.target.value))}
            className="w-full accent-emerald-400 h-1.5 bg-[#2A2A2A] rounded cursor-pointer"
          />
          <div className="text-[9px] text-[#777]">
            {t('simulator.filterCutoffTip')}
          </div>
        </div>
      </div>
    </div>
  );
};
