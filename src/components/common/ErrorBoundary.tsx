import React from 'react';
import { getTranslation, Language } from '../../i18n';
import { debugLog } from '../../utils/debug';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  isPanel?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (React.Component as any) {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    debugLog.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      const lang = (localStorage.getItem('aamc-language') as Language) || 'en';
      const isPanel = this.props.isPanel;

      const title = getTranslation(lang, 'error.title');
      const message = getTranslation(lang, 'error.message');
      const reloadText = getTranslation(lang, isPanel ? 'error.panelReload' : 'error.reload');

      if (isPanel) {
        return (
          <div className="bg-[#181818] border border-red-500/30 rounded-lg p-6 my-4 text-center space-y-3">
            <div className="flex justify-center text-red-400">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
            <p className="text-xs text-[#AAA] max-w-md mx-auto">{this.state.error?.message || message}</p>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-[#222] hover:bg-[#333] border border-[#444] text-white text-xs font-mono rounded inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#90FF00]" />
              <span>{reloadText}</span>
            </button>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#141414] border border-[#333] rounded-xl p-8 space-y-6 shadow-2xl">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold font-mono tracking-tight">{title}</h1>
              <p className="text-xs text-[#888] leading-relaxed">
                {this.state.error?.message || message}
              </p>
            </div>
            <button
              onClick={this.handleReload}
              className="w-full py-3 bg-[#90FF00] hover:bg-[#a6ff26] text-black font-bold text-xs uppercase font-mono tracking-wider rounded-lg shadow-lg transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{reloadText}</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
