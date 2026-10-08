/**
 * Looks up the pitch accent of every vocabulary word in the free Kanjium
 * dataset (CC BY-SA 4.0, https://github.com/mifunetoshiro/kanjium) and writes
 * public/data-vocab/pitch.json.
 *
 * Output shape: { "word|kana": [downstep, ...] }, most common pattern first.
 * The downstep is the mora after which the pitch drops; 0 means it never
 * drops (heiban).
 *
 * Usage: npx tsx scripts/generate-vocab-pitch.ts [path/to/accents.txt]
 * Without a path, the pinned Kanjium file is downloaded.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { toHiragana } from '../features/Kanji/lib/readings';

const KANJIUM_COMMIT = '9ebca4589565c696e7c39e089e2e928ad65f678c';
const KANJIUM_URL = `https://raw.githubusercontent.com/mifunetoshiro/kanjium/${KANJIUM_COMMIT}/data/source_files/raw/accents.txt`;

type VocabEntry = { kana: string; kanji: string };

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];

/** "(副)1,(形動)0" -> [1, 0]; "0,2" -> [0, 2] */
const parseAccents = (field: string): number[] => [
  ...new Set(
    field
      .replace(/\([^)]*\)/g, '')
      .split(',')
      .map(part => part.trim())
      .filter(part => /^\d+$/.test(part))
      .map(Number),
  ),
];

const key = (word: string, kana: string) => `${word}|${toHiragana(kana)}`;

const loadAccents = async (): Promise<string> => {
  const file = process.argv[2];
  if (file) return readFileSync(file, 'utf-8');
  const res = await fetch(KANJIUM_URL);
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${KANJIUM_URL}`);
  return res.text();
};

const main = async () => {
  const byWord = new Map<string, number[]>();
  const byReading = new Map<string, number[][]>();

  for (const line of (await loadAccents()).split('\n')) {
    const [word, reading, field] = line.split('\t');
    if (!word || !field) continue;
    const accents = parseAccents(field);
    if (accents.length === 0) continue;
    // Kana-only words leave the reading column empty.
    const kana = reading || word;
    byWord.set(key(word, kana), accents);
    const readingKey = toHiragana(kana);
    byReading.set(readingKey, [...(byReading.get(readingKey) ?? []), accents]);
  }

  const output: Record<string, number[]> = {};
  let total = 0;
  let exact = 0;
  let byKana = 0;

  for (const level of LEVELS) {
    const vocab = JSON.parse(
      readFileSync(path.join(ROOT, `public/data-vocab/${level}.json`), 'utf-8'),
    ) as VocabEntry[];
    for (const { kanji, kana } of vocab) {
      total++;
      const word = kanji?.trim() || kana;
      const outKey = `${word}|${kana}`;
      const found = byWord.get(key(word, kana)) ?? byWord.get(key(kana, kana));
      if (found) {
        output[outKey] = found;
        exact++;
        continue;
      }
      // The word may be spelled differently in Kanjium (ありがとう vs 有り難う).
      // Use the reading alone only when every entry with it agrees.
      const candidates = byReading.get(toHiragana(kana)) ?? [];
      const patterns = new Set(candidates.map(accents => accents.join(',')));
      if (patterns.size === 1) {
        output[outKey] = candidates[0];
        byKana++;
      }
    }
  }

  const outFile = path.join(ROOT, 'public/data-vocab/pitch.json');
  writeFileSync(outFile, JSON.stringify(output));
  process.stdout.write(
    `${exact + byKana}/${total} words have pitch accent ` +
      `(${exact} exact, ${byKana} by reading) -> ${outFile}\n`,
  );
};

void main();
