import React from 'react';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { useLanguage } from '../../context/LanguageContext';

interface LoadingBoundaryProps {
  isLoading?: boolean;
  loadingText?: string;
  isPanel?: boolean;
  children: React.ReactNode;
}

export const LoadingBoundary: React.FC<LoadingBoundaryProps> = ({
  isLoading = false,
  loadingText,
  isPanel = true,
  children,
}) => {
  const { t, isRTL } = useLanguage();

  if (isLoading) {
    return (
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`flex flex-col items-center justify-center p-8 text-center ${
          isPanel ? 'min-h-[400px] bg-[#181818] border border-[#2B2B2B] rounded-2xl' : 'min-h-screen bg-[#0D0D0D]'
        }`}
      >
        <div className="bg-[#222] border border-[#333] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
          <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
          </div>
          <p className="text-xs md:text-sm font-semibold text-gray-200 font-mono">
            {loadingText || t('simulator.loadingClassroom') || 'Loading Ableton Live 12 Interactive Workspace...'}
          </p>
          <div className="w-full bg-[#111] h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full animate-pulse w-3/4 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return <ErrorBoundary isPanel={isPanel}>{children}</ErrorBoundary>;
};
