import React from 'react';
import { Activity, Clock, Layers, Music2 } from 'lucide-react';
import { AAMCProject } from '../../types';
import { projectService } from '../../services/projectService';
import { useLanguage } from '../../context/LanguageContext';

interface ProjectMetricsWidgetProps {
  project?: AAMCProject;
  onNavigate: (view: any) => void;
}

export const ProjectMetricsWidget: React.FC<ProjectMetricsWidgetProps> = ({
  project: propProject,
  onNavigate,
}) => {
  const { t, isRtl } = useLanguage();
  
  // Pull active project data or fallback to a default project instance from projectService
  const project = propProject || projectService.createNewProject();

  // Calculate track count based on midiPatterns, drumPattern, and project setup
  const midiTracksCount = project.midiPatterns?.length || 1;
  const drumRacksCount = project.drumPattern ? 1 : 0;
  const audioTracksCount = 2; // e.g., Master channel / Reference track
  const totalTrackCount = midiTracksCount + drumRacksCount + audioTracksCount;

  // Calculate estimated playback duration based on tempo (BPM) and arrangement bars
  const bpm = project.bpm || 142;
  const totalBars = 64; // 64 bars arrangement standard
  const secondsPerBar = (60 / bpm) * 4;
  const totalSeconds = Math.round(totalBars * secondsPerBar);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const estimatedPlaybackDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Current arrangement section completion percentage
  const completedSections = 4; // Intro, Build, Drop, Outro
  const totalSections = 6;
  const arrangementPercentage = Math.round((completedSections / totalSections) * 100);

  return (
    <div
      className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5 space-y-4 shadow-lg flex flex-col justify-between"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00E5FF]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Project Progression & Telemetry
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-[#121212] text-[#90FF00] px-2.5 py-0.5 rounded-full border border-[#333]">
          Live Read-Only
        </span>
      </div>

      <p className="text-xs text-[#888] leading-relaxed">
        Metadata for <span className="text-white font-semibold">{project.name}</span> ({project.genre}) in Ableton Live 12.
      </p>

      {/* 3 Read-only Metric Cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total Track Count */}
        <div
          onClick={() => onNavigate('arrangement')}
          className="bg-[#121212] border border-[#2A2A2A] hover:border-[#444] p-3 rounded-lg cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#888] mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Tracks</span>
            <Music2 className="w-3.5 h-3.5 text-[#00E5FF] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-mono font-bold text-white">{totalTrackCount}</div>
          <div className="text-[9px] text-[#777] mt-0.5">{midiTracksCount} MIDI, {drumRacksCount} Drum</div>
        </div>

        {/* Estimated Playback Duration */}
        <div
          onClick={() => onNavigate('arrangement')}
          className="bg-[#121212] border border-[#2A2A2A] hover:border-[#444] p-3 rounded-lg cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#888] mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Duration</span>
            <Clock className="w-3.5 h-3.5 text-[#90FF00] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-mono font-bold text-[#90FF00]">{estimatedPlaybackDuration}</div>
          <div className="text-[9px] text-[#777] mt-0.5">{bpm} BPM ({totalBars} bars)</div>
        </div>

        {/* Arrangement Completion Percentage */}
        <div
          onClick={() => onNavigate('arrangement')}
          className="bg-[#121212] border border-[#2A2A2A] hover:border-[#444] p-3 rounded-lg cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#888] mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Arrangement</span>
            <Layers className="w-3.5 h-3.5 text-[#a855f7] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-mono font-bold text-[#a855f7]">{arrangementPercentage}%</div>
          <div className="text-[9px] text-[#777] mt-0.5">{completedSections} of {totalSections} sections</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[10px] font-mono text-[#888]">
          <span>Arrangement Section Completion</span>
          <span className="text-[#90FF00]">{arrangementPercentage}%</span>
        </div>
        <div className="w-full bg-[#121212] h-2 rounded-full overflow-hidden border border-[#333]">
          <div
            className="bg-gradient-to-r from-[#00E5FF] to-[#90FF00] h-full rounded-full transition-all duration-500"
            style={{ width: `${arrangementPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
