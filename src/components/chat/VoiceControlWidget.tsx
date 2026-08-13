import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles } from 'lucide-react';

interface VoiceControlWidgetProps {
  onTranscriptReceived: (text: string) => void;
}

export const VoiceControlWidget: React.FC<VoiceControlWidgetProps> = ({ onTranscriptReceived }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

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
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('Listening...');
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript && transcript !== 'Listening...') {
          onTranscriptReceived(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscript('Voice input error. Try again.');
      };

      recognition.start();
    } else {
      // Fallback for browsers without WebSpeech support
      const simulatedText = prompt('Enter your voice command / prompt:');
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
        title="Voice Control AI Assistant"
      >
        {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{isListening ? 'LISTENING...' : 'VOICE AI'}</span>
      </button>

      {transcript && isListening && (
        <span className="text-[11px] font-mono text-[#00E5FF] truncate max-w-[200px]">
          "{transcript}"
        </span>
      )}
    </div>
  );
};
