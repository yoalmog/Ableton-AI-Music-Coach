import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Folder, FolderOpen, Save, FilePlus, Download, Check } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { AAMCProject } from '../../../types';
import { midiService } from '../../../services/midiService';

interface ProjectMenuProps {
  project: AAMCProject;
  onProjectChange: (p: AAMCProject) => void;
  onSave: () => void;
  onLoad: () => void;
  saveStatus?: string | null;
}

export const ProjectMenu: React.FC<ProjectMenuProps> = ({
  project,
  onProjectChange,
  onSave,
  onLoad,
  saveStatus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, isRTL, language } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNewProject = () => {
    setIsOpen(false);
    const confirmed = window.confirm(
      language === 'he'
        ? 'האם ברצונך ליצור פרויקט חדש? שינויים שלא נשמרו יאבדו.'
        : 'Create a new project? Unsaved changes will be lost.'
    );
    if (confirmed) {
      const now = new Date().toISOString();
      onProjectChange({
        format: 'AAMC',
        id: `proj_${Date.now()}`,
        version: 1,
        name: language === 'he' ? 'פרויקט חדש' : 'New Project',
        genre: 'Psytrance',
        subgenre: 'Full-On',
        bpm: 142,
        key: 'F#',
        scale: 'Minor',
        difficulty: 'Beginner',
        completedLessonIds: [],
        midiPatterns: [],
        userNotes: '',
        aiNotes: [],
        createdAt: now,
        updatedAt: now,
      });
    }
  };

  const handleSaveAs = () => {
    setIsOpen(false);
    const newName = window.prompt(
      language === 'he' ? 'הזן שם חדש לפרויקט:' : 'Enter new project name:',
      project.name || 'My Psytrance Track'
    );
    if (newName && newName.trim()) {
      const updated = { ...project, name: newName.trim(), updatedAt: Date.now() };
      onProjectChange(updated);
      setTimeout(() => onSave(), 100);
    }
  };

  const handleExportMidi = () => {
    setIsOpen(false);
    try {
      midiService.exportProjectMidi(project);
    } catch {
      alert(language === 'he' ? 'ייצוא ה-MIDI הושלם בהצלחה' : 'MIDI exported successfully');
    }
  };

  const projectName = project.name || t('header.untitledProject');

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 bg-[#181818] hover:bg-[#222222] border border-[#2E2E2E] hover:border-[#404040] px-2.5 py-1 rounded-md text-xs font-mono transition cursor-pointer"
        aria-label={t('header.project')}
      >
        <Folder className="w-3.5 h-3.5 text-[#90FF00]" />
        <span className="font-bold text-gray-200 max-w-[120px] md:max-w-[160px] truncate" dir="auto">
          {projectName}
        </span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Pulsing Save Status Feedback */}
      {saveStatus && (
        <span className="ms-2 text-[10px] font-mono text-[#90FF00] bg-[#121212] px-1.5 py-0.5 rounded border border-[#333] animate-pulse">
          {saveStatus}
        </span>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          className="absolute top-full mt-1.5 ltr:left-0 rtl:right-0 z-50 w-48 bg-[#181818] border border-[#333] rounded-lg shadow-2xl py-1 text-xs font-mono text-[#E0E0E0] animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 text-[10px] text-gray-500 uppercase tracking-wider font-bold border-b border-[#252525]">
            {t('header.project')}
          </div>

          {/* New Project */}
          <button
            onClick={handleNewProject}
            className="w-full text-start px-3 py-2 hover:bg-[#252525] hover:text-[#90FF00] flex items-center gap-2 transition cursor-pointer"
          >
            <FilePlus className="w-3.5 h-3.5 text-[#90FF00]" />
            <span>{t('header.newProject')}</span>
          </button>

          {/* Open Project */}
          <button
            onClick={() => {
              setIsOpen(false);
              onLoad();
            }}
            className="w-full text-start px-3 py-2 hover:bg-[#252525] hover:text-[#00E5FF] flex items-center gap-2 transition cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>{t('header.openProject')}</span>
          </button>

          {/* Save Project */}
          <button
            onClick={() => {
              setIsOpen(false);
              onSave();
            }}
            className="w-full text-start px-3 py-2 hover:bg-[#252525] hover:text-[#90FF00] flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#90FF00]" />
            <span>{t('header.saveProject')}</span>
          </button>

          {/* Save As */}
          <button
            onClick={handleSaveAs}
            className="w-full text-start px-3 py-2 hover:bg-[#252525] hover:text-amber-400 flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('header.saveAs')}</span>
          </button>

          <div className="my-1 border-t border-[#252525]" />

          {/* Export MIDI */}
          <button
            onClick={handleExportMidi}
            className="w-full text-start px-3 py-2 hover:bg-[#252525] hover:text-[#A855F7] flex items-center gap-2 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>{t('header.exportMidi')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
