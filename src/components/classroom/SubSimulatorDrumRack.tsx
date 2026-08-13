import React, { useState } from 'react';
import { Disc, Play } from 'lucide-react';
import { audioSynthesizer } from '../../utils/audioSynthesizer';
import { useLanguage } from '../../context/LanguageContext';

interface SubSimulatorDrumRackProps {
  onPadTrigger?: (padName: string) => void;
  isHighlighted?: boolean;
}

const DRUM_PADS = [
  { id: 'C1', name: 'Kick 909', type: 'Kick' },
  { id: 'C#1', name: 'Rimshot', type: 'Perc' },
  { id: 'D1', name: 'Snare Tight', type: 'Snare' },
  { id: 'D#1', name: 'Clap Analog', type: 'Clap' },
  { id: 'F#1', name: 'Closed Hat 16th', type: 'Hat' },
  { id: 'A#1', name: 'Open Hat 909', type: 'Hat' },
  { id: 'C2', name: 'Shaker Groove', type: 'Perc' },
  { id: 'D2', name: 'Crash Cymbal', type: 'Cymbal' }
];

export const SubSimulatorDrumRack: React.FC<SubSimulatorDrumRackProps> = ({
  onPadTrigger,
  isHighlighted = false
}) => {
  const { t, isRTL } = useLanguage();
  const [activePad, setActivePad] = useState<string | null>(null);

  const handlePadClick = (pad: typeof DRUM_PADS[0]) => {
    setActivePad(pad.id);
    audioSynthesizer.playDrum(pad.type);
    if (onPadTrigger) onPadTrigger(pad.name);
    setTimeout(() => setActivePad(null), 150);
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`bg-[#1E1E1E] border rounded-lg p-3 ${isHighlighted ? 'border-amber-400 ring-2 ring-amber-400/50 animate-pulse' : 'border-[#333]'}`}>
      <div className="flex items-center justify-between border-b border-[#333] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Disc className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-amber-400 text-xs tracking-wide uppercase">{t('simulator.drumRackTitle')}</span>
        </div>
        <span className="text-[10px] text-[#888]">{t('simulator.drumRackTip')}</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {DRUM_PADS.map(pad => {
          const isActive = activePad === pad.id;
          return (
            <button
              key={pad.id}
              onClick={() => handlePadClick(pad)}
              className={`h-14 p-2 rounded border text-start flex flex-col justify-between transition ${
                isActive
                  ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)] scale-95'
                  : 'bg-[#151515] border-[#2A2A2A] hover:bg-[#252525] text-gray-200'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-[9px] font-mono text-[#888]">{pad.id}</span>
                <Play className="w-2.5 h-2.5 opacity-60" />
              </div>
              <span className="text-[11px] font-semibold truncate">{pad.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
