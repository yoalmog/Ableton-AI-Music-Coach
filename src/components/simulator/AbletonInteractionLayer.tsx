import React, { useState, useEffect, useRef } from 'react';
import {
  NormalizedRect,
  SimulatorInteractiveTarget,
  AbletonLessonStep,
  SimulatorLearningMode,
  SimulatorActionType,
} from '../../types/abletonSimulator';
import { AbletonInteractiveRegion } from './AbletonInteractiveRegion';
import { AbletonSpotlight } from './AbletonSpotlight';
import { AbletonTooltip } from './AbletonTooltip';
import { motion } from 'framer-motion';

interface AbletonInteractionLayerProps {
  currentStep?: AbletonLessonStep;
  learningMode: SimulatorLearningMode;
  onActionTrigger: (targetId: string, actionType: SimulatorActionType, payload?: any) => void;
  lang?: string;
  isRTL?: boolean;
}

export const AbletonInteractionLayer: React.FC<AbletonInteractionLayerProps> = ({
  currentStep,
  learningMode,
  onActionTrigger,
  lang = 'he',
  isRTL = false,
}) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [hoveredTargetId, setHoveredTargetId] = useState<string | null>(null);

  const isGuided = learningMode === 'guided';
  const targetRect = currentStep?.targetRect;

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentStep) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Check Ctrl+Shift+T / Cmd+Shift+T (Insert MIDI Track)
      if (modifier && e.shiftKey && (e.key === 'T' || e.key === 't')) {
        e.preventDefault();
        onActionTrigger(currentStep.targetId, 'KEYBOARD_SHORTCUT', 'Ctrl+Shift+T');
        return;
      }

      // Check Ctrl+Shift+M / Cmd+Shift+M (Insert MIDI Clip)
      if (modifier && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        e.preventDefault();
        onActionTrigger(currentStep.targetId, 'KEYBOARD_SHORTCUT', 'Ctrl+Shift+M');
        return;
      }

      // Check Space (Play / Stop Transport)
      if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();
        onActionTrigger('transport-play', 'KEYBOARD_SHORTCUT', 'Space');
        return;
      }

      // Check Tab (Toggle Arrangement / Session view)
      if (e.key === 'Tab' && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();
        onActionTrigger('view-toggle', 'KEYBOARD_SHORTCUT', 'Tab');
        return;
      }

      // Check B (Draw mode toggle)
      if ((e.key === 'B' || e.key === 'b') && (e.target as HTMLElement)?.tagName !== 'INPUT' && !modifier) {
        onActionTrigger('draw-mode', 'KEYBOARD_SHORTCUT', 'B');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, onActionTrigger]);

  // Convert mouse pixel coordinates to normalized 0.0 - 1.0 coordinates
  const getNormalizedPoint = (clientX: number, clientY: number) => {
    if (!layerRef.current) return { x: 0, y: 0 };
    const rect = layerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    return { x, y };
  };

  // Drag interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentStep?.expectedAction === 'DRAG') {
      const point = getNormalizedPoint(e.clientX, e.clientY);
      setIsDragging(true);
      setDragStart(point);
      setDragCurrent(point);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const point = getNormalizedPoint(e.clientX, e.clientY);
      setDragCurrent(point);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging && dragStart) {
      const point = getNormalizedPoint(e.clientX, e.clientY);
      setIsDragging(false);
      setDragStart(null);
      setDragCurrent(null);

      // Trigger Drag validation with start and drop normalized coordinates
      if (currentStep) {
        onActionTrigger(currentStep.targetId, 'DRAG', {
          start: dragStart,
          drop: point,
        });
      }
    }
  };

  if (!currentStep || !targetRect) return null;

  return (
    <div
      ref={layerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="absolute inset-0 z-20 pointer-events-none select-none overflow-hidden"
    >
      {/* 1. Spotlight focused on target if in Guided Mode */}
      {isGuided && <AbletonSpotlight rect={targetRect} enabled={true} />}

      {/* 2. Drag ghost indicator when user is dragging across screenshot */}
      {isDragging && dragStart && dragCurrent && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
          <line
            x1={`${dragStart.x * 100}%`}
            y1={`${dragStart.y * 100}%`}
            x2={`${dragCurrent.x * 100}%`}
            y2={`${dragCurrent.y * 100}%`}
            stroke="#FFE853"
            strokeWidth="3"
            strokeDasharray="6,6"
            className="animate-pulse"
          />
          <circle
            cx={`${dragStart.x * 100}%`}
            cy={`${dragStart.y * 100}%`}
            r="6"
            fill="#FFE853"
          />
          <circle
            cx={`${dragCurrent.x * 100}%`}
            cy={`${dragCurrent.y * 100}%`}
            r="8"
            fill="#90FF00"
            stroke="#000"
            strokeWidth="2"
          />
        </svg>
      )}

      {/* 3. Interactive Hotspot Region on normalized coordinate */}
      <div className="pointer-events-auto">
        <AbletonInteractiveRegion
          id={currentStep.targetId}
          rect={targetRect}
          actionType={currentStep.expectedAction}
          isActive={true}
          stepNumber={typeof currentStep.id === 'number' ? currentStep.id : 1}
          arrowDirection={currentStep.arrowDirection}
          tooltip={currentStep.instruction}
          showHints={isGuided}
          onClick={() => {
            onActionTrigger(
              currentStep.targetId,
              currentStep.expectedAction,
              currentStep.expectedValue
            );
          }}
          onDoubleClick={() => {
            onActionTrigger(
              currentStep.targetId,
              'DOUBLE_CLICK',
              currentStep.expectedValue
            );
          }}
          onRightClick={() => {
            onActionTrigger(
              currentStep.targetId,
              'RIGHT_CLICK',
              currentStep.expectedValue
            );
          }}
          lang={lang}
        />
      </div>
    </div>
  );
};
