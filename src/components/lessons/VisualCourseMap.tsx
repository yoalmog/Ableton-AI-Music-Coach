import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LEARNING_PATHS } from '../../data/learningPathsData';
import { LearningModuleNode, LearningPath } from '../../types/learning';
import { useLanguage } from '../../context/LanguageContext';
import { Map, Lock, CheckCircle2, Play, Clock, Award, ChevronRight, Sparkles } from 'lucide-react';

interface VisualCourseMapProps {
  completedModuleIds?: string[];
  onSelectModule?: (moduleId: string) => void;
}

export const VisualCourseMap: React.FC<VisualCourseMapProps> = ({
  completedModuleIds = [],
  onSelectModule,
}) => {
  const { isRtl } = useLanguage();
  const [selectedPathId, setSelectedPathId] = useState<string>('psytrance_path');
  const [selectedModule, setSelectedModule] = useState<LearningModuleNode | null>(null);

  const activePath = LEARNING_PATHS.find((p) => p.id === selectedPathId) || LEARNING_PATHS[0];

  const calculatePathProgress = (path: LearningPath) => {
    if (!path.modules.length) return 0;
    const doneCount = path.modules.filter((m) => completedModuleIds.includes(m.id)).length;
    return Math.round((doneCount / path.modules.length) * 100);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#14141d] via-[#1a1a27] to-[#12121c] border border-[#232336] shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#90FF00]/10 border border-[#90FF00]/30 flex items-center justify-center text-[#90FF00]">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{isRtl ? 'מפת מסלולי הלימוד החזותית' : 'Visual Learning Course Map'}</span>
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isRtl
                ? 'עקוב אחר התקדמותך, פתח מודולים חדשים, והתמחה בהפקה'
                : 'Track your path progress, unlock modules, and master music production'}
            </p>
          </div>
        </div>
      </div>

      {/* Path Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {LEARNING_PATHS.map((path) => {
          const progress = calculatePathProgress(path);
          const isSelected = path.id === selectedPathId;

          return (
            <button
              key={path.id}
              onClick={() => {
                setSelectedPathId(path.id);
                setSelectedModule(null);
              }}
              className={`p-4 rounded-xl border text-right transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#90FF00]/10 border-[#90FF00] text-white shadow-lg shadow-[#90FF00]/5'
                  : 'bg-[#12121a] border-[#222232] text-gray-400 hover:border-gray-600 hover:text-gray-200'
              }`}
            >
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#1f1f2e] text-[#00E5FF] inline-block mb-1">
                  {path.genreFocus}
                </span>
                <h3 className="font-bold text-sm text-white line-clamp-1">{isRtl && path.titleHe ? path.titleHe : path.title}</h3>
              </div>

              {/* Progress bar */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>{isRtl ? 'התקדמות' : 'Progress'}</span>
                  <span className="font-mono font-bold text-[#90FF00]">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#1e1e2c] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#90FF00] to-[#00E5FF] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Course Tree Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Timeline Nodes */}
        <div className="lg:col-span-2 space-y-4 bg-[#12121a] border border-[#222232] rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#222232]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#90FF00]" />
              <span>{isRtl && activePath.titleHe ? activePath.titleHe : activePath.title}</span>
            </h2>
            <span className="text-xs text-gray-400 font-mono">
              {activePath.modules.length} {isRtl ? 'מודולים' : 'Modules'}
            </span>
          </div>

          <div className="relative space-y-4 before:absolute before:top-4 before:bottom-4 before:left-6 sm:before:left-8 before:w-0.5 before:bg-[#252538]">
            {activePath.modules.map((mod, index) => {
              const isCompleted = completedModuleIds.includes(mod.id);
              const isFirst = index === 0;
              const prevCompleted = index === 0 || completedModuleIds.includes(activePath.modules[index - 1].id);
              const isLocked = !isCompleted && !prevCompleted;
              const isSelected = selectedModule?.id === mod.id;

              return (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModule(mod)}
                  className={`relative flex items-start gap-4 p-4 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#1c1c2b] border-[#90FF00] shadow-md shadow-[#90FF00]/10'
                      : isCompleted
                      ? 'bg-[#151520] border-[#252538] hover:border-[#90FF00]/50'
                      : isLocked
                      ? 'bg-[#111118]/60 border-[#1a1a26] opacity-60'
                      : 'bg-[#161622] border-[#29293d] hover:border-gray-500'
                  }`}
                >
                  {/* Node Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 font-mono font-bold text-sm ${
                      isCompleted
                        ? 'bg-[#90FF00] text-black shadow-md shadow-[#90FF00]/20'
                        : isLocked
                        ? 'bg-[#1c1c28] text-gray-500 border border-[#2a2a3c]'
                        : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : mod.numberStr}
                  </div>

                  {/* Node Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-white truncate">
                        {isRtl && mod.titleHe ? mod.titleHe : mod.title}
                      </h3>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#1e1e2c] text-gray-300 shrink-0 font-medium">
                        {mod.category}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {isRtl && mod.descriptionHe ? mod.descriptionHe : mod.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        {mod.estimatedMinutes} {isRtl ? 'דקות' : 'min'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-[#00E5FF]" />
                        {mod.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Module Detail Panel */}
        <div className="bg-[#12121a] border border-[#222232] rounded-2xl p-6 h-fit space-y-6">
          {selectedModule ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#222232]">
                <span className="text-xs font-mono font-bold text-[#90FF00] bg-[#90FF00]/10 border border-[#90FF00]/30 px-2.5 py-1 rounded-lg">
                  MODULE {selectedModule.numberStr}
                </span>
                <span className="text-xs text-gray-400 font-semibold">{selectedModule.category}</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  {isRtl && selectedModule.titleHe ? selectedModule.titleHe : selectedModule.title}
                </h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  {isRtl && selectedModule.descriptionHe ? selectedModule.descriptionHe : selectedModule.description}
                </p>
              </div>

              {/* Skills Learned */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  {isRtl ? 'מיומנויות נלמדות (Skills Learned)' : 'Skills Learned'}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModule.skillsLearned.map((s, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-[#1a1a27] text-[#00E5FF] border border-[#28283d]">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectModule && onSelectModule(selectedModule.id)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#90FF00] to-[#00E5FF] text-black font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-[#90FF00]/10"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>{isRtl ? 'התחל שיעור במצב מודרך' : 'Start Lesson in Guided Mode'}</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <Map className="w-12 h-12 text-gray-600 mx-auto" />
              <p className="text-sm text-gray-400">
                {isRtl ? 'לחץ על מודול במפה לצפייה בפרטים ושיעור' : 'Click a module on the map to view details and launch lesson'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
