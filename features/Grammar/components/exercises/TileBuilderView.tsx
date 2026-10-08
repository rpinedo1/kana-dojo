'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import { useClick } from '@/shared/hooks/generic/useAudio';
import type { TileExercise } from '../../types';
import { shuffled } from '../../lib/session';
import { stripRuby } from '../../lib/ruby';
import RubyText from '../RubyText';
import type { ExerciseViewProps } from './types';

const tileClassName =
  'inline-flex min-h-12 items-center justify-center rounded-2xl border-b-6 px-4 pt-2.5 pb-1.5 text-xl md:text-2xl transition-all duration-150 focus-visible:ring-2 focus-visible:ring-(--main-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--background-color) focus-visible:outline-none';

/**
 * Tap-to-build sentence builder. Tiles move between the bank and the answer
 * row by tapping (no dragging), so it works with touch, keyboard and screen
 * readers alike.
 */
const TileBuilderView = ({
  exercise,
  checked,
  grade,
  onChange,
}: ExerciseViewProps<TileExercise>) => {
  const t = useTranslations('grammar.exercise');
  const { playClick } = useClick();
  const bank = useMemo(
    () => shuffled([...exercise.tiles, ...(exercise.distractors ?? [])]),
    [exercise],
  );
  // Indices into `bank`, in answer order.
  const [selected, setSelected] = useState<number[]>([]);

  const update = (next: number[]) => {
    setSelected(next);
    onChange(
      next.length > 0
        ? { type: exercise.type, tiles: next.map(index => bank[index]) }
        : null,
    );
  };

  const sentenceText = selected.map(index => stripRuby(bank[index])).join(' ');

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1 rounded-2xl bg-(--card-color) p-4'>
        <span className='text-xl text-(--main-color) md:text-2xl'>
          “{exercise.prompt}”
        </span>
        <span className='text-sm text-(--secondary-color)'>
          {exercise.constraint}
        </span>
      </div>

      <div className='flex flex-col gap-1'>
        <span
          id={`${exercise.id}-answer-label`}
          className='text-sm text-(--secondary-color)'
        >
          {t('yourSentence')}
        </span>
        <ul
          aria-labelledby={`${exercise.id}-answer-label`}
          className={cn(
            'flex min-h-[4.5rem] flex-wrap items-center gap-2 border-b-3 pb-3',
            checked
              ? grade?.correct
                ? 'border-(--main-color)'
                : 'border-(--secondary-color)'
              : 'border-(--border-color)',
          )}
        >
          {selected.length === 0 && (
            <li className='text-(--secondary-color) italic'>
              {t('emptyAnswer')}
            </li>
          )}
          {selected.map((bankIndex, position) => (
            <li key={bankIndex}>
              <button
                type='button'
                disabled={checked}
                aria-label={t('removeTile', {
                  tile: stripRuby(bank[bankIndex]),
                  position: position + 1,
                })}
                onClick={() => {
                  playClick();
                  update(selected.filter(index => index !== bankIndex));
                }}
                className={cn(
                  tileClassName,
                  'border-(--main-color-accent) bg-(--main-color) text-(--background-color)',
                  !checked &&
                    'cursor-pointer active:translate-y-[4px] active:border-b-2',
                )}
              >
                <RubyText
                  text={bank[bankIndex]}
                  rtClassName='text-current opacity-80'
                />
              </button>
            </li>
          ))}
        </ul>
        <p className='sr-only' aria-live='polite'>
          {sentenceText
            ? t('sentenceNow', { sentence: sentenceText })
            : t('sentenceEmpty')}
        </p>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <span
            id={`${exercise.id}-bank-label`}
            className='text-sm text-(--secondary-color)'
          >
            {t('tileBank')}
          </span>
          <button
            type='button'
            disabled={checked || selected.length === 0}
            onClick={() => {
              playClick();
              update([]);
            }}
            className='flex cursor-pointer items-center gap-1 rounded-xl px-3 py-1.5 text-sm text-(--secondary-color) hover:text-(--main-color) focus-visible:ring-2 focus-visible:ring-(--main-color) focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40'
          >
            <RotateCcw aria-hidden className='h-4 w-4' />
            {t('reset')}
          </button>
        </div>
        <ul
          aria-labelledby={`${exercise.id}-bank-label`}
          className='flex flex-wrap gap-2'
        >
          {bank.map((tile, index) => {
            const used = selected.includes(index);
            return (
              <li key={index}>
                {used ? (
                  <span
                    aria-hidden
                    className={cn(
                      tileClassName,
                      'border-transparent bg-(--border-color)/40',
                    )}
                  >
                    <RubyText text={tile} className='invisible' />
                  </span>
                ) : (
                  <button
                    type='button'
                    disabled={checked}
                    aria-label={t('addTile', { tile: stripRuby(tile) })}
                    onClick={() => {
                      playClick();
                      update([...selected, index]);
                    }}
                    className={cn(
                      tileClassName,
                      'border-(--secondary-color-accent) bg-(--secondary-color) text-(--background-color)',
                      checked
                        ? 'opacity-60'
                        : 'cursor-pointer active:translate-y-[4px] active:border-b-2',
                    )}
                  >
                    <RubyText
                      text={tile}
                      rtClassName='text-current opacity-80'
                    />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TileBuilderView;
