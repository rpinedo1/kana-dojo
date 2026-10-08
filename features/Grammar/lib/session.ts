import type { GrammarExercise, GrammarPack, ReviewItem } from '../types';

/** Checkpoint pass mark, as a fraction of exercises answered correctly. */
export const CHECKPOINT_PASS_RATIO = 0.8;

export const REVIEW_SESSION_SIZE = 8;
const REVIEW_PER_CONCEPT = 3;

export function isCheckpointPassed(score: number, total: number): boolean {
  return total > 0 && score / total >= CHECKPOINT_PASS_RATIO;
}

export function createSessionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Builds a review session for concepts in the review queue: previously missed
 * exercises first, then other exercises for the same concept, oldest queued
 * concept first.
 */
export function buildReviewSession(
  pack: GrammarPack,
  queue: Record<string, ReviewItem>,
  limit: number = REVIEW_SESSION_SIZE,
): GrammarExercise[] {
  const all = pack.lessons.flatMap(lesson => [
    ...lesson.practice,
    ...lesson.checkpoint,
  ]);
  const byId = new Map(all.map(exercise => [exercise.id, exercise]));
  const items = Object.values(queue).sort((a, b) => a.addedAt - b.addedAt);
  const picked: GrammarExercise[] = [];
  const pickedIds = new Set<string>();

  for (const item of items) {
    const missed = [...item.missedExerciseIds]
      .reverse()
      .map(id => byId.get(id))
      .filter((exercise): exercise is GrammarExercise => Boolean(exercise));
    const related = all.filter(
      exercise => exercise.conceptId === item.conceptId,
    );
    let count = 0;
    for (const exercise of [...missed, ...related]) {
      if (count >= REVIEW_PER_CONCEPT || picked.length >= limit) break;
      if (pickedIds.has(exercise.id)) continue;
      picked.push(exercise);
      pickedIds.add(exercise.id);
      count += 1;
    }
    if (picked.length >= limit) break;
  }

  return picked;
}

/** Fisher–Yates shuffle that returns a new array. */
export function shuffled<T>(
  items: readonly T[],
  random: () => number = Math.random,
): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
