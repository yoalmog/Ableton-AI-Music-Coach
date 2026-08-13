import React from 'react';
import { Lock, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PaywallModalProps {
  isOpen: boolean;
  featureName: string;
  featureDescription?: string;
  onUpgrade: () => void;
  onClose: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  featureName,
  featureDescription,
  onUpgrade,
  onClose,
}) => {
  const { t, isRTL } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="w-full max-w-md bg-[#1E1E1E] border border-[#3A3A3A] rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center relative"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#2A2A2A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-[#90FF00]/10 border border-[#90FF00]/30 flex items-center justify-center text-[#90FF00] mb-4 shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <span className="text-[10px] font-mono font-bold tracking-widest text-[#90FF00] uppercase mb-1">
          {t('paywall.title')}
        </span>

        <h2 className="text-xl font-extrabold text-white font-mono tracking-tight mb-2">
          {featureName}
        </h2>

        <p className="text-xs text-gray-300 leading-relaxed mb-6">
          {featureDescription || t('paywall.desc')}
        </p>

        <div className="w-full space-y-3 mb-6">
          <button
            onClick={() => {
              onClose();
              onUpgrade();
            }}
            className="w-full py-3 px-4 bg-[#90FF00] hover:bg-[#80EE00] text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>{t('paywall.upgradeNow')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-transparent hover:bg-[#282828] text-gray-400 hover:text-white text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            {t('paywall.notNow')}
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#90FF00]" />
          <span>Includes 30-Day Money-Back Guarantee</span>
        </div>
      </div>
    </div>
  );
};
