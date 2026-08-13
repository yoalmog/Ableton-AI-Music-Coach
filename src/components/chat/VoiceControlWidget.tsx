import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface VoiceControlWidgetProps {
  onTranscriptReceived: (text: string) => void;
}

export const VoiceControlWidget: React.FC<VoiceControlWidgetProps> = ({ onTranscriptReceived }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { t, language } = useLanguage();

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    // Check if Web Speech API is supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'he' ? 'he-IL' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript(t('header.listening'));
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript && transcript !== t('header.listening')) {
          onTranscriptReceived(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscript(t('header.voiceError'));
      };

      recognition.start();
    } else {
      // Fallback for browsers without WebSpeech support
      const simulatedText = prompt(t('header.voicePrompt'));
      if (simulatedText) {
        onTranscriptReceived(simulatedText);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleListening}
        className={`px-2 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer h-8 shrink-0 ${
          isListening
            ? 'bg-[#FF5555] text-white animate-pulse'
            : 'bg-[#252525] hover:bg-[#333] border border-[#333] text-[#00E5FF]'
        }`}
        title={t('header.voiceAITitle')}
        aria-label={t('header.voiceAITitle')}
      >
        {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{isListening ? t('header.listening') : t('header.voiceAI')}</span>
      </button>

      {transcript && isListening && (
        <span className="text-[11px] font-mono text-[#00E5FF] truncate max-w-[200px]">
          "{transcript}"
        </span>
      )}
    </div>
  );
};
