import React, { useEffect, useState } from 'react';
import { Camera, Monitor, Upload, X, Check, RefreshCw, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { desktopService } from '../../services/desktopService';
import { Language } from '../../i18n/types';

interface LiveScreenCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureSelected: (imageUri: string) => void;
  currentCapturedUri?: string | null;
  onRemoveCapture: () => void;
  language?: Language;
}

export const LiveScreenCaptureModal: React.FC<LiveScreenCaptureModalProps> = ({
  isOpen,
  onClose,
  onCaptureSelected,
  currentCapturedUri,
  onRemoveCapture,
  language = 'he',
}) => {
  const isHe = language === 'he';
  const isDesktop = desktopService.isDesktop();

  const [sources, setSources] = useState<Array<{
    id: string;
    name: string;
    thumbnail: string;
    appIcon?: string | null;
    isAbleton: boolean;
  }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(currentCapturedUri || null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && isDesktop) {
      loadElectronSources();
    }
  }, [isOpen, isDesktop]);

  const loadElectronSources = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const srcList = await desktopService.getScreenSources();
      setSources(srcList);
    } catch (err: any) {
      setErrorMessage(isHe ? 'שגיאה בטעינת מסכים' : 'Error loading screens');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptureWeb = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const dataUrl = await desktopService.captureScreenWeb();
      if (dataUrl) {
        setPreviewImage(dataUrl);
      }
    } catch (err: any) {
      setErrorMessage(isHe ? 'צילום המסך בוטל או נכשל' : 'Screen capture was cancelled or failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPreviewImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (previewImage) {
      onCaptureSelected(previewImage);
      onClose();
    }
  };

  const handleClear = () => {
    setPreviewImage(null);
    onRemoveCapture();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#181818] border border-[#2D2D2D] rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#2D2D2D] flex items-center justify-between bg-[#1F1F1F]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#90FF00]/10 border border-[#90FF00]/40 text-[#90FF00] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {isHe ? 'צילום מסך מ־Ableton Live 12' : 'Capture Ableton Live 12 Screen'}
              </h3>
              <p className="text-xs text-[#888]">
                {isHe
                  ? 'העלה או צלם את חלון Ableton שלך לקבלת הדרכה ויזואלית ישירה על הפרויקט שלך'
                  : 'Capture or upload your live Ableton window to get annotations over your actual project'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-white p-1 rounded-lg hover:bg-[#2A2A2A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Privacy Note */}
          <div className="bg-[#242424] border border-[#333] rounded-lg p-3 flex items-start gap-2.5 text-xs text-[#AAA]">
            <ShieldCheck className="w-4 h-4 text-[#90FF00] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">
                {isHe ? 'שמירה על פרטיות מלאה:' : 'Privacy & Security:'}
              </strong>{' '}
              {isHe
                ? 'צילום המסך מבוצע אך ורק בפקודתך המפורשת, נשמר מקומית במכשירך בלבד, ואינו נשלח לשרת חיצוני.'
                : 'Screenshots are captured strictly on your explicit action, stored only locally on your machine, and never transmitted to external cloud servers.'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Desktop / Web Live Capture */}
            {isDesktop ? (
              <button
                onClick={loadElectronSources}
                disabled={isLoading}
                className="p-3.5 bg-[#252525] hover:bg-[#2F2F2F] border border-[#3A3A3A] hover:border-[#90FF00]/60 rounded-xl flex items-center gap-3 text-left transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-[#90FF00]/10 text-[#90FF00] flex items-center justify-center shrink-0">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">
                    {isHe ? 'סרוק חלונות Ableton' : 'Scan Live Windows'}
                  </div>
                  <div className="text-[11px] text-[#888]">
                    {isHe ? 'זיהוי חלון Ableton Live 12 בלחיצה' : 'Detect Live 12 window in Electron'}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={handleCaptureWeb}
                disabled={isLoading}
                className="p-3.5 bg-[#252525] hover:bg-[#2F2F2F] border border-[#3A3A3A] hover:border-[#00E5FF]/60 rounded-xl flex items-center gap-3 text-left transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">
                    {isHe ? 'צלם חלון Ableton פעיל' : 'Capture Active Window'}
                  </div>
                  <div className="text-[11px] text-[#888]">
                    {isHe ? 'בחר את חלון Ableton בדפדפן' : 'Select Ableton screen via browser'}
                  </div>
                </div>
              </button>
            )}

            {/* File Upload Option */}
            <label className="p-3.5 bg-[#252525] hover:bg-[#2F2F2F] border border-[#3A3A3A] hover:border-[#90FF00]/60 rounded-xl flex items-center gap-3 text-left cursor-pointer transition-all">
              <div className="w-9 h-9 rounded-lg bg-[#FFB800]/10 text-[#FFB800] flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">
                  {isHe ? 'העלה צילום מסך (PNG/JPG)' : 'Upload Screenshot File'}
                </div>
                <div className="text-[11px] text-[#888]">
                  {isHe ? 'גרור קובץ תמונה מ־Ableton' : 'Drag & drop image from your disk'}
                </div>
              </div>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Desktop Sources List (if running Electron) */}
          {isDesktop && sources.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#888] uppercase tracking-wider">
                <span>{isHe ? 'חלונות ומסכים זמינים:' : 'Available Windows & Displays:'}</span>
                <button
                  onClick={loadElectronSources}
                  className="flex items-center gap-1 text-[#00E5FF] hover:underline normal-case"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isHe ? 'רענן' : 'Refresh'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {sources.map((src) => (
                  <div
                    key={src.id}
                    onClick={() => setPreviewImage(src.thumbnail)}
                    className={`cursor-pointer rounded-lg border p-2 bg-[#1F1F1F] hover:bg-[#282828] transition-all flex flex-col ${
                      src.isAbleton
                        ? 'border-[#90FF00] shadow-[0_0_10px_#90FF00]/30'
                        : 'border-[#333]'
                    }`}
                  >
                    <div className="aspect-video bg-black rounded overflow-hidden relative mb-1.5">
                      <img
                        src={src.thumbnail}
                        alt={src.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {src.isAbleton && (
                        <div className="absolute top-1 right-1 bg-[#90FF00] text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          ABLETON DETECTED
                        </div>
                      )}
                    </div>
                    <div className="text-[11px] font-medium text-white truncate" title={src.name}>
                      {src.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Preview */}
          {previewImage && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#90FF00]">
                <span>{isHe ? 'תצוגה מקדימה של הצילום שנבחר:' : 'Selected Screen Preview:'}</span>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 text-[#FF0055] hover:underline"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isHe ? 'נקה צילום' : 'Clear'}</span>
                </button>
              </div>
              <div className="aspect-video w-full bg-black rounded-lg border border-[#90FF00]/40 overflow-hidden relative shadow-lg">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-[#FF0055]/10 border border-[#FF0055]/40 rounded-lg text-xs text-[#FF0055] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#2D2D2D] bg-[#1B1B1B] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#282828] hover:bg-[#333] text-[#CCC] rounded-lg text-xs font-bold transition-colors"
          >
            {isHe ? 'ביטול' : 'Cancel'}
          </button>

          <div className="flex items-center gap-2">
            {currentCapturedUri && (
              <button
                onClick={handleClear}
                className="px-3 py-2 bg-[#2A1818] border border-[#FF0055]/50 text-[#FF0055] hover:bg-[#381818] rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isHe ? 'הסר צילום מסך' : 'Remove Screen'}</span>
              </button>
            )}

            <button
              onClick={handleConfirm}
              disabled={!previewImage}
              className="px-5 py-2 bg-[#90FF00] hover:bg-[#A6FF33] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-[#90FF00]/20"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isHe ? 'החל צילום מסך על השיעור' : 'Apply to Lesson'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
