import React, { useState } from 'react';
import { Search, X, MapPin, HelpCircle, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';
import { AbletonSearchTopic, HotspotTarget } from '../../types/classroom';
import { classroomService } from '../../services/classroomService';
import { useLanguage } from '../../context/LanguageContext';

interface WhereIsItModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateAndHighlightTarget: (target: HotspotTarget) => void;
}

export const WhereIsItModal: React.FC<WhereIsItModalProps> = ({
  isOpen,
  onClose,
  onNavigateAndHighlightTarget
}) => {
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<AbletonSearchTopic | null>(null);
  const { language, isRTL } = useLanguage();

  if (!isOpen) return null;

  const searchResults = classroomService.searchTopics(query);

  const handleSelectAndHighlight = (topic: AbletonSearchTopic) => {
    onNavigateAndHighlightTarget(topic.targetElement);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="bg-[#1A1A1A] border border-[#333] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#333] bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              ?
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'he' ? 'איפה זה באבלטון? (Where Is It?)' : 'Where Is It in Ableton Live 12?'}
              </h3>
              <p className="text-xs text-[#888]">
                {language === 'he' ? 'חפש רכיב למציאה והסבר מפורט' : 'Search any feature, device, or tool to highlight it'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#888] hover:text-white hover:bg-[#2A2A2A] rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#2A2A2A] bg-[#161616]">
          <div className="relative">
            <Search className={`w-4 h-4 text-[#666] absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={language === 'he' ? 'חפש: Operator, Piano Roll, Compressor, Metronome...' : 'Search: Operator, Piano Roll, Compressor, Metronome...'}
              className={`w-full bg-[#1A1A1A] border border-[#333] focus:border-amber-400 text-sm text-white rounded-lg py-2.5 ${
                isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'
              } outline-none transition`}
              autoFocus
            />
          </div>
        </div>

        {/* Main Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {searchResults.length === 0 ? (
            <div className="text-center py-8 text-[#888] text-sm">
              {language === 'he' ? 'לא נמצאו תוצאות חיפוש.' : 'No search results found.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResults.map(topic => {
                const isSelected = selectedTopic?.id === topic.id;
                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-400'
                        : 'bg-[#222] border-[#333] hover:border-[#444]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-amber-400">
                        {language === 'he' ? topic.nameHe : topic.name}
                      </span>
                      <span className="text-[10px] bg-[#2A2A2A] text-[#AAA] px-2 py-0.5 rounded font-mono">
                        {language === 'he' ? topic.categoryHe : topic.category}
                      </span>
                    </div>

                    <p className="text-xs text-[#CCC] line-clamp-2 mb-2">
                      {language === 'he' ? topic.whatItDoesHe : topic.whatItDoes}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAndHighlight(topic);
                      }}
                      className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      {language === 'he' ? 'הצג והאר בסימולטור' : 'Locate & Highlight in Simulator'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected Topic Deep Breakdown (WHAT, WHY, WHEN, HOW, MISTAKE) */}
          {selectedTopic && (
            <div className="mt-4 p-4 bg-[#141414] border border-[#333] rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-[#2A2A2A] pb-2 text-sm">
                <BookOpen className="w-4 h-4" />
                {language === 'he' ? 'מדריך שימוש מפורט' : 'Detailed Usage Breakdown'}: {language === 'he' ? selectedTopic.nameHe : selectedTopic.name}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#888] font-bold block mb-1">WHAT IT DOES:</span>
                  <p className="text-gray-200">{language === 'he' ? selectedTopic.whatItDoesHe : selectedTopic.whatItDoes}</p>
                </div>
                <div>
                  <span className="text-[#888] font-bold block mb-1">WHY IT MATTERS:</span>
                  <p className="text-gray-200">{language === 'he' ? selectedTopic.whyItMattersHe : selectedTopic.whyItMatters}</p>
                </div>
                <div>
                  <span className="text-[#888] font-bold block mb-1">WHEN TO USE:</span>
                  <p className="text-gray-200">{language === 'he' ? selectedTopic.whenToUseHe : selectedTopic.whenToUse}</p>
                </div>
                <div>
                  <span className="text-[#888] font-bold block mb-1">HOW TO USE:</span>
                  <p className="text-gray-200">{language === 'he' ? selectedTopic.howToUseHe : selectedTopic.howToUse}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#252525] flex items-start gap-2 text-xs text-amber-300 bg-amber-500/10 p-2.5 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{language === 'he' ? 'טעות נפוצה של מתחילים:' : 'Common Beginner Mistake:'} </span>
                  {language === 'he' ? selectedTopic.beginnerMistakeHe : selectedTopic.beginnerMistake}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
