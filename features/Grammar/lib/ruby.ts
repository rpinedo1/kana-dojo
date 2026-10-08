import type { RubyText } from '../types';

export interface RubySegment {
  text: string;
  reading?: string;
}

// A run of kanji (incl. 々 and ヶ) followed by a bracketed kana reading.
const RUBY_PATTERN = /([㐀-䶿一-鿿豈-﫿々〆ヶ]+)\[([^\]]+)\]/g;
const KANJI_PATTERN = /[㐀-䶿一-鿿豈-﫿々〆ヶ]/;
const KANA_ONLY_PATTERN = /^[぀-ゟ゠-ヿー]+$/;

/** Splits ruby notation into plain and annotated segments. */
export function parseRuby(input: RubyText): RubySegment[] {
  const segments: RubySegment[] = [];
  let lastIndex = 0;

  for (const match of input.matchAll(RUBY_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ text: input.slice(lastIndex, index) });
    }
    segments.push({ text: match[1], reading: match[2] });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < input.length) {
    segments.push({ text: input.slice(lastIndex) });
  }

  return segments;
}

/** Removes reading annotations: '学生[がくせい]です' → '学生です'. */
export function stripRuby(input: RubyText): string {
  return input.replace(RUBY_PATTERN, '$1');
}

/** Replaces kanji with their readings: '学生[がくせい]です' → 'がくせいです'. */
export function rubyToKana(input: RubyText): string {
  return input.replace(RUBY_PATTERN, '$2');
}

/**
 * Returns content problems in a ruby string: kanji without a reading,
 * readings that are not kana, or stray brackets.
 */
export function findRubyProblems(input: RubyText): string[] {
  const problems: string[] = [];

  for (const segment of parseRuby(input)) {
    if (segment.reading !== undefined) {
      if (!KANA_ONLY_PATTERN.test(segment.reading)) {
        problems.push(`reading "${segment.reading}" must be kana only`);
      }
      continue;
    }
    if (KANJI_PATTERN.test(segment.text)) {
      problems.push(`kanji in "${segment.text}" has no reading`);
    }
    if (/[[\]]/.test(segment.text)) {
      problems.push(`unmatched bracket in "${segment.text}"`);
    }
  }

  return problems;
}
