import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { AIProducerModeView } from './components/producer/AIProducerModeView';
import { LessonsView } from './components/lessons/LessonsView';
import { MusicTheoryView } from './components/theory/MusicTheoryView';
import { EarTrainingView } from './components/theory/EarTrainingView';
import { PracticeModeView } from './components/practice/PracticeModeView';
import { MidiGeneratorView } from './components/midi/MidiGeneratorView';
import { DrumMachineView } from './components/sequencer/DrumMachineView';
import { BassGeneratorView } from './components/bass/BassGeneratorView';
import { SoundDesignLabView } from './components/sounddesign/SoundDesignLabView';
import { TrackAnalyzerView } from './components/analyzer/TrackAnalyzerView';
import { ReferenceAnalyzerView } from './components/analyzer/ReferenceAnalyzerView';
import { MixAssistantView } from './components/analyzer/MixAssistantView';
import { ArrangementGuideView } from './components/arrangement/ArrangementGuideView';
import { PromptLibraryView } from './components/utilities/PromptLibraryView';
import { ProjectVersionManager } from './components/project/ProjectVersionManager';
import { SettingsView } from './components/settings/SettingsView';
import { AICoachChat } from './components/chat/AICoachChat';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { FirstRunAISetup } from './components/ai/FirstRunAISetup';
import { ProducerOnboardingModal } from './components/common/ProducerOnboardingModal';
import { VisualCourseMap } from './components/lessons/VisualCourseMap';
import { GlossaryView } from './components/utilities/GlossaryView';
import { BuildMyFirstTrackWizard } from './components/producer/BuildMyFirstTrackWizard';
import { projectService } from './services/projectService';
import { desktopService } from './services/desktopService';
import { aiService } from './services/aiService';
import { AAMCProject, ViewType } from './types';
import { useLanguage } from './context/LanguageContext';
import { getInitialTheme, applyTheme, ThemeMode } from './utils/themeSync';

