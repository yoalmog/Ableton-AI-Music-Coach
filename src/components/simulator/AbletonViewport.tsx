import React, { useRef, useEffect, useState } from 'react';
import { AbletonSimulatorState, AbletonLessonStep, SimulatorLearningMode } from '../../types/abletonSimulator';
import { AbletonScreenshot } from './AbletonScreenshot';
import { AbletonInteractionLayer } from './AbletonInteractionLayer';

interface AbletonViewportProps {
  state: AbletonSimulatorState;
  currentStep?: AbletonLessonStep;
  learningMode: SimulatorLearningMode;
  screenshotUri?: string | null;
  onUpdateState: (patch: Partial<AbletonSimulatorState>) => void;
  onActionTrigger: (targetId: string, actionType: any, payload?: any) => void;
  lang?: string;
  isRTL?: boolean;
}

export const AbletonViewport: React.FC<AbletonViewportProps> = ({
  state,
  currentStep,
  learningMode,
  screenshotUri,
  onUpdateState,
  onActionTrigger,
  lang = 'he',
  isRTL = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-0 min-w-0 overflow-hidden bg-[#121212] select-none flex items-center justify-center"
    >
      {/* Visual Canvas Layer (Screenshot or HD Live 12 Interface) */}
      <div className="relative w-full h-full">
        <AbletonScreenshot
          state={state}
          screenshotUri={screenshotUri}
          onUpdateState={onUpdateState}
          onActionTrigger={onActionTrigger}
          isRTL={isRTL}
        />

        {/* Synchronized Interaction Layer */}
        <AbletonInteractionLayer
          currentStep={currentStep}
          learningMode={learningMode}
          onActionTrigger={onActionTrigger}
          lang={lang}
        />
      </div>
    </div>
  );
};
