import React, { useState, useEffect } from 'react';
import {
  Search,
  Settings,
  Sparkles,
  Globe,
  Cpu,
  Check,
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { audioService } from '../../services/audioService';
import { aiService } from '../../services/aiService';
import { useLanguage } from '../../context/LanguageContext';
import { AAMCProject } from '../../types';
import { HeaderBrand } from './header/HeaderBrand';
import { HeaderAccountMenu } from './HeaderAccountMenu';
import { ProjectMenu } from './header/ProjectMenu';
import { VolumePopover } from './header/VolumePopover';
import { AIStatusPopover } from './header/AIStatusPopover';
import { VoiceControlWidget } from '../chat/VoiceControlWidget';

export interface HeaderProps {
  project: AAMCProject;
  onProjectChange: (p: AAMCProject) => void;
  currentView?: string;
  onNavigate?: (view: any) => void;
  onOpenCoach: () => void;
  onOpenSearch: () => void;
  onOpenCoachWithMessage: (msg: string) => void;
  onOpenSettings?: () => void;
  onOpenSetup?: () => void;
  onToggleMobileMenu?: () => void;
  onOpenAuthModal?: () => void;
  onOpenAccountView?: () => void;
  onOpenUpgradeModal?: () => void;
  isDesktop?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  onProjectChange,
  currentView = 'dashboard',
  onNavigate,
  onOpenCoach,
  onOpenSearch,
  onOpenCoachWithMessage,
  onOpenSettings,
  onOpenSetup,
  onToggleMobileMenu,
  onOpenAuthModal,
  onOpenAccountView,
  onOpenUpgradeModal,
  isDesktop = true,
}) => {
  const { t, isRTL, language, setLanguage, currentLanguageConfig, supportedLanguages } = useLanguage();
  const [vol, setVol] = useState(80);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isAIPopoverOpen, setIsAIPopoverOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const [aiStatus, setAiStatus] = useState<{
    activeProvider: string;
    activeModel: string;
    privacyMode: boolean;
    localOk: boolean;
    cloudOk: boolean;
    isAndroid: boolean;
    loading: boolean;
  }>({
    activeProvider: 'none',
    activeModel: 'Checking...',
    privacyMode: false,
    localOk: false,
    cloudOk: false,
    isAndroid: false,
    loading: true,
  });

  const checkAiStatus = async () => {
    try {
      const diag = await aiService.getDiagnostics();
      setAiStatus({
        activeProvider: diag.activeProvider,
        activeModel: diag.activeModel,
        privacyMode: diag.settings.privacyMode,
        localOk: diag.localHealth.ok,
        cloudOk: diag.cloudHealth.ok,
        isAndroid: Boolean(diag.isAndroid),
        loading: false,
      });
    } catch {
      setAiStatus({
        activeProvider: 'offline_coach',
        activeModel: 'Offline',
        privacyMode: false,
        localOk: false,
        cloudOk: false,
        isAndroid: false,
        loading: false,
      });
    }
  };

  useEffect(() => {
    checkAiStatus();
    const timer = setInterval(checkAiStatus, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleSave = async () => {
    setSaveStatus(t('header.loading'));
    const res = await projectService.saveProject(project);
    if (res.success) {
      setSaveStatus(t('header.save') + ' ✓');
      setTimeout(() => setSaveStatus(null), 2500);
    } else {
      setSaveStatus('Error');
      setTimeout(() => setSaveStatus(null), 1500);
    }
  };

  const handleLoad = async () => {
    try {
      const res = await projectService.loadProject();
      if (res) {
        onProjectChange(res.project);
        setSaveStatus(t('header.open') + ' ✓');
        setTimeout(() => setSaveStatus(null), 2500);
      }
    } catch (err: any) {
      alert(err.message || 'Could not load project');
    }
  };

  const handleVolumeChange = (val: number) => {
    setVol(val);
    audioService.setMasterVolume(val / 100);
  };

  const isAiConnected = aiStatus.activeProvider === 'gemini'
    ? aiStatus.cloudOk
    : aiStatus.localOk || aiStatus.activeProvider === 'offline_coach';

  const providerDisplayName = aiStatus.activeProvider === 'gemini'
    ? t('header.cloudAI')
    : aiStatus.activeProvider === 'offline_coach'
    ? t('header.offline')
    : t('header.localAI');

  return (
    <header
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full flex flex-col items-stretch justify-between bg-[#0E0E0E] border-b border-[#242424] text-[#E0E0E0] select-none z-30 font-sans shrink-0 min-w-0 max-w-full shadow-lg"
    >
      {/* ========================================================================= */}
      {/* ROW 1: PRIMARY STUDIO CONTROL BAR (Full width flex/wrap layout)            */}
      {/* ========================================================================= */}
      <div className="w-full flex flex-wrap md:flex-nowrap items-center justify-between gap-1.5 sm:gap-3 px-2 sm:px-3 md:px-4 py-1.5 md:py-0 min-h-[46px] sm:min-h-[50px] bg-[#111111] min-w-0 max-w-full border-b border-[#202020]">
        {/* Left Section: Brand Logo & DAW Title */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink-0">
          <HeaderBrand
            onNavigate={onNavigate}
            onToggleMobileMenu={onToggleMobileMenu}
          />
        </div>

        {/* Right Section: Interactive DAW Utility Actions - Flex Wrap on Mobile */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-1 sm:gap-2 shrink-0">
          {/* Global Studio Search (⌘K / Ctrl+K) */}
          <button
            onClick={onOpenSearch}
            title={t('header.searchTooltip')}
            aria-label={t('header.search')}
            className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-md bg-[#181818] hover:bg-[#242424] text-gray-300 hover:text-white border border-[#2D2D2D] hover:border-[#404040] transition-colors cursor-pointer text-xs font-mono"
          >
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="hidden sm:inline text-gray-300">{t('header.search')}</span>
            <kbd className="hidden md:inline-block px-1 py-0.2 rounded text-[10px] font-mono bg-[#111] text-gray-400 border border-[#282828]" dir="ltr">
              ⌘K
            </kbd>
          </button>

          {/* AI Coach Action Button */}
          <button
            onClick={onOpenCoach}
            title={t('header.openCoach')}
            aria-label={t('header.openCoachBtn')}
            className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-md bg-[#132213] hover:bg-[#1A301A] border border-[#224822] text-[#90FF00] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-xs font-mono font-bold shadow-sm"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                aiStatus.loading
                  ? 'bg-[#00E5FF] animate-ping'
                  : isAiConnected
                  ? 'bg-[#90FF00]'
                  : 'bg-[#FF5555]'
              }`}
            />
            <Sparkles className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="hidden sm:inline">{t('header.openCoachBtn')}</span>
          </button>

          {/* AI Diagnostics Popover Button */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsAIPopoverOpen((prev) => !prev)}
              title={t('header.aiStatusTooltip')}
              aria-label={t('header.aiStatusTooltip')}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-mono font-bold border transition cursor-pointer ${
                aiStatus.loading
                  ? 'bg-[#1C1C1C] border-[#333] text-gray-400'
                  : isAiConnected
                  ? 'bg-[#161F16] border-[#1E3E1E] text-[#90FF00] hover:bg-[#1C291C]'
                  : 'bg-[#251515] border-[#442020] text-[#FF5555] hover:bg-[#321B1B]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden lg:inline">{providerDisplayName}</span>
            </button>

            <AIStatusPopover
              isOpen={isAIPopoverOpen}
              onClose={() => setIsAIPopoverOpen(false)}
              status={aiStatus}
              project={project}
              onOpenSetup={onOpenSetup}
              onOpenSettings={onOpenSettings}
            />
          </div>

          {/* Voice AI Widget */}
          <div className="hidden lg:block">
            <VoiceControlWidget onTranscriptReceived={onOpenCoachWithMessage} />
          </div>

          {/* Master Volume Popover */}
          <VolumePopover volume={vol} onVolumeChange={handleVolumeChange} />

          {/* Compact Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen((prev) => !prev)}
              title={`${t('header.language')}: ${currentLanguageConfig.nativeName}`}
              aria-label={t('header.language')}
              className="flex items-center gap-1 px-1.5 sm:px-2 py-1.5 rounded-md bg-[#181818] hover:bg-[#242424] text-gray-300 hover:text-white border border-[#2D2D2D] transition-colors cursor-pointer text-xs font-mono font-bold"
            >
              <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="uppercase text-[11px]" dir="ltr">
                {language}
              </span>
            </button>

            {isLangMenuOpen && (
              <div
                className="absolute top-full mt-1.5 right-0 rtl:right-auto rtl:left-0 z-50 w-36 max-w-[calc(100vw-24px)] bg-[#161616] border border-[#303030] rounded-lg shadow-2xl p-1 text-xs font-mono animate-in fade-in zoom-in-95 duration-100"
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {supportedLanguages.map((langConfig) => (
                  <button
                    key={langConfig.code}
                    onClick={() => {
                      setLanguage(langConfig.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left rtl:text-right px-2.5 py-1.5 rounded flex items-center justify-between transition cursor-pointer ${
                      language === langConfig.code
                        ? 'bg-[#90FF00]/15 text-[#90FF00] font-bold'
                        : 'text-gray-300 hover:bg-[#222] hover:text-white'
                    }`}
                  >
                    <span>{langConfig.nativeName}</span>
                    {language === langConfig.code && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Settings Launcher */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title={t('header.settings')}
              aria-label={t('header.settings')}
              className="p-1.5 rounded-md bg-[#181818] hover:bg-[#242424] text-gray-400 hover:text-white border border-[#2D2D2D] transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 shrink-0" />
            </button>
          )}

          {/* Account / Guest Menu */}
          <HeaderAccountMenu
            onOpenAuthModal={onOpenAuthModal || (() => {})}
            onOpenAccountView={onOpenAccountView || (() => {})}
            onOpenUpgradeModal={onOpenUpgradeModal || (() => {})}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: COMPACT DAW PROJECT STATUS BAR (Full width flex/wrap layout)        */}
      {/* ========================================================================= */}
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="w-full flex flex-wrap md:flex-nowrap items-center justify-between min-h-[36px] sm:min-h-[38px] px-2 sm:px-3 md:px-4 py-1 md:py-0 bg-[#141414] border-t border-[#202020] min-w-0 max-w-full text-xs font-mono text-[#E0E0E0] select-none overflow-x-auto no-scrollbar gap-2 sm:gap-3"
      >
        {/* Left Block: Project Menu & Save State */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ProjectMenu
            project={project}
            onProjectChange={onProjectChange}
            onSave={handleSave}
            onLoad={handleLoad}
            saveStatus={saveStatus}
          />

          {saveStatus && (
            <span className="text-[10px] text-[#90FF00] bg-[#162516] border border-[#234523] px-2 py-0.5 rounded font-bold animate-pulse shrink-0">
              {saveStatus}
            </span>
          )}
        </div>

        {/* Center Block: Musical Parameters */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 text-[10px] sm:text-[11px]">
          {/* Genre Badge */}
          <div className="hidden sm:flex items-center gap-1 bg-[#1A1A1A] border border-[#282828] px-2 py-0.5 rounded shrink-0">
            <span className="text-gray-400 font-bold">{t('header.genre')}</span>
            <span className="text-[#FFB703] font-bold truncate max-w-[90px]" dir="ltr">
              {project.genre || 'Psytrance'}
            </span>
          </div>

          {/* Key & Scale Badge */}
          <div className="flex items-center gap-1 bg-[#1A1A1A] border border-[#282828] px-2 py-0.5 rounded shrink-0">
            <span className="text-gray-400 font-bold">{t('header.key')}</span>
            <span className="text-[#00E5FF] font-bold font-mono" dir="ltr">
              {project.key || 'F#'} {project.scale || 'Minor'}
            </span>
          </div>

          {/* BPM Tempo Badge */}
          <div className="flex items-center gap-1 bg-[#1A1A1A] border border-[#282828] px-2 py-0.5 rounded shrink-0">
            <span className="text-gray-400 font-bold">{t('header.bpm')}</span>
            <span className="text-[#90FF00] font-bold font-mono" dir="ltr">
              {project.bpm || 142}
            </span>
          </div>

          {/* Time Signature / Grid */}
          <div className="hidden xl:flex items-center gap-1 bg-[#1A1A1A] border border-[#282828] px-2 py-0.5 rounded text-gray-400 shrink-0">
            <span className="text-gray-500 font-bold">GRID:</span>
            <span className="text-gray-300 font-bold font-mono" dir="ltr">
              4/4 • 1/16
            </span>
          </div>
        </div>

        {/* Right Block: Engine Diagnostic Pill & Ableton Link Status */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 text-[10px] sm:text-[11px]">
          {/* AI Diagnostic Trigger */}
          <button
            onClick={() => {
              if (onOpenSetup) onOpenSetup();
              else if (onOpenSettings) onOpenSettings();
            }}
            title={t('header.aiStatusTooltip')}
            className="flex items-center gap-1 bg-[#1A1A1A] hover:bg-[#252525] border border-[#282828] px-2 py-0.5 rounded transition cursor-pointer shrink-0"
          >
            <span className="text-gray-400 font-bold">{t('header.ai')}:</span>
            <span className="font-bold flex items-center gap-1">
              <span className="hidden xs:inline">{providerDisplayName}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isAiConnected ? 'bg-[#90FF00]' : 'bg-[#FF5555]'
                }`}
              />
              <span className={isAiConnected ? 'text-[#90FF00]' : 'text-[#FF5555]'}>
                {isAiConnected ? t('header.connected') : t('header.disconnected')}
              </span>
            </span>
          </button>

          {/* Ableton Live 12 DAW Status */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#1A1A1A] border border-[#282828] px-2 py-0.5 rounded text-gray-300 shrink-0">
            <span className="text-gray-400 font-bold">{t('header.abletonStatus')}:</span>
            <span className="font-bold text-[#90FF00] font-mono" dir="ltr">
              Live 12 Link
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


