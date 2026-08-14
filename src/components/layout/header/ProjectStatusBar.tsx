import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { AAMCProject } from '../../../types';
import { ProjectMenu } from './ProjectMenu';

interface ProjectStatusBarProps {
  project: AAMCProject;
  onProjectChange: (p: AAMCProject) => void;
  onSave: () => void;
  onLoad: () => void;
  saveStatus?: string | null;
  status: {
    activeProvider: string;
    activeModel: string;
    localOk: boolean;
    cloudOk: boolean;
    privacyMode: boolean;
    loading: boolean;
  };
  onOpenSetup?: () => void;
  onOpenSettings?: () => void;
}

export const ProjectStatusBar: React.FC<ProjectStatusBarProps> = ({
  project,
  onProjectChange,
  onSave,
  onLoad,
  saveStatus,
  status,
  onOpenSetup,
  onOpenSettings,
}) => {
  const { t, isRTL, language } = useLanguage();

  const isConnected = status.activeProvider === 'gemini'
    ? status.cloudOk
    : status.localOk || status.activeProvider === 'offline_coach';

  const providerName = status.activeProvider === 'gemini'
    ? t('header.cloudAI')
    : status.activeProvider === 'offline_coach'
    ? t('header.offline')
    : t('header.localAI');

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="h-[42px] px-3 md:px-4 bg-[#141414] border-t border-[#222222] flex items-center justify-between text-xs font-mono text-[#E0E0E0] select-none overflow-x-auto no-scrollbar gap-2"
    >
      {/* Left / Primary Block: Project Dropdown Menu */}
      <div className="flex items-center gap-3 shrink-0">
        <ProjectMenu
          project={project}
          onProjectChange={onProjectChange}
          onSave={onSave}
          onLoad={onLoad}
          saveStatus={saveStatus}
        />
      </div>

      {/* Center Block: Musical Parameters (Genre, Key, BPM) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-[11px]">
        {/* Genre */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2B2B2B] px-2 py-0.5 rounded">
          <span className="text-gray-400 font-bold">{t('header.genre')}</span>
          <span className="text-[#FFB703] font-bold truncate max-w-[90px]" dir="ltr">
            {project.genre || 'Psytrance'}
          </span>
        </div>

        {/* Key */}
        <div className="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2B2B2B] px-2 py-0.5 rounded">
          <span className="text-gray-400 font-bold">{t('header.key')}</span>
          <span className="text-[#00E5FF] font-bold" dir="ltr">
            {project.key || 'F# Minor'}
          </span>
        </div>

        {/* BPM */}
        <div className="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2B2B2B] px-2 py-0.5 rounded">
          <span className="text-gray-400 font-bold">{t('header.bpm')}</span>
          <span className="text-[#90FF00] font-bold" dir="ltr">
            {project.bpm || 142} BPM
          </span>
        </div>
      </div>

      {/* Right Block: AI Summary & Ableton Connection Status */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-[11px]">
        {/* AI Summary Indicator */}
        <button
          onClick={() => {
            if (onOpenSetup) onOpenSetup();
            else if (onOpenSettings) onOpenSettings();
          }}
          className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#252525] border border-[#2B2B2B] px-2 py-0.5 rounded transition cursor-pointer"
        >
          <span className="text-gray-400 font-bold">{t('header.ai')}:</span>
          <span className="font-bold flex items-center gap-1">
            <span>{providerName}</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isConnected ? 'bg-[#90FF00]' : 'bg-[#FF5555]'
              }`}
            />
            <span className={isConnected ? 'text-[#90FF00]' : 'text-[#FF5555]'}>
              {isConnected ? t('header.connected') : t('header.disconnected')}
            </span>
          </span>
        </button>

        {/* Ableton Status */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2B2B2B] px-2 py-0.5 rounded text-gray-300">
          <span className="text-gray-400 font-bold">{t('header.abletonStatus')}:</span>
          <span className="font-bold text-gray-200" dir="ltr">
            {t('header.manualMode')}
          </span>
        </div>
      </div>
    </div>
  );
};
