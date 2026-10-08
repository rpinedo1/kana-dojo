/**
 * Prints every Japanese string in the Grammar packs that gets a play button
 * (anything stored under a `jp` key: example sentences, dialogue lines,
 * exercise sentences, vocabulary words) as JSON for
 * scripts/generate-grammar-audio.py.
 *
 * Output: [{ jp, file, text, kana }] where `text` is the sentence without
 * readings and `kana` is it with every kanji replaced by its reading.
 */
import { grammarPacks } from '../features/Grammar/data';
import { speechHash } from '../features/Grammar/lib/audio';
import { rubyToKana, stripRuby } from '../features/Grammar/lib/ruby';

const seen = new Set<string>();

const walk = (value: unknown) => {
  if (Array.isArray(value)) {
    value.forEach(walk);
    return;
  }
  if (!value || typeof value !== 'object') return;
  const record = value as Record<string, unknown>;
  if (typeof record.jp === 'string') seen.add(record.jp);
  Object.values(record).forEach(walk);
};

walk(grammarPacks);

process.stdout.write(
  JSON.stringify(
    [...seen].map(jp => ({
      jp,
      file: `${speechHash(jp)}.mp3`,
      text: stripRuby(jp),
      kana: rubyToKana(jp),
    })),
  ),
);
