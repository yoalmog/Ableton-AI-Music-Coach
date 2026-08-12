import React, { useState } from 'react';
import { Upload, Activity, Layers, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { AAMCProject } from '../../types';
import { audioService } from '../../services/audioService';
import { useLanguage } from '../../context/LanguageContext';

interface ReferenceAnalyzerViewProps {
  project: AAMCProject;
  onOpenCoachWithMessage: (msg: string) => void;
}

export const ReferenceAnalyzerView: React.FC<ReferenceAnalyzerViewProps> = ({
  project,
  onOpenCoachWithMessage,
}) => {
  const { t, language } = useLanguage();
  const isHe = language === 'he';

  const [userFileName, setUserFileName] = useState<string | null>(null);
  const [refFileName, setRefFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  // Computed metrics
  const [metrics, setMetrics] = useState({
    userLufs: -11.4,
    refLufs: -7.2,
    userSubDb: -4.5,
    refSubDb: -2.1,
    userWidth: 1.1,
    refWidth: 1.4,
  });

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isRef: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isRef) {
        setRefFileName(file.name);
      } else {
        setUserFileName(file.name);
      }
    }
  };

  const handleRunComparison = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const realMetrics = audioService.calculateMetrics();
      setMetrics({
        userLufs: realMetrics.lufs,
        refLufs: -7.5,
        userSubDb: -4.2,
        refSubDb: -2.0,
        userWidth: realMetrics.stereoWidth,
        refWidth: 1.45,
      });
      setIsAnalyzing(false);
      setAnalysisDone(true);
    }, 1200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="bg-[#181818] border border-[#333] p-5 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-5 h-5 text-[#00E5FF]" />
          <h1 className="text-xl font-bold text-white">
            {t('refAnalyzer.title')}
          </h1>
        </div>
        <p className="text-xs text-[#AAA] leading-relaxed">
          {t('refAnalyzer.subtitle')}
        </p>
      </div>

      {/* Upload Zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Track Upload Card */}
        <div className="bg-[#181818] border border-[#333] rounded-lg p-5 space-y-3">
          <span className="text-xs font-mono font-bold text-[#90FF00] uppercase block">
            {t('refAnalyzer.userTrack')}
          </span>
          <label className="border-2 border-dashed border-[#444] hover:border-[#90FF00] rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-[#121212]">
            <Upload className="w-6 h-6 text-[#90FF00]" />
            <span className="text-xs text-[#CCC] font-semibold">
              {userFileName || t('refAnalyzer.uploadPrompt')}
            </span>
            <input
              type="file"
              accept=".wav,.mp3,.flac"
              onChange={(e) => handleSimulatedFileUpload(e, false)}
              className="hidden"
            />
          </label>
        </div>

        {/* Reference Track Upload Card */}
        <div className="bg-[#181818] border border-[#333] rounded-lg p-5 space-y-3">
          <span className="text-xs font-mono font-bold text-[#00E5FF] uppercase block">
            {t('refAnalyzer.refTrack')}
          </span>
          <label className="border-2 border-dashed border-[#444] hover:border-[#00E5FF] rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-[#121212]">
            <Upload className="w-6 h-6 text-[#00E5FF]" />
            <span className="text-xs text-[#CCC] font-semibold">
              {refFileName || t('refAnalyzer.uploadRefPrompt')}
            </span>
            <input
              type="file"
              accept=".wav,.mp3,.flac"
              onChange={(e) => handleSimulatedFileUpload(e, true)}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleRunComparison}
          disabled={isAnalyzing}
          className="px-6 py-2.5 bg-[#90FF00] hover:bg-[#a6ff26] text-black font-bold text-xs rounded shadow-lg transition-colors cursor-pointer inline-flex items-center gap-2"
        >
          {isAnalyzing ? (
            <span>{t('refAnalyzer.calculating')}</span>
          ) : (
            <>
              <Activity className="w-4 h-4" />
              <span>{t('refAnalyzer.runComparison')}</span>
            </>
          )}
        </button>
      </div>

      {/* Comparison Results */}
      {analysisDone && (
        <div className="bg-[#181818] border border-[#333] rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#333] pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              {t('refAnalyzer.resultsTitle')}
            </h3>
            <span className="text-[10px] font-mono text-[#90FF00] bg-[#90FF00]/10 px-2 py-0.5 rounded border border-[#90FF00]/30">
              {t('refAnalyzer.heuristicTag')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#121212] p-4 rounded border border-[#222]">
              <span className="text-[10px] font-mono text-[#888] block uppercase">
                {t('refAnalyzer.lufsHeading')}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-sm font-mono font-bold text-white">
                  {isHe ? `הטראק שלך: ${metrics.userLufs} LUFS` : `Your Track: ${metrics.userLufs} LUFS`}
                </span>
                <span className="text-xs font-mono text-[#00E5FF]">
                  {isHe ? `ייחוס: ${metrics.refLufs} LUFS` : `Ref: ${metrics.refLufs} LUFS`}
                </span>
              </div>
              <span className="text-[11px] text-[#AAA] block mt-1">
                {isHe
                  ? 'למיקס שלך יש כ-4.2 dB יותר מרווח דינמי (Headroom) מאשר לטראק הייחוס.'
                  : 'Your mix has ~4.2 dB more dynamic headroom than the reference.'}
              </span>
            </div>

            <div className="bg-[#121212] p-4 rounded border border-[#222]">
              <span className="text-[10px] font-mono text-[#888] block uppercase">
                {t('refAnalyzer.subHeading')}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-sm font-mono font-bold text-white">
                  {isHe ? `הטראק שלך: ${metrics.userSubDb} dB` : `Your Track: ${metrics.userSubDb} dB`}
                </span>
                <span className="text-xs font-mono text-[#00E5FF]">
                  {isHe ? `ייחוס: ${metrics.refSubDb} dB` : `Ref: ${metrics.refSubDb} dB`}
                </span>
              </div>
              <span className="text-[11px] text-[#AAA] block mt-1">
                {isHe
                  ? 'הסאב-באס שקט בכ-2 dB בהשוואה לטראק הייחוס המסחרי.'
                  : 'Sub-bass is ~2 dB quieter than commercial reference.'}
              </span>
            </div>

            <div className="bg-[#121212] p-4 rounded border border-[#222]">
              <span className="text-[10px] font-mono text-[#888] block uppercase">
                {t('refAnalyzer.stereoHeading')}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-sm font-mono font-bold text-white">
                  {isHe ? `הטראק שלך: ${metrics.userWidth}` : `Your Track: ${metrics.userWidth}`}
                </span>
                <span className="text-xs font-mono text-[#00E5FF]">
                  {isHe ? `ייחוס: ${metrics.refWidth}` : `Ref: ${metrics.refWidth}`}
                </span>
              </div>
              <span className="text-[11px] text-[#AAA] block mt-1">
                {isHe
                  ? 'פריסת הסטריאו בתדרים הגבוהים צרה מעט מהרצוי.'
                  : 'High-frequency stereo panning is slightly narrower.'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#121212] rounded border border-[#222] space-y-2">
            <h4 className="text-xs font-mono font-bold text-[#90FF00] uppercase">
              {t('refAnalyzer.aiAdvice')}
            </h4>
            <ul className="text-xs text-[#CCC] space-y-1 list-disc list-inside">
              {isHe ? (
                <>
                  <li>הגבר את עוצמת הסאב-באס של Operator ב-+1.5 dB על בוס הקיק והבאס.</li>
                  <li>השתמש ב-Utility עם מצב "Bass Mono" ב-120Hz כדי לוודא שאיזון המונו בסאב תואם לייחוס.</li>
                  <li>הוסף Saturator (Soft Clip +1.8dB) לבוס התופים הראשי להגברת צפיפות הטרנזיינטים.</li>
                </>
              ) : (
                <>
                  <li>Boost Operator Sub-Bass volume by +1.5 dB on the Kick & Bass bus.</li>
                  <li>Use Utility "Bass Mono" at 120Hz to ensure mono sub balance matches the reference.</li>
                  <li>Add Saturator (Soft Clip +1.8dB) to the main drum bus to gain transient density.</li>
                </>
              )}
            </ul>
          </div>

          <button
            onClick={() =>
              onOpenCoachWithMessage(
                isHe
                  ? `בהתבסס על ניתוח ספקטרום הטראק שלי (${metrics.userLufs} LUFS לעומת ${metrics.refLufs} LUFS בייחוס), תן לי הגדרות מדויקות לפלאגינים ב-Ableton Live 12 כדי להתאים לטראק הייחוס המסחרי.`
                  : `Based on my track spectrum analysis (${metrics.userLufs} LUFS vs ${metrics.refLufs} LUFS reference), give me exact Ableton Live 12 plugin settings to match the commercial reference.`
              )
            }
            className="px-4 py-2 bg-[#252525] hover:bg-[#333] border border-[#444] text-[#90FF00] text-xs font-bold rounded flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#90FF00]" />
            <span>
              {t('refAnalyzer.getAiAdvice')}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
