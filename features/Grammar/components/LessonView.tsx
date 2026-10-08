'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/core/i18n/routing';
import { cn } from '@/shared/utils/utils';
import { ActionButton } from '@/shared/ui/components/ActionButton';
import { useClick } from '@/shared/hooks/generic/useAudio';
import { grammarCourse } from '../data';
import { CHECKPOINT_PASS_RATIO, isCheckpointPassed } from '../lib/session';
import { useGrammarHydrated, useGrammarStore } from '../store/useGrammarStore';
import DisplayToggles from './DisplayToggles';
import LessonLearn from './LessonLearn';
import RubyText from './RubyText';
import SessionSummary from './SessionSummary';
import ExercisePlayer, {
  type ExerciseResult,
} from './exercises/ExercisePlayer';

type Tab = 'learn' | 'practice' | 'checkpoint';
type RunState =
  | { status: 'intro' }
  | { status: 'running'; run: number }
  | { status: 'done'; results: ExerciseResult[] };

const TABS: Tab[] = ['learn', 'practice', 'checkpoint'];
const PASS_PERCENT = Math.round(CHECKPOINT_PASS_RATIO * 100);

/** A single lesson: read the explanation, practise, then take the checkpoint. */
const LessonView = ({ lessonId }: { lessonId: string }) => {
  const t = useTranslations('grammar');
  const hydrated = useGrammarHydrated();
  const { playClick } = useClick();
  const markLessonStarted = useGrammarStore(state => state.markLessonStarted);
  const markLessonRead = useGrammarStore(state => state.markLessonRead);
  const markPracticeCompleted = useGrammarStore(
    state => state.markPracticeCompleted,
  );
  const recordCheckpoint = useGrammarStore(state => state.recordCheckpoint);
  const progress = useGrammarStore(state => state.lessons[lessonId]);

  const [tab, setTab] = useState<Tab>('learn');
  const [practice, setPractice] = useState<RunState>({ status: 'intro' });
  const [checkpoint, setCheckpoint] = useState<RunState>({ status: 'intro' });
  const [runCounter, setRunCounter] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const lesson = grammarCourse.lessons.find(item => item.id === lessonId);
  const nextLesson = lesson
    ? grammarCourse.lessons.find(item => item.number === lesson.number + 1)
    : undefined;

  useEffect(() => {
    if (hydrated && lesson) markLessonStarted(lesson.id);
  }, [hydrated, lesson, markLessonStarted]);

  if (!lesson) return <p>{t('lesson.notFound')}</p>;

  const switchTab = (next: Tab) => {
    playClick();
    setTab(next);
    if (next !== 'learn') markLessonRead(lesson.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    requestAnimationFrame(() => panelRef.current?.focus());
  };

  const startRun = (setter: (state: RunState) => void) => {
    playClick();
    setRunCounter(counter => counter + 1);
    setter({ status: 'running', run: runCounter + 1 });
  };

  const statusLabel = progress?.completedAt
    ? t('status.completed')
    : progress?.startedAt
      ? t('status.inProgress')
      : t('status.notStarted');

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-3'>
        <Link
          href='/grammar'
          className='flex w-fit items-center gap-1 text-(--secondary-color) hover:text-(--main-color)'
          onClick={playClick}
        >
          <ArrowLeft aria-hidden className='h-4 w-4' />
          {t('lesson.back')}
        </Link>
        <div className='flex flex-col gap-1'>
          <span className='text-sm text-(--secondary-color) uppercase'>
            {t('dojo.lessonNumber', { number: lesson.number })} ·{' '}
            {hydrated ? statusLabel : ''}
          </span>
          <h2 className='text-3xl'>{lesson.title}</h2>
          <RubyText
            text={lesson.titleJa}
            className='text-xl text-(--secondary-color)'
          />
          <p className='text-lg text-(--secondary-color)'>{lesson.summary}</p>
        </div>
        <DisplayToggles />
      </div>

      <div
        role='tablist'
        aria-label={lesson.title}
        className='flex w-full gap-1 rounded-2xl bg-(--card-color) p-1'
      >
        {TABS.map(item => (
          <button
            key={item}
            type='button'
            role='tab'
            id={`tab-${item}`}
            aria-selected={tab === item}
            aria-controls={`panel-${item}`}
            onClick={() => switchTab(item)}
            className={cn(
              'flex-1 cursor-pointer rounded-xl px-2 py-2.5 text-base transition-colors md:text-lg',
              'focus-visible:ring-2 focus-visible:ring-(--main-color) focus-visible:outline-none',
              tab === item
                ? 'bg-(--main-color) text-(--background-color)'
                : 'text-(--secondary-color) hover:text-(--main-color)',
            )}
          >
            {t(`lesson.${item}`)}
          </button>
        ))}
      </div>

      <div
        ref={panelRef}
        tabIndex={-1}
        role='tabpanel'
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className='outline-none'
      >
        {tab === 'learn' && (
          <div className='flex flex-col gap-8'>
            <LessonLearn lesson={lesson} />
            <ActionButton
              onClick={() => {
                switchTab('practice');
                startRun(setPractice);
              }}
              className='sm:max-w-sm'
            >
              {t('lesson.startPractice')}
            </ActionButton>
          </div>
        )}

        {tab === 'practice' && hydrated && (
          <>
            {practice.status === 'intro' && (
              <div className='flex flex-col gap-4'>
                <p className='rounded-2xl bg-(--card-color) p-4 text-lg'>
                  {t('lesson.practiceIntro')}
                </p>
                <ActionButton
                  onClick={() => startRun(setPractice)}
                  className='sm:max-w-sm'
                >
                  {t('lesson.startPractice')}
                </ActionButton>
              </div>
            )}
            {practice.status === 'running' && (
              <>
                <p className='mb-4 text-(--secondary-color)'>
                  {t('lesson.practiceIntro')}
                </p>
                <ExercisePlayer
                  key={`practice-${practice.run}`}
                  exercises={lesson.practice}
                  mode='practice'
                  lessonId={lesson.id}
                  onFinish={results => {
                    markPracticeCompleted(lesson.id);
                    setPractice({ status: 'done', results });
                  }}
                />
              </>
            )}
            {practice.status === 'done' && (
              <SessionSummary
                title={t('summary.practiceDone')}
                results={practice.results}
                footer={
                  <>
                    <ActionButton
                      onClick={() => {
                        switchTab('checkpoint');
                        startRun(setCheckpoint);
                      }}
                      className='sm:max-w-xs'
                    >
                      {t('summary.goToCheckpoint')}
                    </ActionButton>
                    <ActionButton
                      colorScheme='secondary'
                      borderColorScheme='secondary'
                      onClick={() => startRun(setPractice)}
                      className='sm:max-w-xs'
                    >
                      {t('summary.retry')}
                    </ActionButton>
                  </>
                }
              />
            )}
          </>
        )}

        {tab === 'checkpoint' && hydrated && (
          <>
            {checkpoint.status === 'intro' && (
              <div className='flex flex-col gap-4'>
                <p className='rounded-2xl bg-(--card-color) p-4 text-lg'>
                  {t('lesson.checkpointIntro', {
                    count: lesson.checkpoint.length,
                    percent: PASS_PERCENT,
                  })}
                </p>
                {progress?.checkpoint && (
                  <p className='text-(--secondary-color)'>
                    {t('dojo.bestScore', {
                      score: progress.checkpoint.bestScore,
                      total: progress.checkpoint.total,
                    })}
                  </p>
                )}
                <ActionButton
                  onClick={() => startRun(setCheckpoint)}
                  className='sm:max-w-sm'
                >
                  {t('lesson.startCheckpoint')}
                </ActionButton>
              </div>
            )}
            {checkpoint.status === 'running' && (
              <>
                <p className='mb-4 text-(--secondary-color)'>
                  {t('lesson.checkpointIntro', {
                    count: lesson.checkpoint.length,
                    percent: PASS_PERCENT,
                  })}
                </p>
                <ExercisePlayer
                  key={`checkpoint-${checkpoint.run}`}
                  exercises={lesson.checkpoint}
                  mode='checkpoint'
                  lessonId={lesson.id}
                  onFinish={results => {
                    recordCheckpoint(
                      lesson.id,
                      results.filter(result => result.correct).length,
                      results.length,
                    );
                    setCheckpoint({ status: 'done', results });
                  }}
                />
              </>
            )}
            {checkpoint.status === 'done' && (
              <SessionSummary
                title={
                  isCheckpointPassed(
                    checkpoint.results.filter(result => result.correct).length,
                    checkpoint.results.length,
                  )
                    ? t('summary.checkpointPassed')
                    : t('summary.checkpointFailed')
                }
                results={checkpoint.results}
                footer={
                  <>
                    {nextLesson && (
                      <ActionButton asChild className='sm:max-w-xs'>
                        <Link
                          href={`/grammar/${nextLesson.id}`}
                          onClick={playClick}
                        >
                          {t('summary.nextLesson')}
                        </Link>
                      </ActionButton>
                    )}
                    <ActionButton
                      colorScheme='secondary'
                      borderColorScheme='secondary'
                      onClick={() => startRun(setCheckpoint)}
                      className='sm:max-w-xs'
                    >
                      {t('summary.retry')}
                    </ActionButton>
                    <ActionButton
                      colorScheme='secondary'
                      borderColorScheme='secondary'
                      onClick={() => switchTab('learn')}
                      className='sm:max-w-xs'
                    >
                      {t('summary.reread')}
                    </ActionButton>
                  </>
                }
              >
                <p className='text-(--secondary-color)'>
                  {t('summary.passMark', { percent: PASS_PERCENT })}
                </p>
              </SessionSummary>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LessonView;
