import type { GrammarLesson } from '../../../types';
import { s } from '../helpers';

export const lesson05: GrammarLesson = {
  id: 'no-possession',
  number: 5,
  title: 'Linking nouns with の',
  titleJa: '私[わたし]の 本[ほん]',
  summary:
    'Say "my book", "Tanaka-san’s cat" and "a Japanese teacher" with の.',
  conceptIds: ['no-possession'],
  prerequisites: ['questions-ka'],
  explanation: [
    'の connects two nouns: A の B. The second noun, B, is the main thing; A tells you whose it is or what kind it is.',
    '私の 本 is "my book" (the book belonging to me). 田中さんの 猫 is "Tanaka-san’s cat".',
    'の also shows a relationship or category, not only ownership: 日本語の 先生 is "a Japanese-language teacher" (a teacher of Japanese), and 学校の 先生 is "a school teacher".',
    'To ask "whose?", use だれの: これは だれの 本ですか ("Whose book is this?").',
  ],
  pattern: {
    formula: 'Noun A + の + Noun B  (→ "A’s B / B of A")',
    example: s(
      'これは 私[わたし]の 本[ほん]です。',
      'Kore wa watashi no hon desu.',
      'This is my book.',
      'ko-re wa wa-ta-shi no hon des(u)',
      'polite',
    ),
  },
  breakdown: [
    {
      part: 'これは',
      romaji: 'kore wa',
      role: 'Topic',
      note: '"As for this".',
    },
    {
      part: '私[わたし]',
      romaji: 'watashi',
      role: 'Owner (noun A)',
      note: '"I / me".',
    },
    {
      part: 'の',
      romaji: 'no',
      role: 'Linking particle',
      note: 'Connects A to B: "my".',
    },
    {
      part: '本[ほん]',
      romaji: 'hon',
      role: 'Main noun (B)',
      note: '"Book" — the thing being talked about.',
    },
    { part: 'です', romaji: 'desu', role: 'Polite copula', note: '"Is".' },
  ],
  examples: [
    s(
      '田中[たなか]さんの 猫[ねこ]です。',
      'Tanaka-san no neko desu.',
      "It's Tanaka-san's cat.",
      'ta-na-ka-san no ne-ko des(u)',
      'polite',
    ),
    s(
      '山田[やまだ]さんは 日本語[にほんご]の 先生[せんせい]です。',
      'Yamada-san wa nihongo no sensei desu.',
      'Yamada-san is a Japanese teacher (teaches Japanese).',
      'ya-ma-da-san wa ni-hon-go no sen-see des(u)',
      'polite',
    ),
    s(
      '私[わたし]の 友[とも]だちは 学生[がくせい]です。',
      'Watashi no tomodachi wa gakusei desu.',
      'My friend is a student.',
      'wa-ta-shi no to-mo-da-chi wa ga-ku-see des(u)',
      'polite',
    ),
    s(
      'これは だれの 本[ほん]ですか。',
      'Kore wa dare no hon desu ka.',
      'Whose book is this?',
      'ko-re wa da-re no hon des(u) ka',
      'polite',
    ),
  ],
  pronunciationNotes: [
    'の is simply "no"—no special reading.',
    'In 日本語 (ni-hon-go), ん before g is pronounced like the "ng" in "sing".',
  ],
  mnemonic:
    'の works like English "’s" pointing forward: 私の → 本. The last noun is the thing you actually have.',
  commonMistakes: [
    {
      wrong: '本[ほん]の 私[わたし]',
      right: '私[わたし]の 本[ほん]',
      why: 'The owner comes first and the main noun last. 本の 私 would mean "the me of the book".',
    },
    {
      wrong: '日本語[にほんご] 先生[せんせい]',
      right: '日本語[にほんご]の 先生[せんせい]',
      why: 'With these beginner nouns, link them with の. (Some fixed compound words skip の, but that is word-specific.)',
    },
  ],
  vocabulary: [
    { jp: 'の', romaji: 'no', en: 'linking particle ("’s", "of")' },
    { jp: '猫[ねこ]', romaji: 'neko', en: 'cat' },
    { jp: '日本語[にほんご]', romaji: 'nihongo', en: 'Japanese (language)' },
    { jp: '友[とも]だち', romaji: 'tomodachi', en: 'friend' },
    { jp: 'だれの', romaji: 'dare no', en: 'whose' },
  ],
  practice: [
    {
      id: 'l05-p1',
      type: 'particle',
      conceptId: 'no-possession',
      instruction: 'Choose the particle for the blank.',
      context: '"It\'s my book."',
      before: '私[わたし]',
      after: ' 本[ほん]です。',
      options: ['の', 'は', 'が'],
      accepted: ['の'],
      sentence: s(
        '私[わたし]の 本[ほん]です。',
        'Watashi no hon desu.',
        "It's my book.",
      ),
      hint: 'Which particle links two nouns?',
      explanation:
        '私の 本 = "my book". の links the owner (私) to the thing (本).',
    },
    {
      id: 'l05-p2',
      type: 'meaning',
      conceptId: 'no-possession',
      instruction: 'What does this sentence mean?',
      sentence: s(
        '山田[やまだ]さんは 日本語[にほんご]の 先生[せんせい]です。',
        'Yamada-san wa nihongo no sensei desu.',
        'Yamada-san is a Japanese teacher.',
      ),
      options: [
        { id: 'a', text: 'Yamada-san is Japanese.' },
        { id: 'b', text: 'Yamada-san is a Japanese-language teacher.' },
        { id: 'c', text: "Yamada-san's teacher is Japanese." },
        { id: 'd', text: 'Yamada-san studies Japanese.' },
      ],
      correctOptionId: 'b',
      hint: 'The last noun is the main thing. What kind of 先生?',
      explanation:
        '日本語の 先生: the main noun is 先生 (teacher); 日本語の tells you which kind—a teacher of Japanese.',
    },
    {
      id: 'l05-p3',
      type: 'build',
      conceptId: 'no-possession',
      instruction: 'Build the sentence.',
      prompt: "This is my friend's cat.",
      constraint: 'Use all tiles.',
      tiles: ['これ', 'は', '友[とも]だち', 'の', '猫[ねこ]', 'です'],
      accepted: [['これ', 'は', '友[とも]だち', 'の', '猫[ねこ]', 'です']],
      sentence: s(
        'これは 友[とも]だちの 猫[ねこ]です。',
        'Kore wa tomodachi no neko desu.',
        "This is my friend's cat.",
      ),
      hint: 'Owner の thing. "My" is understood from context.',
      explanation:
        '友だちの 猫 = "(my) friend’s cat": owner first, main noun last. "My" is understood from context.',
    },
    {
      id: 'l05-p4',
      type: 'error',
      conceptId: 'no-possession',
      instruction: 'Tap the incorrect part, then choose the fix.',
      parts: ['これは', '田中[たなか]さん', 'は', '本[ほん]です'],
      errorIndex: 2,
      fixOptions: ['の', 'が', 'か'],
      acceptedFixes: ['の'],
      sentence: s(
        'これは 田中[たなか]さんの 本[ほん]です。',
        'Kore wa Tanaka-san no hon desu.',
        "This is Tanaka-san's book.",
      ),
      hint: 'Tanaka-san owns the book.',
      explanation:
        'Ownership between two nouns uses の: 田中さんの 本 = "Tanaka-san’s book".',
    },
  ],
  checkpoint: [
    {
      id: 'l05-c1',
      type: 'reverse',
      conceptId: 'no-possession',
      instruction: 'Build the Japanese question.',
      prompt: 'Whose book is this?',
      constraint: 'Not every tile is needed.',
      tiles: ['これ', 'は', 'だれ', 'の', '本[ほん]', 'ですか'],
      distractors: ['が', 'どこ'],
      accepted: [['これ', 'は', 'だれ', 'の', '本[ほん]', 'ですか']],
      sentence: s(
        'これは だれの 本[ほん]ですか。',
        'Kore wa dare no hon desu ka.',
        'Whose book is this?',
      ),
      explanation:
        'だれの = "whose". It links to 本 just like 私の 本, and か makes the question.',
    },
    {
      id: 'l05-c2',
      type: 'particle',
      conceptId: 'no-possession',
      instruction: 'Choose the particle for the blank.',
      context: '"Tanaka-san is a school teacher."',
      before: '田中[たなか]さんは 学校[がっこう]',
      after: ' 先生[せんせい]です。',
      options: ['の', 'は', 'が'],
      accepted: ['の'],
      sentence: s(
        '田中[たなか]さんは 学校[がっこう]の 先生[せんせい]です。',
        'Tanaka-san wa gakkō no sensei desu.',
        'Tanaka-san is a school teacher.',
      ),
      explanation:
        '学校の 先生: の links two nouns; the second (先生) is the main noun.',
    },
    {
      id: 'l05-c3',
      type: 'meaning',
      conceptId: 'no-possession',
      instruction: 'What does this sentence mean?',
      sentence: s(
        '私[わたし]の 友[とも]だちは 学生[がくせい]です。',
        'Watashi no tomodachi wa gakusei desu.',
        'My friend is a student.',
      ),
      options: [
        { id: 'a', text: 'My friend is a student.' },
        { id: 'b', text: "I am my friend's student." },
        { id: 'c', text: 'My friend is a teacher.' },
        { id: 'd', text: 'I am a student.' },
      ],
      correctOptionId: 'a',
      explanation:
        '私の 友だち ("my friend") is the topic; 学生です says "is a student".',
    },
    {
      id: 'l05-c4',
      type: 'build',
      conceptId: 'no-possession',
      instruction: 'Build the sentence.',
      prompt: 'Tanaka-san is my teacher.',
      constraint: 'Use all tiles. Make Tanaka-san the topic.',
      tiles: [
        '田中[たなか]さん',
        'は',
        '私[わたし]',
        'の',
        '先生[せんせい]',
        'です',
      ],
      accepted: [
        [
          '田中[たなか]さん',
          'は',
          '私[わたし]',
          'の',
          '先生[せんせい]',
          'です',
        ],
      ],
      sentence: s(
        '田中[たなか]さんは 私[わたし]の 先生[せんせい]です。',
        'Tanaka-san wa watashi no sensei desu.',
        'Tanaka-san is my teacher.',
      ),
      explanation:
        'Topic 田中さんは, then 私の 先生 ("my teacher"), then です.',
    },
    {
      id: 'l05-c5',
      type: 'error',
      conceptId: 'no-possession',
      instruction: 'Tap the incorrect part, then choose the fix.',
      parts: ['これは', '私[わたし]', 'が', '猫[ねこ]です'],
      errorIndex: 2,
      fixOptions: ['の', 'か', 'が'],
      acceptedFixes: ['の'],
      sentence: s(
        'これは 私[わたし]の 猫[ねこ]です。',
        'Kore wa watashi no neko desu.',
        'This is my cat.',
      ),
      explanation:
        '"My cat" is 私の 猫: の, not が, links the owner to the noun.',
    },
  ],
  references: ['tae-kim', 'makino-tsutsui'],
  alignment: { jlpt: 'N5', tags: ['no'] },
};
