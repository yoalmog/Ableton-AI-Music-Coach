import React from 'react';
import { motion } from 'framer-motion';
import { NormalizedRect, SimulatorActionType } from '../../types/abletonSimulator';
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';
import { LocalizedText } from '../../types/visualLesson';

interface AbletonInteractiveRegionProps {
  id: string;
  rect: NormalizedRect;
  actionType: SimulatorActionType;
  isActive: boolean;
  isCompleted?: boolean;
  stepNumber?: number;
  arrowDirection?: 'up' | 'down' | 'left' | 'right';
  tooltip?: LocalizedText;
  showHints?: boolean; // Guided mode shows highlights/arrows; Practice/Exam mode hides them
  onClick?: () => void;
  onDoubleClick?: () => void;
  onRightClick?: (e: React.MouseEvent) => void;
  lang?: string;
}

export const AbletonInteractiveRegion: React.FC<AbletonInteractiveRegionProps> = ({
  id,
  rect,
  actionType,
  isActive,
  isCompleted = false,
  stepNumber,
  arrowDirection,
  tooltip,
  showHints = true,
  onClick,
  onDoubleClick,
  onRightClick,
  lang = 'he',
}) => {
  const leftPercent = `${rect.x * 100}%`;
  const topPercent = `${rect.y * 100}%`;
  const widthPercent = `${rect.width * 100}%`;
  const heightPercent = `${rect.height * 100}%`;

  const renderArrow = () => {
    if (!arrowDirection || !showHints) return null;
    const baseClasses = 'absolute z-30 text-[#FFE853] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] animate-bounce pointer-events-none';
    switch (arrowDirection) {
      case 'down':
        return <ArrowDown className={`${baseClasses} -top-7 left-1/2 -translate-x-1/2 w-6 h-6 stroke-[3]`} />;
      case 'up':
        return <ArrowUp className={`${baseClasses} -bottom-7 left-1/2 -translate-x-1/2 w-6 h-6 stroke-[3]`} />;
      case 'right':
        return <ArrowRight className={`${baseClasses} top-1/2 -left-7 -translate-y-1/2 w-6 h-6 stroke-[3]`} />;
      case 'left':
        return <ArrowLeft className={`${baseClasses} top-1/2 -right-7 -translate-y-1/2 w-6 h-6 stroke-[3]`} />;
    }
  };

  const localizedTooltip = tooltip ? (tooltip[lang] || tooltip.en || tooltip.he) : '';

  return (
    <div
      id={`interactive-target-${id}`}
      style={{
        position: 'absolute',
        left: leftPercent,
        top: topPercent,
        width: widthPercent,
        height: heightPercent,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick?.();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onRightClick?.(e);
      }}
      className={`group absolute cursor-pointer transition-all duration-200 select-none z-20 ${
        isActive && showHints
          ? 'border-2 border-[#FFE853] bg-[#FFE853]/15 shadow-[0_0_15px_rgba(255,232,83,0.6)] animate-pulse'
          : isCompleted
          ? 'border border-[#90FF00]/50 bg-[#90FF00]/10'
          : 'hover:border hover:border-white/40 hover:bg-white/5'
      }`}
    >
      {/* Animated Directional Guidance Arrow */}
      {isActive && renderArrow()}

      {/* Step Marker Badge */}
      {isActive && stepNumber !== undefined && showHints && (
        <div className="absolute -top-3 -right-3 z-30 w-6 h-6 rounded-full bg-[#FFE853] text-black font-mono font-bold text-xs flex items-center justify-center shadow-lg border border-black pointer-events-none">
          {stepNumber}
        </div>
      )}

      {/* Completed Checkmark Indicator */}
      {isCompleted && (
        <div className="absolute top-1 right-1 z-30 w-4 h-4 rounded-full bg-[#90FF00] text-black flex items-center justify-center shadow pointer-events-none">
          <CheckCircle className="w-3 h-3 stroke-[3]" />
        </div>
      )}

      {/* Hover Info Tooltip */}
      {localizedTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-40 pointer-events-none">
          <div className="bg-[#141414]/95 backdrop-blur-md border border-[#383838] text-gray-100 text-[11px] font-sans px-2.5 py-1 rounded shadow-xl whitespace-nowrap">
            <span className="text-[#FFE853] font-mono mr-1">[{actionType}]</span>
            {localizedTooltip}
          </div>
          <div className="w-2 h-2 bg-[#141414] border-r border-b border-[#383838] rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
};
