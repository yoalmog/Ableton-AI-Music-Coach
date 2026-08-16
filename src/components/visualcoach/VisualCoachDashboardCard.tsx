import React from 'react';
import { Zap, Play, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, Monitor, ArrowRight, Layers } from 'lucide-react';
import { VISUAL_LESSONS } from '../../data/visualLessonsData';
import { visualCoachStorageService } from '../../services/visualCoachStorageService';
import { Language } from '../../i18n/types';

interface VisualCoachDashboardCardProps {
  onOpenVisualCoach: (lessonId?: string) => void;
  language?: Language;
  className?: string;
}

export const VisualCoachDashboardCard: React.FC<VisualCoachDashboardCardProps> = ({
  onOpenVisualCoach,
  language = 'he',
  className = '',
}) => {
  const isHe = language === 'he';
  const memory = visualCoachStorageService.getMemory();
  const activeLessonId = memory.lastActiveLessonId || 'psy-kick-bass-01';
  const currentLesson = VISUAL_LESSONS.find((l) => l.id === activeLessonId) || VISUAL_LESSONS[0];
  const progress = visualCoachStorageService.getLessonProgress(currentLesson.id);

  const completedCount = progress.completedStepIndexes?.length || 0;
  const totalSteps = currentLesson.steps.length;
  const percent = Math.round((completedCount / totalSteps) * 100);

  const getLocalized = (locObj?: { [key: string]: string | undefined }) => {
    if (!locObj) return '';
    return locObj[language] || locObj.en || Object.values(locObj)[0] || '';
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A1A] via-[#161616] to-[#0F0F0F] border border-[#2F2F2F] hover:border-[#90FF00]/60 p-5 shadow-2xl transition-all group ${className}`}
    >
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-[#90FF00]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-[#00E5FF]/10 blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="relative flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#90FF00]/20 to-[#00E5FF]/10 border border-[#90FF00]/40 text-[#90FF00] flex items-center justify-center shadow-lg shadow-[#90FF00]/10">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                {isHe ? 'מאמן Ableton ויזואלי' : 'Visual Ableton Coach'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#90FF00]/20 text-[#90FF00] border border-[#90FF00]/40">
                LIVE 12
              </span>
            </div>
            <p className="text-xs text-[#888] mt-0.5">
              {isHe
                ? 'למד ישירות מתוך ממשק Ableton Live 12 עם הדגשות ויזואליות מדויקות'
                : 'Learn directly on the real Ableton Live 12 interface with step-by-step visual highlights'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono font-bold text-[#90FF00]">
            {percent}% {isHe ? 'הושלם' : 'DONE'}
          </span>
        </div>
      </div>

      {/* Active Lesson Snapshot Box */}
      <div className="relative bg-[#1E1E1E]/90 border border-[#2D2D2D] rounded-xl p-3.5 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#00E5FF] uppercase">
              {currentLesson.genre} • {currentLesson.difficulty}
            </span>
            <span className="text-[10px] text-[#666]">• {currentLesson.estimatedMinutes} min</span>
          </div>
          <h4 className="text-sm font-bold text-white">
            {getLocalized(currentLesson.title)}
          </h4>
          <p className="text-xs text-[#AAA] line-clamp-1">
            {getLocalized(currentLesson.subtitle)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-32 flex flex-col gap-1 shrink-0">
          <div className="flex justify-between text-[10px] font-mono text-[#888]">
            <span>STEP {progress.currentStepIndex + 1}/{totalSteps}</span>
            <span>{percent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#121212] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00E5FF] to-[#90FF00] rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 text-xs text-[#888]">
          <span className="w-2 h-2 rounded-full bg-[#90FF00] animate-pulse" />
          <span>
            {isHe
              ? 'SEE IT → UNDERSTAND IT → DO IT IN ABLETON'
              : 'SEE IT → UNDERSTAND IT → DO IT IN ABLETON'}
          </span>
        </div>

        <button
          onClick={() => onOpenVisualCoach(currentLesson.id)}
          className="px-5 py-2.5 bg-[#90FF00] hover:bg-[#A6FF33] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#90FF00]/20 flex items-center gap-2 transition-all group-hover:scale-105"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>
            {progress.currentStepIndex > 0
              ? isHe
                ? 'המשך שיעור ויזואלי'
                : 'Continue Visual Lesson'
              : isHe
              ? 'התחל שיעור ויזואלי'
              : 'Start Visual Lesson'}
          </span>
          {isHe ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
