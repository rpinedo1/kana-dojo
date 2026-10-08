import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { grammarPacks } from '../data';
import { getSentenceClipSrc, getSpeechText, speechHash } from '../lib/audio';

const collectJp = (value: unknown, out = new Set<string>()): Set<string> => {
  if (Array.isArray(value)) {
    value.forEach(item => collectJp(item, out));
  } else if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (typeof record.jp === 'string') out.add(record.jp);
    Object.values(record).forEach(item => collectJp(item, out));
  }
  return out;
};

const allJp = [...collectJp(grammarPacks)];

describe('grammar audio', () => {
  it('has a clip on disk for every sentence and word', () => {
    const missing = allJp.filter(
      jp =>
        !existsSync(path.join(process.cwd(), 'public', getSentenceClipSrc(jp))),
    );
    // If this fails, run: python3 scripts/generate-grammar-audio.py
    expect(missing).toEqual([]);
  });

  it('gives every sentence its own clip', () => {
    const hashes = new Set(allJp.map(speechHash));
    expect(hashes.size).toBe(allJp.length);
  });

  it('uses a stable hash shared with the generator script', () => {
    expect(speechHash('')).toBe('811c9dc5');
    expect(speechHash('学生[がくせい]です。')).toBe(
      speechHash('学生[がくせい]です。'),
    );
    expect(speechHash('学生[がくせい]です。')).not.toBe(
      speechHash('学生[がくせい]です'),
    );
  });

  it('gives the browser voice plain text', () => {
    expect(getSpeechText('私[わたし]は 学生[がくせい]です。')).toBe(
      '私は 学生です。',
    );
    expect(getSpeechText('何[なん]／何[なに]')).toBe('何、何');
    expect(getSpeechText('〜ません')).toBe('ません');
  });
});
