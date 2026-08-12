import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  Bookmark,
  Filter,
  Sparkles,
  PlayCircle,
  Layers,
  GraduationCap
} from 'lucide-react';
import { Lesson, Course, LessonFilterOptions } from '../../types/lesson';
import { COURSES_DATA } from '../../data/coursesData';
import { lessonStorageService } from '../../services/lessonStorageService';
import { useLanguage } from '../../context/LanguageContext';

interface LessonsLibraryProps {
  onSelectLesson: (lesson: Lesson, course: Course) => void;
  activeLessonId?: string;
}

export const LessonsLibrary: React.FC<LessonsLibraryProps> = ({
  onSelectLesson,
  activeLessonId,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('All');

  // Trigger re-renders when local bookmarks/progress updates
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleToggleBookmark = (e: React.MouseEvent, lessonId: string) => {
    e.stopPropagation();
    lessonStorageService.toggleBookmark(lessonId);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Filter lessons
  const filteredLessonsWithCourse = React.useMemo(() => {
    const list: { lesson: Lesson; course: Course }[] = [];

    COURSES_DATA.forEach((course) => {
      if (selectedCourseId !== 'All' && course.id !== selectedCourseId) {
        return;
      }

      course.lessons.forEach((lesson) => {
        // Genre filter
        if (selectedGenre !== 'All' && lesson.genre !== selectedGenre) {
          return;
        }

        // Difficulty filter
        if (selectedDifficulty !== 'All' && lesson.difficulty !== selectedDifficulty) {
          return;
        }

        // Bookmark filter
        const progress = lessonStorageService.getLessonProgress(lesson.id);
        if (onlyBookmarked && !progress.isBookmarked) {
          return;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const inTitle = lesson.title.toLowerCase().includes(q);
          const inDesc = lesson.description.toLowerCase().includes(q);
          const inCourse = course.title.toLowerCase().includes(q);
          const inTags = lesson.tags?.some((t) => t.toLowerCase().includes(q)) || false;

          if (!inTitle && !inDesc && !inCourse && !inTags) {
            return;
          }
        }

        list.push({ lesson, course });
      });
    });

    return list;
  }, [searchQuery, selectedGenre, selectedDifficulty, onlyBookmarked, selectedCourseId, refreshTrigger]);

  const genres = ['All', 'Psytrance', 'Techno', 'Melodic Techno', 'Progressive'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Filter Controls */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#252525] border border-[#333] text-[#90FF00] flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Ableton Live 12 Curriculum Library
              </h2>
              <p className="text-xs text-[#888]">
                Select an offline topic to launch the interactive lesson player & MIDI roll
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#90FF00] bg-[#121212] border border-[#2A2A2A] px-3 py-1.5 rounded">
              {filteredLessonsWithCourse.length} Lessons Available
            </span>
          </div>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-[#666] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, genres, Live 12 devices..."
              className="w-full bg-[#121212] border border-[#333] rounded pl-9 pr-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#90FF00]"
            />
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-[#121212] border border-[#333] text-white text-xs rounded px-3 py-2 focus:outline-none focus:border-[#90FF00] cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            {difficulties.filter((d) => d !== 'All').map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Course Module Dropdown */}
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="bg-[#121212] border border-[#333] text-white text-xs rounded px-3 py-2 focus:outline-none focus:border-[#90FF00] cursor-pointer"
          >
            <option value="All">All Courses</option>
            {COURSES_DATA.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Genre Pill Selection Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#262626] pt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-[#666] uppercase mr-1">Genre:</span>
            {genres.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGenre(g)}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  selectedGenre === g
                    ? 'bg-[#90FF00] text-black font-bold'
                    : 'bg-[#252525] text-[#AAA] hover:text-white hover:bg-[#333]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Bookmark Filter Toggle */}
          <button
            type="button"
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`px-3 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              onlyBookmarked
                ? 'bg-[#252525] border-[#00E5FF] text-[#00E5FF]'
                : 'bg-[#121212] border-[#333] text-[#888] hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-current' : ''}`} />
            <span>Bookmarked Only</span>
          </button>
        </div>
      </div>

      {/* Lesson Cards Grid with Motion Transition */}
      <AnimatePresence mode="wait">
        {filteredLessonsWithCourse.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#1A1A1A] border border-[#333] rounded-lg p-10 text-center space-y-3"
          >
            <BookOpen className="w-8 h-8 text-[#555] mx-auto" />
            <h3 className="text-sm font-bold text-white">No matching lessons found</h3>
            <p className="text-xs text-[#888]">
              Try adjusting your search filters or clearing the search query.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('All');
                setSelectedDifficulty('All');
                setOnlyBookmarked(false);
                setSelectedCourseId('All');
              }}
              className="bg-[#252525] hover:bg-[#333] text-[#90FF00] border border-[#444] px-4 py-2 rounded text-xs font-bold cursor-pointer transition-colors"
            >
              Reset All Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredLessonsWithCourse.map(({ lesson, course }, index) => {
              const progress = lessonStorageService.getLessonProgress(lesson.id);
              const isActive = activeLessonId === lesson.id;

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  whileHover={{ y: -3 }}
                  onClick={() => onSelectLesson(lesson, course)}
                  className={`bg-[#1A1A1A] border rounded-lg p-4 space-y-3 cursor-pointer transition-all flex flex-col justify-between group ${
                    isActive
                      ? 'border-[#90FF00] shadow-[0_0_15px_rgba(144,255,0,0.15)] bg-[#1e2318]'
                      : 'border-[#333] hover:border-[#555] hover:bg-[#1E1E1E]'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Top Badges Bar */}
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="bg-[#121212] border border-[#2A2A2A] text-[#00E5FF] px-2 py-0.5 rounded font-bold uppercase">
                        {course.genre}
                      </span>

                      <div className="flex items-center gap-2">
                        {progress.isCompleted && (
                          <span className="flex items-center gap-1 text-[#90FF00] font-bold bg-[#122A12] px-2 py-0.5 rounded border border-[#90FF00]/30">
                            <CheckCircle className="w-3 h-3" />
                            <span>Done</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleToggleBookmark(e, lesson.id)}
                          className={`p-1 rounded transition-colors ${
                            progress.isBookmarked
                              ? 'text-[#00E5FF]'
                              : 'text-[#555] hover:text-[#AAA]'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${progress.isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Lesson Title & Course */}
                    <div>
                      <span className="text-[10px] text-[#777] font-mono block">
                        Course: {course.title}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#90FF00] transition-colors line-clamp-1 mt-0.5">
                        {lesson.title}
                      </h3>
                      {lesson.subtitle && (
                        <p className="text-xs text-[#AAA] line-clamp-1 mt-0.5">{lesson.subtitle}</p>
                      )}
                    </div>

                    <p className="text-xs text-[#888] line-clamp-2 leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>

                  {/* Card Bottom Meta Footer */}
                  <div className="pt-3 border-t border-[#262626] space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#777] font-mono">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#90FF00]" />
                        <span>{lesson.durationMinutes} mins</span>
                      </div>

                      <span className="capitalize text-[#AAA]">{lesson.difficulty}</span>

                      {progress.quizBestScore !== undefined && (
                        <div className="flex items-center gap-1 text-[#90FF00] font-bold">
                          <Award className="w-3 h-3" />
                          <span>{progress.quizBestScore}%</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLesson(lesson, course);
                      }}
                      className="w-full bg-[#252525] group-hover:bg-[#90FF00] text-[#E0E0E0] group-hover:text-black font-bold py-1.5 rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>{progress.isCompleted ? 'Review Topic' : 'Launch Topic'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
