'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useAudioPreferences } from '@/features/Preferences';
import { usePronunciation } from '@/features/Preferences/hooks/usePronunciation';
import { getKanaClipSrcs } from '@/features/Kana/lib/kanaAudio';

// Let the "correct" chime start before the kana is spoken over it.
const AFTER_CHIME_MS = 150;

/**
 * Speaks the kana of a correctly answered prompt, when the user has
 * pronunciation auto-play switched on.
 */
export const useKanaAnswerAudio = () => {
  const { play } = usePronunciation();
  const { pronunciationEnabled, pronunciationAutoPlay } = useAudioPreferences();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  return useCallback(
    (kanaUnits: string[]) => {
      if (!pronunciationEnabled || !pronunciationAutoPlay) return;
      if (kanaUnits.length === 0) return;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        void play(kanaUnits.join(''), getKanaClipSrcs(kanaUnits));
      }, AFTER_CHIME_MS);
    },
    [play, pronunciationAutoPlay, pronunciationEnabled],
  );
};
