import React from 'react';
import { Search, Settings, Sparkles, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { AAMCProject } from '../../../types';
import { HeaderAccountMenu } from '../HeaderAccountMenu';

interface HeaderActionsProps {
  onOpenSearch: () => void;
  onOpenCoach: () => void;
  onOpenCoachWithMessage: (msg: string) => void;
  onOpenSettings?: () => void;
  onOpenSetup?: () => void;
  onOpenAuthModal?: () => void;
  onOpenAccountView?: () => void;
  onOpenUpgradeModal?: () => void;
  status: {
    activeProvider: string;
    activeModel: string;
    privacyMode: boolean;
    localOk: boolean;
    cloudOk: boolean;
    isAndroid: boolean;
    loading: boolean;
  };
  project: AAMCProject;
  volume: number;
  onVolumeChange: (val: number) => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  onOpenSearch,
  onOpenCoach,
  onOpenSettings,
  onOpenAuthModal,
  onOpenAccountView,
  onOpenUpgradeModal,
  status,
}) => {
  const { t } = useLanguage();

  const isConnected = status.activeProvider === 'gemini'
    ? status.cloudOk
    : status.localOk || status.activeProvider === 'offline_coach';

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      {/* Global Search Button */}
      <button
        onClick={onOpenSearch}
        title={t('header.searchTooltip')}
        aria-label={t('header.search')}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#181818] hover:bg-[#252525] text-gray-400 hover:text-white border border-[#2E2E2E] transition-colors cursor-pointer text-xs font-mono"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden lg:inline text-[10px] bg-[#121212] px-1 py-0.2 rounded text-gray-400 border border-[#2A2A2A]">
          ⌘K
        </span>
      </button>

      {/* AI Coach Action Button */}
      <button
        onClick={onOpenCoach}
        title={t('header.openCoach')}
        aria-label={t('header.openCoachBtn')}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#162316] hover:bg-[#1E331E] border border-[#244A24] text-[#90FF00] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-xs font-mono font-bold"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            status.loading
              ? 'bg-[#00E5FF] animate-ping'
              : isConnected
              ? 'bg-[#90FF00]'
              : 'bg-[#FF5555]'
          }`}
        />
        <Sparkles className="w-3.5 h-3.5 fill-current" />
        <span className="hidden sm:inline">{t('header.openCoachBtn')}</span>
      </button>

      {/* Settings Modal Launcher */}
      {onOpenSettings && (
        <button
          onClick={onOpenSettings}
          title={t('header.settings')}
          aria-label={t('header.settings')}
          className="p-1.5 rounded-md bg-[#181818] hover:bg-[#252525] text-gray-400 hover:text-white border border-[#2E2E2E] transition-colors cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Account / User Menu */}
      <HeaderAccountMenu
        onOpenAuthModal={onOpenAuthModal || (() => {})}
        onOpenAccountView={onOpenAccountView || (() => {})}
        onOpenUpgradeModal={onOpenUpgradeModal || (() => {})}
      />
    </div>
  );
};
