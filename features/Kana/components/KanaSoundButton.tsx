'use client';
import { useAudioPreferences } from '@/features/Preferences';
import { usePronunciation } from '@/features/Preferences/hooks/usePronunciation';
import { getKanaPhonetic } from '@/features/Kana/data/kanaPhonetics';
import { getKanaClipSrc } from '@/features/Kana/lib/kanaAudio';
import { cn } from '@/shared/utils/utils';

interface KanaSoundButtonProps {
  char: string;
  className?: string;
}

/** A kana character that plays its pronunciation when clicked. */
const KanaSoundButton = ({ char, className }: KanaSoundButtonProps) => {
  const { play, isPlaying } = usePronunciation();
  const { pronunciationEnabled } = useAudioPreferences();
  const phonetic = getKanaPhonetic(char);

  if (!pronunciationEnabled) {
    return (
      <span lang='ja' className={className}>
        {char}
      </span>
    );
  }

  const clipSrc = getKanaClipSrc(char);

  return (
    <button
      type='button'
      lang='ja'
      onClick={() => void play(char, clipSrc ? [clipSrc] : null)}
      title={phonetic ? `${char}: ${phonetic.hint}` : char}
      aria-label={`Play pronunciation of ${char}`}
      className={cn(
        'cursor-pointer rounded-lg transition-all duration-200 active:scale-95',
        'hover:text-(--main-color)',
        isPlaying && 'text-(--main-color)',
        className,
      )}
    >
      {char}
    </button>
  );
};

export default KanaSoundButton;
