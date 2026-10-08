/**
 * Tokyo-dialect pitch accent helpers. Accent data comes from Kanjium
 * (CC BY-SA 4.0) via scripts/generate-vocab-pitch.ts, as a downstep number:
 * the mora after which the pitch drops, or 0 when it never drops.
 */

export type Pitch = 'H' | 'L';

// Small kana that share a mora with the kana before them (きゃ = 1 mora).
// っ, ん and ー are morae of their own.
const SMALL_KANA = /[ゃゅょぁぃぅぇぉゎャュョァィゥェォヮ]/;

export const splitMorae = (kana: string): string[] =>
  Array.from(kana).reduce<string[]>((morae, char) => {
    if (SMALL_KANA.test(char) && morae.length > 0) {
      morae[morae.length - 1] += char;
    } else {
      morae.push(char);
    }
    return morae;
  }, []);

/**
 * High/low pitch for each mora, plus the pitch of a particle that follows
 * (which is how 箸 and 橋 differ: はしが vs はしが).
 */
export const getPitchPattern = (
  moraCount: number,
  downstep: number,
): { morae: Pitch[]; particle: Pitch } => {
  const morae = Array.from({ length: moraCount }, (_, i): Pitch => {
    if (downstep === 1) return i === 0 ? 'H' : 'L';
    if (i === 0) return 'L';
    return downstep === 0 || i < downstep ? 'H' : 'L';
  });
  return { morae, particle: downstep === 0 ? 'H' : 'L' };
};

export const getPitchName = (
  moraCount: number,
  downstep: number,
): { name: string; description: string } => {
  if (downstep === 0) {
    return {
      name: 'Heiban',
      description:
        'Starts low, rises, and stays high (even on a following particle)',
    };
  }
  if (downstep === 1) {
    return {
      name: 'Atamadaka',
      description: 'High on the first sound, then drops',
    };
  }
  if (downstep >= moraCount) {
    return {
      name: 'Odaka',
      description:
        'Rises and stays high to the end, then drops on a following particle',
    };
  }
  return {
    name: 'Nakadaka',
    description: `Rises, then drops after sound ${downstep}`,
  };
};

export const pitchKey = (word: string, kana: string) => `${word}|${kana}`;
