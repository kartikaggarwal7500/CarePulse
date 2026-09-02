import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  Image as ImageIcon,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  PhoneCall,
  MapPin,
  RefreshCw,
  X,
  Volume2,
  Paperclip,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ChatMessage, StructuredAIResponse } from '../types';
import { sendAiChatRequest, fetchGeminiStatus, GeminiStatusInfo } from '../services/api';
import { StructuredResponseCard } from './StructuredResponseCard';
import { VoiceRecorder } from './VoiceRecorder';
import { ImageUploader } from './ImageUploader';

interface AIChatProps {
  initialPrompt?: string;
  initialImage?: string;
  onOpenSos: () => void;
  onContactHealth: () => void;
  onFindNearby: () => void;
  selectedLanguageName?: string;
}

export const AIChat: React.FC<AIChatProps> = ({
  initialPrompt = '',
  initialImage,
  onOpenSos,
  onContactHealth,
  onFindNearby,
  selectedLanguageName = 'English',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! I am your CarePulse Health & Safety Companion. Describe what happened using voice, text, or an image. I will provide structured step-by-step guidance and safety precautions.`,
      timestamp: new Date(),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(initialImage || null);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [geminiInfo, setGeminiInfo] = useState<GeminiStatusInfo | null>(null);

  useEffect(() => {
    fetchGeminiStatus().then((info) => setGeminiInfo(info));
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle initial prompt if passed
  useEffect(() => {
    if (initialPrompt && messages.length === 1) {
      handleSendMessage(initialPrompt, initialImage);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (customText?: string, customImage?: string | null) => {
    const textToSend = customText !== undefined ? customText : inputVal;
    const imageToSend = customImage !== undefined ? customImage : attachedImage;

    if (!textToSend.trim() && !imageToSend) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim() || (imageToSend ? 'Uploaded photo for emergency assessment' : ''),
      imageUrl: imageToSend || undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const responseData = await sendAiChatRequest(
        textToSend || 'Analyze this situation',
        imageToSend || undefined,
        selectedLanguageName
      );

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date(),
        structuredResponse: responseData,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'I encountered an issue processing your request. Please ensure you are safe, and for severe emergencies, call 911 or Campus Security directly.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscribed = (transcript: string) => {
    setShowVoiceRecorder(false);
    if (transcript.trim()) {
      handleSendMessage(transcript);
    }
  };

  const handleImageUploaded = (base64: string, promptText?: string) => {
    setShowImageUploader(false);
    handleSendMessage(promptText || 'Please analyze this photo and provide structured safety guidance', base64);
  };

  const handleQuickChip = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const quickPrompts = [
    'I accidentally cut my finger with glass in lab.',
    'I burned my hand on boiling water.',
    'Someone fainted in class and is dizzy.',
    'My nose started bleeding heavily.',
    'I twisted my ankle playing basketball.',
    'Someone is coughing and choking on food.'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-120px)] max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden relative animate-fadeIn">
      {/* Header bar */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
              <span>CarePulse AI Assistant</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {geminiInfo?.model || 'Gemini 3.7 Flash'}
              </span>
              {geminiInfo?.isGeminiConfigured ? (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live GenAI
                </span>
              ) : (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Ready
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-500">
              Language: <strong className="text-slate-700">{selectedLanguageName}</strong> • Voice, Image & Text
            </p>
          </div>
        </div>

        {/* Quick Emergency Button */}
        <button
          onClick={onOpenSos}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all"
          aria-label="Request emergency assistance"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Emergency SOS</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 sm:gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white text-cyan-700 border border-slate-200'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
            </div>

            {/* Message Body */}
            <div className="max-w-[88%] sm:max-w-[82%] space-y-1">
              {/* User text bubble */}
              {msg.text && (
                <div
                  className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-tr-none font-medium'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-2xs'
                  }`}
                >
                  {msg.imageUrl && (
                    <div className="mb-2 rounded-lg overflow-hidden max-w-xs border border-white/20">
                      <img
                        src={msg.imageUrl}
                        alt="User uploaded emergency context"
                        className="w-full h-auto max-h-48 object-cover"
                      />
                    </div>
                  )}
                  <p>{msg.text}</p>
                </div>
              )}

              {/* Structured AI Response Card */}
              {msg.structuredResponse && (
                <StructuredResponseCard
                  data={msg.structuredResponse}
                  onOpenSos={onOpenSos}
                  onContactHealth={onContactHealth}
                  onFindNearby={onFindNearby}
                />
              )}

              <span
                className={`text-[10px] text-slate-400 block px-1 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}

        {/* AI Thinking Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white text-cyan-600 flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 rounded-xl rounded-tl-none bg-white border border-slate-200 text-xs sm:text-sm text-slate-600 flex items-center gap-2.5 shadow-2xs">
              <RefreshCw className="w-4 h-4 text-cyan-600 animate-spin" />
              <div>
                <p className="font-bold text-slate-900">
                  CarePulse AI is analyzing...
                </p>
                <p className="text-[11px] text-slate-500">
                  Organizing immediate steps and safety precautions
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 shrink-0 font-medium text-[11px]">
              Suggestions:
            </span>
            {quickPrompts.slice(0, 4).map((p, i) => (
              <button
                key={i}
                onClick={() => handleQuickChip(p)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 text-xs font-medium border border-slate-200 shadow-2xs transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        {/* Attached image preview bar */}
        {attachedImage && (
          <div className="mb-2 flex items-center gap-2 p-2 rounded-lg bg-cyan-50 border border-cyan-200">
            <img
              src={attachedImage}
              alt="Attached preview"
              className="w-9 h-9 rounded object-cover"
            />
            <span className="text-xs text-slate-700 font-medium flex-1 truncate">
              Photo attached for AI assessment
            </span>
            <button
              onClick={() => setAttachedImage(null)}
              className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-200"
              aria-label="Remove attached image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={() => setShowVoiceRecorder(true)}
            className="p-2.5 sm:px-3 sm:py-2 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0"
            title="Speak using Voice Input"
            aria-label="Speak using Voice Input"
          >
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Speak</span>
          </button>

          {/* Image Input Button */}
          <button
            type="button"
            onClick={() => setShowImageUploader(true)}
            className="p-2.5 sm:px-3 sm:py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0"
            title="Upload photo of injury or hazard"
            aria-label="Upload photo of injury or hazard"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Photo</span>
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Describe what happened (e.g. 'I cut my finger in the lab...')"
            disabled={isLoading}
            className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20 focus:bg-white"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={(!inputVal.trim() && !attachedImage) || isLoading}
            className="p-2.5 sm:px-3.5 sm:py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 active:scale-95 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5 shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>

      {/* Voice Recorder Modal */}
      <VoiceRecorder
        isOpen={showVoiceRecorder}
        onCancel={() => setShowVoiceRecorder(false)}
        onTranscribe={handleVoiceTranscribed}
      />

      {/* Image Uploader Modal */}
      {showImageUploader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md relative">
            <ImageUploader
              onAnalyzeImage={handleImageUploaded}
              isLoading={isLoading}
              onClose={() => setShowImageUploader(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
