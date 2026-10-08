import type { ConceptProgress, ConceptStatus, ReviewItem } from '../types';

/**
 * Mastery rule (documented in docs/grammar/README.md):
 *
 * A concept is MASTERED when all of the following hold:
 *   1. at least MASTERY_MIN_CORRECT correct answers in total,
 *   2. the most recent MASTERY_RECENT_STREAK attempts are all correct, and
 *   3. correct answers came from at least MASTERY_MIN_SESSIONS separate
 *      practice sessions (a lesson practice run, checkpoint, or review).
 *
 * A single lucky answer, or one long run in a single sitting, is not enough.
 * Mastery is lost again if a later answer is wrong (rule 2).
 */
export const MASTERY_MIN_CORRECT = 4;
export const MASTERY_RECENT_STREAK = 3;
export const MASTERY_MIN_SESSIONS = 2;

/**
 * Review items leave the queue after this many correct answers in a row,
 * counted only in sessions after the one where the concept was missed (so a
 * quick retry right after the explanation does not clear it).
 */
export const REVIEW_CLEAR_STREAK = 2;

const RECENT_CAP = 10;
const SESSION_CAP = 10;

export const createConceptProgress = (): ConceptProgress => ({
  attempts: 0,
  correct: 0,
  recent: [],
  correctSessions: [],
});

export function isMastered(progress: ConceptProgress | undefined): boolean {
  if (!progress) return false;
  if (progress.correct < MASTERY_MIN_CORRECT) return false;
  if (progress.correctSessions.length < MASTERY_MIN_SESSIONS) return false;
  const recent = progress.recent.slice(-MASTERY_RECENT_STREAK);
  return (
    recent.length === MASTERY_RECENT_STREAK &&
    recent.every(attempt => attempt.correct)
  );
}

export function recordConceptAttempt(
  progress: ConceptProgress | undefined,
  correct: boolean,
  sessionId: string,
  at: number,
): ConceptProgress {
  const base = progress ?? createConceptProgress();
  const correctSessions =
    correct && !base.correctSessions.includes(sessionId)
      ? [...base.correctSessions, sessionId].slice(-SESSION_CAP)
      : base.correctSessions;

  const next: ConceptProgress = {
    attempts: base.attempts + 1,
    correct: base.correct + (correct ? 1 : 0),
    recent: [...base.recent, { correct, sessionId, at }].slice(-RECENT_CAP),
    correctSessions,
  };

  const mastered = isMastered(next);
  if (mastered) next.masteredAt = base.masteredAt ?? at;
  return next;
}

export function updateReviewQueue(
  queue: Record<string, ReviewItem>,
  conceptId: string,
  exerciseId: string,
  correct: boolean,
  at: number,
  sessionId: string,
): Record<string, ReviewItem> {
  const existing = queue[conceptId];

  if (!correct) {
    const missedExerciseIds = existing
      ? [
          ...existing.missedExerciseIds.filter(id => id !== exerciseId),
          exerciseId,
        ].slice(-8)
      : [exerciseId];
    return {
      ...queue,
      [conceptId]: {
        conceptId,
        addedAt: existing?.addedAt ?? at,
        missedExerciseIds,
        lastMissSessionId: sessionId,
        correctSinceMiss: 0,
      },
    };
  }

  if (!existing || existing.lastMissSessionId === sessionId) return queue;

  const correctSinceMiss = existing.correctSinceMiss + 1;
  if (correctSinceMiss >= REVIEW_CLEAR_STREAK) {
    const rest = { ...queue };
    delete rest[conceptId];
    return rest;
  }
  return { ...queue, [conceptId]: { ...existing, correctSinceMiss } };
}

export function getConceptStatus(
  progress: ConceptProgress | undefined,
  inReview: boolean,
): ConceptStatus {
  if (inReview) return 'review';
  if (!progress || progress.attempts === 0) return 'new';
  return isMastered(progress) ? 'mastered' : 'learning';
}

export function getAccuracy(progress: ConceptProgress | undefined): number {
  if (!progress || progress.attempts === 0) return 0;
  return Math.round((progress.correct / progress.attempts) * 100);
}
