'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/shared/utils/utils';
import { useClick } from '@/shared/hooks/generic/useAudio';
import { useGrammarStore } from '../store/useGrammarStore';

const Toggle = ({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  const { playClick } = useClick();
  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      title={hint}
      onClick={() => {
        playClick();
        onChange(!checked);
      }}
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors',
        'focus-visible:ring-2 focus-visible:ring-(--main-color) focus-visible:outline-none',
        checked
          ? 'bg-(--main-color) text-(--background-color)'
          : 'bg-(--background-color) text-(--secondary-color) hover:text-(--main-color)',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'relative h-4 w-7 rounded-full transition-colors',
          checked ? 'bg-(--background-color)/40' : 'bg-(--border-color)',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-3 w-3 rounded-full transition-all',
            checked
              ? 'left-3.5 bg-(--background-color)'
              : 'left-0.5 bg-(--secondary-color)',
          )}
        />
      </span>
      {label}
    </button>
  );
};

/** Romaji and furigana scaffolding switches (persisted with grammar progress). */
const DisplayToggles = ({ className }: { className?: string }) => {
  const t = useTranslations('grammar.settings');
  const showRomaji = useGrammarStore(state => state.showRomaji);
  const showFurigana = useGrammarStore(state => state.showFurigana);
  const setShowRomaji = useGrammarStore(state => state.setShowRomaji);
  const setShowFurigana = useGrammarStore(state => state.setShowFurigana);

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <Toggle
        label={t('furigana')}
        hint={t('furiganaHint')}
        checked={showFurigana}
        onChange={setShowFurigana}
      />
      <Toggle
        label={t('romaji')}
        hint={t('romajiHint')}
        checked={showRomaji}
        onChange={setShowRomaji}
      />
    </div>
  );
};

export default DisplayToggles;
