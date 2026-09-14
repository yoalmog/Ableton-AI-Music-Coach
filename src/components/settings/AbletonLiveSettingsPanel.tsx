import React, { useState, useEffect } from 'react';
import {
  Zap,
  Radio,
  Sliders,
  Layers,
  Activity,
  Cpu,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Volume2,
  Play,
  Square,
  Copy,
  Check,
  HardDrive,
  Info,
  ExternalLink,
  Plus,
  Trash2,
  Disc,
} from 'lucide-react';
import { abletonIntegrationService } from '../../services/abletonIntegrationService';
import {
  AbletonIntegrationFullState,
  MidiControllerMapping,
  AbletonTrackRouting,
} from '../../types/abletonIntegration';
import { useLanguage } from '../../context/LanguageContext';

export const AbletonLiveSettingsPanel: React.FC = () => {
  const { language, t } = useLanguage();
  const isHe = language === 'he';

  const [state, setState] = useState<AbletonIntegrationFullState>(abletonIntegrationService.getState());
  const [isConnecting, setIsConnecting] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  // New mapping state modal/row
  const [newMapName, setNewMapName] = useState('');
  const [newMapTarget, setNewMapTarget] = useState<MidiControllerMapping['target']>('filter_cutoff');
  const [newMapCC, setNewMapCC] = useState(74);

  useEffect(() => {
    const unsub = abletonIntegrationService.subscribe(setState);
    return () => unsub();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    await abletonIntegrationService.connect();
    setIsConnecting(false);
  };

  const handleDisconnect = async () => {
    await abletonIntegrationService.disconnect();
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(state.bridge.sessionToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleExportM4L = async () => {
    setExportMsg('Exporting companion device package...');
    const res = await abletonIntegrationService.exportM4LDevice();
    if (res.success) {
      setExportMsg('✓ Companion device package exported! Drag into your Ableton Live 12 project.');
    } else if (!res.cancelled) {
      setExportMsg('✕ Could not export device.');
    } else {
      setExportMsg(null);
    }
    setTimeout(() => setExportMsg(null), 5000);
  };

  const handleAddMapping = () => {
    if (!newMapName) return;
    abletonIntegrationService.addMapping({
      name: newMapName,
      channel: 1,
      cc: newMapCC,
      target: newMapTarget,
      minVal: 0,
      maxVal: 127,
      currentVal: 64,
    });
    setNewMapName('');
  };

  return (
    <div className="space-y-6 text-[#E0E0E0] font-sans pb-12">
      {/* Top Banner: Connection Mode Status */}
      <div
        className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
          state.status === 'CONNECTED'
            ? 'bg-[#102410] border-[#90FF00]/40'
            : state.status === 'DETECTING'
            ? 'bg-[#242010] border-[#FFB800]/40'
            : 'bg-[#181818] border-[#333]'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
              state.status === 'CONNECTED'
                ? 'bg-[#90FF00] shadow-[0_0_12px_#90FF00]'
                : state.status === 'DETECTING'
                ? 'bg-[#FFB800] animate-pulse'
                : 'bg-[#555]'
            }`}
          >
            {state.status === 'CONNECTED' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-white uppercase">
                {state.status === 'CONNECTED'
                  ? 'CONNECTED TO ABLETON LIVE 12'
                  : state.status === 'DETECTING'
                  ? 'ABLETON LIVE 12 PROCESS DETECTED'
                  : 'STANDALONE / SIMULATOR MODE'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-black/50 text-[#888] font-mono border border-white/10">
                {state.liveProcess.version}
              </span>
            </div>
            <p className="text-xs text-[#999] mt-0.5">{state.statusMessage}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          {state.status === 'CONNECTED' ? (
            <button
              onClick={handleDisconnect}
              className="flex-1 md:flex-none px-4 py-2 bg-[#222] hover:bg-[#2A2A2A] text-[#FF453A] border border-[#FF453A]/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Square size={13} />
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex-1 md:flex-none px-5 py-2 bg-[#90FF00] hover:bg-[#7BD900] text-black rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={13} className={isConnecting ? 'animate-spin' : ''} />
              {isConnecting ? 'Connecting...' : 'Connect to Live 12'}
            </button>
          )}

          <button
            onClick={handleExportM4L}
            className="px-3 py-2 bg-[#222] hover:bg-[#2A2A2A] text-white border border-[#444] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export Max for Live Device"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export M4L Device</span>
          </button>
        </div>
      </div>

      {exportMsg && (
        <div className="p-3 bg-[#1E293B] border border-[#38BDF8]/40 rounded-lg text-xs text-[#38BDF8] flex items-center gap-2">
          <Info size={14} />
          <span>{exportMsg}</span>
        </div>
      )}

      {/* Grid of Integration Providers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Ableton Link Sync */}
        <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#282828] pb-3">
            <div className="flex items-center gap-2.5">
              <Radio size={16} className="text-[#00E5FF]" />
              <h3 className="font-bold text-sm text-white">Ableton Link Protocol</h3>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                state.link.isConnected
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                  : 'bg-[#333] text-[#777]'
              }`}
            >
              {state.link.isConnected ? `${state.link.peers} PEER CONNECTED` : 'LINK IDLE'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#121212] p-3 rounded-lg border border-[#222]">
              <span className="text-[10px] text-[#777] uppercase font-mono block">Tempo (BPM)</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  value={state.transport.bpm}
                  onChange={(e) => abletonIntegrationService.setTempo(Number(e.target.value))}
                  className="w-16 bg-black border border-[#333] rounded px-1.5 py-0.5 text-base font-bold text-white font-mono text-center focus:border-[#90FF00] outline-none"
                />
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => abletonIntegrationService.setTempo(state.transport.bpm + 1)}
                    className="px-1.5 bg-[#222] hover:bg-[#333] text-[10px] text-[#AAA] rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => abletonIntegrationService.setTempo(state.transport.bpm - 1)}
                    className="px-1.5 bg-[#222] hover:bg-[#333] text-[10px] text-[#AAA] rounded"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#121212] p-3 rounded-lg border border-[#222]">
              <span className="text-[10px] text-[#777] uppercase font-mono block">Transport State</span>
              <div className="flex items-center gap-2 mt-1.5">
                <button
                  onClick={() => abletonIntegrationService.setPlaying(!state.transport.isPlaying)}
                  className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    state.transport.isPlaying
                      ? 'bg-[#90FF00] text-black'
                      : 'bg-[#222] text-[#CCC] hover:bg-[#333]'
                  }`}
                >
                  {state.transport.isPlaying ? <Square size={11} /> : <Play size={11} />}
                  {state.transport.isPlaying ? 'PLAYING' : 'STOPPED'}
                </button>
              </div>
            </div>

            <div className="bg-[#121212] p-3 rounded-lg border border-[#222]">
              <span className="text-[10px] text-[#777] uppercase font-mono block">Quantum & Phase</span>
              <div className="flex items-center gap-1.5 mt-2">
                {[1, 2, 3, 4].map((beat) => (
                  <div
                    key={beat}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      state.transport.isPlaying && state.transport.beat === beat
                        ? 'bg-[#00E5FF] border-[#00E5FF] shadow-[0_0_8px_#00E5FF]'
                        : 'bg-black/60 border-[#333]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#888] pt-1">
            <span>Start/Stop Synchronization</span>
            <span className="font-mono text-[#90FF00]">ENABLED</span>
          </div>
        </div>

        {/* Section 2: Max for Live Localhost Bridge */}
        <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#282828] pb-3">
            <div className="flex items-center gap-2.5">
              <Zap size={16} className="text-[#FFE853]" />
              <h3 className="font-bold text-sm text-white">Max for Live Companion Bridge</h3>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                state.bridge.connected
                  ? 'bg-[#90FF00]/20 text-[#90FF00] border border-[#90FF00]/40'
                  : 'bg-[#333] text-[#777]'
              }`}
            >
              {state.bridge.connected ? `PORT ${state.bridge.port} ACTIVE` : 'PORT 9098 READY'}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between bg-[#121212] p-2.5 rounded-lg border border-[#222]">
              <span className="text-[#888]">Host / Endpoint</span>
              <span className="font-mono text-white">http://127.0.0.1:9098</span>
            </div>

            <div className="flex items-center justify-between bg-[#121212] p-2.5 rounded-lg border border-[#222]">
              <span className="text-[#888]">Session Security Token</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-[#FFE853] bg-black px-2 py-0.5 rounded">
                  {state.bridge.sessionToken ? `${state.bridge.sessionToken.slice(0, 12)}...` : 'aamc_session_token'}
                </span>
                <button
                  onClick={handleCopyToken}
                  className="p-1 hover:bg-[#333] rounded text-[#AAA] transition-colors cursor-pointer"
                  title="Copy Token"
                >
                  {copiedToken ? <Check size={13} className="text-[#90FF00]" /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#121212] p-2.5 rounded-lg border border-[#222]">
              <span className="text-[#888]">Round-trip Latency</span>
              <span className="font-mono text-[#90FF00]">{state.bridge.latencyMs || 1} ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: MIDI Device Discovery & Live MIDI Monitor */}
      <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#282828] pb-3">
          <div className="flex items-center gap-2.5">
            <Activity size={16} className="text-[#FF453A]" />
            <h3 className="font-bold text-sm text-white">MIDI Devices & Live Stream Monitor</h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#777]">Input:</span>
              <select
                value={state.selectedMidiInput}
                onChange={(e) => (state.selectedMidiInput = e.target.value)}
                className="bg-black border border-[#333] rounded px-2 py-1 text-xs text-white outline-none font-mono"
              >
                {state.availableMidiInputs.map((dev) => (
                  <option key={dev.id} value={dev.id}>
                    {dev.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#777]">Output:</span>
              <select
                value={state.selectedMidiOutput}
                onChange={(e) => (state.selectedMidiOutput = e.target.value)}
                className="bg-black border border-[#333] rounded px-2 py-1 text-xs text-white outline-none font-mono"
              >
                {state.availableMidiOutputs.map((dev) => (
                  <option key={dev.id} value={dev.id}>
                    {dev.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live MIDI Monitor Table */}
        <div className="bg-[#121212] rounded-lg border border-[#222] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-[#1A1A1A] border-b border-[#282828] text-[10px] font-mono text-[#777] uppercase tracking-wider">
            <span className="w-24">Timestamp</span>
            <span className="w-24">Message Type</span>
            <span className="w-16 text-center">CH</span>
            <span className="w-32">Note / CC</span>
            <span className="flex-1 text-right">Raw Bytes</span>
          </div>

          <div className="h-44 overflow-y-auto font-mono text-xs divide-y divide-[#1A1A1A]">
            {state.recentMidiMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#555] text-xs">
                Waiting for incoming MIDI Note / CC / Clock messages...
              </div>
            ) : (
              state.recentMidiMessages.map((msg) => (
                <div key={msg.id} className="flex items-center justify-between px-3 py-1.5 hover:bg-white/5 transition-colors">
                  <span className="w-24 text-[11px] text-[#666]">{msg.timeFormatted}</span>
                  <span
                    className={`w-24 text-[11px] font-bold ${
                      msg.type === 'NOTE_ON'
                        ? 'text-[#90FF00]'
                        : msg.type === 'NOTE_OFF'
                        ? 'text-[#666]'
                        : msg.type === 'CONTROL_CHANGE'
                        ? 'text-[#00E5FF]'
                        : 'text-[#FFE853]'
                    }`}
                  >
                    {msg.type}
                  </span>
                  <span className="w-16 text-center text-[#AAA]">{msg.channel}</span>
                  <span className="w-32 text-white">
                    {msg.noteName
                      ? `${msg.noteName} (vel: ${msg.velocity})`
                      : msg.ccNumber !== undefined
                      ? `CC#${msg.ccNumber} = ${msg.ccValue}`
                      : '-'}
                  </span>
                  <span className="flex-1 text-right text-[10px] text-[#555]">
                    {msg.rawData.map((b) => '0x' + b.toString(16).toUpperCase().padStart(2, '0')).join(' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Section 4: MIDI Learn & Controller Mapping */}
      <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#282828] pb-3">
          <div className="flex items-center gap-2.5">
            <Sliders size={16} className="text-[#90FF00]" />
            <h3 className="font-bold text-sm text-white">MIDI Controller Mapping & MIDI Learn</h3>
          </div>
          <span className="text-xs text-[#888]">
            Click <strong className="text-white">Learn</strong> and turn any physical knob on your MIDI controller
          </span>
        </div>

        <div className="space-y-2">
          {state.mappings.map((map) => {
            const isLearning = state.isMidiLearnActive && state.midiLearnTargetId === map.id;
            return (
              <div
                key={map.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  isLearning
                    ? 'bg-[#242010] border-[#FFB800] animate-pulse'
                    : 'bg-[#121212] border-[#222]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs text-white w-40">{map.name}</span>
                  <span className="text-[11px] font-mono text-[#888] bg-black px-2 py-0.5 rounded border border-[#333]">
                    Target: {map.target}
                  </span>
                  <span className="text-[11px] font-mono text-[#90FF00]">
                    CH: {map.channel === 0 ? 'Any' : map.channel} • CC: #{map.cc}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      isLearning
                        ? abletonIntegrationService.stopMidiLearn()
                        : abletonIntegrationService.startMidiLearn(map.id)
                    }
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      isLearning
                        ? 'bg-[#FFB800] text-black'
                        : 'bg-[#222] hover:bg-[#333] text-[#CCC]'
                    }`}
                  >
                    {isLearning ? 'Learning (Turn Knob)...' : 'MIDI Learn'}
                  </button>

                  <button
                    onClick={() => abletonIntegrationService.deleteMapping(map.id)}
                    className="p-1 hover:bg-[#FF453A]/20 text-[#666] hover:text-[#FF453A] rounded transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Custom Mapping */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Parameter Name (e.g. Lead Cutoff)"
            value={newMapName}
            onChange={(e) => setNewMapName(e.target.value)}
            className="flex-1 bg-black border border-[#333] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#90FF00]"
          />
          <select
            value={newMapTarget}
            onChange={(e) => setNewMapTarget(e.target.value as any)}
            className="bg-black border border-[#333] rounded px-2.5 py-1.5 text-xs text-white outline-none"
          >
            <option value="filter_cutoff">Filter Cutoff</option>
            <option value="filter_resonance">Filter Resonance</option>
            <option value="master_volume">Master Volume</option>
            <option value="tempo">Tempo BPM</option>
            <option value="track_volume">Track Volume</option>
            <option value="delay_send">Delay Send</option>
            <option value="reverb_send">Reverb Send</option>
          </select>
          <input
            type="number"
            placeholder="CC#"
            value={newMapCC}
            onChange={(e) => setNewMapCC(Number(e.target.value))}
            className="w-16 bg-black border border-[#333] rounded px-2 py-1.5 text-xs text-white font-mono text-center outline-none"
          />
          <button
            onClick={handleAddMapping}
            className="px-4 py-1.5 bg-[#90FF00] hover:bg-[#7BD900] text-black font-bold rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus size={13} />
            Add Mapping
          </button>
        </div>
      </div>
    </div>
  );
};
