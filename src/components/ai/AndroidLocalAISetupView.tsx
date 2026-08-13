import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Cpu,
  HardDrive,
  Download,
  Pause,
  Play,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Zap,
  RefreshCw,
  ShieldCheck,
  Globe,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';
import {
  androidLocalModelManager,
  DeviceSpecs,
  LocalModelDefinition,
  LocalAIStatusState,
  DownloadProgress,
  LOCAL_MODEL_REGISTRY
} from '../../services/ai/androidLocalModelManager';
import { useLanguage } from '../../context/LanguageContext';
import { debugLog } from '../../utils/debug';

export const AndroidLocalAISetupView: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const [deviceSpecs, setDeviceSpecs] = useState<DeviceSpecs | null>(null);
  const [status, setStatus] = useState<LocalAIStatusState>('NOT_INSTALLED');
  const [selectedModel, setSelectedModel] = useState<LocalModelDefinition>(LOCAL_MODEL_REGISTRY[0]);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    latencyMs: number;
    result: string;
    model: string;
    runtime: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfirmDownload, setShowConfirmDownload] = useState(false);

  useEffect(() => {
    async function init() {
      const specs = await androidLocalModelManager.detectDevice();
      setDeviceSpecs(specs);
      const st = androidLocalModelManager.getModelStatus();
      setStatus(st);
      const active = androidLocalModelManager.getActiveModel();
      if (active) setSelectedModel(active);
    }
    init();
  }, []);

  const handleStartDownload = async () => {
    setShowConfirmDownload(false);
    setErrorMsg(null);
    setStatus('DOWNLOADING');

    const res = await androidLocalModelManager.downloadModel(selectedModel.id, (prog) => {
      setDownloadProgress(prog);
    });

    if (res.success) {
      setStatus('READY');
      setDownloadProgress(null);
    } else {
      setErrorMsg(res.error || 'Failed to download model');
      setStatus(androidLocalModelManager.getModelStatus());
    }
  };

  const handlePauseResume = () => {
    if (downloadProgress?.paused) {
      androidLocalModelManager.resumeDownload((prog) => setDownloadProgress(prog));
    } else {
      androidLocalModelManager.pauseDownload();
    }
  };

  const handleDeleteModel = async () => {
    await androidLocalModelManager.deleteModel(selectedModel.id);
    setStatus('NOT_INSTALLED');
    setTestResult(null);
  };

  const handleTestInference = async () => {
    setIsTesting(true);
    setTestResult(null);
    setErrorMsg(null);

    const specs = await androidLocalModelManager.detectDevice();
    if (specs.availableRamGb * 1024 * 1024 * 1024 < selectedModel.minimumRamBytes) {
      setErrorMsg('This model is too large for this device.');
      setIsTesting(false);
      setStatus('INSUFFICIENT_MEMORY');
      return;
    }

    try {
      const res = await androidLocalModelManager.testModel('Explain how to create a rolling Psytrance bassline at 145 BPM.');
      setTestResult(res);
      setStatus('READY');
    } catch (e: any) {
      setErrorMsg(e.message || 'Inference test failed');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6 text-[#E0E0E0] font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Device Specs Header Card */}
      <div className="bg-[#141414] border border-[#333] rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1A2810] border border-[#334422] flex items-center justify-center text-[#90FF00]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#90FF00] uppercase tracking-wider bg-[#1A2810] border border-[#334422] px-2 py-0.5 rounded">
                  ANDROID HARDWARE DETECTED
                </span>
                {deviceSpecs?.isSamsung && (
                  <span className="text-[10px] font-mono font-bold text-[#00E5FF] uppercase tracking-wider bg-[#102830] border border-[#224455] px-2 py-0.5 rounded">
                    SAMSUNG OPTIMIZED
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {deviceSpecs?.manufacturer} {deviceSpecs?.model}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-[#1A1A1A] p-2.5 rounded border border-[#2A2A2A]">
              <span className="text-[#888] block text-[10px]">OS VERSION</span>
              <span className="text-white font-bold">{deviceSpecs?.androidVersion}</span>
            </div>
            <div className="bg-[#1A1A1A] p-2.5 rounded border border-[#2A2A2A]">
              <span className="text-[#888] block text-[10px]">CPU ARCH</span>
              <span className="text-white font-bold">{deviceSpecs?.cpuArchitecture}</span>
            </div>
            <div className="bg-[#1A1A1A] p-2.5 rounded border border-[#2A2A2A]">
              <span className="text-[#888] block text-[10px]">SYSTEM RAM</span>
              <span className="text-[#90FF00] font-bold">{deviceSpecs?.availableRamGb} GB</span>
            </div>
            <div className="bg-[#1A1A1A] p-2.5 rounded border border-[#2A2A2A]">
              <span className="text-[#888] block text-[10px]">FREE STORAGE</span>
              <span className="text-[#00E5FF] font-bold">{deviceSpecs?.availableStorageGb} GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Selection & Download Section */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#90FF00]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {isRTL ? 'מודל AI מקומי לאנדרואיד' : 'Android On-Device Local AI Model'}
            </h3>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            {status === 'READY' && (
              <span className="flex items-center gap-1.5 text-[#90FF00] bg-[#1A2810] border border-[#334422] px-2.5 py-1 rounded-full font-bold">
                <span className="w-2 h-2 rounded-full bg-[#90FF00] animate-pulse"></span>
                LOCAL AI ● Ready
              </span>
            )}
            {status === 'DOWNLOADING' && (
              <span className="flex items-center gap-1.5 text-[#00E5FF] bg-[#102830] border border-[#224455] px-2.5 py-1 rounded-full font-bold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                DOWNLOADING
              </span>
            )}
            {status === 'VERIFYING' && (
              <span className="flex items-center gap-1.5 text-[#FFB700] bg-[#2A2000] border border-[#554000] px-2.5 py-1 rounded-full font-bold">
                <ShieldCheck className="w-3.5 h-3.5 animate-bounce" />
                VERIFYING
              </span>
            )}
            {status === 'NOT_INSTALLED' && (
              <span className="text-[#888] bg-[#222] border border-[#333] px-2.5 py-1 rounded-full font-bold">
                NOT INSTALLED
              </span>
            )}
            {status === 'INSUFFICIENT_MEMORY' && (
              <span className="text-[#FF4444] bg-[#2A1010] border border-[#552222] px-2.5 py-1 rounded-full font-bold">
                INSUFFICIENT MEMORY
              </span>
            )}
          </div>
        </div>

        {/* Available Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LOCAL_MODEL_REGISTRY.map((m) => {
            const isSelected = selectedModel.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedModel(m)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#1A2810] border-[#90FF00] shadow-lg shadow-[#90FF00]/5'
                    : 'bg-[#141414] border-[#333] hover:border-[#555]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#888]">{m.format}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#90FF00]" />}
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{m.name}</h4>
                <div className="mt-3 space-y-1.5 text-xs font-mono text-[#AAA]">
                  <div className="flex justify-between">
                    <span>Download Size:</span>
                    <strong className="text-white">{m.sizeHuman}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. RAM Req:</span>
                    <strong className="text-[#90FF00]">{m.estimatedRamGb} GB</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Languages:</span>
                    <span className="text-white">{m.languages.join(', ')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error message warning */}
        {errorMsg && (
          <div className="bg-[#2A1010] border border-[#FF4444] text-[#FF8888] p-3 rounded-lg text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FF4444] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Prompt to confirm download */}
        {showConfirmDownload && (
          <div className="bg-[#141414] border border-[#90FF00] p-4 rounded-lg space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-[#90FF00]" />
              {isRTL ? 'להוריד מודל AI מקומי זה למכשיר האנדרואיד?' : 'Download this local AI model to Android device?'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-[#1A1A1A] p-3 rounded border border-[#2A2A2A]">
              <div>
                <span className="text-[#888] block">Model Size:</span>
                <strong className="text-white">{selectedModel.sizeHuman}</strong>
              </div>
              <div>
                <span className="text-[#888] block">Required RAM:</span>
                <strong className="text-[#90FF00]">{selectedModel.estimatedRamGb} GB</strong>
              </div>
              <div>
                <span className="text-[#888] block">Offline Ready:</span>
                <strong className="text-[#00E5FF]">100% On-Device</strong>
              </div>
              <div>
                <span className="text-[#888] block">Languages:</span>
                <strong className="text-white">EN + HE</strong>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleStartDownload}
                className="bg-[#90FF00] text-black font-bold px-4 py-2 rounded text-xs hover:bg-[#A8FF33] transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isRTL ? 'אישור והורדה' : 'Confirm & Download'}
              </button>
              <button
                onClick={() => setShowConfirmDownload(false)}
                className="bg-[#222] text-[#AAA] border border-[#333] px-4 py-2 rounded text-xs hover:bg-[#333]"
              >
                {isRTL ? 'ביטול' : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* Live Download Progress Bar */}
        {status === 'DOWNLOADING' && downloadProgress && (
          <div className="bg-[#141414] border border-[#00E5FF] p-4 rounded-lg space-y-2 font-mono">
            <div className="flex justify-between text-xs">
              <span className="text-[#00E5FF] font-bold flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Downloading {selectedModel.name}...
              </span>
              <span className="text-white font-bold">{downloadProgress.percent}%</span>
            </div>
            <div className="w-full bg-[#222] h-2.5 rounded-full overflow-hidden border border-[#333]">
              <div
                className="bg-gradient-to-r from-[#00E5FF] to-[#90FF00] h-full transition-all duration-200"
                style={{ width: `${downloadProgress.percent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-[#888] pt-1">
              <span>Speed: {downloadProgress.speedMBs} MB/s</span>
              <span>ETA: ~{downloadProgress.etaSeconds}s</span>
              <button
                onClick={handlePauseResume}
                className="text-[#90FF00] hover:underline flex items-center gap-1 font-bold"
              >
                {downloadProgress.paused ? (
                  <>
                    <Play className="w-3 h-3" /> Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3" /> Pause
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Control Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            {status === 'NOT_INSTALLED' && !showConfirmDownload && (
              <button
                onClick={() => setShowConfirmDownload(true)}
                className="bg-[#90FF00] text-black font-bold px-4 py-2 rounded text-xs hover:bg-[#A8FF33] transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isRTL ? 'הורד מודל AI מקומי' : 'Download Local AI Model'}
              </button>
            )}

            {status === 'READY' && (
              <button
                onClick={handleTestInference}
                disabled={isTesting}
                className="bg-[#102830] border border-[#224455] text-[#00E5FF] font-bold px-4 py-2 rounded text-xs hover:bg-[#1A3845] transition-colors flex items-center gap-2"
              >
                <Zap className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                {isTesting ? 'Testing Local Inference...' : 'TEST AI'}
              </button>
            )}

            {(status === 'READY' || status === 'INSUFFICIENT_MEMORY') && (
              <button
                onClick={handleDeleteModel}
                className="bg-[#2A1010] border border-[#552222] text-[#FF6666] font-bold px-3 py-2 rounded text-xs hover:bg-[#3A1515] transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                DELETE MODEL
              </button>
            )}
          </div>

          <div className="text-xs font-mono text-[#888] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#90FF00]" />
            <span>100% Local Device Data Privacy — No PC required</span>
          </div>
        </div>

        {/* Test Result Display */}
        {testResult && (
          <div className="bg-[#141414] border border-[#333] p-4 rounded-lg space-y-2 mt-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#222] pb-2">
              <span className="text-[#90FF00] font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                INFERENCE TEST PASSED
              </span>
              <span className="text-[#AAA]">
                Latency: <strong className="text-white">{testResult.latencyMs} ms</strong>
              </span>
            </div>
            <div className="text-[#AAA] text-[11px]">
              Runtime: <strong className="text-[#00E5FF]">{testResult.runtime}</strong> | Model:{' '}
              <strong className="text-white">{testResult.model}</strong>
            </div>
            <pre className="bg-[#1A1A1A] p-3 rounded text-[#DDD] text-[11px] whitespace-pre-wrap leading-relaxed border border-[#2A2A2A]" dir="auto">
              {testResult.result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
