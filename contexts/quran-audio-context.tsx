"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_RECITER_ID,
  RECITERS,
  RECITER_STORAGE_KEY,
  ayahAudioUrl,
} from "@/lib/quran-reciters";
import { getSurahByNumber, buildAyahQueue, TOTAL_SURAHS } from "@/lib/quran-surahs";

export interface QuranAudioAyah {
  number: number; // global ayah number, used to build the audio file url
  numberInSurah: number;
}

export interface QuranAudioSurahMeta {
  n: number;
  ar: string;
  en: string;
}

/**
 * What happens once every ayah queued for playback has finished:
 * - "next": move on to the next surah by itself (wraps from 114 back to 1,
 *   so a continuous recitation session never just dead-ends)
 * - "repeatSurah": start the same surah over from its first ayah
 * - "repeatAyah": keep repeating whichever single ayah is currently playing
 * - "stop": finish and go quiet, like a normal single playback
 */
export type QuranRepeatMode = "next" | "repeatSurah" | "repeatAyah" | "stop";

const REPEAT_MODE_STORAGE_KEY = "quran_repeat_mode";

interface QuranAudioContextValue {
  reciterId: string;
  selectReciter: (id: string) => void;
  repeatMode: QuranRepeatMode;
  selectRepeatMode: (mode: QuranRepeatMode) => void;
  playing: boolean;
  buffering: boolean;
  error: boolean;
  activeSurah: QuranAudioSurahMeta | null;
  activeAyahNumberInSurah: number | null;
  playFromAyah: (
    surah: QuranAudioSurahMeta,
    ayahs: QuranAudioAyah[],
    startNumberInSurah: number
  ) => void;
  togglePlayPause: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const QuranAudioContext = createContext<QuranAudioContextValue | null>(null);

/**
 * Holds ONE audio element for the whole app's lifetime, created once with
 * `new Audio()` and never attached to any screen's component tree. Because
 * it isn't owned by a page/component that can mount and unmount, moving
 * between screens, locking the phone, or switching to another app never
 * tears it down — only an explicit stop() does. Combined with the Media
 * Session wiring below, this lets recitation keep playing (and be
 * controlled from the lock screen / notification shade) while the app
 * itself isn't on screen.
 */
export function QuranAudioProvider({ children }: { children: ReactNode }) {
  const [reciterId, setReciterIdState] = useState(DEFAULT_RECITER_ID);
  const [repeatMode, setRepeatModeState] = useState<QuranRepeatMode>("next");
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState(false);
  const [activeSurah, setActiveSurah] = useState<QuranAudioSurahMeta | null>(null);
  const [activeAyahNumberInSurah, setActiveAyahNumberInSurah] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<QuranAudioAyah[]>([]);
  const indexRef = useRef<number>(-1);
  const reciterIdRef = useRef(reciterId);
  reciterIdRef.current = reciterId;
  const repeatModeRef = useRef(repeatMode);
  repeatModeRef.current = repeatMode;
  const activeSurahRef = useRef<QuranAudioSurahMeta | null>(null);
  activeSurahRef.current = activeSurah;

  const updateNavFlags = useCallback(() => {
    setHasNext(indexRef.current >= 0 && indexRef.current + 1 < queueRef.current.length);
    setHasPrev(indexRef.current > 0);
  }, []);

  const stop = useCallback(() => {
    const el = audioElRef.current;
    if (el) {
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
    queueRef.current = [];
    indexRef.current = -1;
    setActiveSurah(null);
    setActiveAyahNumberInSurah(null);
    setPlaying(false);
    setBuffering(false);
    setHasNext(false);
    setHasPrev(false);
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.playbackState = "none";
        navigator.mediaSession.metadata = null;
      } catch {
        // Some browsers restrict assignment outside certain contexts — safe to ignore.
      }
    }
  }, []);

