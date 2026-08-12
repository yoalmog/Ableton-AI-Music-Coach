import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  WifiOff,
  BarChart2,
  X,
  Download,
  BookOpen,
  PlayCircle,
  Map,
  Compass
} from 'lucide-react';
import { COURSES_DATA } from '../../data/coursesData';
import { Course, Lesson } from '../../types/lesson';
import { lessonStorageService } from '../../services/lessonStorageService';
import { LessonsLibrary } from './LessonsLibrary';
import { LessonPlayer } from './LessonPlayer';
import { VisualCourseMap } from './VisualCourseMap';
import { StepByStepGuidedMode } from './StepByStepGuidedMode';
import { useLanguage } from '../../context/LanguageContext';

interface LessonsViewProps {
  onOpenCoach: () => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({ onOpenCoach }) => {
  const { t, isRtl } = useLanguage();
  const [viewMode, setViewMode] = useState<'library' | 'coursemap' | 'guided' | 'player'>('coursemap');
  const [selectedCourse, setSelectedCourse] = useState<Course>(COURSES_DATA[0]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(COURSES_DATA[0].lessons[0]);
  const [showProgressSummary, setShowProgressSummary] = useState(false);

  const handleSelectLessonFromLibrary = (lesson: Lesson, course: Course) => {
    setSelectedCourse(course);
    setSelectedLesson(lesson);
    setViewMode('player');
  };

  const handleSelectModuleFromCourseMap = (moduleId: string) => {
    // Find lesson matching module or use current lesson
    const foundLesson = COURSES_DATA[0].lessons.find((l) => l.id === moduleId) || COURSES_DATA[0].lessons[0];
    setSelectedLesson(foundLesson);
    setViewMode('guided');
  };

  const overallSummary = lessonStorageService.getOverallSummary();

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto text-[#E0E0E0] font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Main Navigation Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#1A1A1A] border border-[#333] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#90FF00] uppercase tracking-widest font-mono">
              <GraduationCap className="w-4 h-4" />
              <span>{t('lessons.banner')}</span>
            </div>

            {/* Offline Readiness Badge */}
            <div className="flex items-center gap-1.5 bg-[#121212] border border-[#2A2A2A] px-2.5 py-0.5 rounded text-[10px] font-mono text-[#00E5FF]">
              <WifiOff className="w-3 h-3" />
              <span>{t('lessons.offlineReady')}</span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-white mt-1.5">
            Ableton Live 12 Music Production Academy
          </h1>
          <p className="text-xs text-[#888] mt-0.5">
            Interactive offline curriculum for Psytrance, Techno & Electronic Music Synthesis
          </p>
        </div>

        {/* Navigation Mode Switcher & Progress Summary */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-[#121212] border border-[#333] p-1 rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('coursemap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'coursemap'
                  ? 'bg-[#90FF00] text-black shadow-[0_0_8px_rgba(144,255,0,0.3)]'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>{isRtl ? 'מפת מסלולים' : 'Course Map'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('library')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'library'
                  ? 'bg-[#90FF00] text-black shadow-[0_0_8px_rgba(144,255,0,0.3)]'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isRtl ? 'ספרייה' : 'Topics Library'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('guided')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'guided'
                  ? 'bg-[#90FF00] text-black shadow-[0_0_8px_rgba(144,255,0,0.3)]'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isRtl ? 'מצב מודרך' : 'Guided Mode'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('player')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'player'
                  ? 'bg-[#90FF00] text-black shadow-[0_0_8px_rgba(144,255,0,0.3)]'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{isRtl ? 'נגן שיעור' : 'Lesson Player'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowProgressSummary(true)}
            className="bg-[#252525] hover:bg-[#333] text-[#90FF00] border border-[#444] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Progress</span>
          </button>
        </div>
      </div>

      {/* Animated View Mode Switching */}
      <AnimatePresence mode="wait">
        {viewMode === 'coursemap' ? (
          <motion.div
            key="view-coursemap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <VisualCourseMap onSelectModule={handleSelectModuleFromCourseMap} />
          </motion.div>
        ) : viewMode === 'guided' ? (
          <motion.div
            key="view-guided"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <StepByStepGuidedMode
              lesson={selectedLesson}
              onBackToLibrary={() => setViewMode('coursemap')}
            />
          </motion.div>
        ) : viewMode === 'library' ? (
          <motion.div
            key="view-library"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <LessonsLibrary
              onSelectLesson={handleSelectLessonFromLibrary}
              activeLessonId={selectedLesson?.id}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`view-player-${selectedLesson.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <LessonPlayer
              lesson={selectedLesson}
              course={selectedCourse}
              onOpenCoach={onOpenCoach}
              onBackToLibrary={() => setViewMode('library')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* OFFLINE PROGRESS METRICS MODAL */}
      {showProgressSummary && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#90FF00]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Offline Progress Metrics
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProgressSummary(false)}
                className="text-[#888] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="bg-[#121212] p-3 rounded border border-[#2A2A2A]">
                <span className="text-[10px] text-[#666] block uppercase">Completed Lessons</span>
                <span className="text-base font-bold text-[#90FF00]">
                  {overallSummary.completedLessons} / {overallSummary.totalLessons}
                </span>
              </div>

              <div className="bg-[#121212] p-3 rounded border border-[#2A2A2A]">
                <span className="text-[10px] text-[#666] block uppercase">Completion %</span>
                <span className="text-base font-bold text-[#00E5FF]">
                  {overallSummary.completionPercentage}%
                </span>
              </div>

              <div className="bg-[#121212] p-3 rounded border border-[#2A2A2A]">
                <span className="text-[10px] text-[#666] block uppercase">Avg Quiz Score</span>
                <span className="text-base font-bold text-[#90FF00]">
                  {overallSummary.averageQuizScore}%
                </span>
              </div>

              <div className="bg-[#121212] p-3 rounded border border-[#2A2A2A]">
                <span className="text-[10px] text-[#666] block uppercase">Bookmarked Topics</span>
                <span className="text-base font-bold text-[#00E5FF]">
                  {overallSummary.bookmarkedCount}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-3">
              <button
                type="button"
                onClick={() => {
                  const data = lessonStorageService.exportProgressData();
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `AAMC_Lesson_Progress_${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                }}
                className="bg-[#252525] hover:bg-[#333] text-white border border-[#444] px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Backup Progress Data</span>
              </button>

              <button
                type="button"
                onClick={() => setShowProgressSummary(false)}
                className="bg-[#90FF00] text-black font-bold px-4 py-1.5 rounded text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
