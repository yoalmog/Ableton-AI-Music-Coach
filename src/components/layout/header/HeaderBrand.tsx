import React, { useState } from 'react';
import { Menu, Music2 } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { getAssetPath } from '../../../utils/assetPath';

interface HeaderBrandProps {
  onNavigate?: (view: any) => void;
  onToggleMobileMenu?: () => void;
}

const BrandSymbolMark: React.FC<{ sizeClass?: string }> = ({ sizeClass = "w-7 h-7" }) => {
  const [imgState, setImgState] = useState<'png' | 'svg' | 'icon'>('png');

  if (imgState === 'icon') {
    return (
      <div className={`${sizeClass} flex items-center justify-center bg-[#252525] rounded border border-[#333] text-[#90FF00] shrink-0`}>
        <Music2 className="w-4 h-4" />
      </div>
    );
  }

  const currentSrc = imgState === 'png'
    ? getAssetPath('branding/symbol.png')
    : getAssetPath('branding/symbol.svg');

  return (
    <img
      src={currentSrc}
      alt="AAMC Logo"
      className={`${sizeClass} object-contain shrink-0`}
      onError={() => {
        if (imgState === 'png') {
          setImgState('svg');
        } else {
          setImgState('icon');
        }
      }}
    />
  );
};

export const HeaderBrand: React.FC<HeaderBrandProps> = ({
  onNavigate,
  onToggleMobileMenu,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2 shrink-0 min-w-0">
      {onToggleMobileMenu && (
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 rounded-md bg-[#1C1C1C] hover:bg-[#282828] text-gray-300 hover:text-white border border-[#2E2E2E] transition-colors cursor-pointer shrink-0"
          aria-label={t('header.toggleMenu')}
        >
          <Menu className="w-4 h-4" />
        </button>
      )}

      <div
        onClick={() => onNavigate && onNavigate('dashboard')}
        className="flex items-center gap-2 cursor-pointer group shrink-0 select-none py-1"
      >
        <BrandSymbolMark sizeClass="w-6 h-6" />
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-bold text-white tracking-tight group-hover:text-[#90FF00] transition-colors font-sans">
            Ableton AI Coach
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#1E1E1E] text-gray-400 border border-[#2E2E2E]">
            Live 12
          </span>
        </div>
      </div>
    </div>
  );
};
