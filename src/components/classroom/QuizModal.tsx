import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, Award, ArrowRight } from 'lucide-react';
import { LessonQuizQuestion } from '../../types/classroom';
import { useLanguage } from '../../context/LanguageContext';

interface QuizModalProps {
  isOpen: boolean;
  questions: LessonQuizQuestion[];
  onComplete: (scorePercentage: number) => void;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  questions,
  onComplete,
  onClose
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const { language, isRTL } = useLanguage();

  if (!isOpen || !questions || questions.length === 0) return null;

  const currentQ = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      const finalScore = Math.round((correctCount / questions.length) * 100);
      onComplete(finalScore);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="bg-[#1A1A1A] border border-[#333] rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white text-sm">
              {language === 'he' ? 'בוחן סיכום שיעור' : 'Lesson Quiz Verification'} ({currentIdx + 1}/{questions.length})
            </span>
          </div>
          <span className="text-xs text-[#888] font-mono">XP +50</span>
        </div>

        <div className="text-sm font-semibold text-gray-100">
          {language === 'he' ? currentQ.questionHe : currentQ.question}
        </div>

        <div className="space-y-2">
          {(language === 'he' ? currentQ.optionsHe : currentQ.options).map((opt, idx) => {
            const isChosen = selectedOpt === idx;
            const isCorrect = idx === currentQ.correctIndex;
            let btnClass = 'bg-[#222] border-[#333] text-gray-200 hover:border-[#444]';

            if (isAnswered) {
              if (isCorrect) {
                btnClass = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold';
              } else if (isChosen) {
                btnClass = 'bg-red-500/20 border-red-400 text-red-300';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={`w-full p-3 rounded-lg border text-left text-xs transition flex items-center justify-between ${btnClass}`}
              >
                <span>{opt}</span>
                {isAnswered && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                {isAnswered && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="p-3 bg-[#141414] border border-[#2B2B2B] rounded-lg text-xs text-[#BBB]">
            <span className="font-bold text-amber-400 block mb-1">
              {language === 'he' ? 'הסבר:' : 'Explanation:'}
            </span>
            {language === 'he' ? currentQ.explanationHe : currentQ.explanation}
          </div>
        )}

        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition"
          >
            {currentIdx < questions.length - 1
              ? (language === 'he' ? 'לשאלה הבאה' : 'Next Question')
              : (language === 'he' ? 'סים בוחן וקבל XP' : 'Finish Quiz & Claim XP')}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
