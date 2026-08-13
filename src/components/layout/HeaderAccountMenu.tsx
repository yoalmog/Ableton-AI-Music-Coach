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

  if (!user || user.isGuest) {
    return (
      <button
        onClick={onOpenAuthModal}
        className="py-1.5 px-3 bg-[#90FF00] hover:bg-[#80EE00] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm shrink-0"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>{t('auth.loginBtn')}</span>
      </button>
    );
  }

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-1 px-2.5 bg-[#222222] hover:bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg transition-colors cursor-pointer"
      >
        <div className="w-6 h-6 rounded-md bg-[#333] border border-[#444] text-[#90FF00] font-mono font-bold text-xs flex items-center justify-center shrink-0">
          {user.displayName.charAt(0).toUpperCase()}
        </div>

        <span className="text-xs font-mono font-medium text-white max-w-[100px] truncate hidden sm:inline">
          {user.displayName}
        </span>

        <span
          className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
            isPro ? 'bg-[#90FF00] text-black' : 'bg-[#333] text-gray-300'
          }`}
        >
          {isPro ? 'PRO' : 'FREE'}
        </span>

        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 w-64 bg-[#1C1C1C] border border-[#3A3A3A] rounded-xl shadow-2xl p-2 z-50 text-left rtl:text-right"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="p-3 bg-[#151515] border border-[#2B2B2B] rounded-lg mb-2">
            <div className="text-xs font-bold font-mono text-white truncate">{user.displayName}</div>
            <div className="text-[11px] font-mono text-gray-400 truncate">{user.email}</div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-gray-300">
              <span>Cloud AI Requests:</span>
              <span className="font-bold text-[#90FF00]">
                {usage?.aiCloudRequestsCount || 0} / {usage?.aiCloudRequestsLimit || 15}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAccountView();
              }}
              className="w-full text-left rtl:text-right px-3 py-2 text-xs font-mono text-gray-200 hover:text-white hover:bg-[#282828] rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
            >
              <User className="w-4 h-4 text-gray-400" />
              <span>{t('account.title')}</span>
            </button>

            {!isPro && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenUpgradeModal();
                }}
                className="w-full text-left rtl:text-right px-3 py-2 text-xs font-mono text-[#90FF00] hover:bg-[#90FF00]/10 rounded-lg flex items-center gap-2 cursor-pointer transition-colors font-bold"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>{t('sub.upgradeBtn')}</span>
              </button>
            )}

            {isPro && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  subscriptionService.manageSubscription().then((r) => r.portalUrl && (window.location.href = r.portalUrl));
                }}
                className="w-full text-left rtl:text-right px-3 py-2 text-xs font-mono text-gray-200 hover:text-white hover:bg-[#282828] rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-[#00E5FF]" />
                <span>{t('sub.manageSubBtn')}</span>
              </button>
            )}

            <div className="border-t border-[#2A2A2A] my-1" />

            <button
              onClick={() => {
                setIsOpen(false);
                authService.logout();
                onOpenAuthModal();
              }}
              className="w-full text-left rtl:text-right px-3 py-2 text-xs font-mono text-[#FF8888] hover:bg-[#FF5555]/10 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('auth.loginBtn') === 'LOGIN' ? 'Log Out' : 'התנתק'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
