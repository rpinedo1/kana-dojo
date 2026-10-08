import { describe, expect, it } from 'vitest';
import { describeTileAnswer, gradeExercise } from '../lib/grade';
import { normalizeJapanese } from '../lib/normalize';
import {
  parseRuby,
  rubyToKana,
  stripRuby,
  findRubyProblems,
} from '../lib/ruby';
import type { ErrorExercise, ParticleExercise, TileExercise } from '../types';

const sentence = { jp: '', romaji: 'x', en: 'x' };

const build: TileExercise = {
  id: 't-build',
  type: 'build',
  conceptId: 'sentence-order',
  instruction: '',
  explanation: 'x',
  prompt: 'I will go tomorrow.',
  constraint: 'Use all tiles.',
  tiles: ['私[わたし]は', '明日[あした]', '行[い]きます'],
  accepted: [
    ['私[わたし]は', '明日[あした]', '行[い]きます'],
    ['明日[あした]', '私[わたし]は', '行[い]きます'],
  ],
  sentence,
};

const reverse: TileExercise = {
  ...build,
  id: 't-reverse',
  type: 'reverse',
  tiles: ['明日[あした]', '東京[とうきょう]に', '行[い]きます'],
  distractors: ['明日[あした]に'],
  accepted: [
    ['明日[あした]', '東京[とうきょう]に', '行[い]きます'],
    ['東京[とうきょう]に', '明日[あした]', '行[い]きます'],
  ],
};

describe('ruby notation', () => {
  it('parses annotated kanji runs', () => {
    expect(parseRuby('私[わたし]は 学生[がくせい]です')).toEqual([
      { text: '私', reading: 'わたし' },
      { text: 'は ' },
      { text: '学生', reading: 'がくせい' },
      { text: 'です' },
    ]);
  });

  it('strips and converts readings', () => {
    expect(stripRuby('学生[がくせい]です')).toBe('学生です');
    expect(rubyToKana('学生[がくせい]です')).toBe('がくせいです');
  });

  it('reports unannotated kanji and non-kana readings', () => {
    expect(findRubyProblems('学生です')).toHaveLength(1);
    expect(findRubyProblems('学生[gakusei]です')).toHaveLength(1);
    expect(findRubyProblems('アメリカ人[じん]です')).toEqual([]);
  });
});

describe('normalizeJapanese', () => {
  it('ignores spaces, full-width spaces and punctuation', () => {
    expect(normalizeJapanese('私は　学生です。')).toBe('私は学生です');
    expect(normalizeJapanese('学生ですか？')).toBe(
      normalizeJapanese('学生ですか。'),
    );
    expect(normalizeJapanese('はい、学生です!')).toBe('はい学生です');
  });

  it('unifies half/full width forms', () => {
    expect(normalizeJapanese('ＡＢＣ')).toBe('ABC');
  });

  it('does not erase meaningful differences', () => {
    expect(normalizeJapanese('私は')).not.toBe(normalizeJapanese('私が'));
  });
});

describe('tile grading', () => {
  it('accepts every authored word order', () => {
    expect(
      gradeExercise(build, { type: 'build', tiles: build.accepted[0] }).correct,
    ).toBe(true);
    expect(
      gradeExercise(build, { type: 'build', tiles: build.accepted[1] }).correct,
    ).toBe(true);
  });

  it('rejects the verb in the wrong position', () => {
    const tiles = ['行[い]きます', '私[わたし]は', '明日[あした]'];
    expect(gradeExercise(build, { type: 'build', tiles }).correct).toBe(false);
    expect(describeTileAnswer(build, tiles).kind).toBe('order');
  });

  it('rejects incomplete answers and explains what is missing', () => {
    const tiles = ['私[わたし]は', '行[い]きます'];
    expect(gradeExercise(build, { type: 'build', tiles }).correct).toBe(false);
    expect(describeTileAnswer(build, tiles)).toEqual({
      kind: 'missing-tiles',
      tiles: ['明日[あした]'],
    });
  });

  it('rejects an empty answer', () => {
    expect(gradeExercise(build, { type: 'build', tiles: [] }).correct).toBe(
      false,
    );
    expect(describeTileAnswer(build, []).kind).toBe('empty');
  });

  it('flags distractor tiles in reverse practice', () => {
    const tiles = ['明日[あした]に', '東京[とうきょう]に', '行[い]きます'];
    expect(gradeExercise(reverse, { type: 'reverse', tiles }).correct).toBe(
      false,
    );
    expect(describeTileAnswer(reverse, tiles)).toEqual({
      kind: 'used-distractor',
      tiles: ['明日[あした]に'],
    });
  });

  it('accepts the alternative order in reverse practice', () => {
    expect(
      gradeExercise(reverse, { type: 'reverse', tiles: reverse.accepted[1] })
        .correct,
    ).toBe(true);
  });
});

describe('particle grading', () => {
  const particle: ParticleExercise = {
    id: 'p',
    type: 'particle',
    conceptId: 'ni-destination',
    instruction: '',
    explanation: 'x',
    context: 'I will go to Tokyo.',
    before: '東京[とうきょう]',
    after: '行[い]きます',
    options: ['に', 'へ', 'で'],
    accepted: ['に', 'へ'],
    sentence,
  };

  it('accepts every authored particle', () => {
    expect(
      gradeExercise(particle, { type: 'particle', particle: 'に' }).correct,
    ).toBe(true);
    expect(
      gradeExercise(particle, { type: 'particle', particle: 'へ' }).correct,
    ).toBe(true);
  });

  it('rejects other particles', () => {
    expect(
      gradeExercise(particle, { type: 'particle', particle: 'で' }).correct,
    ).toBe(false);
  });

  it('rejects a response of the wrong type', () => {
    expect(
      gradeExercise(particle, { type: 'meaning', optionId: 'a' }).correct,
    ).toBe(false);
  });
});

describe('error-correction grading', () => {
  const error: ErrorExercise = {
    id: 'e',
    type: 'error',
    conceptId: 'ni-destination',
    instruction: '',
    explanation: 'x',
    parts: ['学校[がっこう]', 'で', '行[い]きます'],
    errorIndex: 1,
    fixOptions: ['に', 'へ', 'を'],
    acceptedFixes: ['に', 'へ'],
    sentence,
  };

  it('requires both the right part and an accepted fix', () => {
    expect(
      gradeExercise(error, { type: 'error', partIndex: 1, fix: 'へ' }),
    ).toEqual({
      correct: true,
      foundError: true,
    });
    expect(
      gradeExercise(error, { type: 'error', partIndex: 1, fix: 'を' }),
    ).toEqual({
      correct: false,
      foundError: true,
    });
    expect(
      gradeExercise(error, { type: 'error', partIndex: 0, fix: 'に' }),
    ).toEqual({
      correct: false,
      foundError: false,
    });
  });
});
