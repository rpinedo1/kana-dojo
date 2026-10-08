import type {
  GrammarExercise,
  GrammarLesson,
  GrammarPack,
  GrammarSentence,
  RubyText,
} from '../types';
import { findRubyProblems } from './ruby';
import { normalizeJapanese, normalizeTiles } from './normalize';

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MIN_PRACTICE = 3;
const MIN_CHECKPOINT = 3;

const sameMultiset = (a: string[], b: string[]) =>
  a.length === b.length &&
  [...a].sort().join('\u0000') === [...b].sort().join('\u0000');

/**
 * Validates a grammar pack's structure and authored answers.
 * Returns a list of human-readable problems; an empty list means valid.
 * Run by the test suite so broken content fails CI instead of confusing
 * learners.
 */
export function validatePack(pack: GrammarPack): string[] {
  const problems: string[] = [];
  const conceptIds = new Set<string>();
  const lessonIds = new Set<string>();
  const exerciseIds = new Set<string>();
  const referenceIds = new Set(pack.references.map(ref => ref.id));
  const exerciseTypes = new Set<string>();

  const checkId = (id: string, where: string) => {
    if (!ID_PATTERN.test(id))
      problems.push(`${where}: id "${id}" must be kebab-case`);
  };
  const checkRuby = (text: RubyText, where: string) => {
    for (const problem of findRubyProblems(text))
      problems.push(`${where}: ${problem}`);
  };
  const checkSentence = (sentence: GrammarSentence, where: string) => {
    checkRuby(sentence.jp, where);
    if (!sentence.en.trim()) problems.push(`${where}: missing English meaning`);
    if (!sentence.romaji.trim()) problems.push(`${where}: missing romaji`);
  };

  for (const concept of pack.concepts) {
    checkId(concept.id, `concept ${concept.id}`);
    if (conceptIds.has(concept.id))
      problems.push(`duplicate concept id ${concept.id}`);
    conceptIds.add(concept.id);
  }

  // Concepts a learner has seen by the time they reach a lesson.
  const introduced = new Set<string>();

  [...pack.lessons]
    .sort((a, b) => a.number - b.number)
    .forEach((lesson, index) => {
      const where = `lesson ${lesson.id}`;
      checkId(lesson.id, where);
      if (lessonIds.has(lesson.id))
        problems.push(`duplicate lesson id ${lesson.id}`);
      if (lesson.number !== index + 1) {
        problems.push(`${where}: lesson numbers must be sequential from 1`);
      }
      for (const prerequisite of lesson.prerequisites) {
        if (!lessonIds.has(prerequisite)) {
          problems.push(
            `${where}: prerequisite ${prerequisite} must be an earlier lesson`,
          );
        }
      }
      lessonIds.add(lesson.id);

      for (const conceptId of lesson.conceptIds) {
        if (!conceptIds.has(conceptId))
          problems.push(`${where}: unknown concept ${conceptId}`);
        introduced.add(conceptId);
      }
      for (const refId of lesson.references) {
        if (!referenceIds.has(refId))
          problems.push(`${where}: unknown reference ${refId}`);
      }

      checkRuby(lesson.titleJa, `${where} title`);
      checkSentence(lesson.pattern.example, `${where} pattern`);
      lesson.examples.forEach((ex, i) =>
        checkSentence(ex, `${where} example ${i}`),
      );
      lesson.breakdown.forEach((part, i) =>
        checkRuby(part.part, `${where} breakdown ${i}`),
      );
      lesson.commonMistakes.forEach((mistake, i) => {
        checkRuby(mistake.wrong, `${where} mistake ${i}`);
        checkRuby(mistake.right, `${where} mistake ${i}`);
      });
      lesson.register?.forEach((pair, i) => {
        checkSentence(pair.polite, `${where} register ${i} polite`);
        checkSentence(pair.casual, `${where} register ${i} casual`);
      });
      lesson.dialogues?.forEach((dialogue, d) =>
        dialogue.lines.forEach((line, i) =>
          checkSentence(line.sentence, `${where} dialogue ${d} line ${i}`),
        ),
      );
      lesson.vocabulary.forEach((word, i) =>
        checkRuby(word.jp, `${where} vocab ${i}`),
      );

      if (lesson.explanation.length === 0)
        problems.push(`${where}: missing explanation`);
      if (lesson.practice.length < MIN_PRACTICE) {
        problems.push(
          `${where}: needs at least ${MIN_PRACTICE} practice exercises`,
        );
      }
      if (lesson.checkpoint.length < MIN_CHECKPOINT) {
        problems.push(
          `${where}: needs at least ${MIN_CHECKPOINT} checkpoint exercises`,
        );
      }

      for (const exercise of [...lesson.practice, ...lesson.checkpoint]) {
        const exWhere = `${where} exercise ${exercise.id}`;
        checkId(exercise.id, exWhere);
        if (exerciseIds.has(exercise.id))
          problems.push(`duplicate exercise id ${exercise.id}`);
        exerciseIds.add(exercise.id);
        exerciseTypes.add(exercise.type);
        if (!conceptIds.has(exercise.conceptId)) {
          problems.push(`${exWhere}: unknown concept ${exercise.conceptId}`);
        } else if (!introduced.has(exercise.conceptId)) {
          problems.push(
            `${exWhere}: concept ${exercise.conceptId} is tested before it is taught`,
          );
        }
        if (!exercise.explanation.trim())
          problems.push(`${exWhere}: missing explanation`);
        problems.push(
          ...validateExercise(exercise, exWhere, checkRuby, checkSentence),
        );
      }
      for (const exercise of lesson.checkpoint) {
        if (exercise.hint)
          problems.push(
            `${where}: checkpoint ${exercise.id} must not have a hint`,
          );
      }
    });

  for (const concept of pack.concepts) {
    if (!lessonIds.has(concept.lessonId)) {
      problems.push(
        `concept ${concept.id}: unknown lesson ${concept.lessonId}`,
      );
    }
  }
  for (const type of ['meaning', 'particle', 'build', 'reverse', 'error']) {
    if (!exerciseTypes.has(type)) problems.push(`pack has no ${type} exercise`);
  }

  return problems;
}

