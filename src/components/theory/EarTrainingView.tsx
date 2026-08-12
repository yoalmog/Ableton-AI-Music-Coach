import React, { useState } from 'react';
import { Headphones, CheckCircle2, XCircle, HelpCircle, RotateCcw, Award } from 'lucide-react';
import { EAR_TRAINING_EXERCISES, EarTrainingExercise } from '../../data/theoryAndEarData';

export const EarTrainingView: React.FC = () => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const currentEx = EAR_TRAINING_EXERCISES[exerciseIndex];

  const handleSelectOption = (idx: number) => {
    if (selectedOptionIndex !== null) return; // already answered
    setSelectedOptionIndex(idx);
    if (currentEx.options[idx].isCorrect) {
      setScore((prev) => prev + 100);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptionIndex(null);
    setShowHint(false);
    setExerciseIndex((prev) => (prev + 1) % EAR_TRAINING_EXERCISES.length);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
      <div className="bg-[#181818] border border-[#333] p-5 rounded-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Headphones className="w-5 h-5 text-[#00E5FF]" />
            <h1 className="text-xl font-bold text-white">Ear Training & Listening Exercises</h1>
          </div>
          <p className="text-xs text-[#AAA]">
            Train your ears to recognize EQ mud, sidechain compression pumping, stereo mono compatibility, and distortion.
          </p>
        </div>

        <div className="bg-[#121212] border border-[#333] px-4 py-2 rounded text-right">
          <span className="text-[10px] font-mono text-[#888] block">TOTAL SCORE</span>
          <span className="text-lg font-mono font-bold text-[#90FF00]">{score} XP</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-[#181818] border border-[#333] rounded-lg p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#333] pb-3">
          <span className="text-xs font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30">
            QUESTION {exerciseIndex + 1} OF {EAR_TRAINING_EXERCISES.length} — {currentEx.type}
          </span>
          <span className="text-xs text-[#888] font-mono">{currentEx.title}</span>
        </div>

        <h3 className="text-sm font-bold text-white leading-relaxed">{currentEx.questionText}</h3>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentEx.options.map((opt, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isAnswered = selectedOptionIndex !== null;

            let btnStyle = 'bg-[#121212] border-[#333] text-[#CCC] hover:bg-[#202020]';
            if (isAnswered) {
              if (opt.isCorrect) {
                btnStyle = 'bg-[#90FF00]/10 border-[#90FF00] text-[#90FF00] font-bold';
              } else if (isSelected) {
                btnStyle = 'bg-[#FF5555]/10 border-[#FF5555] text-[#FF5555] font-bold';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full p-3.5 rounded border text-xs text-left transition-colors cursor-pointer flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt.label}</span>
                {isAnswered && (
                  <span>
                    {opt.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-[#90FF00]" />
                    ) : isSelected ? (
                      <XCircle className="w-4 h-4 text-[#FF5555]" />
                    ) : null}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Explanation */}
        {selectedOptionIndex !== null && (
          <div className="p-4 bg-[#121212] border-l-4 border-[#90FF00] rounded text-xs text-[#CCC] space-y-1">
            <strong className="text-[#90FF00] block font-mono">
              {currentEx.options[selectedOptionIndex].isCorrect ? 'Correct!' : 'Incorrect'}
            </strong>
            <p>{currentEx.options[selectedOptionIndex].explanation}</p>
          </div>
        )}

        {/* Footer Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-[#333]">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? currentEx.hint : 'Need a hint?'}</span>
          </button>

          <button
            onClick={handleNextQuestion}
            className="px-4 py-2 bg-[#90FF00] hover:bg-[#a6ff26] text-black font-bold text-xs rounded transition-colors cursor-pointer"
          >
            NEXT QUESTION
          </button>
        </div>
      </div>
    </div>
  );
};
