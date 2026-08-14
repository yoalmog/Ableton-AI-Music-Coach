import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { audioService } from '../../../services/audioService';

interface VolumePopoverProps {
  volume: number;
  onVolumeChange: (val: number) => void;
}

export const VolumePopover: React.FC<VolumePopoverProps> = ({ volume, onVolumeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prevVol, setPrevVol] = useState(80);
  const { t, isRTL } = useLanguage();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVol(volume);
      onVolumeChange(0);
      audioService.setMasterVolume(0);
    } else {
      const restore = prevVol || 80;
      onVolumeChange(restore);
      audioService.setMasterVolume(restore / 100);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onVolumeChange(val);
    audioService.setMasterVolume(val / 100);
  };

  const IconComponent = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-1.5 rounded border transition cursor-pointer ${
          isOpen
            ? 'bg-[#222] border-[#90FF00] text-[#90FF00]'
            : 'bg-[#1C1C1C] hover:bg-[#282828] text-gray-300 border-[#333]'
        }`}
        title={t('header.volume')}
        aria-label={t('header.volume')}
      >
        <IconComponent className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          className="absolute top-full mt-1.5 ltr:right-0 rtl:left-0 z-50 w-48 bg-[#181818] border border-[#333] rounded-lg shadow-2xl p-3 text-xs font-mono text-[#E0E0E0] animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#2B2B2B]">
            <span className="text-[10px] text-gray-400 font-bold uppercase">{t('header.volume')}</span>
            <span className="text-[#90FF00] font-bold" dir="ltr">{volume}%</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-1 rounded hover:bg-[#252525] text-gray-400 hover:text-white transition cursor-pointer"
            >
              <IconComponent className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleChange}
              aria-label={t('header.volume')}
              className="w-full accent-[#90FF00] cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
