export type ThemeMode = 'dark-studio' | 'high-contrast';

export function getInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem('aamc-theme') as ThemeMode;
    if (saved === 'dark-studio' || saved === 'high-contrast') {
      return saved;
    }
  } catch (e) {
    // Ignore storage errors
  }
  return 'dark-studio';
}

export function initThemeSync(): ThemeMode {
  const theme = getInitialTheme();
  try {
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    // Ignore DOM errors
  }
  return theme;
}

export function applyTheme(theme: ThemeMode): void {
  try {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aamc-theme', theme);
  } catch (e) {
    // Ignore storage errors
  }
}
