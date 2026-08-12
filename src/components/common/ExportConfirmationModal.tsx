import React from 'react';
import { Download, FolderOpen, Sliders, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ExportConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  exportType: 'MIDI' | 'Drum Pattern' | 'Project (.aamc)' | 'WAV Master';
  fileName: string;
  fileSettings: {
    bpm: number;
    key: string;
    scale: string;
    genre: string;
    tracksCount?: number;
    sampleRate?: string;
    bitDepth?: string;
  };
  destinationPath: string;
}

export const ExportConfirmationModal: React.FC<ExportConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  exportType,
  fileName,
  fileSettings,
  destinationPath,
}) => {
  const { isRtl } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#181818] border border-[#333] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-6 text-[#E0E0E0]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#222] border border-[#333] text-[#90FF00] flex items-center justify-center shadow-inner">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Confirm Export: {exportType}
              </h2>
              <p className="text-xs text-[#888]">
                Review export settings and target destination before writing file.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#252525] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Settings Card */}
        <div className="space-y-4">
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-lg p-4 space-y-3">
            <div className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider font-bold">
              Export Configuration Parameters
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#777] block text-[10px] font-mono">FILE NAME</span>
                <span className="font-mono font-bold text-white truncate block">{fileName}</span>
              </div>
              <div>
                <span className="text-[#777] block text-[10px] font-mono">GENRE / STYLE</span>
                <span className="font-semibold text-[#E0E0E0]">{fileSettings.genre}</span>
              </div>
              <div>
                <span className="text-[#777] block text-[10px] font-mono">TEMPO (BPM)</span>
                <span className="font-mono font-bold text-[#90FF00]">{fileSettings.bpm} BPM</span>
              </div>
              <div>
                <span className="text-[#777] block text-[10px] font-mono">KEY & SCALE</span>
                <span className="font-mono font-bold text-[#00E5FF]">{fileSettings.key} {fileSettings.scale}</span>
              </div>
              {fileSettings.sampleRate && (
                <div>
                  <span className="text-[#777] block text-[10px] font-mono">SAMPLE RATE</span>
                  <span className="font-mono text-white">{fileSettings.sampleRate}</span>
                </div>
              )}
              {fileSettings.bitDepth && (
                <div>
                  <span className="text-[#777] block text-[10px] font-mono">BIT DEPTH</span>
                  <span className="font-mono text-white">{fileSettings.bitDepth}</span>
                </div>
              )}
            </div>
          </div>

          {/* Destination Path Box */}
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#90FF00] uppercase tracking-wider font-bold">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Target File Destination Path</span>
            </div>
            <div className="bg-[#181818] border border-[#333] p-2.5 rounded font-mono text-xs text-[#AAA] break-all select-all flex items-center justify-between">
              <span>{destinationPath}</span>
              <span className="text-[10px] bg-[#222] text-[#00E5FF] px-2 py-0.5 rounded border border-[#333] shrink-0 ml-2">
                Verified
              </span>
            </div>
            <p className="text-[11px] text-[#777] italic">
              Ready to import directly into Ableton Live 12 browser or arrangement view.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#222] hover:bg-[#2A2A2A] text-[#CCC] text-xs font-bold transition-colors cursor-pointer border border-[#333]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-[#90FF00] hover:bg-[#80e600] text-black text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-[#90FF00]/10"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Export File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
