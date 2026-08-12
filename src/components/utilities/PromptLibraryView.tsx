import React, { useState } from 'react';
import { Sparkles, Copy, Check, MessageSquare } from 'lucide-react';
import { PROMPT_LIBRARY } from '../../data/promptLibraryData';
import { PromptTemplate } from '../../types';

interface PromptLibraryViewProps {
  onOpenCoachWithMessage: (prompt: string) => void;
}

export const PromptLibraryView: React.FC<PromptLibraryViewProps> = ({ onOpenCoachWithMessage }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Psytrance', 'Goa', 'Full-On', 'Techno', 'Mixing', 'Arrangement'];

  const filteredPrompts = selectedCategory === 'All'
    ? PROMPT_LIBRARY
    : PROMPT_LIBRARY.filter((p) => p.category === selectedCategory);

  const handleCopyPrompt = (p: PromptTemplate) => {
    navigator.clipboard.writeText(p.promptText);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="bg-[#181818] border border-[#333] p-5 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-[#90FF00]" />
          <h1 className="text-xl font-bold text-white">AI Music Prompt Library</h1>
        </div>
        <p className="text-xs text-[#AAA]">
          Ready-to-use professional prompt templates for Psytrance, Goa, Full-On, Techno, Operator sound design, and Ableton Live 12 mixing.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded text-xs font-bold border transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#90FF00] text-black border-[#90FF00]'
                : 'bg-[#181818] text-[#888] border-[#333] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prompts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrompts.map((p) => (
          <div key={p.id} className="bg-[#181818] border border-[#333] hover:border-[#444] p-5 rounded-lg space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30 font-bold">
                  {p.category} • {p.targetDeviceOrTopic}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{p.title}</h3>
              <p className="text-xs text-[#BBB] leading-relaxed bg-[#121212] p-3 rounded border border-[#222] font-mono">
                "{p.promptText}"
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
              <button
                onClick={() => handleCopyPrompt(p)}
                className="px-3 py-1.5 bg-[#252525] hover:bg-[#333] text-[#CCC] text-xs rounded border border-[#444] flex items-center gap-1 cursor-pointer"
              >
                {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-[#90FF00]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === p.id ? 'COPIED!' : 'COPY'}</span>
              </button>

              <button
                onClick={() => onOpenCoachWithMessage(p.promptText)}
                className="px-3 py-1.5 bg-[#90FF00] hover:bg-[#a6ff26] text-black font-bold text-xs rounded flex items-center gap-1 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>RUN IN AI COACH</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
