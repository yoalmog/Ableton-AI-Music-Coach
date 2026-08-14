import React from 'react';
import { X, Cpu, Cloud, Lock, Sparkles, BookOpen, User, Folder, Settings, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { AAMCProject } from '../../../types';
import { classroomService } from '../../../services/classroomService';

interface AIStatusPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  status: {
    activeProvider: string;
    activeModel: string;
    privacyMode: boolean;
    localOk: boolean;
    cloudOk: boolean;
    isAndroid: boolean;
    loading: boolean;
  };
  project: AAMCProject;
  onOpenSetup?: () => void;
  onOpenSettings?: () => void;
}

export const AIStatusPopover: React.FC<AIStatusPopoverProps> = ({
  isOpen,
  onClose,
  status,
  project,
  onOpenSetup,
  onOpenSettings,
}) => {
  const { t, language, isRTL } = useLanguage();

  if (!isOpen) return null;

  const currentLesson = classroomService.getCurrentLesson();
  const currentLessonTitle = currentLesson
    ? (language === 'he' ? currentLesson.titleHe : currentLesson.title)
    : (language === 'he' ? 'בס מתגלגל' : 'Rolling Bass');

  const isConnected = status.activeProvider === 'gemini'
    ? status.cloudOk
    : status.localOk || status.activeProvider === 'offline_coach';

  const providerLabel = status.activeProvider === 'android_local'
    ? 'Android Local AI'
    : status.activeProvider === 'ollama'
    ? 'Ollama Local'
    : status.activeProvider === 'gemini'
    ? 'Google Gemini Cloud'
    : status.activeProvider === 'offline_coach'
    ? 'Offline Coach'
    : (language === 'he' ? 'לא מוגדר' : 'Not Configured');

  const difficultyKey = `header.${(project.difficulty || 'beginner').toLowerCase()}Level`;
  const levelText = t(difficultyKey) || (language === 'he' ? 'רמת מתחיל' : 'Beginner');

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Popover Card */}
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="absolute top-12 ltr:right-4 rtl:left-4 z-50 w-80 bg-[#141414] border border-[#333] rounded-xl shadow-2xl p-4 text-xs font-mono text-[#E0E0E0] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#90FF00]" />
            <span className="font-extrabold tracking-wider text-white uppercase text-sm">
              {t('header.aiCoachTitle')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#222] text-gray-400 hover:text-white transition cursor-pointer"
            aria-label={t('header.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Details Grid */}
        <div className="space-y-2.5">
          {/* Connection Status */}
          <div className="flex items-center justify-between bg-[#1C1C1C] px-2.5 py-1.5 rounded border border-[#2A2A2A]">
            <span className="text-gray-400">{t('header.status')}:</span>
            <div className="flex items-center gap-1.5 font-bold">
              <span
                className={`w-2 h-2 rounded-full ${
                  status.loading
                    ? 'bg-[#00E5FF] animate-ping'
                    : isConnected
                    ? 'bg-[#90FF00]'
                    : 'bg-[#FF5555]'
                }`}
              />
              <span className={isConnected ? 'text-[#90FF00]' : 'text-[#FF5555]'}>
                {status.loading
                  ? t('header.checking')
                  : isConnected
                  ? t('header.connected')
                  : t('header.disconnected')}
              </span>
            </div>
          </div>

          {/* Provider */}
          <div className="flex items-center justify-between px-1">
            <span className="text-gray-400">{t('header.provider')}:</span>
            <span className="font-bold text-white" dir="ltr">{providerLabel}</span>
          </div>

          {/* Model */}
          <div className="flex items-center justify-between px-1">
            <span className="text-gray-400">{t('header.model')}:</span>
            <span className="font-mono text-[#00E5FF] truncate max-w-[170px]" dir="ltr">
              {status.activeModel || 'Standard'}
            </span>
          </div>

          {/* Student Level */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1 text-gray-400">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('header.student')}:</span>
            </div>
            <span className="font-bold text-amber-400">{levelText}</span>
          </div>

          {/* Current Project */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1 text-gray-400">
              <Folder className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>{t('header.project')}:</span>
            </div>
            <span className="font-bold text-white truncate max-w-[150px]" dir="auto">
              {project.name || t('header.untitledProject')}
            </span>
          </div>

          {/* Current Lesson */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1 text-gray-400">
              <BookOpen className="w-3.5 h-3.5 text-[#90FF00]" />
              <span>{t('header.currentLesson')}:</span>
            </div>
            <span className="font-bold text-[#90FF00] truncate max-w-[150px]">
              {currentLessonTitle}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-2 border-t border-[#262626]">
          <button
            onClick={() => {
              onClose();
              if (onOpenSetup) onOpenSetup();
              else if (onOpenSettings) onOpenSettings();
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#222] hover:bg-[#333] border border-[#333] hover:border-[#90FF00] text-[#90FF00] font-bold py-2 rounded-lg transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{t('header.aiSetup')}</span>
          </button>
        </div>
      </div>
    </>
  );
};
