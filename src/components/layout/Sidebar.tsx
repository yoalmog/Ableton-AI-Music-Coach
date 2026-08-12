import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Music2,
  Grid,
  Radio,
  Sliders,
  Activity,
  Layers,
  Award,
  Settings,
  Bot,
  Sparkles,
  BookOpen,
  Headphones,
  CheckSquare,
  MessageSquare,
  FolderGit2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ViewType } from '../../types';
import { Tooltip } from '../common/Tooltip';

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  onOpenCoach: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenCoach,
}) => {
  const { t } = useLanguage();

  const translate = React.useCallback((key: string) => {
    return t ? t(key) : key;
  }, [t]);

  const sections = React.useMemo(() => [
    {
      categoryKey: 'nav.area.learn',
      items: [
        { id: 'lessons' as ViewType, labelKey: 'nav.lessons', descKey: 'sidebar.lessons', icon: <GraduationCap className="w-3.5 h-3.5 text-[#00E5FF]" /> },
        { id: 'coursemap' as ViewType, labelKey: 'Course Map', descKey: 'Visual Course Map', icon: <Layers className="w-3.5 h-3.5 text-[#00E5FF]" /> },
        { id: 'buildtrack' as ViewType, labelKey: 'Build Track', descKey: '13-Stage Track Builder', icon: <Sparkles className="w-3.5 h-3.5 text-[#90FF00]" /> },
        { id: 'theory' as ViewType, labelKey: 'nav.theory', descKey: 'sidebar.theory', icon: <BookOpen className="w-3.5 h-3.5" /> },
        { id: 'practice' as ViewType, labelKey: 'nav.practice', descKey: 'sidebar.practice', icon: <Award className="w-3.5 h-3.5" /> },
        { id: 'glossary' as ViewType, labelKey: 'Glossary', descKey: 'Producer Terms Glossary', icon: <BookOpen className="w-3.5 h-3.5 text-[#a855f7]" /> },
      ],
    },
    {
      categoryKey: 'nav.area.create',
      items: [
        { id: 'midi' as ViewType, labelKey: 'nav.midi', descKey: 'sidebar.midi', icon: <Music2 className="w-3.5 h-3.5 text-[#90FF00]" /> },
        { id: 'drums' as ViewType, labelKey: 'nav.drums', descKey: 'sidebar.drums', icon: <Grid className="w-3.5 h-3.5 text-[#00E5FF]" /> },
        { id: 'bass' as ViewType, labelKey: 'nav.bass', descKey: 'sidebar.bass', icon: <Radio className="w-3.5 h-3.5 text-[#90FF00]" /> },
        { id: 'sounddesign' as ViewType, labelKey: 'nav.sounddesign', descKey: 'sidebar.sounddesign', icon: <Sliders className="w-3.5 h-3.5 text-[#a855f7]" /> },
      ],
    },
    {
      categoryKey: 'nav.area.listen',
      items: [
        { id: 'eartraining' as ViewType, labelKey: 'nav.eartraining', descKey: 'sidebar.eartraining', icon: <Headphones className="w-3.5 h-3.5 text-[#00E5FF]" /> },
        { id: 'analyzer' as ViewType, labelKey: 'nav.analyzer', descKey: 'sidebar.analyzer', icon: <Activity className="w-3.5 h-3.5 text-[#00E5FF]" /> },
        { id: 'mixassistant' as ViewType, labelKey: 'nav.mixassistant', descKey: 'sidebar.mixassistant', icon: <CheckSquare className="w-3.5 h-3.5 text-[#90FF00]" /> },
      ],
    },
    {
      categoryKey: 'nav.area.coach',
      items: [
        { id: 'producer' as ViewType, labelKey: 'nav.producer', descKey: 'sidebar.progression', icon: <Sparkles className="w-3.5 h-3.5 text-[#90FF00]" /> },
        { id: 'prompts' as ViewType, labelKey: 'nav.prompts', descKey: 'sidebar.prompts', icon: <MessageSquare className="w-3.5 h-3.5" /> },
      ],
    },
    {
      categoryKey: 'nav.area.mytrack',
      items: [
        { id: 'dashboard' as ViewType, labelKey: 'nav.dashboard', descKey: 'sidebar.overview', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
        { id: 'arrangement' as ViewType, labelKey: 'nav.arrangement', descKey: 'sidebar.arrangement', icon: <Layers className="w-3.5 h-3.5 text-[#90FF00]" /> },
        { id: 'versions' as ViewType, labelKey: 'nav.versions', descKey: 'sidebar.versions', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
        { id: 'settings' as ViewType, labelKey: 'nav.settings', descKey: 'sidebar.settings', icon: <Settings className="w-3.5 h-3.5" /> },
      ],
    },
  ], [translate]);

  return (
    <aside className="w-60 bg-[#151515] border-r border-[#333] flex flex-col justify-between select-none z-20 shrink-0 font-sans h-full overflow-y-auto">
      <div className="p-3 space-y-4">
        {sections.map((sec) => (
          <div key={sec.categoryKey}>
            <div className="text-[10px] uppercase tracking-widest text-[#666] mb-1.5 px-2 font-bold font-mono">
              {translate(sec.categoryKey)}
            </div>
            <ul className="space-y-0.5">
              {sec.items.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <li key={item.id}>
                    <Tooltip content={translate(item.descKey)} position="right" delayMs={500} className="w-full">
                      <button
                        onClick={() => onSelectView(item.id)}
                        className={`w-full px-2.5 py-1.5 text-xs flex justify-between items-center transition-all duration-200 ease-in-out cursor-pointer text-left group ${
                          isActive
                            ? 'bg-[#252525] text-[#90FF00] font-semibold border-l-2 border-[#90FF00] rounded-r shadow-sm translate-x-0.5'
                            : 'text-[#AAA] hover:bg-[#202020] hover:text-white rounded hover:translate-x-0.5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`transition-colors duration-200 ${isActive ? 'text-[#90FF00]' : 'text-[#777] group-hover:text-white'}`}>{item.icon}</span>
                          <span className="truncate">{translate(item.labelKey)}</span>
                        </div>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#90FF00] shrink-0 shadow-[0_0_6px_#90FF00]" />}
                      </button>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* AI Assistant Callout Footer */}
      <div className="p-3 border-t border-[#333] space-y-2 shrink-0">
        <Tooltip content={translate('sidebar.aiCoach')} position="top" delayMs={500} className="w-full">
          <button
            onClick={onOpenCoach}
            className="w-full py-2 px-3 bg-[#252525] hover:bg-[#2A2A2A] hover:border-[#90FF00] border border-[#444] rounded text-xs text-[#90FF00] font-mono flex items-center justify-between transition-all duration-200 ease-in-out cursor-pointer hover:shadow-[0_0_10px_rgba(144,255,0,0.15)] group"
          >
            <div className="flex items-center gap-2">
              <Bot className="w-3.5 h-3.5 text-[#90FF00] group-hover:scale-110 transition-transform duration-200" />
              <span className="font-sans font-bold">{translate('nav.coach')}</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#90FF00] animate-pulse shadow-[0_0_6px_#90FF00]" />
          </button>
        </Tooltip>
      </div>
    </aside>
  );
};
