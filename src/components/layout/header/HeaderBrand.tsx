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
    <div className="flex items-center gap-2.5 shrink-0 min-w-0">
      {onToggleMobileMenu && (
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 rounded bg-[#222] hover:bg-[#333] text-[#90FF00] border border-[#333] transition-colors cursor-pointer shrink-0"
          aria-label={t('header.toggleMenu')}
        >
          <Menu className="w-4 h-4" />
        </button>
      )}

      <div
        onClick={() => onNavigate && onNavigate('dashboard')}
        className="flex items-center gap-2 cursor-pointer group shrink-0 select-none"
      >
        <BrandSymbolMark sizeClass="w-7 h-7" />
        <div className="flex flex-col leading-tight">
          <span className="text-xs md:text-sm font-extrabold text-white tracking-tight group-hover:text-[#90FF00] transition-colors font-sans">
            Ableton AI Music Coach
          </span>
          <span className="text-[10px] text-gray-400 font-mono font-medium truncate max-w-[170px] sm:max-w-none">
            {t('header.brandSubtitle')}
          </span>
        </div>
      </div>
    </div>
  );
};
