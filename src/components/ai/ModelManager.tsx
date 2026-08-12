import React, { useState, useEffect } from 'react';
import { Cpu, RefreshCw, CheckCircle2, Download, Copy, Check, Zap } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { ollamaService, PullProgress } from '../../services/ollamaService';
import { AIModel } from '../../services/ai/aiTypes';
import { useLanguage } from '../../context/LanguageContext';

export const ModelManager: React.FC = () => {
  const { isRtl, language } = useLanguage();
  const isHebrew = language === 'he' || isRtl;

  const [installedModels, setInstalledModels] = useState<AIModel[]>([]);
  const [activeModel, setActiveModel] = useState<string>('qwen3.5:4b');
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadingTag, setDownloadingTag] = useState<string | null>(null);
  const [pullProgress, setPullProgress] = useState<PullProgress | null>(null);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const models = await aiService.getLocalModels();
      setInstalledModels(models);
      const settings = aiService.getSettings();
      setActiveModel(settings.localModel || 'qwen3.5:4b');
    } catch {
      setInstalledModels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleSelectModel = (modelId: string) => {
    setActiveModel(modelId);
    aiService.updateSettings({ localModel: modelId, mode: 'local-first' });
  };

  const handleOneClickDownload = async (tag: string) => {
    setDownloadingTag(tag);
    setPullProgress({
      modelName: tag,
      status: 'Connecting to Ollama...',
      percent: 0,
      completedBytes: 0,
      totalBytes: 3.4 * 1024 * 1024 * 1024,
      completedHuman: '0 GB',
      totalHuman: '3.4 GB',
      speedMBs: 0,
      etaSeconds: 0,
    });

    const result = await ollamaService.pullModel(tag, (prog) => {
      setPullProgress(prog);
    });

    setDownloadingTag(null);
    setPullProgress(null);

    if (result.success) {
      await fetchModels();
      handleSelectModel(tag);
    }
  };

  const copyPullCommand = (tag: string) => {
    const cmd = `ollama pull ${tag}`;
    navigator.clipboard.writeText(cmd);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const RECOMMENDED_MODELS = [
    { tag: 'qwen3.5:4b', size: '2.6 GB', desc: isHebrew ? 'מודל קל ומהיר במיוחד לרוב מחשבי הסטודיו (מומלץ)' : 'Optimal balance of speed and music intelligence (Recommended)' },
    { tag: 'qwen3.5:2b', size: '1.4 GB', desc: isHebrew ? 'מודל קל משקל לחיסכון במשאבים וזיכרון RAM' : 'Ultra-lightweight for lower VRAM / Laptop usage' },
    { tag: 'qwen3.5:9b', size: '5.2 GB', desc: isHebrew ? 'אינטליגנציה גבוהה למחשבים עם 16GB RAM ומעלה' : 'Enhanced intelligence for 16GB+ RAM workstations' },
    { tag: 'qwen3.5:27b', size: '16.0 GB', desc: isHebrew ? 'מקסימום ביצועים לחדרי עבודה מקצועיים' : 'Maximum intelligence for workstations with 32GB+ RAM' },
  ];

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 space-y-4 font-sans text-white text-xs" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between border-b border-[#222] pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#90FF00]" />
          <span className="font-bold text-xs uppercase tracking-wider text-white">
            {isHebrew ? 'ניהול מודלים מקומיים (Ollama)' : 'Local Model Manager (Ollama)'}
          </span>
        </div>
        <button
          onClick={fetchModels}
          disabled={loading}
          className="flex items-center gap-1 text-[11px] bg-[#222] hover:bg-[#333] text-[#CCC] px-2.5 py-1 rounded border border-[#333] transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-[#90FF00]' : ''}`} />
          <span>{isHebrew ? 'רענן' : 'Refresh'}</span>
        </button>
      </div>

      {/* Installed Models Section */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-[#AAA] uppercase tracking-wider block">
          {isHebrew ? 'מודלים מקומיים מותקנים' : 'Installed Local Models'}
        </span>
        {installedModels.length === 0 ? (
          <div className="p-3 bg-[#1A1A1A] border border-[#262626] rounded text-[#888] text-[11px]">
            {isHebrew
              ? 'לא זוהו מודלים ב-Ollama. תוכל להוריד מודל בלחיצה אחת למטה.'
              : 'No models detected in Ollama. Download a model with one click below.'}
          </div>
        ) : (
          <div className="space-y-1.5">
            {installedModels.map((m) => {
              const isActive = m.id.toLowerCase() === activeModel.toLowerCase();
              return (
                <div
                  key={m.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                    isActive
                      ? 'bg-[#182918] border-[#386B38] text-white'
                      : 'bg-[#181818] border-[#2A2A2A] text-[#CCC] hover:border-[#444]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-[#90FF00]" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#444]" />
                    )}
                    <div>
                      <span className="font-mono text-xs font-bold" dir="ltr">{m.id}</span>
                      {m.sizeHuman && <span className="text-[10px] text-[#777] ml-2" dir="ltr">({m.sizeHuman})</span>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectModel(m.id)}
                    className={`text-[10px] uppercase font-bold px-3 py-1 rounded-md transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#90FF00] text-black'
                        : 'bg-[#282828] hover:bg-[#383838] text-white border border-[#444]'
                    }`}
                  >
                    {isActive ? (isHebrew ? 'פעיל' : 'Active') : (isHebrew ? 'בחר' : 'Use')}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended Qwen 3.5 Models */}
      <div className="space-y-3 pt-2 border-t border-[#222]">
        <span className="text-[11px] font-bold text-[#AAA] uppercase tracking-wider block">
          {isHebrew ? 'מודלים מומלצים מבית Qwen 3.5' : 'Recommended Qwen 3.5 Models'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {RECOMMENDED_MODELS.map((item) => {
            const isInstalled = installedModels.some((m) => m.id.toLowerCase().includes(item.tag));
            const isDownloading = downloadingTag === item.tag;

            return (
              <div key={item.tag} className="p-3 bg-[#181818] border border-[#282828] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#90FF00]" dir="ltr">{item.tag}</span>
                  <span className="text-[10px] text-[#888] font-mono" dir="ltr">{item.size}</span>
                </div>
                <p className="text-[10px] text-[#AAA] leading-snug">{item.desc}</p>

                {isDownloading && pullProgress && (
                  <div className="space-y-1 bg-[#111] p-2 rounded border border-[#222]">
                    <div className="flex justify-between text-[10px] font-mono text-[#90FF00]">
                      <span>{pullProgress.status}</span>
                      <span>{pullProgress.percent}%</span>
                    </div>
                    <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#90FF00] h-full" style={{ width: `${pullProgress.percent}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-[#222]">
                  <span className="text-[9px] font-mono uppercase text-[#777]">
                    {isInstalled ? (isHebrew ? '✓ מותקן' : '✓ Installed') : (isHebrew ? 'לא מותקן' : 'Not installed')}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {!isInstalled && (
                      <button
                        onClick={() => handleOneClickDownload(item.tag)}
                        disabled={isDownloading}
                        className="flex items-center gap-1 text-[10px] font-bold bg-[#90FF00] hover:bg-[#80e600] text-black px-2.5 py-1 rounded transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>{isDownloading ? (isHebrew ? 'מוריד...' : 'Downloading...') : (isHebrew ? 'הורדה קלה' : 'One-Click Download')}</span>
                      </button>
                    )}

                    <button
                      onClick={() => copyPullCommand(item.tag)}
                      className="p-1 bg-[#222] hover:bg-[#333] text-[#CCC] rounded border border-[#333] transition-colors cursor-pointer"
                      title="Copy CMD command"
                    >
                      {copiedTag === item.tag ? (
                        <Check className="w-3 h-3 text-[#90FF00]" />
                      ) : (
                        <Copy className="w-3 h-3 text-[#777]" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
