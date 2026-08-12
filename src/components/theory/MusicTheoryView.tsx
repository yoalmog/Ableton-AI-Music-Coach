import React, { useState } from 'react';
import { BookOpen, Volume2, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { THEORY_TOPICS, TheoryTopic } from '../../data/theoryAndEarData';
import { audioService } from '../../services/audioService';
import { useLanguage } from '../../context/LanguageContext';

interface MusicTheoryViewProps {
  onOpenCoachWithMessage: (msg: string) => void;
}

export const MusicTheoryView: React.FC<MusicTheoryViewProps> = ({ onOpenCoachWithMessage }) => {
  const { t, language } = useLanguage();
  const isHe = language === 'he';
  const translate = React.useCallback((key: string) => (t ? t(key) : key), [t]);

  const [selectedTopic, setSelectedTopic] = useState<TheoryTopic>(THEORY_TOPICS[0]);

  const handlePlayNotes = (notes: string[]) => {
    notes.forEach((noteStr, idx) => {
      audioService.playPsyBassNote(noteStr, idx * 0.3, 0.25);
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="bg-[#181818] border border-[#333] p-5 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-[#90FF00]" />
          <h1 className="text-xl font-bold text-white">{translate('theory.title')}</h1>
        </div>
        <p className="text-xs text-[#AAA] leading-relaxed">
          {translate('theory.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topics List */}
        <div className="lg:col-span-4 bg-[#181818] border border-[#333] rounded-lg p-3 space-y-1">
          <span className="text-[10px] font-mono text-[#666] uppercase px-2 py-1 font-bold block">
            {translate('theory.topics')}
          </span>
          {THEORY_TOPICS.map((topic) => {
            const isActive = selectedTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`w-full p-3 rounded text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#252525] border-l-4 border-[#90FF00] text-white font-bold'
                    : 'bg-[#121212] text-[#AAA] hover:bg-[#1C1C1C]'
                }`}
              >
                <span className="text-xs font-semibold block">{topic.title}</span>
                <span className="text-[10px] font-mono text-[#666]">{topic.category}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Topic Content Panel */}
        <div className="lg:col-span-8 bg-[#181818] border border-[#333] rounded-lg p-6 space-y-5">
          <div className="border-b border-[#333] pb-3">
            <span className="text-xs font-mono text-[#90FF00] bg-[#90FF00]/10 px-2 py-0.5 rounded border border-[#90FF00]/30 uppercase font-bold">
              {selectedTopic.category}
            </span>
            <h2 className="text-xl font-bold text-white mt-2">{selectedTopic.title}</h2>
          </div>

          <p className="text-xs text-[#CCC] leading-relaxed bg-[#121212] p-4 rounded border border-[#222]">
            {selectedTopic.detailedContent}
          </p>

          {/* Audio Example Playback Card */}
          <div className="bg-[#121212] p-4 rounded border border-[#222] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#00E5FF] uppercase flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span>{translate('theory.audioExample')} ({selectedTopic.exampleRoot} {selectedTopic.exampleScale})</span>
              </span>

              <button
                onClick={() => handlePlayNotes(selectedTopic.notesSequence)}
                className="px-3 py-1.5 bg-[#90FF00] hover:bg-[#a6ff26] text-black text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>{translate('theory.hearExample')}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {selectedTopic.notesSequence.map((n, idx) => (
                <span key={idx} className="bg-[#222] border border-[#333] px-2.5 py-1 rounded text-[#90FF00] font-bold">
                  {n}
                </span>
              ))}
            </div>
          </div>

          {/* Ableton Live 12 Tip */}
          <div className="bg-[#121212] p-4 rounded border border-[#222]">
            <h4 className="text-xs font-mono font-bold text-[#90FF00] uppercase mb-1">{translate('theory.liveTip')}</h4>
            <p className="text-xs text-[#BBB] leading-relaxed">{selectedTopic.abletonTip}</p>
          </div>

          <button
            onClick={() => onOpenCoachWithMessage(`Explain how to apply ${selectedTopic.title} in Ableton Live 12 for synth leads and bass lines.`)}
            className="px-4 py-2 bg-[#252525] hover:bg-[#333] border border-[#444] text-[#90FF00] text-xs font-bold rounded flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#90FF00]" />
            <span>ASK AI COACH FOR MORE EXAMPLES</span>
          </button>
        </div>
      </div>
    </div>
  );
};
