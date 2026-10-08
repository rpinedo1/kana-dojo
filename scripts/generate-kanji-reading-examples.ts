/**
 * Picks one example word from the vocabulary lists for every kanji reading and
 * writes public/data-kanji/reading-examples.json.
 *
 * Output shape: { [kanjiChar]: { [rawReading]: [word, kana, meaning, soundsLike?] } }
 * `soundsLike` is set when the reading changes sound inside the word, e.g.
 * 学 ガク in 学校 (がっこう) is said "がっ".
 *
 * Usage: npx tsx scripts/generate-kanji-reading-examples.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseReading,
  toHiragana,
  type ParsedReading,
} from '../features/Kanji/lib/readings';

type KanjiEntry = { kanjiChar: string; onyomi: string[]; kunyomi: string[] };
type VocabEntry = { kana: string; kanji: string; waller_definition: string };
type Example = [string, string, string] | [string, string, string, string];

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];

const readJson = <T>(file: string): T =>
  JSON.parse(readFileSync(path.join(ROOT, file), 'utf-8')) as T;

// Easier words first: N5 before N1, then shorter words.
const vocab = LEVELS.flatMap(level =>
  readJson<VocabEntry[]>(`public/data-vocab/${level}.json`).map(v => ({
    ...v,
    kana: toHiragana(v.kana),
  })),
);
const vocabRank = new Map(vocab.map((v, i) => [v, i]));
const byEase = (a: VocabEntry, b: VocabEntry) =>
  a.kanji.length - b.kanji.length || vocabRank.get(a)! - vocabRank.get(b)!;

const VOICED: Record<string, string> = Object.fromEntries(
  [
    'かが',
    'きぎ',
    'くぐ',
    'けげ',
    'こご',
    'さざ',
    'しじ',
    'すず',
    'せぜ',
    'そぞ',
    'ただ',
    'ちぢ',
    'つづ',
    'てで',
    'とど',
    'はばぱ',
    'ひびぴ',
    'ふぶぷ',
    'へべぺ',
    'ほぼぽ',
  ].flatMap(([plain, ...rest]) => [[plain, rest.join('')]]),
);

/** Sound changes a reading can go through inside a word. */
const soundVariants = (reading: string, atStart: boolean, atEnd: boolean) => {
  const variants: string[] = [];
  // Rendaku: the first sound becomes voiced after another kanji (か → が).
  if (!atStart) {
    for (const voiced of VOICED[reading[0]] ?? '') {
      variants.push(voiced + reading.slice(1));
    }
  }
  // Gemination: a final く/つ/ち/き becomes a small っ before another kanji.
  if (!atEnd && /[くつちき]$/.test(reading)) {
    variants.push(reading.slice(0, -1) + 'っ');
  }
  return variants;
};

const matchesAt = (word: VocabEntry, kanji: string, sound: string): boolean => {
  if (word.kanji.startsWith(kanji)) return word.kana.startsWith(sound);
  if (word.kanji.endsWith(kanji)) return word.kana.endsWith(sound);
  return word.kana.includes(sound);
};

const findOnyomiExample = (
  kanji: string,
  reading: ParsedReading,
  otherSounds: string[],
): Example | null => {
  const sound = toHiragana(reading.stem);
  // Skip words where a longer reading of the same kanji fits too: 再 サ must
  // not pick 再三 (さいさん), which uses サイ.
  const longer = otherSounds.filter(
    other => other.length > sound.length && other.startsWith(sound),
  );
  const compounds = vocab
    .filter(w => w.kanji.includes(kanji) && w.kanji.length >= 2)
    .filter(w => !longer.some(other => matchesAt(w, kanji, other)))
    .sort(byEase);

  const exact = compounds.find(w => matchesAt(w, kanji, sound));
  if (exact) return [exact.kanji, exact.kana, exact.waller_definition];

  for (const word of compounds) {
    const atStart = word.kanji.startsWith(kanji);
    const atEnd = word.kanji.endsWith(kanji);
    const variant = soundVariants(sound, atStart, atEnd).find(v =>
      matchesAt(word, kanji, v),
    );
    if (variant) {
      return [word.kanji, word.kana, word.waller_definition, variant];
    }
  }
  return null;
};

const findKunyomiExample = (
  kanji: string,
  reading: ParsedReading,
): Example | null => {
  const stem = toHiragana(reading.stem);
  const full = stem + reading.okurigana;
  let candidates: VocabEntry[];

  if (reading.isPrefix) {
    candidates = vocab.filter(
      w => w.kanji.startsWith(kanji) && w.kana.startsWith(stem),
    );
  } else if (reading.isSuffix) {
    candidates = vocab.filter(
      w => w.kanji.endsWith(kanji) && w.kana.endsWith(stem),
    );
  } else {
    // The word written exactly as kanji + okurigana (会う), else a word that
    // starts with it (会わせる).
    const written = kanji + reading.okurigana;
    candidates = vocab.filter(w => w.kanji === written && w.kana === full);
    if (candidates.length === 0) {
      candidates = vocab.filter(
        w => w.kanji.startsWith(written) && w.kana.startsWith(full),
      );
    }
  }

  const best = candidates.sort(byEase)[0];
  return best ? [best.kanji, best.kana, best.waller_definition] : null;
};

const output: Record<string, Record<string, Example>> = {};
let total = 0;
let found = 0;

for (const level of LEVELS) {
  const kanjiList = readJson<KanjiEntry[]>(
    `public/data-kanji/${level.toUpperCase()}.json`,
  );
  for (const { kanjiChar, onyomi, kunyomi } of kanjiList) {
    const readings = [
      ...onyomi.filter(Boolean).map(raw => ({ raw, on: true })),
      ...kunyomi.filter(Boolean).map(raw => ({ raw, on: false })),
    ];
    const sounds = readings.map(({ raw }) =>
      toHiragana(parseReading(raw).stem),
    );
    for (const { raw, on } of readings) {
      total++;
      const parsed = parseReading(raw);
      const example = on
        ? findOnyomiExample(kanjiChar, parsed, sounds)
        : findKunyomiExample(kanjiChar, parsed);
      if (!example) continue;
      found++;
      (output[kanjiChar] ??= {})[raw] = example;
    }
  }
}

const outFile = path.join(ROOT, 'public/data-kanji/reading-examples.json');
writeFileSync(outFile, JSON.stringify(output));
process.stdout.write(
  `${found}/${total} readings have an example word -> ${outFile}\n`,
);
