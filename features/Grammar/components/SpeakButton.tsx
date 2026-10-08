'use client';

import { Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAudioPreferences } from '@/features/Preferences';
import { usePronunciation } from '@/features/Preferences/hooks/usePronunciation';
import { cn } from '@/shared/utils/utils';
import { getSentenceClipSrc, getSpeechText } from '../lib/audio';
import type { RubyText } from '../types';

interface SpeakButtonProps {
  jp: RubyText;
  className?: string;
}

/** Plays a recorded clip of the sentence, or the browser voice as a fallback. */
const SpeakButton = ({ jp, className }: SpeakButtonProps) => {
  const t = useTranslations('grammar.lesson');
  const { pronunciationEnabled } = useAudioPreferences();
  const { play, stop, isPlaying } = usePronunciation();

  if (!pronunciationEnabled) return null;

  return (
    <button
      type='button'
      onClick={() => {
        if (isPlaying) stop();
        else void play(getSpeechText(jp), [getSentenceClipSrc(jp)]);
      }}
      aria-label={t('playAudio')}
      title={t('playAudio')}
      className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
        'bg-(--background-color) text-(--main-color) transition-colors duration-200',
        'hover:cursor-pointer hover:bg-(--main-color)/15 active:scale-95',
        isPlaying && 'bg-(--main-color)/15',
        className,
      )}
    >
      <Volume2 size={15} className='fill-current' />
    </button>
  );
};

export default SpeakButton;
