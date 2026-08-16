import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sliders,
  Layers,
  Sparkles,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { InstructionalImageRenderer } from './InstructionalImageRenderer';
import { AnnotationLayer } from './AnnotationLayer';
import {
  VisualLessonStep,
  ScreenAnnotation,
  VisualLearningMode,
} from '../../types/visualLesson';
import { AAMCProject } from '../../types';
import { Language } from '../../i18n/types';

interface VisualLessonViewerProps {
  step: VisualLessonStep;
  project?: AAMCProject;
  learningMode?: VisualLearningMode;
  language?: Language;
  isSpotlightEnabled?: boolean;
  onToggleSpotlight?: () => void;
  isWhereToClickActive?: boolean;
  isShowMePlaying?: boolean;
  onShowMeComplete?: () => void;
  onTargetClick?: (annotation: ScreenAnnotation, isHit: boolean) => void;
  className?: string;
}

export const VisualLessonViewer: React.FC<VisualLessonViewerProps> = ({
  step,
  project,
  learningMode = 'guided',
  language = 'he',
  isSpotlightEnabled = true,
  onToggleSpotlight,
  isWhereToClickActive = false,
  isShowMePlaying = false,
  onShowMeComplete,
  onTargetClick,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isBeforeAfterActive, setIsBeforeAfterActive] = useState<boolean>(false);
  const [splitSlider, setSplitSlider] = useState<number>(50);

  // Auto-reset pan & zoom when step changes unless manual zoom was locked
  useEffect(() => {
    if (step.zoomTarget && step.zoomTarget.zoomLevel > 1) {
      setZoomLevel(step.zoomTarget.zoomLevel);
      setPanOffset({
        x: (0.5 - step.zoomTarget.x) * 200,
        y: (0.5 - step.zoomTarget.y) * 200,
      });
    } else {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    }
  }, [step.id, step.zoomTarget]);

  // Handle Zoom In / Out
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.3, 3.0));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.3, 1.0);
      if (next === 1.0) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Handle Pan when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const hasBeforeAfter = !!(
    (step.beforeImageKey || step.beforeImageUri) &&
    (step.afterImageKey || step.afterImageUri)
  );

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full flex flex-col bg-[#090B0E] rounded-xl border border-[#222B38] overflow-hidden select-none ${
        zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
      } ${className}`}
    >
      {/* ------------------------------------------------------------- */}
      {/* TOP FLOATING CONTROLS TOOLBAR */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-3 left-3 right-3 z-40 flex items-center justify-between pointer-events-none">
        {/* Left Badges: Mode & Status */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {learningMode === 'challenge' && (
            <div className="px-3 py-1 rounded-full bg-[#FF0055] text-white text-xs font-bold shadow-[0_0_15px_#FF0055] flex items-center gap-1.5 animate-pulse">
              <span>🎯</span>
              <span>{language === 'he' ? 'מצב אתגר: לחץ על האזור הנכון בתמונה' : 'Challenge Mode: Click the target'}</span>
            </div>
          )}

          {hasBeforeAfter && (
            <button
              type="button"
              onClick={() => setIsBeforeAfterActive(!isBeforeAfterActive)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                isBeforeAfterActive
                  ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[0_0_12px_#00E5FF]'
                  : 'bg-[#151A24]/90 text-gray-300 border-[#2A3444] hover:border-[#00E5FF]'
              }`}
            >
              <Sliders size={13} />
              <span>{language === 'he' ? 'השוואת לפני / אחרי' : 'Before / After'}</span>
            </button>
          )}
        </div>

        {/* Right Viewport Controls: Zoom, Spotlight, Fullscreen */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#111620]/90 border border-[#2A3648] backdrop-blur-md pointer-events-auto shadow-xl">
          {onToggleSpotlight && (
            <button
              type="button"
              onClick={onToggleSpotlight}
              title={language === 'he' ? 'הפעל/כבה פוקוס זרקור' : 'Toggle Spotlight'}
              className={`p-1.5 rounded transition-colors ${
                isSpotlightEnabled
                  ? 'bg-[#90FF00]/20 text-[#90FF00]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye size={15} />
            </button>
          )}

          <div className="w-[1px] h-4 bg-[#2A3648]" />

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3.0}
            title={language === 'he' ? 'הגדל תמונה (+)' : 'Zoom In (+)'}
            className="p-1.5 rounded text-gray-300 hover:text-[#00E5FF] hover:bg-[#1A2230] disabled:opacity-30 transition-colors"
          >
            <ZoomIn size={15} />
          </button>

          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1.0}
            title={language === 'he' ? 'הקטן תמונה (-)' : 'Zoom Out (-)'}
            className="p-1.5 rounded text-gray-300 hover:text-[#00E5FF] hover:bg-[#1A2230] disabled:opacity-30 transition-colors"
          >
            <ZoomOut size={15} />
          </button>

          {zoomLevel > 1.0 && (
            <button
              type="button"
              onClick={handleResetZoom}
              title={language === 'he' ? 'איפוס תצוגה (100%)' : 'Reset View (100%)'}
              className="px-1.5 py-1 text-[11px] font-bold text-[#00E5FF] hover:bg-[#1A2230] rounded transition-colors flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>{Math.round(zoomLevel * 100)}%</span>
            </button>
          )}

          <div className="w-[1px] h-4 bg-[#2A3648]" />

          <button
            type="button"
            onClick={toggleFullscreen}
            title={language === 'he' ? 'מסך מלא' : 'Fullscreen'}
            className="p-1.5 rounded text-gray-300 hover:text-white hover:bg-[#1A2230] transition-colors"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN INTERACTIVE IMAGE CANVAS STAGE */}
      {/* ------------------------------------------------------------- */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden bg-[#0A0C10]">
        <div
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
          className="relative w-full h-full max-w-[1200px] aspect-[16/10] flex items-center justify-center"
        >
          {/* Base Instructional Image / Diagram Layer */}
          <InstructionalImageRenderer
            diagramType={step.diagramType}
            imageUri={step.imageUri}
            customImageUri={step.customImageUri}
            defaultImageKey={step.defaultImageKey}
            beforeImageKey={step.beforeImageKey}
            afterImageKey={step.afterImageKey}
            beforeImageUri={step.beforeImageUri}
            afterImageUri={step.afterImageUri}
            isBeforeAfterMode={isBeforeAfterActive}
            splitPosition={splitSlider}
            project={project}
            altText={step.title[language] || step.title.he || 'Lesson Diagram'}
            className="w-full h-full"
          />

          {/* Screen Annotation Overlay Layer */}
          <AnnotationLayer
            annotations={step.annotations}
            learningMode={learningMode}
            isSpotlightEnabled={isSpotlightEnabled && !isBeforeAfterActive}
            isWhereToClickActive={isWhereToClickActive}
            isShowMePlaying={isShowMePlaying}
            onShowMeComplete={onShowMeComplete}
            onTargetClick={onTargetClick}
            language={language}
            zoomTarget={step.zoomTarget}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM BEFORE/AFTER SLIDER BAR (WHEN ACTIVE) */}
      {/* ------------------------------------------------------------- */}
      {isBeforeAfterActive && hasBeforeAfter && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 w-[80%] max-w-md px-4 py-2 rounded-xl bg-[#111620]/95 border border-[#00E5FF] shadow-2xl flex items-center gap-3 backdrop-blur-md">
          <span className="text-[11px] font-bold text-[#FF0055] whitespace-nowrap">
            {step.beforeDesc?.[language] || (language === 'he' ? 'לפני (Dry)' : 'Before')}
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={splitSlider}
            onChange={(e) => setSplitSlider(Number(e.target.value))}
            className="flex-1 accent-[#00E5FF] cursor-pointer"
          />
          <span className="text-[11px] font-bold text-[#90FF00] whitespace-nowrap">
            {step.afterDesc?.[language] || (language === 'he' ? 'אחרי (Processed)' : 'After')}
          </span>
        </div>
      )}
    </div>
  );
};
