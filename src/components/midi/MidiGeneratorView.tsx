import React from 'react';
import {
  Music2,
  Sparkles,
  Download,
  Play,
  RotateCcw,
  Sliders,
  Check,
  Wand2,
  Square,
  Undo2,
  Redo2,
  Layers,
  Info,
  AlertCircle,
} from 'lucide-react';
import { AAMCProject, GenreType, KeyType, ScaleType, MidiPattern, MidiNote } from '../../types';
import { midiService, parseNoteToMidiNumber, midiNumberToNoteString } from '../../services/midiService';
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
  const { language, t, isRtl } = useLanguage();

  // Generator inputs
  const [genre, setGenre] = React.useState<string>(project.genre || 'Psytrance');
  const [subgenre, setSubgenre] = React.useState<string>('Rolling Bass (K-B-B-B)');
  const [patternType, setPatternType] = React.useState<'bassline' | 'lead' | 'drum' | 'arp' | 'acid' | 'stab'>('bassline');
  const [key, setKey] = React.useState<KeyType>(project.key || 'F#');
  const [scale, setScale] = React.useState<ScaleType>(project.scale || 'Minor');
  const [bpm, setBpm] = React.useState<number>(project.bpm || 144);
  const [energy, setEnergy] = React.useState<number>(8);

  // Status & Execution states
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [justGenerated, setJustGenerated] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [playheadProgress, setPlayheadProgress] = React.useState<number>(0);
  const [exportSuccess, setExportSuccess] = React.useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = React.useState<number>(1.0);
  const playheadAnimRef = React.useRef<number | null>(null);

  // Pattern History Stack for Undo/Redo
  const [history, setHistory] = React.useState<MidiPattern[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState<number>(-1);

  // Initial active pattern setup
  const [activePattern, setActivePattern] = React.useState<MidiPattern>(() => {
    const generated = midiService.generateMusicalPattern({
      type: 'bassline',
      genre: project.genre || 'Psytrance',
      subgenre: 'Rolling Bass (K-B-B-B)',
      bpm: project.bpm || 144,
      key: project.key || 'F#',
      scale: project.scale || 'Minor',
      energy: 8,
      seed: 142055,
    });

    const initialPattern: MidiPattern = {
      id: `pat_${Date.now()}_init`,
      name: generated.name,
      type: 'bassline',
      genre: project.genre || 'Psytrance',
      bpm: project.bpm || 144,
      key: project.key || 'F#',
      scale: project.scale || 'Minor',
      timeSignature: '4/4',
      notes: generated.notes,
      abletonTips: generated.abletonTips || (language === 'he'
        ? 'ב-Ableton Live 12: טען Operator או Drift. הגדר את Osc A לגל Saw, פילטר 24dB LP, התקפה 0ms, דעיכה 160ms.'
        : language === 'es'
        ? 'En Ableton Live 12: inserta Operator o Drift. Configura Osc A en onda Saw, filtro 24dB LP, ataque 0ms y decaimiento 160ms.'
        : 'In Ableton Live 12: insert Operator or Wavetable. Set Osc A to Saw wave, 24dB LP filter, 0ms attack, 160ms decay envelope.'),
      createdAt: new Date().toISOString(),
    };

    return initialPattern;
  });

  // Keep initial pattern in history on first mount
  React.useEffect(() => {
    if (history.length === 0) {
      setHistory([activePattern]);
      setHistoryIndex(0);
    }
  }, []);

  // Update subgenre options when genre changes
  const subgenreOptions = React.useMemo(() => {
    const g = (genre || '').toLowerCase();
    if (g.includes('psy')) {
      return ['Rolling Bass (K-B-B-B)', 'Offbeat Bass', 'Full-On Bass', 'Progressive Bass', 'Psy Triplet'];
    }
    if (g.includes('goa')) {
      return ['Acid Bass', '303-style sequence', 'Goa Arpeggio', 'Goa Gallop'];
    }
    if (g.includes('techno')) {
      return ['Techno Rumble', 'Offbeat Bass', 'Driving Bass', 'Minimal Bass'];
    }
    return ['Groove Bass', 'Synth Bass', 'Arpeggiated Bass', 'Melodic Stabs'];
  }, [genre]);

  // Adjust subgenre selection when options change
  React.useEffect(() => {
    if (!subgenreOptions.includes(subgenre)) {
      setSubgenre(subgenreOptions[0] || 'Rolling Bass (K-B-B-B)');
    }
  }, [genre, subgenreOptions]);

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1.0);

  /**
   * CORE GENERATION ENGINE: Real end-to-end MIDI generation
   */
  const handleGenerateNewPattern = (forcedSeed?: number) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      // 1. Generate new deterministic random seed
      const seed = forcedSeed ?? (Date.now() + Math.floor(Math.random() * 1000000));

      // 2. Synthesize new musical pattern respecting all UI inputs
      const generated = midiService.generateMusicalPattern({
        type: patternType,
        genre,
        subgenre,
        bpm,
        key,
        scale,
        energy,
        seed,
      });

      if (!generated.notes || generated.notes.length === 0) {
        throw new Error(language === 'he' ? 'שגיאה: לא נוצרו תווים בתבנית' : 'Error: No notes generated');
      }

      // 3. Strict musical validation
      const validNotes = generated.notes.filter((n) => {
        const midiNum = parseNoteToMidiNumber(n.pitch);
        return (
          !isNaN(midiNum) &&
          midiNum >= 0 &&
          midiNum <= 127 &&
          !isNaN(n.time) &&
          n.time >= 0 &&
          !isNaN(n.duration) &&
          n.duration > 0 &&
          !isNaN(n.velocity) &&
          n.velocity >= 1 &&
          n.velocity <= 127
        );
      });

      const newPattern: MidiPattern = {
        id: `pat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: generated.name,
        type: patternType,
        genre: genre as GenreType,
        bpm,
        key,
        scale,
        timeSignature: '4/4',
        notes: validNotes,
        abletonTips: generated.abletonTips || (language === 'he'
          ? 'ב-Ableton Live 12, כוון את המכשיר המתאים, פתח פילטר עם מעטפת דעיכה מהירה והשתמש ב-Auto Filter ו-Roar.'
          : language === 'es'
          ? 'En Ableton Live 12, carga el dispositivo adecuado, ajusta el decaimiento del filtro y añade Saturator o Roar.'
          : 'In Ableton Live 12, load the matching synthesizer, shape a fast filter envelope decay, and add Roar / Saturator.'),
        createdAt: new Date().toISOString(),
      };

      // 4. Update active pattern state immediately
      setActivePattern(newPattern);

      // 5. Append to Undo/Redo history stack (limit to last 25)
      setHistory((prevHistory) => {
        const newHist = [...prevHistory.slice(0, historyIndex + 1), newPattern].slice(-25);
        setHistoryIndex(newHist.length - 1);
        return newHist;
      });

      // 6. Update project store
      const updatedMidiList = [newPattern, ...(project.midiPatterns || []).filter((p) => p.id !== newPattern.id)];
      onProjectChange({
        ...project,
        genre: genre as GenreType,
        bpm,
        key,
        scale,
        midiPatterns: updatedMidiList,
        updatedAt: new Date().toISOString(),
      });

      // 7. If currently playing, seamlessly transition audio playback to new pattern
      if (isPlaying) {
        audioService.stopAll();
        audioService.playMidiPattern(newPattern.notes, newPattern.bpm);
      }

      // 8. Provide immediate visual feedback
      setJustGenerated(true);
      setTimeout(() => {
        setJustGenerated(false);
        setIsGenerating(false);
      }, 400);

    } catch (err: any) {
      debugLog.error('Pattern generation error:', err);
      setErrorMessage(err?.message || (language === 'he' ? 'שגיאה ביצירת תבנית MIDI' : 'Error generating MIDI pattern'));
      setIsGenerating(false);
      setJustGenerated(false);
    }
  };

  /**
   * Undo / Previous Pattern
   */
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      const prevPattern = history[prevIdx];
      if (prevPattern) {
        setActivePattern(prevPattern);
        setHistoryIndex(prevIdx);
        if (isPlaying) {
          audioService.stopAll();
          audioService.playMidiPattern(prevPattern.notes, prevPattern.bpm);
        }
      }
    }
  };

  /**
   * Redo / Next Pattern
   */
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const nextPattern = history[nextIdx];
      if (nextPattern) {
        setActivePattern(nextPattern);
        setHistoryIndex(nextIdx);
        if (isPlaying) {
          audioService.stopAll();
          audioService.playMidiPattern(nextPattern.notes, nextPattern.bpm);
        }
      }
    }
  };

  /**
   * Audio Playhead Loop & Playback
   */
  const handlePlayAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setPlayheadProgress(0);
      audioService.stopAll();
      if (playheadAnimRef.current) cancelAnimationFrame(playheadAnimRef.current);
      return;
    }

    if (!activePattern.notes || activePattern.notes.length === 0) return;

    audioService.stopAll();
    audioService.playMidiPattern(activePattern.notes, activePattern.bpm);
    setIsPlaying(true);

    const maxNoteTime = activePattern.notes.reduce((m, n) => Math.max(m, n.time + n.duration), 4);
    const totalBars = Math.max(1, Math.ceil(maxNoteTime / 4));
    const totalBeats = totalBars * 4;
    const durationSec = (totalBeats * 60) / activePattern.bpm;
    const startTime = performance.now();

    const updatePlayhead = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(1, elapsed / durationSec);
      setPlayheadProgress(progress);

      if (progress < 1) {
        playheadAnimRef.current = requestAnimationFrame(updatePlayhead);
      } else {
        setIsPlaying(false);
        setPlayheadProgress(0);
      }
    };

    playheadAnimRef.current = requestAnimationFrame(updatePlayhead);
  };

  React.useEffect(() => {
    return () => {
      if (playheadAnimRef.current) cancelAnimationFrame(playheadAnimRef.current);
      audioService.stopAll();
    };
  }, []);

  /**
   * Single Note Preview on Piano Roll Click
   */
  const handleNoteClick = (note: MidiNote) => {
    const midiNum = parseNoteToMidiNumber(note.pitch);
    if (midiNum >= 48) {
      audioService.playLeadNote(note.pitch, 0, 0.25, note.velocity >= 120);
    } else if (note.pitch.startsWith('C1')) {
      audioService.playKick(0);
    } else if (note.pitch.startsWith('D1')) {
      audioService.playSnare(0);
    } else if (note.pitch.startsWith('A#1') || note.pitch.startsWith('F#1')) {
      audioService.playHiHat(0, note.pitch.startsWith('A#1'));
    } else {
      audioService.playPsyBassNote(note.pitch, 0, 0.22, 900);
    }
  };

  /**
   * Export Handlers
   */
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

  // Piano roll geometry calculations
  const maxNoteTime = React.useMemo(() => {
    if (!activePattern.notes || activePattern.notes.length === 0) return 4;
    return activePattern.notes.reduce((m, n) => Math.max(m, n.time + n.duration), 4);
  }, [activePattern.notes]);

  const totalBars = React.useMemo(() => {
    return Math.max(1, Math.ceil(maxNoteTime / 4));
  }, [maxNoteTime]);

  const totalBeats = totalBars * 4;

  // Extract unique pitch rows sorted highest to lowest
  const pitchRows = React.useMemo(() => {
    if (!activePattern.notes || !activePattern.notes.length) {
      return [parseNoteToMidiNumber(`${key}1`)];
    }
    const midiNums = activePattern.notes.map((n) => parseNoteToMidiNumber(n.pitch));
    const minM = Math.min(...midiNums);
    const maxM = Math.max(...midiNums);

    const spanMin = minM === maxM ? Math.max(24, minM - 2) : minM;
    const spanMax = minM === maxM ? Math.min(96, maxM + 2) : maxM;

    const rows: number[] = [];
    for (let p = spanMax; p >= spanMin; p--) {
      rows.push(p);
    }
    return rows;
  }, [activePattern.notes, key]);

  const rowHeight = Math.max(24, Math.min(36, Math.floor(240 / Math.max(3, pitchRows.length))));
  const gridHeight = pitchRows.length * rowHeight;

  return (
    <div
      id="midi-generator-view-root"
      className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto text-[#E0E0E0] font-sans overflow-x-hidden min-w-0"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
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

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Audio Preview Button */}
          <button
            id="midi-preview-play-btn"
            type="button"
            onClick={handlePlayAudio}
            className={`border px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-wider ${
              isPlaying
                ? 'bg-[#90FF00] text-black border-[#90FF00]'
                : 'bg-[#252525] hover:bg-[#333] text-[#90FF00] border-[#444]'
            }`}
            aria-label={isPlaying ? t('midi.stopPreview') : t('midi.preview')}
          >
            {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? t('midi.stopPreview') : t('midi.preview')}</span>
          </button>

          {/* Export .mid Button */}
          <button
            id="midi-export-btn"
            type="button"
            onClick={handleExportClick}
            className="bg-[#90FF00] hover:bg-[#80e600] text-black px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-wider"
            aria-label={t('midi.exportButton')}
          >
            {exportSuccess ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{exportSuccess ? t('midi.exported') : t('midi.exportButton')}</span>
          </button>
        </div>
      </div>

      {/* Error Alert Display if needed */}
      {errorMessage && (
        <div className="bg-[#2A1515] border border-[#FF4444]/40 p-3.5 rounded-lg flex items-center gap-3 text-xs text-[#FF8888]">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#FF4444]" />
          <span>{errorMessage}</span>
        </div>
      )}

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
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2.5">
            <h3 className="text-[10px] font-bold text-[#888] uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Sliders className="w-3 h-3 text-[#90FF00]" />
              <span>{t('midi.params')}</span>
            </h3>

            {/* History Undo / Redo controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1 rounded bg-[#141414] border border-[#2A2A2A] hover:border-[#444] text-[#AAA] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title={t('midi.undoPattern')}
                aria-label="Undo Pattern"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-[#666] px-1">
                {historyIndex + 1}/{Math.max(1, history.length)}
              </span>
              <button
                type="button"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1 rounded bg-[#141414] border border-[#2A2A2A] hover:border-[#444] text-[#AAA] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title={t('midi.redoPattern')}
                aria-label="Redo Pattern"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Genre Focus Selector */}
            <div>
              <label className="text-xs text-[#AAA] font-semibold block mb-1">
                {t('midi.genre')}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'Psytrance', label: 'Psytrance' },
                  { id: 'Goa', label: 'Goa Trance' },
                  { id: 'Techno', label: 'Techno' },
                  { id: 'Electronic', label: 'Electronic' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGenre(g.id)}
                    className={`py-1.5 px-2 text-xs rounded font-medium text-center transition-colors cursor-pointer border ${
                      genre === g.id
                        ? 'bg-[#252525] text-[#90FF00] border-[#90FF00] font-bold'
                        : 'bg-[#121212] text-[#888] border-[#2A2A2A] hover:text-[#E0E0E0]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subgenre / Profile Selector */}
            <div>
              <label className="text-xs text-[#AAA] font-semibold block mb-1">
                {t('midi.subgenre')}
              </label>
              <select
                value={subgenre}
                onChange={(e) => setSubgenre(e.target.value)}
                className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs font-mono text-[#00E5FF] font-bold focus:outline-none"
                dir="ltr"
              >
                {subgenreOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Pattern Type */}
            <div>
              <label className="text-xs text-[#AAA] font-semibold block mb-1.5">
                {t('midi.patternType')}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['bassline', 'lead', 'drum', 'arp', 'acid', 'stab'] as const).map((tType) => (
                  <button
                    key={tType}
                    type="button"
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
                <label className="text-xs text-[#AAA] font-semibold block mb-1">
                  {t('midi.rootKey')}
                </label>
                <select
                  value={key}
                  onChange={(e) => setKey(e.target.value as KeyType)}
                  className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs font-mono text-[#90FF00] font-bold focus:outline-none"
                  dir="ltr"
                >
                  {(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as KeyType[]).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#AAA] font-semibold block mb-1">
                  {t('midi.scaleMode')}
                </label>
                <select
                  value={scale}
                  onChange={(e) => setScale(e.target.value as ScaleType)}
                  className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs font-mono text-[#00E5FF] font-bold focus:outline-none"
                  dir="ltr"
                >
                  {(['Minor', 'Phrygian', 'Dorian', 'Harmonic Minor', 'Aeolian', 'Major'] as ScaleType[]).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* BPM Tempo Slider */}
            <div>
              <div className="flex justify-between text-xs text-[#AAA] font-semibold mb-1">
                <span>{t('midi.tempo')}</span>
                <span className="font-mono text-[#90FF00] font-bold" dir="ltr">
                  {bpm} BPM
                </span>
              </div>
              <input
                type="range"
                min="120"
                max="160"
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
                <span className="font-mono text-[#90FF00] font-bold" dir="ltr">
                  {energy} / 10
                </span>
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

            {/* Action Buttons: MAIN GENERATE BUTTON */}
            <div className="space-y-2 pt-2 border-t border-[#2A2A2A]">
              <button
                id="generate-new-pattern-btn"
                type="button"
                disabled={isGenerating}
                onClick={(e) => {
                  e.preventDefault();
                  handleGenerateNewPattern();
                }}
                className={`w-full py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer uppercase tracking-wider shadow-lg active:scale-[0.97] select-none ${
                  isGenerating
                    ? 'bg-[#555] text-[#AAA] cursor-not-allowed opacity-80'
                    : justGenerated
                    ? 'bg-[#00E5FF] text-black shadow-[#00E5FF]/25 ring-2 ring-[#00E5FF]'
                    : 'bg-[#90FF00] hover:bg-[#80e600] text-black shadow-[#90FF00]/15'
                }`}
                aria-label={t('midi.generateBtn')}
              >
                {justGenerated ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{t('midi.generated')}</span>
                  </>
                ) : isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-[#AAA]" />
                    <span>{t('midi.generating')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>{t('midi.generateBtn')}</span>
                  </>
                )}
              </button>

              {/* Mutate Variation Button */}
              <button
                id="mutate-variation-btn"
                type="button"
                disabled={isGenerating}
                onClick={(e) => {
                  e.preventDefault();
                  handleGenerateNewPattern(Date.now() + Math.floor(Math.random() * 999999));
                }}
                className="w-full bg-[#222] hover:bg-[#2A2A2A] active:scale-[0.98] text-[#00E5FF] border border-[#333] hover:border-[#00E5FF]/40 py-2.5 rounded font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer uppercase tracking-wider select-none disabled:opacity-50"
                aria-label="Mutate Variation"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'MUTAR VARIACIÓN' : language === 'he' ? 'שנה וריאציה' : 'MUTATE VARIATION'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Piano Roll Visualizer */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#333] rounded-lg p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2A2A2A] pb-3 gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2" dir="ltr">
                <span>{activePattern.name}</span>
                <span className="text-[10px] font-mono bg-[#222] border border-[#333] text-[#90FF00] px-1.5 py-0.5 rounded">
                  {activePattern.genre}
                </span>
              </h3>
              <p className="text-xs text-[#888]" dir="ltr">
                {activePattern.notes.length} {t('midi.events')} • {totalBars} Bars ({totalBeats} Beats) • {activePattern.bpm} BPM
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-[#121212] border border-[#333] text-[#00E5FF] px-2 py-0.5 rounded" dir="ltr">
                {activePattern.key} {activePattern.scale}
              </span>

              {/* Touch Zoom Controls */}
              <div className="flex items-center gap-1 bg-[#121212] border border-[#333] rounded px-1.5 py-0.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="px-2 py-0.5 hover:bg-[#252525] text-[#90FF00] font-bold rounded cursor-pointer"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-1.5 py-0.5 text-[#AAA] hover:text-white text-[10px] uppercase rounded cursor-pointer"
                  title="Reset Zoom"
                  aria-label="Reset Zoom"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="px-2 py-0.5 hover:bg-[#252525] text-[#90FF00] font-bold rounded cursor-pointer"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Visual Piano Roll Grid with Pitch Rows & Playhead */}
          <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] overflow-x-auto touch-scroll-x" dir="ltr">
            <div style={{ minWidth: `${Math.max(100, zoomLevel * (totalBars * 28))}%` }}>
              {/* Dynamic Bar Markers Header */}
              <div className="text-[10px] text-[#777] font-mono mb-2 flex justify-between px-10 border-b border-[#222] pb-1 select-none">
                {Array.from({ length: totalBars }).map((_, barIdx) => (
                  <div key={barIdx} className="flex-1 flex justify-between px-1 border-r border-[#333]/40 last:border-r-0">
                    <span className="font-bold text-[#AAA]">BAR {barIdx + 1}</span>
                    <span className="opacity-40">.2</span>
                    <span className="opacity-40">.3</span>
                    <span className="opacity-40">.4</span>
                  </div>
                ))}
              </div>

              <div
                className="relative bg-[#161616] rounded border border-[#2A2A2A] overflow-hidden flex"
                style={{ height: `${gridHeight}px` }}
              >
                {/* Left Note Pitch Strip */}
                <div className="w-10 bg-[#1A1A1A] border-r border-[#333] flex flex-col justify-between shrink-0 select-none z-10">
                  {pitchRows.map((midiNum) => {
                    const noteStr = midiNumberToNoteString(midiNum);
                    const isSharp = noteStr.includes('#');
                    return (
                      <div
                        key={midiNum}
                        style={{ height: `${rowHeight}px` }}
                        className={`text-[9px] font-mono font-bold flex items-center px-1.5 border-b border-[#252525] ${
                          isSharp ? 'bg-[#141414] text-[#888]' : 'bg-[#1F1F1F] text-[#DDD]'
                        }`}
                      >
                        {noteStr}
                      </div>
                    );
                  })}
                </div>

                {/* Grid Lane Area */}
                <div className="relative flex-1 h-full overflow-hidden">
                  {/* Horizontal Pitch Lane Backgrounds */}
                  {pitchRows.map((midiNum, rowIdx) => {
                    const noteStr = midiNumberToNoteString(midiNum);
                    const isSharp = noteStr.includes('#');
                    return (
                      <div
                        key={midiNum}
                        style={{
                          top: `${rowIdx * rowHeight}px`,
                          height: `${rowHeight}px`,
                        }}
                        className={`absolute inset-x-0 border-b border-[#222] ${
                          isSharp ? 'bg-[#121212]/70' : 'bg-[#181818]/70'
                        }`}
                      />
                    );
                  })}

                  {/* Vertical Beat/16th Grid Lines */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-25 grid"
                    style={{ gridTemplateColumns: `repeat(${totalBeats * 4}, minmax(0, 1fr))` }}
                  >
                    {Array.from({ length: totalBeats * 4 }).map((_, i) => (
                      <div
                        key={i}
                        className={`border-r ${
                          i % 16 === 0 ? 'border-[#888]' : i % 4 === 0 ? 'border-[#555]' : 'border-[#333]'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Playhead Marker */}
                  {isPlaying && (
                    <div
                      style={{ left: `${playheadProgress * 100}%` }}
                      className="absolute inset-y-0 w-0.5 bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] z-20 pointer-events-none transition-none"
                    />
                  )}

                  {/* Render Note Bars with Click-To-Preview */}
                  {activePattern.notes.map((n, idx) => {
                    const midiNum = parseNoteToMidiNumber(n.pitch);
                    const pitchRowIdx = pitchRows.indexOf(midiNum);
                    if (pitchRowIdx === -1) return null;

                    const leftPercent = (n.time / totalBeats) * 100;
                    const widthPercent = Math.max(1.5, (n.duration / totalBeats) * 100);
                    const topPx = pitchRowIdx * rowHeight + 2;
                    const heightPx = rowHeight - 4;
                    const velOpacity = 0.75 + (n.velocity / 127) * 0.25;

                    return (
                      <div
                        key={`${n.pitch}_${n.time}_${idx}`}
                        onClick={() => handleNoteClick(n)}
                        style={{
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`,
                          top: `${topPx}px`,
                          height: `${heightPx}px`,
                          opacity: velOpacity,
                        }}
                        className="absolute bg-[#90FF00] hover:bg-[#A6FF33] text-black rounded-xs text-[9px] font-mono font-bold px-1 flex items-center justify-between shadow border border-black/40 select-none z-10 transition-transform active:scale-95 cursor-pointer"
                        title={`${n.pitch} | Time: ${n.time.toFixed(2)}b | Vel: ${n.velocity} | Dur: ${n.duration.toFixed(2)}b (Click to preview)`}
                      >
                        <span className="truncate">{n.pitch}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Ableton Device Recommendation Tip Box */}
          {activePattern.abletonTips && (
            <div className="bg-[#121212] border border-[#333] p-3.5 rounded space-y-1.5" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="text-[10px] font-bold text-[#90FF00] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>{t('midi.tip')}</span>
              </div>
              <p className="text-xs text-[#BBB] whitespace-pre-wrap leading-relaxed">
                {activePattern.abletonTips}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
