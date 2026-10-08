'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/shared/utils/utils';
import RubyText from './RubyText';
import { useGrammarStore } from '../store/useGrammarStore';
import type { GrammarSentence } from '../types';

interface SentenceCardProps {
  sentence: GrammarSentence;
  showPronunciation?: boolean;
  size?: 'md' | 'lg';
  className?: string;
}

export const RegisterBadge = ({
  register,
}: {
  register: 'polite' | 'casual';
}) => {
  const t = useTranslations('grammar.lesson');
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-lg px-2 py-0.5 text-xs uppercase',
        register === 'polite'
          ? 'bg-(--main-color) text-(--background-color)'
          : 'border border-(--border-color) text-(--secondary-color)',
      )}
    >
      {register === 'polite' ? t('polite') : t('casual')}
    </span>
  );
};

/** Japanese sentence with optional romaji, meaning and pronunciation guide. */
const SentenceCard = ({
  sentence,
  showPronunciation = false,
  size = 'md',
  className,
}: SentenceCardProps) => {
  const t = useTranslations('grammar.lesson');
  const showRomaji = useGrammarStore(state => state.showRomaji);

  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <div className='flex flex-wrap items-center gap-2'>
        <RubyText
          text={sentence.jp}
          className={
            size === 'lg' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
          }
        />
        {sentence.register && <RegisterBadge register={sentence.register} />}
      </div>
      {showRomaji && (
        <span className='text-sm text-(--secondary-color) italic'>
          {sentence.romaji}
        </span>
      )}
      <span className='text-base text-(--main-color)'>{sentence.en}</span>
      {showPronunciation && sentence.pronunciation && (
        <span className='text-sm text-(--secondary-color)'>
          {t('pronunciationGuide')}:{' '}
          <span className='font-mono'>{sentence.pronunciation}</span>
        </span>
      )}
    </div>
  );
};

export default SentenceCard;
