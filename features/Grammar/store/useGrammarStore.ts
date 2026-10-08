'use client';

import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  CheckpointResult,
  ConceptProgress,
  LessonProgress,
  ReviewItem,
} from '../types';
import { recordConceptAttempt, updateReviewQueue } from '../lib/mastery';
import { isCheckpointPassed } from '../lib/session';

/** localStorage key. New key: existing KanaDojo data is never touched. */
export const GRAMMAR_STORAGE_KEY = 'kanadojo-grammar-progress';
export const GRAMMAR_STORE_VERSION = 1;

export interface GrammarProgressData {
  lessons: Record<string, LessonProgress>;
  concepts: Record<string, ConceptProgress>;
  reviewQueue: Record<string, ReviewItem>;
  showRomaji: boolean;
  showFurigana: boolean;
}

export interface AnswerRecord {
  conceptId: string;
  exerciseId: string;
  correct: boolean;
  sessionId: string;
}

interface GrammarState extends GrammarProgressData {
  markLessonStarted: (lessonId: string) => void;
  markLessonRead: (lessonId: string) => void;
  markPracticeCompleted: (lessonId: string) => void;
  recordAnswer: (answer: AnswerRecord) => void;
  recordCheckpoint: (
    lessonId: string,
    score: number,
    total: number,
  ) => CheckpointResult;
  setShowRomaji: (show: boolean) => void;
  setShowFurigana: (show: boolean) => void;
  resetLesson: (lessonId: string) => void;
  resetAll: () => void;
}

export const createDefaultGrammarProgress = (): GrammarProgressData => ({
  lessons: {},
  concepts: {},
  reviewQueue: {},
  showRomaji: false,
  showFurigana: true,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Accepts any persisted value and returns well-formed progress data,
 * dropping anything malformed. Used for migrations and corrupted storage.
 */
export function sanitizeGrammarProgress(value: unknown): GrammarProgressData {
  const defaults = createDefaultGrammarProgress();
  if (!isRecord(value)) return defaults;

  const pickRecord = <T>(
    input: unknown,
    isValid: (item: unknown) => boolean,
  ) => {
    const result: Record<string, T> = {};
    if (!isRecord(input)) return result;
    for (const [key, item] of Object.entries(input)) {
      if (isValid(item)) result[key] = item as T;
    }
    return result;
  };

  return {
    lessons: pickRecord<LessonProgress>(value.lessons, isRecord),
    concepts: pickRecord<ConceptProgress>(
      value.concepts,
      item =>
        isRecord(item) &&
        typeof item.attempts === 'number' &&
        typeof item.correct === 'number' &&
        Array.isArray(item.recent) &&
        Array.isArray(item.correctSessions),
    ),
    reviewQueue: pickRecord<ReviewItem>(
      value.reviewQueue,
      item =>
        isRecord(item) &&
        typeof item.conceptId === 'string' &&
        Array.isArray(item.missedExerciseIds),
    ),
    showRomaji:
      typeof value.showRomaji === 'boolean'
        ? value.showRomaji
        : defaults.showRomaji,
    showFurigana:
      typeof value.showFurigana === 'boolean'
        ? value.showFurigana
        : defaults.showFurigana,
  };
}

/**
 * Migrates persisted state from any earlier version. Version 1 is the first
 * release; future versions add steps here instead of discarding progress.
 */
export function migrateGrammarProgress(
  persisted: unknown,
  _fromVersion: number,
): GrammarProgressData {
  return sanitizeGrammarProgress(persisted);
}

const updateLesson = (
  lessons: Record<string, LessonProgress>,
  lessonId: string,
  patch: (lesson: LessonProgress) => LessonProgress,
) => ({ ...lessons, [lessonId]: patch(lessons[lessonId] ?? {}) });

export const useGrammarStore = create<GrammarState>()(
  persist(
    (set, get) => ({
      ...createDefaultGrammarProgress(),

      markLessonStarted: lessonId =>
        set(state => ({
          lessons: updateLesson(state.lessons, lessonId, lesson =>
            lesson.startedAt ? lesson : { ...lesson, startedAt: Date.now() },
          ),
        })),

      markLessonRead: lessonId =>
        set(state => ({
          lessons: updateLesson(state.lessons, lessonId, lesson => ({
            ...lesson,
            startedAt: lesson.startedAt ?? Date.now(),
            readAt: lesson.readAt ?? Date.now(),
          })),
        })),

      markPracticeCompleted: lessonId =>
        set(state => ({
          lessons: updateLesson(state.lessons, lessonId, lesson => ({
            ...lesson,
            practiceCompletedAt: Date.now(),
          })),
        })),

      recordAnswer: ({ conceptId, exerciseId, correct, sessionId }) => {
        const now = Date.now();
        set(state => ({
          concepts: {
            ...state.concepts,
            [conceptId]: recordConceptAttempt(
              state.concepts[conceptId],
              correct,
              sessionId,
              now,
            ),
          },
          reviewQueue: updateReviewQueue(
            state.reviewQueue,
            conceptId,
            exerciseId,
            correct,
            now,
            sessionId,
          ),
        }));
      },

      recordCheckpoint: (lessonId, score, total) => {
        const now = Date.now();
        const previous = get().lessons[lessonId]?.checkpoint;
        const passed = isCheckpointPassed(score, total);
        const result: CheckpointResult = {
          attempts: (previous?.attempts ?? 0) + 1,
          bestScore: Math.max(previous?.bestScore ?? 0, score),
          lastScore: score,
          total,
          passed: Boolean(previous?.passed) || passed,
          lastAttemptAt: now,
        };
        set(state => ({
          lessons: updateLesson(state.lessons, lessonId, lesson => ({
            ...lesson,
            startedAt: lesson.startedAt ?? now,
            checkpoint: result,
            completedAt: lesson.completedAt ?? (passed ? now : undefined),
          })),
        }));
        return result;
      },

      setShowRomaji: showRomaji => set({ showRomaji }),
      setShowFurigana: showFurigana => set({ showFurigana }),

      resetLesson: lessonId =>
        set(state => {
          const lessons = { ...state.lessons };
          delete lessons[lessonId];
          return { lessons };
        }),

      resetAll: () => set(createDefaultGrammarProgress()),
    }),
    {
      name: GRAMMAR_STORAGE_KEY,
      version: GRAMMAR_STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        lessons: state.lessons,
        concepts: state.concepts,
        reviewQueue: state.reviewQueue,
        showRomaji: state.showRomaji,
        showFurigana: state.showFurigana,
      }),
      migrate: (persisted, version) =>
        migrateGrammarProgress(persisted, version),
      merge: (persisted, current) => ({
        ...current,
        ...sanitizeGrammarProgress(persisted),
      }),
    },
  ),
);

/**
 * True once persisted progress has loaded on the client. Grammar screens
 * render after this so server HTML never disagrees with saved progress.
 */
export function useGrammarHydrated(): boolean {
  return useSyncExternalStore(
    onStoreChange => useGrammarStore.persist.onFinishHydration(onStoreChange),
    () => useGrammarStore.persist.hasHydrated(),
    () => false,
  );
}
