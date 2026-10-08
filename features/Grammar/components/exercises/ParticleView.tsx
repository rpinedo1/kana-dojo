'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/utils/utils';
import type { ParticleExercise } from '../../types';
import { shuffled } from '../../lib/session';
import RubyText from '../RubyText';
import ChoiceButton from './ChoiceButton';
import type { ExerciseViewProps } from './types';

const ParticleView = ({
  exercise,
  checked,
  grade,
  onChange,
}: ExerciseViewProps<ParticleExercise>) => {
  const t = useTranslations('grammar.exercise');
  const options = useMemo(() => shuffled(exercise.options), [exercise]);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-(--secondary-color)'>
        <span className='font-semibold text-(--main-color)'>
          {t('context')}:
        </span>{' '}
        {exercise.context}
      </p>
      <div className='flex flex-wrap items-end gap-x-1 gap-y-2 rounded-2xl bg-(--card-color) p-4 text-2xl md:text-3xl'>
        <RubyText text={exercise.before} />
        <span
          aria-label={selected ? undefined : t('blank')}
          className={cn(
            'inline-flex min-w-12 items-center justify-center rounded-xl border-b-4 px-2 pb-0.5',
            selected
              ? checked && !grade?.correct
                ? 'border-(--border-color) text-(--secondary-color) line-through'
                : 'border-(--main-color) text-(--main-color)'
              : 'border-(--border-color) text-transparent',
          )}
          lang='ja'
        >
          {selected ?? '＿'}
        </span>
        <RubyText text={exercise.after} />
      </div>
      <div
        role='radiogroup'
        aria-label={exercise.instruction}
        className='flex flex-wrap gap-2'
      >
        {options.map(option => (
          <ChoiceButton
            key={option}
            className='min-w-16 justify-center text-2xl'
            selected={selected === option}
            disabled={checked}
            mark={
              checked
                ? exercise.accepted.includes(option)
                  ? 'correct'
                  : selected === option
                    ? 'wrong'
                    : null
                : null
            }
            onSelect={() => {
              setSelected(option);
              onChange({ type: 'particle', particle: option });
            }}
          >
            <span lang='ja'>{option}</span>
          </ChoiceButton>
        ))}
      </div>
    </div>
  );
};

export default ParticleView;
