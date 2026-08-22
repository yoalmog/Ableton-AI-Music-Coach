import React, { useEffect } from 'react';
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
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  X,
  Monitor,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ViewType } from '../../types';
import { Tooltip } from '../common/Tooltip';
import { getAssetPath } from '../../utils/assetPath';

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  onOpenCoach: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenCoach,
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { t, isRTL } = useLanguage();

  const translate = React.useCallback(
    (key: string) => {
      return t ? t(key) : key;
    },
    [t]
  );

  // Close mobile drawer on Escape or Android back key equivalent
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const sections = React.useMemo(
    () => [
      {
        categoryKey: 'nav.area.learn',
        items: [
          {
            id: 'simulator' as ViewType,
            labelKey: 'nav.simulator',
            descKey: 'sidebar.simulator',
            icon: <Monitor className="w-4 h-4 text-[#FFE853]" />,
          },
          {
            id: 'visualcoach' as ViewType,
            labelKey: 'nav.visualcoach',
            descKey: 'sidebar.visualcoach',
            icon: <Monitor className="w-4 h-4 text-[#90FF00]" />,
          },
          {
            id: 'classroom' as ViewType,
            labelKey: 'nav.classroom',
            descKey: 'sidebar.classroom',
            icon: <Sparkles className="w-4 h-4 text-amber-400" />,
          },
          {
            id: 'lessons' as ViewType,
            labelKey: 'nav.lessons',
            descKey: 'sidebar.lessons',
            icon: <GraduationCap className="w-4 h-4 text-[#00E5FF]" />,
          },
          {
            id: 'coursemap' as ViewType,
            labelKey: 'Course Map',
            descKey: 'Visual Course Map',
            icon: <Layers className="w-4 h-4 text-[#00E5FF]" />,
          },
          {
            id: 'buildtrack' as ViewType,
            labelKey: 'Build Track',
            descKey: '13-Stage Track Builder',
            icon: <Sparkles className="w-4 h-4 text-[#90FF00]" />,
          },
          {
            id: 'theory' as ViewType,
            labelKey: 'nav.theory',
            descKey: 'sidebar.theory',
            icon: <BookOpen className="w-4 h-4 text-[#A0A0A0]" />,
          },
          {
            id: 'practice' as ViewType,
            labelKey: 'nav.practice',
            descKey: 'sidebar.practice',
            icon: <Award className="w-4 h-4 text-[#A0A0A0]" />,
          },
          {
            id: 'glossary' as ViewType,
            labelKey: 'Glossary',
            descKey: 'Producer Terms Glossary',
            icon: <BookOpen className="w-4 h-4 text-[#a855f7]" />,
          },
        ],
      },
      {
        categoryKey: 'nav.area.create',
        items: [
          {
            id: 'midi' as ViewType,
            labelKey: 'nav.midi',
            descKey: 'sidebar.midi',
            icon: <Music2 className="w-4 h-4 text-[#90FF00]" />,
          },
          {
            id: 'drums' as ViewType,
            labelKey: 'nav.drums',
            descKey: 'sidebar.drums',
            icon: <Grid className="w-4 h-4 text-[#00E5FF]" />,
          },
          {
            id: 'bass' as ViewType,
            labelKey: 'nav.bass',
            descKey: 'sidebar.bass',
            icon: <Radio className="w-4 h-4 text-[#90FF00]" />,
          },
          {
            id: 'sounddesign' as ViewType,
            labelKey: 'nav.sounddesign',
            descKey: 'sidebar.sounddesign',
            icon: <Sliders className="w-4 h-4 text-[#a855f7]" />,
          },
        ],
      },
      {
        categoryKey: 'nav.area.listen',
        items: [
          {
            id: 'eartraining' as ViewType,
            labelKey: 'nav.eartraining',
            descKey: 'sidebar.eartraining',
            icon: <Headphones className="w-4 h-4 text-[#00E5FF]" />,
          },
          {
            id: 'analyzer' as ViewType,
            labelKey: 'nav.analyzer',
            descKey: 'sidebar.analyzer',
            icon: <Activity className="w-4 h-4 text-[#00E5FF]" />,
          },
          {
            id: 'mixassistant' as ViewType,
            labelKey: 'nav.mixassistant',
            descKey: 'sidebar.mixassistant',
            icon: <CheckSquare className="w-4 h-4 text-[#90FF00]" />,
          },
        ],
      },
      {
        categoryKey: 'nav.area.coach',
        items: [
          {
            id: 'producer' as ViewType,
            labelKey: 'nav.producer',
            descKey: 'sidebar.progression',
            icon: <Sparkles className="w-4 h-4 text-[#90FF00]" />,
          },
          {
            id: 'prompts' as ViewType,
            labelKey: 'nav.prompts',
            descKey: 'sidebar.prompts',
            icon: <MessageSquare className="w-4 h-4 text-[#A0A0A0]" />,
          },
        ],
      },
      {
        categoryKey: 'nav.area.mytrack',
        items: [
          {
            id: 'dashboard' as ViewType,
            labelKey: 'nav.dashboard',
            descKey: 'sidebar.overview',
            icon: <LayoutDashboard className="w-4 h-4 text-[#A0A0A0]" />,
          },
          {
            id: 'arrangement' as ViewType,
            labelKey: 'nav.arrangement',
            descKey: 'sidebar.arrangement',
            icon: <Layers className="w-4 h-4 text-[#90FF00]" />,
          },
          {
            id: 'versions' as ViewType,
            labelKey: 'nav.versions',
            descKey: 'sidebar.versions',
            icon: <FolderGit2 className="w-4 h-4 text-[#A0A0A0]" />,
          },
          {
            id: 'settings' as ViewType,
            labelKey: 'nav.settings',
            descKey: 'sidebar.settings',
            icon: <Settings className="w-4 h-4 text-[#A0A0A0]" />,
          },
        ],
      },
    ],
    [translate]
  );

  const handleItemSelect = (view: ViewType) => {
    onSelectView(view);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar / Mobile Slide-Out Drawer */}
      <aside
        className={`
          fixed md:static top-0 bottom-0 z-50
          ${isRTL ? 'right-0' : 'left-0'}
          ${isCollapsed ? 'w-16' : 'w-[80vw] max-w-[320px] md:w-60'}
          bg-[#151515] border-r border-[#333] flex flex-col justify-between select-none shrink-0 font-sans h-full overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${
            isOpen
              ? 'translate-x-0'
              : isRTL
              ? 'translate-x-full md:translate-x-0'
              : '-translate-x-full md:translate-x-0'
          }
        `}
      >
        <div className="p-3 space-y-3">
          {/* Mobile Header / Desktop Collapse Header */}
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-[#282828]">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <img
                  src={getAssetPath('branding/symbol.png')}
                  alt="AAMC"
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = getAssetPath('branding/symbol.svg');
                    }
                  }}
                />
                <span className="text-[11px] font-bold text-white tracking-wider font-mono uppercase">
                  AAMC MENU
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 ms-auto">
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="hidden md:flex p-1.5 rounded text-[#888] hover:text-white hover:bg-[#252525] transition-colors"
                  title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                  {isCollapsed ? (
                    isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                  ) : (
                    isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
                  )}
                </button>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="md:hidden p-2 rounded text-[#888] hover:text-white hover:bg-[#252525] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Nav Section Groups */}
          {sections.map((sec) => (
            <div key={sec.categoryKey}>
              {!isCollapsed && (
                <div className="text-[10px] uppercase tracking-widest text-[#666] mb-1 px-2 font-bold font-mono">
                  {translate(sec.categoryKey)}
                </div>
              )}
              <ul className="space-y-0.5">
                {sec.items.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <li key={item.id}>
                      <Tooltip
                        content={translate(item.descKey)}
                        position={isCollapsed ? 'right' : 'top'}
                        delayMs={500}
                        className="w-full"
                      >
                        <button
                          onClick={() => handleItemSelect(item.id)}
                          className={`w-full ${
                            isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-2.5 py-2'
                          } min-h-[44px] md:min-h-[36px] text-xs flex items-center transition-all duration-200 ease-in-out cursor-pointer text-left group ${
                            isActive
                              ? 'bg-[#252525] text-[#90FF00] font-semibold border-l-2 border-[#90FF00] rounded-r shadow-sm'
                              : 'text-[#AAA] hover:bg-[#202020] hover:text-white rounded'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`transition-colors duration-200 ${
                                isActive ? 'text-[#90FF00]' : 'text-[#777] group-hover:text-white'
                              }`}
                            >
                              {item.icon}
                            </span>
                            {!isCollapsed && (
                              <span className="truncate max-w-[170px] text-xs font-sans">
                                {translate(item.labelKey)}
                              </span>
                            )}
                          </div>
                          {!isCollapsed && isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#90FF00] shrink-0 shadow-[0_0_6px_#90FF00]" />
                          )}
                        </button>
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* AI Co-Producer Callout Footer */}
        {!isCollapsed && (
          <div className="p-3 border-t border-[#333] space-y-2 shrink-0 mb-[env(safe-area-inset-bottom)]">
            <button
              onClick={() => {
                onOpenCoach();
                if (onClose) onClose();
              }}
              className="w-full py-2.5 px-3 bg-[#252525] hover:bg-[#2A2A2A] hover:border-[#90FF00] border border-[#444] rounded text-xs text-[#90FF00] font-mono flex items-center justify-between transition-all duration-200 ease-in-out cursor-pointer hover:shadow-[0_0_10px_rgba(144,255,0,0.15)] group min-h-[44px]"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#90FF00] group-hover:scale-110 transition-transform duration-200" />
                <span className="font-sans font-bold">{translate('nav.coach')}</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#90FF00] animate-pulse shadow-[0_0_6px_#90FF00]" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
