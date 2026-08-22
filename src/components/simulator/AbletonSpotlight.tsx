import React from 'react';
import { NormalizedRect } from '../../types/abletonSimulator';

interface AbletonSpotlightProps {
  rect?: NormalizedRect | null;
  enabled?: boolean;
}

export const AbletonSpotlight: React.FC<AbletonSpotlightProps> = ({ rect, enabled = true }) => {
  if (!enabled || !rect) return null;

  const left = `${rect.x * 100}%`;
  const top = `${rect.y * 100}%`;
  const width = `${rect.width * 100}%`;
  const height = `${rect.height * 100}%`;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Darkened backdrop overlay around target */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
          left,
          top,
          width,
          height,
          borderRadius: '4px',
        }}
      />
    </div>
  );
};
