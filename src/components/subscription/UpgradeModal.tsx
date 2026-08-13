import React, { useState } from 'react';
import { Check, Sparkles, X, ShieldCheck, Zap, Loader2, ArrowRight } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import { useLanguage } from '../../context/LanguageContext';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  featureTitle,
}) => {
  const { t, isRTL } = useLanguage();
  const [loadingPlan, setLoadingPlan] = useState<'pro_monthly' | 'pro_yearly' | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSub = subscriptionService.getSubscription();

  const handleSelectPlan = async (plan: 'pro_monthly' | 'pro_yearly') => {
    setLoadingPlan(plan);
    setError(null);

    const res = await subscriptionService.createCheckoutSession(plan, 'USD');
    setLoadingPlan(null);

    if (res.ok && res.checkoutUrl) {
      window.location.href = res.checkoutUrl;
    } else {
      setError(res.error || 'Failed to initialize payment checkout.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="w-full max-w-4xl bg-[#1A1A1A] border border-[#3A3A3A] rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col relative my-8"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#2A2A2A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Banner Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#90FF00]/10 border border-[#90FF00]/30 text-[#90FF00] text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ABLETON AI MUSIC COACH PRO</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight mb-2">
            {featureTitle ? `Unlock ${featureTitle}` : 'Upgrade to Ableton AI Music Coach Pro'}
          </h2>
          <p className="text-sm text-gray-300 max-w-xl mx-auto">
            Get unlimited AI Co-Producer access, project-aware analysis, advanced MIDI generators, sound design labs, and ear training tools.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[#FF5555]/10 border border-[#FF5555]/30 rounded-lg text-xs text-[#FF8888] text-center">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* FREE CARD */}
          <div className="bg-[#141414] border border-[#2D2D2D] rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-gray-400 mb-1">BASIC</div>
              <h3 className="text-lg font-bold text-white mb-2">FREE</h3>
              <div className="text-2xl font-extrabold text-white mb-4">$0</div>
              <p className="text-xs text-gray-400 mb-6">{t('sub.freeDesc')}</p>

              <ul className="space-y-2.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#90FF00]" />
                  <span>Basic Ableton Live 12 lessons</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#90FF00]" />
                  <span>Basic MIDI & Drum Sequencer</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#90FF00]" />
                  <span>15 Cloud AI requests / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#90FF00]" />
                  <span>100% Unlimited Local AI (Ollama)</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#222]">
              <div className="text-center text-xs text-gray-500 font-mono">
                {currentSub.plan === 'free' ? 'CURRENT PLAN' : 'INCLUDED'}
              </div>
            </div>
          </div>

          {/* PRO MONTHLY CARD */}
          <div className="bg-[#1C1C1C] border border-[#00E5FF]/40 rounded-xl p-6 flex flex-col justify-between relative shadow-lg">
            <div>
              <div className="text-xs font-mono text-[#00E5FF] mb-1">FLEXIBLE</div>
              <h3 className="text-lg font-bold text-white mb-2">{t('sub.proMonthly')}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-white">$19</span>
                <span className="text-xs text-gray-400">{t('sub.perMonth')}</span>
              </div>
              <p className="text-xs text-gray-400 mb-6">{t('sub.proDesc')}</p>

              <ul className="space-y-2.5 text-xs text-gray-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00E5FF]" />
                  <span>Unlimited Cloud AI Music Coach</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00E5FF]" />
                  <span>Project-aware context & analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00E5FF]" />
                  <span>Advanced Rolling Bass & Lead Generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00E5FF]" />
                  <span>Operator & Wavetable Sound Design Lab</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00E5FF]" />
                  <span>Track Spectrum & LUFS Analyzer</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('pro_monthly')}
              disabled={loadingPlan === 'pro_monthly' || currentSub.plan === 'pro_monthly'}
              className="mt-8 w-full py-3 px-4 bg-[#00E5FF] hover:bg-[#00C2DA] text-black font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md disabled:opacity-50"
            >
              {loadingPlan === 'pro_monthly' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 fill-current" />
              )}
              <span>{currentSub.plan === 'pro_monthly' ? 'ACTIVE PLAN' : t('sub.selectPlan')}</span>
            </button>
          </div>

          {/* PRO YEARLY CARD (POPULAR) */}
          <div className="bg-[#222218] border-2 border-[#90FF00] rounded-xl p-6 flex flex-col justify-between relative shadow-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#90FF00] text-black font-bold font-mono text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
              BEST VALUE • SAVE 35%
            </div>

            <div>
              <div className="text-xs font-mono text-[#90FF00] mb-1">ANNUAL</div>
              <h3 className="text-lg font-bold text-white mb-2">{t('sub.proYearly')}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-extrabold text-white">$149</span>
                <span className="text-xs text-gray-400">{t('sub.perYear')}</span>
              </div>
              <div className="text-[11px] text-[#90FF00] font-mono mb-4">Equivalent to ~$12.40/mo</div>

              <ul className="space-y-2.5 text-xs text-gray-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#90FF00]" />
                  <span>Everything in Pro Monthly</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#90FF00]" />
                  <span>Priority Cloud AI server routing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#90FF00]" />
                  <span>Full Ear Training & Frequency Labs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#90FF00]" />
                  <span>Learning analytics & milestone tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#90FF00]" />
                  <span>Unlimited projects & cloud backup</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('pro_yearly')}
              disabled={loadingPlan === 'pro_yearly' || currentSub.plan === 'pro_yearly'}
              className="mt-8 w-full py-3 px-4 bg-[#90FF00] hover:bg-[#80EE00] text-black font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg disabled:opacity-50"
            >
              {loadingPlan === 'pro_yearly' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{currentSub.plan === 'pro_yearly' ? 'ACTIVE PLAN' : t('sub.selectPlan')}</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-gray-400 border-t border-[#2D2D2D] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#90FF00]" />
            <span>Secure Checkout • Cancel Anytime</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white underline cursor-pointer"
          >
            {t('paywall.notNow')}
          </button>
        </div>
      </div>
    </div>
  );
};
