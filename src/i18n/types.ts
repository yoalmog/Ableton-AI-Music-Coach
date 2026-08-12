export type Language =
  | 'en'
  | 'he'
  | 'es'
  | 'pt'
  | 'fr'
  | 'de'
  | 'it'
  | 'ru'
  | 'zh-CN'
  | 'ja';

export type Direction = 'ltr' | 'rtl';

export interface LanguageConfig {
  id: Language;
  code: Language;
  name: string;
  label: string;
  nativeName: string;
  nativeLabel: string;
  flag: string;
  dir: Direction;
  direction: Direction;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { id: 'en', code: 'en', name: 'English', label: 'English', nativeName: 'English', nativeLabel: 'English', flag: '🇬🇧', dir: 'ltr', direction: 'ltr' },
  { id: 'he', code: 'he', name: 'Hebrew', label: 'Hebrew', nativeName: 'עברית', nativeLabel: 'עברית', flag: '🇮🇱', dir: 'rtl', direction: 'rtl' },
  { id: 'es', code: 'es', name: 'Spanish', label: 'Spanish', nativeName: 'Español', nativeLabel: 'Español', flag: '🇪🇸', dir: 'ltr', direction: 'ltr' },
  { id: 'pt', code: 'pt', name: 'Portuguese', label: 'Portuguese', nativeName: 'Português', nativeLabel: 'Português', flag: '🇵🇹', dir: 'ltr', direction: 'ltr' },
  { id: 'fr', code: 'fr', name: 'French', label: 'French', nativeName: 'Français', nativeLabel: 'Français', flag: '🇫🇷', dir: 'ltr', direction: 'ltr' },
  { id: 'de', code: 'de', name: 'German', label: 'German', nativeName: 'Deutsch', nativeLabel: 'Deutsch', flag: '🇩🇪', dir: 'ltr', direction: 'ltr' },
  { id: 'it', code: 'it', name: 'Italian', label: 'Italian', nativeName: 'Italiano', nativeLabel: 'Italiano', flag: '🇮🇹', dir: 'ltr', direction: 'ltr' },
  { id: 'ru', code: 'ru', name: 'Russian', label: 'Russian', nativeName: 'Русский', nativeLabel: 'Русский', flag: '🇷🇺', dir: 'ltr', direction: 'ltr' },
  { id: 'zh-CN', code: 'zh-CN', name: 'Chinese Simplified', label: 'Chinese Simplified', nativeName: '简体中文', nativeLabel: '简体中文', flag: '🇨🇳', dir: 'ltr', direction: 'ltr' },
  { id: 'ja', code: 'ja', name: 'Japanese', label: 'Japanese', nativeName: '日本語', nativeLabel: '日本語', flag: '🇯🇵', dir: 'ltr', direction: 'ltr' },
];

export type TranslationDictionary = Record<string, string>;
