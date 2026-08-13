import React from 'react';
import { BookOpen, Play, ArrowRight, Sparkles } from 'lucide-react';
import { classroomService } from '../../services/classroomService';
import { useLanguage } from '../../context/LanguageContext';

interface ContinueLearningCardProps {
  onNavigateToClassroom: () => void;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  onNavigateToClassroom
}) => {
  const progress = classroomService.getProgress();
  const currentCourse = classroomService.getCurrentCourse();
  const currentLesson = classroomService.getCurrentLesson();
  const { language, isRTL } = useLanguage();

  const totalLessonsInCourse = currentCourse.lessons.length;
  const completedInCourse = currentCourse.lessons.filter(l =>
    progress.completedLessonIds.includes(l.id)
  ).length;

  const percentComplete = totalLessonsInCourse > 0
    ? Math.round((completedInCourse / totalLessonsInCourse) * 100)
    : 0;

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-[#1A1A1A] border border-[#333] hover:border-amber-500/50 rounded-2xl p-5 shadow-xl transition-all duration-300 relative overflow-hidden group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              {language === 'he' ? 'המשך בלמידה' : 'CONTINUE LEARNING'}
            </span>
            <h3 className="font-bold text-sm text-white">
              {language === 'he' ? currentCourse.titleHe : currentCourse.title}
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
          {percentComplete}%
        </span>
      </div>

      <div className="bg-[#121212] p-3 rounded-xl border border-[#2B2B2B] mb-4 space-y-1">
        <span className="text-[10px] text-[#888] font-semibold uppercase">
          {language === 'he' ? 'שיעור נוכחי:' : 'Current Lesson:'}
        </span>
        <p className="text-xs font-bold text-amber-200">
          {currentLesson ? (language === 'he' ? currentLesson.titleHe : currentLesson.title) : 'Lesson 1'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#121212] h-2 rounded-full overflow-hidden mb-4 border border-[#2A2A2A]">
        <div
          className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-500"
          style={{ width: `${Math.max(12, percentComplete)}%` }}
        />
      </div>

      <button
        onClick={onNavigateToClassroom}
        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-md"
      >
        <span>{language === 'he' ? 'המשך עכשיו בסימולטור' : 'CONTINUE IN SIMULATOR'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
