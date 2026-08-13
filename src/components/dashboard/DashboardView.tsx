import React from 'react';
import {
  Zap,
  Activity,
  Music,
  Radio,
  Play,
  ArrowRight,
  Monitor,
  FolderPlus,
  Sliders,
  Award,
  Sparkles,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { AAMCProject, GenreType } from '../../types';
import { projectService } from '../../services/projectService';
import { COURSES_DATA } from '../../data/coursesData';
import { useLanguage } from '../../context/LanguageContext';
import { getAssetPath } from '../../utils/assetPath';
import { DashboardMetricsCard } from './DashboardMetricsCard';
import { ProjectMetricsWidget } from './ProjectMetricsWidget';

interface DashboardViewProps {
  project: AAMCProject;
  onProjectChange: (p: AAMCProject) => void;
  onNavigate: (view: any) => void;
  isDesktop: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  onProjectChange,
  onNavigate,
  isDesktop,
}) => {
  const { t, isRtl } = useLanguage();

  const genres: { name: GenreType; bpm: number; subKey: string }[] = [
    { name: 'Psytrance', bpm: 142, subKey: 'genre.psy.sub' },
    { name: 'Goa Psytrance', bpm: 144, subKey: 'genre.goa.sub' },
    { name: 'Progressive Psytrance', bpm: 138, subKey: 'genre.prog.sub' },
    { name: 'Techno', bpm: 132, subKey: 'genre.techno.sub' },
    { name: 'Melodic Techno', bpm: 126, subKey: 'genre.melodic.sub' },
  ];

  const handleSelectGenre = (gName: GenreType, bpm: number) => {
    const updated = {
      ...project,
      genre: gName,
      bpm,
    };
    onProjectChange(updated);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto text-[#E0E0E0] font-sans overflow-x-hidden min-w-0" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#1A1A1A] border border-[#333] p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-xl">
        <div className="relative z-10 w-full md:max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#252525] text-[#90FF00] border border-[#333] rounded text-[10px] font-bold font-mono uppercase tracking-wider">
              {t('dashboard.console')}
            </span>
            {isDesktop ? (
              <span className="text-[10px] bg-[#121212] text-[#90FF00] border border-[#333] px-2 py-0.5 rounded font-mono">
                {t('dashboard.desktop')}
              </span>
            ) : (
              <span className="text-[10px] bg-[#121212] text-[#999] border border-[#333] px-2 py-0.5 rounded font-mono">
                {t('dashboard.web')}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
            {t('dashboard.welcome')} <span className="font-bold text-[#90FF00]">Ableton AI Music Coach</span>
          </h1>

          <p className="text-[#BBB] text-xs leading-relaxed max-w-2xl">
            {t('dashboard.subtitle')}
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('lessons')}
              className="bg-[#90FF00] hover:bg-[#80e600] text-black px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-wider shadow-md shadow-[#90FF00]/10"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{t('dashboard.resume')}</span>
            </button>
            <button
              onClick={() => onNavigate('midi')}
              className="bg-[#252525] hover:bg-[#333] text-[#E0E0E0] border border-[#444] px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-wider"
            >
              <Music className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>{t('dashboard.generate')}</span>
            </button>
          </div>
        </div>

        {/* Official Logo Banner Image */}
        <div className="shrink-0 w-48 md:w-64 flex justify-center z-10">
          <img
            src={getAssetPath('branding/logo.png')}
            alt="Ableton AI Music Coach Official Logo"
            className="max-h-28 object-contain filter drop-shadow-lg"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallback) {
                target.dataset.fallback = 'true';
                target.src = getAssetPath('branding/logo.svg');
              }
            }}
          />
        </div>
      </div>

      {/* CSS Grid Layout for Core Dashboard Widgets & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Continue Learning Card with responsive column spans */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 bg-[#1A1A1A] border border-[#333] rounded-xl p-5 space-y-4 flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-widest font-bold">
                Continue Learning
              </span>
              <span className="text-[10px] font-mono bg-[#121212] text-[#90FF00] px-2 py-0.5 rounded border border-[#333]">
                Module 1 of 16
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Psytrance Production Masterclass</h3>
              <p className="text-xs text-[#AAA]">Lesson 1: Psytrance BPM, Keys & Scale Foundations</p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-mono text-[#888]">
                <span>Course Progress</span>
                <span className="text-[#90FF00]">35%</span>
              </div>
              <div className="w-full bg-[#121212] h-2 rounded-full overflow-hidden border border-[#333]">
                <div className="bg-[#90FF00] h-full rounded-full" style={{ width: '35%' }} />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('lessons')}
            className="w-full bg-[#252525] hover:bg-[#333] text-[#90FF00] border border-[#333] py-2.5 rounded text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors uppercase tracking-wider"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Resume Masterclass Lesson</span>
          </button>
        </div>

        {/* 2. Daily Mission Widget with responsive column spans */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 bg-[#1A1A1A] border border-[#333] rounded-xl p-5 space-y-4 flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#a855f7] uppercase tracking-widest font-bold">
                Daily Mission
              </span>
              <span className="text-[10px] font-mono bg-[#121212] text-[#a855f7] px-2 py-0.5 rounded border border-[#333]">
                +150 XP Reward
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Rolling Bassline & Kick Alignment</h3>
              <p className="text-xs text-[#AAA]">
                Create a 4-bar rolling Psytrance bassline at 142 BPM with sidechain compression ducking.
              </p>
            </div>

            <div className="bg-[#121212] border border-[#2A2A2A] p-3 rounded text-xs text-[#888] space-y-1">
              <div className="flex items-center gap-2 text-[#E0E0E0]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#90FF00]" />
                <span>Check root key: F#1 (46.2 Hz)</span>
              </div>
              <div className="flex items-center gap-2 text-[#E0E0E0]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#90FF00]" />
                <span>Test 16th-note offbeat trigger</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('bass')}
            className="w-full bg-[#252525] hover:bg-[#333] text-[#00E5FF] border border-[#333] py-2.5 rounded text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Daily Mission</span>
          </button>
        </div>

        {/* 3. Project Metrics Widget Component */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <ProjectMetricsWidget project={project} onNavigate={onNavigate} />
        </div>

      </div>

      {/* Active Project & Genre Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Project Card */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-4 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#666] uppercase tracking-widest">
                {t('dashboard.activeSession')}
              </span>
              <span className="text-[10px] font-mono text-[#90FF00] bg-[#121212] border border-[#333] px-2 py-0.5 rounded">
                {t('dashboard.format')}
              </span>
            </div>

            <h2 className="text-lg font-bold text-white mt-2">{project.name}</h2>
            <p className="text-xs text-[#888] mt-0.5">
              {t('dashboard.genreFocus')}: <span className="text-[#E0E0E0] font-semibold">{project.genre}</span>
            </p>

            <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-[#2A2A2A]">
              <div className="bg-[#121212] p-2.5 rounded border border-[#2A2A2A]">
                <div className="text-[9px] text-[#666] uppercase font-mono">{t('dashboard.bpmTempo')}</div>
                <div className="text-base font-mono font-bold text-[#90FF00]">{project.bpm}.00</div>
              </div>
              <div className="bg-[#121212] p-2.5 rounded border border-[#2A2A2A]">
                <div className="text-[9px] text-[#666] uppercase font-mono">{t('dashboard.keyScale')}</div>
                <div className="text-base font-mono font-bold text-[#00E5FF]">{project.key} {project.scale}</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#2A2A2A] space-y-2">
            <button
              onClick={() => onNavigate('bass')}
              className="w-full bg-[#252525] hover:bg-[#333] text-[#E0E0E0] border border-[#333] py-2 rounded text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-[#90FF00]" />
              <span>{t('dashboard.configBass')}</span>
            </button>
            <button
              onClick={() => onNavigate('drums')}
              className="w-full bg-[#252525] hover:bg-[#333] text-[#E0E0E0] border border-[#333] py-2 rounded text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>{t('dashboard.openDrums')}</span>
            </button>
          </div>
        </div>

        {/* Genre Switcher */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t('dashboard.selectGenre')}</h3>
              <p className="text-xs text-[#888]">{t('dashboard.selectGenreSub')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {genres.map((g) => {
              const isSelected = project.genre === g.name;
              return (
                <button
                  key={g.name}
                  onClick={() => handleSelectGenre(g.name, g.bpm)}
                  className={`p-3.5 rounded-lg text-left border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#252525] border-[#90FF00]'
                      : 'bg-[#121212] border-[#2A2A2A] hover:border-[#444] hover:bg-[#181818]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xs ${isSelected ? 'text-[#90FF00]' : 'text-[#E0E0E0]'}`}>
                      {g.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101010] border border-[#333] text-[#90FF00]">
                      {g.bpm} BPM
                    </span>
                  </div>
                  <p className="text-[11px] text-[#888] mt-1">{t(g.subKey)}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Launch Features Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#666] uppercase tracking-widest">
          {t('dashboard.modules')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('lessons')}
            className="bg-[#1A1A1A] hover:bg-[#222] border border-[#333] p-4 rounded-lg transition-colors cursor-pointer group shadow-sm"
          >
            <div className="w-8 h-8 rounded bg-[#252525] text-[#90FF00] border border-[#333] flex items-center justify-center mb-2.5">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-white group-hover:text-[#90FF00] transition-colors">{t('dashboard.masterclass')}</h4>
            <p className="text-[11px] text-[#888] mt-1 leading-snug">{t('dashboard.masterclassSub')}</p>
          </div>

          <div
            onClick={() => onNavigate('midi')}
            className="bg-[#1A1A1A] hover:bg-[#222] border border-[#333] p-4 rounded-lg transition-colors cursor-pointer group shadow-sm"
          >
            <div className="w-8 h-8 rounded bg-[#252525] text-[#00E5FF] border border-[#333] flex items-center justify-center mb-2.5">
              <Music className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-white group-hover:text-[#00E5FF] transition-colors">{t('dashboard.midi')}</h4>
            <p className="text-[11px] text-[#888] mt-1 leading-snug">{t('dashboard.midiSub')}</p>
          </div>

          <div
            onClick={() => onNavigate('sounddesign')}
            className="bg-[#1A1A1A] hover:bg-[#222] border border-[#333] p-4 rounded-lg transition-colors cursor-pointer group shadow-sm"
          >
            <div className="w-8 h-8 rounded bg-[#252525] text-[#a855f7] border border-[#333] flex items-center justify-center mb-2.5">
              <Sliders className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-white group-hover:text-[#a855f7] transition-colors">{t('dashboard.sound')}</h4>
            <p className="text-[11px] text-[#888] mt-1 leading-snug">{t('dashboard.soundSub')}</p>
          </div>

          <div
            onClick={() => onNavigate('analyzer')}
            className="bg-[#1A1A1A] hover:bg-[#222] border border-[#333] p-4 rounded-lg transition-colors cursor-pointer group shadow-sm"
          >
            <div className="w-8 h-8 rounded bg-[#252525] text-[#00E5FF] border border-[#333] flex items-center justify-center mb-2.5">
              <Activity className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-white group-hover:text-[#00E5FF] transition-colors">{t('dashboard.analyzer')}</h4>
            <p className="text-[11px] text-[#888] mt-1 leading-snug">{t('dashboard.analyzerSub')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
