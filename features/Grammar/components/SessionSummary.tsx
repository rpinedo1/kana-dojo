'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Check, X } from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import { grammarCourse } from '../data';
import RubyText from './RubyText';
import type { ExerciseResult } from './exercises/ExercisePlayer';

interface SessionSummaryProps {
  title: string;
  results: ExerciseResult[];
  footer?: ReactNode;
  children?: ReactNode;
}

/** End-of-session score with per-question results and next actions. */
const SessionSummary = ({
  title,
  results,
  footer,
  children,
}: SessionSummaryProps) => {
  const t = useTranslations('grammar.summary');
  const score = results.filter(result => result.correct).length;
  const missed = results.filter(result => !result.correct);

  return (
    <section
      aria-labelledby='grammar-summary-title'
      className='flex flex-col gap-4'
    >
      <div className='flex flex-col gap-1 rounded-2xl bg-(--card-color) p-5'>
        <h3
          id='grammar-summary-title'
          tabIndex={-1}
          className='text-2xl font-semibold outline-none'
        >
          {title}
        </h3>
        <p className='text-lg text-(--secondary-color)'>
          {t('score', { score, total: results.length })}
        </p>
        {children}
        <p className='text-(--secondary-color)'>
          {missed.length > 0 ? t('addedToReview') : t('allCorrect')}
        </p>
      </div>

      <ul className='flex flex-col gap-2'>
        {results.map(({ exercise, correct }) => {
          const concept = grammarCourse.concepts.find(
            item => item.id === exercise.conceptId,
          );
          return (
            <li
              key={exercise.id}
              className='flex items-start gap-3 rounded-xl bg-(--card-color) px-4 py-3'
            >
              <span
                className={cn(
                  'mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-(--background-color)',
                  correct ? 'bg-(--main-color)' : 'bg-(--secondary-color)',
                )}
              >
                {correct ? (
                  <Check aria-label='correct' className='h-4 w-4' />
                ) : (
                  <X aria-label='incorrect' className='h-4 w-4' />
                )}
              </span>
              <span className='flex flex-col'>
                <RubyText text={exercise.sentence.jp} className='text-lg' />
                <span className='text-sm text-(--secondary-color)'>
                  {exercise.sentence.en}
                  {concept && ` · ${concept.name}`}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      {footer && (
        <div className='flex flex-col gap-2 sm:flex-row'>{footer}</div>
      )}
    </section>
  );
};

export default SessionSummary;
