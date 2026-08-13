import React, { useState } from 'react';
import { Play, Square, Circle, Volume2, Search, Plus, Layers, Grid, Sliders, Music, Zap, Disc, Activity } from 'lucide-react';
import { HotspotTarget } from '../../types/classroom';
import { SubSimulatorPianoRoll } from './SubSimulatorPianoRoll';
import { SubSimulatorOperator } from './SubSimulatorOperator';
import { SubSimulatorWavetable } from './SubSimulatorWavetable';
import { SubSimulatorDrumRack } from './SubSimulatorDrumRack';
import { useLanguage } from '../../context/LanguageContext';

interface SimulatorUIProps {
  targetHighlight: HotspotTarget | null;
  onUserAction: (target: HotspotTarget, value?: any) => void;
  onOpenWhereIsIt: () => void;
  bpm: number;
  onBpmChange: (newBpm: number) => void;
}

export const SimulatorUI: React.FC<SimulatorUIProps> = ({
  targetHighlight,
  onUserAction,
  onOpenWhereIsIt,
  bpm,
  onBpmChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const [viewMode, setViewMode] = useState<'arrangement' | 'session'>('arrangement');
  const [activeBottomTab, setActiveBottomTab] = useState<'piano_roll' | 'operator' | 'wavetable' | 'drum_rack'>('piano_roll');
  const [activeCategory, setActiveCategory] = useState<'instruments' | 'effects' | 'samples'>('instruments');
  const [tracks, setTracks] = useState([
    { id: 't1', name: '1 Psy Bass', type: 'midi', muted: false, solo: false, armed: true, volume: 80 },
    { id: 't2', name: '2 Kick 909', type: 'audio', muted: false, solo: false, armed: false, volume: 90 },
    { id: 't3', name: '3 Lead Synth', type: 'midi', muted: false, solo: false, armed: false, volume: 75 }
  ]);
  const { language, isRTL, t } = useLanguage();

  const isTarget = (element: HotspotTarget) => targetHighlight === element;

  const getHighlightClass = (element: HotspotTarget) => {
    if (isTarget(element)) {
      return 'ring-4 ring-amber-400 ring-offset-2 ring-offset-black animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.8)] border-amber-400 z-10';
    }
    return '';
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    onUserAction('transport_play');
  };

  const handleToggleMetronome = () => {
    setIsMetronomeOn(!isMetronomeOn);
    onUserAction('metronome');
  };

  const handleAddMidiTrack = () => {
    const newTrack = {
      id: `t${tracks.length + 1}`,
      name: `${tracks.length + 1} MIDI Track`,
      type: 'midi',
      muted: false,
      solo: false,
      armed: false,
      volume: 80
    };
    setTracks([...tracks, newTrack]);
    onUserAction('add_midi_track_btn');
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="bg-[#121212] border border-[#2B2B2B] rounded-xl overflow-hidden text-gray-200 select-none flex flex-col h-[780px] shadow-2xl">
      {/* Disclaimer & Branding Bar */}
      <div className="bg-[#181818] px-4 py-1.5 border-b border-[#2B2B2B] flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="font-bold text-amber-400 tracking-wider">{t('simulator.title')}</span>
          <span className="text-[#666] hidden sm:inline">{t('simulator.disclaimer')}</span>
        </div>
        <button
          onClick={onOpenWhereIsIt}
          className="px-2.5 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/40 font-sans font-semibold flex items-center gap-1 transition"
        >
          <Search className="w-3 h-3" />
          {t('simulator.whereIsIt')}
        </button>
      </div>

      {/* TOP CONTROL BAR (Transport, BPM, View Toggles) */}
      <div className="bg-[#1C1C1C] px-3 py-2 border-b border-[#2B2B2B] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Transport Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className={`p-2 rounded font-bold transition flex items-center justify-center ${getHighlightClass('transport_play')} ${
              isPlaying ? 'bg-amber-500 text-black' : 'bg-[#2A2A2A] hover:bg-[#353535] text-amber-400'
            }`}
            title={t('simulator.play')}
          >
            <Play className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              onUserAction('transport_stop');
            }}
            className={`p-2 bg-[#2A2A2A] hover:bg-[#353535] text-gray-300 rounded ${getHighlightClass('transport_stop')}`}
            title={t('simulator.stop')}
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={() => onUserAction('transport_record')}
            className={`p-2 bg-[#2A2A2A] hover:bg-[#353535] text-red-500 rounded ${getHighlightClass('transport_record')}`}
            title={t('simulator.record')}
          >
            <Circle className="w-4 h-4 fill-current" />
          </button>

          {/* BPM Box */}
          <div className={`flex items-center gap-1 bg-[#141414] px-2.5 py-1 rounded border border-[#333] ${getHighlightClass('bpm_input')}`}>
            <span className="text-[#777] text-[10px] font-mono">BPM:</span>
            <input
              type="number"
              value={bpm}
              onChange={(e) => {
                const val = Number(e.target.value);
                onBpmChange(val);
                onUserAction('bpm_input', val);
              }}
              className="w-12 bg-transparent text-amber-400 font-mono font-bold text-xs focus:outline-none text-center"
            />
          </div>

          {/* Time Signature */}
          <span className="text-[10px] font-mono bg-[#141414] px-2 py-1.5 rounded border border-[#2B2B2B] text-gray-400">
            4 / 4
          </span>

          {/* Metronome */}
          <button
            onClick={handleToggleMetronome}
            className={`p-1.5 rounded border text-[11px] font-mono flex items-center gap-1 transition ${getHighlightClass('metronome')} ${
              isMetronomeOn
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-[#141414] border-[#2B2B2B] text-[#777] hover:text-white'
            }`}
            title={t('simulator.metronome')}
          >
            <Disc className="w-3.5 h-3.5" /> {t('simulator.metronome')}
          </button>
        </div>

        {/* Right: View Toggles & Automation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setViewMode('arrangement');
              onUserAction('view_toggle_arrangement');
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border transition ${getHighlightClass('view_toggle_arrangement')} ${
              viewMode === 'arrangement'
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-[#252525] border-[#333] text-[#888] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> {t('simulator.arrangement')}
          </button>

          <button
            onClick={() => {
              setViewMode('session');
              onUserAction('view_toggle_session');
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border transition ${getHighlightClass('view_toggle_session')} ${
              viewMode === 'session'
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-[#252525] border-[#333] text-[#888] hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> {t('simulator.session')}
          </button>

          <button
            onClick={() => onUserAction('automation_btn')}
            className={`p-1.5 bg-[#252525] border border-[#333] hover:border-amber-400 text-pink-400 rounded ${getHighlightClass('automation_btn')}`}
            title={t('simulator.automation')}
          >
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN BODY AREA (Browser + Tracks + Mixer) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT BROWSER PANEL */}
        <div className={`w-52 bg-[#171717] border-r border-[#2B2B2B] flex flex-col ${getHighlightClass('browser')}`}>
          <div className="p-2 border-b border-[#2A2A2A] font-bold text-[11px] text-amber-400 uppercase tracking-wider flex items-center justify-between">
            <span>{t('simulator.browser')}</span>
            <span className="text-[9px] text-[#666]">Live 12</span>
          </div>

          <div className="p-2 space-y-1 text-xs">
            <button
              onClick={() => {
                setActiveCategory('instruments');
                onUserAction('browser_instruments');
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 transition ${getHighlightClass('browser_instruments')} ${
                activeCategory === 'instruments' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-gray-300 hover:bg-[#222]'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-amber-400" /> {t('simulator.instruments')}
            </button>
            <button
              onClick={() => {
                setActiveCategory('effects');
                onUserAction('browser_effects');
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 transition ${getHighlightClass('browser_effects')} ${
                activeCategory === 'effects' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-gray-300 hover:bg-[#222]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> {t('simulator.audioEffects')}
            </button>
            <button
              onClick={() => {
                setActiveCategory('samples');
                onUserAction('browser_samples');
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 transition ${getHighlightClass('browser_samples')} ${
                activeCategory === 'samples' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-gray-300 hover:bg-[#222]'
              }`}
            >
              <Disc className="w-3.5 h-3.5 text-emerald-400" /> {t('simulator.samples')}
            </button>
          </div>

          {/* Browser Items List */}
          <div className="flex-1 p-2 space-y-1 text-[11px] overflow-y-auto text-gray-400">
            {activeCategory === 'instruments' && (
              <>
                <div onClick={() => setActiveBottomTab('operator')} className="hover:text-amber-300 cursor-pointer p-1 rounded hover:bg-[#222]">Operator (FM)</div>
                <div onClick={() => setActiveBottomTab('wavetable')} className="hover:text-amber-300 cursor-pointer p-1 rounded hover:bg-[#222]">Wavetable</div>
                <div onClick={() => setActiveBottomTab('drum_rack')} className="hover:text-amber-300 cursor-pointer p-1 rounded hover:bg-[#222]">Drum Rack</div>
                <div className="hover:text-amber-300 cursor-pointer p-1 rounded hover:bg-[#222]">Drift</div>
                <div className="hover:text-amber-300 cursor-pointer p-1 rounded hover:bg-[#222]">Meld</div>
              </>
            )}
            {activeCategory === 'effects' && (
              <>
                <div className="hover:text-cyan-300 cursor-pointer p-1 rounded hover:bg-[#222]">EQ Eight</div>
                <div className="hover:text-cyan-300 cursor-pointer p-1 rounded hover:bg-[#222]">Compressor</div>
                <div className="hover:text-cyan-300 cursor-pointer p-1 rounded hover:bg-[#222]">Glue Compressor</div>
                <div className="hover:text-cyan-300 cursor-pointer p-1 rounded hover:bg-[#222]">Saturator</div>
                <div className="hover:text-cyan-300 cursor-pointer p-1 rounded hover:bg-[#222]">Roar (Live 12)</div>
                <div className="hover:text-cyan-300 cursor-pointer p-1 rounded hover:bg-[#222]">Auto Filter</div>
              </>
            )}
            {activeCategory === 'samples' && (
              <>
                <div className="hover:text-emerald-300 cursor-pointer p-1 rounded hover:bg-[#222]">909 Kick Sample.wav</div>
                <div className="hover:text-emerald-300 cursor-pointer p-1 rounded hover:bg-[#222]">Analog Snare.wav</div>
                <div className="hover:text-emerald-300 cursor-pointer p-1 rounded hover:bg-[#222]">16th Open Hat.wav</div>
              </>
            )}
          </div>
        </div>

        {/* CENTER TRACK TIMELINE / ARRANGEMENT AREA */}
        <div className="flex-1 flex flex-col bg-[#141414] overflow-hidden">
          {/* Add Track Toolbar */}
          <div className="p-2 border-b border-[#252525] bg-[#1A1A1A] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddMidiTrack}
                className={`px-2.5 py-1 bg-[#282828] hover:bg-[#333] text-amber-300 rounded text-[11px] font-semibold flex items-center gap-1 border border-[#333] ${getHighlightClass('add_midi_track_btn')}`}
              >
                <Plus className="w-3 h-3" /> {t('simulator.addMidiTrack')}
              </button>
            </div>
            <span className="text-[10px] text-[#666] font-mono">{t('simulator.grid16th')}</span>
          </div>

          {/* Tracks List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#222]">
            {tracks.map((track) => (
              <div key={track.id} className="flex h-20 bg-[#161616] hover:bg-[#1A1A1A] transition">
                {/* Track Header Controls */}
                <div className={`w-48 p-2 border-r border-[#2A2A2A] bg-[#1E1E1E] flex flex-col justify-between text-xs ${getHighlightClass('midi_track_header')}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 truncate">{track.name}</span>
                    <span className="text-[9px] bg-[#121212] px-1 py-0.5 rounded text-[#888] font-mono">{track.type}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUserAction('track_mute')}
                      className={`w-6 h-5 rounded text-[10px] font-bold border transition ${getHighlightClass('track_mute')} ${
                        track.muted ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'bg-[#282828] border-[#383838] text-gray-400'
                      }`}
                      title="Mute Track"
                    >
                      M
                    </button>
                    <button
                      onClick={() => onUserAction('track_solo')}
                      className={`w-6 h-5 rounded text-[10px] font-bold border transition ${getHighlightClass('track_solo')} ${
                        track.solo ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500' : 'bg-[#282828] border-[#383838] text-gray-400'
                      }`}
                      title="Solo Track"
                    >
                      S
                    </button>
                    <button
                      onClick={() => onUserAction('track_arm')}
                      className={`w-6 h-5 rounded text-[10px] font-bold border transition flex items-center justify-center ${getHighlightClass('track_arm')} ${
                        track.armed ? 'bg-red-500 text-white border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-[#282828] border-[#383838] text-red-500'
                      }`}
                      title="Arm Record"
                    >
                      ●
                    </button>
                  </div>
                </div>

                {/* Track Clip Grid Representation */}
                <div
                  onClick={() => onUserAction('clip_slot')}
                  className={`flex-1 p-2 bg-[#121212] relative flex items-center gap-2 cursor-pointer hover:bg-[#181818] transition ${getHighlightClass('clip_slot')}`}
                >
                  <div className="h-14 w-40 bg-amber-500/20 border border-amber-400/50 rounded p-1 text-[10px] text-amber-300 flex flex-col justify-between">
                    <span className="font-semibold">{t('simulator.midiClip')}</span>
                    <span className="text-[9px] text-amber-400/70 font-mono">{t('simulator.notes16Steps')}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Master Track Header */}
            <div className={`flex h-16 bg-[#1A1A1A] border-t-2 border-amber-500/40 ${getHighlightClass('master_track')}`}>
              <div
                onClick={() => onUserAction('master_track')}
                className="w-48 p-2 border-r border-[#2A2A2A] bg-[#222] font-bold text-xs text-amber-400 flex items-center justify-between cursor-pointer"
              >
                <span>{t('simulator.masterBus')}</span>
                <span className="text-[9px] bg-amber-500 text-black px-1 py-0.5 rounded font-mono">0.0 dB</span>
              </div>
              <div className="flex-1 bg-[#121212] p-2 flex items-center">
                <span className="text-[10px] text-[#666]">{t('simulator.masterChain')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM PANEL (Device Chain / Piano Roll / Device Sub-Simulators) */}
      <div className="h-56 bg-[#1A1A1A] border-t border-[#2B2B2B] flex flex-col">
        {/* Bottom Tabs Bar */}
        <div className="px-3 py-1 bg-[#141414] border-b border-[#2A2A2A] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveBottomTab('piano_roll')}
              className={`px-3 py-1 rounded text-[11px] font-semibold transition ${
                activeBottomTab === 'piano_roll' ? 'bg-amber-500 text-black' : 'text-[#888] hover:text-white'
              }`}
            >
              {t('simulator.pianoRoll')}
            </button>
            <button
              onClick={() => setActiveBottomTab('operator')}
              className={`px-3 py-1 rounded text-[11px] font-semibold transition ${
                activeBottomTab === 'operator' ? 'bg-amber-500 text-black' : 'text-[#888] hover:text-white'
              }`}
            >
              {t('simulator.operator')}
            </button>
            <button
              onClick={() => setActiveBottomTab('wavetable')}
              className={`px-3 py-1 rounded text-[11px] font-semibold transition ${
                activeBottomTab === 'wavetable' ? 'bg-amber-500 text-black' : 'text-[#888] hover:text-white'
              }`}
            >
              {t('simulator.wavetable')}
            </button>
            <button
              onClick={() => setActiveBottomTab('drum_rack')}
              className={`px-3 py-1 rounded text-[11px] font-semibold transition ${
                activeBottomTab === 'drum_rack' ? 'bg-amber-500 text-black' : 'text-[#888] hover:text-white'
              }`}
            >
              {t('simulator.drumRack')}
            </button>
          </div>

          <span className="text-[10px] text-[#666] font-mono">{t('simulator.shiftTabToggle')}</span>
        </div>

        {/* Sub-Simulator Display */}
        <div className="flex-1 p-2 overflow-y-auto">
          {activeBottomTab === 'piano_roll' && (
            <SubSimulatorPianoRoll
              isHighlighted={isTarget('piano_roll')}
              onNoteDraw={() => onUserAction('piano_roll_draw')}
            />
          )}
          {activeBottomTab === 'operator' && (
            <SubSimulatorOperator
              isHighlighted={isTarget('operator_osc')}
              onParameterChange={(param, val) => onUserAction('operator_osc', val)}
            />
          )}
          {activeBottomTab === 'wavetable' && (
            <SubSimulatorWavetable
              isHighlighted={isTarget('wavetable_pos')}
              onParameterChange={(param, val) => onUserAction('wavetable_pos', val)}
            />
          )}
          {activeBottomTab === 'drum_rack' && (
            <SubSimulatorDrumRack
              isHighlighted={isTarget('drum_rack_pad')}
              onPadTrigger={(pad) => onUserAction('drum_rack_pad', pad)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
