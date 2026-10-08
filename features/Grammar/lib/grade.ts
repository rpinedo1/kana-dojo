import type {
  ErrorExercise,
  ExerciseResponse,
  GradeResult,
  GrammarExercise,
  RubyText,
  TileExercise,
} from '../types';
import { normalizeJapanese, normalizeTiles } from './normalize';

/** Grades a learner response against an authored exercise. Pure function. */
export function gradeExercise(
  exercise: GrammarExercise,
  response: ExerciseResponse,
): GradeResult {
  switch (exercise.type) {
    case 'meaning':
      return {
        correct:
          response.type === 'meaning' &&
          response.optionId === exercise.correctOptionId,
      };
    case 'particle':
      return {
        correct:
          response.type === 'particle' &&
          exercise.accepted.some(
            particle =>
              normalizeJapanese(particle) ===
              normalizeJapanese(response.particle),
          ),
      };
    case 'build':
    case 'reverse':
      return {
        correct:
          (response.type === 'build' || response.type === 'reverse') &&
          isAcceptedArrangement(exercise, response.tiles),
      };
    case 'error':
      return response.type === 'error'
        ? gradeErrorCorrection(exercise, response.partIndex, response.fix)
        : { correct: false, foundError: false };
  }
}

/**
 * True when the tiles form one of the authored accepted sentences.
 * Comparison is on normalized text, so harmless spacing/punctuation
 * differences and identical-looking tile splits are accepted.
 */
export function isAcceptedArrangement(
  exercise: TileExercise,
  tiles: RubyText[],
): boolean {
  if (tiles.length === 0) return false;
  const answer = normalizeTiles(tiles);
  return exercise.accepted.some(
    arrangement => normalizeTiles(arrangement) === answer,
  );
}

export function gradeErrorCorrection(
  exercise: ErrorExercise,
  partIndex: number,
  fix: RubyText,
): GradeResult {
  const foundError = partIndex === exercise.errorIndex;
  const fixed = exercise.acceptedFixes.some(
    accepted => normalizeJapanese(accepted) === normalizeJapanese(fix),
  );
  return { correct: foundError && fixed, foundError };
}

export type TileFeedbackKind =
  | 'correct'
  | 'empty'
  | 'used-distractor'
  | 'missing-tiles'
  | 'order';

export interface TileFeedback {
  kind: TileFeedbackKind;
  /** Tiles involved (distractors used, or tiles left out) */
  tiles: RubyText[];
}

/**
 * Explains why a tile answer was not accepted so feedback can say more than
 * "wrong". Uses the accepted arrangement closest in tile set to the answer.
 */
export function describeTileAnswer(
  exercise: TileExercise,
  tiles: RubyText[],
): TileFeedback {
  if (tiles.length === 0) return { kind: 'empty', tiles: [] };
  if (isAcceptedArrangement(exercise, tiles)) {
    return { kind: 'correct', tiles: [] };
  }

  const distractors = new Set(exercise.distractors ?? []);
  const usedDistractors = tiles.filter(tile => distractors.has(tile));
  if (usedDistractors.length > 0) {
    return { kind: 'used-distractor', tiles: usedDistractors };
  }

  const missing = exercise.accepted
    .map(arrangement => arrangement.filter(tile => !tiles.includes(tile)))
    .reduce((best, current) => (current.length < best.length ? current : best));
  if (missing.length > 0) return { kind: 'missing-tiles', tiles: missing };

  return { kind: 'order', tiles: [] };
}
