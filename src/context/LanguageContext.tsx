import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  Direction, 
  LanguageConfig, 
  SUPPORTED_LANGUAGES, 
  getTranslation 
} from '../i18n';

export type { Language };

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: Direction;
  isRTL: boolean;
  isRtl: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
  currentLanguageConfig: LanguageConfig;
  supportedLanguages: LanguageConfig[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('aamc-language') as Language;
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved;
    }
    const navLang = navigator.language.toLowerCase();
    if (navLang.startsWith('he')) return 'he';
    if (navLang.startsWith('es')) return 'es';
    if (navLang.startsWith('pt')) return 'pt';
    if (navLang.startsWith('fr')) return 'fr';
    if (navLang.startsWith('de')) return 'de';
    if (navLang.startsWith('it')) return 'it';
    if (navLang.startsWith('ru')) return 'ru';
    if (navLang.startsWith('zh')) return 'zh-CN';
    if (navLang.startsWith('ja')) return 'ja';
    return 'en';
  });

  const currentLanguageConfig = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const dir: Direction = currentLanguageConfig.dir;
  const isRTL = dir === 'rtl';

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('aamc-language', language);
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    return getTranslation(language, key, params);
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      dir, 
      isRTL, 
      isRtl: isRTL, 
      t, 
      currentLanguageConfig,
      supportedLanguages: SUPPORTED_LANGUAGES 
    }}>
      <div dir={dir} className={`min-h-screen w-full ${dir === 'rtl' ? 'rtl' : 'ltr'}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { SUPPORTED_LANGUAGES };
