import React, { useEffect, useState } from 'react';
import { Cpu, Cloud, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { Tooltip } from '../common/Tooltip';

interface AIStatusBadgeProps {
  onOpenSettings: () => void;
  onOpenSetup?: () => void;
}

export const AIStatusBadge: React.FC<AIStatusBadgeProps> = ({ onOpenSettings, onOpenSetup }) => {
  const [status, setStatus] = useState<{
    activeProvider: 'ollama' | 'gemini' | 'none';
    activeModel: string;
    privacyMode: boolean;
    localOk: boolean;
    cloudOk: boolean;
    loading: boolean;
  }>({
    activeProvider: 'none',
    activeModel: 'Checking...',
    privacyMode: false,
    localOk: false,
    cloudOk: false,
    loading: true,
  });

  const checkStatus = async () => {
    setStatus((prev) => ({ ...prev, loading: true }));
    try {
      const diag = await aiService.getDiagnostics();
      setStatus({
        activeProvider: diag.activeProvider,
        activeModel: diag.activeModel,
        privacyMode: diag.settings.privacyMode,
        localOk: diag.localHealth.ok,
        cloudOk: diag.cloudHealth.ok,
        loading: false,
      });
    } catch {
      setStatus({
        activeProvider: 'none',
        activeModel: 'Offline',
        privacyMode: false,
        localOk: false,
        cloudOk: false,
        loading: false,
      });
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // refresh status every 30s
    return () => clearInterval(interval);
  }, []);

  const getBadgeContent = () => {
    if (status.loading) {
      return (
        <div className="flex items-center gap-1.5 bg-[#1E1E1E] border border-[#333] px-2.5 py-0.5 rounded text-[10px] font-mono text-[#AAA]">
          <RefreshCw className="w-3 h-3 animate-spin text-[#90FF00]" />
          <span>AI INITIALIZING...</span>
        </div>
      );
    }

    if (status.privacyMode) {
      return (
        <div className="flex items-center gap-1.5 bg-[#1B281B] border border-[#2D4D2D] px-2.5 py-0.5 rounded text-[10px] font-mono text-[#90FF00]">
          <Lock className="w-3 h-3 text-[#90FF00]" />
          <span className="font-bold">🔒 PRIVACY MODE</span>
          <span className="text-[9px] opacity-75">({status.activeModel})</span>
        </div>
      );
    }

    if (status.activeProvider === 'ollama') {
      return (
        <div className="flex items-center gap-1.5 bg-[#122212] border border-[#1E441E] px-2.5 py-0.5 rounded text-[10px] font-mono text-[#90FF00] hover:bg-[#183018] transition-colors cursor-pointer">
          <Cpu className="w-3 h-3 text-[#90FF00] animate-pulse" />
          <span className="font-bold">🟢 LOCAL AI</span>
          <span className="text-[#CCC] text-[9px]">({status.activeModel})</span>
        </div>
      );
    }

    if (status.activeProvider === 'gemini') {
      return (
        <div className="flex items-center gap-1.5 bg-[#0D2229] border border-[#184857] px-2.5 py-0.5 rounded text-[10px] font-mono text-[#00E5FF] hover:bg-[#12313B] transition-colors cursor-pointer">
          <Cloud className="w-3 h-3 text-[#00E5FF]" />
          <span className="font-bold">🟢 GEMINI</span>
          <span className="text-[#CCC] text-[9px]">(Cloud)</span>
        </div>
      );
    }

    return (
      <div
        onClick={onOpenSetup || onOpenSettings}
        className="flex items-center gap-1.5 bg-[#2A1515] border border-[#522222] px-2.5 py-0.5 rounded text-[10px] font-mono text-[#FF5555] hover:bg-[#3D1A1A] transition-colors cursor-pointer"
      >
        <AlertCircle className="w-3 h-3 text-[#FF5555]" />
        <span className="font-bold">🔴 LOCAL AI SETUP</span>
      </div>
    );
  };

  return (
    <Tooltip content="Click to setup or view Local AI Engine" position="bottom">
      <div onClick={onOpenSetup || onOpenSettings} className="select-none">
        {getBadgeContent()}
      </div>
    </Tooltip>
  );
};
