import React, { useState } from 'react';
import { Search, Settings, Mic, Sparkles } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { AAMCProject } from '../../../types';
import { HeaderAccountMenu } from '../HeaderAccountMenu';
import { VolumePopover } from './VolumePopover';
import { AIStatusPopover } from './AIStatusPopover';
import { VoiceControlWidget } from '../../chat/VoiceControlWidget';

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
  onOpenCoachWithMessage,
  onOpenSettings,
  onOpenSetup,
  onOpenAuthModal,
  onOpenAccountView,
  onOpenUpgradeModal,
  status,
  project,
  volume,
  onVolumeChange,
}) => {
  const [isAIPopoverOpen, setIsAIPopoverOpen] = useState(false);
  const { t, language, setLanguage, currentLanguageConfig } = useLanguage();

  const isConnected = status.activeProvider === 'gemini'
    ? status.cloudOk
    : status.localOk || status.activeProvider === 'offline_coach';

  const providerShortName = status.activeProvider === 'gemini'
    ? t('header.cloudAI')
    : status.activeProvider === 'offline_coach'
    ? t('header.offline')
    : t('header.localAI');

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      {/* Search Trigger */}
      <button
        onClick={onOpenSearch}
        title={t('header.search')}
        aria-label={t('header.search')}
        className="p-1.5 rounded bg-[#1C1C1C] hover:bg-[#282828] text-gray-300 border border-[#333] transition-colors cursor-pointer"
      >
        <Search className="w-3.5 h-3.5" />
      </button>

      {/* Compact AI Status Indicator */}
      <div className="relative">
        <button
          onClick={() => setIsAIPopoverOpen((prev) => !prev)}
          title={t('header.aiStatusTooltip')}
          aria-label={t('header.aiStatusTooltip')}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono font-bold border transition cursor-pointer ${
            status.loading
              ? 'bg-[#1E1E1E] border-[#333] text-gray-400'
              : isConnected
              ? 'bg-[#122212] border-[#1E441E] text-[#90FF00] hover:bg-[#183018]'
              : 'bg-[#2A1515] border-[#522222] text-[#FF5555] hover:bg-[#3D1A1A]'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              status.loading
                ? 'bg-[#00E5FF] animate-ping'
                : isConnected
                ? 'bg-[#90FF00]'
                : 'bg-[#FF5555]'
            }`}
          />
          <span className="hidden sm:inline">{providerShortName}</span>
        </button>

        {/* AI Popover */}
        <AIStatusPopover
          isOpen={isAIPopoverOpen}
          onClose={() => setIsAIPopoverOpen(false)}
          status={status}
          project={project}
          onOpenSetup={onOpenSetup}
          onOpenSettings={onOpenSettings}
        />
      </div>

      {/* Voice AI Control */}
      <VoiceControlWidget onSendMessage={onOpenCoachWithMessage} />

      {/* Volume Control Popover */}
      <VolumePopover volume={volume} onVolumeChange={onVolumeChange} />

      {/* Compact Language Switcher */}
      <button
        onClick={() => {
          const nextLang = language === 'en' ? 'he' : language === 'he' ? 'es' : 'en';
          setLanguage(nextLang);
        }}
        title={`${t('header.language')}: ${currentLanguageConfig.nativeName}`}
        aria-label={t('header.language')}
        className="px-2 py-1 rounded bg-[#1C1C1C] hover:bg-[#282828] text-[#E0E0E0] border border-[#333] transition-colors cursor-pointer text-xs font-mono font-bold"
      >
        <span>{currentLanguageConfig.nativeName}</span>
      </button>

      {/* Settings Trigger */}
      <button
        onClick={() => {
          if (onOpenSettings) onOpenSettings();
        }}
        title={t('header.settings')}
        aria-label={t('header.settings')}
        className="p-1.5 rounded bg-[#1C1C1C] hover:bg-[#282828] text-gray-300 border border-[#333] transition-colors cursor-pointer"
      >
        <Settings className="w-3.5 h-3.5" />
      </button>

      {/* Account Menu */}
      <HeaderAccountMenu
        onOpenAuthModal={onOpenAuthModal || (() => {})}
        onOpenAccountView={onOpenAccountView || (() => {})}
        onOpenUpgradeModal={onOpenUpgradeModal || (() => {})}
      />
    </div>
  );
};
