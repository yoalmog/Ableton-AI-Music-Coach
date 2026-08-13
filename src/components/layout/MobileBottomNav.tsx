import React from 'react';
import { LayoutDashboard, GraduationCap, Music2, Sparkles, FolderGit2 } from 'lucide-react';
import { ViewType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface MobileBottomNavProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  onOpenCoach: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onSelectView,
  onOpenCoach,
}) => {
  const { t } = useLanguage();

  const navItems = [
    {
      id: 'dashboard' as ViewType,
      label: t ? t('nav.dashboard') : 'Home',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'lessons' as ViewType,
      label: t ? t('nav.lessons') : 'Learn',
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      id: 'midi' as ViewType,
      label: t ? t('nav.midi') : 'Create',
      icon: <Music2 className="w-5 h-5" />,
    },
    {
      id: 'coach' as const,
      label: t ? t('nav.coach') : 'AI Coach',
      icon: <Sparkles className="w-5 h-5 text-[#90FF00]" />,
      action: onOpenCoach,
    },
    {
      id: 'versions' as ViewType,
      label: t ? t('nav.versions') : 'Project',
      icon: <FolderGit2 className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#161616] border-t border-[#2A2A2A] px-2 py-1 z-40 flex items-center justify-around select-none shadow-lg pb-[calc(4px+env(safe-area-inset-bottom))]">
      {navItems.map((item) => {
        const isActive = item.id !== 'coach' && currentView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.action) {
                item.action();
              } else {
                onSelectView(item.id as ViewType);
              }
            }}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded transition-all duration-150 cursor-pointer ${
              isActive
                ? 'text-[#90FF00] font-bold'
                : 'text-[#888888] hover:text-[#DDDDDD]'
            }`}
          >
            <div className={`p-1 rounded-full ${isActive ? 'bg-[#90FF00]/10' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] tracking-tight font-sans mt-0.5 truncate max-w-full">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
