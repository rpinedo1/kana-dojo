import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import n1Kanji from '@/public/data-kanji/N1.json';
import n2Kanji from '@/public/data-kanji/N2.json';
import n3Kanji from '@/public/data-kanji/N3.json';
import n4Kanji from '@/public/data-kanji/N4.json';
import n5Kanji from '@/public/data-kanji/N5.json';
import readingExamples from '@/public/data-kanji/reading-examples.json';
import {
  getKanjiPromptAudio,
  getReadingClipSrc,
  parseReading,
} from '@/features/Kanji/lib/readings';

const allKanji = [...n5Kanji, ...n4Kanji, ...n3Kanji, ...n2Kanji, ...n1Kanji];

describe('parseReading', () => {
  it('speaks okurigana as part of the word', () => {
    expect(parseReading('a(u) あ(う)')).toMatchObject({
      romaji: 'a(u)',
      kana: 'あ(う)',
      spoken: 'あう',
      stem: 'あ',
      okurigana: 'う',
    });
    expect(parseReading('ku.ru く.る').spoken).toBe('くる');
  });

  it('flags prefixes and suffixes without speaking the dash', () => {
    expect(parseReading('-bi -び')).toMatchObject({
      spoken: 'び',
      isSuffix: true,
      isPrefix: false,
    });
    expect(parseReading('o- お-')).toMatchObject({
      spoken: 'お',
      isPrefix: true,
    });
  });

  it('shares a clip between on and kun readings that sound the same', () => {
    expect(getReadingClipSrc(parseReading('kai カイ'))).toBe(
      getReadingClipSrc(parseReading('kai かい')),
    );
  });
});

describe('reading audio and examples', () => {
  it('has a clip on disk for every reading', () => {
    const missing = allKanji
      .flatMap(kanji => [...kanji.onyomi, ...kanji.kunyomi])
      .filter(Boolean)
      .map(raw => getReadingClipSrc(parseReading(raw)))
      .filter(
        src => !src || !existsSync(path.join(process.cwd(), 'public', src)),
      );
    expect(missing).toEqual([]);
  });

  it('plays the first reading for a kanji prompt', () => {
    expect(
      getKanjiPromptAudio({ onyomi: ['kai カイ'], kunyomi: ['a(u) あ(う)'] }),
    ).toEqual({ text: 'カイ', clipSrcs: ['/sounds/readings/304b-3044.mp3'] });
    expect(getKanjiPromptAudio({ onyomi: [''], kunyomi: [] })).toBeNull();
  });

  it('only has examples for real readings, written with their kanji', () => {
    const readingsByKanji = new Map(
      allKanji.map(kanji => [
        kanji.kanjiChar,
        new Set([...kanji.onyomi, ...kanji.kunyomi]),
      ]),
    );
    const examples = readingExamples as Record<
      string,
      Record<string, string[]>
    >;
    const bad = Object.entries(examples).flatMap(([kanjiChar, byReading]) =>
      Object.entries(byReading)
        .filter(
          ([raw, [word]]) =>
            !readingsByKanji.get(kanjiChar)?.has(raw) ||
            !word.includes(kanjiChar),
        )
        .map(([raw]) => `${kanjiChar} ${raw}`),
    );
    expect(bad).toEqual([]);
    expect(examples['会']['kai カイ'].slice(0, 2)).toEqual([
      '会社',
      'かいしゃ',
    ]);
    expect(examples['再']['sa サ'][0]).toBe('再来月');
  });
});
