import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User, AlertCircle, Loader2, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { validatePasswordComplexity } from '../../types/auth';
import { useLanguage, SUPPORTED_LANGUAGES, Language } from '../../context/LanguageContext';

interface RegisterFormProps {
  onSuccess: () => void;
  onSelectLogin: () => void;
  onBackToWelcome: () => void;
  onContinueAsGuest?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSelectLogin,
  onBackToWelcome,
  onContinueAsGuest,
}) => {
  const { t, isRTL, language, setLanguage } = useLanguage();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [favoriteGenre, setFavoriteGenre] = useState('Psytrance');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passValidation = validatePasswordComplexity(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError('Please enter a display name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!passValidation.isValid) {
      setError('Password does not meet complexity requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setLanguage(selectedLang);

    const res = await authService.register({
      displayName,
      email: email.trim(),
      passwordPlain: password,
      language: selectedLang,
      experienceLevel,
      favoriteGenre,
    });

    setLoading(false);

    if (res.ok) {
      onSuccess();
    } else {
      setError(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="w-full max-w-lg bg-[#1E1E1E] border border-[#333] rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col relative my-8"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <button
          onClick={onBackToWelcome}
          className="self-start text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1 mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t('common.back')}</span>
        </button>

        <h2 className="text-xl font-bold text-white mb-1 font-mono">
          {t('auth.registerTitle')}
        </h2>
        <p className="text-xs text-gray-400 mb-5">
          {t('auth.welcomeSubtitle')}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-[#FF5555]/10 border border-[#FF5555]/30 rounded-lg flex items-center gap-2 text-xs text-[#FF8888]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">
              {t('auth.displayNameLabel')} *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Infected Producer"
                className="w-full bg-[#141414] border border-[#333] focus:border-[#90FF00] text-white text-sm rounded-lg py-2.5 pl-9 pr-3 rtl:pr-9 rtl:pl-3 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">
              {t('auth.emailLabel')} *
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

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">
                {t('auth.passwordLabel')} *
              </label>
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

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">
                {t('auth.confirmPasswordLabel')} *
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
                  className="w-full bg-[#141414] border border-[#333] focus:border-[#90FF00] text-white text-sm rounded-lg py-2.5 pl-9 pr-3 rtl:pr-9 rtl:pl-3 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Password Strength Requirements */}
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-3 text-xs space-y-1 text-gray-400">
            <span className="font-mono text-gray-300 block mb-1">{t('auth.passReqTitle')}</span>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <div className={`flex items-center gap-1.5 ${passValidation.hasMinLength ? 'text-[#90FF00]' : 'text-gray-500'}`}>
                {passValidation.hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>{t('auth.passReqLength')}</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passValidation.hasUppercase ? 'text-[#90FF00]' : 'text-gray-500'}`}>
                {passValidation.hasUppercase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>{t('auth.passReqUpper')}</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passValidation.hasLowercase ? 'text-[#90FF00]' : 'text-gray-500'}`}>
                {passValidation.hasLowercase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>{t('auth.passReqLower')}</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passValidation.hasNumber ? 'text-[#90FF00]' : 'text-gray-500'}`}>
                {passValidation.hasNumber ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>{t('auth.passReqNumber')}</span>
              </div>
            </div>
          </div>

          {/* Language, Experience & Genre */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">
                {t('header.language')}
              </label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value as Language)}
                className="w-full bg-[#141414] border border-[#333] text-white text-xs rounded-lg py-2.5 px-2 outline-none"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">
                {t('auth.experienceLabel')}
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full bg-[#141414] border border-[#333] text-white text-xs rounded-lg py-2.5 px-2 outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">
                {t('auth.genreLabel')}
              </label>
              <select
                value={favoriteGenre}
                onChange={(e) => setFavoriteGenre(e.target.value)}
                className="w-full bg-[#141414] border border-[#333] text-white text-xs rounded-lg py-2.5 px-2 outline-none"
              >
                <option value="Psytrance">Psytrance</option>
                <option value="Techno">Techno</option>
                <option value="Melodic Techno">Melodic Techno</option>
                <option value="Goa">Goa Trance</option>
                <option value="Progressive">Progressive</option>
                <option value="EDM">EDM</option>
                <option value="Ambient">Ambient</option>
              </select>
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
              <UserPlus className="w-4 h-4" />
            )}
            <span>{t('auth.createAccountBtn')}</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#2A2A2A] flex flex-col items-center gap-2.5 text-center">
          <button
            onClick={onSelectLogin}
            className="text-xs text-gray-300 hover:text-[#90FF00] transition-colors cursor-pointer"
          >
            {t('auth.hasAccountLink')}
          </button>

          {onContinueAsGuest && (
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-[11px] font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              {t('auth.continueGuestBtn')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
