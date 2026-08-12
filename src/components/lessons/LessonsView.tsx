import React from 'react';
import {
  GraduationCap,
  Play,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Download,
  HelpCircle,
  Award,
  Sparkles
} from 'lucide-react';
import { COURSES_DATA } from '../../data/coursesData';
import { Course, Lesson, LessonStep } from '../../types';
import { audioService } from '../../services/audioService';
import { midiService } from '../../services/midiService';
import { useLanguage } from '../../context/LanguageContext';

interface LessonsViewProps {
  onOpenCoach: () => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({ onOpenCoach }) => {
  const { t } = useLanguage();
  const [selectedCourse, setSelectedCourse] = React.useState<Course>(COURSES_DATA[0]);
  const [selectedLesson, setSelectedLesson] = React.useState<Lesson>(COURSES_DATA[0].lessons[0]);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = React.useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = React.useState(false);

  const step: LessonStep = selectedLesson.steps[currentStepIndex] || selectedLesson.steps[0];

  const handleNextStep = () => {
    if (currentStepIndex < selectedLesson.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handlePlayAudio = () => {
    if (step.audioExampleType === 'kick') {
      audioService.playKick(0);
    } else if (step.audioExampleType === 'psybass') {
      audioService.playPsyBassNote('F#1', 0, 0.18);
      audioService.playPsyBassNote('F#1', 0.18, 0.18);
      audioService.playPsyBassNote('F#1', 0.36, 0.18);
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
      name: `${selectedLesson.title.replace(/[^a-zA-Z0-9]/g, '_')}_Lesson_Pattern`,
      type: 'bassline' as const,
      genre: selectedCourse.genre,
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-[#E0E0E0] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A1A1A] border border-[#333] p-5 rounded-lg">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#90FF00] uppercase tracking-widest font-mono">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t('lessons.banner')}</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">{selectedCourse.title}</h1>
          <p className="text-xs text-[#888] mt-0.5">{selectedCourse.subtitle}</p>
        </div>

        {/* Course Picker Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedCourse.id}
            onChange={(e) => {
              const c = COURSES_DATA.find((item) => item.id === e.target.value);
              if (c) {
                setSelectedCourse(c);
                setSelectedLesson(c.lessons[0]);
                setCurrentStepIndex(0);
              }
            }}
            className="bg-[#121212] border border-[#333] text-white text-xs rounded px-3 py-2 font-medium focus:outline-none focus:border-[#90FF00] cursor-pointer"
          >
            {COURSES_DATA.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.genre})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Lessons Sidebar + Interactive Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Course Lesson Index */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 space-y-3 h-fit">
          <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-widest px-1">
            {t('lessons.syllabus')}
          </h3>

          <div className="space-y-1.5">
            {selectedCourse.lessons.map((les, index) => {
              const isActive = selectedLesson.id === les.id;
              return (
                <button
                  key={les.id}
                  onClick={() => {
                    setSelectedLesson(les);
                    setCurrentStepIndex(0);
                    setShowQuizResults(false);
                  }}
                  className={`w-full text-left p-3 rounded transition-colors cursor-pointer border ${
                    isActive
                      ? 'bg-[#252525] border-[#90FF00] text-white font-bold'
                      : 'bg-[#121212] border-[#2A2A2A] text-[#888] hover:text-[#E0E0E0] hover:bg-[#181818]'
                  }`}
                >
                  <div className="text-[10px] font-mono text-[#90FF00]">{t('lessons.lesson')} {index + 1}</div>
                  <div className="text-xs font-bold line-clamp-1 mt-0.5">{les.title}</div>
                  <div className="text-[10px] text-[#666] mt-1 flex items-center justify-between">
                    <span>{les.durationMinutes} {t('lessons.mins')}</span>
                    <span className="capitalize">{les.difficulty}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step-by-Step Lesson Runner */}
        <div className="lg:col-span-3 bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Step Header */}
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <div>
                <span className="text-[10px] font-bold font-mono text-[#90FF00] bg-[#121212] border border-[#333] px-2.5 py-1 rounded">
                  {t('lessons.stepOf', { current: currentStepIndex + 1, total: selectedLesson.steps.length })}
                </span>
                <h2 className="text-lg font-bold text-white mt-2">{step.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayAudio}
                  className="bg-[#252525] hover:bg-[#333] text-[#90FF00] border border-[#444] px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{t('lessons.listenAudio')}</span>
                </button>

                <button
                  onClick={handleExportLessonMidi}
                  className="bg-[#252525] hover:bg-[#333] text-[#00E5FF] border border-[#444] px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t('lessons.exportMidi')}</span>
                </button>
              </div>
            </div>

            {/* Markdown Content & Instructions */}
            <div className="space-y-4">
              <div className="bg-[#121212] p-4 rounded border border-[#2A2A2A] text-[#CCC] text-xs leading-relaxed whitespace-pre-line font-sans">
                {step.contentMarkdown}
              </div>

              {/* Exact Ableton Menu Path Box */}
              <div className="bg-[#121212] border border-[#333] p-3.5 rounded flex items-start gap-3">
                <div className="w-7 h-7 rounded bg-[#252525] text-[#90FF00] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#90FF00] uppercase tracking-wider font-mono">
                    {t('lessons.actionInstruction')}
                  </div>
                  <div className="text-xs text-[#E0E0E0] mt-1 font-mono bg-[#181818] p-2 rounded border border-[#2A2A2A]">
                    {step.abletonInstruction}
                  </div>
                </div>
              </div>

              {/* Highlight Parameters Grid */}
              {step.parameterHighlights && step.parameterHighlights.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {step.parameterHighlights.map((ph, idx) => (
                    <div key={idx} className="bg-[#121212] p-3 rounded border border-[#2A2A2A]">
                      <div className="text-[10px] text-[#666] font-mono uppercase">{ph.param}</div>
                      <div className="text-xs font-bold font-mono text-[#90FF00] mt-0.5">{ph.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quiz Section if available at last step */}
            {currentStepIndex === selectedLesson.steps.length - 1 && selectedLesson.quiz && (
              <div className="mt-6 pt-5 border-t border-[#2A2A2A] space-y-4">
                <div className="flex items-center gap-2 text-[#90FF00] font-bold text-xs uppercase tracking-wider font-mono">
                  <Award className="w-4 h-4" />
                  <span>{t('lessons.quizTitle')}</span>
                </div>

                {selectedLesson.quiz.map((q, qIdx) => (
                  <div key={qIdx} className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] space-y-2.5">
                    <p className="text-xs font-bold text-white">{q.question}</p>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedQuizAnswers[qIdx] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => setSelectedQuizAnswers({ ...selectedQuizAnswers, [qIdx]: optIdx })}
                            className={`w-full text-left p-2.5 rounded text-xs transition-colors cursor-pointer border ${
                              isSelected
                                ? 'bg-[#252525] border-[#90FF00] text-[#90FF00] font-bold'
                                : 'bg-[#181818] border-[#2A2A2A] text-[#AAA] hover:bg-[#202020]'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {selectedQuizAnswers[qIdx] !== undefined && (
                      <div
                        className={`p-2.5 rounded text-xs font-mono border ${
                          selectedQuizAnswers[qIdx] === q.correctIndex
                            ? 'bg-[#102010] text-[#90FF00] border-[#90FF00]/40'
                            : 'bg-[#201010] text-[#FF3366] border-[#FF3366]/40'
                        }`}
                      >
                        {selectedQuizAnswers[qIdx] === q.correctIndex
                          ? '✓ Correct! ' + q.explanation
                          : '✕ Incorrect. ' + q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Step Controls */}
          <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-4 mt-5">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded transition-colors ${
                currentStepIndex === 0
                  ? 'opacity-30 cursor-not-allowed text-[#666]'
                  : 'bg-[#252525] hover:bg-[#333] text-white cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('lessons.prevStep')}</span>
            </button>

            <button
              onClick={onOpenCoach}
              className="text-xs text-[#90FF00] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>{t('lessons.askAiCoach')}</span>
            </button>

            <button
              onClick={handleNextStep}
              disabled={currentStepIndex === selectedLesson.steps.length - 1}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded transition-colors ${
                currentStepIndex === selectedLesson.steps.length - 1
                  ? 'opacity-30 cursor-not-allowed text-[#666]'
                  : 'bg-[#90FF00] hover:bg-[#80e600] text-black cursor-pointer'
              }`}
            >
              <span>{t('lessons.nextStep')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
