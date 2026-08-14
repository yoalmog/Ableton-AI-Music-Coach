import React, { useState, useEffect } from 'react';
import { projectService } from '../../services/projectService';
import { audioService } from '../../services/audioService';
import { aiService } from '../../services/aiService';
import { useLanguage } from '../../context/LanguageContext';
import { AAMCProject } from '../../types';
import { HeaderBrand } from './header/HeaderBrand';
import { HeaderActions } from './header/HeaderActions';
import { ProjectStatusBar } from './header/ProjectStatusBar';

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
  const [vol, setVol] = useState(80);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const { isRTL, t } = useLanguage();

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

  return (
    <header
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-[#0A0A0A] border-b border-[#262626] text-[#E0E0E0] select-none z-30 font-sans shrink-0 w-full max-w-full flex flex-col shadow-2xl"
    >
      {/* ROW 1: BRAND IDENTITY & PRIMARY CONTROLS (~56px) */}
      <div className="h-[56px] px-3 md:px-4 bg-[#111111] flex items-center justify-between gap-2 border-b border-[#222222] min-w-0">
        {/* Brand Section */}
        <HeaderBrand
          onNavigate={onNavigate}
          onToggleMobileMenu={onToggleMobileMenu}
        />

        {/* Action Controls Section */}
        <HeaderActions
          onOpenSearch={onOpenSearch}
          onOpenCoach={onOpenCoach}
          onOpenCoachWithMessage={onOpenCoachWithMessage}
          onOpenSettings={onOpenSettings}
          onOpenSetup={onOpenSetup}
          onOpenAuthModal={onOpenAuthModal}
          onOpenAccountView={onOpenAccountView}
          onOpenUpgradeModal={onOpenUpgradeModal}
          status={aiStatus}
          project={project}
          volume={vol}
          onVolumeChange={handleVolumeChange}
        />
      </div>

      {/* ROW 2: WORKSPACE PROJECT BAR (~42px) */}
      <ProjectStatusBar
        project={project}
        onProjectChange={onProjectChange}
        onSave={handleSave}
        onLoad={handleLoad}
        saveStatus={saveStatus}
        status={aiStatus}
        onOpenSetup={onOpenSetup}
        onOpenSettings={onOpenSettings}
      />
    </header>
  );
};
