'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';
import { Link } from '@/core/i18n/routing';
import { cn } from '@/shared/utils/utils';
import { ActionButton } from '@/shared/ui/components/ActionButton';
import { useClick } from '@/shared/hooks/generic/useAudio';
import Info from '@/shared/ui-composite/Menu/Info';
import { grammarCourse } from '../data';
import {
  MASTERY_MIN_CORRECT,
  MASTERY_MIN_SESSIONS,
  MASTERY_RECENT_STREAK,
  REVIEW_CLEAR_STREAK,
  getAccuracy,
  getConceptStatus,
} from '../lib/mastery';
import { useGrammarHydrated, useGrammarStore } from '../store/useGrammarStore';
import type { ConceptStatus } from '../types';
import DisplayToggles from './DisplayToggles';
import RubyText from './RubyText';

const statusTone: Record<ConceptStatus, string> = {
  new: 'border border-(--border-color) text-(--secondary-color)',
  learning: 'bg-(--secondary-color) text-(--background-color)',
  review: 'border-2 border-(--secondary-color) text-(--main-color)',
  mastered: 'bg-(--main-color) text-(--background-color)',
};

const StatTile = ({ label, value }: { label: string; value: string }) => (
  <div className='flex flex-1 flex-col rounded-2xl bg-(--card-color) px-4 py-3'>
    <span className='text-2xl font-semibold md:text-3xl'>{value}</span>
    <span className='text-sm text-(--secondary-color)'>{label}</span>
  </div>
);

