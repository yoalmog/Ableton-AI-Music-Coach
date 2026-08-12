import React from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Trash2,
  Cpu,
  Cloud,
  Lock,
  RefreshCw
} from 'lucide-react';
import { AAMCProject } from '../../types';
import { aiService } from '../../services/aiService';
import { useLanguage } from '../../context/LanguageContext';

interface AICoachChatProps {
  project: AAMCProject;
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  provider?: string;
  model?: string;
  latencyMs?: number;
  status?: string;
  offline?: boolean;
  error?: boolean;
}

export const AICoachChat: React.FC<AICoachChatProps> = ({
  project,
  isOpen,
  onClose,
  initialMessage,
}) => {
  const { language, isRTL, t } = useLanguage();

  const welcomeMessage = t('ai.welcomeMessage');

  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'coach',
      text: welcomeMessage,
    },
  ]);

  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [lastUserPrompt, setLastUserPrompt] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'm1') {
        return [{ id: 'm1', sender: 'coach', text: welcomeMessage }];
      }
      return prev;
    });
  }, [language, welcomeMessage]);

  const quickPrompts = [
    t('midi.tip'),
    t('sounddesign.operator'),
    t('sounddesign.roar'),
    t('bass.sidechain'),
  ];

  const handleClearChat = () => {
    setMessages([
      {
        id: `m_${Date.now()}`,
        sender: 'coach',
        text: welcomeMessage,
      },
    ]);
  };

  const handleSend = async (textToSend?: string) => {
    const msg = textToSend || input;
    if (!msg.trim()) return;

    setLastUserPrompt(msg);

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: msg,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const historyPayload = newMessages.slice(-8).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await aiService.chat(
        msg,
        {
          genre: project.genre,
          bpm: project.bpm,
          key: project.key,
          scale: project.scale,
          language,
        },
        historyPayload
      );

      const coachMsg: ChatMessage = {
        id: `c_${Date.now()}`,
        sender: 'coach',
        text: res.reply,
        provider: res.provider,
        model: res.model,
        latencyMs: res.latencyMs,
        status: res.status,
        offline: res.offline,
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'coach',
          text: t('ai.offlineMessage'),
          offline: true,
          error: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = () => {
    if (lastUserPrompt) {
      handleSend(lastUserPrompt);
    }
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  React.useEffect(() => {
    if (initialMessage && isOpen) {
      handleSend(initialMessage);
    }
  }, [initialMessage, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-[#151515] border-l border-[#333] shadow-2xl z-50 flex flex-col justify-between select-none font-sans"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="p-3 bg-[#1A1A1A] border-b border-[#333] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#90FF00] text-black flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {t('ai.coach')}
              </h3>
            </div>
            <p className="text-[10px] text-[#999] font-mono mt-0.5">
              Live 12 Assistant • {project.genre} ({project.bpm} BPM • {project.key} {project.scale})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            title={t('ai.clearChat')}
            className="p-1.5 rounded hover:bg-[#252525] text-[#888] hover:text-[#FF5555] cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#252525] text-[#999] hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#121212]">
        {messages.map((m) => {
          const isCoach = m.sender === 'coach';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 text-xs leading-relaxed ${
                isCoach ? 'justify-start' : 'justify-end'
              }`}
            >
              {isCoach && (
                <div className="w-6 h-6 rounded bg-[#252525] border border-[#333] text-[#90FF00] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-lg max-w-[85%] space-y-2 ${
                  isCoach
                    ? 'bg-[#1A1A1A] border border-[#333] text-[#E0E0E0]'
                    : 'bg-[#252525] border border-[#444] text-[#90FF00] font-medium'
                }`}
              >
                {/* AI Performance Tag */}
                {isCoach && m.provider && (
                  <div className="flex items-center justify-between gap-2 border-b border-[#2A2A2A] pb-1.5 mb-1 font-mono text-[9px]">
                    {m.provider === 'ollama' ? (
                      <span className="flex items-center gap-1 text-[#90FF00]">
                        <Cpu className="w-3 h-3" />
                        <span>LOCAL AI ({m.model})</span>
                      </span>
                    ) : m.provider === 'gemini' ? (
                      <span className="flex items-center gap-1 text-[#00E5FF]">
                        <Cloud className="w-3 h-3" />
                        <span>GEMINI ({m.model})</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[#FF5555]">
                        <Lock className="w-3 h-3" />
                        <span>AI OFFLINE</span>
                      </span>
                    )}

                    {m.latencyMs !== undefined && m.latencyMs > 0 && (
                      <span className="text-[#888]">{(m.latencyMs / 1000).toFixed(1)}s</span>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-line font-sans leading-relaxed">{m.text}</div>

                {m.error && (
                  <button
                    onClick={handleRetry}
                    className="mt-2 text-[10px] font-mono text-[#90FF00] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>{t('common.retry')}</span>
                  </button>
                )}
              </div>

              {!isCoach && (
                <div className="w-6 h-6 rounded bg-[#252525] border border-[#444] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#90FF00] font-mono pl-2 animate-pulse">
            <Bot className="w-3.5 h-3.5" />
            <span>{t('ai.thinking')}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 bg-[#181818] border-t border-[#333] flex gap-2 overflow-x-auto no-scrollbar">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="text-[10px] font-mono whitespace-nowrap bg-[#222] hover:bg-[#333] text-[#00E5FF] border border-[#333] px-2.5 py-1 rounded cursor-pointer transition-colors"
          >
            + {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-[#1A1A1A] border-t border-[#333]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ai.askPrompt')}
            className="flex-1 bg-[#121212] border border-[#333] rounded px-3 py-2 text-xs text-[#E0E0E0] placeholder-[#666] focus:outline-none focus:border-[#90FF00] font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-[#90FF00] hover:bg-[#80e600] text-black px-3.5 py-2 rounded font-bold transition-colors disabled:opacity-30 cursor-pointer text-xs flex items-center justify-center shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
