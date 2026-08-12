import React from 'react';
import { HelpCircle, CheckCircle, XCircle, Award, RefreshCw } from 'lucide-react';
import { QuizQuestion, UserLessonProgress } from '../../types';
import { lessonStorageService } from '../../services/lessonStorageService';
import { useLanguage } from '../../context/LanguageContext';

interface QuizModuleProps {
  lessonId: string;
  quizQuestions: QuizQuestion[];
  onQuizCompleted?: (score: number) => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({
  lessonId,
  quizQuestions,
  onQuizCompleted,
}) => {
  const { t } = useLanguage();
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, number>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [progress, setProgress] = React.useState<UserLessonProgress>(
    lessonStorageService.getLessonProgress(lessonId)
  );

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const res = lessonStorageService.submitQuizAttempt(
      lessonId,
      selectedAnswers,
      quizQuestions.length,
      correctCount
    );

    setSubmitted(true);
    setProgress(res.progress);
    if (onQuizCompleted) {
      onQuizCompleted(res.scorePercentage);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const currentScorePercentage = React.useMemo(() => {
    if (!submitted) return null;
    let correct = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) correct++;
    });
    return Math.round((correct / Math.max(1, quizQuestions.length)) * 100);
  }, [submitted, quizQuestions, selectedAnswers]);

  return (
    <div className="bg-[#181818] border border-[#333] rounded-lg p-5 space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#00E5FF]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {t('lessons.quizTitle')}
          </h3>
        </div>

        {progress.quizBestScore !== undefined && (
          <div className="flex items-center gap-1.5 bg-[#252525] border border-[#444] px-2.5 py-1 rounded text-xs font-mono text-[#90FF00]">
            <Award className="w-3.5 h-3.5" />
            <span>Best Score: {progress.quizBestScore}%</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {quizQuestions.map((q, qIdx) => {
          const selected = selectedAnswers[qIdx];
          const isCorrect = submitted && selected === q.correctIndex;

          return (
            <div key={q.id || qIdx} className="bg-[#121212] p-4 rounded border border-[#2A2A2A] space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-xs font-mono font-bold text-[#00E5FF] shrink-0">
                  Q{qIdx + 1}.
                </span>
                <p className="text-xs font-bold text-white">{q.question}</p>
              </div>

              <div className="space-y-1.5 pl-5">
                {q.options.map((opt, optIdx) => {
                  let optStyle = 'bg-[#1A1A1A] border-[#333] text-[#CCC] hover:border-[#555]';
                  if (selected === optIdx) {
                    optStyle = 'bg-[#2A2A2A] border-[#00E5FF] text-white font-semibold';
                  }

                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      optStyle = 'bg-[#122A12] border-[#90FF00] text-[#90FF00] font-bold';
                    } else if (selected === optIdx) {
                      optStyle = 'bg-[#2A1212] border-[#FF4444] text-[#FF8888]';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`w-full text-left p-2.5 rounded text-xs border transition-colors flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {submitted && optIdx === q.correctIndex && (
                        <CheckCircle className="w-3.5 h-3.5 text-[#90FF00] shrink-0" />
                      )}
                      {submitted && selected === optIdx && optIdx !== q.correctIndex && (
                        <XCircle className="w-3.5 h-3.5 text-[#FF4444] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="bg-[#1A1A1A] p-2.5 rounded border border-[#333] text-[11px] text-[#BBB] space-y-1">
                  <span className="font-bold text-[#90FF00]">Explanation:</span>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-3">
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmitQuiz}
            disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
            className="bg-[#90FF00] hover:bg-[#80e600] disabled:opacity-50 text-black font-bold px-4 py-2 rounded text-xs flex items-center gap-2 cursor-pointer transition-colors uppercase tracking-wider"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Submit Quiz Answers</span>
          </button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="text-xs font-mono">
              <span className="text-[#888]">Result: </span>
              <span className={`font-bold ${currentScorePercentage! >= 70 ? 'text-[#90FF00]' : 'text-[#FF8888]'}`}>
                {currentScorePercentage}%
              </span>
            </div>

            <button
              type="button"
              onClick={handleRetakeQuiz}
              className="bg-[#252525] hover:bg-[#333] text-[#00E5FF] border border-[#444] px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
