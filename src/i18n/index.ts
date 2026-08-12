import { Language, TranslationDictionary } from './types';
import { en } from './locales/en';
import { he } from './locales/he';
import { es } from './locales/es';
import { pt } from './locales/pt';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { it } from './locales/it';
import { ru } from './locales/ru';
import { zhCN } from './locales/zh-CN';
import { ja } from './locales/ja';

export const dictionaries: Record<Language, TranslationDictionary> = {
  en,
  he,
  es,
  pt,
  fr,
  de,
  it,
  ru,
  'zh-CN': zhCN,
  ja,
};

export function getTranslation(lang: Language, key: string, params?: Record<string, string | number>): string {
  const dict = dictionaries[lang] || dictionaries.en;
  let text = dict[key] || dictionaries.en[key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
    });
  }

  return text;
}

export * from './types';
