import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Trophy, Award, Search, HelpCircle, Layers, ArrowLeft, Bot, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { HotspotTarget, LearningMode, InteractiveLesson } from '../../types/classroom';
import { ABLETON_CLASSROOM_COURSES } from '../../data/classroomLessons';
import { classroomService } from '../../services/classroomService';
import { SimulatorUI } from './SimulatorUI';
import { LessonGuidePanel } from './LessonGuidePanel';
import { WhereIsItModal } from './WhereIsItModal';
import { QuizModal } from './QuizModal';
import { SkillTreeView } from './SkillTreeView';
import { LoadingBoundary } from '../common/LoadingBoundary';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { useLanguage } from '../../context/LanguageContext';

interface ClassroomViewProps {
  onOpenCoachWithMessage?: (msg: string) => void;
}

export const ClassroomView: React.FC<ClassroomViewProps> = ({ onOpenCoachWithMessage }) => {
  const [progress, setProgress] = useState(classroomService.getProgress());
  const [selectedCourseId, setSelectedCourseId] = useState(progress.currentCourseId);
  const [selectedLessonId, setSelectedLessonId] = useState(progress.currentLessonId);
  const [learningMode, setLearningMode] = useState<LearningMode>('simulator');
  const [bpm, setBpm] = useState(140);
  const [isLoading, setIsLoading] = useState(true);
  const [stepSuccessNotice, setStepSuccessNotice] = useState<string | null>(null);

  // Modals & Sub-views
  const [isWhereIsItOpen, setIsWhereIsItOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [highlightedTarget, setHighlightedTarget] = useState<HotspotTarget | null>(null);

  const { language, isRTL, t } = useLanguage();

  const currentCourse = ABLETON_CLASSROOM_COURSES.find(c => c.id === selectedCourseId) || ABLETON_CLASSROOM_COURSES[0];
  const currentLesson: InteractiveLesson = currentCourse.lessons.find(l => l.id === selectedLessonId) || currentCourse.lessons[0];
  const currentStep = currentLesson.steps[progress.currentStepIndex] || currentLesson.steps[0];

  useEffect(() => {
    // Initial loading setup to prevent white screen flicker
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Sync current step target to highlightedTarget
    if (currentStep) {
      setHighlightedTarget(currentStep.targetElement);
    }
  }, [currentStep, progress.currentStepIndex]);

  const handleSelectCourse = (courseId: string) => {
    if (!classroomService.isCourseUnlocked(courseId)) {
      const lockNotice = language === 'he'
        ? 'יש להשלים את כיתה 1 (אבלטון לייב 12 — צעדים ראשונים) בציון 80%+ כדי לפתוח קורס זה!'
        : 'Complete Class #1 (ABLETON LIVE 12 — FIRST STEPS) with 80%+ score to unlock this course!';
      setStepSuccessNotice(lockNotice);
      setTimeout(() => setStepSuccessNotice(null), 4000);
      return;
    }
    setIsLoading(true);
    const course = ABLETON_CLASSROOM_COURSES.find(c => c.id === courseId);
    if (course && course.lessons.length > 0) {
      setSelectedCourseId(courseId);
      setSelectedLessonId(course.lessons[0].id);
      classroomService.setCourseAndLesson(courseId, course.lessons[0].id);
      setProgress(classroomService.getProgress());
    }
    setTimeout(() => setIsLoading(false), 120);
  };

  const handleSelectLesson = (lessonId: string) => {
    setIsLoading(true);
    setSelectedLessonId(lessonId);
    classroomService.setCourseAndLesson(selectedCourseId, lessonId);
    setProgress(classroomService.getProgress());
    setTimeout(() => setIsLoading(false), 120);
  };

  const handleUserActionInSimulator = (target: HotspotTarget, value?: any) => {
    if (currentStep && target === currentStep.targetElement) {
      const msg = language === 'he'
        ? `ביצוע השלב "${currentStep.titleHe}" אושר! (+30 XP)`
        : `Step "${currentStep.title}" completed! (+30 XP)`;
      setStepSuccessNotice(msg);
      setTimeout(() => setStepSuccessNotice(null), 3000);
      handleProceedNextStep();
    }
  };

  const handleProceedNextStep = () => {
    const result = classroomService.completeStep(currentStep.id, 30);
    setProgress(classroomService.getProgress());

    if (result.isLessonCompleted) {
      // Open Quiz if quiz available
      if (currentLesson.quiz && currentLesson.quiz.length > 0) {
        setIsQuizOpen(true);
      }
    }
  };

  const handleQuizComplete = (score: number) => {
    classroomService.saveQuizScore(currentLesson.id, score);
    setIsQuizOpen(false);
    setProgress(classroomService.getProgress());
  };

  const handleOpenAiCoachWithContext = () => {
    const contextPrompt = classroomService.getAiClassroomContext();
    const userQuestion = language === 'he'
      ? `שלום מורה, אני בשלב "${currentStep.titleHe}" בשיעור "${currentLesson.titleHe}". ההנחיה היא: "${currentStep.instructionHe}". תוכל להסביר לי בקצרה ולעזור לי לבצע זאת?`
      : `Hi AI Teacher, I am currently on step "${currentStep.title}" in lesson "${currentLesson.title}". The instruction is: "${currentStep.instruction}". Could you explain how to perform this?`;

    if (onOpenCoachWithMessage) {
      onOpenCoachWithMessage(`${contextPrompt}\n\nStudent Question: ${userQuestion}`);
    }
  };

  const handleNavigateAndHighlightFromSearch = (target: HotspotTarget) => {
    setHighlightedTarget(target);
  };

  if (isLoading) {
    return <LoadingBoundary isLoading={true} loadingText={t('simulator.loadingClassroom')} isPanel={true} />;
  }

  return (
    <ErrorBoundary isPanel={true}>
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto min-h-screen text-gray-100"
      >
        {/* Step Action Success Banner */}
        {stepSuccessNotice && (
          <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{stepSuccessNotice}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xl shadow-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold text-white tracking-wide">
                  {language === 'he' ? 'כיתת הלימוד האינטראקטיבית ב-Ableton Live 12' : 'Interactive Ableton Live 12 Classroom'}
                </h1>
                <span className="bg-amber-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                  Simulator
                </span>
              </div>
              <p className="text-xs text-[#999] mt-0.5">
                {language === 'he'
                  ? 'למד איפה כל דבר נמצא, מה הוא עושה, למה משתמשים בו ואיך ליישם באבלטון האמיתי'
                  : 'Learn where things are, what they do, why they are used, and how to operate Ableton'}
              </p>
            </div>
          </div>

          {/* Top Controls: Skill Stats & View Toggles */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={() => setShowSkillTree(!showSkillTree)}
              className="px-3.5 py-2 bg-[#252525] hover:bg-[#303030] border border-[#3D3D3D] text-amber-400 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{language === 'he' ? 'עץ מיומנויות ו-XP' : 'Skill Tree & XP'}</span>
              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                {progress.totalXp} XP
              </span>
            </button>

            <button
              onClick={() => setIsWhereIsItOpen(true)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition"
            >
              <Search className="w-4 h-4" />
              <span>{language === 'he' ? 'איפה זה באבלטון?' : 'Where Is It?'}</span>
            </button>
          </div>
        </div>

        {/* Course & Lesson Selection Bar */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#888] uppercase">{language === 'he' ? 'מסלול לימוד:' : 'Course:'}</span>
            {ABLETON_CLASSROOM_COURSES.map(c => {
              const isSelected = c.id === selectedCourseId;
              const isUnlocked = classroomService.isCourseUnlocked(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCourse(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-black shadow-md'
                      : isUnlocked
                      ? 'bg-[#222] border border-[#333] text-gray-300 hover:border-[#444]'
                      : 'bg-[#181818] border border-[#2B2B2B] text-gray-500 hover:border-[#383838]'
                  }`}
                  title={!isUnlocked ? (language === 'he' ? 'נעול — יש להשלים צעדים ראשונים ב-80%+' : 'Locked — Complete First Steps with 80%+') : undefined}
                >
                  {!isUnlocked && <Lock className="w-3 h-3 text-amber-500/70" />}
                  <span>{language === 'he' ? c.titleHe : c.title}</span>
                </button>
              );
            })}
          </div>

          {/* Lesson Select Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#888] uppercase">{language === 'he' ? 'שיעור:' : 'Lesson:'}</span>
            <select
              value={selectedLessonId}
              onChange={e => handleSelectLesson(e.target.value)}
              className="bg-[#222] border border-[#333] text-xs text-white rounded-lg px-3 py-1.5 focus:border-amber-400 outline-none"
            >
              {currentCourse.lessons.map(l => (
                <option key={l.id} value={l.id}>
                  {language === 'he' ? l.titleHe : l.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Skill Tree Modal / Expandable View */}
        {showSkillTree && (
          <SkillTreeView
            skills={progress.skillLevels}
            totalXp={progress.totalXp}
          />
        )}

        {/* MAIN TWO-COLUMN CLASSROOM WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left/Main Column: DAW Interactive Simulator UI (8 Cols) */}
          <div className="lg:col-span-8">
            <LoadingBoundary isPanel={true}>
              <SimulatorUI
                targetHighlight={highlightedTarget}
                onUserAction={handleUserActionInSimulator}
                onOpenWhereIsIt={() => setIsWhereIsItOpen(true)}
                bpm={bpm}
                onBpmChange={setBpm}
              />
            </LoadingBoundary>
          </div>

          {/* Right Column: Step-by-Step Guided Mode Panel (4 Cols) */}
          <div className="lg:col-span-4">
            <LessonGuidePanel
              step={currentStep}
              currentStepIndex={progress.currentStepIndex}
              totalSteps={currentLesson.steps.length}
              mode={learningMode}
              onNextStep={handleProceedNextStep}
              onOpenAiCoach={handleOpenAiCoachWithContext}
              onHintUsed={() => classroomService.incrementHintCount()}
              onToggleMode={setLearningMode}
            />
          </div>
        </div>

        {/* Search "WHERE IS IT?" Modal */}
        <WhereIsItModal
          isOpen={isWhereIsItOpen}
          onClose={() => setIsWhereIsItOpen(false)}
          onNavigateAndHighlightTarget={handleNavigateAndHighlightFromSearch}
        />

        {/* End of Lesson Verification Quiz Modal */}
        {currentLesson.quiz && (
          <QuizModal
            isOpen={isQuizOpen}
            questions={currentLesson.quiz}
            onComplete={handleQuizComplete}
            onClose={() => setIsQuizOpen(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};
