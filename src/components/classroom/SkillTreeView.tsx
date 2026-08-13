import React from 'react';
import { Award, Lock, CheckCircle, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SkillTreeViewProps {
  skills: {
    interface: number;
    midi: number;
    drums: number;
    soundDesign: number;
    mixing: number;
    arrangement: number;
  };
  totalXp: number;
  onSelectCategory?: (category: string) => void;
}

export const SkillTreeView: React.FC<SkillTreeViewProps> = ({
  skills,
  totalXp,
  onSelectCategory
}) => {
  const { language, isRTL } = useLanguage();

  const SKILL_NODES = [
    { id: 'interface', title: 'Ableton Basics', titleHe: 'יסודות וממשק', val: skills.interface, levelReq: 0 },
    { id: 'midi', title: 'MIDI & Piano Roll', titleHe: 'מלודיה ו-MIDI', val: skills.midi, levelReq: 10 },
    { id: 'drums', title: 'Drums & Rhythms', titleHe: 'תופים ומקצבים', val: skills.drums, levelReq: 20 },
    { id: 'soundDesign', title: 'Instruments & Sound Design', titleHe: 'סינתזה ועיצוב סאונד', val: skills.soundDesign, levelReq: 30 },
    { id: 'arrangement', title: 'Arrangement & Automation', titleHe: 'מבנה ואוטומציה', val: skills.arrangement, levelReq: 40 },
    { id: 'mixing', title: 'Mixing & Mastering', titleHe: 'מיקס ומאסטרינג', val: skills.mixing, levelReq: 50 }
  ];

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between border-b border-[#2B2B2B] pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-white text-sm">
            {language === 'he' ? 'עץ המיומנויות ב-Ableton (Skill Tree)' : 'Ableton Producer Skill Tree'}
          </h3>
        </div>
        <div className="flex items-center gap-2 bg-[#121212] px-3 py-1 rounded-full border border-amber-500/30">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-400">{totalXp} XP</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SKILL_NODES.map((node, i) => {
          const isUnlocked = node.val > 0 || i === 0;
          return (
            <div
              key={node.id}
              onClick={() => onSelectCategory && onSelectCategory(node.title)}
              className={`p-3.5 rounded-xl border transition cursor-pointer relative overflow-hidden ${
                isUnlocked
                  ? 'bg-[#222] border-[#3D3D3D] hover:border-amber-400/80'
                  : 'bg-[#151515] border-[#252525] opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-gray-100">
                  {language === 'he' ? node.titleHe : node.title}
                </span>
                {isUnlocked ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-[#666]" />
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#141414] h-2 rounded-full overflow-hidden mb-1.5 border border-[#2B2B2B]">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-500"
                  style={{ width: `${node.val}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-[#888]">
                <span>{language === 'he' ? 'רמת שליטה:' : 'Mastery:'}</span>
                <span className="font-mono font-bold text-amber-400">{node.val}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
