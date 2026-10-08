'use client';

import { forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import { Check, X } from 'lucide-react';
import { Link } from '@/core/i18n/routing';
import { cn } from '@/shared/utils/utils';
import { grammarCourse } from '../../data';
import { describeTileAnswer } from '../../lib/grade';
import { stripRuby } from '../../lib/ruby';
import type {
  ExerciseResponse,
  GradeResult,
  GrammarExercise,
} from '../../types';
import RubyText from '../RubyText';
import SentenceCard from '../SentenceCard';

interface FeedbackPanelProps {
  exercise: GrammarExercise;
  grade: GradeResult;
  response: ExerciseResponse;
  currentLessonId?: string;
}

const quote = (text: string) => `「${stripRuby(text)}」`;

/** Post-submission feedback: verdict, why, the correct sentence and the rule. */
const FeedbackPanel = forwardRef<HTMLDivElement, FeedbackPanelProps>(
  ({ exercise, grade, response, currentLessonId }, ref) => {
    const t = useTranslations('grammar.exercise');
    const concept = grammarCourse.concepts.find(
      item => item.id === exercise.conceptId,
    );
    const conceptLesson = grammarCourse.lessons.find(
      lesson => lesson.id === concept?.lessonId,
    );

    let detail: string | null = null;
    let yourTiles: string[] | null = null;
    let alsoAccepted: string[] = [];

    if (exercise.type === 'build' || exercise.type === 'reverse') {
      const tiles =
        response.type === 'build' || response.type === 'reverse'
          ? response.tiles
          : [];
      alsoAccepted = exercise.accepted
        .slice(1)
        .map(arrangement => arrangement.join(' '));
      if (!grade.correct) {
        yourTiles = tiles;
        const feedback = describeTileAnswer(exercise, tiles);
        detail =
          feedback.kind === 'used-distractor'
            ? t('feedback.usedDistractor', {
                tiles: feedback.tiles.map(quote).join(' '),
              })
            : feedback.kind === 'missing-tiles'
              ? t('feedback.missingTiles', {
                  tiles: feedback.tiles.map(quote).join(' '),
                })
              : feedback.kind === 'empty'
                ? t('feedback.empty')
                : t('feedback.order');
      }
    } else if (exercise.type === 'particle') {
      alsoAccepted = exercise.accepted.slice(1);
    } else if (exercise.type === 'error') {
      alsoAccepted = exercise.acceptedFixes.slice(1);
      if (!grade.correct) {
        detail = grade.foundError
          ? t('feedback.wrongFix')
          : t('feedback.wrongPart', {
              part: quote(exercise.parts[exercise.errorIndex]),
            });
      }
    }

    return (
      <div
        ref={ref}
        tabIndex={-1}
        role='status'
        aria-live='polite'
        className={cn(
          'flex flex-col gap-3 rounded-2xl border-2 p-4 outline-none',
          grade.correct
            ? 'border-(--main-color)'
            : 'border-(--secondary-color)',
          'bg-(--card-color)',
        )}
      >
        <div className='flex items-center gap-3'>
          <span
            aria-hidden
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
              grade.correct
                ? 'bg-(--main-color) text-(--background-color)'
                : 'bg-(--secondary-color) text-(--background-color)',
            )}
          >
            {grade.correct ? (
              <Check className='h-6 w-6' />
            ) : (
              <X className='h-6 w-6' />
            )}
          </span>
          <span className='text-xl font-semibold'>
            {grade.correct ? t('correct') : t('incorrect')}
          </span>
        </div>

        {detail && <p className='text-(--main-color)'>{detail}</p>}

        {yourTiles && yourTiles.length > 0 && (
          <div className='flex flex-col'>
            <span className='text-sm text-(--secondary-color)'>
              {t('yourAnswer')}
            </span>
            <RubyText
              text={yourTiles.join(' ')}
              className='text-lg text-(--secondary-color) line-through decoration-1'
            />
          </div>
        )}

        <div className='flex flex-col gap-1'>
          <span className='text-sm text-(--secondary-color)'>
            {t('correctAnswer')}
          </span>
          <SentenceCard sentence={exercise.sentence} />
        </div>

        {alsoAccepted.length > 0 && (
          <div className='flex flex-col gap-1'>
            <span className='text-sm text-(--secondary-color)'>
              {t('alsoAccepted')}
            </span>
            <ul className='flex flex-col gap-0.5'>
              {alsoAccepted.slice(0, 5).map(item => (
                <li key={item}>
                  <RubyText text={item} className='text-lg' />
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className='text-(--main-color)'>{exercise.explanation}</p>

        {concept && (
          <p className='text-sm text-(--secondary-color)'>
            <span className='font-semibold'>{t('rule')}:</span>{' '}
            {concept.summary}
            {conceptLesson && conceptLesson.id !== currentLessonId && (
              <>
                {' '}
                <Link
                  href={`/grammar/${conceptLesson.id}`}
                  className='underline underline-offset-2 hover:text-(--main-color)'
                >
                  {t('revisitLesson', { number: conceptLesson.number })}
                </Link>
              </>
            )}
          </p>
        )}
      </div>
    );
  },
);

FeedbackPanel.displayName = 'FeedbackPanel';

export default FeedbackPanel;
