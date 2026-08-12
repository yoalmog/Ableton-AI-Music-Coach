import React from 'react';
import { Activity, AlertCircle, CheckCircle2, ShieldAlert, Sparkles, Sliders } from 'lucide-react';
import { AAMCProject } from '../../types';

interface KickBassDiagnosticProps {
  project: AAMCProject;
}

export const KickBassDiagnostic: React.FC<KickBassDiagnosticProps> = ({ project }) => {
  const bass = project.bassSettings || {
    patternType: 'K-B-B-B',
    rootKey: project.key,
    octave: 1,
    cutoffHz: 800,
    decayMs: 160,
    resonance: 10,
    subLevel: 0.9,
    driveAmount: 20,
    sidechainAmount: 80,
  };

  // Heuristic diagnostic calculations based on parameters
  const isDecayOptimal = bass.decayMs >= 140 && bass.decayMs <= 175;
  const isSidechainOptimal = bass.sidechainAmount >= 70;
  const isCutoffOptimal = bass.cutoffHz >= 600 && bass.cutoffHz <= 1200;

  // Estimated Low-End Overlap score (0 - 100%)
  let overlapRiskPercent = 20;
  if (!isSidechainOptimal) overlapRiskPercent += 40;
  if (!isDecayOptimal) overlapRiskPercent += 25;
  if (bass.subLevel > 0.95) overlapRiskPercent += 15;
  overlapRiskPercent = Math.min(95, overlapRiskPercent);

  return (
    <div className="bg-[#181818] border border-[#333] rounded-lg p-5 space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#333] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#90FF00]" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight">
              Kick + Bass Low-End Diagnostic
            </h3>
            <span className="text-[10px] font-mono text-[#00E5FF]">HEURISTIC / ESTIMATED ANALYSIS</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-[#888] block">FREQUENCY OVERLAP RISK</span>
          <span className={`text-xs font-mono font-bold ${overlapRiskPercent > 50 ? 'text-[#FF5555]' : 'text-[#90FF00]'}`}>
            {overlapRiskPercent}% ({overlapRiskPercent > 50 ? 'HIGH COLLISION' : 'CLEAN SEPARATION'})
          </span>
        </div>
      </div>

      {/* Visual Frequency Spectrum Simulation Bars */}
      <div className="bg-[#121212] p-4 rounded border border-[#222] space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#888]">
          <span>SUB (30-60Hz)</span>
          <span>LOW-MID (60-150Hz)</span>
          <span>MID (150-800Hz)</span>
        </div>

        <div className="grid grid-cols-3 gap-2 h-16 items-end">
          {/* Sub Bar */}
          <div className="bg-[#222] h-full rounded relative overflow-hidden flex items-end p-1">
            <div
              className="w-full bg-[#90FF00] rounded transition-all duration-500"
              style={{ height: `${Math.min(100, bass.subLevel * 90)}%` }}
            />
            <span className="absolute top-1 left-1.5 text-[9px] font-mono text-[#888]">Kick Peak: 46Hz</span>
          </div>

          {/* Low-Mid Bar */}
          <div className="bg-[#222] h-full rounded relative overflow-hidden flex items-end p-1">
            <div
              className={`w-full rounded transition-all duration-500 ${overlapRiskPercent > 50 ? 'bg-[#FF5555]' : 'bg-[#00E5FF]'}`}
              style={{ height: `${Math.min(100, (bass.decayMs / 200) * 85)}%` }}
            />
            <span className="absolute top-1 left-1.5 text-[9px] font-mono text-[#888]">Bass Decay: {bass.decayMs}ms</span>
          </div>

          {/* Mid Bar */}
          <div className="bg-[#222] h-full rounded relative overflow-hidden flex items-end p-1">
            <div
              className="w-full bg-[#a855f7] rounded transition-all duration-500"
              style={{ height: `${Math.min(100, (bass.cutoffHz / 1200) * 80)}%` }}
            />
            <span className="absolute top-1 left-1.5 text-[9px] font-mono text-[#888]">Filter: {bass.cutoffHz}Hz</span>
          </div>
        </div>
      </div>

      {/* Actionable Recommendations List */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono font-bold text-[#CCC] uppercase">Diagnostic Recommendations</h4>

        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2.5 p-2.5 bg-[#121212] rounded border border-[#2A2A2A]">
            {isSidechainOptimal ? (
              <CheckCircle2 className="w-4 h-4 text-[#90FF00] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#FF5555] shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="text-white block font-sans">Sidechain Ducking Depth</strong>
              <span className="text-[#AAA] font-sans">
                {isSidechainAmountOptimalText(bass.sidechainAmount)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[#121212] rounded border border-[#2A2A2A]">
            {isDecayOptimal ? (
              <CheckCircle2 className="w-4 h-4 text-[#90FF00] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#E5A500] shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="text-white block font-sans">Bass Tail Decay ({bass.decayMs} ms)</strong>
              <span className="text-[#AAA] font-sans">
                {isDecayOptimal
                  ? 'Decay length is optimal (140-175ms). The sub note clears before the next 16th beat.'
                  : 'Decay is longer than recommended for 142 BPM. Shorten filter decay envelope in Operator to 160ms.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function isSidechainAmountOptimalText(amount: number): string {
  if (amount >= 70) {
    return 'Sidechain ducking is sufficient (-8dB or greater). Kick drum transients cut cleanly through.';
  }
  return 'Sidechain ducking is low. Apply Auto Filter sidechain compression triggered by Kick C1 to prevent low-end masking.';
}
