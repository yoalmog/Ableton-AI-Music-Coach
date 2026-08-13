import React from 'react';
import {
  Music2,
  Sparkles,
  Download,
  Play,
  RotateCcw,
  Volume2,
  Sliders,
  Check
} from 'lucide-react';
import { AAMCProject, GenreType, KeyType, ScaleType, MidiPattern } from '../../types';
import { aiService } from '../../services/aiService';
import { midiService } from '../../services/midiService';
import { audioService } from '../../services/audioService';
import { useLanguage } from '../../context/LanguageContext';
import { debugLog } from '../../utils/debug';
import { ExportConfirmationModal } from '../common/ExportConfirmationModal';

interface MidiGeneratorViewProps {
  project: AAMCProject;
  onProjectChange: (p: AAMCProject) => void;
}

export const MidiGeneratorView: React.FC<MidiGeneratorViewProps> = ({
  project,
  onProjectChange,
}) => {
  const { t, isRtl } = useLanguage();
  const translate = React.useCallback((k: string) => (t ? t(k) : k), [t]);
  const [patternType, setPatternType] = React.useState<'bassline' | 'lead' | 'drum' | 'arp' | 'acid'>('bassline');
  const [key, setKey] = React.useState<KeyType>(project.key || 'F#');
  const [scale, setScale] = React.useState<ScaleType>(project.scale || 'Minor');
  const [bpm, setBpm] = React.useState<number>(project.bpm || 142);
  const [energy, setEnergy] = React.useState<number>(8);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [exportSuccess, setExportSuccess] = React.useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState<number>(1.0);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1.0);

  // Active Pattern State
  const [activePattern, setActivePattern] = React.useState<MidiPattern>(() => {
    const defaultNotes = midiService.generatePsyBassline('K-B-B-B', key, bpm);
    return {
      id: `pat_${Date.now()}`,
      name: `${project.genre} Rolling Bassline (${key})`,
      type: 'bassline',
      genre: project.genre,
      bpm,
      key,
      scale,
      timeSignature: '4/4',
      notes: defaultNotes,
      abletonTips: 'Insert Operator or Wavetable in Ableton 12. Saw Osc, 24dB LP filter, 160ms decay envelope.',
      createdAt: new Date().toISOString(),
    };
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await aiService.generatePattern(patternType, project.genre, bpm, key, scale, energy);
      setActivePattern(res.pattern);

      // Save pattern into active project
      const updatedMidiList = [res.pattern, ...project.midiPatterns.filter((p) => p.id !== res.pattern.id)];
      onProjectChange({
        ...project,
        midiPatterns: updatedMidiList,
      });
    } catch (err) {
      debugLog.error('Pattern generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayAudio = () => {
    audioService.playMidiPattern(activePattern.notes, activePattern.bpm);
  };

  const handleExportClick = () => {
    setIsExportModalOpen(true);
  };

  const handleConfirmExport = async () => {
    const ok = await midiService.exportPattern(activePattern);
    if (ok) {
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2500);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto text-[#E0E0E0] font-sans overflow-x-hidden min-w-0" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A1A1A] border border-[#333] p-4 sm:p-5 rounded-lg">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest font-mono">
            <Music2 className="w-3.5 h-3.5" />
            <span dir="ltr">{t('midi.subtitle')}</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">{t('midi.title')}</h1>
          <p className="text-xs text-[#888] mt-0.5">
            {t('midi.desc')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePlayAudio}
            className="bg-[#252525] hover:bg-[#333] text-[#90FF00] border border-[#444] px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-wider"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{t('midi.preview')}</span>
          </button>

          <button
            onClick={handleExportClick}
            className="bg-[#90FF00] hover:bg-[#80e600] text-black px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-wider"
          >
            {exportSuccess ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{exportSuccess ? t('midi.exported') : t('midi.exportButton')}</span>
          </button>
        </div>
      </div>

      {/* Export Confirmation Modal */}
      <ExportConfirmationModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onConfirm={handleConfirmExport}
        exportType="MIDI"
        fileName={`${activePattern.name.replace(/\s+/g, '_')}.mid`}
        fileSettings={{
          bpm: activePattern.bpm,
          key: activePattern.key,
          scale: activePattern.scale,
          genre: activePattern.genre,
          tracksCount: 1,
        }}
        destinationPath="C:\\Users\\Producer\\Documents\\Ableton Live 12\\User Library\\Presets\\MIDI Clips\\"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Sidebar */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-4">
          <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-widest">
            {t('midi.params')}
          </h3>

          <div className="space-y-4">
            {/* Type */}
            <div>
              <label className="text-xs text-[#AAA] font-semibold block mb-1.5">{t('midi.patternType')}</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['bassline', 'lead', 'drum', 'arp', 'acid'] as const).map((tType) => (
                  <button
                    key={tType}
                    onClick={() => setPatternType(tType)}
                    className={`py-1.5 text-xs rounded font-bold transition-colors cursor-pointer border ${
                      patternType === tType
                        ? 'bg-[#252525] text-[#90FF00] border-[#90FF00]'
                        : 'bg-[#121212] text-[#888] border-[#2A2A2A] hover:text-[#E0E0E0]'
                    }`}
                  >
                    {t(`midi.type.${tType}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Key & Scale */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs text-[#AAA] font-semibold block mb-1">{t('midi.rootKey')}</label>
                <select
                  value={key}
                  onChange={(e) => setKey(e.target.value as KeyType)}
                  className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs font-mono text-[#90FF00] font-bold focus:outline-none"
                  dir="ltr"
                >
                  {(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as KeyType[]).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#AAA] font-semibold block mb-1">{t('midi.scaleMode')}</label>
                <select
                  value={scale}
                  onChange={(e) => setScale(e.target.value as ScaleType)}
                  className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs font-mono text-[#00E5FF] font-bold focus:outline-none"
                  dir="ltr"
                >
                  {(['Minor', 'Phrygian', 'Dorian', 'Harmonic Minor', 'Aeolian', 'Major'] as ScaleType[]).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* BPM */}
            <div>
              <div className="flex justify-between text-xs text-[#AAA] font-semibold mb-1">
                <span>{t('midi.tempo')}</span>
                <span className="font-mono text-[#90FF00] font-bold" dir="ltr">{bpm} BPM</span>
              </div>
              <input
                type="range"
                min="120"
                max="155"
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value, 10))}
                className="w-full accent-[#90FF00] cursor-pointer"
                dir="ltr"
              />
            </div>

            {/* Energy Slider */}
            <div>
              <div className="flex justify-between text-xs text-[#AAA] font-semibold mb-1">
                <span>{t('midi.energy')}</span>
                <span className="font-mono text-[#90FF00] font-bold" dir="ltr">{energy} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value, 10))}
                className="w-full accent-[#90FF00] cursor-pointer"
                dir="ltr"
              />
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-[#90FF00] hover:bg-[#80e600] text-black py-2.5 rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer uppercase tracking-wider disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>{isGenerating ? t('midi.generating') : t('midi.generateBtn')}</span>
            </button>
          </div>
        </div>

        {/* Piano Roll Visualizer */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#333] rounded-lg p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2A2A2A] pb-3 gap-2">
            <div>
              <h3 className="text-sm font-bold text-white" dir="ltr">{activePattern.name}</h3>
              <p className="text-xs text-[#888]" dir="ltr">
                {activePattern.notes.length} {t('midi.events')} • {activePattern.timeSignature} {t('midi.time')} • {activePattern.bpm} BPM
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-[#121212] border border-[#333] text-[#00E5FF] px-2 py-0.5 rounded" dir="ltr">
                {activePattern.key} {activePattern.scale}
              </span>

              {/* Touch Zoom Controls */}
              <div className="flex items-center gap-1 bg-[#121212] border border-[#333] rounded px-1.5 py-0.5 font-mono text-xs">
                <button
                  onClick={handleZoomOut}
                  className="px-2 py-0.5 hover:bg-[#252525] text-[#90FF00] font-bold rounded cursor-pointer"
                  title="Zoom Out"
                >
                  -
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-1.5 py-0.5 text-[#AAA] hover:text-white text-[10px] uppercase rounded cursor-pointer"
                  title="Reset Zoom"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  onClick={handleZoomIn}
                  className="px-2 py-0.5 hover:bg-[#252525] text-[#90FF00] font-bold rounded cursor-pointer"
                  title="Zoom In"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Visual Piano Roll Grid */}
          <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] overflow-x-auto touch-scroll-x" dir="ltr">
            <div style={{ minWidth: `${Math.max(100, zoomLevel * 100)}%` }}>
              <div className="text-[10px] text-[#666] font-mono mb-2 flex justify-between">
                <span>BAR 1 (Beat 1)</span>
                <span>Beat 2</span>
                <span>Beat 3</span>
                <span>Beat 4</span>
                <span>BAR 2</span>
              </div>

              <div className="relative h-48 bg-[#181818] rounded border border-[#2A2A2A] p-2 overflow-hidden flex flex-col justify-between">
                {/* Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-16 pointer-events-none opacity-20 divide-x divide-[#444]">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} />
                  ))}
                </div>

                {/* Render Note Bars */}
                {activePattern.notes.map((n, idx) => {
                  const leftPercent = (n.time / 4) * 100;
                  const widthPercent = Math.max(4, (n.duration / 4) * 100);
                  return (
                    <div
                      key={idx}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                        top: `${(idx % 6) * 28 + 8}px`,
                      }}
                      className="absolute h-6 bg-[#90FF00] text-black rounded-xs text-[10px] font-mono font-bold px-1 flex items-center justify-between shadow border border-black/30 select-none"
                      title={`${n.pitch} (Beat ${n.time.toFixed(2)}, Velocity ${n.velocity})`}
                    >
                      <span>{n.pitch}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ableton Device Recommendation Tip Box */}
          {activePattern.abletonTips && (
            <div className="bg-[#121212] border border-[#333] p-3.5 rounded space-y-1">
              <div className="text-[10px] font-bold text-[#90FF00] uppercase tracking-wider font-mono" dir="ltr">
                {t('midi.tip')}
              </div>
              <p className="text-xs text-[#BBB] font-mono leading-relaxed" dir="ltr">
                {activePattern.abletonTips}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
