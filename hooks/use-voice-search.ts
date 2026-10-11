"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseVoiceSearchOptions {
  lang?: string;
  onResult: (transcript: string) => void;
}

interface UseVoiceSearchReturn {
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  start: () => void;
  stop: () => void;
}

/**
 * Thin wrapper around the Web Speech API (SpeechRecognition) for voice-driven
 * search boxes. Arabic ("ar-SA") works well for Quran/Hadith text search;
 * callers can override `lang` for other locales.
 */
export function useVoiceSearch({ lang = "ar-SA", onResult }: UseVoiceSearchOptions): UseVoiceSearchReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("not_supported");
      return;
    }

    setError(null);
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e: any) => {
      setError(e?.error === "not-allowed" ? "mic_denied" : "recognition_error");
      setIsListening(false);
    };
    recognition.onresult = (e: any) => {
      const transcript = e.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) onResultRef.current(transcript);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      // start() throws if a recognition session is already active — ignored.
    }
  }, [lang]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  return { isListening, isSupported, error, start, stop };
}
