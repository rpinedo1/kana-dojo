'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Lightbulb } from 'lucide-react';
import { ActionButton } from '@/shared/ui/components/ActionButton';
import {
  useClick,
  useCorrect,
  useError,
} from '@/shared/hooks/generic/useAudio';
import { gradeExercise } from '../../lib/grade';
import { createSessionId } from '../../lib/session';
import { useGrammarStore } from '../../store/useGrammarStore';
import type {
  ExerciseResponse,
  GradeResult,
  GrammarExercise,
} from '../../types';
import ErrorView from './ErrorView';
import FeedbackPanel from './FeedbackPanel';
import MeaningView from './MeaningView';
import ParticleView from './ParticleView';
import TileBuilderView from './TileBuilderView';

export type PlayerMode = 'practice' | 'checkpoint' | 'review';

export interface ExerciseResult {
  exercise: GrammarExercise;
  /** First-attempt correctness (what progress tracking records) */
  correct: boolean;
}

interface ExercisePlayerProps {
  exercises: GrammarExercise[];
  mode: PlayerMode;
  lessonId?: string;
  onFinish: (results: ExerciseResult[]) => void;
}

/**
 * Runs a sequence of exercises: answer → check → feedback → continue.
 * Each exercise's first submission is recorded for concept accuracy, mastery
 * and the review queue. Practice mode allows hints and retries.
 */
const ExercisePlayer = ({
  exercises,
  mode,
  lessonId,
  onFinish,
}: ExercisePlayerProps) => {
  const t = useTranslations('grammar.exercise');
  const recordAnswer = useGrammarStore(state => state.recordAnswer);
  const { playClick } = useClick();
  const { playCorrect } = useCorrect();
  const { playError } = useError();

  const [sessionId] = useState(createSessionId);
  const [index, setIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [response, setResponse] = useState<ExerciseResponse | null>(null);
  const [grade, setGrade] = useState<GradeResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState<ExerciseResult[]>([]);

  const feedbackRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const isFirstQuestion = useRef(true);

  const exercise = exercises[index];
  const allowRetry = mode === 'practice';

  useEffect(() => {
    if (grade) feedbackRef.current?.focus();
  }, [grade]);

  useEffect(() => {
    if (isFirstQuestion.current) {
      isFirstQuestion.current = false;
      return;
    }
    questionRef.current?.focus();
  }, [index]);

  if (!exercise) return null;

  const check = () => {
    if (!response) return;
    const result = gradeExercise(exercise, response);
    setGrade(result);
    if (result.correct) playCorrect();
    else playError();

    if (attempt === 0) {
      recordAnswer({
        conceptId: exercise.conceptId,
        exerciseId: exercise.id,
        correct: result.correct,
        sessionId,
      });
      setResults(previous => [
        ...previous,
        { exercise, correct: result.correct },
      ]);
    }
  };

  const retry = () => {
    playClick();
    setAttempt(previous => previous + 1);
    setResponse(null);
    setGrade(null);
  };

  const next = () => {
    playClick();
    if (index + 1 >= exercises.length) {
      onFinish(results);
      return;
    }
    setIndex(index + 1);
    setAttempt(0);
    setResponse(null);
    setGrade(null);
    setShowHint(false);
  };

  const viewProps = {
    checked: grade !== null,
    grade,
    onChange: setResponse,
  };

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between text-sm text-(--secondary-color)'>
          <span>
            {t('progress', { current: index + 1, total: exercises.length })}
          </span>
          <span>{t(`types.${exercise.type}`)}</span>
        </div>
        <div
          className='h-2 w-full overflow-hidden rounded-full bg-(--card-color)'
          role='progressbar'
          aria-valuemin={0}
          aria-valuemax={exercises.length}
          aria-valuenow={index + (grade ? 1 : 0)}
          aria-label={t('progress', {
            current: index + 1,
            total: exercises.length,
          })}
        >
          <div
            className='h-full rounded-full bg-(--main-color) transition-all duration-300'
            style={{
              width: `${((index + (grade ? 1 : 0)) / exercises.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <h3
        ref={questionRef}
        tabIndex={-1}
        className='text-xl outline-none md:text-2xl'
      >
        {exercise.instruction}
      </h3>

      <div key={`${exercise.id}-${attempt}`}>
        {exercise.type === 'meaning' && (
          <MeaningView exercise={exercise} {...viewProps} />
        )}
        {exercise.type === 'particle' && (
          <ParticleView exercise={exercise} {...viewProps} />
        )}
        {(exercise.type === 'build' || exercise.type === 'reverse') && (
          <TileBuilderView exercise={exercise} {...viewProps} />
        )}
        {exercise.type === 'error' && (
          <ErrorView exercise={exercise} {...viewProps} />
        )}
      </div>

      {mode === 'practice' && exercise.hint && !grade && (
        <div>
          {showHint ? (
            <p className='flex items-start gap-2 rounded-xl bg-(--card-color) p-3 text-(--secondary-color)'>
              <Lightbulb aria-hidden className='mt-0.5 h-4 w-4 shrink-0' />
              <span>
                <span className='font-semibold'>{t('hint')}:</span>{' '}
                {exercise.hint}
              </span>
            </p>
          ) : (
            <button
              type='button'
              onClick={() => {
                playClick();
                setShowHint(true);
              }}
              className='flex cursor-pointer items-center gap-1 text-sm text-(--secondary-color) underline-offset-2 hover:text-(--main-color) hover:underline focus-visible:ring-2 focus-visible:ring-(--main-color) focus-visible:outline-none'
            >
              <Lightbulb aria-hidden className='h-4 w-4' />
              {t('showHint')}
            </button>
          )}
        </div>
      )}

      {grade && response && (
        <FeedbackPanel
          ref={feedbackRef}
          exercise={exercise}
          grade={grade}
          response={response}
          currentLessonId={lessonId}
        />
      )}

      <div className='flex flex-col gap-2 sm:flex-row'>
        {!grade ? (
          <ActionButton
            onClick={check}
            disabled={!response}
            borderBottomThickness={6}
            className='disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-xs'
          >
            {t('check')}
          </ActionButton>
        ) : (
          <>
            {allowRetry && !grade.correct && (
              <ActionButton
                onClick={retry}
                colorScheme='secondary'
                borderColorScheme='secondary'
                borderBottomThickness={6}
                className='sm:max-w-xs'
              >
                {t('tryAgain')}
              </ActionButton>
            )}
            <ActionButton
              onClick={next}
              borderBottomThickness={6}
              className='sm:max-w-xs'
            >
              {t('continue')}
            </ActionButton>
          </>
        )}
      </div>
    </div>
  );
};

export default ExercisePlayer;
