'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/core/i18n/routing';
import { ActionButton } from '@/shared/ui/components/ActionButton';
import { useClick } from '@/shared/hooks/generic/useAudio';
import { grammarCourse } from '../data';
import { REVIEW_CLEAR_STREAK } from '../lib/mastery';
import { buildReviewSession } from '../lib/session';
import { useGrammarHydrated, useGrammarStore } from '../store/useGrammarStore';
import type { GrammarExercise } from '../types';
import DisplayToggles from './DisplayToggles';
import SessionSummary from './SessionSummary';
import ExercisePlayer, {
  type ExerciseResult,
} from './exercises/ExercisePlayer';

type ReviewState =
  | { status: 'intro' }
  | { status: 'running'; run: number; exercises: GrammarExercise[] }
  | { status: 'done'; results: ExerciseResult[] };

/** Practice session built from the learner's review queue. */
const ReviewSession = () => {
  const t = useTranslations('grammar');
  const hydrated = useGrammarHydrated();
  const { playClick } = useClick();
  const reviewQueue = useGrammarStore(state => state.reviewQueue);
  const [state, setState] = useState<ReviewState>({ status: 'intro' });
  const [run, setRun] = useState(0);

  const queued = Object.values(reviewQueue).sort(
    (a, b) => a.addedAt - b.addedAt,
  );

  const start = () => {
    playClick();
    setRun(run + 1);
    setState({
      status: 'running',
      run: run + 1,
      exercises: buildReviewSession(
        grammarCourse,
        useGrammarStore.getState().reviewQueue,
      ),
    });
  };

  return (
    <div className='flex flex-col gap-6'>
      <Link
        href='/grammar'
        className='flex w-fit items-center gap-1 text-(--secondary-color) hover:text-(--main-color)'
        onClick={playClick}
      >
        <ArrowLeft aria-hidden className='h-4 w-4' />
        {t('review.backToDojo')}
      </Link>
      <div className='flex flex-col gap-2'>
        <h2 className='text-3xl'>{t('review.title')}</h2>
        <p className='text-(--secondary-color)'>
          {t('review.clearRule', { count: REVIEW_CLEAR_STREAK })}
        </p>
        <DisplayToggles />
      </div>

      {hydrated && state.status === 'intro' && (
        <>
          {queued.length === 0 ? (
            <p className='rounded-2xl bg-(--card-color) p-4 text-lg'>
              {t('review.empty')}
            </p>
          ) : (
            <div className='flex flex-col gap-4'>
              <p className='text-lg'>
                {t('review.queueCount', { count: queued.length })}
              </p>
              <ul className='grid gap-2 md:grid-cols-2'>
                {queued.map(item => {
                  const concept = grammarCourse.concepts.find(
                    c => c.id === item.conceptId,
                  );
                  const lesson = grammarCourse.lessons.find(
                    l => l.id === concept?.lessonId,
                  );
                  if (!concept) return null;
                  return (
                    <li
                      key={item.conceptId}
                      className='flex flex-col gap-1 rounded-2xl bg-(--card-color) p-4'
                    >
                      <span className='text-lg font-semibold'>
                        {concept.name}
                      </span>
                      <span className='text-(--secondary-color)'>
                        {concept.summary}
                      </span>
                      {lesson && (
                        <Link
                          href={`/grammar/${lesson.id}`}
                          onClick={playClick}
                          className='w-fit text-sm underline underline-offset-2 hover:text-(--main-color)'
                        >
                          {t('review.revisit')}:{' '}
                          {t('dojo.lessonNumber', { number: lesson.number })} ·{' '}
                          {lesson.title}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
              <ActionButton onClick={start} className='sm:max-w-sm'>
                {t('review.start')}
              </ActionButton>
            </div>
          )}
        </>
      )}

      {state.status === 'running' && (
        <ExercisePlayer
          key={`review-${state.run}`}
          exercises={state.exercises}
          mode='review'
          onFinish={results => setState({ status: 'done', results })}
        />
      )}

      {state.status === 'done' && (
        <SessionSummary
          title={t('summary.reviewDone')}
          results={state.results}
          footer={
            <>
              {Object.keys(reviewQueue).length > 0 && (
                <ActionButton onClick={start} className='sm:max-w-xs'>
                  {t('review.start')} ({Object.keys(reviewQueue).length})
                </ActionButton>
              )}
              <ActionButton
                asChild
                colorScheme='secondary'
                borderColorScheme='secondary'
                className='sm:max-w-xs'
              >
                <Link href='/grammar' onClick={playClick}>
                  {t('summary.backToLessons')}
                </Link>
              </ActionButton>
            </>
          }
        />
      )}
    </div>
  );
};

export default ReviewSession;
