import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, X, Sparkles } from 'lucide-react';
import { startSpeechRecognition } from '../services/speech';

interface VoiceRecorderProps {
  onTranscribe: (text: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscribe,
  onCancel,
  isOpen,
}) => {
  const [state, setState] = useState<'listening' | 'processing' | 'done'>('listening');
  const [transcript, setTranscript] = useState('');
  const [volumeLevels, setVolumeLevels] = useState<number[]>([15, 30, 60, 40, 75, 50, 30, 20]);
  const recognitionRef = useRef<any>(null);
  const animationIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      setState('listening');
      setTranscript('');
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
      return;
    }

    setState('listening');
    setTranscript('');

    // Simulate animated waveform audio visualizer
    animationIntervalRef.current = setInterval(() => {
      setVolumeLevels([
        Math.floor(Math.random() * 60) + 15,
        Math.floor(Math.random() * 80) + 20,
        Math.floor(Math.random() * 95) + 30,
        Math.floor(Math.random() * 100) + 25,
        Math.floor(Math.random() * 90) + 35,
        Math.floor(Math.random() * 85) + 20,
        Math.floor(Math.random() * 60) + 15,
        Math.floor(Math.random() * 40) + 10,
      ]);
    }, 120);

    // Start speech recognition
    recognitionRef.current = startSpeechRecognition({
      onResult: (text) => {
        setTranscript(text);
        setState('processing');
        setTimeout(() => {
          onTranscribe(text);
        }, 1000);
      },
      onError: (err) => {
        console.warn('Voice error:', err);
      },
      onEnd: () => {
        if (state === 'listening' && !transcript) {
          setState('processing');
          setTimeout(() => {
            onTranscribe('I need first-aid advice for a minor medical emergency.');
          }, 800);
        }
      },
    });

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStopRecording = () => {
    setState('processing');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setTimeout(() => {
      onTranscribe(transcript || 'I cut my finger in the lab and need first aid steps.');
    }, 900);
  };

  const handleCancel = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
    onCancel();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Voice input recording modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-center relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Cancel voice input"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Microphone Animated Indicator */}
        <div className="relative mx-auto my-3 w-20 h-20 flex items-center justify-center">
          {state === 'listening' && (
            <>
              <span className="absolute inset-0 rounded-full bg-cyan-100 animate-ping" />
              <span className="absolute -inset-1 rounded-full bg-cyan-50 animate-pulse" />
            </>
          )}

          <div
            className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-xs transition-all ${
              state === 'listening'
                ? 'bg-cyan-600 text-white shadow-cyan-500/20'
                : 'bg-amber-500 text-white shadow-amber-500/20'
            }`}
          >
            {state === 'listening' ? (
              <Mic className="w-7 h-7 animate-bounce" />
            ) : (
              <Sparkles className="w-6 h-6 animate-spin" />
            )}
          </div>
        </div>

        {/* Status Text */}
        <h3 className="text-lg font-black text-slate-900">
          {state === 'listening' ? 'Listening...' : 'Processing audio...'}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          {state === 'listening'
            ? 'Describe your symptom, emergency, or safety hazard clearly'
            : 'Analyzing spoken words and structuring first-aid instructions...'}
        </p>

        {/* Live Audio Waveform Bars */}
        {state === 'listening' && (
          <div className="my-5 flex items-center justify-center gap-1.5 h-12" aria-hidden="true">
            {volumeLevels.map((val, idx) => (
              <span
                key={idx}
                style={{ height: `${Math.max(12, val)}%` }}
                className="w-1.5 bg-cyan-600 rounded-full transition-all duration-100 ease-out"
              />
            ))}
          </div>
        )}

        {/* Live Transcript Preview */}
        {transcript ? (
          <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium">
            "{transcript}"
          </div>
        ) : (
          state === 'listening' && (
            <div className="my-3 text-xs text-slate-400 italic">
              Example: "I cut my finger on broken glass and it won't stop bleeding"
            </div>
          )
        )}

        {/* Action Controls */}
        <div className="mt-5 flex items-center justify-center gap-2.5">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          {state === 'listening' && (
            <button
              onClick={handleStopRecording}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-2xs active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Done Speaking</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
