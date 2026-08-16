import React from 'react';
import {
  Activity,
  Sparkles,
  Volume2,
  Sliders,
  CheckCircle2,
  BarChart2,
  AlertTriangle
} from 'lucide-react';
import { AAMCProject, AnalysisResult, TrackMetrics } from '../../types';
import { audioService } from '../../services/audioService';
import { aiService } from '../../services/aiService';
import { useLanguage } from '../../context/LanguageContext';
import { debugLog } from '../../utils/debug';

interface TrackAnalyzerViewProps {
  project: AAMCProject;
}

export const TrackAnalyzerView: React.FC<TrackAnalyzerViewProps> = ({ project }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [metrics, setMetrics] = React.useState<TrackMetrics>({
    lufs: -11.5,
    rms: -13.2,
    peak: -0.8,
    lowMidRatio: 1.35,
    stereoWidth: 1.1,
  });

  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);
  const [userNotes, setUserNotes] = React.useState('');
  const { t, language, isRtl } = useLanguage();

  // Live Spectrum Visualizer Loop
  React.useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const analyser = audioService.getAnalyser();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;

          // Gradient from electric lime to cyan
          const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
          grad.addColorStop(0, '#90FF00');
          grad.addColorStop(0.5, '#00E5FF');
          grad.addColorStop(1, '#A855F7');

          ctx.fillStyle = grad;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
          x += barWidth;
        }

        // Live metrics tick
        setMetrics(audioService.calculateMetrics());
      } else {
        // Simulated idle frequency spectrum curve
        const bars = 48;
        const width = canvas.width / bars;
        for (let i = 0; i < bars; i++) {
          const h = (Math.sin(i * 0.3 + Date.now() * 0.003) * 0.4 + 0.5) * canvas.height * 0.7;
          ctx.fillStyle = '#90FF0022';
          ctx.fillRect(i * width, canvas.height - h, width - 2, h);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await aiService.analyzeTrack({
        genre: project.genre,
        lufs: metrics.lufs,
        rms: metrics.rms,
        peak: metrics.peak,
        lowMidRatio: metrics.lowMidRatio,
        stereoWidth: metrics.stereoWidth,
        userNotes,
        lang: language,
      });

      setAnalysisResult(res.analysis);
    } catch (err) {
      debugLog.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-[#E0E0E0] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A1A1A] border border-[#333] p-5 rounded-lg">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#90FF00] uppercase tracking-widest font-mono">
            <Activity className="w-3.5 h-3.5" />
            <span>{t('analyzer.subtitle')}</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">{t('analyzer.title')}</h1>
          <p className="text-xs text-[#888] mt-0.5">
            {t('analyzer.desc', { genre: project.genre })}
          </p>
        </div>

        <button
          onClick={handleRunAiAnalysis}
          disabled={isAnalyzing}
          className="bg-[#90FF00] hover:bg-[#80e600] text-black px-4 py-2 rounded font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-wider disabled:opacity-40"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>{isAnalyzing ? t('analyzer.analyzing') : t('analyzer.runAi')}</span>
        </button>
      </div>

      {/* Spectrum & Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Visualizer Canvas */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Real-Time Spectral Analysis</h3>
            <span className="text-[10px] font-mono text-[#90FF00]">20Hz - 20kHz Spectrum</span>
          </div>

          <div className="bg-[#121212] p-3 rounded border border-[#2A2A2A]">
            <canvas ref={canvasRef} width={600} height={200} className="w-full h-48 rounded bg-[#181818]" />
            <div className="flex justify-between text-[10px] text-[#666] font-mono mt-2 px-1">
              <span>20Hz (Sub)</span>
              <span>100Hz (Kick/Bass)</span>
              <span>500Hz (Mids)</span>
              <span>2kHz (Click)</span>
              <span>8kHz (Hats)</span>
              <span>20kHz (Air)</span>
            </div>
          </div>

          {/* User Track Notes Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#AAA]">Mix Notes / Concerns for AI Coach</label>
            <input
              type="text"
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="e.g., 'Kick feels muddy with bass at 200Hz' or 'Hats are too quiet'"
              className="w-full bg-[#121212] border border-[#333] rounded p-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#90FF00] font-mono"
            />
          </div>
        </div>

        {/* Loudness & Dynamics Meter Box */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-4">
          <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-widest">
            Loudness & Dynamics Gauges
          </h3>

          <div className="space-y-3">
            <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A]">
              <div className="text-[10px] font-mono text-[#666] uppercase">Estimated LUFS</div>
              <div className="text-xl font-bold font-mono text-[#90FF00] mt-0.5">
                {metrics.lufs} LUFS
              </div>
              <div className="text-[10px] text-[#888] mt-1">
                Target for {project.genre}: -8 LUFS (Master) / -12 LUFS (Mixdown)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#121212] p-3 rounded border border-[#2A2A2A]">
                <div className="text-[10px] font-mono text-[#666] uppercase">Estimated RMS</div>
                <div className="text-sm font-bold font-mono text-[#00E5FF]">{metrics.rms} dB</div>
              </div>

              <div className="bg-[#121212] p-3 rounded border border-[#2A2A2A]">
                <div className="text-[10px] font-mono text-[#666] uppercase">Estimated Peak</div>
                <div className="text-sm font-bold font-mono text-[#90FF00]">{metrics.peak} dB</div>
              </div>
            </div>

            <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A]">
              <div className="text-[10px] font-mono text-[#666] uppercase">Low / Mid Energy Ratio</div>
              <div className="text-base font-bold font-mono text-[#00E5FF]">{metrics.lowMidRatio}</div>
              <div className="text-[10px] text-[#888] mt-0.5">
                {metrics.lowMidRatio > 1.5 ? '⚠️ Heavy low end. Cut 200Hz-300Hz.' : '✓ Balanced energy'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Mix Feedback Results */}
      {analysisResult && (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#90FF00]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Mix Assessment</h3>
            </div>
            <span className="text-[10px] font-bold font-mono bg-[#121212] text-[#90FF00] border border-[#333] px-3 py-1 rounded">
              {analysisResult.overallRating}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A]">
              <div className="text-xs font-bold text-[#90FF00] font-mono">Loudness Analysis</div>
              <p className="text-xs text-[#BBB] mt-1 leading-relaxed">
                {analysisResult.loudnessAssessment}
              </p>
            </div>

            <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A]">
              <div className="text-xs font-bold text-[#00E5FF] font-mono">Spectral Balance</div>
              <p className="text-xs text-[#BBB] mt-1 leading-relaxed">
                {analysisResult.spectralBalance}
              </p>
            </div>

            <div className="bg-[#121212] p-3.5 rounded border border-[#2A2A2A]">
              <div className="text-xs font-bold text-[#E0E0E0] font-mono">Dynamics & Stereo Field</div>
              <p className="text-xs text-[#BBB] mt-1 leading-relaxed">
                {analysisResult.dynamicsAndWidth}
              </p>
            </div>
          </div>

          {/* Actionable Steps */}
          <div className="bg-[#121212] p-4 rounded border border-[#2A2A2A] space-y-2.5">
            <h4 className="text-[10px] font-bold text-[#90FF00] uppercase tracking-wider font-mono">
              Recommended Actionable Ableton Live 12 Fixes
            </h4>
            <div className="space-y-1.5">
              {analysisResult.actionableSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#CCC]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#90FF00] shrink-0 mt-0.5" />
                  <span className="font-mono">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
