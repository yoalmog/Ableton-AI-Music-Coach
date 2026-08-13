import React, { useState } from 'react';
import { MailCheck, RefreshCw, LogIn, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';

interface VerifyEmailFormProps {
  onSuccess: () => void;
  onSelectLogin: () => void;
}

export const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({ onSuccess, onSelectLogin }) => {
  const { t, isRTL } = useLanguage();
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setLoading(true);
    setError(null);
    setMsg(null);

    const res = await authService.verifyEmail(tokenInput.trim());
    setLoading(false);

    if (res.ok) {
      setMsg('Email verified successfully!');
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } else {
      setError(res.error || 'Invalid verification token.');
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError(null);
    setMsg(null);

    const res = await authService.resendVerification();
    setResendLoading(false);

    if (res.ok) {
      setMsg(res.message || 'Verification link sent!');
    } else {
      setError(res.error || 'Could not resend email.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] flex items-center justify-center p-4">
      <div
        className="w-full max-w-md bg-[#1E1E1E] border border-[#333] rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col text-center"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="w-14 h-14 rounded-2xl bg-[#90FF00]/10 border border-[#90FF00]/30 flex items-center justify-center mx-auto mb-4 text-[#90FF00]">
          <MailCheck className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2 font-mono">
          {t('auth.checkEmailTitle')}
        </h2>
        <p className="text-xs text-gray-300 mb-6 leading-relaxed">
          {t('auth.checkEmailDesc')}
        </p>

        {msg && (
          <div className="mb-4 p-3 bg-[#90FF00]/10 border border-[#90FF00]/30 rounded-lg flex items-center justify-center gap-2 text-xs text-[#90FF00]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-[#FF5555]/10 border border-[#FF5555]/30 rounded-lg flex items-center justify-center gap-2 text-xs text-[#FF8888]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste verification token or code..."
              dir="ltr"
              className="w-full bg-[#141414] border border-[#333] focus:border-[#90FF00] text-white text-sm rounded-lg py-2.5 px-3 text-center outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !tokenInput.trim()}
            className="w-full py-2.5 px-4 bg-[#90FF00] hover:bg-[#80EE00] text-black font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-transform cursor-pointer shadow-md disabled:opacity-50"
          >
            <span>Verify Token</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#2A2A2A] flex flex-col gap-2">
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="w-full py-2 px-3 bg-[#252525] hover:bg-[#303030] text-gray-300 text-xs font-mono rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
            <span>{t('auth.resendEmailBtn')}</span>
          </button>

          <button
            onClick={onSelectLogin}
            className="w-full py-2 px-3 text-gray-400 hover:text-white text-xs font-mono flex items-center justify-center gap-1 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t('auth.loginBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
