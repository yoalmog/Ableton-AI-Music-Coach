import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScreenAnnotation,
  ArrowDirection,
  AnnotationColor,
  LocalizedText,
  VisualLearningMode,
} from '../../types/visualLesson';
import { Language } from '../../i18n/types';

interface AnnotationLayerProps {
  annotations: ScreenAnnotation[];
  learningMode?: VisualLearningMode; // 'guided' | 'practice' | 'challenge'
  isSpotlightEnabled?: boolean;
  isZoomEnabled?: boolean;
  isWhereToClickActive?: boolean;
  isShowMePlaying?: boolean;
  onShowMeComplete?: () => void;
  onTargetClick?: (annotation: ScreenAnnotation, isHit: boolean) => void;
  language?: Language;
  zoomTarget?: {
    x: number;
    y: number;
    width: number;
    height: number;
    zoomLevel: number;
  };
  className?: string;
}

export const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
  annotations = [],
  learningMode = 'guided',
  isSpotlightEnabled = true,
  isZoomEnabled = false,
  isWhereToClickActive = false,
  isShowMePlaying = false,
  onShowMeComplete,
  onTargetClick,
  language = 'he',
  zoomTarget,
  className = '',
}) => {
  const isRtl = language === 'he';

  // Show Me cursor animation state
  const [showMeStep, setShowMeStep] = useState<number>(0);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [hoveredAnnotationId, setHoveredAnnotationId] = useState<string | null>(null);
  const [challengeFeedback, setChallengeFeedback] = useState<{
    x: number;
    y: number;
    hit: boolean;
  } | null>(null);

  useEffect(() => {
    if (isShowMePlaying) {
      setShowMeStep(0);
      const timer1 = setTimeout(() => setShowMeStep(1), 500);
      const timer2 = setTimeout(() => setShowMeStep(2), 1500);
      const timer3 = setTimeout(() => {
        setShowMeStep(3);
        if (onShowMeComplete) {
          setTimeout(onShowMeComplete, 700);
        }
      }, 2600);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setShowMeStep(0);
    }
  }, [isShowMePlaying, onShowMeComplete]);

  // Primary spotlight target if spotlight is enabled and we are in guided mode
  const primarySpotlight = annotations.find((a) => a.type === 'spotlight') || annotations[0];

  const getColorTheme = (color: AnnotationColor = 'lime') => {
    switch (color) {
      case 'cyan':
        return {
          border: 'border-[#00E5FF]',
          bg: 'bg-[#00E5FF]',
          glow: 'shadow-[0_0_20px_#00E5FF]',
          text: 'text-[#00E5FF]',
          badgeBg: 'bg-[#00E5FF]/20',
          hex: '#00E5FF',
        };
      case 'amber':
        return {
          border: 'border-[#FFB800]',
          bg: 'bg-[#FFB800]',
          glow: 'shadow-[0_0_20px_#FFB800]',
          text: 'text-[#FFB800]',
          badgeBg: 'bg-[#FFB800]/20',
          hex: '#FFB800',
        };
      case 'red':
        return {
          border: 'border-[#FF0055]',
          bg: 'bg-[#FF0055]',
          glow: 'shadow-[0_0_20px_#FF0055]',
          text: 'text-[#FF0055]',
          badgeBg: 'bg-[#FF0055]/20',
          hex: '#FF0055',
        };
      case 'purple':
        return {
          border: 'border-[#9D4EDD]',
          bg: 'bg-[#9D4EDD]',
          glow: 'shadow-[0_0_20px_#9D4EDD]',
          text: 'text-[#9D4EDD]',
          badgeBg: 'bg-[#9D4EDD]/20',
          hex: '#9D4EDD',
        };
      case 'blue':
        return {
          border: 'border-[#3366FF]',
          bg: 'bg-[#3366FF]',
          glow: 'shadow-[0_0_20px_#3366FF]',
          text: 'text-[#3366FF]',
          badgeBg: 'bg-[#3366FF]/20',
          hex: '#3366FF',
        };
      case 'green':
      case 'lime':
      default:
        return {
          border: 'border-[#90FF00]',
          bg: 'bg-[#90FF00]',
          glow: 'shadow-[0_0_20px_#90FF00]',
          text: 'text-[#90FF00]',
          badgeBg: 'bg-[#90FF00]/20',
          hex: '#90FF00',
        };
    }
  };

  const getLabel = (labelObj?: LocalizedText): string => {
    if (!labelObj) return '';
    return labelObj[language] || labelObj.he || labelObj.en || '';
  };

  // Get arrow rotation angle taking direction into account
  const getArrowAngle = (direction?: ArrowDirection): number => {
    switch (direction) {
      case 'top':
        return -90;
      case 'bottom':
        return 90;
      case 'left':
        return 180;
      case 'right':
        return 0;
      case 'top-left':
        return -135;
      case 'top-right':
        return -45;
      case 'bottom-left':
        return 135;
      case 'bottom-right':
        return 45;
      default:
        return 0;
    }
  };

  // Handle click in Challenge / Practice Mode
  const handleLayerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (learningMode === 'guided' && !onTargetClick) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    // Check hit against annotations
    let hitAnnotation: ScreenAnnotation | null = null;
    for (const ann of annotations) {
      const annX = ann.x;
      const annY = ann.y;
      const annW = ann.width || 0.12;
      const annH = ann.height || 0.12;

      if (
        clickX >= annX - 0.04 &&
        clickX <= annX + annW + 0.04 &&
        clickY >= annY - 0.04 &&
        clickY <= annY + annH + 0.04
      ) {
        hitAnnotation = ann;
        break;
      }
    }

    const isHit = !!hitAnnotation;
    setChallengeFeedback({ x: clickX * 100, y: clickY * 100, hit: isHit });

    setTimeout(() => {
      setChallengeFeedback(null);
    }, 1200);

    if (onTargetClick) {
      onTargetClick(hitAnnotation || annotations[0], isHit);
    }
  };

  // In Challenge mode, do not show guided arrows or rectangles before user acts
  const shouldRenderGuidance = learningMode !== 'challenge' || isWhereToClickActive || isShowMePlaying;

  return (
    <div
      onClick={handleLayerClick}
      className={`absolute inset-0 w-full h-full pointer-events-auto select-none ${
        learningMode === 'challenge' ? 'cursor-crosshair' : 'pointer-events-none'
      } ${className}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. SPOTLIGHT EFFECT (70% dark overlay with bright target area) */}
      {/* ------------------------------------------------------------- */}
      {isSpotlightEnabled && primarySpotlight && shouldRenderGuidance && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <mask id="spotlightMask">
              {/* White background means overlay is visible (70% dark) */}
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {/* Black cutout makes target area completely transparent / 100% visible */}
              <rect
                x={`${primarySpotlight.x * 100}%`}
                y={`${primarySpotlight.y * 100}%`}
                width={`${(primarySpotlight.width || 0.15) * 100}%`}
                height={`${(primarySpotlight.height || 0.15) * 100}%`}
                rx="8"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.72)"
            mask="url(#spotlightMask)"
          />
        </svg>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. CHALLENGE MODE HIT / MISS VISUAL FEEDBACK */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {challengeFeedback && (
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            style={{ left: `${challengeFeedback.x}%`, top: `${challengeFeedback.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-50 px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-2xl ${
              challengeFeedback.hit
                ? 'bg-[#90FF00] text-black shadow-[0_0_20px_#90FF00]'
                : 'bg-[#FF0055] text-white shadow-[0_0_20px_#FF0055]'
            }`}
          >
            <span>{challengeFeedback.hit ? '✓' : '✗'}</span>
            <span>
              {challengeFeedback.hit
                ? isRtl
                  ? 'מדויק! זוהה בהצלחה'
                  : 'Spot on! Identified'
                : isRtl
                ? 'נסה שוב'
                : 'Try again'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* 3. PERSISTENT SHAPES & INTERACTIVE POINTERS */}
      {/* ------------------------------------------------------------- */}
      {shouldRenderGuidance &&
        annotations.map((annotation) => {
          const theme = getColorTheme(annotation.color || 'lime');
          const labelText = getLabel(annotation.label);
          const descText = getLabel(annotation.description);
          const xPercent = annotation.x * 100;
          const yPercent = annotation.y * 100;
          const wPercent = (annotation.width || 0.14) * 100;
          const hPercent = (annotation.height || 0.12) * 100;
          const isHovered = hoveredAnnotationId === annotation.id;

          switch (annotation.type) {
            // A. RECTANGLE & SPOTLIGHT BORDER
            case 'rectangle':
            case 'spotlight':
              return (
                <div
                  key={annotation.id}
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                    width: `${wPercent}%`,
                    height: `${hPercent}%`,
                  }}
                  className={`absolute z-20 pointer-events-auto rounded-lg border-2 ${theme.border} ${theme.glow} ${
                    annotation.pulse || isWhereToClickActive ? 'animate-pulse' : ''
                  }`}
                  onMouseEnter={() => setHoveredAnnotationId(annotation.id)}
                  onMouseLeave={() => setHoveredAnnotationId(null)}
                >
                  {/* Corner Accent Dots using CSS logical placement */}
                  <div className={`absolute -top-1 start-[-4px] w-2.5 h-2.5 rounded-full ${theme.bg}`} />
                  <div className={`absolute -top-1 end-[-4px] w-2.5 h-2.5 rounded-full ${theme.bg}`} />
                  <div className={`absolute -bottom-1 start-[-4px] w-2.5 h-2.5 rounded-full ${theme.bg}`} />
                  <div className={`absolute -bottom-1 end-[-4px] w-2.5 h-2.5 rounded-full ${theme.bg}`} />

                  {/* Top / Bottom Label with CSS logical properties */}
                  {labelText && (
                    <div
                      className={`absolute -top-7 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 px-2.5 py-0.5 rounded text-[11px] font-bold whitespace-nowrap bg-[#0B0D12] border ${theme.border} ${theme.text} shadow-lg text-start`}
                    >
                      {labelText}
                    </div>
                  )}

                  {/* Hover explanation callout */}
                  {isHovered && descText && (
                    <div
                      className={`absolute top-full mt-2 start-0 z-40 min-w-[160px] max-w-[240px] p-2 rounded-lg bg-[#0F131A] border ${theme.border} shadow-2xl text-start text-[11px] text-gray-200`}
                    >
                      {descText}
                    </div>
                  )}
                </div>
              );

            // B. CIRCLE
            case 'circle':
              return (
                <div
                  key={annotation.id}
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                    width: `${wPercent}%`,
                    height: `${wPercent}%`,
                  }}
                  className={`absolute z-20 pointer-events-auto rounded-full border-2 ${theme.border} ${theme.glow} ${
                    annotation.pulse || isWhereToClickActive ? 'animate-pulse' : ''
                  }`}
                  onMouseEnter={() => setHoveredAnnotationId(annotation.id)}
                  onMouseLeave={() => setHoveredAnnotationId(null)}
                >
                  {labelText && (
                    <div
                      className={`absolute -top-6 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0B0D12] border ${theme.border} ${theme.text} whitespace-nowrap text-start`}
                    >
                      {labelText}
                    </div>
                  )}
                </div>
              );

            // C. ARROW WITH ROTATION & LOGICAL ALIGNMENT
            case 'arrow': {
              const rotationAngle = getArrowAngle(annotation.direction);
              return (
                <motion.div
                  key={annotation.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                  }}
                  className={`absolute z-30 pointer-events-auto flex items-center gap-1.5 ${
                    annotation.pulse ? 'animate-bounce' : ''
                  }`}
                >
                  <div
                    style={{ transform: `rotate(${rotationAngle}deg)` }}
                    className={`w-8 h-8 rounded-full ${theme.bg} text-black font-bold text-base flex items-center justify-center shadow-lg transition-transform`}
                  >
                    ➔
                  </div>
                  {labelText && (
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold bg-[#0D1016] border ${theme.border} ${theme.text} shadow-md whitespace-nowrap text-start`}
                    >
                      {labelText}
                    </span>
                  )}
                </motion.div>
              );
            }

            // D. INTERACTIVE POINTER / BEACON
            case 'pointer':
              return (
                <div
                  key={annotation.id}
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                  }}
                  className="absolute z-30 pointer-events-auto flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onTargetClick) onTargetClick(annotation, true);
                  }}
                >
                  {/* Outer Ripple Halo */}
                  <div className={`absolute w-10 h-10 rounded-full ${theme.bg}/30 animate-ping pointer-events-none`} />

                  {/* Pointer Head */}
                  <div
                    className={`w-8 h-8 rounded-full ${theme.bg} text-black flex items-center justify-center font-bold text-sm shadow-[0_0_15px_currentColor] group-hover:scale-110 active:scale-95 transition-transform`}
                  >
                    🎯
                  </div>

                  {labelText && (
                    <div
                      className={`mt-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-[#0D1118] border ${theme.border} ${theme.text} shadow-lg whitespace-nowrap text-start`}
                    >
                      {labelText}
                    </div>
                  )}

                  {descText && (
                    <div
                      className={`hidden group-hover:block absolute top-full mt-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-50 min-w-[140px] max-w-[220px] p-2 rounded-lg bg-[#0F131A] border ${theme.border} shadow-2xl text-[11px] text-gray-200 text-start`}
                    >
                      {descText}
                    </div>
                  )}
                </div>
              );

            // E. NUMBER / SEQUENTIAL MARKER (①, ②, ③)
            case 'number':
            case 'marker':
              return (
                <div
                  key={annotation.id}
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                  }}
                  className="absolute z-40 pointer-events-auto"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMarkerId(
                        selectedMarkerId === annotation.id ? null : annotation.id
                      );
                    }}
                    className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center border-2 ${
                      theme.border
                    } ${theme.bg} text-black shadow-lg hover:scale-110 active:scale-95 transition-transform ${
                      selectedMarkerId === annotation.id ? 'ring-4 ring-white' : ''
                    }`}
                  >
                    {annotation.markerNumber || 1}
                  </button>

                  {/* Marker Popup Callout using CSS logical alignment */}
                  {(selectedMarkerId === annotation.id || labelText) && (
                    <div
                      className={`absolute top-8 start-0 z-50 min-w-[150px] max-w-[260px] p-2.5 rounded-lg bg-[#0F131A] border ${theme.border} shadow-2xl text-start`}
                    >
                      {labelText && (
                        <div className={`text-xs font-bold ${theme.text}`}>{labelText}</div>
                      )}
                      {descText && (
                        <div className="text-[11px] text-gray-300 mt-1 leading-snug">{descText}</div>
                      )}
                    </div>
                  )}
                </div>
              );

            // F. TEXT BUBBLE CALLOUT
            case 'textBubble':
              return (
                <div
                  key={annotation.id}
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                  }}
                  className={`absolute z-30 pointer-events-auto p-2.5 rounded-lg bg-[#0D1118]/95 border ${theme.border} ${theme.glow} max-w-[240px] shadow-2xl text-start`}
                >
                  {labelText && (
                    <div className={`text-xs font-bold ${theme.text} mb-0.5`}>{labelText}</div>
                  )}
                  {descText && <div className="text-[11px] text-gray-200">{descText}</div>}
                  {/* Little speech bubble tail */}
                  <div
                    className={`absolute -bottom-1.5 start-4 w-3 h-3 bg-[#0D1118] border-b border-r ${theme.border} rotate-45`}
                  />
                </div>
              );

            // G. GLOW / RADIAL AURA
            case 'glow':
              return (
                <div
                  key={annotation.id}
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                    width: `${wPercent}%`,
                    height: `${hPercent}%`,
                  }}
                  className={`absolute z-20 pointer-events-none rounded-full ${theme.bg}/20 ${theme.glow} animate-ping`}
                />
              );

            // H. REGION HIGHLIGHT
            case 'region':
              return (
                <div
                  key={annotation.id}
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                    width: `${wPercent}%`,
                    height: `${hPercent}%`,
                  }}
                  className={`absolute z-15 pointer-events-none rounded border border-dashed ${theme.border} ${theme.bg}/10`}
                >
                  {labelText && (
                    <div
                      className={`absolute top-1 start-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/80 ${theme.text} text-start`}
                    >
                      {labelText}
                    </div>
                  )}
                </div>
              );

            default:
              return null;
          }
        })}

      {/* ------------------------------------------------------------- */}
      {/* 4. "SHOW ME" (הראה לי) ANIMATED CURSOR DEMONSTRATION */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {isShowMePlaying && primarySpotlight && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: 50 }}
            animate={{
              opacity: 1,
              x: `${primarySpotlight.x * 100 + (primarySpotlight.width || 0.1) * 50}%`,
              y: `${primarySpotlight.y * 100 + (primarySpotlight.height || 0.1) * 50}%`,
            }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute z-50 pointer-events-none flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
          >
            {/* Animated Hand Cursor */}
            <motion.div
              animate={{
                scale: showMeStep === 2 ? [1, 0.8, 1.1, 1] : 1,
              }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-10 h-10 rounded-full bg-[#90FF00] text-black flex items-center justify-center font-bold text-lg shadow-[0_0_25px_#90FF00]"
            >
              👆
            </motion.div>
            <div className="mt-1 px-2 py-0.5 rounded bg-black/90 border border-[#90FF00] text-[#90FF00] text-[10px] font-bold shadow-lg">
              {showMeStep === 2 ? (isRtl ? 'לחץ כאן!' : 'Click here!') : (isRtl ? 'כוון לכאן' : 'Aim here')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
