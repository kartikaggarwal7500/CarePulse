// Speech synthesis (Text-to-Speech) and Speech Recognition (Voice-to-Text) helpers

export class SpeechService {
  private static isSpeaking: boolean = false;

  public static speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this environment');
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Clean markdown/special characters for natural speech
      const cleanText = text
        .replace(/[#*_`]/g, '')
        .replace(/\n+/g, '. ')
        .trim();

      if (!cleanText) {
        if (onEnd) onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95; // Slightly measured rate for clarity in emergencies
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      this.isSpeaking = true;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  public static stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
      this.isSpeaking = false;
    }
  }

  public static getSpeakingStatus(): boolean {
    return this.isSpeaking;
  }
}

// Convenient top-level speech helpers
export function speakText(text: string, lang = 'en-US', onEnd?: () => void) {
  SpeechService.speak(text, onEnd);
}

export function stopSpeaking() {
  SpeechService.stop();
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  );
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.getVoices() || [];
  }
  return [];
}

// Browser Speech Recognition or Simulated Audio Engine
export interface VoiceRecognitionOptions {
  onResult: (transcript: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
  language?: string;
}

export class VoiceRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor(options: VoiceRecognitionOptions) {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = options.language || 'en-US';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        options.onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        options.onError(event.error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
        options.onEnd();
      };
    }
  }

  public start() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (e) {
        console.warn('Speech recognition start failed', e);
      }
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
      } catch (e) {
        console.warn('Speech recognition stop failed', e);
      }
    }
  }

  public abort() {
    if (this.recognition) {
      try {
        this.recognition.abort();
        this.isListening = false;
      } catch (e) {}
    }
  }
}

export function startSpeechRecognition(options: VoiceRecognitionOptions): {
  stop: () => void;
  abort: () => void;
} {
  const service = new VoiceRecognitionService(options);
  service.start();
  return {
    stop: () => service.stop(),
    abort: () => service.abort(),
  };
}
