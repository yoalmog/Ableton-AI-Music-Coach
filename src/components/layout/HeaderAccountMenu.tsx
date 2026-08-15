import React, { useState, useRef, useEffect } from 'react';
import { User, LogIn, LogOut, Sparkles, Settings, ShieldCheck, Zap, ChevronDown, ExternalLink } from 'lucide-react';
import { authService } from '../../services/authService';
import { subscriptionService } from '../../services/subscriptionService';
import { useLanguage } from '../../context/LanguageContext';
import { UserProfile, UsageInfo } from '../../types/auth';

interface HeaderAccountMenuProps {
  onOpenAuthModal: () => void;
  onOpenAccountView: () => void;
  onOpenUpgradeModal: () => void;
}

export const HeaderAccountMenu: React.FC<HeaderAccountMenuProps> = ({
  onOpenAuthModal,
  onOpenAccountView,
  onOpenUpgradeModal,
}) => {
  const { t, isRTL } = useLanguage();
  const [user, setUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [usage, setUsage] = useState<UsageInfo | null>(authService.getUsage());
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = authService.subscribe((_state, u) => {
      setUser(u);
      setUsage(authService.getUsage());
    });

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      unsub();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isPro = subscriptionService.isPro();
  const isGuest = Boolean(user?.isGuest || authService.isGuest());

  if (!user) {
    return (
      <button
        onClick={onOpenAuthModal}
        className="py-1 px-2.5 bg-[#90FF00] hover:bg-[#80EE00] text-black font-bold text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>{t('auth.loginBtn')}</span>
      </button>
    );
  }

  return (
    <div className="relative shrink-0 flex items-center" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 py-1 px-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#2E2E2E] hover:border-[#404040] rounded-md transition-colors cursor-pointer"
        aria-label="User account menu"
      >
        <div className={`w-5 h-5 rounded text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${
          isGuest ? 'bg-[#183040] text-[#00E5FF] border border-[#00E5FF]/30' : 'bg-[#283820] text-[#90FF00] border border-[#90FF00]/30'
        }`}>
          {isGuest ? 'G' : user.displayName.charAt(0).toUpperCase()}
        </div>

        <span className="text-xs font-mono font-medium text-gray-200 max-w-[90px] truncate hidden md:inline">
          {isGuest ? 'Guest' : user.displayName}
        </span>

        <span
          className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider hidden sm:inline-block ${
            isGuest
              ? 'bg-[#183040] text-[#00E5FF]'
              : isPro
              ? 'bg-[#90FF00] text-black'
              : 'bg-[#2A2A2A] text-gray-400'
          }`}
        >
          {isGuest ? 'Guest' : isPro ? t('header.pro') : t('header.free')}
        </span>

        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full mt-1.5 right-0 rtl:right-auto rtl:left-0 w-60 bg-[#181818] border border-[#333] rounded-lg shadow-2xl p-2 z-50 text-left rtl:text-right text-xs font-mono animate-in fade-in zoom-in-95 duration-100"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="p-2.5 bg-[#121212] border border-[#252525] rounded-md mb-2">
            <div className="text-xs font-bold text-white truncate flex items-center justify-between">
              <span>{user.displayName}</span>
              {isGuest && (
                <span className="text-[9px] bg-[#00E5FF]/20 text-[#00E5FF] px-1.5 py-0.2 rounded font-bold">
                  Guest
                </span>
              )}
            </div>
            <div className="text-[10px] text-gray-400 truncate mt-0.5">{user.email}</div>
            <div className="mt-2 text-[10px] text-gray-400 flex items-center justify-between border-t border-[#222] pt-1.5">
              <span>{t('header.cloudRequests')}:</span>
              <span className="font-bold text-[#90FF00]">
                {usage?.aiCloudRequestsCount || 0} / {usage?.aiCloudRequestsLimit || 15}
              </span>
            </div>
          </div>

          <div className="space-y-0.5">
            {isGuest ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full text-left rtl:text-right px-2.5 py-1.5 text-xs text-black bg-[#90FF00] hover:bg-[#80EE00] font-bold rounded-md flex items-center gap-2 cursor-pointer transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Create Free Account</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAccountView();
                }}
                className="w-full text-left rtl:text-right px-2.5 py-1.5 text-xs text-gray-200 hover:text-white hover:bg-[#252525] rounded-md flex items-center gap-2 cursor-pointer transition-colors"
              >
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span>{t('account.title')}</span>
              </button>
            )}

            {!isPro && !isGuest && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenUpgradeModal();
                }}
                className="w-full text-left rtl:text-right px-2.5 py-1.5 text-xs text-[#90FF00] hover:bg-[#90FF00]/10 rounded-md flex items-center gap-2 cursor-pointer transition-colors font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>{t('sub.upgradeBtn')}</span>
              </button>
            )}

            {isPro && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  subscriptionService.manageSubscription().then((r) => r.portalUrl && (window.location.href = r.portalUrl));
                }}
                className="w-full text-left rtl:text-right px-2.5 py-1.5 text-xs text-gray-200 hover:text-white hover:bg-[#252525] rounded-md flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>{t('sub.manageSubBtn')}</span>
              </button>
            )}

            <div className="border-t border-[#252525] my-1" />

            <button
              onClick={() => {
                setIsOpen(false);
                authService.logout();
                onOpenAuthModal();
              }}
              className="w-full text-left rtl:text-right px-2.5 py-1.5 text-xs text-[#FF8888] hover:bg-[#FF5555]/10 rounded-md flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isGuest ? 'Reset Guest Session' : t('header.logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
