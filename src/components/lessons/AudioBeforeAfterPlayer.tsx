import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
import { useLanguage } from '../../context/LanguageContext';
import { Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';

interface AudioBeforeAfterPlayerProps {
  type: 'kick_eq' | 'bass_sidechain' | 'reverb_dry_wet' | 'lead_distortion';
  title?: string;
  titleHe?: string;
  descriptionBefore?: string;
  descriptionBeforeHe?: string;
  descriptionAfter?: string;
  descriptionAfterHe?: string;
}

export const AudioBeforeAfterPlayer: React.FC<AudioBeforeAfterPlayerProps> = ({
  type,
  title = 'Audio Processing Comparison',
  titleHe = 'השוואת עבודת אודיו (לפני / אחרי)',
  descriptionBefore = 'Raw audio signal before EQ & processing',
  descriptionBeforeHe = 'סאונד גולמי לפני איקולייזר ועיבוד',
  descriptionAfter = 'Processed audio with EQ, sidechain, and saturation',
  descriptionAfterHe = 'סאונד מעובד עם איקולייזר, סיידצ\'יין ורוויה',
}) => {
  const { isRtl } = useLanguage();
  const [activeMode, setActiveMode] = useState<'before' | 'after' | null>(null);

  const handlePlay = (mode: 'before' | 'after') => {
    setActiveMode(mode);
    audioService.playABExample(type, mode);
    setTimeout(() => setActiveMode(null), 2500);
  };

  return (
    <div className="bg-[#14141f] border border-[#232336] rounded-2xl p-5 text-white space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm text-[#00E5FF] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#90FF00]" />
          <span>{isRtl ? titleHe : title}</span>
        </h4>
        <span className="text-[11px] font-mono text-gray-400 bg-[#1e1e2d] px-2 py-0.5 rounded">
          WEB AUDIO SYNTH
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* BEFORE Option */}
        <button
          onClick={() => handlePlay('before')}
          className={`p-4 rounded-xl border text-right transition flex items-start justify-between ${
            activeMode === 'before'
              ? 'bg-[#FF3366]/10 border-[#FF3366] text-white shadow-lg shadow-[#FF3366]/10'
              : 'bg-[#181824] border-[#28283a] text-gray-300 hover:border-gray-500'
          }`}
        >
          <div>
            <div className="font-bold text-xs text-[#FF3366] uppercase tracking-wider mb-1">
              {isRtl ? 'לפני עיבוד (BEFORE / DRY)' : 'BEFORE (DRY)'}
            </div>
            <p className="text-xs text-gray-400 leading-snug">
              {isRtl ? descriptionBeforeHe : descriptionBefore}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-[#222234] text-gray-300 shrink-0">
            <Volume2 className="w-4 h-4" />
          </div>
        </button>

        {/* AFTER Option */}
        <button
          onClick={() => handlePlay('after')}
          className={`p-4 rounded-xl border text-right transition flex items-start justify-between ${
            activeMode === 'after'
              ? 'bg-[#90FF00]/10 border-[#90FF00] text-white shadow-lg shadow-[#90FF00]/10'
              : 'bg-[#181824] border-[#28283a] text-gray-300 hover:border-gray-500'
          }`}
        >
          <div>
            <div className="font-bold text-xs text-[#90FF00] uppercase tracking-wider mb-1">
              {isRtl ? 'אחרי עיבוד (AFTER / WET)' : 'AFTER (PROCESSED)'}
            </div>
            <p className="text-xs text-gray-400 leading-snug">
              {isRtl ? descriptionAfterHe : descriptionAfter}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-[#222234] text-[#90FF00] shrink-0">
            <Volume2 className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};
