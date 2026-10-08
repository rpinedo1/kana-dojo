'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ErrorExercise } from '../../types';
import { shuffled } from '../../lib/session';
import { stripRuby } from '../../lib/ruby';
import RubyText from '../RubyText';
import ChoiceButton from './ChoiceButton';
import type { ExerciseViewProps } from './types';

const ErrorView = ({
  exercise,
  checked,
  onChange,
}: ExerciseViewProps<ErrorExercise>) => {
  const t = useTranslations('grammar.exercise');
  const fixOptions = useMemo(() => shuffled(exercise.fixOptions), [exercise]);
  const [partIndex, setPartIndex] = useState<number | null>(null);
  const [fix, setFix] = useState<string | null>(null);

  const report = (nextPart: number | null, nextFix: string | null) => {
    onChange(
      nextPart !== null && nextFix !== null
        ? { type: 'error', partIndex: nextPart, fix: nextFix }
        : null,
    );
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <span
          id={`${exercise.id}-parts`}
          className='text-sm text-(--secondary-color)'
        >
          {t('stepFindError')}
        </span>
        <div
          role='radiogroup'
          aria-labelledby={`${exercise.id}-parts`}
          className='flex flex-wrap gap-2'
        >
          {exercise.parts.map((part, index) => (
            <ChoiceButton
              key={index}
              className='text-xl md:text-2xl'
              ariaLabel={stripRuby(part)}
              selected={partIndex === index}
              disabled={checked}
              mark={
                checked
                  ? index === exercise.errorIndex
                    ? 'correct'
                    : partIndex === index
                      ? 'wrong'
                      : null
                  : null
              }
              onSelect={() => {
                setPartIndex(index);
                report(index, fix);
              }}
            >
              <RubyText text={part} rtClassName='text-current opacity-80' />
            </ChoiceButton>
          ))}
        </div>
      </div>

      {(partIndex !== null || checked) && (
        <div className='flex flex-col gap-2'>
          <span
            id={`${exercise.id}-fixes`}
            className='text-sm text-(--secondary-color)'
          >
            {t('stepChooseFix')}
          </span>
          <div
            role='radiogroup'
            aria-labelledby={`${exercise.id}-fixes`}
            className='flex flex-wrap gap-2'
          >
            {fixOptions.map(option => (
              <ChoiceButton
                key={option}
                className='text-xl md:text-2xl'
                ariaLabel={stripRuby(option)}
                selected={fix === option}
                disabled={checked}
                mark={
                  checked
                    ? exercise.acceptedFixes.includes(option)
                      ? 'correct'
                      : fix === option
                        ? 'wrong'
                        : null
                    : null
                }
                onSelect={() => {
                  setFix(option);
                  report(partIndex, option);
                }}
              >
                <RubyText text={option} rtClassName='text-current opacity-80' />
              </ChoiceButton>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorView;
