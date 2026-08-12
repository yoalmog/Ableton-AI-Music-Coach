import React, { useState } from 'react';
import { Sparkles, ArrowRight, HelpCircle, CheckCircle2, FastForward } from 'lucide-react';
import { AAMCProject, ViewType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface NextStepEngineProps {
  project: AAMCProject;
  onNavigate: (view: ViewType) => void;
  onOpenCoachWithMessage?: (msg: string) => void;
}

export const NextStepEngine: React.FC<NextStepEngineProps> = ({
  project,
  onNavigate,
  onOpenCoachWithMessage,
}) => {
  const { t } = useLanguage();
  const [showExplanation, setShowExplanation] = useState(false);

  // Compute state-dependent recommendation
  const rec = React.useMemo(() => {
    const stage = project.productionStage || 1;
    const hasKickBass = Boolean(project.bassSettings);
    const hasDrums = Boolean(project.drumPattern && project.drumPattern.tracks.some(t => t.steps.some(s => s.active)));
    const hasMidi = project.midiPatterns.length > 0;
    const hasArrangement = Boolean(project.arrangementSections && project.arrangementSections.length > 0);

    if (stage === 1) {
      return {
        title: 'Complete Project Setup & Live 12 Routing',
        text: `Your project is set to ${project.key} ${project.scale} at ${project.bpm} BPM. First, set your Master Utility to -6dB headroom and set up [K&B] sub-bus routing.`,
        targetView: 'producer' as ViewType,
        actionLabel: 'OPEN PRODUCER STAGE 1',
        explanation: 'Setting up proper headroom and track grouping before writing notes prevents clipping and saves hours of mixing cleanup later.',
      };
    }

    if (!hasKickBass) {
      return {
        title: 'Synthesize & Tune Rolling Bassline',
        text: `You need a driving sub-bass foundation in ${project.key} ${project.scale}. Synthesize a rolling 16th bassline using Operator or Wavetable in Ableton Live 12.`,
        targetView: 'bass' as ViewType,
        actionLabel: 'OPEN BASS LABORATORY',
        explanation: `In ${project.genre}, the rolling sub-bass locked with the kick drum supplies 70% of the energy.`,
      };
    }

    if (!hasDrums) {
      return {
        title: 'Create 16-Bar Percussion & Hi-Hat Groove',
        text: 'Your low-end foundation is set! Your next recommended step is to program offbeat open hats, closed 16th hats, and snare/clap layers.',
        targetView: 'drums' as ViewType,
        actionLabel: 'OPEN DRUM MACHINE',
        explanation: 'Offbeat hats and subtle 16th percussion drive forward movement and outline the rhythm structure.',
      };
    }

    if (!hasMidi) {
      return {
        title: 'Compose Main Lead / Acid Hook',
        text: `Create a melodic lead sequence or Goa acid line locked to ${project.key} ${project.scale} using our AI MIDI Composer.`,
        targetView: 'midi' as ViewType,
        actionLabel: 'OPEN MIDI COMPOSER',
        explanation: 'Lead synth motifs establish the emotional peak and narrative identity of your track.',
      };
    }

    if (!hasArrangement) {
      return {
        title: 'Generate Full Track Arrangement Blueprint',
        text: 'You have generated core loops! Now structure your track into Intro, Builds, Drops, Breakdown, and Outro.',
        targetView: 'arrangement' as ViewType,
        actionLabel: 'OPEN ARRANGEMENT GUIDE',
        explanation: 'A structured arrangement maintains DJ mixability and creates tension/release for the listener.',
      };
    }

    return {
      title: 'Run Mixdown & Spectrum Diagnostics',
      text: 'Your track elements and arrangement are ready! Perform frequency cleansing, mono sub check, and pre-master LUFS assessment.',
      targetView: 'analyzer' as ViewType,
      actionLabel: 'OPEN TRACK ANALYZER',
      explanation: 'Checking spectrum balance and LUFS targets ensures your track translates punchily across all club sound systems.',
    };
  }, [project, t]);

  return (
    <div className="bg-[#181818] border border-[#333] hover:border-[#90FF00]/50 rounded-lg p-4 transition-all shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#90FF00]/10 text-[#90FF00]">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-xs font-mono font-bold tracking-wider text-[#90FF00] uppercase">
            {t('dashboard.nextStepTitle')}
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#666] bg-[#222] px-2 py-0.5 rounded">
          STAGE {project.productionStage || 1} / 15
        </span>
      </div>

      <h3 className="text-sm font-bold text-white mb-1">{rec.title}</h3>
      <p className="text-xs text-[#AAA] mb-3 leading-relaxed">{rec.text}</p>

      {showExplanation && (
        <div className="mb-3 p-2.5 bg-[#222] border-l-2 border-[#00E5FF] rounded text-xs text-[#00E5FF] font-sans leading-normal">
          <strong className="block text-[11px] uppercase tracking-wider mb-0.5">Why this step?</strong>
          {rec.explanation}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#2A2A2A]">
        <button
          onClick={() => onNavigate(rec.targetView)}
          className="px-3 py-1.5 bg-[#90FF00] hover:bg-[#a6ff26] text-black text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>{rec.actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="px-2.5 py-1.5 bg-[#252525] hover:bg-[#333] border border-[#444] text-[#CCC] text-xs rounded flex items-center gap-1 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>{t('nextStep.explainWhy')}</span>
        </button>

        {onOpenCoachWithMessage && (
          <button
            onClick={() => onOpenCoachWithMessage(`Can you guide me step-by-step through: ${rec.title}?`)}
            className="px-2.5 py-1.5 bg-[#252525] hover:bg-[#333] border border-[#444] text-[#90FF00] text-xs rounded flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ASK AI COACH</span>
          </button>
        )}
      </div>
    </div>
  );
};
