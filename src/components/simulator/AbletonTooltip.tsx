import React from 'react';
import { HelpCircle, Sparkles, AlertCircle } from 'lucide-react';
import { LocalizedText } from '../../types/visualLesson';

interface AbletonTooltipProps {
  title?: LocalizedText;
  instruction?: LocalizedText;
  why?: LocalizedText;
  proTip?: LocalizedText;
  lang?: string;
  className?: string;
}

export const AbletonTooltip: React.FC<AbletonTooltipProps> = ({
  title,
  instruction,
  why,
  proTip,
  lang = 'he',
  className = '',
}) => {
  const getText = (textObj?: LocalizedText) => {
    if (!textObj) return '';
    return textObj[lang] || textObj.en || textObj.he || '';
  };

  const titleText = getText(title);
  const instructionText = getText(instruction);
  const whyText = getText(why);
  const proTipText = getText(proTip);

  if (!instructionText) return null;

  return (
    <div
      className={`bg-[#1E1E1E]/95 border border-[#3C3C3C] text-gray-200 p-3 rounded shadow-2xl backdrop-blur max-w-sm text-xs font-sans select-none z-40 ${className}`}
    >
      {titleText && (
        <div className="flex items-center gap-1.5 text-[#FFE853] font-bold pb-1.5 border-b border-[#323232] mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FFE853] shrink-0" />
          <span>{titleText}</span>
        </div>
      )}

      <p className="text-gray-100 font-medium leading-relaxed mb-1.5">{instructionText}</p>

      {whyText && (
        <div className="flex items-start gap-1 text-[11px] text-gray-400 mt-1">
          <HelpCircle className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
          <span>{whyText}</span>
        </div>
      )}

      {proTipText && (
        <div className="flex items-start gap-1 text-[11px] text-amber-300/90 mt-1.5 bg-[#2B2B1B] p-1.5 rounded border border-[#443C20]">
          <AlertCircle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
          <span>{proTipText}</span>
        </div>
      )}
    </div>
  );
};
