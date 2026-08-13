import React from 'react';
import {
  Radio,
  Play,
  Download,
  Sliders,
  Sparkles,
  Check,
  Volume2
} from 'lucide-react';
import { BassPatternType, KeyType, AAMCProject, BassSettings } from '../../types';
import { audioService } from '../../services/audioService';
import { midiService } from '../../services/midiService';
import { useLanguage } from '../../context/LanguageContext';

interface BassGeneratorViewProps {
  project: AAMCProject;
  onProjectChange: (p: AAMCProject) => void;
}

export const BassGeneratorView: React.FC<BassGeneratorViewProps> = ({
  project,
  onProjectChange,
}) => {
  const { t } = useLanguage();
  const [settings, setSettings] = React.useState<BassSettings>(() => ({
    patternType: 'K-B-B-B',
    rootKey: project.key || 'F#',
    octave: 1,
    cutoffHz: 650,
    decayMs: 165,
    resonance: 15,
    subLevel: 0.8,
    driveAmount: 25,
    sidechainAmount: 90,
  }));

  const [exportSuccess, setExportSuccess] = React.useState(false);

  const patternTypes: { type: BassPatternType; name: string; desc: string }[] = [
    { type: 'K-B-B-B', name: '16th Rolling Bass', desc: 'Standard Full-On Psytrance machine rolling bassline.' },
    { type: 'Goa Gallop', name: 'Goa Gallop', desc: 'Iconic triplet-feeling driving acid gallop.' },
    { type: 'Triplet', name: 'Psy Triplet', desc: 'Hypnotic triplet bounce for high-energy drops.' },
    { type: 'Techno Rumble', name: 'Techno Offbeat Sub', desc: 'Deep driving offbeat rumble for Peak-Time Techno.' },
  ];

  const handlePlayBassPreview = () => {
    // Play Kick + 3 bass notes to demonstrate the rolling feel
    audioService.playKick(0);
    audioService.playPsyBassNote(`${settings.rootKey}1`, 0.15, settings.decayMs / 1000, settings.cutoffHz);
    audioService.playPsyBassNote(`${settings.rootKey}1`, 0.30, settings.decayMs / 1000, settings.cutoffHz);
    audioService.playPsyBassNote(`${settings.rootKey}1`, 0.45, settings.decayMs / 1000, settings.cutoffHz);
  };

  const handleExportBassMidi = async () => {
    const notes = midiService.generatePsyBassline(settings.patternType, settings.rootKey, project.bpm);
    const pattern = {
      id: `bass_${Date.now()}`,
      name: `${project.genre}_${settings.patternType}_${settings.rootKey}1`,
      type: 'bassline' as const,
      genre: project.genre,
      bpm: project.bpm,
      key: settings.rootKey,
      scale: project.scale,
      timeSignature: '4/4',
      notes,
      abletonTips: `In Ableton Live 12: Load Operator. Osc A = Saw, 24dB LP Filter Cutoff = ${settings.cutoffHz}Hz, Filter Env Decay = ${settings.decayMs}ms. Add Auto Filter with Sidechain from Kick!`,
      createdAt: new Date().toISOString(),
    };

    const ok = await midiService.exportPattern(pattern);
    if (ok) {
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2500);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto text-[#E0E0E0] font-sans overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A1A1A] border border-[#333] p-4 sm:p-5 rounded-lg">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#90FF00] uppercase tracking-widest font-mono">
            <Radio className="w-3.5 h-3.5" />
            <span>{t('bassGen.banner')}</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">{t('bassGen.title')}</h1>
          <p className="text-xs text-[#888] mt-0.5">
            {t('bassGen.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePlayBassPreview}
            className="bg-[#252525] hover:bg-[#333] text-[#90FF00] border border-[#444] px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-wider"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{t('bassGen.preview')}</span>
          </button>

          <button
            onClick={handleExportBassMidi}
            className="bg-[#90FF00] hover:bg-[#80e600] text-black px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-wider"
          >
            {exportSuccess ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{exportSuccess ? t('bassGen.exported') : t('bassGen.export')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pattern Selection */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-3">
          <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-widest">
            {t('bassGen.rhythm')}
          </h3>

          <div className="space-y-2">
            {patternTypes.map((pt) => {
              const isSelected = settings.patternType === pt.type;
              return (
                <button
                  key={pt.type}
                  onClick={() => setSettings({ ...settings, patternType: pt.type })}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#252525] border-[#90FF00] text-white font-bold'
                      : 'bg-[#121212] border-[#2A2A2A] text-[#888] hover:bg-[#181818] hover:text-[#E0E0E0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{pt.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101010] text-[#90FF00] border border-[#333]">
                      {pt.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#888] mt-1">{pt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Synth Parameter Knobs / Sliders */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">{t('bassGen.synthParams')}</h3>
            <span className="text-xs font-mono text-[#90FF00]">Target Tuning: {settings.rootKey}1</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cutoff Hz */}
            <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#E0E0E0]">
                <span>{t('bassGen.cutoff')}</span>
                <span className="font-mono text-[#90FF00]">{settings.cutoffHz} Hz</span>
              </div>
              <input
                type="range"
                min="200"
                max="2500"
                value={settings.cutoffHz}
                onChange={(e) => setSettings({ ...settings, cutoffHz: parseInt(e.target.value, 10) })}
                className="w-full accent-[#90FF00] cursor-pointer"
              />
              <p className="text-[10px] text-[#888]">
                {t('bassGen.cutoffHint')}
              </p>
            </div>

            {/* Envelope Decay */}
            <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#E0E0E0]">
                <span>{t('bassGen.decay')}</span>
                <span className="font-mono text-[#00E5FF]">{settings.decayMs} ms</span>
              </div>
              <input
                type="range"
                min="80"
                max="300"
                value={settings.decayMs}
                onChange={(e) => setSettings({ ...settings, decayMs: parseInt(e.target.value, 10) })}
                className="w-full accent-[#00E5FF] cursor-pointer"
              />
              <p className="text-[10px] text-[#888]">
                {t('bassGen.decayHint')}
              </p>
            </div>

            {/* Drive / Saturation */}
            <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#E0E0E0]">
                <span>{t('bassGen.drive')}</span>
                <span className="font-mono text-[#90FF00]">+{settings.driveAmount} %</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.driveAmount}
                onChange={(e) => setSettings({ ...settings, driveAmount: parseInt(e.target.value, 10) })}
                className="w-full accent-[#90FF00] cursor-pointer"
              />
              <p className="text-[10px] text-[#888]">
                {t('bassGen.driveHint')}
              </p>
            </div>

            {/* Sidechain Depth */}
            <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#E0E0E0]">
                <span>{t('bassGen.sidechain')}</span>
                <span className="font-mono text-[#00E5FF]">{settings.sidechainAmount} %</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sidechainAmount}
                onChange={(e) => setSettings({ ...settings, sidechainAmount: parseInt(e.target.value, 10) })}
                className="w-full accent-[#00E5FF] cursor-pointer"
              />
              <p className="text-[10px] text-[#888]">
                {t('bassGen.sidechainHint')}
              </p>
            </div>
          </div>

          {/* Ableton Live Setup Summary Box */}
          <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] space-y-2">
            <div className="text-[10px] font-bold text-[#90FF00] uppercase tracking-wider font-mono">
              {t('bassGen.checklist')}
            </div>
            <ul className="text-xs text-[#BBB] space-y-1 list-disc list-inside font-mono">
              <li>Track 1: KICK (Sample tuned to {settings.rootKey}1, length 160ms)</li>
              <li>Track 2: BASS (Operator or Wavetable synth, Saw wave, {settings.cutoffHz}Hz filter cutoff)</li>
              <li>Insert <strong>Utility</strong> on Bass track: Enable "Bass Mono" at 120Hz</li>
              <li>Insert <strong>EQ Eight</strong> on Bass track: Band 1 HPF at 30Hz (48dB slope)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
