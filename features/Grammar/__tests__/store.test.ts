import { beforeEach, describe, expect, it, vi } from 'vitest';

const KEY = 'kanadojo-grammar-progress';

async function loadStore() {
  vi.resetModules();
  const mod = await import('../store/useGrammarStore');
  await mod.useGrammarStore.persist.rehydrate();
  return mod;
}

describe('grammar progress store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists lesson, checkpoint and concept progress across reloads', async () => {
    const first = await loadStore();
    const store = first.useGrammarStore.getState();
    store.markLessonRead('sentence-order');
    store.recordAnswer({
      conceptId: 'topic-wa',
      exerciseId: 'l01-p3',
      correct: false,
      sessionId: 's1',
    });
    store.recordAnswer({
      conceptId: 'sentence-order',
      exerciseId: 'l01-p2',
      correct: true,
      sessionId: 's1',
    });
    const result = store.recordCheckpoint('sentence-order', 4, 4);
    expect(result.passed).toBe(true);

    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    expect(raw.version).toBe(1);

    const second = await loadStore();
    const state = second.useGrammarStore.getState();
    expect(state.lessons['sentence-order'].readAt).toBeDefined();
    expect(state.lessons['sentence-order'].completedAt).toBeDefined();
    expect(state.lessons['sentence-order'].checkpoint?.bestScore).toBe(4);
    expect(state.concepts['topic-wa'].attempts).toBe(1);
    expect(state.reviewQueue['topic-wa'].missedExerciseIds).toEqual(['l01-p3']);
  });

  it('keeps the best score and the pass once earned', async () => {
    const { useGrammarStore } = await loadStore();
    useGrammarStore.getState().recordCheckpoint('noun-desu', 4, 4);
    const result = useGrammarStore
      .getState()
      .recordCheckpoint('noun-desu', 1, 4);
    expect(result).toMatchObject({
      attempts: 2,
      bestScore: 4,
      lastScore: 1,
      passed: true,
    });
  });

  it('does not complete a lesson on a failing checkpoint', async () => {
    const { useGrammarStore } = await loadStore();
    useGrammarStore.getState().recordCheckpoint('noun-desu', 2, 4);
    expect(
      useGrammarStore.getState().lessons['noun-desu'].completedAt,
    ).toBeUndefined();
  });

  it('defaults to romaji off and furigana on', async () => {
    const { useGrammarStore } = await loadStore();
    expect(useGrammarStore.getState().showRomaji).toBe(false);
    expect(useGrammarStore.getState().showFurigana).toBe(true);
  });

  it('recovers from corrupted or older stored data', async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        version: 0,
        state: {
          lessons: { 'sentence-order': { readAt: 5 } },
          concepts: {
            bad: 'nope',
            good: { attempts: 1, correct: 1, recent: [], correctSessions: [] },
          },
          reviewQueue: [],
          showRomaji: 'yes',
        },
      }),
    );
    const { useGrammarStore } = await loadStore();
    const state = useGrammarStore.getState();
    expect(state.lessons['sentence-order'].readAt).toBe(5);
    expect(state.concepts.bad).toBeUndefined();
    expect(state.concepts.good.attempts).toBe(1);
    expect(state.reviewQueue).toEqual({});
    expect(state.showRomaji).toBe(false);
  });

  it('does not touch other KanaDojo storage keys', async () => {
    localStorage.setItem('kanadojo-stats', '{"keep":true}');
    const { useGrammarStore } = await loadStore();
    useGrammarStore.getState().resetAll();
    expect(localStorage.getItem('kanadojo-stats')).toBe('{"keep":true}');
  });

  it('sanitizes non-object input', async () => {
    const { sanitizeGrammarProgress, createDefaultGrammarProgress } =
      await loadStore();
    expect(sanitizeGrammarProgress(null)).toEqual(
      createDefaultGrammarProgress(),
    );
    expect(sanitizeGrammarProgress('x')).toEqual(
      createDefaultGrammarProgress(),
    );
  });
});
