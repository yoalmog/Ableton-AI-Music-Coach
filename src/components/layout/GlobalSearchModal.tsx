import React, { useState } from 'react';
import { Search, GraduationCap, Sliders, Music2, BookOpen, Star, Sparkles } from 'lucide-react';
import { PROMPT_LIBRARY } from '../../data/promptLibraryData';
import { THEORY_TOPICS } from '../../data/theoryAndEarData';
import { PRODUCER_STAGES } from '../../data/producerStagesData';
import { ViewType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewType) => void;
  onOpenCoachWithMessage: (msg: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenCoachWithMessage,
}) => {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingStages = q
    ? PRODUCER_STAGES.filter(
        (s) => s.title.toLowerCase().includes(q) || s.explanation.toLowerCase().includes(q)
      )
    : [];

  const matchingPrompts = q
    ? PROMPT_LIBRARY.filter(
        (p) => p.title.toLowerCase().includes(q) || p.promptText.toLowerCase().includes(q)
      )
    : [];

  const matchingTheory = q
    ? THEORY_TOPICS.filter(
        (th) => th.title.toLowerCase().includes(q) || th.summary.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4 z-50 font-sans">
      <div className="bg-[#181818] border border-[#444] rounded-lg max-w-2xl w-full p-5 space-y-4 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-[#333] pb-3">
          <Search className="w-5 h-5 text-[#90FF00]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-[#666]"
            autoFocus
          />
          <button onClick={onClose} className="text-xs text-[#888] hover:text-white px-2">
            ESC
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-4">
          {q.length === 0 ? (
            <div className="text-xs text-[#666] text-center py-8">
              {t('search.empty')}
            </div>
          ) : (
            <>
              {matchingStages.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-[#90FF00] font-bold block mb-2 uppercase">
                    {t('search.stages')} ({matchingStages.length})
                  </span>
                  <div className="space-y-1">
                    {matchingStages.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onNavigate('producer');
                          onClose();
                        }}
                        className="p-2.5 bg-[#121212] hover:bg-[#202020] rounded border border-[#2A2A2A] text-xs cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <strong className="text-white block font-sans">
                            Stage {s.code}: {s.title}
                          </strong>
                          <span className="text-[11px] text-[#888] line-clamp-1">{s.explanation}</span>
                        </div>
                        <GraduationCap className="w-4 h-4 text-[#90FF00] shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingPrompts.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-[#00E5FF] font-bold block mb-2 uppercase">
                    {t('search.prompts')} ({matchingPrompts.length})
                  </span>
                  <div className="space-y-1">
                    {matchingPrompts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onOpenCoachWithMessage(p.promptText);
                          onClose();
                        }}
                        className="p-2.5 bg-[#121212] hover:bg-[#202020] rounded border border-[#2A2A2A] text-xs cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <strong className="text-white block font-sans">{p.title}</strong>
                          <span className="text-[11px] text-[#AAA] font-mono line-clamp-1">"{p.promptText}"</span>
                        </div>
                        <Sparkles className="w-4 h-4 text-[#00E5FF] shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingTheory.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-[#a855f7] font-bold block mb-2 uppercase">
                    {t('search.theory')} ({matchingTheory.length})
                  </span>
                  <div className="space-y-1">
                    {matchingTheory.map((th) => (
                      <div
                        key={th.id}
                        onClick={() => {
                          onNavigate('theory');
                          onClose();
                        }}
                        className="p-2.5 bg-[#121212] hover:bg-[#202020] rounded border border-[#2A2A2A] text-xs cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <strong className="text-white block font-sans">{th.title}</strong>
                          <span className="text-[11px] text-[#888] line-clamp-1">{th.summary}</span>
                        </div>
                        <BookOpen className="w-4 h-4 text-[#a855f7] shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingStages.length === 0 && matchingPrompts.length === 0 && matchingTheory.length === 0 && (
                <div className="text-xs text-[#888] text-center py-8">
                  {t('search.noResults', { query })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
