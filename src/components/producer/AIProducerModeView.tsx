import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Play,
  ArrowRight,
  Info,
  AlertTriangle,
  Headphones,
  Sliders,
  Layers,
  ChevronRight,
  RotateCcw,
  PlusCircle,
  Award
} from 'lucide-react';
import { PRODUCER_STAGES } from '../../data/producerStagesData';
import { AAMCProject, GenreType, KeyType, ScaleType, ViewType } from '../../types';
import { projectService } from '../../services/projectService';
import { useLanguage } from '../../context/LanguageContext';

interface AIProducerModeViewProps {
  project: AAMCProject;
  onProjectChange: (project: AAMCProject) => void;
  onNavigate: (view: ViewType) => void;
  onOpenCoachWithMessage: (msg: string) => void;
}

export const AIProducerModeView: React.FC<AIProducerModeViewProps> = ({
  project,
  onProjectChange,
  onNavigate,
  onOpenCoachWithMessage,
}) => {
  const { t, language } = useLanguage();
  const isHe = language === 'he';
  const translate = React.useCallback((key: string) => (t ? t(key) : key), [t]);
  const [activeStageId, setActiveStageId] = useState<number>(project.productionStage || 1);
  const [showWizard, setShowWizard] = useState(false);

  // Wizard state
  const [wizGenre, setWizGenre] = useState<GenreType>(project.genre || 'Psytrance');
  const [wizSubgenre, setWizSubgenre] = useState(project.subgenre || 'Full-On Psytrance');
  const [wizBpm, setWizBpm] = useState(project.bpm || 142);
  const [wizKey, setWizKey] = useState<KeyType>(project.key || 'F#');
  const [wizScale, setWizScale] = useState<ScaleType>(project.scale || 'Minor');
  const [wizLength, setWizLength] = useState(project.trackLengthMinutes || '6:00');
  const [wizDifficulty, setWizDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(project.difficulty || 'Intermediate');

  const activeStage = PRODUCER_STAGES.find((s) => s.id === activeStageId) || PRODUCER_STAGES[0];

  // Stage progress calculation
  const stageProgressMap = project.stageProgress || {};
  const completedCount = Object.values(stageProgressMap).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / PRODUCER_STAGES.length) * 100);

  const toggleStageCompletion = (stageId: number) => {
    const updatedMap = { ...stageProgressMap, [stageId]: !stageProgressMap[stageId] };
    const nextStage = stageId < 15 ? stageId + 1 : 15;
    const updatedProject: AAMCProject = {
      ...project,
      productionStage: nextStage,
      stageProgress: updatedMap,
    };
    onProjectChange(updatedProject);
    projectService.saveProject(updatedProject);
  };

  const handleStartNewTrack = () => {
    const newProject = projectService.createNewProject(
      `New ${wizGenre} Track`,
      wizGenre,
      wizBpm,
      wizKey,
      wizScale
    );
    newProject.subgenre = wizSubgenre;
    newProject.trackLengthMinutes = wizLength;
    newProject.difficulty = wizDifficulty;
    newProject.productionStage = 1;
    newProject.stageProgress = { 1: false };

    onProjectChange(newProject);
    projectService.saveProject(newProject);
    setShowWizard(false);
    setActiveStageId(1);
  };

  const getStageActionView = (stageId: number): { view: ViewType; label: string } => {
    switch (stageId) {
      case 1:
        return { view: 'settings', label: 'CHECK STUDIO SETTINGS' };
      case 2:
      case 3:
      case 4:
        return { view: 'bass', label: 'OPEN BASS LABORATORY' };
      case 5:
      case 6:
        return { view: 'drums', label: 'OPEN DRUM MACHINE' };
      case 7:
      case 8:
        return { view: 'midi', label: 'OPEN MIDI COMPOSER' };
      case 9:
      case 10:
        return { view: 'sounddesign', label: 'OPEN SOUND DESIGN LAB' };
      case 11:
      case 12:
        return { view: 'arrangement', label: 'OPEN ARRANGEMENT GUIDE' };
      case 13:
      case 14:
      case 15:
        return { view: 'analyzer', label: 'OPEN SPECTRUM & MIX ANALYZER' };
      default:
        return { view: 'dashboard', label: 'OPEN DASHBOARD' };
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#181818] border border-[#333] p-5 rounded-lg shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-[#90FF00]/10 text-[#90FF00] border border-[#90FF00]/30 px-2 py-0.5 rounded font-bold">
              {translate('producer.banner')}
            </span>
            <span className="text-xs text-[#888]">{translate('producer.subtitle')}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {project.name} <span className="text-[#90FF00]">({project.genre})</span>
          </h1>
          <p className="text-xs text-[#AAA] mt-0.5">
            Key: <strong className="text-white">{project.key} {project.scale}</strong> | BPM: <strong className="text-white">{project.bpm}</strong> | Target: <strong className="text-white">{project.trackLengthMinutes || '6:00'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWizard(true)}
            className="px-3.5 py-2 bg-[#252525] hover:bg-[#333] border border-[#444] rounded text-xs font-bold text-[#90FF00] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#90FF00]" />
            <span>{translate('producer.startWizard')}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[#181818] border border-[#333] p-4 rounded-lg">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-[#CCC] font-bold">{translate('producer.progress')}</span>
          <span className="text-[#90FF00] font-bold">
            {translate('producer.completedStages')
              .replace('{completed}', String(completedCount))
              .replace('{percent}', String(progressPercent))}
          </span>
        </div>
        <div className="w-full bg-[#222] h-2.5 rounded-full overflow-hidden border border-[#333]">
          <div
            className="bg-gradient-to-r from-[#90FF00] to-[#00E5FF] h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stages Sidebar List (15 Steps) */}
        <div className="lg:col-span-4 bg-[#181818] border border-[#333] rounded-lg p-3 space-y-1 max-h-[720px] overflow-y-auto">
          <div className="text-[10px] font-mono text-[#666] uppercase px-2 py-1 font-bold tracking-wider">
            {translate('producer.workflowStages')}
          </div>

          {PRODUCER_STAGES.map((s) => {
            const isCompleted = Boolean(stageProgressMap[s.id]);
            const isActive = activeStageId === s.id;
            const sTitle = isHe && s.titleHe ? s.titleHe : s.title;

            return (
              <button
                key={s.id}
                onClick={() => setActiveStageId(s.id)}
                className={`w-full p-2.5 rounded text-left flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#252525] border-l-4 border-[#90FF00] text-white'
                    : isCompleted
                    ? 'bg-[#151515] text-[#AAA] hover:bg-[#202020]'
                    : 'bg-[#121212] text-[#888] hover:bg-[#1C1C1C]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`text-[11px] font-mono font-bold w-6 shrink-0 ${isActive ? 'text-[#90FF00]' : 'text-[#666]'}`}>
                    {s.code}
                  </span>
                  <div className="truncate">
                    <span className="text-xs font-semibold block truncate">{sTitle}</span>
                    <span className="text-[10px] font-mono text-[#666]">{s.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-[#90FF00]" />
                  )}
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-[#90FF00]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-[#181818] border border-[#333] rounded-lg p-6 space-y-6">
            {/* Stage Title */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#333] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono bg-[#252525] text-[#90FF00] px-2 py-0.5 rounded font-bold border border-[#333]">
                    {translate('producer.stage')} {activeStage.code}
                  </span>
                  <span className="text-xs text-[#00E5FF] font-mono">{activeStage.category}</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {isHe && activeStage.titleHe ? activeStage.titleHe : activeStage.title}
                </h2>
              </div>

              <button
                onClick={() => toggleStageCompletion(activeStage.id)}
                className={`px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                  stageProgressMap[activeStage.id]
                    ? 'bg-[#90FF00]/20 text-[#90FF00] border border-[#90FF00]/50 hover:bg-[#90FF00]/30'
                    : 'bg-[#252525] text-[#CCC] border border-[#444] hover:bg-[#333]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {stageProgressMap[activeStage.id]
                    ? translate('producer.completed')
                    : translate('producer.markComplete')}
                </span>
              </button>
            </div>

            {/* Explanation & Objective */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#121212] p-4 rounded border border-[#2A2A2A]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#90FF00] mb-2 font-bold uppercase">
                  <Info className="w-4 h-4" />
                  <span>{translate('producer.explanation')}</span>
                </div>
                <p className="text-xs text-[#CCC] leading-relaxed">
                  {isHe && activeStage.explanationHe ? activeStage.explanationHe : activeStage.explanation}
                </p>
              </div>

              <div className="bg-[#121212] p-4 rounded border border-[#2A2A2A]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF] mb-2 font-bold uppercase">
                  <Award className="w-4 h-4" />
                  <span>{translate('producer.objective')}</span>
                </div>
                <p className="text-xs text-[#CCC] leading-relaxed">
                  {isHe && activeStage.objectiveHe ? activeStage.objectiveHe : activeStage.objective}
                </p>
              </div>
            </div>

            {/* Ableton Live 12 Step-by-Step Instructions */}
            <div className="bg-[#121212] p-4 rounded border border-[#2A2A2A]">
              <h3 className="text-xs font-mono font-bold text-[#90FF00] uppercase mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>{translate('producer.actions')}</span>
              </h3>
              <div className="text-xs text-[#DDD] space-y-2 whitespace-pre-line leading-relaxed font-sans">
                {isHe && activeStage.abletonInstructionsHe ? activeStage.abletonInstructionsHe : activeStage.abletonInstructions}
              </div>
            </div>

            {/* Recommended Parameters */}
            <div>
              <h3 className="text-xs font-mono font-bold text-[#888] uppercase mb-2 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00E5FF]" />
                <span>{translate('producer.params')}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeStage.recommendedParams.map((p, idx) => (
                  <div key={idx} className="bg-[#121212] p-3 rounded border border-[#2A2A2A]">
                    <span className="text-[10px] font-mono text-[#666] block uppercase">{p.param}</span>
                    <span className="text-xs font-bold text-[#90FF00]">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Mistakes & Listening Exercise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#121212] p-4 rounded border border-[#2A2A2A]">
                <h4 className="text-xs font-mono font-bold text-[#FF5555] uppercase mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{translate('producer.mistakes')}</span>
                </h4>
                <ul className="text-xs text-[#BBB] space-y-1.5 list-disc list-inside">
                  {(isHe && activeStage.commonMistakesHe ? activeStage.commonMistakesHe : activeStage.commonMistakes).map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#121212] p-4 rounded border border-[#2A2A2A]">
                <h4 className="text-xs font-mono font-bold text-[#00E5FF] uppercase mb-2 flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  <span>{translate('producer.exercise')}</span>
                </h4>
                <p className="text-xs text-[#BBB] leading-relaxed">
                  {isHe && activeStage.listeningExerciseHe ? activeStage.listeningExerciseHe : activeStage.listeningExercise}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#333]">
              {(() => {
                const target = getStageActionView(activeStage.id);
                return (
                  <button
                    onClick={() => onNavigate(target.view)}
                    className="px-4 py-2 bg-[#90FF00] hover:bg-[#a6ff26] text-black text-xs font-bold rounded flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>{target.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                );
              })()}

              <button
                onClick={() => onOpenCoachWithMessage(`Explain stage ${activeStage.code} (${activeStage.title}) in detail for ${project.genre} at ${project.bpm} BPM in ${project.key} ${project.scale}.`)}
                className="px-4 py-2 bg-[#252525] hover:bg-[#333] border border-[#444] text-[#90FF00] text-xs font-bold rounded flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#90FF00]" />
                <span>ASK AI COACH ABOUT THIS STAGE</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Start New Track Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#181818] border border-[#444] rounded-lg p-6 max-w-xl w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#333] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#90FF00]" />
                <h2 className="text-base font-bold text-white">Start New Track Wizard</h2>
              </div>
              <button
                onClick={() => setShowWizard(false)}
                className="text-xs text-[#888] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[#888] block mb-1 uppercase">Genre</label>
                <select
                  value={wizGenre}
                  onChange={(e) => {
                    const g = e.target.value as GenreType;
                    setWizGenre(g);
                    if (g.includes('Psy')) setWizBpm(142);
                    else if (g.includes('Techno')) setWizBpm(132);
                  }}
                  className="w-full bg-[#121212] border border-[#333] rounded px-3 py-2 text-xs text-white"
                >
                  <option value="Psytrance">Psytrance</option>
                  <option value="Goa Psytrance">Goa Psytrance</option>
                  <option value="Full-On Psytrance">Full-On Psytrance</option>
                  <option value="Progressive Psytrance">Progressive Psytrance</option>
                  <option value="Dark Psy">Dark Psy</option>
                  <option value="Forest">Forest</option>
                  <option value="Hi-Tech">Hi-Tech</option>
                  <option value="Techno">Techno</option>
                  <option value="Peak-Time Techno">Peak-Time Techno</option>
                  <option value="Melodic Techno">Melodic Techno</option>
                  <option value="Electronic Music">Electronic Music</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#888] block mb-1 uppercase">BPM</label>
                  <input
                    type="number"
                    value={wizBpm}
                    onChange={(e) => setWizBpm(Number(e.target.value))}
                    className="w-full bg-[#121212] border border-[#333] rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#888] block mb-1 uppercase">Root Key</label>
                  <select
                    value={wizKey}
                    onChange={(e) => setWizKey(e.target.value as KeyType)}
                    className="w-full bg-[#121212] border border-[#333] rounded px-3 py-2 text-xs text-white font-mono"
                  >
                    {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#888] block mb-1 uppercase">Scale</label>
                  <select
                    value={wizScale}
                    onChange={(e) => setWizScale(e.target.value as ScaleType)}
                    className="w-full bg-[#121212] border border-[#333] rounded px-3 py-2 text-xs text-white font-mono"
                  >
                    <option value="Minor">Minor</option>
                    <option value="Phrygian">Phrygian</option>
                    <option value="Phrygian Dominant">Phrygian Dominant</option>
                    <option value="Harmonic Minor">Harmonic Minor</option>
                    <option value="Dorian">Dorian</option>
                    <option value="Major">Major</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#888] block mb-1 uppercase">Target Length</label>
                  <select
                    value={wizLength}
                    onChange={(e) => setWizLength(e.target.value)}
                    className="w-full bg-[#121212] border border-[#333] rounded px-3 py-2 text-xs text-white font-mono"
                  >
                    <option value="3:00">3:00 (Short Edit)</option>
                    <option value="4:00">4:00</option>
                    <option value="5:00">5:00</option>
                    <option value="6:00">6:00 (Standard Club Mix)</option>
                    <option value="7:00+">7:00+ (Extended Journey)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#888] block mb-1 uppercase">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setWizDifficulty(diff)}
                      className={`py-2 rounded text-xs font-bold border transition-colors cursor-pointer ${
                        wizDifficulty === diff
                          ? 'bg-[#90FF00] text-black border-[#90FF00]'
                          : 'bg-[#121212] text-[#888] border-[#333] hover:text-white'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#333]">
              <button
                onClick={() => setShowWizard(false)}
                className="px-4 py-2 bg-[#222] hover:bg-[#333] text-xs text-[#888] rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleStartNewTrack}
                className="px-5 py-2 bg-[#90FF00] hover:bg-[#a6ff26] text-black font-bold text-xs rounded flex items-center gap-1.5 cursor-pointer"
              >
                <span>START PRODUCTION NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
