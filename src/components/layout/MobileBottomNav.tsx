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
  const { t, isRTL } = useLanguage();

  const navItems = [
    {
      id: 'dashboard' as ViewType,
      label: t('nav.mobile.dashboard') || t('nav.dashboard') || 'Home',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'lessons' as ViewType,
      label: t('nav.mobile.lessons') || t('nav.lessons') || 'Learn',
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      id: 'midi' as ViewType,
      label: t('nav.mobile.midi') || t('nav.midi') || 'MIDI',
      icon: <Music2 className="w-5 h-5" />,
    },
    {
      id: 'coach' as const,
      label: t('nav.mobile.coach') || t('nav.coach') || 'Coach',
      icon: <Sparkles className="w-5 h-5 text-[#90FF00]" />,
      action: onOpenCoach,
    },
    {
      id: 'versions' as ViewType,
      label: t('nav.mobile.versions') || t('nav.versions') || 'Project',
      icon: <FolderGit2 className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      dir={isRTL ? 'rtl' : 'ltr'}
      className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111111]/95 backdrop-blur-md border-t border-[#2A2A2A] px-1 py-1 z-40 flex items-center justify-around select-none shadow-2xl pb-[calc(6px+env(safe-area-inset-bottom))]"
    >
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
            className={`flex-1 min-w-0 max-w-[72px] flex flex-col items-center justify-center py-1 rounded-lg transition-all duration-150 cursor-pointer active:scale-95 ${
              isActive
                ? 'text-[#90FF00] font-bold'
                : 'text-[#888888] hover:text-[#DDDDDD]'
            }`}
            aria-label={item.label}
          >
            <div className={`p-1 rounded-md transition-all ${isActive ? 'bg-[#90FF00]/15 text-[#90FF00] shadow-[0_0_10px_rgba(144,255,0,0.2)]' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[11px] font-medium font-sans tracking-tight mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center px-0.5">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

