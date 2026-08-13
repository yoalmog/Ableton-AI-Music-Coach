import React, { useState } from 'react';
import { KeyRound, Mail, Lock, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { validatePasswordComplexity } from '../../types/auth';
import { useLanguage } from '../../context/LanguageContext';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const { t, isRTL } = useLanguage();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const passValidation = validatePasswordComplexity(newPassword);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setMsg(null);

    const res = await authService.requestPasswordReset(email.trim());
    setLoading(false);

    if (res.ok) {
      setMsg(res.message || 'Reset link requested!');
      setStep('reset');
      if ((res as any).resetToken) {
        setResetToken((res as any).resetToken);
      }
    } else {
      setError(res.error || 'Failed to send reset link.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (!resetToken.trim()) {
      setError('Reset token is required.');
      return;
    }

    if (!passValidation.isValid) {
      setError('New password does not meet complexity requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await authService.resetPassword(resetToken.trim(), newPassword);
    setLoading(false);

    if (res.ok) {
      setMsg('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        onBackToLogin();
      }, 1500);
    } else {
      setError(res.error || 'Failed to reset password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] flex items-center justify-center p-4">
      <div
        className="w-full max-w-md bg-[#1E1E1E] border border-[#333] rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col relative"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <button
          onClick={onBackToLogin}
          className="self-start text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1 mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t('common.back')}</span>
        </button>

        <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mb-3 text-[#00E5FF]">
          <KeyRound className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-white mb-1 font-mono">
          {step === 'request' ? t('auth.forgotTitle') : t('auth.resetTitle')}
        </h2>
        <p className="text-xs text-gray-400 mb-6">
          {step === 'request' ? t('auth.checkEmailDesc') : 'Enter your new secure password.'}
        </p>

        {msg && (
          <div className="mb-4 p-3 bg-[#90FF00]/10 border border-[#90FF00]/30 rounded-lg flex items-center gap-2 text-xs text-[#90FF00]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-[#FF5555]/10 border border-[#FF5555]/30 rounded-lg flex items-center gap-2 text-xs text-[#FF8888]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'request' ? (
          <form onSubmit={handleSendLink} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">
                {t('auth.emailLabel')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="producer@ableton.com"
                  dir="ltr"
                  className="w-full bg-[#141414] border border-[#333] focus:border-[#00E5FF] text-white text-sm rounded-lg py-2.5 pl-9 pr-3 rtl:pr-9 rtl:pl-3 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#00E5FF] hover:bg-[#00C2DA] text-black font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-transform cursor-pointer shadow-md disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{t('auth.sendResetBtn')}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">
                Reset Token / Code
              </label>
              <input
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Paste token received in email..."
                dir="ltr"
                className="w-full bg-[#141414] border border-[#333] focus:border-[#00E5FF] text-white text-xs rounded-lg py-2 px-3 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full bg-[#141414] border border-[#333] focus:border-[#00E5FF] text-white text-sm rounded-lg py-2.5 pl-9 pr-3 rtl:pr-9 rtl:pl-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full bg-[#141414] border border-[#333] focus:border-[#00E5FF] text-white text-sm rounded-lg py-2.5 pl-9 pr-3 rtl:pr-9 rtl:pl-3 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#00E5FF] hover:bg-[#00C2DA] text-black font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-transform cursor-pointer shadow-md disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{t('auth.resetBtn')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
