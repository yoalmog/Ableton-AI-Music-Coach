import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sliders,
  Layers,
  Sparkles,
  HelpCircle,
  Eye,
  Crosshair,
  MapPin,
  Compass,
  CheckCircle2,
  Lightbulb,
  Check,
  Send,
  Play,
  Camera,
  Plus,
  BookOpen,
  Target,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VISUAL_LESSONS, VISUAL_COURSE_CATEGORIES } from '../../data/visualLessonsData';
import {
  VisualLesson,
  VisualLessonStep,
  VisualLearningMode,
  VisualLessonCategory,
  ScreenAnnotation,
  UserUploadedImage,
} from '../../types/visualLesson';
import { AAMCProject } from '../../types';
import { Language } from '../../i18n/types';
import { InstructionalImageRenderer } from './InstructionalImageRenderer';
import { AnnotationLayer } from './AnnotationLayer';
import { VisualLessonViewer } from './VisualLessonViewer';
import { VisualLessonEditor } from './VisualLessonEditor';
import { LiveScreenCaptureModal } from './LiveScreenCaptureModal';
import { ImageUploader } from './ImageUploader';
import { visualCoachStorageService } from '../../services/visualCoachStorageService';
import { visualLessonAiService } from '../../services/visualLessonAiService';
import { aiService } from '../../services/aiService';

interface VisualCoachLessonViewProps {
  project?: AAMCProject;
  language?: Language;
  onClose?: () => void;
}

