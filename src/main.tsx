import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { initThemeSync } from './utils/themeSync';
import { debugLog } from './utils/debug';
import App from './App.tsx';
import './index.css';

debugLog.log('[main.tsx] Initializing theme before React render');
initThemeSync();

debugLog.log('[main.tsx] Instantiating LanguageProvider and App');

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}


