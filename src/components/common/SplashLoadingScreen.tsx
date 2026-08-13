import React from 'react';
import { Loader2, Music2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getAssetPath } from '../../utils/assetPath';

export const SplashLoadingScreen: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [imgState, setImgState] = React.useState<'png' | 'svg' | 'icon'>('png');

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 bg-[#0D0D0D] flex flex-col items-center justify-center p-6 text-white font-sans select-none"
    >
      {/* Central Branding Card */}
      <div className="flex flex-col items-center text-center max-w-sm space-y-5 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center p-4 shadow-2xl relative group">
          {imgState === 'icon' ? (
            <Music2 className="w-12 h-12 text-[#90FF00]" />
          ) : (
            <img
              src={getAssetPath(imgState === 'png' ? 'branding/symbol.png' : 'branding/symbol.svg')}
              alt="AAMC Logo"
              className="w-full h-full object-contain"
              onError={() => {
                if (imgState === 'png') setImgState('svg');
                else setImgState('icon');
              }}
            />
          )}
          <div className="absolute inset-0 rounded-2xl bg-[#90FF00]/10 blur-md pointer-events-none" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-wider font-mono text-white uppercase">
            Ableton <span className="text-[#90FF00]">AI</span> Music Coach
          </h1>
          <p className="text-xs text-[#888] font-mono mt-1">
            Ableton Live 12 Desktop Workstation & Simulator
          </p>
        </div>

        {/* Loading Spinner & Status */}
        <div className="flex flex-col items-center space-y-2 pt-4">
          <Loader2 className="w-6 h-6 text-[#90FF00] animate-spin" />
          <span className="text-xs font-mono text-gray-400">
            {t ? t('common.loading') : 'Initializing Studio Session...'}
          </span>
        </div>
      </div>
    </div>
  );
};