function validateExercise(
  exercise: GrammarExercise,
  where: string,
  checkRuby: (text: RubyText, where: string) => void,
  checkSentence: (sentence: GrammarSentence, where: string) => void,
): string[] {
  const problems: string[] = [];

  switch (exercise.type) {
    case 'meaning': {
      checkSentence(exercise.sentence, where);
      const ids = exercise.options.map(option => option.id);
      if (exercise.options.length < 2)
        problems.push(`${where}: needs 2+ options`);
      if (new Set(ids).size !== ids.length)
        problems.push(`${where}: duplicate option ids`);
      if (!ids.includes(exercise.correctOptionId)) {
        problems.push(`${where}: correctOptionId not in options`);
      }
      break;
    }
    case 'particle': {
      checkSentence(exercise.sentence, where);
      checkRuby(exercise.before, where);
      checkRuby(exercise.after, where);
      if (exercise.options.length < 2)
        problems.push(`${where}: needs 2+ options`);
      if (exercise.accepted.length === 0)
        problems.push(`${where}: no accepted particle`);
      for (const particle of exercise.accepted) {
        if (!exercise.options.includes(particle)) {
          problems.push(
            `${where}: accepted particle ${particle} not in options`,
          );
        }
      }
      if (!exercise.context.trim())
        problems.push(`${where}: missing disambiguating context`);
      const completed = normalizeJapanese(
        exercise.before + (exercise.accepted[0] ?? '') + exercise.after,
      );
      if (completed !== normalizeJapanese(exercise.sentence.jp)) {
        problems.push(
          `${where}: before + accepted[0] + after must equal sentence`,
        );
      }
      break;
    }
    case 'build':
    case 'reverse': {
      checkSentence(exercise.sentence, where);
      const bank = [...exercise.tiles, ...(exercise.distractors ?? [])];
      bank.forEach(tile => checkRuby(tile, where));
      if (new Set(bank).size !== bank.length)
        problems.push(`${where}: duplicate tiles`);
      if (!exercise.constraint.trim())
        problems.push(`${where}: missing constraint`);
      if (exercise.accepted.length === 0)
        problems.push(`${where}: no accepted arrangement`);
      const seen = new Set<string>();
      for (const arrangement of exercise.accepted) {
        if (!sameMultiset(arrangement, exercise.tiles)) {
          problems.push(
            `${where}: arrangement "${arrangement.join(' ')}" must use every tile exactly once`,
          );
        }
        const key = normalizeTiles(arrangement);
        if (seen.has(key))
          problems.push(
            `${where}: duplicate arrangement "${arrangement.join(' ')}"`,
          );
        seen.add(key);
      }
      if (
        exercise.accepted[0] &&
        normalizeTiles(exercise.accepted[0]) !==
          normalizeJapanese(exercise.sentence.jp)
      ) {
        problems.push(
          `${where}: first arrangement must match the feedback sentence`,
        );
      }
      if (exercise.type === 'build' && exercise.distractors?.length) {
        problems.push(
          `${where}: build exercises use all tiles; use reverse for distractors`,
        );
      }
      break;
    }
    case 'error': {
      checkSentence(exercise.sentence, where);
      exercise.parts.forEach(part => checkRuby(part, where));
      exercise.fixOptions.forEach(option => checkRuby(option, where));
      if (
        exercise.errorIndex < 0 ||
        exercise.errorIndex >= exercise.parts.length
      ) {
        problems.push(`${where}: errorIndex out of range`);
        break;
      }
      if (exercise.acceptedFixes.length === 0)
        problems.push(`${where}: no accepted fix`);
      for (const fix of exercise.acceptedFixes) {
        if (!exercise.fixOptions.includes(fix)) {
          problems.push(`${where}: accepted fix ${fix} not in fixOptions`);
        }
      }
      if (
        exercise.acceptedFixes.includes(exercise.parts[exercise.errorIndex])
      ) {
        problems.push(
          `${where}: the mistaken part cannot also be an accepted fix`,
        );
      }
      const corrected = exercise.parts.map((part, i) =>
        i === exercise.errorIndex ? (exercise.acceptedFixes[0] ?? '') : part,
      );
      if (
        normalizeTiles(corrected) !== normalizeJapanese(exercise.sentence.jp)
      ) {
        problems.push(
          `${where}: applying acceptedFixes[0] must produce the sentence`,
        );
      }
      break;
    }
  }

  return problems;
}

/** All exercises in a pack keyed by id. */
export function indexExercises(
  pack: GrammarPack,
): Map<string, GrammarExercise> {
  const map = new Map<string, GrammarExercise>();
  for (const lesson of pack.lessons) {
    for (const exercise of [...lesson.practice, ...lesson.checkpoint]) {
      map.set(exercise.id, exercise);
    }
  }
  return map;
}

export function findLesson(
  pack: GrammarPack,
  lessonId: string,
): GrammarLesson | undefined {
  return pack.lessons.find(lesson => lesson.id === lessonId);
}
