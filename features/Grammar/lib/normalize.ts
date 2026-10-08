import type { RubyText } from '../types';
import { stripRuby } from './ruby';

// Whitespace (incl. full-width space) and sentence punctuation that never
// changes whether an answer is grammatical.
const IGNORED_CHARACTERS = /[\s　。、，,．.！!？?・「」『』"'“”‘’…〜~]/g;

/**
 * Normalizes Japanese for comparison: removes ruby readings, harmless
 * whitespace and punctuation, and unifies full-/half-width forms.
 */
export function normalizeJapanese(input: RubyText): string {
  return stripRuby(input).normalize('NFKC').replace(IGNORED_CHARACTERS, '');
}

/** Normalizes then joins an ordered tile list into one comparable string. */
export function normalizeTiles(tiles: RubyText[]): string {
  return normalizeJapanese(tiles.join(''));
}
