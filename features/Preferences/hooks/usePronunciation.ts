'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAudioPreferences } from '@/features/Preferences/facade/useAudioPreferences';
import { useJapaneseTTS } from '@/features/Preferences/hooks/useJapaneseTTS';

/**
 * Plays Japanese pronunciation. Pre-recorded clips are used when provided
 * (played back to back), and the browser's speech engine is the fallback when
 * there are no clips or one fails to load.
 */
export const usePronunciation = () => {
  const {
    speak,
    stop: stopSpeech,
    refreshVoices,
    isSupported,
  } = useJapaneseTTS();
  const { pronunciationEnabled, pronunciationSpeed, pronunciationPitch } =
    useAudioPreferences();
  const [isClipPlaying, setIsClipPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestIdRef = useRef(0);

  const stopClip = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsClipPlaying(false);
  }, []);

  const stop = useCallback(() => {
    requestIdRef.current++;
    stopClip();
    stopSpeech();
    setIsSpeaking(false);
  }, [stopClip, stopSpeech]);

  useEffect(() => stopClip, [stopClip]);

  const speakText = useCallback(
    async (text: string, requestId: number) => {
      refreshVoices();
      // Firefox needs longer delay to ensure voices are loaded
      const isFirefox = /Firefox/i.test(navigator.userAgent);
      await new Promise(resolve => setTimeout(resolve, isFirefox ? 300 : 100));
      if (requestId !== requestIdRef.current) return;
      setIsSpeaking(true);
      await speak(text, {
        rate: pronunciationSpeed,
        pitch: pronunciationPitch,
        volume: 0.8,
      });
      if (requestId === requestIdRef.current) setIsSpeaking(false);
    },
    [pronunciationPitch, pronunciationSpeed, refreshVoices, speak],
  );

  const playClips = useCallback(
    (srcs: string[], requestId: number) =>
      new Promise<boolean>(resolve => {
        let index = 0;
        const playNext = () => {
          if (requestId !== requestIdRef.current) return resolve(true);
          if (index >= srcs.length) {
            audioRef.current = null;
            setIsClipPlaying(false);
            return resolve(true);
          }
          const audio = new Audio(srcs[index++]);
          audio.playbackRate = pronunciationSpeed;
          audio.onended = playNext;
          audio.onerror = () => {
            stopClip();
            resolve(false);
          };
          audioRef.current = audio;
          audio.play().catch(() => {
            stopClip();
            resolve(false);
          });
        };
        setIsClipPlaying(true);
        playNext();
      }),
    [pronunciationSpeed, stopClip],
  );

  const play = useCallback(
    async (text: string, clipSrcs?: string[] | null) => {
      if (!pronunciationEnabled || typeof window === 'undefined') return;
      stop();
      const requestId = requestIdRef.current;

      if (clipSrcs && clipSrcs.length > 0) {
        const played = await playClips(clipSrcs, requestId);
        if (played || requestId !== requestIdRef.current) return;
      }
      await speakText(text, requestId);
    },
    [playClips, pronunciationEnabled, speakText, stop],
  );

  return {
    play,
    stop,
    isPlaying: isClipPlaying || isSpeaking,
    isSupported,
  };
};