/** Grammar dojo home: course progress, review queue and the lesson list. */
const GrammarDojo = () => {
  const t = useTranslations('grammar');
  const hydrated = useGrammarHydrated();
  const { playClick } = useClick();
  const lessons = useGrammarStore(state => state.lessons);
  const concepts = useGrammarStore(state => state.concepts);
  const reviewQueue = useGrammarStore(state => state.reviewQueue);
  const resetAll = useGrammarStore(state => state.resetAll);

  const course = grammarCourse;
  const completedCount = course.lessons.filter(
    lesson => lessons[lesson.id]?.completedAt,
  ).length;
  const masteredCount = course.concepts.filter(
    concept => getConceptStatus(concepts[concept.id], false) === 'mastered',
  ).length;
  const reviewCount = Object.keys(reviewQueue).length;
  const nextLesson = course.lessons.find(
    lesson => !lessons[lesson.id]?.completedAt,
  );
  const lessonNumberById = useMemo(
    () => new Map(course.lessons.map(lesson => [lesson.id, lesson.number])),
    [course],
  );

  return (
    <div className='flex flex-col gap-6'>
      <Info />

      <div
        className={cn(
          'flex flex-col gap-4 transition-opacity',
          !hydrated && 'opacity-0',
        )}
      >
        <div className='flex flex-col gap-1'>
          <h3 className='text-2xl'>{course.title}</h3>
          <p className='text-(--secondary-color)'>{course.description}</p>
          <p className='text-sm text-(--secondary-color)'>
            {t('dojo.courseLevel', { level: course.level })} ·{' '}
            {t('dojo.localNotice')}
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          <StatTile
            label={t('dojo.lessonsCompleted')}
            value={`${completedCount}/${course.lessons.length}`}
          />
          <StatTile
            label={t('dojo.conceptsMastered')}
            value={`${masteredCount}/${course.concepts.length}`}
          />
          <StatTile label={t('dojo.toReview')} value={String(reviewCount)} />
        </div>

        <div className='flex flex-col gap-2 sm:flex-row'>
          {nextLesson ? (
            <ActionButton asChild className='sm:max-w-sm'>
              <Link href={`/grammar/${nextLesson.id}`} onClick={playClick}>
                {completedCount === 0 && !lessons[nextLesson.id]?.startedAt
                  ? t('dojo.startCourse')
                  : t('dojo.continue', { number: nextLesson.number })}
                <ChevronRight aria-hidden className='h-5 w-5' />
              </Link>
            </ActionButton>
          ) : (
            <p className='rounded-2xl bg-(--card-color) p-4'>
              {t('dojo.allComplete')}
            </p>
          )}
          {reviewCount > 0 && (
            <ActionButton
              asChild
              colorScheme='secondary'
              borderColorScheme='secondary'
              className='sm:max-w-sm'
            >
              <Link href='/grammar/review' onClick={playClick}>
                {t('review.start')} ({reviewCount})
              </Link>
            </ActionButton>
          )}
        </div>

        <DisplayToggles />
      </div>

      <section
        aria-labelledby='grammar-lessons'
        className='flex flex-col gap-3'
      >
        <h3 id='grammar-lessons' className='text-2xl'>
          {t('dojo.lessons')}
        </h3>
        <ol className='grid gap-3 md:grid-cols-2'>
          {course.lessons.map(lesson => {
            const progress = hydrated ? lessons[lesson.id] : undefined;
            const missingPrerequisite = lesson.prerequisites.find(
              id => !lessons[id]?.completedAt,
            );
            const status = progress?.completedAt
              ? 'completed'
              : progress?.startedAt
                ? 'inProgress'
                : 'notStarted';
            return (
              <li key={lesson.id}>
                <Link
                  href={`/grammar/${lesson.id}`}
                  onClick={playClick}
                  className={cn(
                    'group flex h-full items-start gap-4 rounded-2xl bg-(--card-color) p-4',
                    'border-b-4 border-(--border-color) transition-colors hover:border-(--main-color)/80',
                    'focus-visible:ring-2 focus-visible:ring-(--main-color) focus-visible:outline-none',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-b-6 text-xl',
                      status === 'completed'
                        ? 'border-(--main-color-accent) bg-(--main-color) text-(--background-color)'
                        : 'border-(--secondary-color-accent) bg-(--secondary-color) text-(--background-color) group-hover:border-(--main-color-accent) group-hover:bg-(--main-color)',
                    )}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 className='h-6 w-6' />
                    ) : (
                      lesson.number
                    )}
                  </span>
                  <span className='flex min-w-0 flex-col gap-1'>
                    <span className='text-sm text-(--secondary-color)'>
                      {t('dojo.lessonNumber', { number: lesson.number })}
                      {hydrated && ` · ${t(`status.${status}`)}`}
                    </span>
                    <span className='text-xl'>{lesson.title}</span>
                    <RubyText
                      text={lesson.titleJa}
                      className='text-(--secondary-color)'
                      showFurigana={false}
                    />
                    <span className='text-sm text-(--secondary-color)'>
                      {lesson.summary}
                    </span>
                    {progress?.checkpoint && (
                      <span className='text-sm text-(--main-color)'>
                        {t('dojo.bestScore', {
                          score: progress.checkpoint.bestScore,
                          total: progress.checkpoint.total,
                        })}
                      </span>
                    )}
                    {hydrated &&
                      missingPrerequisite &&
                      !progress?.startedAt && (
                        <span className='text-xs text-(--secondary-color) italic'>
                          {t('dojo.recommendedAfter', {
                            number:
                              lessonNumberById.get(missingPrerequisite) ?? 0,
                          })}
                        </span>
                      )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {hydrated && (
        <section
          aria-labelledby='grammar-concepts'
          className='flex flex-col gap-3'
        >
          <h3 id='grammar-concepts' className='text-2xl'>
            {t('dojo.conceptProgress')}
          </h3>
          <p className='text-sm text-(--secondary-color)'>
            {t('dojo.conceptProgressHint', {
              minCorrect: MASTERY_MIN_CORRECT,
              minSessions: MASTERY_MIN_SESSIONS,
              streak: MASTERY_RECENT_STREAK,
            })}{' '}
            {t('review.clearRule', { count: REVIEW_CLEAR_STREAK })}
          </p>
          <ul className='grid gap-2 md:grid-cols-2'>
            {course.concepts.map(concept => {
              const progress = concepts[concept.id];
              const status = getConceptStatus(
                progress,
                Boolean(reviewQueue[concept.id]),
              );
              const accuracy = getAccuracy(progress);
              return (
                <li
                  key={concept.id}
                  className='flex flex-col gap-2 rounded-2xl bg-(--card-color) p-3'
                >
                  <div className='flex items-center justify-between gap-2'>
                    <span className='font-semibold'>
                      <RubyText text={concept.name} showFurigana={false} />
                    </span>
                    <span
                      className={cn(
                        'rounded-lg px-2 py-0.5 text-xs',
                        statusTone[status],
                      )}
                    >
                      {t(`status.${status}`)}
                    </span>
                  </div>
                  <div
                    className='h-2 overflow-hidden rounded-full bg-(--background-color)'
                    role='progressbar'
                    aria-label={concept.name}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={accuracy}
                  >
                    <div
                      className='h-full rounded-full bg-(--main-color)'
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                  <span className='text-xs text-(--secondary-color)'>
                    {progress?.attempts
                      ? t('dojo.accuracy', {
                          accuracy,
                          correct: progress.correct,
                          attempts: progress.attempts,
                        })
                      : t('dojo.notPracticed')}
                  </span>
                </li>
              );
            })}
          </ul>

          <button
            type='button'
            onClick={() => {
              if (window.confirm(t('dojo.resetConfirm'))) {
                playClick();
                resetAll();
              }
            }}
            className='flex w-fit cursor-pointer items-center gap-1 text-sm text-(--secondary-color) hover:text-(--main-color) focus-visible:ring-2 focus-visible:ring-(--main-color) focus-visible:outline-none'
          >
            <RotateCcw aria-hidden className='h-4 w-4' />
            {t('dojo.resetProgress')}
          </button>
        </section>
      )}
    </div>
  );
};

export default GrammarDojo;
