import React from 'react';
import { Save, FolderOpen, Globe, Volume2, Sparkles, Search, Menu, Settings, Music2 } from 'lucide-react';
import { projectService } from '../../services/projectService';
import { audioService } from '../../services/audioService';
import { useLanguage } from '../../context/LanguageContext';
import { AAMCProject } from '../../types';
import { VoiceControlWidget } from '../chat/VoiceControlWidget';
import { Tooltip } from '../common/Tooltip';
import { AIStatusBadge } from '../ai/AIStatusBadge';
import { HeaderAccountMenu } from './HeaderAccountMenu';
import { getAssetPath } from '../../utils/assetPath';

// Resilient Logo Mark component with image fallback and vector icon backup
const BrandSymbolMark: React.FC<{ sizeClass?: string }> = ({ sizeClass = "w-6 h-6" }) => {
  const [imgState, setImgState] = React.useState<'png' | 'svg' | 'icon'>('png');

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
      alt="AAMC"
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

interface HeaderProps {
  project: AAMCProject;
  onProjectChange: (p: AAMCProject) => void;
  onOpenCoach: () => void;
  onOpenSearch: () => void;
  onOpenCoachWithMessage: (msg: string) => void;
  onOpenSettings?: () => void;
  onOpenSetup?: () => void;
  onToggleMobileMenu?: () => void;
  onOpenAuthModal?: () => void;
  onOpenAccountView?: () => void;
  onOpenUpgradeModal?: () => void;
  isDesktop: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  onProjectChange,
  onOpenCoach,
  onOpenSearch,
  onOpenCoachWithMessage,
  onOpenSettings,
  onOpenSetup,
  onToggleMobileMenu,
  onOpenAuthModal,
  onOpenAccountView,
  onOpenUpgradeModal,
  isDesktop,
}) => {
  const [vol, setVol] = React.useState(80);
  const [saveStatus, setSaveStatus] = React.useState<string | null>(null);
  const { language, setLanguage, t, currentLanguageConfig } = useLanguage();
  const coachLabel = React.useMemo(() => (t ? t('nav.coach') : 'COACH'), [t]);

  const handleSave = async () => {
    setSaveStatus(t ? t('common.loading') : 'Saving...');
    const res = await projectService.saveProject(project);
    if (res.success) {
      setSaveStatus(t ? t('notifications.savedSuccessfully') : 'Saved!');
      setTimeout(() => setSaveStatus(null), 2500);
    } else {
      setSaveStatus(t ? t('common.cancel') : 'Error');
      setTimeout(() => setSaveStatus(null), 1500);
    }
  };

  const handleLoad = async () => {
    try {
      const res = await projectService.loadProject();
      if (res) {
        onProjectChange(res.project);
        setSaveStatus(t ? t('notifications.projectOpened') : 'Opened');
        setTimeout(() => setSaveStatus(null), 2500);
      }
    } catch (err: any) {
      alert(err.message || 'Could not load project');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVol(val);
    audioService.setMasterVolume(val / 100);
  };

  return (
    <header className="bg-[#1A1A1A] border-b border-[#333] text-[#E0E0E0] h-12 md:h-11 px-3 md:px-4 flex items-center justify-between select-none z-30 font-sans shrink-0 w-full max-w-full">
      {/* MOBILE HEADER LAYOUT (md:hidden) */}
      <div className="flex md:hidden items-center justify-between w-full gap-1 overflow-x-auto no-scrollbar">
        {/* Left: Mobile Menu Trigger + App Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="p-1.5 rounded bg-[#252525] hover:bg-[#333] text-[#90FF00] border border-[#333] transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-1.5 shrink-0" dir="ltr">
            <BrandSymbolMark sizeClass="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-tight text-white font-mono">
              AAMC
            </span>
          </div>
        </div>

        {/* Right: Search, Language, AI Badge, Voice, Settings & Coach Trigger */}
        <div className="flex items-center gap-1 shrink-0 ms-auto">
          <button
            onClick={onOpenSearch}
            className="p-1 rounded bg-[#252525] hover:bg-[#333] text-[#CCC] border border-[#333] cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center shrink-0"
            aria-label="Search"
            title="Search"
          >
            <Search className="w-3.5 h-3.5 text-[#90FF00]" />
          </button>

          <button
            onClick={() => {
              const nextLang = language === 'en' ? 'he' : language === 'he' ? 'es' : 'en';
              setLanguage(nextLang);
            }}
            className="p-1 rounded bg-[#252525] hover:bg-[#333] text-[#E0E0E0] border border-[#333] cursor-pointer min-h-[34px] px-1.5 flex items-center gap-1 font-mono text-[10px] font-bold uppercase shrink-0"
            aria-label="Switch Language"
            title="Language"
          >
            <Globe className="w-3 h-3 text-[#00E5FF]" />
            <span>{currentLanguageConfig.code.toUpperCase()}</span>
          </button>

          <AIStatusBadge onOpenSettings={onOpenSettings || (() => {})} onOpenSetup={onOpenSetup} />

          <VoiceControlWidget onTranscriptReceived={(text) => onOpenCoachWithMessage(text)} />

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-1 rounded bg-[#252525] hover:bg-[#333] text-[#AAA] border border-[#333] cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center shrink-0"
              aria-label="Settings"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onOpenCoach}
            className="flex items-center gap-1 bg-[#90FF00] hover:bg-[#80e600] text-black px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer min-h-[34px] shrink-0"
            title="AI Coach"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span className="text-[10px]">{coachLabel}</span>
          </button>
        </div>
      </div>

      {/* DESKTOP HEADER LAYOUT (hidden md:flex) */}
      <div className="hidden md:flex items-center justify-between w-full">
        {/* App Branding & Logo Mark */}
        <Tooltip content={t ? t('header.title') : 'Ableton AI Music Coach'} position="bottom" delayMs={500}>
          <div className="flex items-center gap-2.5 cursor-pointer" dir="ltr">
            <BrandSymbolMark sizeClass="w-7 h-7" />
            <span className="text-xs font-bold tracking-tight uppercase text-white/90">
              Ableton <span className="text-[#90FF00]">AI</span> Music Coach
            </span>
            <span className="text-[10px] bg-[#252525] px-1.5 py-0.5 rounded text-[#999] font-mono border border-[#333]">
              {isDesktop ? 'v1.0.0 (Desktop)' : 'v1.0.0 (Web)'}
            </span>
          </div>
        </Tooltip>

        {/* Center: BPM, Key, Search & File Actions */}
        <div className="flex items-center gap-3 lg:gap-4">
          <Tooltip content={t ? t('header.activeSession') : 'Active Session'} position="bottom" delayMs={500}>
            <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono bg-[#121212] px-3 py-1 rounded-xl border border-[#2A2A2A]">
              <div className="flex items-center gap-1.5">
                <span className="text-[#666]">PROJ</span>
                <span className="text-white font-semibold truncate max-w-[120px]">{project.name}</span>
              </div>
              <div className="w-px h-3 bg-[#333]" />
              <div className="flex items-center gap-1">
                <span className="text-[#666]">BPM</span>
                <span className="text-[#90FF00] font-bold">{project.bpm}.00</span>
              </div>
              <div className="w-px h-3 bg-[#333]" />
              <div className="flex items-center gap-1">
                <span className="text-[#666]">KEY</span>
                <span className="text-[#90FF00] font-bold">{project.key} {project.scale.toUpperCase().slice(0, 3)}</span>
              </div>
            </div>
          </Tooltip>

          {/* First Run Onboarding Level Trigger */}
          {onOpenSetup && (
            <button
              onClick={onOpenSetup}
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold bg-[#1e1b2e] hover:bg-[#28243c] text-[#A78BFA] border border-[#8B5CF6]/40 px-2.5 py-1 rounded-xl transition cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#A78BFA]" />
              <span className="font-mono text-[10px]">BEGINNER</span>
            </button>
          )}

          {/* Global Search trigger */}
          <Tooltip content={t ? t('header.search') : 'Search'} position="bottom" delayMs={500}>
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 text-[11px] bg-[#252525] hover:bg-[#333] text-[#CCC] px-2.5 py-1 rounded border border-[#444] transition-colors cursor-pointer"
            >
              <Search className="w-3 h-3 text-[#90FF00]" />
              <span className="font-mono text-[10px] uppercase">{t ? t('common.search') : 'Search'}</span>
            </button>
          </Tooltip>

          {/* Voice AI widget */}
          <Tooltip content={t ? t('header.voiceAI') : 'Voice AI'} position="bottom" delayMs={500}>
            <div>
              <VoiceControlWidget onTranscriptReceived={(text) => onOpenCoachWithMessage(text)} />
            </div>
          </Tooltip>

          {/* Save/Load Project buttons & Language Toggle */}
          <div className="flex items-center gap-2">
            <Tooltip content={t ? t('common.saveProject') : 'Save Project'} position="bottom" delayMs={500}>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 text-[11px] font-bold bg-[#252525] hover:bg-[#333] text-[#E0E0E0] px-2.5 py-1 rounded border border-[#444] transition-colors cursor-pointer uppercase tracking-wider"
              >
                <Save className="w-3 h-3 text-[#90FF00]" />
                <span>{t ? t('common.save') : 'Save'}</span>
              </button>
            </Tooltip>

            <Tooltip content={t ? t('common.loadProject') : 'Open Project'} position="bottom" delayMs={500}>
              <button
                onClick={handleLoad}
                className="flex items-center gap-1 text-[11px] font-bold bg-[#252525] hover:bg-[#333] text-[#E0E0E0] px-2.5 py-1 rounded border border-[#444] transition-colors cursor-pointer uppercase tracking-wider"
              >
                <FolderOpen className="w-3 h-3 text-[#00E5FF]" />
                <span>{t ? t('common.open') : 'Open'}</span>
              </button>
            </Tooltip>

            <Tooltip content={`${t ? t('header.language') : 'Language'}: ${currentLanguageConfig.nativeName}`} position="bottom" delayMs={500}>
              <button
                onClick={() => {
                  const nextLang = language === 'en' ? 'he' : language === 'he' ? 'es' : 'en';
                  setLanguage(nextLang);
                }}
                className="flex items-center gap-1 text-[11px] font-bold bg-[#252525] hover:bg-[#333] text-[#E0E0E0] px-2 py-1 rounded border border-[#444] transition-colors cursor-pointer"
              >
                <Globe className="w-3 h-3 text-[#00E5FF]" />
                <span className="font-mono text-[10px]">{currentLanguageConfig.nativeName}</span>
              </button>
            </Tooltip>

            {saveStatus && (
              <span className="text-[10px] font-mono text-[#90FF00] bg-[#121212] px-2 py-0.5 rounded border border-[#333] animate-pulse">
                {saveStatus}
              </span>
            )}
          </div>
        </div>

        {/* Right: Master Volume, Real AI Provider Badge, Account Menu & Coach Trigger */}
        <div className="flex items-center gap-3">
          {/* Header Account & Subscription Badge */}
          <HeaderAccountMenu
            onOpenAuthModal={onOpenAuthModal || (() => {})}
            onOpenAccountView={onOpenAccountView || (() => {})}
            onOpenUpgradeModal={onOpenUpgradeModal || (() => {})}
          />

          {/* Real AI Provider Badge */}
          <AIStatusBadge onOpenSettings={onOpenSettings || (() => {})} onOpenSetup={onOpenSetup} />

          <Tooltip content={`Master Output Volume (${vol}%)`} position="bottom" delayMs={500}>
            <div className="hidden sm:flex items-center gap-2 bg-[#121212] border border-[#2A2A2A] px-2.5 py-1 rounded">
              <Volume2 className="w-3.5 h-3.5 text-[#777]" />
              <input
                type="range"
                min="0"
                max="100"
                value={vol}
                onChange={handleVolumeChange}
                className="w-16 accent-[#90FF00] cursor-pointer"
              />
              <span className="text-[10px] font-mono text-[#888] w-7">{vol}%</span>
            </div>
          </Tooltip>

          <Tooltip content={t ? t('header.openCoach') : 'Open AI Coach'} position="bottom" delayMs={500}>
            <button
              onClick={onOpenCoach}
              className="flex items-center gap-1.5 bg-[#90FF00] hover:bg-[#80e600] text-black px-3 py-1.5 rounded text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>{coachLabel}</span>
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};
