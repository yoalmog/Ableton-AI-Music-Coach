import React, { useState } from 'react';
import { LocalAISetupView } from './LocalAISetupView';

interface FirstRunAISetupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCloud: () => void;
}

export const FirstRunAISetup: React.FC<FirstRunAISetupProps> = ({ isOpen, onClose, onSelectCloud }) => {
  if (!isOpen) return null;

  return (
    <LocalAISetupView
      isOpen={isOpen}
      onClose={onClose}
      onComplete={onClose}
    />
  );
};
