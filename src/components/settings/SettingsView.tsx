import React from 'react';
import {
  Settings,
  Monitor,
  Globe,
  Cpu,
  Package,
  Terminal,
  CheckCircle,
  Sun,
  Moon,
  Sparkles,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  Check,
  Zap,
  Languages,
  Lock,
  Cloud,
  ShieldCheck,
  HardDrive
} from 'lucide-react';
import { desktopService } from '../../services/desktopService';
import { aiService } from '../../services/aiService';
import { AppSettings, AAMCProject } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n';
import { ModelManager } from '../ai/ModelManager';
import { AISettings, AIMode } from '../../services/ai/aiTypes';
import { debugLog } from '../../utils/debug';

interface SettingsViewProps {
  project: AAMCProject;
  onProjectChange: (p: AAMCProject) => void;
  isDesktop: boolean;
  theme: 'dark-studio' | 'high-contrast';
  onThemeChange: (theme: 'dark-studio' | 'high-contrast') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  project,
  onProjectChange,
  isDesktop,
  theme,
  onThemeChange,
}) => {
  const { language, setLanguage, t, supportedLanguages, currentLanguageConfig, isRTL } = useLanguage();

  const [platform, setPlatform] = React.useState('detecting...');
  const [version, setVersion] = React.useState('1.0.0');
  const [userDataPath, setUserDataPath] = React.useState('Detecting...');

  // AI Configuration State
  const [aiSettings, setAiSettings] = React.useState<AISettings>({
    mode: 'local-first',
    localEndpoint: 'http://localhost:11434',
    localModel: 'qwen3.5:9b',
    cloudProvider: 'gemini',
    cloudModel: 'gemini-3.6-flash',
    privacyMode: false,
    fallbackEnabled: true,
    apiKey: '',
    userLevel: 'Intermediate',
  });

  const [apiKeyInput, setApiKeyInput] = React.useState('');
  const [showKey, setShowKey] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ ok: boolean; statusMessage: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [diagnostics, setDiagnostics] = React.useState<any>(null);

  const fetchDiagnostics = React.useCallback(async () => {
    try {
      const diag = await aiService.getDiagnostics();
      setDiagnostics(diag);
      setAiSettings(diag.settings);
    } catch (err) {
      debugLog.warn('Failed to load diagnostics:', err);
    }
  }, []);

  React.useEffect(() => {
    desktopService.getPlatform().then(setPlatform);
    desktopService.getAppVersion().then(setVersion);
    desktopService.getUserDataPath().then(setUserDataPath);

    // Initial load
    const current = aiService.getSettings();
    setAiSettings(current);
    if (current.apiKey) {
      setApiKeyInput(current.apiKey.includes('••••') ? current.apiKey : '••••••••••••');
    }

    fetchDiagnostics();
  }, [fetchDiagnostics]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      if (aiSettings.mode === 'cloud-only') {
        const cloudRes = await aiService.testConnection({
          customKey: apiKeyInput.includes('••••') ? undefined : apiKeyInput,
          customModel: aiSettings.cloudModel,
        });
        setTestResult(cloudRes);
      } else {
        const localRes = await aiService.testLocalConnection();
        setTestResult({
          ok: localRes.ok,
          statusMessage: localRes.statusMessage,
        });
      }
      await fetchDiagnostics();
    } catch (err: any) {
      setTestResult({
        ok: false,
        statusMessage: `Test Error: ${err?.message || 'Connection failed'}`,
      });
      await fetchDiagnostics();
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveAISettings = async () => {
    try {
      const updated = { ...aiSettings };
      if (apiKeyInput && !apiKeyInput.includes('••••')) {
        updated.apiKey = apiKeyInput;
      }
      aiService.updateSettings(updated);
      await fetchDiagnostics();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      debugLog.error('Failed to save AI settings:', err);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-[#E0E0E0] font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A1A1A] border border-[#333] p-5 rounded-lg">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#90FF00] uppercase tracking-widest font-mono">
            <Settings className="w-3.5 h-3.5" />
            <span>{t('settings.title')}</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">{t('settings.title')}</h1>
          <p className="text-xs text-[#888] mt-0.5">
            {t('settings.about')}
          </p>
        </div>
      </div>

      {/* Official Branding & About Banner */}
      <div className="bg-[#141414] border border-[#333] rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden" dir="ltr">
        <div className="w-full md:w-1/3 flex justify-center">
          <img
            src="branding/logo.png"
            alt="Ableton AI Music Coach Official Logo"
            className="max-h-36 object-contain filter drop-shadow-xl"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).setAttribute('src', 'branding/logo.svg');
            }}
          />
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="text-[10px] font-mono font-bold text-[#90FF00] uppercase tracking-widest bg-[#1A2810] border border-[#334422] px-2.5 py-1 rounded inline-block">
            OFFICIAL WORKSTATION BRANDING
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            Ableton <span className="text-[#90FF00]">AI</span> Music Coach
          </h2>
          <p className="text-xs text-[#AAA] max-w-xl leading-relaxed">
            {t('dashboard.subtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-[11px] font-mono text-[#888]">
            <span>VERSION: <strong className="text-white">v{version}</strong></span>
            <span>•</span>
            <span>PLATFORM: <strong className="text-[#00E5FF]">{platform.toUpperCase()}</strong></span>
            <span>•</span>
            <span>BUILD: <strong className="text-[#90FF00]">LOCAL-FIRST AI ARCHITECTURE</strong></span>
          </div>
        </div>
      </div>

      {/* INTERNATIONALIZATION (i18n) LANGUAGE SELECTOR */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-[#2A2A2A] pb-3">
          <div className="w-7 h-7 rounded bg-[#00E5FF] text-black flex items-center justify-center font-bold">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('settings.language')}
            </h2>
            <p className="text-xs text-[#888]">
              {t('settings.availableLanguages')} • {t('settings.currentLanguage')}: <span className="text-[#90FF00] font-bold">{currentLanguageConfig.nativeName} ({currentLanguageConfig.name})</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {supportedLanguages.map((langConfig) => {
            const isSelected = language === langConfig.code;
            return (
              <button
                key={langConfig.code}
                onClick={() => setLanguage(langConfig.code as Language)}
                className={`p-3 rounded-lg border flex flex-col justify-between transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#142810] border-[#90FF00] text-white shadow-lg'
                    : 'bg-[#121212] border-[#2A2A2A] hover:bg-[#1C1C1C] text-[#AAA]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-white">{langConfig.nativeName}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                    langConfig.dir === 'rtl' ? 'bg-[#2A1414] text-[#FF9999] border-[#552222]' : 'bg-[#12242A] text-[#00E5FF] border-[#224455]'
                  }`}>
                    {langConfig.dir.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-[#252525]">
                  <span className="text-[10px] text-[#777] font-mono">{langConfig.name}</span>
                  {isSelected && (
                    <CheckCircle className="w-3.5 h-3.5 text-[#90FF00]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* LOCAL-FIRST AI ENGINE CONFIGURATION PANEL */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#90FF00] text-black flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Local-First AI Engine Configuration
              </h2>
              <p className="text-xs text-[#888]">
                Local Ollama AI (Primary) • Cloud Gemini (Fallback) • Privacy Controls
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="bg-[#252525] hover:bg-[#333] text-[#00E5FF] border border-[#444] px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing...' : 'Test Active AI'}</span>
            </button>

            <button
              onClick={handleSaveAISettings}
              className="bg-[#90FF00] hover:bg-[#80e600] text-black px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
              <span>{saveSuccess ? 'Saved!' : 'Save Settings'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Connection Status Result Banner */}
        {testResult && (
          <div
            className={`p-3.5 rounded border text-xs font-mono flex items-start gap-2.5 ${
              testResult.ok
                ? 'bg-[#142810] border-[#335522] text-[#90FF00]'
                : 'bg-[#2A1414] border-[#552222] text-[#FF5555]'
            }`}
          >
            {testResult.ok ? (
              <CheckCircle className="w-4 h-4 text-[#90FF00] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#FF5555] shrink-0 mt-0.5" />
            )}
            <div className="flex-1 leading-relaxed">
              <strong>{testResult.statusMessage}</strong>
            </div>
          </div>
        )}

        {/* Mode & Privacy Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Execution Mode */}
          <div>
            <label className="text-xs text-[#AAA] font-semibold block mb-1.5">AI Execution Mode</label>
            <select
              value={aiSettings.mode}
              onChange={(e) => setAiSettings({ ...aiSettings, mode: e.target.value as AIMode })}
              className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs font-mono text-[#90FF00] font-bold focus:outline-none"
            >
              <option value="local-first">Local First (Recommended)</option>
              <option value="local-only">Local Only (100% Offline)</option>
              <option value="cloud-only">Cloud Only (Gemini API)</option>
              <option value="auto">Automatic Router</option>
            </select>
          </div>

          {/* Privacy Mode */}
          <div>
            <label className="text-xs text-[#AAA] font-semibold block mb-1.5">Privacy Mode</label>
            <button
              onClick={() => setAiSettings({ ...aiSettings, privacyMode: !aiSettings.privacyMode })}
              className={`w-full py-2 px-3 rounded text-xs font-bold border flex items-center justify-between transition-colors cursor-pointer ${
                aiSettings.privacyMode
                  ? 'bg-[#1F2C1F] text-[#90FF00] border-[#386B38]'
                  : 'bg-[#121212] text-[#888] border-[#2A2A2A]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#90FF00]" />
                <span>Privacy Mode</span>
              </span>
              <span className="font-mono text-[10px]">{aiSettings.privacyMode ? 'ON (Locked)' : 'OFF'}</span>
            </button>
          </div>

          {/* Fallback Control */}
          <div>
            <label className="text-xs text-[#AAA] font-semibold block mb-1.5">Cloud Fallback</label>
            <button
              onClick={() => setAiSettings({ ...aiSettings, fallbackEnabled: !aiSettings.fallbackEnabled })}
              className={`w-full py-2 px-3 rounded text-xs font-bold border flex items-center justify-between transition-colors cursor-pointer ${
                aiSettings.fallbackEnabled
                  ? 'bg-[#12222A] text-[#00E5FF] border-[#184857]'
                  : 'bg-[#121212] text-[#888] border-[#2A2A2A]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Cloud Fallback</span>
              </span>
              <span className="font-mono text-[10px]">{aiSettings.fallbackEnabled ? 'ENABLED' : 'DISABLED'}</span>
            </button>
          </div>

          {/* User Experience Level */}
          <div>
            <label className="text-xs text-[#AAA] font-semibold block mb-1.5">{t('settings.userLevel')}</label>
            <select
              value={aiSettings.userLevel}
              onChange={(e) => setAiSettings({ ...aiSettings, userLevel: e.target.value as any })}
              className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs font-mono text-[#00E5FF] font-bold focus:outline-none"
            >
              <option value="Beginner">{t('settings.beginner')}</option>
              <option value="Intermediate">{t('settings.intermediate')}</option>
              <option value="Advanced">{t('settings.advanced')}</option>
            </select>
          </div>
        </div>

        {/* Embedded Local Model Manager */}
        <ModelManager />

        {/* Cloud Gemini Configuration */}
        <div className="bg-[#121212] p-4 rounded border border-[#2A2A2A] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Cloud Gemini API Configuration (Fallback Provider)</span>
            </label>
            <span className="text-[10px] font-mono text-[#888]">
              Used when Local AI is unavailable and Privacy Mode is OFF
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-[#AAA] font-semibold block mb-1">Gemini Model</label>
              <select
                value={aiSettings.cloudModel}
                onChange={(e) => setAiSettings({ ...aiSettings, cloudModel: e.target.value })}
                className="w-full bg-[#181818] border border-[#333] rounded p-2 text-xs font-mono text-[#00E5FF] font-bold focus:outline-none"
                dir="ltr"
              >
                <option value="gemini-3.6-flash">gemini-3.6-flash (Recommended)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep Reasoning)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-[#AAA] font-semibold block mb-1">Gemini API Key</label>
              <div className="relative flex items-center">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste Gemini API Key..."
                  className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#90FF00] font-mono placeholder-[#555] focus:outline-none focus:border-[#90FF00] pr-10"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 text-[#888] hover:text-white cursor-pointer"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Diagnostic Debug Panel */}
        <div className="bg-[#121212] border border-[#2A2A2A] rounded p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#222] pb-2">
            <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>AI Engine Telemetry & Diagnostic Status</span>
            </span>
            <button
              onClick={fetchDiagnostics}
              className="text-[10px] text-[#888] hover:text-[#90FF00] flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Telemetry</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div className="bg-[#181818] p-2.5 rounded border border-[#222]">
              <div className="text-[9px] text-[#666] uppercase">Active Provider</div>
              <div className="font-bold text-[#90FF00] mt-0.5 uppercase">{diagnostics?.activeProvider || 'Ollama'}</div>
            </div>

            <div className="bg-[#181818] p-2.5 rounded border border-[#222]">
              <div className="text-[9px] text-[#666] uppercase">Active Model</div>
              <div className="font-bold text-[#00E5FF] mt-0.5">{diagnostics?.activeModel || 'qwen3.5:9b'}</div>
            </div>

            <div className="bg-[#181818] p-2.5 rounded border border-[#222]">
              <div className="text-[9px] text-[#666] uppercase">Local Health</div>
              <div className={`font-bold mt-0.5 ${diagnostics?.localHealth?.ok ? 'text-[#90FF00]' : 'text-[#FF5555]'}`}>
                {diagnostics?.localHealth?.status || 'NOT RUNNING'}
              </div>
            </div>

            <div className="bg-[#181818] p-2.5 rounded border border-[#222]">
              <div className="text-[9px] text-[#666] uppercase">Privacy Lock</div>
              <div className="font-bold text-white mt-0.5">
                {aiSettings.privacyMode ? '🔒 ENFORCED' : 'OFF'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environment Details */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-4">
          <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-widest font-mono flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#90FF00]" />
            <span>Runtime Environment Details</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Execution Mode</div>
                <div className="text-[10px] text-[#888] mt-0.5">Desktop Abstraction Layer</div>
              </div>
              {isDesktop ? (
                <span className="text-[10px] font-mono font-bold bg-[#121212] text-[#90FF00] border border-[#333] px-3 py-1 rounded flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5" />
                  <span>WINDOWS DESKTOP</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold bg-[#121212] text-[#00E5FF] border border-[#333] px-3 py-1 rounded flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>WEB BROWSER</span>
                </span>
              )}
            </div>

            <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] space-y-1.5">
              <div className="text-xs font-bold text-white">System Storage Directory</div>
              <p className="text-xs font-mono text-[#90FF00] bg-[#181818] p-2 rounded border border-[#2A2A2A] break-all" dir="ltr">
                {userDataPath}
              </p>
            </div>
          </div>
        </div>

        {/* Windows Executable & Installer Build Guide */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-4">
          <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-widest font-mono flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Windows Packaging (.exe Installer)</span>
          </h3>

          <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A] space-y-2 font-mono text-xs">
            <div className="text-[#90FF00] font-bold">1. Electron Windows Builder:</div>
            <div className="bg-[#181818] p-2 rounded border border-[#2A2A2A] text-white">
              npm run dist:win
            </div>
          </div>
        </div>

        {/* Appearance & Accessibility */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-4 lg:col-span-2">
          <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-widest font-mono flex items-center gap-2">
            <Monitor className="w-3.5 h-3.5 text-[#E5A500]" />
            <span>{t('settings.appearance')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => onThemeChange('dark-studio')}
              className={`flex items-center gap-3 p-4 rounded border text-left transition-colors ${
                theme === 'dark-studio'
                  ? 'bg-[#252525] border-[#90FF00]'
                  : 'bg-[#121212] border-[#2A2A2A] hover:bg-[#181818]'
              }`}
            >
              <div className={`p-2 rounded ${theme === 'dark-studio' ? 'bg-[#121212] text-[#90FF00]' : 'bg-[#1A1A1A] text-[#888]'}`}>
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-sm font-bold ${theme === 'dark-studio' ? 'text-white' : 'text-[#888]'}`}>{t('settings.darkStudio')}</div>
              </div>
            </button>

            <button
              onClick={() => onThemeChange('high-contrast')}
              className={`flex items-center gap-3 p-4 rounded border text-left transition-colors ${
                theme === 'high-contrast'
                  ? 'bg-black border-white'
                  : 'bg-[#121212] border-[#2A2A2A] hover:bg-[#181818]'
              }`}
            >
              <div className={`p-2 rounded ${theme === 'high-contrast' ? 'bg-[#111] text-white border border-white' : 'bg-[#1A1A1A] text-[#888]'}`}>
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-sm font-bold ${theme === 'high-contrast' ? 'text-white' : 'text-[#888]'}`}>{t('settings.highContrast')}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
