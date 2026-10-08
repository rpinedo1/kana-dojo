import type { GrammarSentence, Register, RubyText } from '../../types';

/** Shorthand for authoring a sentence. */
export const s = (
  jp: RubyText,
  romaji: string,
  en: string,
  pronunciation?: string,
  register?: Register,
): GrammarSentence => ({ jp, romaji, en, pronunciation, register });

/** Every order of the given phrases, followed by a fixed tail (e.g. the verb). */
export function permutationsWithTail(
  phrases: RubyText[],
  tail: RubyText[],
): RubyText[][] {
  if (phrases.length <= 1) return [[...phrases, ...tail]];
  return phrases.flatMap((phrase, index) =>
    permutationsWithTail(
      phrases.filter((_, i) => i !== index),
      tail,
    ).map(rest => [phrase, ...rest]),
  );
}
