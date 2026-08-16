import React from 'react';
import { AnnotationLayer } from './AnnotationLayer';
import { ScreenAnnotation } from '../../types/visualLesson';
import { Language } from '../../i18n/types';

interface ScreenAnnotationOverlayProps {
  annotations: ScreenAnnotation[];
  isSpotlightEnabled?: boolean;
  isZoomEnabled?: boolean;
  isWhereToClickActive?: boolean;
  isShowMePlaying?: boolean;
  onShowMeComplete?: () => void;
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

export const ScreenAnnotationOverlay: React.FC<ScreenAnnotationOverlayProps> = (props) => {
  return <AnnotationLayer {...props} learningMode="guided" />;
};