export function AppContent() {
  const { dir } = useLanguage();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [project, setProject] = useState<AAMCProject>(() =>
    projectService.createNewProject('My Psytrance Track', 'Psytrance', 142, 'F#', 'Minor')
  );
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [coachInitialMsg, setCoachInitialMsg] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    setIsDesktop(desktopService.isDesktop());
    if (window.desktopAPI?.appReady) {
      window.desktopAPI.appReady();
    }

    // Check if First Run Producer Onboarding should pop up
    const hasSeenOnboarding = localStorage.getItem('aamc-seen-producer-onboarding');
    if (!hasSeenOnboarding) {
      setIsOnboardingOpen(true);
      localStorage.setItem('aamc-seen-producer-onboarding', 'true');
    }

    // Check if First Run AI modal should pop up
    const hasSeenSetup = localStorage.getItem('aamc-seen-ai-setup');
    if (!hasSeenSetup) {
      aiService.testLocalConnection().then((health) => {
        if (!health.ok) {
          setIsSetupOpen(true);
        }
        localStorage.setItem('aamc-seen-ai-setup', 'true');
      });
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Keyboard shortcut Ctrl+K / Cmd+K for search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenCoachWithMessage = (msg: string) => {
    setCoachInitialMsg(msg);
    setIsCoachOpen(true);
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            project={project}
            onProjectChange={setProject}
            onNavigate={(v) => setCurrentView(v)}
            isDesktop={isDesktop}
          />
        );
      case 'producer':
        return (
          <AIProducerModeView
            project={project}
            onProjectChange={setProject}
            onNavigate={(v) => setCurrentView(v)}
            onOpenCoachWithMessage={handleOpenCoachWithMessage}
          />
        );
      case 'lessons':
        return <LessonsView onOpenCoach={() => setIsCoachOpen(true)} />;
      case 'coursemap':
        return <VisualCourseMap onSelectModule={() => setCurrentView('lessons')} />;
      case 'buildtrack':
        return <BuildMyFirstTrackWizard />;
      case 'glossary':
        return <GlossaryView />;
      case 'theory':
        return <MusicTheoryView onOpenCoachWithMessage={handleOpenCoachWithMessage} />;
      case 'eartraining':
        return <EarTrainingView />;
      case 'practice':
        return <PracticeModeView project={project} onOpenCoach={() => setIsCoachOpen(true)} />;
      case 'midi':
        return (
          <ErrorBoundary isPanel={true}>
            <MidiGeneratorView project={project} onProjectChange={setProject} />
          </ErrorBoundary>
        );
      case 'drums':
        return <DrumMachineView project={project} onProjectChange={setProject} />;
      case 'bass':
        return (
          <ErrorBoundary isPanel={true}>
            <BassGeneratorView project={project} onProjectChange={setProject} />
          </ErrorBoundary>
        );
      case 'sounddesign':
        return <SoundDesignLabView />;
      case 'analyzer':
        return (
          <ErrorBoundary isPanel={true}>
            <ReferenceAnalyzerView project={project} onOpenCoachWithMessage={handleOpenCoachWithMessage} />
          </ErrorBoundary>
        );
      case 'mixassistant':
        return (
          <ErrorBoundary isPanel={true}>
            <MixAssistantView project={project} onOpenCoachWithMessage={handleOpenCoachWithMessage} />
          </ErrorBoundary>
        );
      case 'arrangement':
        return <ArrangementGuideView project={project} />;
      case 'prompts':
        return <PromptLibraryView onOpenCoachWithMessage={handleOpenCoachWithMessage} />;
      case 'versions':
        return <ProjectVersionManager project={project} onProjectChange={setProject} />;
      case 'settings':
        return (
          <SettingsView
            project={project}
            onProjectChange={setProject}
            isDesktop={isDesktop}
            theme={theme}
            onThemeChange={setTheme}
          />
        );
      default:
        return (
          <DashboardView
            project={project}
            onProjectChange={setProject}
            onNavigate={(v) => setCurrentView(v)}
            isDesktop={isDesktop}
          />
        );
    }
  };

  return (
    <div
      dir={dir}
      className="h-screen w-screen overflow-hidden bg-[#0A0A0A] text-[#E0E0E0] flex flex-col font-sans antialiased selection:bg-[#90FF00] selection:text-black"
    >
      {/* Top Header */}
      <Header
        project={project}
        onProjectChange={setProject}
        onOpenCoach={() => {
          setCoachInitialMsg(undefined);
          setIsCoachOpen(true);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCoachWithMessage={handleOpenCoachWithMessage}
        onOpenSettings={() => setCurrentView('settings')}
        onOpenSetup={() => setIsSetupOpen(true)}
        isDesktop={isDesktop}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          onOpenCoach={() => {
            setCoachInitialMsg(undefined);
            setIsCoachOpen(true);
          }}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 overflow-y-auto bg-[#121212]">{renderActiveView()}</main>

        {/* AI Co-Producer Assistant Drawer */}
        <ErrorBoundary isPanel={true}>
          <AICoachChat
            project={project}
            isOpen={isCoachOpen}
            onClose={() => setIsCoachOpen(false)}
            initialMessage={coachInitialMsg}
          />
        </ErrorBoundary>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(v) => setCurrentView(v)}
        onOpenCoachWithMessage={handleOpenCoachWithMessage}
      />

      {/* First Run Local AI Setup Modal */}
      <FirstRunAISetup
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onSelectCloud={() => {
          setCurrentView('settings');
        }}
      />

      {/* Producer Experience Setup Modal */}
      <ProducerOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaveProfile={() => {}}
      />

      {/* Studio Status Footer */}
      <footer className="h-6 bg-[#1A1A1A] border-t border-[#333] px-4 flex items-center justify-between text-[10px] text-[#666] font-mono select-none z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E5A500]" />
            <span className="text-[#999]">ABLETON: MANUAL MODE</span>
          </div>
          <span className="hidden sm:inline">OFFLINE PLAYBACK</span>
          <span className="hidden md:inline">44.1 kHz / 24-BIT</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">GENRE: {project.genre.toUpperCase()}</span>
          <span className="text-[#00E5FF]">AI: LOCAL FIRST</span>
        </div>
      </footer>
    </div>
  );
}

export function AppContentWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <AppContent />;
}

export default function App() {
  return <AppContentWrapper />;
}
