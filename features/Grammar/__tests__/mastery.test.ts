import { describe, expect, it } from 'vitest';
import {
  getConceptStatus,
  isMastered,
  recordConceptAttempt,
  updateReviewQueue,
} from '../lib/mastery';
import { buildReviewSession, isCheckpointPassed } from '../lib/session';
import { grammarCourse } from '../data';
import type { ConceptProgress } from '../types';

const answer = (
  progress: ConceptProgress | undefined,
  results: Array<[boolean, string]>,
) =>
  results.reduce<ConceptProgress | undefined>(
    (current, [correct, session], i) =>
      recordConceptAttempt(current, correct, session, i),
    progress,
  );

describe('mastery rule', () => {
  it('is not mastered after one correct answer', () => {
    const progress = answer(undefined, [[true, 's1']]);
    expect(isMastered(progress)).toBe(false);
    expect(getConceptStatus(progress, false)).toBe('learning');
  });

  it('is not mastered after many correct answers in a single session', () => {
    const progress = answer(undefined, [
      [true, 's1'],
      [true, 's1'],
      [true, 's1'],
      [true, 's1'],
      [true, 's1'],
    ]);
    expect(isMastered(progress)).toBe(false);
  });

  it('is mastered after repeated correct answers across sessions', () => {
    const progress = answer(undefined, [
      [true, 's1'],
      [true, 's1'],
      [true, 's2'],
      [true, 's2'],
    ]);
    expect(isMastered(progress)).toBe(true);
    expect(progress?.masteredAt).toBeDefined();
    expect(getConceptStatus(progress, false)).toBe('mastered');
  });

  it('requires the most recent attempts to be correct', () => {
    const progress = answer(undefined, [
      [true, 's1'],
      [true, 's1'],
      [true, 's2'],
      [true, 's2'],
      [false, 's3'],
    ]);
    expect(isMastered(progress)).toBe(false);
  });

  it('reports a concept in the review queue as needing review', () => {
    expect(getConceptStatus(answer(undefined, [[false, 's1']]), true)).toBe(
      'review',
    );
    expect(getConceptStatus(undefined, false)).toBe('new');
  });
});

describe('review queue', () => {
  it('adds missed concepts and clears them after two later correct answers in a row', () => {
    let queue = updateReviewQueue({}, 'topic-wa', 'ex1', false, 1, 's1');
    expect(queue['topic-wa'].missedExerciseIds).toEqual(['ex1']);

    queue = updateReviewQueue(queue, 'topic-wa', 'ex2', true, 2, 's2');
    expect(queue['topic-wa'].correctSinceMiss).toBe(1);

    queue = updateReviewQueue(queue, 'topic-wa', 'ex1', false, 3, 's2');
    expect(queue['topic-wa'].correctSinceMiss).toBe(0);

    queue = updateReviewQueue(queue, 'topic-wa', 'ex1', true, 4, 's3');
    queue = updateReviewQueue(queue, 'topic-wa', 'ex2', true, 5, 's3');
    expect(queue['topic-wa']).toBeUndefined();
  });

  it('does not clear a concept with correct answers from the session it was missed in', () => {
    let queue = updateReviewQueue({}, 'topic-wa', 'ex1', false, 1, 's1');
    queue = updateReviewQueue(queue, 'topic-wa', 'ex2', true, 2, 's1');
    queue = updateReviewQueue(queue, 'topic-wa', 'ex3', true, 3, 's1');
    expect(queue['topic-wa'].correctSinceMiss).toBe(0);
  });

  it('ignores correct answers for concepts not in the queue', () => {
    const queue = {};
    expect(updateReviewQueue(queue, 'x', 'ex', true, 1, 's1')).toBe(queue);
  });

  it('builds a review session starting with missed exercises', () => {
    const queue = updateReviewQueue({}, 'wo-object', 'l06-c4', false, 1, 's1');
    const session = buildReviewSession(grammarCourse, queue);
    expect(session[0].id).toBe('l06-c4');
    expect(session.every(exercise => exercise.conceptId === 'wo-object')).toBe(
      true,
    );
    expect(session.length).toBeGreaterThan(1);
    expect(session.length).toBeLessThanOrEqual(3);
  });

  it('returns an empty session for an empty queue', () => {
    expect(buildReviewSession(grammarCourse, {})).toEqual([]);
  });
});

describe('checkpoint pass mark', () => {
  it('requires 80%', () => {
    expect(isCheckpointPassed(4, 5)).toBe(true);
    expect(isCheckpointPassed(3, 5)).toBe(false);
    expect(isCheckpointPassed(0, 0)).toBe(false);
  });
});
