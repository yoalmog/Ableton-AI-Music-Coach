import React from 'react';
import { Play, Download, Music, Sparkles } from 'lucide-react';
import { InteractiveMidiExample, MidiNote } from '../../types';
import { audioService } from '../../services/audioService';
import { midiService } from '../../services/midiService';
import { useLanguage } from '../../context/LanguageContext';

interface InteractiveMidiPianoRollProps {
  example: InteractiveMidiExample;
  genre: string;
}

export const InteractiveMidiPianoRoll: React.FC<InteractiveMidiPianoRollProps> = ({
  example,
  genre,
}) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [exportSuccess, setExportSuccess] = React.useState(false);

  // Derive active unique pitches sorted top to bottom
  const pitches = React.useMemo(() => {
    const set = new Set<string>();
    example.notes.forEach((n) => set.add(n.pitch));
    if (set.size === 0) set.add('F#1');
    return Array.from(set);
  }, [example]);

  const handlePlayPattern = () => {
    setIsPlaying(true);
    // Play notes sequence
    example.notes.forEach((n) => {
      const delaySec = (n.time / (example.bpm / 60)) * 0.25;
      if (example.type === 'drum') {
        audioService.playKick(delaySec);
      } else {
        audioService.playPsyBassNote(n.pitch, delaySec, Math.max(0.1, n.duration * 0.2));
      }
    });

    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  };

  const handleExportMidi = async () => {
    const pattern = {
      id: example.id,
      name: example.title.replace(/\s+/g, '_'),
      type: example.type,
      genre: genre as any,
      bpm: example.bpm,
      key: example.key,
      scale: example.scale,
      timeSignature: '4/4',
      notes: example.notes,
      createdAt: new Date().toISOString(),
    };
    await midiService.exportPattern(pattern);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
  };

  return (
    <div className="bg-[#121212] border border-[#2A2A2A] rounded-lg p-4 space-y-3 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222] pb-2.5">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-[#90FF00]" />
          <div>
            <h4 className="text-xs font-bold text-white">{example.title}</h4>
            <p className="text-[10px] text-[#888]">{example.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePlayPattern}
            disabled={isPlaying}
            className="bg-[#252525] hover:bg-[#333] text-[#90FF00] border border-[#444] px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Play className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
            <span>{isPlaying ? 'Auditioning...' : 'Audition Pattern'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportMidi}
            className="bg-[#252525] hover:bg-[#333] text-[#00E5FF] border border-[#444] px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exportSuccess ? t('notifications.midiExported') : t('lessons.exportMidi')}</span>
          </button>
        </div>
      </div>

      {/* Visual Piano Roll Grid */}
      <div className="bg-[#0A0A0A] p-2.5 rounded border border-[#222] space-y-1 overflow-x-auto">
        <div className="text-[9px] font-mono text-[#666] flex justify-between px-1 mb-1">
          <span>Key: {example.key} {example.scale}</span>
          <span>BPM: {example.bpm}</span>
          <span>Grid: 16th Notes</span>
        </div>

        {pitches.map((pitch) => (
          <div key={pitch} className="flex items-center gap-1 text-[10px] font-mono">
            <span className="w-8 text-[#90FF00] font-bold text-right pr-1 shrink-0">{pitch}</span>
            <div className="grid grid-cols-16 gap-1 flex-1">
              {Array.from({ length: 16 }).map((_, stepIdx) => {
                const stepTime = stepIdx * 0.25;
                const activeNote = example.notes.find(
                  (n) => n.pitch === pitch && Math.abs(n.time - stepTime) < 0.1
                );

                return (
                  <div
                    key={stepIdx}
                    className={`h-5 rounded-xs transition-colors flex items-center justify-center text-[8px] font-bold ${
                      activeNote
                        ? 'bg-[#90FF00] text-black shadow-[0_0_8px_rgba(144,255,0,0.4)]'
                        : stepIdx % 4 === 0
                        ? 'bg-[#1F1F1F] border border-[#333]'
                        : 'bg-[#151515]'
                    }`}
                  >
                    {activeNote ? activeNote.velocity : ''}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {example.abletonTips && (
        <div className="flex items-start gap-2 bg-[#181818] p-2 rounded border border-[#262626] text-[10px] text-[#BBB]">
          <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] shrink-0 mt-0.5" />
          <span><strong className="text-white">Ableton Live 12 Tip:</strong> {example.abletonTips}</span>
        </div>
      )}
    </div>
  );
};
