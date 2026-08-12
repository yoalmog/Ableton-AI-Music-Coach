import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Volume2,
  Download,
  HelpCircle,
  Award,
  Sparkles,
  Bookmark,
  CheckSquare,
  Square,
  FileText,
  Target,
  ArrowLeft,
  ArrowRight,
  WifiOff,
  CheckCircle,
  Keyboard,
  Music,
  BarChart2
} from 'lucide-react';
import { Lesson, Course, LessonStep, UserLessonProgress } from '../../types/lesson';
import { audioService } from '../../services/audioService';
import { midiService } from '../../services/midiService';
import { lessonStorageService } from '../../services/lessonStorageService';
import { InteractiveMidiPianoRoll } from './InteractiveMidiPianoRoll';
import { QuizModule } from './QuizModule';
import { useLanguage } from '../../context/LanguageContext';

interface LessonPlayerProps {
  lesson: Lesson;
  course: Course;
  onOpenCoach: () => void;
  onBackToLibrary?: () => void;
  onSelectNextLesson?: () => void;
  onSelectPrevLesson?: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  course,
  onOpenCoach,
  onBackToLibrary,
  onSelectNextLesson,
  onSelectPrevLesson,
}) => {
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'content' | 'objectives' | 'notes'>('content');
  const [userProgress, setUserProgress] = useState<UserLessonProgress>(
    lessonStorageService.getLessonProgress(lesson.id)
  );
  const [notesText, setNotesText] = useState<string>(userProgress.userNotes || '');

  // Reset or reload when lesson changes
  useEffect(() => {
    setCurrentStepIndex(0);
    const p = lessonStorageService.getLessonProgress(lesson.id);
    setUserProgress(p);
    setNotesText(p.userNotes || '');
  }, [lesson.id]);

  const steps = lesson.steps && lesson.steps.length > 0 ? lesson.steps : [];
  const currentStep: LessonStep | undefined = steps[currentStepIndex];

  const handleNextStep = () => {
    const updated = lessonStorageService.toggleStepCompletion(
      lesson.id,
      currentStepIndex,
      Math.max(1, steps.length)
    );
    setUserProgress(updated);

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else if (onSelectNextLesson) {
      onSelectNextLesson();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else if (onSelectPrevLesson) {
      onSelectPrevLesson();
    }
  };

  const handleToggleStepCompleted = (stepIdx: number) => {
    const updated = lessonStorageService.toggleStepCompletion(
      lesson.id,
      stepIdx,
      Math.max(1, steps.length)
    );
    setUserProgress(updated);
  };

  const handleToggleBookmark = () => {
    const isBookmarked = lessonStorageService.toggleBookmark(lesson.id);
    setUserProgress((prev) => ({ ...prev, isBookmarked }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNotesText(text);
    lessonStorageService.saveUserNotes(lesson.id, text);
  };

  const handlePlayAudio = () => {
    if (!currentStep) return;
    if (currentStep.audioExampleType === 'kick') {
      audioService.playKick(0);
    } else if (currentStep.audioExampleType === 'psybass') {
      audioService.playPsyBassNote('F#1', 0, 0.18);
      audioService.playPsyBassNote('F#1', 0.18, 0.18);
      audioService.playPsyBassNote('F#1', 0.36, 0.18);
    } else if (currentStep.audioExampleType === 'technorumble') {
      audioService.playKick(0);
      audioService.playPsyBassNote('C1', 0.12, 0.22);
    } else {
      audioService.playKick(0);
      audioService.playPsyBassNote('F#1', 0.15, 0.18);
      audioService.playHiHat(0.3, false);
    }
  };

  const handleExportLessonMidi = async () => {
    const notes = midiService.generatePsyBassline('K-B-B-B', 'F#', 142);
    const pattern = {
      id: `pat_${Date.now()}`,
      name: `${lesson.title.replace(/[^a-zA-Z0-9]/g, '_')}_Pattern`,
      type: 'bassline' as const,
      genre: course.genre,
      bpm: 142,
      key: 'F#' as const,
      scale: 'Minor' as const,
      timeSignature: '4/4',
      notes,
      createdAt: new Date().toISOString(),
    };
    await midiService.exportPattern(pattern);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Top Banner Navigation */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3">
          {onBackToLibrary && (
            <button
              type="button"
              onClick={onBackToLibrary}
              className="mt-1 bg-[#252525] hover:bg-[#333] text-[#AAA] hover:text-white p-2 rounded border border-[#444] transition-colors cursor-pointer shrink-0"
              title="Return to Library"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#90FF00] uppercase tracking-wider">
              <span>{course.title}</span>
              <span>•</span>
              <span className="text-[#00E5FF]">{course.genre}</span>
              {userProgress.isCompleted && (
                <span className="flex items-center gap-1 text-[#90FF00] font-bold bg-[#122A12] px-2 py-0.5 rounded border border-[#90FF00]/30 ml-2">
                  <CheckCircle className="w-3 h-3" />
                  <span>Topic Mastered</span>
                </span>
              )}
            </div>

            <h1 className="text-lg font-bold text-white mt-1">{lesson.title}</h1>
            {lesson.subtitle && <p className="text-xs text-[#AAA] mt-0.5">{lesson.subtitle}</p>}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`px-3 py-1.5 rounded border text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              userProgress.isBookmarked
                ? 'bg-[#252525] border-[#00E5FF] text-[#00E5FF]'
                : 'bg-[#121212] border-[#333] text-[#888] hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${userProgress.isBookmarked ? 'fill-current' : ''}`} />
            <span>{userProgress.isBookmarked ? 'Bookmarked' : 'Bookmark Topic'}</span>
          </button>

          <span className="text-xs font-mono font-bold text-[#90FF00] bg-[#121212] border border-[#333] px-3 py-1.5 rounded">
            Step {currentStepIndex + 1} of {Math.max(1, steps.length)}
          </span>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'content'
                ? 'bg-[#90FF00] text-black font-bold'
                : 'bg-[#252525] text-[#AAA] hover:text-white'
            }`}
          >
            Instructional Topic
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('objectives')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'objectives'
                ? 'bg-[#90FF00] text-black font-bold'
                : 'bg-[#252525] text-[#AAA] hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Objectives ({lesson.learningObjectives?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'bg-[#90FF00] text-black font-bold'
                : 'bg-[#252525] text-[#AAA] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Offline Production Notes</span>
          </button>
        </div>

        {/* Step Checkbox Selector List */}
        <div className="hidden lg:flex items-center gap-1">
          {steps.map((s, idx) => {
            const isCompleted = userProgress.completedStepIndexes.includes(idx);
            const isCurrent = currentStepIndex === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold cursor-pointer transition-all border ${
                  isCurrent
                    ? 'bg-[#90FF00] text-black border-[#90FF00]'
                    : isCompleted
                    ? 'bg-[#122A12] text-[#90FF00] border-[#90FF00]/40'
                    : 'bg-[#181818] text-[#777] border-[#333] hover:border-[#555]'
                }`}
                title={`Jump to Step ${idx + 1}: ${s.title}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content Area with Smooth Motion Transitions */}
      <AnimatePresence mode="wait">
        {activeTab === 'content' && (
          <motion.div
            key={`content-step-${currentStepIndex}`}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
            className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-5"
          >
            {/* Step Header */}
            {currentStep && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262626] pb-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleToggleStepCompleted(currentStepIndex)}
                    className="cursor-pointer text-[#90FF00]"
                    title="Toggle step completion"
                  >
                    {userProgress.completedStepIndexes.includes(currentStepIndex) ? (
                      <CheckSquare className="w-5 h-5 text-[#90FF00]" />
                    ) : (
                      <Square className="w-5 h-5 text-[#666] hover:text-[#90FF00]" />
                    )}
                  </button>
                  <h2 className="text-base font-bold text-white">
                    Step {currentStepIndex + 1}: {currentStep.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handlePlayAudio}
                    className="bg-[#252525] hover:bg-[#333] text-[#90FF00] border border-[#444] px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Audition Example</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportLessonMidi}
                    className="bg-[#252525] hover:bg-[#333] text-[#00E5FF] border border-[#444] px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export MIDI</span>
                  </button>
                </div>
              </div>
            )}

            {/* Markdown Text Description */}
            {currentStep?.contentMarkdown && (
              <div className="bg-[#121212] p-4 rounded border border-[#2A2A2A] text-[#CCC] text-xs leading-relaxed whitespace-pre-line font-sans">
                {currentStep.contentMarkdown}
              </div>
            )}

            {/* Content Array Render Fallback (for Lesson Content Block Schema) */}
            {lesson.content && lesson.content.length > 0 && (
              <div className="space-y-4">
                {lesson.content.map((block, bIdx) => (
                  <div key={bIdx} className="bg-[#121212] p-4 rounded border border-[#2A2A2A] space-y-2">
                    {block.title && <h4 className="text-xs font-bold text-[#90FF00]">{block.title}</h4>}
                    {block.textMarkdown && <p className="text-xs text-[#CCC]">{block.textMarkdown}</p>}
                    {block.abletonInstruction && (
                      <div className="text-xs text-[#E0E0E0] font-mono bg-[#181818] p-2 rounded border border-[#2A2A2A]">
                        {block.abletonInstruction}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Interactive MIDI Example Piano Roll */}
            {currentStep?.interactiveMidiExample && (
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider font-mono">
                  Interactive MIDI Example & Piano Roll
                </div>
                <InteractiveMidiPianoRoll
                  example={currentStep.interactiveMidiExample}
                  genre={course.genre}
                />
              </div>
            )}

            {/* Ableton Live 12 Action Instruction */}
            {currentStep?.abletonInstruction && (
              <div className="bg-[#121212] border border-[#333] p-3.5 rounded flex items-start gap-3">
                <div className="w-7 h-7 rounded bg-[#252525] text-[#90FF00] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-[#90FF00] uppercase tracking-wider font-mono">
                    Ableton Live 12 Menu Path & Setup
                  </div>
                  <div className="text-xs text-[#E0E0E0] font-mono bg-[#181818] p-2 rounded border border-[#2A2A2A]">
                    {currentStep.abletonInstruction}
                  </div>
                </div>
              </div>
            )}

            {/* Key Parameter Highlights */}
            {currentStep?.parameterHighlights && currentStep.parameterHighlights.length > 0 && (
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-[#666] uppercase tracking-wider font-mono">
                  Live 12 Key Parameter Settings
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {currentStep.parameterHighlights.map((ph, idx) => (
                    <div key={idx} className="bg-[#121212] p-3 rounded border border-[#2A2A2A] space-y-1">
                      <div className="text-[10px] text-[#888] font-mono uppercase">{ph.param}</div>
                      <div className="text-xs font-bold font-mono text-[#90FF00]">
                        {ph.value} {ph.unit ? `(${ph.unit})` : ''}
                      </div>
                      {ph.purpose && <p className="text-[10px] text-[#AAA]">{ph.purpose}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pro Tip & Live 12 Shortcut */}
            {currentStep?.proTip && (
              <div className="bg-[#181818] p-3 rounded border border-[#333] flex items-start gap-2.5">
                <Keyboard className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold text-[#00E5FF] uppercase font-mono">
                    Pro Tip {currentStep.shortcutKey ? `[${currentStep.shortcutKey}]` : ''}
                  </div>
                  <p className="text-xs text-[#BBB] mt-0.5">{currentStep.proTip}</p>
                </div>
              </div>
            )}

            {/* Quiz Module at final step */}
            {currentStepIndex === steps.length - 1 && lesson.quiz && (
              <div className="pt-4 border-t border-[#2A2A2A]">
                <QuizModule
                  lessonId={lesson.id}
                  quizQuestions={lesson.quiz}
                  onQuizCompleted={(score) => {
                    const p = lessonStorageService.getLessonProgress(lesson.id);
                    setUserProgress(p);
                  }}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 2: OBJECTIVES */}
        {activeTab === 'objectives' && (
          <motion.div
            key="objectives"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-3">
              <Target className="w-4 h-4 text-[#90FF00]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Learning Objectives for {lesson.title}
              </h3>
            </div>

            <div className="space-y-2.5">
              {lesson.learningObjectives?.map((obj, idx) => (
                <div key={obj.id || idx} className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-[#252525] text-[#90FF00] flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#1A1A1A] text-[#00E5FF] border border-[#333]">
                      {obj.category}
                    </span>
                    <p className="text-xs text-[#E0E0E0]">{obj.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: NOTES */}
        {activeTab === 'notes' && (
          <motion.div
            key="notes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00E5FF]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Offline Production Scratchpad
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#888]">Persisted in local device storage</span>
            </div>

            <textarea
              value={notesText}
              onChange={handleNotesChange}
              placeholder="Type your custom production notes, Live 12 synth patches, or workflow ideas for this topic..."
              rows={10}
              className="w-full bg-[#121212] border border-[#333] rounded p-3 text-xs text-[#E0E0E0] font-mono focus:outline-none focus:border-[#00E5FF]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Step Control Footer */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStepIndex === 0 && !onSelectPrevLesson}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded transition-colors ${
            currentStepIndex === 0 && !onSelectPrevLesson
              ? 'opacity-30 cursor-not-allowed text-[#666]'
              : 'bg-[#252525] hover:bg-[#333] text-white cursor-pointer'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{currentStepIndex > 0 ? 'Previous Step' : 'Previous Topic'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenCoach}
          className="text-xs text-[#90FF00] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>Ask AI Coach regarding this step</span>
        </button>

        <button
          type="button"
          onClick={handleNextStep}
          className="bg-[#90FF00] hover:bg-[#80e600] text-black font-bold px-4 py-2 rounded text-xs flex items-center gap-2 cursor-pointer transition-colors"
        >
          <span>
            {currentStepIndex < steps.length - 1 ? 'Next Step' : 'Complete Topic'}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
