import React, { useState } from 'react';
import { Layers, Plus, RotateCcw, Copy, Edit, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { AAMCProject, AAMCVersion } from '../../types';
import { projectService } from '../../services/projectService';

interface ProjectVersionManagerProps {
  project: AAMCProject;
  onProjectChange: (project: AAMCProject) => void;
}

export const ProjectVersionManager: React.FC<ProjectVersionManagerProps> = ({
  project,
  onProjectChange,
}) => {
  const [newVersionName, setNewVersionName] = useState('');
  const [editingVersionIdx, setEditingVersionIdx] = useState<number | null>(null);

  const versions = project.versions || [];

  const handleCreateVersionSnapshot = () => {
    const nextVerNum = versions.length + 1;
    const vName = newVersionName.trim() || `Version ${nextVerNum} (${project.genre})`;

    const snapshot: AAMCVersion = {
      versionNumber: nextVerNum,
      name: vName,
      timestamp: new Date().toISOString(),
      stageCompleted: project.productionStage || 1,
      projectSnapshot: {
        bpm: project.bpm,
        key: project.key,
        scale: project.scale,
        midiPatterns: [...project.midiPatterns],
        bassSettings: project.bassSettings ? { ...project.bassSettings } : undefined,
        drumPattern: project.drumPattern ? { ...project.drumPattern } : undefined,
        userNotes: project.userNotes,
      },
    };

    const updatedVersions = [snapshot, ...versions];
    const updatedProject: AAMCProject = {
      ...project,
      versions: updatedVersions,
    };

    onProjectChange(updatedProject);
    projectService.saveProject(updatedProject);
    setNewVersionName('');
  };

  const handleRestoreVersion = (ver: AAMCVersion) => {
    if (!window.confirm(`Are you sure you want to restore snapshot "${ver.name}"? Current unsaved edits will be updated to version ${ver.versionNumber}.`)) {
      return;
    }

    const snap = ver.projectSnapshot;
    const restoredProject: AAMCProject = {
      ...project,
      bpm: snap.bpm || project.bpm,
      key: snap.key || project.key,
      scale: snap.scale || project.scale,
      midiPatterns: snap.midiPatterns || project.midiPatterns,
      bassSettings: snap.bassSettings || project.bassSettings,
      drumPattern: snap.drumPattern || project.drumPattern,
      productionStage: ver.stageCompleted || project.productionStage,
      updatedAt: new Date().toISOString(),
    };

    onProjectChange(restoredProject);
    projectService.saveProject(restoredProject);
  };

  const handleDuplicateProject = () => {
    const dupName = `${project.name} (Copy)`;
    const dupProject = projectService.createNewProject(
      dupName,
      project.genre,
      project.bpm,
      project.key,
      project.scale
    );
    dupProject.midiPatterns = [...project.midiPatterns];
    dupProject.bassSettings = project.bassSettings ? { ...project.bassSettings } : undefined;
    dupProject.drumPattern = project.drumPattern ? { ...project.drumPattern } : undefined;

    onProjectChange(dupProject);
    projectService.saveProject(dupProject);
  };

  return (
    <div className="bg-[#181818] border border-[#333] rounded-lg p-5 space-y-5 font-sans">
      <div className="flex items-center justify-between border-b border-[#333] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#90FF00]" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase">Project Version History (.aamc)</h3>
            <span className="text-[10px] font-mono text-[#888]">Non-destructive Version Snapshots</span>
          </div>
        </div>

        <button
          onClick={handleDuplicateProject}
          className="px-3 py-1.5 bg-[#252525] hover:bg-[#333] border border-[#444] text-[#00E5FF] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>DUPLICATE PROJECT</span>
        </button>
      </div>

      {/* Create Version Form */}
      <div className="flex items-center gap-2 bg-[#121212] p-3 rounded border border-[#222]">
        <input
          type="text"
          value={newVersionName}
          onChange={(e) => setNewVersionName(e.target.value)}
          placeholder="Snapshot Name (e.g. 'v2 After Kick & Bass Mix')"
          className="flex-1 bg-[#181818] border border-[#333] rounded px-3 py-1.5 text-xs text-white"
        />
        <button
          onClick={handleCreateVersionSnapshot}
          className="px-4 py-1.5 bg-[#90FF00] hover:bg-[#a6ff26] text-black font-bold text-xs rounded flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>SAVE VERSION SNAPSHOT</span>
        </button>
      </div>

      {/* Version Snapshots List */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-[#666] uppercase block font-bold">SAVED SNAPSHOTS ({versions.length})</span>

        {versions.length === 0 ? (
          <div className="p-4 bg-[#121212] rounded border border-[#222] text-xs text-[#888] text-center">
            No version snapshots saved yet. Click above to save a snapshot before making major edits!
          </div>
        ) : (
          versions.map((ver) => (
            <div
              key={ver.versionNumber}
              className="p-3 bg-[#121212] rounded border border-[#2A2A2A] flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#90FF00]">V{ver.versionNumber}</span>
                  <strong className="text-white">{ver.name}</strong>
                  <span className="text-[10px] font-mono text-[#888] bg-[#181818] px-2 py-0.5 rounded border border-[#333]">
                    STAGE {ver.stageCompleted}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#666]">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(ver.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => handleRestoreVersion(ver)}
                className="px-3 py-1 bg-[#252525] hover:bg-[#333] border border-[#444] text-[#90FF00] font-mono text-[11px] rounded flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESTORE SNAPSHOT</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
