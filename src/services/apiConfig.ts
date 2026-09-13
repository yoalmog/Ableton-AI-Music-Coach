/**
 * Resolves the appropriate backend API endpoint whether running:
 * - In standard web browser (same origin)
 * - In Capacitor native Android / iOS application (points to hosted Cloud Run backend)
 * - In Electron desktop workstation (points to local or hosted backend)
 */

export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') return '';

  // Check if custom server URL was saved in localStorage
  const savedUrl = localStorage.getItem('aamc_custom_api_url');
  if (savedUrl) {
    return savedUrl.replace(/\/$/, '');
  }

  const isCapacitorOrNative = Boolean(
    (window as any).Capacitor?.isNativePlatform?.() ||
    window.location.protocol === 'capacitor:' ||
    (window.location.hostname === 'localhost' && !window.location.port) ||
    window.location.protocol === 'file:' ||
    (typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent) && window.location.hostname === 'localhost')
  );

  if (isCapacitorOrNative) {
    // Cloud Run hosted production backend
    return 'https://ais-pre-cxlyindlo5cs3umpj6vfpw-113121063300.us-west2.run.app';
  }

  // Same-origin relative path for standard web preview / deployed container
  return '';
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${cleanPath}` : cleanPath;
}
