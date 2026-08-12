import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../../data/glossaryData';
import { GlossaryTerm } from '../../types/learning';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Search, Sparkles, ChevronRight, Layers, HelpCircle } from 'lucide-react';

export const GlossaryView: React.FC = () => {
  const { isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeTerm, setActiveTerm] = useState<GlossaryTerm | null>(GLOSSARY_TERMS[0]);

  const categories = ['ALL', 'Rhythm', 'Synthesis', 'Dynamics', 'FX', 'Mixing', 'Mastering'];

  const filteredTerms = GLOSSARY_TERMS.filter((t) => {
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch =
      t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shortDef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.shortDefHe && t.shortDefHe.includes(searchQuery));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#14141d] via-[#1a1a27] to-[#12121c] border border-[#232336] shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{isRtl ? 'מילון המושגים למפיק' : 'Music Production Glossary'}</span>
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isRtl
                ? 'הסברים פשוטים, מפיקולוגיה ועומק טכני לכל מושגי ה-DSP והסאונד'
                : 'Clear definitions, producer tips, and DSP depth for electronic music concepts'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute top-3 left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'חפש מושג (Kick, Sidechain, LUFS...)' : 'Search terms...'}
            className="w-full bg-[#181824] border border-[#28283a] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedCategory === cat
                ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-[#00E5FF]'
                : 'bg-[#12121a] border-[#222232] text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terms List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filteredTerms.map((item) => {
            const isSelected = activeTerm?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTerm(item)}
                className={`p-4 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#1a1a28] border-[#00E5FF] shadow-lg shadow-[#00E5FF]/10'
                    : 'bg-[#12121a] border-[#222232] hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">{item.term}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#1f1f30] text-gray-300 font-medium">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {isRtl && item.shortDefHe ? item.shortDefHe : item.shortDef}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Term Detail Card */}
        <div className="lg:col-span-2 bg-[#12121a] border border-[#222232] rounded-2xl p-6 sm:p-8 space-y-6">
          {activeTerm ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#222232]">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                    {activeTerm.category}
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-2">{activeTerm.term}</h2>
                </div>
              </div>

              {/* 3 Explanation Levels */}
              <div className="space-y-4">
                {/* 1. Simple Definition */}
                <div className="p-4 rounded-xl bg-[#181824] border border-[#28283d] space-y-1">
                  <span className="text-xs font-bold text-[#90FF00] uppercase tracking-wider block">
                    💡 {isRtl ? 'הסבר פשוט (Simple Definition)' : 'Simple Definition'}
                  </span>
                  <p className="text-sm text-gray-200">
                    {isRtl && activeTerm.simpleDefHe ? activeTerm.simpleDefHe : activeTerm.simpleDef}
                  </p>
                </div>

                {/* 2. Producer Definition */}
                <div className="p-4 rounded-xl bg-[#181824] border border-[#28283d] space-y-1">
                  <span className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider block">
                    🎧 {isRtl ? 'מפיקולוגיה ב-Ableton (Producer Context)' : 'Producer Context'}
                  </span>
                  <p className="text-sm text-gray-200">
                    {isRtl && activeTerm.producerDefHe ? activeTerm.producerDefHe : activeTerm.producerDef}
                  </p>
                </div>

                {/* 3. Technical DSP Depth */}
                <div className="p-4 rounded-xl bg-[#181824] border border-[#28283d] space-y-1">
                  <span className="text-xs font-bold text-[#A78BFA] uppercase tracking-wider block">
                    ⚙️ {isRtl ? 'עומק טכני (Technical Depth)' : 'Technical Depth'}
                  </span>
                  <p className="text-xs font-mono text-gray-300">
                    {isRtl && activeTerm.technicalDefHe ? activeTerm.technicalDefHe : activeTerm.technicalDef}
                  </p>
                </div>

                {/* Example */}
                <div className="p-4 rounded-xl bg-[#141d24] border border-[#00E5FF]/20 space-y-1">
                  <span className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider block">
                    📌 {isRtl ? 'דוגמה מעשית ב-Ableton Live 12' : 'Practical Example'}
                  </span>
                  <p className="text-xs text-gray-200">
                    {isRtl && activeTerm.exampleHe ? activeTerm.exampleHe : activeTerm.example}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              {isRtl ? 'בחר מושג מהרשימה לצפייה בהסברים' : 'Select a term from the list'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
