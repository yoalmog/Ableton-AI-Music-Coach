import React, { useState } from 'react';
import { Headphones, CheckCircle2, XCircle, HelpCircle, Volume2, Award } from 'lucide-react';
import { EAR_TRAINING_EXERCISES } from '../../data/theoryAndEarData';
import { audioService } from '../../services/audioService';

export const EarTrainingView: React.FC = () => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [playingState, setPlayingState] = useState<'A' | 'B' | null>(null);

  const currentEx = EAR_TRAINING_EXERCISES[exerciseIndex];

  const handlePlaySample = (mode: 'A' | 'B') => {
    setPlayingState(mode);
    audioService.playEarTrainingSample(currentEx.type, mode);
    setTimeout(() => setPlayingState(null), 1800);
  };

  const handleSelectOption = (idx: number) => {
    if (selectedOptionIndex !== null) return; // already answered
    setSelectedOptionIndex(idx);
    if (currentEx.options[idx].isCorrect) {
      setScore((prev) => prev + 100);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptionIndex(null);
    setShowHint(false);
    setExerciseIndex((prev) => (prev + 1) % EAR_TRAINING_EXERCISES.length);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
      <div className="bg-[#181818] border border-[#333] p-5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Headphones className="w-5 h-5 text-[#00E5FF]" />
            <h1 className="text-xl font-bold text-white">Ear Training & Listening Exercises</h1>
          </div>
          <p className="text-xs text-[#AAA]">
            Train your ears to recognize EQ mud, sidechain compression pumping, stereo mono compatibility, and distortion with real Web Audio synthesis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#121212] border border-[#333] px-3.5 py-1.5 rounded text-right">
            <span className="text-[9px] font-mono text-[#888] block">STREAK</span>
            <span className="text-sm font-mono font-bold text-[#00E5FF]">{streak} 🔥</span>
          </div>
          <div className="bg-[#121212] border border-[#333] px-4 py-2 rounded text-right">
            <span className="text-[10px] font-mono text-[#888] block">TOTAL SCORE</span>
            <span className="text-lg font-mono font-bold text-[#90FF00]">{score} XP</span>
          </div>
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

        {/* Real Audio A/B Buttons */}
        <div className="bg-[#121212] border border-[#2A2A2A] rounded p-4 space-y-2">
          <div className="text-[10px] font-mono text-[#888] uppercase tracking-wider font-bold">
            Real Audio Comparison (Web Audio Synthesis)
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handlePlaySample('A')}
              className={`py-3 px-4 rounded border font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                playingState === 'A'
                  ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'bg-[#1D1D1D] hover:bg-[#252525] text-[#00E5FF] border-[#333]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>LISTEN TO SAMPLE A</span>
            </button>

            <button
              onClick={() => handlePlaySample('B')}
              className={`py-3 px-4 rounded border font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                playingState === 'B'
                  ? 'bg-[#90FF00] text-black border-[#90FF00] shadow-[0_0_10px_rgba(144,255,0,0.4)]'
                  : 'bg-[#1D1D1D] hover:bg-[#252525] text-[#90FF00] border-[#333]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>LISTEN TO SAMPLE B</span>
            </button>
          </div>
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
