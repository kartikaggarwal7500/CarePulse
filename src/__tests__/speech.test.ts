import { describe, it, expect } from 'vitest';
import {
  speakText,
  stopSpeaking,
  isSpeechSupported,
  isSpeechRecognitionSupported,
  getAvailableVoices
} from '../services/speech';

describe('Speech & Audio Accessibility Test Suite', () => {
  it('should detect speech synthesis browser support safely', () => {
    const supported = isSpeechSupported();
    expect(typeof supported).toBe('boolean');
  });

  it('should detect speech recognition browser support safely', () => {
    const recogSupported = isSpeechRecognitionSupported();
    expect(typeof recogSupported).toBe('boolean');
  });

  it('should retrieve or query available system voices without crashing', () => {
    const voices = getAvailableVoices();
    expect(Array.isArray(voices)).toBe(true);
  });

  it('should execute stopSpeaking gracefully without throwing errors', () => {
    expect(() => stopSpeaking()).not.toThrow();
  });

  it('should invoke speakText with text and callbacks safely', () => {
    expect(() => {
      speakText('Test medical emergency announcement', 'en-US');
    }).not.toThrow();
  });
});