export const VisualCoachLessonView: React.FC<VisualCoachLessonViewProps> = ({
  project,
  language = 'he',
  onClose,
}) => {
  const isHe = language === 'he';

  // Persistence & Custom Lessons State
  const [customLessons, setCustomLessons] = useState<VisualLesson[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string>(VISUAL_LESSONS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<VisualLessonCategory>('psytrance');

  // Load custom lessons from local storage
  useEffect(() => {
    const saved = visualCoachStorageService.getCustomLessons();
    setCustomLessons(saved);
  }, []);

  // Combined lessons (bundled presets + user custom created)
  const allLessons: VisualLesson[] = [...VISUAL_LESSONS, ...customLessons];
  const currentLesson: VisualLesson =
    allLessons.find((l) => l.id === activeLessonId) || VISUAL_LESSONS[0];

  // Active step in current lesson
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const totalSteps = currentLesson.steps.length;
  const currentStep: VisualLessonStep =
    currentLesson.steps[activeStepIndex] || currentLesson.steps[0];

  // Active Learning Mode: Guided (default), Practice, Challenge
  const [learningMode, setLearningMode] = useState<VisualLearningMode>('guided');
  const [isSpotlightEnabled, setIsSpotlightEnabled] = useState<boolean>(true);
  const [isWhereToClickActive, setIsWhereToClickActive] = useState<boolean>(false);
  const [isShowMePlaying, setIsShowMePlaying] = useState<boolean>(false);

  // Modals: Visual Lesson Editor, Screen Capture & Image Uploader
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingLesson, setEditingLesson] = useState<VisualLesson | null>(null);
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState<boolean>(false);
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState<boolean>(false);
  const [customScreenshotUri, setCustomScreenshotUri] = useState<string | null>(null);

  // Verification & AI Interaction State
  const [stepVerificationStatus, setStepVerificationStatus] = useState<
    'unanswered' | 'verified' | 'need_help'
  >('unanswered');
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);
  const [aiResponseTitle, setAiResponseTitle] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiQuestionText, setAiQuestionText] = useState<string>('');
  const [challengeScore, setChallengeScore] = useState<number>(0);

  // Stats & Progress tracking
  const currentLessonProgress = visualCoachStorageService.getLessonProgress(currentLesson.id);

  // Filter lessons based on selected category tab
  const filteredLessons =
    selectedCategory === 'custom'
      ? customLessons
      : allLessons.filter((l) => l.category === selectedCategory);

  // Switch step reset
  useEffect(() => {
    setActiveStepIndex(0);
    setStepVerificationStatus('unanswered');
    setAiResponseText(null);
    setAiResponseTitle(null);
    setIsWhereToClickActive(false);
    setIsShowMePlaying(false);
  }, [activeLessonId]);

  // Complete Step Action ("הבנתי וביצעתי")
  const handleCompleteStep = () => {
    setStepVerificationStatus('verified');
    visualCoachStorageService.completeStep(currentLesson.id, activeStepIndex);

    if (activeStepIndex < totalSteps - 1) {
      setTimeout(() => {
        setActiveStepIndex(activeStepIndex + 1);
        setStepVerificationStatus('unanswered');
        setAiResponseText(null);
        setAiResponseTitle(null);
        setIsWhereToClickActive(false);
        setIsShowMePlaying(false);
      }, 700);
    } else {
      visualCoachStorageService.setLessonCompleted(currentLesson.id, totalSteps);
    }
  };

  // "הראה לי" (Show Me) Trigger
  const handleShowMe = () => {
    setIsShowMePlaying(true);
    setIsWhereToClickActive(true);
  };

  // "לא הבנתי" (I don't understand) Trigger
  const handleDontUnderstand = async () => {
    setIsAiLoading(true);
    setAiResponseTitle(isHe ? 'הסבר פשוט צעד-אחר-צעד' : 'Step-by-Step Simpler Explanation');
    setStepVerificationStatus('need_help');
    visualCoachStorageService.recordHelpRequest(currentLesson.id);

    try {
      const explanation = await visualLessonAiService.explainStepSimpler(
        currentLesson,
        currentStep,
        project,
        language
      );
      setAiResponseText(explanation);
    } catch {
      setAiResponseText(
        isHe
          ? 'בוא נפשט את זה: הסתכל על האזור המואר בתמונה (מסומן בירוק). כוון את הפרמטר לפי ההוראה והאזן לשינוי.'
          : 'Let us simplify: Look at the highlighted green area in the image. Set the parameter and listen to the change.'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // "למה?" (Why does it matter?) Trigger
  const handleWhyMatters = async () => {
    setIsAiLoading(true);
    setAiResponseTitle(isHe ? 'למה זה קריטי למיקס ולסאונד?' : 'Why is this critical for the mix?');

    try {
      const whyExplanation = await visualLessonAiService.explainWhyMatters(
        currentLesson,
        currentStep,
        project,
        language
      );
      setAiResponseText(whyExplanation);
    } catch {
      setAiResponseText(
        currentStep.why[language] ||
          currentStep.why.he ||
          'פעולה זו חיונית למניעת התנגשויות תדרים וליצירת גרוב הדוק.'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Custom AI Question Submit
  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestionText.trim()) return;

    setIsAiLoading(true);
    setAiResponseTitle(aiQuestionText);
    const userPrompt = aiQuestionText;
    setAiQuestionText('');

    const contextPrompt = `אתה מאמן מוזיקלי אישי של התלמיד בשיעור: "${currentLesson.title.he}", שלב ${activeStepIndex + 1}: "${currentStep.title.he}".
שאלת התלמיד: "${userPrompt}".
ענה בתמציתיות, באופן מקצועי, והפנה את תשומת ליבו לפרמטר בתמונה.`;

    try {
      const res = await aiService.chat(contextPrompt, {
        lessonId: currentLesson.id,
        stepIndex: activeStepIndex,
      });
      setAiResponseText(res.reply);
    } catch {
      setAiResponseText(
        isHe ? 'התחבר מחדש לשירות ה-AI לקבלת תשובה.' : 'Please reconnect to AI service.'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Challenge Mode Target Click Handler
  const handleChallengeTargetClick = (annotation: ScreenAnnotation, isHit: boolean) => {
    if (isHit) {
      setChallengeScore((prev) => prev + 100);
      handleCompleteStep();
    } else {
      visualCoachStorageService.recordMistake(currentLesson.id, currentStep.title.he);
    }
  };

  // Save Custom Lesson from Editor
  const handleSaveCustomLesson = (lesson: VisualLesson) => {
    visualCoachStorageService.saveCustomLesson(lesson);
    const updated = visualCoachStorageService.getCustomLessons();
    setCustomLessons(updated);
    setActiveLessonId(lesson.id);
    setIsEditorOpen(false);
  };

  return (
    <div
      className="flex flex-col h-full w-full bg-[#07090D] text-white font-sans select-none overflow-hidden"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      {/* ------------------------------------------------------------- */}
      {/* TOP APPLICATION HEADER */}
      {/* ------------------------------------------------------------- */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#0C0F15] border-b border-[#1C2330] shrink-0">
        {/* Left: Brand & Active Lesson Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#90FF00] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <div className="w-full h-full bg-[#0A0D14] rounded-[10px] flex items-center justify-center">
                <Eye size={18} className="text-[#00E5FF]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black tracking-tight text-white">
                  {isHe ? 'מאמן חזותי אינטראקטיבי' : 'Visual Ableton Coach'}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#90FF00]/15 text-[#90FF00] border border-[#90FF00]/30 uppercase">
                  Interactive Vision
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">
                {currentLesson.title[language] || currentLesson.title.he}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Interactive Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#121620] rounded-xl border border-[#202736]">
          <button
            type="button"
            onClick={() => setLearningMode('guided')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              learningMode === 'guided'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_12px_#00E5FF]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen size={13} />
            <span>{isHe ? 'מודרך (Guided)' : 'Guided'}</span>
          </button>

          <button
            type="button"
            onClick={() => setLearningMode('practice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              learningMode === 'practice'
                ? 'bg-[#90FF00] text-black shadow-[0_0_12px_#90FF00]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Compass size={13} />
            <span>{isHe ? 'תרגול (Practice)' : 'Practice'}</span>
          </button>

          <button
            type="button"
            onClick={() => setLearningMode('challenge')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              learningMode === 'challenge'
                ? 'bg-[#FF0055] text-white shadow-[0_0_12px_#FF0055]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Target size={13} />
            <span>{isHe ? 'אתגר (Challenge)' : 'Challenge'}</span>
          </button>
        </div>

        {/* Right: Lesson Creator / Editor & Screen Capture & Image Uploader */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsImageUploaderOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[#1F2937] hover:bg-[#374151] border border-[#4B5563] text-xs font-bold text-[#90FF00] flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Upload size={14} />
            <span>{isHe ? 'העלאת תמונה / דיאגרמה' : 'Upload Image'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingLesson(currentLesson);
              setIsEditorOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-[#9D4EDD] hover:bg-[#B060FF] text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(157,78,221,0.3)] transition-all"
          >
            <Plus size={14} />
            <span>{isHe ? 'ערוך שיעור זה בסטודיו' : 'Edit in Studio'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCaptureModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[#18202E] hover:bg-[#222C40] border border-[#2E3B52] text-xs font-bold text-gray-300 hover:text-[#00E5FF] flex items-center gap-1.5 transition-colors"
          >
            <Camera size={14} />
            <span>{isHe ? 'לכידת מסך' : 'Capture Screen'}</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* CATEGORY & LESSON SELECTOR BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="px-6 py-2 bg-[#0A0D12] border-b border-[#1A212E] flex items-center justify-between overflow-x-auto gap-4 shrink-0">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5">
          {VISUAL_COURSE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                const firstInCat = allLessons.find((l) => l.category === cat.id);
                if (firstInCat) setActiveLessonId(firstInCat.id);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#00E5FF] text-black shadow-[0_0_12px_#00E5FF]'
                  : 'bg-[#121620] text-gray-400 hover:text-white border border-[#20293A]'
              }`}
            >
              {cat.name[language] || cat.name.he}
            </button>
          ))}

          {/* Custom Lessons Tab */}
          <button
            type="button"
            onClick={() => setSelectedCategory('custom')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
              selectedCategory === 'custom'
                ? 'bg-[#9D4EDD] text-white shadow-[0_0_12px_#9D4EDD]'
                : 'bg-[#121620] text-gray-400 hover:text-white border border-[#20293A]'
            }`}
          >
            <span>{isHe ? 'שיעורים מותאמים אישית' : 'My Lessons'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
              {customLessons.length}
            </span>
          </button>
        </div>

        {/* Lesson dropdown switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-bold whitespace-nowrap">
            {isHe ? 'בחר שיעור:' : 'Lesson:'}
          </span>
          <select
            value={activeLessonId}
            onChange={(e) => setActiveLessonId(e.target.value)}
            className="px-3 py-1 rounded-lg bg-[#141A26] border border-[#253044] text-xs font-bold text-white outline-none focus:border-[#00E5FF] max-w-[260px] truncate"
          >
            {filteredLessons.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title[language] || l.title.he}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN LEARNING STAGE: 70% IMAGE CANVAS | 30% INSTRUCTION SIDEBAR */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* LEFT / CENTER: THE INTERACTIVE IMAGE VIEWER STAGE (70%) */}
        <div className="flex-1 flex flex-col min-w-0">
          <VisualLessonViewer
            step={currentStep}
            project={project}
            learningMode={learningMode}
            language={language}
            isSpotlightEnabled={isSpotlightEnabled}
            onToggleSpotlight={() => setIsSpotlightEnabled(!isSpotlightEnabled)}
            isWhereToClickActive={isWhereToClickActive}
            isShowMePlaying={isShowMePlaying}
            onShowMeComplete={() => setIsShowMePlaying(false)}
            onTargetClick={handleChallengeTargetClick}
            className="flex-1"
          />

          {/* Bottom Step Progress Bar */}
          <div className="mt-3 px-4 py-2 bg-[#0E121A] rounded-xl border border-[#1E2636] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold">
                {isHe ? 'התקדמות בשיעור:' : 'Lesson Progress:'}
              </span>
              <div className="flex items-center gap-1.5">
                {currentLesson.steps.map((st, idx) => {
                  const isCompleted = currentLessonProgress.completedStepIndexes?.includes(idx);
                  const isCurrent = idx === activeStepIndex;
                  return (
                    <button
                      key={st.id || idx}
                      type="button"
                      onClick={() => setActiveStepIndex(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#90FF00] text-black shadow-[0_0_12px_#90FF00]'
                          : isCompleted
                          ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                          : 'bg-[#161C28] text-gray-400 hover:text-white'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next / Previous Step Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex(activeStepIndex - 1)}
                className="px-3 py-1.5 rounded-lg bg-[#18202E] text-gray-300 hover:text-white text-xs font-bold disabled:opacity-30 transition-colors"
              >
                {isHe ? '← שלב קודם' : 'Previous'}
              </button>
              <button
                type="button"
                disabled={activeStepIndex === totalSteps - 1}
                onClick={() => setActiveStepIndex(activeStepIndex + 1)}
                className="px-3 py-1.5 rounded-lg bg-[#18202E] text-gray-300 hover:text-white text-xs font-bold disabled:opacity-30 transition-colors"
              >
                {isHe ? 'שלב הבא →' : 'Next'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: PERSISTENT INSTRUCTION SIDEBAR (30%) */}
        <aside className="w-[380px] flex flex-col bg-[#0C1017] rounded-xl border border-[#1E2636] overflow-hidden shadow-2xl shrink-0">
          {/* Instruction Panel Header */}
          <div className="p-4 bg-[#111622] border-b border-[#222C3E] shrink-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-[#90FF00] tracking-wider uppercase">
                {isHe ? `שלב ${activeStepIndex + 1} // ${totalSteps}` : `STEP ${activeStepIndex + 1} // ${totalSteps}`}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#222C3E] text-gray-300 font-mono">
                {currentLesson.difficulty}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white leading-tight">
              {currentStep.title[language] || currentStep.title.he}
            </h3>
          </div>

          {/* Instruction Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 1. Main Action Instruction */}
            <div className="p-3.5 bg-[#131926] rounded-xl border border-[#253248]">
              <div className="text-xs text-gray-400 font-bold mb-1 flex items-center gap-1.5">
                <Compass size={14} className="text-[#00E5FF]" />
                <span>{isHe ? 'מה עושים עכשיו:' : 'Instruction:'}</span>
              </div>
              <p className="text-sm text-gray-100 font-medium leading-relaxed">
                {currentStep.instruction[language] || currentStep.instruction.he}
              </p>

              {/* Exact Parameter Setting */}
              <div className="mt-3 p-2.5 bg-[#090C12] rounded-lg border border-[#00E5FF]/30 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-bold">
                  {isHe ? 'ערך מומלץ:' : 'Recommended:'}
                </span>
                <span className="text-xs font-mono font-bold text-[#00E5FF]">
                  {currentStep.exactAction[language] || currentStep.exactAction.he}
                </span>
              </div>
            </div>

            {/* 2. Expected Result */}
            <div className="p-3 bg-[#111722] rounded-xl border border-[#202B3C]">
              <div className="text-xs text-gray-400 font-bold mb-1 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#90FF00]" />
                <span>{isHe ? 'התוצאה הצפויה:' : 'Expected Result:'}</span>
              </div>
              <p className="text-xs text-gray-300 leading-snug">
                {currentStep.expectedResult[language] || currentStep.expectedResult.he}
              </p>
            </div>

            {/* 3. Pro Tip (if available) */}
            {currentStep.proTip && (
              <div className="p-3 bg-[#181810] rounded-xl border border-[#FFB800]/30">
                <div className="text-xs text-[#FFB800] font-bold mb-1 flex items-center gap-1.5">
                  <Lightbulb size={14} />
                  <span>{isHe ? 'טיפ מקצועי:' : 'Pro Tip:'}</span>
                </div>
                <p className="text-xs text-gray-300 leading-snug">
                  {currentStep.proTip[language] || currentStep.proTip.he}
                </p>
              </div>
            )}

            {/* 4. AI Explanation Response Card (When "למה?" or "לא הבנתי" clicked) */}
            <AnimatePresence>
              {(isAiLoading || aiResponseText) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 bg-[#171D2B] rounded-xl border border-[#90FF00]/40 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-[#90FF00] flex items-center gap-1.5">
                      <Sparkles size={14} className={isAiLoading ? 'animate-spin' : ''} />
                      <span>{aiResponseTitle || (isHe ? 'מאמן AI מסביר:' : 'AI Coach:')}</span>
                    </div>
                    {!isAiLoading && (
                      <button
                        type="button"
                        onClick={() => setAiResponseText(null)}
                        className="text-gray-400 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {isAiLoading ? (
                    <div className="text-xs text-gray-400 animate-pulse">
                      {isHe ? 'AI מנתח ומנסח הסבר מותאם...' : 'AI generating tailored explanation...'}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-line">
                      {aiResponseText}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons: "הראה לי", "לא הבנתי", "למה?", "הבנתי/בוצע" */}
          <div className="p-4 bg-[#111622] border-t border-[#222C3E] space-y-2.5 shrink-0">
            <div className="grid grid-cols-3 gap-2">
              {/* Button 1: הראה לי (Show Me) */}
              <button
                type="button"
                onClick={handleShowMe}
                title={isHe ? 'הנפש חץ ומיקום מדויק' : 'Animate pointer to target'}
                className="px-2 py-2 rounded-lg bg-[#182130] hover:bg-[#222D42] border border-[#2B3850] text-xs font-bold text-[#00E5FF] flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
              >
                <Play size={14} />
                <span>{isHe ? 'הראה לי' : 'Show Me'}</span>
              </button>

              {/* Button 2: לא הבנתי (I don't understand) */}
              <button
                type="button"
                onClick={handleDontUnderstand}
                title={isHe ? 'הסבר פשוט יותר במילים קלות' : 'Explain simpler'}
                className="px-2 py-2 rounded-lg bg-[#182130] hover:bg-[#222D42] border border-[#2B3850] text-xs font-bold text-[#FFB800] flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
              >
                <HelpCircle size={14} />
                <span>{isHe ? 'לא הבנתי' : 'Simpler'}</span>
              </button>

              {/* Button 3: למה? (Why?) */}
              <button
                type="button"
                onClick={handleWhyMatters}
                title={isHe ? 'הסבר חשיבות מוזיקלית ומבנית' : 'Why it matters'}
                className="px-2 py-2 rounded-lg bg-[#182130] hover:bg-[#222D42] border border-[#2B3850] text-xs font-bold text-[#9D4EDD] flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
              >
                <Lightbulb size={14} />
                <span>{isHe ? 'למה?' : 'Why?'}</span>
              </button>
            </div>

            {/* Primary Action Button: "✓ הבנתי, בוצע!" */}
            <button
              type="button"
              onClick={handleCompleteStep}
              className="w-full py-2.5 rounded-xl bg-[#90FF00] hover:bg-[#A6FF2E] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(144,255,0,0.35)] transition-all active:scale-98"
            >
              <Check size={18} strokeWidth={3} />
              <span>{isHe ? '✓ כן, בוצע! המשך לשלב הבא' : '✓ Done! Next Step'}</span>
            </button>

            {/* Quick AI Question Input */}
            <form onSubmit={handleAskAI} className="relative mt-2">
              <input
                type="text"
                value={aiQuestionText}
                onChange={(e) => setAiQuestionText(e.target.value)}
                placeholder={isHe ? 'שאל את מאמן ה-AI שאלה על שלב זה...' : 'Ask AI coach a question...'}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0A0D14] border border-[#253044] text-xs text-white placeholder-gray-500 outline-none focus:border-[#90FF00]"
              />
              <button
                type="submit"
                disabled={!aiQuestionText.trim()}
                className="absolute inset-inline-end-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#90FF00] disabled:opacity-30"
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VISUAL LESSON EDITOR MODAL (CREATOR STUDIO) */}
      {/* ------------------------------------------------------------- */}
      {isEditorOpen && (
        <VisualLessonEditor
          initialLesson={editingLesson}
          project={project}
          language={language}
          onSaveLesson={handleSaveCustomLesson}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* IMAGE & DIAGRAM UPLOADER MODAL */}
      {/* ------------------------------------------------------------- */}
      {isImageUploaderOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <ImageUploader
              project={project}
              language={language}
              onClose={() => setIsImageUploaderOpen(false)}
              onImageUploaded={(img) => {
                setCustomLessons(visualCoachStorageService.getCustomLessons());
              }}
              onCreateLessonWithImage={(newLesson) => {
                setIsImageUploaderOpen(false);
                setEditingLesson(newLesson);
                setIsEditorOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SCREEN CAPTURE MODAL */}
      {/* ------------------------------------------------------------- */}
      {isCaptureModalOpen && (
        <LiveScreenCaptureModal
          isOpen={isCaptureModalOpen}
          onClose={() => setIsCaptureModalOpen(false)}
          onCapture={(dataUrl) => {
            setCustomScreenshotUri(dataUrl);
            visualCoachStorageService.saveScreenshot(currentLesson.id, dataUrl);
            setIsCaptureModalOpen(false);
          }}
          language={language}
          lessonTitle={currentLesson.title[language] || currentLesson.title.he}
        />
      )}
    </div>
  );
};
