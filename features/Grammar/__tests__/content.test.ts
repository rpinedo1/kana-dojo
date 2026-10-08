import { describe, expect, it } from 'vitest';
import { grammarPacks } from '../data';
import { validatePack } from '../lib/validate';
import { gradeExercise } from '../lib/grade';
import type { GrammarExercise, GrammarPack } from '../types';

const modelResponse = (exercise: GrammarExercise) => {
  switch (exercise.type) {
    case 'meaning':
      return { type: 'meaning' as const, optionId: exercise.correctOptionId };
    case 'particle':
      return { type: 'particle' as const, particle: exercise.accepted[0] };
    case 'build':
    case 'reverse':
      return { type: exercise.type, tiles: exercise.accepted[0] };
    case 'error':
      return {
        type: 'error' as const,
        partIndex: exercise.errorIndex,
        fix: exercise.acceptedFixes[0],
      };
  }
};

describe.each(grammarPacks.map(pack => [pack.id, pack] as const))(
  'grammar pack %s',
  (_id, pack: GrammarPack) => {
    it('passes content validation', () => {
      expect(validatePack(pack)).toEqual([]);
    });

    it('has about ten lessons in order', () => {
      expect(pack.lessons.map(lesson => lesson.number)).toEqual(
        pack.lessons.map((_, i) => i + 1),
      );
    });

    it('every lesson has the required teaching sections', () => {
      for (const lesson of pack.lessons) {
        expect(lesson.explanation.length, lesson.id).toBeGreaterThan(0);
        expect(lesson.breakdown.length, lesson.id).toBeGreaterThan(0);
        expect(lesson.pronunciationNotes.length, lesson.id).toBeGreaterThan(0);
        expect(lesson.commonMistakes.length, lesson.id).toBeGreaterThan(0);
        expect(lesson.pattern.example.pronunciation, lesson.id).toBeTruthy();
      }
    });

    it('every authored model answer grades as correct', () => {
      for (const lesson of pack.lessons) {
        for (const exercise of [...lesson.practice, ...lesson.checkpoint]) {
          expect(
            gradeExercise(exercise, modelResponse(exercise)).correct,
            exercise.id,
          ).toBe(true);
        }
      }
    });

    it('every accepted arrangement grades as correct', () => {
      for (const lesson of pack.lessons) {
        for (const exercise of [...lesson.practice, ...lesson.checkpoint]) {
          if (exercise.type !== 'build' && exercise.type !== 'reverse')
            continue;
          for (const arrangement of exercise.accepted) {
            expect(
              gradeExercise(exercise, {
                type: exercise.type,
                tiles: arrangement,
              }).correct,
              `${exercise.id}: ${arrangement.join(' ')}`,
            ).toBe(true);
          }
        }
      }
    });
  },
);

describe('validatePack catches broken content', () => {
  const pack = grammarPacks[0];
  const clone = (): GrammarPack => structuredClone(pack);

  it('flags kanji without readings', () => {
    const broken = clone();
    broken.lessons[0].examples[0].jp = '行きます。';
    expect(validatePack(broken).join('\n')).toMatch(/has no reading/);
  });

  it('flags an exercise that tests a concept before it is taught', () => {
    const broken = clone();
    broken.lessons[0].practice[0].conceptId = 'i-adjectives';
    expect(validatePack(broken).join('\n')).toMatch(/before it is taught/);
  });

  it('flags a build arrangement that does not use every tile', () => {
    const broken = clone();
    const exercise = broken.lessons[0].practice.find(ex => ex.type === 'build');
    if (exercise?.type !== 'build') throw new Error('fixture missing');
    exercise.accepted.push(exercise.tiles.slice(1));
    expect(validatePack(broken).join('\n')).toMatch(/every tile exactly once/);
  });

  it('flags a particle answer that does not rebuild the sentence', () => {
    const broken = clone();
    const exercise = broken.lessons[2].practice.find(
      ex => ex.type === 'particle',
    );
    if (exercise?.type !== 'particle') throw new Error('fixture missing');
    exercise.accepted = ['は'];
    expect(validatePack(broken).join('\n')).toMatch(/must equal sentence/);
  });

  it('flags duplicate exercise ids', () => {
    const broken = clone();
    broken.lessons[1].practice[0].id = broken.lessons[0].practice[0].id;
    expect(validatePack(broken).join('\n')).toMatch(/duplicate exercise id/);
  });

  it('flags hints in checkpoints', () => {
    const broken = clone();
    broken.lessons[0].checkpoint[0].hint = 'too easy';
    expect(validatePack(broken).join('\n')).toMatch(/must not have a hint/);
  });
});
