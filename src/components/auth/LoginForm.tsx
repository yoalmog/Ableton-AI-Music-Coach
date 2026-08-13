import React, { useState } from 'react';
import { LogIn, Mail, Lock, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';

interface LoginFormProps {
  onSuccess: () => void;
  onSelectRegister: () => void;
  onSelectForgotPassword: () => void;
  onBackToWelcome: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSelectRegister,
  onSelectForgotPassword,
  onBackToWelcome,
}) => {
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    const res = await authService.login(email.trim(), password);
    setLoading(false);

    if (res.ok) {
      onSuccess();
    } else {
      setError(res.error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="w-full max-w-md bg-[#1E1E1E] border border-[#333] rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col relative"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <button
          onClick={onBackToWelcome}
          className="self-start text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1 mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t('common.back')}</span>
        </button>

        <h2 className="text-xl font-bold text-white mb-1 font-mono">
          {t('auth.loginTitle')}
        </h2>
        <p className="text-xs text-gray-400 mb-6">
          {t('auth.welcomeSubtitle')}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-[#FF5555]/10 border border-[#FF5555]/30 rounded-lg flex items-center gap-2 text-xs text-[#FF8888]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full bg-[#141414] border border-[#333] focus:border-[#90FF00] text-white text-sm rounded-lg py-2.5 pl-9 pr-3 rtl:pr-9 rtl:pl-3 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono text-gray-300">
                {t('auth.passwordLabel')}
              </label>
              <button
                type="button"
                onClick={onSelectForgotPassword}
                className="text-xs text-[#00E5FF] hover:underline cursor-pointer"
              >
                {t('auth.forgotPasswordLink')}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full bg-[#141414] border border-[#333] focus:border-[#90FF00] text-white text-sm rounded-lg py-2.5 pl-9 pr-3 rtl:pr-9 rtl:pl-3 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#90FF00] hover:bg-[#80EE00] text-black font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md disabled:opacity-50 mt-6"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>{t('auth.loginBtn')}</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#2A2A2A] text-center">
          <button
            onClick={onSelectRegister}
            className="text-xs text-gray-300 hover:text-[#90FF00] transition-colors cursor-pointer"
          >
            {t('auth.noAccountLink')}
          </button>
        </div>
      </div>
    </div>
  );
};