  const playIndex = useCallback(
    (idx: number) => {
      const el = audioElRef.current;
      const queue = queueRef.current;
      if (!el || idx < 0 || idx >= queue.length) return;
      indexRef.current = idx;
      const ayah = queue[idx];
      setError(false);
      setBuffering(true);
      el.src = ayahAudioUrl(reciterIdRef.current, ayah.number);
      el.play().catch(() => {
        setError(true);
        setBuffering(false);
        setPlaying(false);
      });
      setActiveAyahNumberInSurah(ayah.numberInSurah);
      updateNavFlags();
    },
    [updateNavFlags]
  );

  const playIndexRef = useRef(playIndex);
  playIndexRef.current = playIndex;

  const stopRef = useRef(stop);
  stopRef.current = stop;

  /**
   * Moves to the next ayah in the current surah, or — when the whole surah
   * has been recited — decides what comes next purely from `repeatMode`,
   * with no network call: restart the surah, repeat the current ayah,
   * stop, or compute the next surah's ayah range on-device and keep going
   * (looping from 114 back to 1 so a continuous session never just ends).
   * This runs the same way whether a screen is open or the app is
   * backgrounded, since it only touches the shared audio element.
   */
  const advance = useCallback((dir: 1 | -1, stopIfNone: boolean) => {
    const nextIdx = indexRef.current + dir;
    const queue = queueRef.current;
    if (nextIdx < 0 || nextIdx >= queue.length) {
      if (dir === 1 && stopIfNone) {
        const mode = repeatModeRef.current;
        if (mode === "repeatSurah") {
          playIndexRef.current(0);
          return;
        }
        if (mode === "next" && activeSurahRef.current) {
          const currentN = activeSurahRef.current.n;
          const nextN = currentN >= TOTAL_SURAHS ? 1 : currentN + 1;
          const meta = getSurahByNumber(nextN);
          const newQueue = buildAyahQueue(nextN);
          if (meta && newQueue.length > 0) {
            queueRef.current = newQueue;
            setActiveSurah({ n: meta.n, ar: meta.ar, en: meta.en });
            playIndexRef.current(0);
            return;
          }
        }
      }
      if (stopIfNone) stopRef.current();
      return;
    }
    playIndexRef.current(nextIdx);
  }, []);

  const advanceRef = useRef(advance);
  advanceRef.current = advance;

  const togglePlayPause = useCallback(() => {
    const el = audioElRef.current;
    if (!el || !el.src) return;
    if (el.paused) {
      el.play().catch(() => {
        setError(true);
        setPlaying(false);
      });
    } else {
      el.pause();
    }
  }, []);

  const togglePlayPauseRef = useRef(togglePlayPause);
  togglePlayPauseRef.current = togglePlayPause;

  // Create the single persistent audio element for the whole session.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = new Audio();
    el.preload = "auto";
    try {
      el.setAttribute("playsinline", "true");
    } catch {
      // Non-essential hint — ignore if unsupported.
    }
    audioElRef.current = el;

    const onPlaying = () => {
      setBuffering(false);
      setPlaying(true);
    };
    const onWaiting = () => setBuffering(true);
    const onPauseEvt = () => setPlaying(false);
    const onErrorEvt = () => {
      setError(true);
      setBuffering(false);
      setPlaying(false);
    };
    const onEnded = () => {
      // "repeatAyah" overrides normal forward progression entirely —
      // the same verse plays again until the person changes the mode.
      if (repeatModeRef.current === "repeatAyah") {
        playIndexRef.current(indexRef.current);
        return;
      }
      advanceRef.current(1, true);
    };

