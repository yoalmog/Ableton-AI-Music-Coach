import React from 'react';
import { Sparkles, LogIn, UserPlus, ShieldAlert, Music2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getAssetPath } from '../../utils/assetPath';

interface WelcomeScreenProps {
  onSelectLogin: () => void;
  onSelectRegister: () => void;
  onSelectGuest: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectLogin,
  onSelectRegister,
  onSelectGuest,
}) => {
  const { t, isRTL } = useLanguage();
  const [imgState, setImgState] = React.useState<'png' | 'svg' | 'icon'>('png');

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="w-full max-w-md bg-[#1E1E1E] border border-[#333] rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center relative"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Logo Symbol */}
        <div className="w-16 h-16 rounded-2xl bg-[#252525] border border-[#3A3A3A] flex items-center justify-center p-3 mb-4 shadow-lg shrink-0">
          {imgState === 'icon' ? (
            <Music2 className="w-10 h-10 text-[#90FF00]" />
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
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono mb-1">
          {t('auth.welcomeTitle')}
        </h1>
        <p className="text-sm text-gray-400 mb-6 font-medium">
          {t('auth.welcomeSubtitle')}
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-3 mb-6">
          <button
            onClick={onSelectLogin}
            className="w-full py-3 px-4 bg-[#90FF00] hover:bg-[#80EE00] text-black font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md"
          >
            <LogIn className="w-4 h-4 shrink-0" />
            <span>{t('auth.loginBtn')}</span>
          </button>

          <button
            onClick={onSelectRegister}
            className="w-full py-3 px-4 bg-[#282828] hover:bg-[#333] text-white border border-[#444] font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#00E5FF] shrink-0" />
            <span>{t('auth.createAccountBtn')}</span>
          </button>

          <button
            onClick={onSelectGuest}
            className="w-full py-2.5 px-4 bg-transparent hover:bg-[#222] text-gray-300 font-medium text-xs rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#333]"
          >
            <span>{t('auth.continueGuestBtn')}</span>
          </button>
        </div>

        {/* Guest Limitations Warning Box */}
        <div className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-3 text-left rtl:text-right flex items-start gap-2.5 text-xs text-gray-400">
          <ShieldAlert className="w-4 h-4 text-[#FFB700] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t('auth.guestNotice')}
          </p>
        </div>
      </div>
    </div>
  );
};
