import { describe, expect, it } from 'vitest';
import pitch from '@/public/data-vocab/pitch.json';
import n5Vocab from '@/public/data-vocab/n5.json';
import {
  getPitchName,
  getPitchPattern,
  pitchKey,
  splitMorae,
} from '@/features/Vocabulary/lib/pitchAccent';

const accents = pitch as Record<string, number[]>;

describe('splitMorae', () => {
  it('keeps small kana with the kana before them', () => {
    expect(splitMorae('きょう')).toEqual(['きょ', 'う']);
    expect(splitMorae('ジュース')).toEqual(['ジュ', 'ー', 'ス']);
  });

  it('counts っ and ん as their own morae', () => {
    expect(splitMorae('がっこう')).toEqual(['が', 'っ', 'こ', 'う']);
    expect(splitMorae('にほん')).toEqual(['に', 'ほ', 'ん']);
  });
});

describe('getPitchPattern', () => {
  it('tells apart words that differ only in pitch', () => {
    // 箸 (chopsticks): HL, particle low
    expect(getPitchPattern(2, 1)).toEqual({
      morae: ['H', 'L'],
      particle: 'L',
    });
    // 橋 (bridge): LH, particle low
    expect(getPitchPattern(2, 2)).toEqual({
      morae: ['L', 'H'],
      particle: 'L',
    });
    // 端 (edge): LH, particle stays high
    expect(getPitchPattern(2, 0)).toEqual({
      morae: ['L', 'H'],
      particle: 'H',
    });
  });

  it('drops after the downstep in the middle of a word', () => {
    // 先生 せんせい, 3: L H H L
    expect(getPitchPattern(4, 3).morae).toEqual(['L', 'H', 'H', 'L']);
  });

  it('names each pattern', () => {
    expect(getPitchName(2, 0).name).toBe('Heiban');
    expect(getPitchName(2, 1).name).toBe('Atamadaka');
    expect(getPitchName(2, 2).name).toBe('Odaka');
    expect(getPitchName(4, 3).name).toBe('Nakadaka');
  });
});

describe('vocabulary pitch data', () => {
  it('has known accents for common words', () => {
    expect(accents[pitchKey('雨', 'あめ')]).toEqual([1]);
    expect(accents[pitchKey('飴', 'あめ')]).toEqual([0]);
    expect(accents[pitchKey('先生', 'せんせい')]).toEqual([3]);
  });

  it('covers most N5 words with valid downsteps', () => {
    const entries = n5Vocab.map(v => {
      const word = v.kanji?.trim() || v.kana;
      return { kana: v.kana, downsteps: accents[pitchKey(word, v.kana)] };
    });
    const covered = entries.filter(e => e.downsteps);
    expect(covered.length / entries.length).toBeGreaterThan(0.95);
    const invalid = covered.filter(e =>
      e.downsteps!.some(d => d > splitMorae(e.kana).length),
    );
    expect(invalid).toEqual([]);
  });
});