    el.addEventListener("playing", onPlaying);
    el.addEventListener("waiting", onWaiting);
    el.addEventListener("pause", onPauseEvt);
    el.addEventListener("error", onErrorEvt);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("waiting", onWaiting);
      el.removeEventListener("pause", onPauseEvt);
      el.removeEventListener("error", onErrorEvt);
      el.removeEventListener("ended", onEnded);
      el.pause();
    };
  }, []);

  // Load the saved reciter preference once (device preference, not user data).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECITER_STORAGE_KEY);
      if (saved && RECITERS.some((r) => r.id === saved)) setReciterIdState(saved);
    } catch {
      // Ignore storage errors — default reciter still works.
    }
  }, []);

  // Load the saved listening-mode preference once (device preference).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REPEAT_MODE_STORAGE_KEY) as QuranRepeatMode | null;
      if (saved && ["next", "repeatSurah", "repeatAyah", "stop"].includes(saved)) {
        setRepeatModeState(saved);
      }
    } catch {
      // Ignore storage errors — default mode still works.
    }
  }, []);

  // Media Session: wires lock-screen / notification-shade transport controls
  // and shows what's currently reciting, so playback stays controllable even
  // while the app is backgrounded or the phone is locked.
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.setActionHandler("play", () => togglePlayPauseRef.current());
      navigator.mediaSession.setActionHandler("pause", () => togglePlayPauseRef.current());
      navigator.mediaSession.setActionHandler("previoustrack", () => advanceRef.current(-1, false));
      navigator.mediaSession.setActionHandler("nexttrack", () => advanceRef.current(1, true));
    } catch {
      // Unsupported action types on some browsers — safe to ignore.
    }
    return () => {
      try {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
      } catch {
        // Ignore.
      }
    };
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.playbackState = playing || buffering ? "playing" : activeSurah ? "paused" : "none";
    } catch {
      // Ignore.
    }
  }, [playing, buffering, activeSurah]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    if (!activeSurah) {
      try {
        navigator.mediaSession.metadata = null;
      } catch {
        // Ignore.
      }
      return;
    }
    const reciter = RECITERS.find((r) => r.id === reciterId);
    try {
      if (typeof MediaMetadata !== "undefined") {
        navigator.mediaSession.metadata = new MediaMetadata({
          title:
            activeAyahNumberInSurah != null
              ? `سورة ${activeSurah.ar} — آية ${activeAyahNumberInSurah}`
              : `سورة ${activeSurah.ar}`,
          artist: reciter?.name ?? "",
          album: "ذو القرنين",
          artwork: [
            { src: "/icon-light-32x32.png", sizes: "32x32", type: "image/png" },
            { src: "/icon-dark-32x32.png", sizes: "32x32", type: "image/png" },
          ],
        });
      }
    } catch {
      // Ignore — metadata is a nice-to-have.
    }
  }, [activeSurah, activeAyahNumberInSurah, reciterId]);

  const selectReciter = useCallback((id: string) => {
    setReciterIdState(id);
    try {
      localStorage.setItem(RECITER_STORAGE_KEY, id);
    } catch {
      // Ignore storage errors.
    }
    reciterIdRef.current = id;
    // Keep listening uninterrupted: restart the same ayah with the new voice
    // instead of stopping playback outright.
    if (indexRef.current >= 0 && queueRef.current.length > 0) {
      playIndexRef.current(indexRef.current);
    }
  }, []);

  const selectRepeatMode = useCallback((mode: QuranRepeatMode) => {
    setRepeatModeState(mode);
    repeatModeRef.current = mode;
    try {
      localStorage.setItem(REPEAT_MODE_STORAGE_KEY, mode);
    } catch {
      // Ignore storage errors.
    }
  }, []);

  const playFromAyah = useCallback(
    (surah: QuranAudioSurahMeta, ayahs: QuranAudioAyah[], startNumberInSurah: number) => {
      setActiveSurah(surah);
      queueRef.current = ayahs;
      const startIdx = ayahs.findIndex((a) => a.numberInSurah === startNumberInSurah);
      playIndex(startIdx === -1 ? 0 : startIdx);
    },
    [playIndex]
  );

  const next = useCallback(() => advance(1, true), [advance]);
  const prev = useCallback(() => advance(-1, false), [advance]);

  return (
    <QuranAudioContext.Provider
      value={{
        reciterId,
        selectReciter,
        repeatMode,
        selectRepeatMode,
        playing,
        buffering,
        error,
        activeSurah,
        activeAyahNumberInSurah,
        playFromAyah,
        togglePlayPause,
        stop,
        next,
        prev,
        hasNext,
        hasPrev,
      }}
    >
      {children}
    </QuranAudioContext.Provider>
  );
}

export function useQuranAudio() {
  const ctx = useContext(QuranAudioContext);
  if (!ctx) throw new Error("useQuranAudio must be used within a QuranAudioProvider");
  return ctx;
}
