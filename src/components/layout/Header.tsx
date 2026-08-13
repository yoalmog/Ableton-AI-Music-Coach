import React from 'react';
import {
  Save,
  FolderOpen,
  Globe,
  Volume2,
  Sparkles,
  Search,
  Menu,
  Settings,
  Music2,
  ChevronRight,
  ShieldCheck,
  Zap,
  Sliders,
  Layers,
  Activity
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { audioService } from '../../services/audioService';
import { classroomService } from '../../services/classroomService';
import { useLanguage } from '../../context/LanguageContext';
import { AAMCProject } from '../../types';
import { VoiceControlWidget } from '../chat/VoiceControlWidget';
import { Tooltip } from '../common/Tooltip';
import { AIStatusBadge } from '../ai/AIStatusBadge';
import { HeaderAccountMenu } from './HeaderAccountMenu';
import { getAssetPath } from '../../utils/assetPath';

// Resilient Logo Mark component with image fallback and vector icon backup
const BrandSymbolMark: React.FC<{ sizeClass?: string }> = ({ sizeClass = "w-7 h-7" }) => {
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
  isDesktop: boolean;
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
  isDesktop,
}) => {
  const [vol, setVol] = React.useState(80);
  const [saveStatus, setSaveStatus] = React.useState<string | null>(null);
  const { language, setLanguage, t, isRTL, currentLanguageConfig } = useLanguage();

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

  // Generate breadcrumb strings based on active view and classroom progress
  const getBreadcrumbs = () => {
    const homeLabel = t('nav.home') || (language === 'he' ? 'בית' : 'Home');
    if (currentView === 'classroom') {
      const course = classroomService.getCurrentCourse();
      const lesson = classroomService.getCurrentLesson();
      return [
        { label: homeLabel, view: 'dashboard' },
        { label: t('nav.classroom'), view: 'classroom' },
        { label: language === 'he' ? course.titleHe : course.title, view: 'classroom' },
        { label: lesson ? (language === 'he' ? lesson.titleHe : lesson.title) : (language === 'he' ? 'שיעור' : 'Lesson') }
      ];
    }
    if (currentView === 'producer') {
      return [
        { label: homeLabel, view: 'dashboard' },
        { label: t('nav.producer'), view: 'producer' },
        { label: language === 'he' ? 'זרימת עבודה מודרכת' : 'Guided Workflow' }
      ];
    }
    if (currentView === 'midi') {
      return [
        { label: homeLabel, view: 'dashboard' },
        { label: language === 'he' ? 'מחוללי AI' : 'AI Generators' },
        { label: t('nav.midi'), view: 'midi' }
      ];
    }
    if (currentView === 'analyzer') {
      return [
        { label: homeLabel, view: 'dashboard' },
        { label: language === 'he' ? 'סאונד ומיקס' : 'Sound & Mixing' },
        { label: t('nav.analyzer'), view: 'analyzer' }
      ];
    }
    if (currentView === 'sounddesign') {
      return [
        { label: homeLabel, view: 'dashboard' },
        { label: language === 'he' ? 'סאונד ומיקס' : 'Sound & Mixing' },
        { label: t('nav.sounddesign'), view: 'sounddesign' }
      ];
    }
    if (currentView === 'lessons') {
      return [
        { label: homeLabel, view: 'dashboard' },
        { label: language === 'he' ? 'תוכנית לימודים' : 'Curriculum' },
        { label: t('nav.lessons'), view: 'lessons' }
      ];
    }
    if (currentView === 'settings') {
      return [
        { label: homeLabel, view: 'dashboard' },
        { label: language === 'he' ? 'מערכת' : 'System' },
        { label: t('nav.settings'), view: 'settings' }
      ];
    }
    if (currentView === 'account') {
      return [
        { label: homeLabel, view: 'dashboard' },
        { label: language === 'he' ? 'מערכת' : 'System' },
        { label: language === 'he' ? 'חשבון ומנוי' : 'Account & Subscription' }
      ];
    }

    return [
      { label: homeLabel, view: 'dashboard' },
      { label: language === 'he' ? 'קונסולת אולפן' : 'Studio Console' },
      { label: t('nav.dashboard'), view: 'dashboard' }
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-[#121212] border-b border-[#262626] text-[#E0E0E0] select-none z-30 font-sans shrink-0 w-full max-w-full flex flex-col shadow-2xl"
    >
      {/* ROW 1: BRAND, PROJECT CONTEXT & ACTION CONTROLS (~48-52px) */}
      <div className="h-12 px-3 md:px-4 flex items-center justify-between gap-2 md:gap-4 border-b border-[#222222] min-w-0">
        
        {/* BRAND ZONE (Left in LTR / Right in RTL) */}
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
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <BrandSymbolMark sizeClass="w-7 h-7" />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs md:text-sm font-bold text-white tracking-tight group-hover:text-[#90FF00] transition-colors">
                Ableton AI Music Coach
              </span>
              <span className="text-[10px] text-[#888] font-mono">
                {t('header.brandSubtitle')}
              </span>
            </div>
          </div>
        </div>

        {/* CENTER ZONE: PROJECT NAME & MUSIC CONTEXT CARDS */}
        <div className="hidden lg:flex items-center gap-3 shrink min-w-0 mx-2">
          {/* Active Project Card */}
          <div className="bg-[#1A1A1A] border border-[#2D2D2D] px-3 py-1 rounded-lg flex items-center gap-2 max-w-[220px] shrink min-w-0">
            <div className="flex flex-col min-w-0 leading-none">
              <span className="text-[9px] font-mono font-bold text-[#777] uppercase tracking-wider block mb-0.5">
                {t('header.project')}
              </span>
              <Tooltip content={project.name || t('header.untitledProject')} position="bottom" delayMs={300}>
                <span className="text-xs font-bold text-white truncate max-w-[140px] block font-mono">
                  {project.name || t('header.untitledProject')}
                </span>
              </Tooltip>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-[#90FF00] animate-pulse shrink-0" />
          </div>

          {/* Music Parameter Cards: KEY, BPM, GENRE */}
          <div className="flex items-center gap-1.5 font-mono text-[11px] shrink-0">
            <div className="bg-[#181818] border border-[#2B2B2B] px-2 py-1 rounded flex items-center gap-1 text-[#E0E0E0]">
              <span className="text-[#888] text-[9px] font-bold">{t('header.key')}</span>
              <span className="text-[#00E5FF] font-bold" dir="ltr">{project.key || 'F#'}</span>
            </div>

            <div className="bg-[#181818] border border-[#2B2B2B] px-2 py-1 rounded flex items-center gap-1 text-[#E0E0E0]">
              <span className="text-[#888] text-[9px] font-bold">{t('header.bpm')}</span>
              <span className="text-[#90FF00] font-bold" dir="ltr">{project.bpm || 142} BPM</span>
            </div>

            <div className="bg-[#181818] border border-[#2B2B2B] px-2 py-1 rounded flex items-center gap-1 text-[#E0E0E0]">
              <span className="text-[#888] text-[9px] font-bold">{t('header.genre')}</span>
              <span className="text-[#FFB703] font-bold truncate max-w-[80px]" dir="ltr">{project.genre || 'Psytrance'}</span>
            </div>
          </div>
        </div>

        {/* ACTIONS ZONE (Right in LTR / Left in RTL) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* AI Status Badge */}
          <AIStatusBadge onOpenSettings={onOpenSettings || (() => {})} onOpenSetup={onOpenSetup} />

          {/* AI Coach Primary Trigger */}
          <Tooltip content={t('header.openCoach')} position="bottom" delayMs={400}>
            <button
              onClick={onOpenCoach}
              aria-label={t('header.openCoach')}
              className="flex items-center gap-1.5 bg-[#90FF00] hover:bg-[#80e600] text-black px-3 py-1.5 rounded-md text-[11px] font-extrabold tracking-wider uppercase transition-all shadow-md shadow-[#90FF00]/10 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-black animate-ping" />
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">{t('header.openCoachBtn')}</span>
            </button>
          </Tooltip>

          {/* Voice AI Control */}
          <VoiceControlWidget onSendMessage={onOpenCoachWithMessage} />

          {/* Save / Open Project Actions */}
          <div className="hidden sm:flex items-center gap-1.5 border-s border-e border-[#262626] px-2">
            <Tooltip content={t('header.saveProject')} position="bottom" delayMs={400}>
              <button
                onClick={handleSave}
                aria-label={t('header.saveProject')}
                className="flex items-center gap-1 text-[11px] font-bold bg-[#1C1C1C] hover:bg-[#282828] text-[#E0E0E0] px-2.5 py-1 rounded border border-[#333] transition-colors cursor-pointer uppercase"
              >
                <Save className="w-3 h-3 text-[#90FF00]" />
                <span className="hidden md:inline">{t('header.save')}</span>
              </button>
            </Tooltip>

            <Tooltip content={t('header.openProject')} position="bottom" delayMs={400}>
              <button
                onClick={handleLoad}
                aria-label={t('header.openProject')}
                className="flex items-center gap-1 text-[11px] font-bold bg-[#1C1C1C] hover:bg-[#282828] text-[#E0E0E0] px-2.5 py-1 rounded border border-[#333] transition-colors cursor-pointer uppercase"
              >
                <FolderOpen className="w-3 h-3 text-[#00E5FF]" />
                <span className="hidden md:inline">{t('header.open')}</span>
              </button>
            </Tooltip>
          </div>

          {/* Save Status Banner */}
          {saveStatus && (
            <span className="text-[10px] font-mono text-[#90FF00] bg-[#121212] px-2 py-0.5 rounded border border-[#333] animate-pulse hidden sm:inline">
              {saveStatus}
            </span>
          )}

          {/* Search Trigger */}
          <Tooltip content={t('header.searchTooltip')} position="bottom" delayMs={400}>
            <button
              onClick={onOpenSearch}
              aria-label={t('header.search')}
              className="p-1.5 rounded bg-[#1C1C1C] hover:bg-[#282828] text-gray-300 border border-[#333] transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          {/* Compact Language Selector */}
          <Tooltip content={`${t('header.language')}: ${currentLanguageConfig.nativeName}`} position="bottom" delayMs={400}>
            <button
              onClick={() => {
                const nextLang = language === 'en' ? 'he' : language === 'he' ? 'es' : 'en';
                setLanguage(nextLang);
              }}
              aria-label={t('header.language')}
              className="flex items-center gap-1 text-[11px] font-bold bg-[#1C1C1C] hover:bg-[#282828] text-[#E0E0E0] px-2 py-1 rounded border border-[#333] transition-colors cursor-pointer"
            >
              <Globe className="w-3 h-3 text-[#00E5FF]" />
              <span className="font-mono text-[10px]">{currentLanguageConfig.nativeName}</span>
            </button>
          </Tooltip>

          {/* Account Menu */}
          <HeaderAccountMenu
            onOpenAuthModal={onOpenAuthModal || (() => {})}
            onOpenAccountView={onOpenAccountView || (() => {})}
            onOpenUpgradeModal={onOpenUpgradeModal || (() => {})}
          />

          {/* Master Volume Slider */}
          <Tooltip content={`${t('header.volume')} (${vol}%)`} position="bottom" delayMs={400}>
            <div className="hidden xl:flex items-center gap-1.5 bg-[#181818] border border-[#2B2B2B] px-2 py-1 rounded">
              <Volume2 className="w-3 h-3 text-[#888]" />
              <input
                type="range"
                min="0"
                max="100"
                value={vol}
                onChange={handleVolumeChange}
                aria-label={t('header.volume')}
                className="w-14 accent-[#90FF00] cursor-pointer"
              />
              <span className="text-[9px] font-mono text-[#888] w-6" dir="ltr">{vol}%</span>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* ROW 2: WORKSPACE CONTEXT BREADCRUMBS & LEARNING LEVEL (~36px) */}
      <div className="h-8 px-3 md:px-4 bg-[#161616] flex items-center justify-between text-xs overflow-x-auto no-scrollbar">
        {/* Left: Breadcrumbs Trail */}
        <div className="flex items-center gap-1.5 text-gray-400 font-medium whitespace-nowrap min-w-0">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <ChevronRight className={`w-3.5 h-3.5 text-gray-600 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
              )}
              {crumb.view && onNavigate ? (
                <button
                  onClick={() => onNavigate(crumb.view)}
                  className="hover:text-[#90FF00] transition-colors font-medium text-gray-300 hover:underline cursor-pointer"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className={idx === breadcrumbs.length - 1 ? 'text-white font-bold' : 'text-gray-400'}>
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Right: Learning Level Badge Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <Tooltip content={t('header.learningLevelTooltip')} position="bottom" delayMs={300}>
            <button
              onClick={onOpenSetup}
              aria-label={t('header.learningLevelTooltip')}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#202020] hover:bg-[#2A2A2A] border border-[#333] text-[10px] font-mono font-bold text-amber-400 transition cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>
                {t(`header.${(project.difficulty || 'Beginner').toLowerCase()}Level`) ||
                 (language === 'he' ? 'רמת מתחיל' : 'Beginner Level')}
              </span>
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};
