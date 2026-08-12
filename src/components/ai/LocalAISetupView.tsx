import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  ShieldCheck,
  HardDrive,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
} from 'lucide-react';
import { ollamaService, PullProgress, OllamaStatus, HardwareInfo } from '../../services/ollamaService';
import { aiService } from '../../services/aiService';
import { useLanguage } from '../../context/LanguageContext';
import { AIModel } from '../../services/ai/aiTypes';

interface LocalAISetupViewProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

type Step =
  | 'CHECKING_OLLAMA'
  | 'OLLAMA_MISSING'
  | 'OLLAMA_STOPPED'
  | 'CHECKING_MODELS'
  | 'MODEL_SELECTION'
  | 'DOWNLOADING_MODEL'
  | 'TESTING_MODEL'
  | 'READY';

export const LocalAISetupView: React.FC<LocalAISetupViewProps> = ({ isOpen, onClose, onComplete }) => {
  const { isRtl, language } = useLanguage();
  const [step, setStep] = useState<Step>('CHECKING_OLLAMA');
  const [status, setStatus] = useState<OllamaStatus | null>(null);
  const [hardware, setHardware] = useState<HardwareInfo | null>(null);
  const [installedModels, setInstalledModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('qwen3.5:4b');
  const [pullProgress, setPullProgress] = useState<PullProgress | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isHebrew = language === 'he' || isRtl;

  // Run initial diagnostics when opened
  useEffect(() => {
    if (isOpen) {
      runInitialCheck();
    }
  }, [isOpen]);

  // Background polling for Ollama service availability when installer opened
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPolling) {
      interval = setInterval(async () => {
        const s = await ollamaService.checkStatus();
        if (s.running) {
          setStatus(s);
          setIsPolling(false);
          checkInstalledModels();
        }
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPolling]);

  const runInitialCheck = async () => {
    setStep('CHECKING_OLLAMA');
    setErrorMessage(null);

    const [s, hw] = await Promise.all([
      ollamaService.checkStatus(),
      ollamaService.getHardwareInfo(),
    ]);

    setStatus(s);
    setHardware(hw);

    if (hw?.recommendedModel) {
      setSelectedModel(hw.recommendedModel);
    }

    if (!s.installed && !s.running) {
      setStep('OLLAMA_MISSING');
    } else if (s.installed && !s.running) {
      setStep('OLLAMA_STOPPED');
    } else {
      await checkInstalledModels();
    }
  };

  const checkInstalledModels = async () => {
    setStep('CHECKING_MODELS');
    const models = await ollamaService.getModels();
    setInstalledModels(models);

    if (models.length > 0) {
      // User has models installed! Check for qwen3.5:4b or any qwen model
      const preferred = models.find((m) => m.id.toLowerCase().includes('qwen3.5:4b')) ||
        models.find((m) => m.id.toLowerCase().includes('qwen')) ||
        models[0];

      setSelectedModel(preferred.id);
      setStep('MODEL_SELECTION');
    } else {
      // No models installed
      setStep('MODEL_SELECTION');
    }
  };

  const handleStartOllama = async () => {
    setStep('CHECKING_OLLAMA');
    const res = await ollamaService.startService();
    if (res.success) {
      const s = await ollamaService.checkStatus();
      setStatus(s);
      await checkInstalledModels();
    } else {
      setErrorMessage(res.message || 'Could not start Ollama process automatically.');
      setStep('OLLAMA_STOPPED');
    }
  };

  const handleInstallOllamaClick = () => {
    ollamaService.openDownloadPage();
    setIsPolling(true);
  };

  const handleStartDownload = async (modelToPull: string) => {
    setSelectedModel(modelToPull);
    setStep('DOWNLOADING_MODEL');
    setErrorMessage(null);
    setPullProgress({
      modelName: modelToPull,
      status: 'Connecting...',
      percent: 0,
      completedBytes: 0,
      totalBytes: 3.4 * 1024 * 1024 * 1024,
      completedHuman: '0 GB',
      totalHuman: '3.4 GB',
      speedMBs: 0,
      etaSeconds: 0,
    });

    const res = await ollamaService.pullModel(modelToPull, (prog) => {
      setPullProgress(prog);
    });

    if (res.success) {
      await runModelTest(modelToPull);
    } else {
      setErrorMessage(isHebrew ? 'הורדת המודל נכשלה. ניסיון נוסף מומלץ.' : 'Model download failed. Please try again.');
      setStep('MODEL_SELECTION');
    }
  };

  const handleCancelDownload = async () => {
    await ollamaService.cancelPull();
    setStep('MODEL_SELECTION');
  };

  const runModelTest = async (modelToTest: string) => {
    setStep('TESTING_MODEL');
    setErrorMessage(null);

    const res = await ollamaService.testModel(modelToTest);
    if (res.ok) {
      // Configure AI Router to local mode
      aiService.updateSettings({
        mode: 'local-first',
        localModel: modelToTest,
        privacyMode: false,
      });
      setStep('READY');
    } else {
      setErrorMessage(
        isHebrew
          ? `המודל הורד אך נכשל בבדיקה: ${res.reply}`
          : `Model downloaded but test failed: ${res.reply}`
      );
      setStep('MODEL_SELECTION');
    }
  };

  const handleFinish = () => {
    if (onComplete) onComplete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="bg-[#121212] border border-[#2A2A2A] rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-white space-y-6 relative overflow-hidden"
      >
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#90FF00] via-[#00E5FF] to-[#90FF00]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#90FF00]/10 border border-[#90FF00]/30 rounded-xl text-[#90FF00] shadow-inner">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide text-white flex items-center gap-2">
                <span>{isHebrew ? 'הגדרת AI מקומי' : 'Local AI Music Coach Setup'}</span>
                <span className="text-[10px] bg-[#90FF00]/20 text-[#90FF00] border border-[#90FF00]/40 px-2 py-0.5 rounded-full font-mono uppercase">
                  100% Private
                </span>
              </h2>
              <p className="text-xs text-[#888]">
                {isHebrew
                  ? 'הפעל עוזר מוזיקלי מתקדם ישירות על המחשב שלך ללא ענן'
                  : 'Run zero-latency, private AI directly on your machine with Ollama'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#666] hover:text-white p-2 rounded-lg hover:bg-[#222] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CHECKING OLLAMA / MODELS */}
        {(step === 'CHECKING_OLLAMA' || step === 'CHECKING_MODELS') && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-[#90FF00] animate-spin" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {step === 'CHECKING_OLLAMA'
                  ? isHebrew
                    ? 'בדיקת Ollama...'
                    : 'Checking Ollama installation...'
                  : isHebrew
                  ? 'בדיקת מודלים מקומיים...'
                  : 'Checking local AI models...'}
              </h3>
              <p className="text-xs text-[#888]">
                {isHebrew ? 'סורק יציאות ושירותים מקומיים' : 'Scanning local ports and system processes'}
              </p>
            </div>
          </div>
        )}

        {/* STEP 2A: OLLAMA MISSING */}
        {step === 'OLLAMA_MISSING' && (
          <div className="space-y-5">
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3 text-[#FF5555]">
                <XCircle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold">
                    {isHebrew ? 'AI מקומי עדיין לא מותקן.' : 'Local AI is not installed.'}
                  </h3>
                  <p className="text-xs text-[#AAA]">
                    {isHebrew
                      ? 'ה-AI המקומי מאפשר ל-Ableton AI Music Coach לעבוד ללא שליחת השיחות שלך לענן.'
                      : 'Ableton AI Music Coach uses local AI for private, offline music coaching.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 bg-[#121212] border border-[#222] rounded-lg text-[#CCC]">
                  <ShieldCheck className="w-4 h-4 text-[#90FF00]" />
                  <span>{isHebrew ? 'פרטיות מלאה 100%' : '100% Privacy & Security'}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-[#121212] border border-[#222] rounded-lg text-[#CCC]">
                  <HardDrive className="w-4 h-4 text-[#90FF00]" />
                  <span>{isHebrew ? 'עובד ללא אינטרנט' : 'Works Fully Offline'}</span>
                </div>
              </div>
            </div>

            {isPolling && (
              <div className="p-3 bg-[#182618] border border-[#386B38] rounded-xl flex items-center justify-between text-xs text-[#90FF00] font-mono">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>
                    {isHebrew
                      ? 'ממתין להשלמת ההתקנה והפעלת Ollama...'
                      : 'Waiting for Ollama service to start...'}
                  </span>
                </div>
                <button
                  onClick={runInitialCheck}
                  className="bg-[#90FF00] text-black px-2.5 py-1 rounded font-sans font-bold hover:bg-[#80e600]"
                >
                  {isHebrew ? 'בדוק עכשיו' : 'Check Now'}
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onClose}
                className="text-xs text-[#888] hover:text-white transition-colors cursor-pointer"
              >
                {isHebrew ? 'דלג לבינתיים' : 'Skip for now'}
              </button>

              <button
                onClick={handleInstallOllamaClick}
                className="flex items-center gap-2 bg-[#90FF00] hover:bg-[#80e600] text-black text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isHebrew ? 'התקן AI מקומי' : 'Install Local AI'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2B: OLLAMA STOPPED */}
        {step === 'OLLAMA_STOPPED' && (
          <div className="space-y-5">
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3 text-[#FFB000]">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold">
                    {isHebrew ? 'Ollama מותקן אך אינו פעיל.' : 'Ollama installed but not running.'}
                  </h3>
                  <p className="text-xs text-[#AAA]">
                    {isHebrew
                      ? 'שירות Ollama מותקן במחשב אך אינו רץ ברקע כעת.'
                      : 'The Ollama background service is present but currently stopped.'}
                  </p>
                </div>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-[#FF5555] font-mono bg-[#221111] p-2.5 rounded border border-[#442222]">
                {errorMessage}
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={runInitialCheck}
                className="text-xs text-[#AAA] hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isHebrew ? 'רענן' : 'Refresh'}</span>
              </button>

              <button
                onClick={handleStartOllama}
                className="flex items-center gap-2 bg-[#90FF00] hover:bg-[#80e600] text-black text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isHebrew ? 'הפעל את Ollama' : 'Start Ollama Service'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MODEL SELECTION */}
        {step === 'MODEL_SELECTION' && (
          <div className="space-y-5">
            {/* Status Header */}
            <div className="flex items-center justify-between bg-[#182218] border border-[#2A442A] rounded-xl p-3 text-xs text-[#90FF00]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold">
                  {isHebrew ? 'Ollama מותקן ופעיל' : 'Ollama Detected & Active'}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#777]" dir="ltr">
                {status?.version ? `v${status.version}` : 'http://localhost:11434'}
              </span>
            </div>

            {/* Existing Installed Models */}
            {installedModels.length > 0 ? (
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#AAA] uppercase tracking-wider block">
                  {isHebrew ? 'מודלים מותקנים שנמצאו במחשב' : 'Detected Installed Models'}
                </span>
                <div className="space-y-2">
                  {installedModels.map((m) => (
                    <div
                      key={m.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        selectedModel === m.id
                          ? 'bg-[#182A18] border-[#386B38] text-white'
                          : 'bg-[#181818] border-[#2A2A2A] text-[#CCC]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            selectedModel === m.id ? 'text-[#90FF00]' : 'text-[#555]'
                          }`}
                        />
                        <div>
                          <span className="font-mono font-bold text-sm" dir="ltr">
                            {m.id}
                          </span>
                          {m.sizeHuman && (
                            <span className="text-xs text-[#888] ml-2" dir="ltr">
                              ({m.sizeHuman})
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => runModelTest(m.id)}
                        className="bg-[#90FF00] hover:bg-[#80e600] text-black text-xs font-bold px-4 py-1.5 rounded-lg cursor-pointer"
                      >
                        {isHebrew ? 'השתמש במודל זה' : 'Use Installed Model'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Recommended Model Option */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#AAA] uppercase tracking-wider">
                  {isHebrew ? 'מודל AI מומלץ (Qwen 3.5)' : 'Recommended AI Model'}
                </span>
                {hardware && (
                  <span className="text-[10px] text-[#00E5FF] font-mono bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-2.5 py-0.5 rounded-full" dir="ltr">
                    RAM: {hardware.totalRamGB} GB • {hardware.description}
                  </span>
                )}
              </div>

              <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono text-base font-bold text-[#90FF00]" dir="ltr">
                        qwen3.5:4b
                      </h3>
                      <span className="text-[10px] bg-[#90FF00] text-black font-bold uppercase px-2 py-0.5 rounded">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-[#AAA] mt-1">
                      {isHebrew
                        ? 'מודל AI קל, מהיר ומדויק במיוחד המותאם למוזיקה אלקטרונית ו-Ableton Live 12'
                        : 'Ultra-fast music producer AI model tuned for Ableton Live 12 and electronic genres'}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#888] font-bold" dir="ltr">
                    ~3.4 GB
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#262626]">
                  <div className="text-[11px] text-[#777] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#90FF00]" />
                    <span>
                      {isHebrew
                        ? 'הורדה בלחיצה אחת דרך שרת Ollama הרשמי'
                        : 'One-click official stream from Ollama'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleStartDownload('qwen3.5:4b')}
                    className="flex items-center gap-2 bg-[#90FF00] hover:bg-[#80e600] text-black text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isHebrew ? 'הורד מודל 4B' : 'Install Qwen 3.5 4B'}</span>
                  </button>
                </div>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-[#FF5555] font-mono bg-[#221111] p-2.5 rounded border border-[#442222]">
                {errorMessage}
              </p>
            )}
          </div>
        )}

        {/* STEP 4: DOWNLOADING MODEL */}
        {step === 'DOWNLOADING_MODEL' && (
          <div className="space-y-6 py-4">
            <div className="space-y-2 text-center">
              <div className="inline-flex p-3 bg-[#90FF00]/10 border border-[#90FF00]/30 rounded-2xl text-[#90FF00]">
                <Download className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-base font-bold text-white">
                {isHebrew ? 'מוריד AI מקומי' : 'Downloading Local AI'}
              </h3>
              <p className="font-mono text-sm text-[#90FF00]" dir="ltr">
                {selectedModel}
              </p>
            </div>

            {/* Real Progress Bar */}
            <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#AAA]">{pullProgress?.status || 'Downloading layers...'}</span>
                <span className="text-[#90FF00] font-bold text-sm" dir="ltr">
                  {pullProgress?.percent || 0}%
                </span>
              </div>

              <div className="w-full bg-[#222] rounded-full h-3 overflow-hidden p-0.5 border border-[#333]">
                <div
                  className="bg-gradient-to-r from-[#90FF00] to-[#00E5FF] h-full rounded-full transition-all duration-300 shadow-lg"
                  style={{ width: `${Math.max(3, pullProgress?.percent || 0)}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono text-[#AAA] pt-1">
                <div className="bg-[#111] p-2 rounded border border-[#222]">
                  <span className="text-[9px] uppercase text-[#666] block">
                    {isHebrew ? 'נפח הורדה' : 'Data Size'}
                  </span>
                  <span className="text-white font-bold" dir="ltr">
                    {pullProgress?.completedHuman || '0 GB'} / {pullProgress?.totalHuman || '3.4 GB'}
                  </span>
                </div>

                <div className="bg-[#111] p-2 rounded border border-[#222]">
                  <span className="text-[9px] uppercase text-[#666] block">
                    {isHebrew ? 'מהירות' : 'Speed'}
                  </span>
                  <span className="text-white font-bold" dir="ltr">
                    {pullProgress?.speedMBs ? `${pullProgress.speedMBs} MB/s` : '-- MB/s'}
                  </span>
                </div>

                <div className="bg-[#111] p-2 rounded border border-[#222]">
                  <span className="text-[9px] uppercase text-[#666] block">
                    {isHebrew ? 'זמן משוער' : 'Estimated'}
                  </span>
                  <span className="text-white font-bold" dir="ltr">
                    {pullProgress?.etaSeconds ? `${pullProgress.etaSeconds} sec` : 'Calculating...'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center pt-2">
              <button
                onClick={handleCancelDownload}
                className="bg-[#252525] hover:bg-[#333] text-[#AAA] hover:text-white text-xs px-5 py-2 rounded-xl border border-[#3A3A3A] transition-colors cursor-pointer"
              >
                {isHebrew ? 'ביטול הורדה' : 'Cancel Download'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: TESTING MODEL */}
        {step === 'TESTING_MODEL' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <Sparkles className="w-10 h-10 text-[#00E5FF] animate-pulse" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {isHebrew ? 'בדיקת מודל ה-AI המקומי...' : 'Testing Local AI model...'}
              </h3>
              <p className="text-xs text-[#888] font-mono" dir="ltr">
                Sending test prompt to {selectedModel}
              </p>
            </div>
          </div>
        )}

        {/* STEP 6: READY */}
        {step === 'READY' && (
          <div className="space-y-6 py-4 text-center">
            <div className="inline-flex p-4 bg-[#90FF00]/15 border border-[#90FF00]/40 rounded-full text-[#90FF00] shadow-xl">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <span>🟢 {isHebrew ? 'ה-AI המקומי מוכן!' : 'Local AI Ready'}</span>
              </h3>
              <p className="text-xs text-[#AAA] max-w-md mx-auto leading-relaxed">
                {isHebrew
                  ? 'ה-AI המקומי מוגדר כעת לפעולה פרטית, מהירה ולא מקוונת ישירות בתוך Ableton AI Music Coach.'
                  : 'Your AI Music Coach is ready to run offline with zero cloud latency and 100% privacy.'}
              </p>
            </div>

            <div className="p-4 bg-[#182618] border border-[#2E522E] rounded-xl inline-block text-xs font-mono text-[#90FF00]">
              Provider: Ollama • Model: {selectedModel} • Status: Connected
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 bg-[#90FF00] hover:bg-[#80e600] text-black text-sm font-bold uppercase tracking-wider px-8 py-3 rounded-xl shadow-xl transition-all transform hover:scale-105 cursor-pointer"
              >
                <span>{isHebrew ? 'התחל ליצור מוזיקה' : 'Start Producing'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
