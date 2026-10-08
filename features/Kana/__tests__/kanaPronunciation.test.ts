import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { kana } from '@/features/Kana/data/kana';
import { getKanaPhonetic } from '@/features/Kana/data/kanaPhonetics';
import { getKanaClipSrc, getKanaClipSrcs } from '@/features/Kana/lib/kanaAudio';

const allKana = Array.from(new Set(kana.flatMap(group => group.kana)));

describe('kana pronunciation', () => {
  it('has a sound-alike hint for every kana', () => {
    const missing = allKana.filter(char => !getKanaPhonetic(char));
    expect(missing).toEqual([]);
  });

  it('has a clip file on disk for every kana that maps to a clip', () => {
    const missing = allKana
      .map(getKanaClipSrc)
      .filter((src): src is string => src !== null)
      .filter(src => !existsSync(path.join(process.cwd(), 'public', src)));
    expect(missing).toEqual([]);
  });

  it('shares one clip between hiragana and katakana', () => {
    expect(getKanaClipSrc('カ')).toBe(getKanaClipSrc('か'));
    expect(getKanaClipSrc('か')).toBe('/sounds/kana/304b.mp3');
    expect(getKanaClipSrc('キャ')).toBe('/sounds/kana/304d-3083.mp3');
  });

  it('has no clip for unknown text or sounds the voice cannot make', () => {
    expect(getKanaClipSrc('ka')).toBeNull();
    expect(getKanaClipSrc('フュ')).toBeNull();
    expect(getKanaClipSrcs(['か', 'フュ'])).toBeNull();
    expect(getKanaClipSrcs(['か', 'き'])).toHaveLength(2);
  });
});
