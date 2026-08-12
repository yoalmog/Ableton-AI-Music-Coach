import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserLevel, UserProducerProfile } from '../../types/learning';
import { GenreType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Check, GraduationCap, Music, Target, Compass, X } from 'lucide-react';

interface ProducerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: Partial<UserProducerProfile>) => void;
}

export const ProducerOnboardingModal: React.FC<ProducerOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
}) => {
  const { isRtl, language, setLanguage } = useLanguage();
  const [level, setLevel] = useState<UserLevel>('BEGINNER');
  const [selectedGenres, setSelectedGenres] = useState<GenreType[]>(['Psytrance']);
  const [primaryGoal, setPrimaryGoal] = useState<UserProducerProfile['primaryGoal']>('Learn Ableton');

  if (!isOpen) return null;

  const handleGenreToggle = (g: GenreType) => {
    if (selectedGenres.includes(g)) {
      if (selectedGenres.length > 1) {
        setSelectedGenres(selectedGenres.filter((x) => x !== g));
      }
    } else {
      setSelectedGenres([...selectedGenres, g]);
    }
  };

  const handleFinish = () => {
    onSaveProfile({
      level,
      favoriteGenres: selectedGenres,
      primaryGoal,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-[#111116] border border-[#22222e] rounded-2xl p-6 sm:p-8 text-white shadow-2xl my-8"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg bg-[#1a1a24] hover:bg-[#252536] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#90FF00]/20 to-[#00E5FF]/20 border border-[#90FF00]/40 flex items-center justify-center text-[#90FF00]">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isRtl ? 'ברוכים הבאים ל-Ableton AI Music Coach' : 'Welcome to Ableton AI Music Coach'}
            </h2>
            <p className="text-sm text-gray-400">
              {isRtl
                ? 'מהו ניסיון ההפקה שלך? נתאים את השיעורים וה-AI לרמתך'
                : 'What is your music production experience? We will customize lessons and AI coaching.'}
            </p>
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          {/* 1. Language Selector */}
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 block">
              {isRtl ? 'שפת ממשק (Language)' : 'Interface Language'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { code: 'he', label: 'עברית (Hebrew)' },
                { code: 'en', label: 'English' },
                { code: 'es', label: 'Español' },
                { code: 'de', label: 'Deutsch' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition text-center ${
                    language === lang.code
                      ? 'bg-[#90FF00]/10 border-[#90FF00] text-[#90FF00]'
                      : 'bg-[#181822] border-[#2a2a38] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Production Level Selection */}
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 block">
              {isRtl ? 'מהי רמת הניסיון שלך ב-Ableton / הפקה?' : 'What is your production experience?'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'BEGINNER',
                  title: isRtl ? 'מתחיל (Beginner)' : 'Beginner',
                  desc: isRtl ? 'חדש לחלוטין בהפקה ו-Ableton Live 12' : 'New to music production and Ableton Live 12',
                },
                {
                  id: 'INTERMEDIATE',
                  title: isRtl ? 'בינוני (Intermediate)' : 'Intermediate',
                  desc: isRtl ? 'מכיר יסודות, מחפש לשפר סאונד וגרוב' : 'Knows DAW basics, wants better sound & groove',
                },
                {
                  id: 'ADVANCED',
                  title: isRtl ? 'מתקדם (Advanced)' : 'Advanced',
                  desc: isRtl ? 'מפיק טראקים, ממתקד לעומק DSP ומיקס' : 'Produces tracks, advancing in DSP & mixing',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLevel(item.id as UserLevel)}
                  className={`p-4 rounded-xl border text-right transition flex flex-col justify-between ${
                    level === item.id
                      ? 'bg-[#90FF00]/10 border-[#90FF00] text-white shadow-lg shadow-[#90FF00]/5'
                      : 'bg-[#181822] border-[#2a2a38] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm mb-1 text-[#90FF00] flex items-center justify-between">
                      <span>{item.title}</span>
                      {level === item.id && <Check className="w-4 h-4 text-[#90FF00]" />}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Favorite Genres */}
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 block">
              {isRtl ? 'ז\'אנרים מועדפים להפקת מוזיקה' : 'Favorite Genres to Produce'}
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Psytrance',
                'Goa Psytrance',
                'Full-On Psytrance',
                'Progressive Psytrance',
                'Techno',
                'Peak-Time Techno',
                'Melodic Techno',
                'Electronic Music',
              ].map((g) => {
                const active = selectedGenres.includes(g as GenreType);
                return (
                  <button
                    key={g}
                    onClick={() => handleGenreToggle(g as GenreType)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      active
                        ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-[#00E5FF]'
                        : 'bg-[#181822] border-[#2a2a38] text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Primary Goal */}
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 block">
              {isRtl ? 'מהי המטרה הראשית שלך?' : 'What is your primary goal?'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'Learn Ableton',
                'Make Psytrance',
                'Make Techno',
                'Finish my first track',
                'Improve mixing',
                'Improve sound design',
              ].map((goal) => {
                const active = primaryGoal === goal;
                return (
                  <button
                    key={goal}
                    onClick={() => setPrimaryGoal(goal as any)}
                    className={`p-2.5 rounded-xl text-xs font-medium border transition text-center ${
                      active
                        ? 'bg-[#90FF00]/10 border-[#90FF00] text-[#90FF00]'
                        : 'bg-[#181822] border-[#2a2a38] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-8 pt-4 border-t border-[#22222e] flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {isRtl ? 'ניתן לשנות את הרמה בכל עת מההגדרות.' : 'You can change your experience level anytime in Settings.'}
          </p>
          <button
            onClick={handleFinish}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#90FF00] to-[#00E5FF] text-black font-bold text-sm hover:opacity-90 transition flex items-center gap-2 shadow-lg shadow-[#90FF00]/10"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isRtl ? 'התחל ללמוד ולהפיק' : 'Start Learning & Producing'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
