import type { GrammarLesson } from '../../../types';
import { s } from '../helpers';

export const lesson01: GrammarLesson = {
  id: 'sentence-order',
  number: 1,
  title: 'Sentence order & missing subjects',
  titleJa: '文[ぶん]の 順番[じゅんばん]',
  summary: 'The verb goes last, and the subject is often left out.',
  conceptIds: ['sentence-order', 'omitted-subject', 'topic-wa'],
  prerequisites: [],
  explanation: [
    'English puts the verb in the middle: "I go tomorrow." Japanese puts the verb at the very end of the sentence. Everything else—who, when, where—comes before it.',
    'A complete Japanese sentence can be just a verb. 行きます on its own means "(I) will go" or "(someone) goes". When the listener already knows who you are talking about, Japanese simply leaves the subject out. This is normal, not lazy.',
    'When you do want to say what the sentence is about, use the topic particle は after it. 私は 行きます means "As for me, I will go." You will learn more about は in lesson 3.',
    'Because particles like は label each part, the parts before the verb can move around: 私は 明日 行きます and 明日 私は 行きます are both correct. The verb stays last.',
  ],
  pattern: {
    formula: '(Topic は) + (when) + Verb',
    example: s(
      '私[わたし]は 明日[あした] 行[い]きます。',
      'Watashi wa ashita ikimasu.',
      'I will go tomorrow.',
      'wa-ta-shi wa a-shi-ta i-ki-mas(u)',
      'polite',
    ),
  },
  breakdown: [
    { part: '私[わたし]', romaji: 'watashi', role: 'Noun', note: '"I / me".' },
    {
      part: 'は',
      romaji: 'wa',
      role: 'Topic particle',
      note: 'Marks what the sentence is about. Written は, said "wa".',
    },
    {
      part: '明日[あした]',
      romaji: 'ashita',
      role: 'Time word',
      note: '"Tomorrow". Needs no particle.',
    },
    {
      part: '行[い]きます',
      romaji: 'ikimasu',
      role: 'Verb (polite)',
      note: '"Go / will go". Always at the end.',
    },
  ],
  examples: [
    s('行[い]きます。', 'Ikimasu.', '(I) will go.', 'i-ki-mas(u)', 'polite'),
    s(
      '明日[あした] 行[い]きます。',
      'Ashita ikimasu.',
      '(I) will go tomorrow.',
      'a-shi-ta i-ki-mas(u)',
      'polite',
    ),
    s(
      '田中[たなか]さんは 食[た]べます。',
      'Tanaka-san wa tabemasu.',
      'Tanaka-san will eat.',
      'ta-na-ka-san wa ta-be-mas(u)',
      'polite',
    ),
    s(
      '今日[きょう] 食[た]べます。',
      'Kyō tabemasu.',
      '(I) will eat today.',
      'kyoh ta-be-mas(u)',
      'polite',
    ),
  ],
  pronunciationNotes: [
    'The topic particle は is written with the kana for "ha" but always said "wa". Inside ordinary words, は keeps its "ha" sound.',
    'The final す in 〜ます is often whispered or very short in standard Tokyo speech, so 行きます can sound like "ikimas". It is not always fully silent—some speakers and careful speech voice it.',
    'Japanese syllables get roughly equal length: a-shi-ta, not "ASH-ta".',
  ],
  mnemonic:
    'Think of the verb as the full stop of a Japanese sentence: nothing comes after it except a small ending.',
  commonMistakes: [
    {
      wrong: '私[わたし]わ 行[い]きます。',
      right: '私[わたし]は 行[い]きます。',
      why: 'The topic particle sounds like "wa" but is always written は.',
    },
    {
      wrong: '行[い]きます 明日[あした]。',
      right: '明日[あした] 行[い]きます。',
      why: 'In standard sentences the verb comes last. Time words come before it.',
    },
    {
      wrong: '私[わたし]は 行[い]きます。私[わたし]は 食[た]べます。',
      right: '私[わたし]は 行[い]きます。食[た]べます。',
      why: 'Not wrong, but repeating 私は in every sentence sounds unnatural. Once the topic is clear, drop it.',
    },
  ],
  register: [
    {
      polite: s(
        '行[い]きます。',
        'Ikimasu.',
        '(I) will go.',
        undefined,
        'polite',
      ),
      casual: s('行[い]く。', 'Iku.', '(I) will go.', undefined, 'casual'),
      note: '〜ます is the polite form used with strangers, teachers and coworkers. Friends use the plain form (行く). This course practises the polite form; plain forms are shown for recognition only.',
    },
  ],
  vocabulary: [
    { jp: '私[わたし]', romaji: 'watashi', en: 'I, me' },
    {
      jp: '田中[たなか]さん',
      romaji: 'Tanaka-san',
      en: 'Mr./Ms. Tanaka (さん = polite title)',
    },
    { jp: '今日[きょう]', romaji: 'kyō', en: 'today' },
    { jp: '明日[あした]', romaji: 'ashita', en: 'tomorrow' },
    { jp: '行[い]きます', romaji: 'ikimasu', en: 'go, will go' },
    { jp: '食[た]べます', romaji: 'tabemasu', en: 'eat, will eat' },
  ],
  practice: [
    {
      id: 'l01-p1',
      type: 'meaning',
      conceptId: 'omitted-subject',
      instruction:
        'A friend asks about your plans. What does your answer mean?',
      sentence: s(
        '明日[あした] 行[い]きます。',
        'Ashita ikimasu.',
        '(I) will go tomorrow.',
      ),
      options: [
        { id: 'a', text: "I'll go tomorrow." },
        { id: 'b', text: 'Tomorrow is going.' },
        { id: 'c', text: 'I went yesterday.' },
        { id: 'd', text: 'Go tomorrow!' },
      ],
      correctOptionId: 'a',
      hint: 'There is no subject, so it comes from context: you are answering about yourself.',
      explanation:
        'The subject is left out because it is clear from context: you are talking about yourself. 明日 is "tomorrow" and 行きます is "will go".',
    },
    {
      id: 'l01-p2',
      type: 'build',
      conceptId: 'sentence-order',
      instruction: 'Build the sentence.',
      prompt: 'I will go tomorrow.',
      constraint: 'Use all tiles. The verb goes last.',
      tiles: ['私[わたし]は', '明日[あした]', '行[い]きます'],
      accepted: [
        ['私[わたし]は', '明日[あした]', '行[い]きます'],
        ['明日[あした]', '私[わたし]は', '行[い]きます'],
      ],
      sentence: s(
        '私[わたし]は 明日[あした] 行[い]きます。',
        'Watashi wa ashita ikimasu.',
        'I will go tomorrow.',
      ),
      hint: 'Put 行きます at the end. The other two tiles can go in either order.',
      explanation:
        'The verb 行きます must be last. 私は and 明日 can swap places, so both orders are accepted.',
    },
    {
      id: 'l01-p3',
      type: 'error',
      conceptId: 'topic-wa',
      instruction:
        'Tap the part with the spelling mistake, then choose the fix.',
      parts: ['私[わたし]', 'わ', '明日[あした]', '行[い]きます'],
      errorIndex: 1,
      fixOptions: ['は', 'わ', 'ば'],
      acceptedFixes: ['は'],
      sentence: s(
        '私[わたし]は 明日[あした] 行[い]きます。',
        'Watashi wa ashita ikimasu.',
        'I will go tomorrow.',
      ),
      hint: 'The topic particle sounds like "wa"—but how is it written?',
      explanation:
        'The topic particle is said "wa" but written は. わ is never used for the particle.',
    },
    {
      id: 'l01-p4',
      type: 'meaning',
      conceptId: 'topic-wa',
      instruction: 'What does this sentence mean?',
      sentence: s(
        '田中[たなか]さんは 食[た]べます。',
        'Tanaka-san wa tabemasu.',
        'Tanaka-san will eat.',
      ),
      options: [
        { id: 'a', text: 'I will eat with Tanaka-san.' },
        { id: 'b', text: 'Tanaka-san will eat.' },
        { id: 'c', text: 'Tanaka-san will go.' },
        { id: 'd', text: 'Tanaka-san is food.' },
      ],
      correctOptionId: 'b',
      hint: 'は marks who the sentence is about. 食べます is "eat".',
      explanation:
        '田中さんは makes Tanaka-san the topic, and 食べます ("will eat") closes the sentence.',
    },
  ],
  checkpoint: [
    {
      id: 'l01-c1',
      type: 'build',
      conceptId: 'sentence-order',
      instruction: 'Build the sentence.',
      prompt: 'Tanaka-san will eat today.',
      constraint: 'Use all tiles.',
      tiles: ['田中[たなか]さんは', '今日[きょう]', '食[た]べます'],
      accepted: [
        ['田中[たなか]さんは', '今日[きょう]', '食[た]べます'],
        ['今日[きょう]', '田中[たなか]さんは', '食[た]べます'],
      ],
      sentence: s(
        '田中[たなか]さんは 今日[きょう] 食[た]べます。',
        'Tanaka-san wa kyō tabemasu.',
        'Tanaka-san will eat today.',
      ),
      explanation:
        'The verb 食べます goes last. The topic and the time word can come in either order.',
    },
    {
      id: 'l01-c2',
      type: 'reverse',
      conceptId: 'omitted-subject',
      instruction: 'Answer as the speaker, without saying "I".',
      prompt: "I'll go today.",
      constraint: 'Leave out the subject. Not every tile is needed.',
      tiles: ['今日[きょう]', '行[い]きます'],
      distractors: ['食[た]べます', '私[わたし]は'],
      accepted: [['今日[きょう]', '行[い]きます']],
      sentence: s(
        '今日[きょう] 行[い]きます。',
        'Kyō ikimasu.',
        "(I)'ll go today.",
      ),
      explanation:
        'When it is clear you mean yourself, drop 私は. The time word comes first and the verb last.',
    },
    {
      id: 'l01-c3',
      type: 'meaning',
      conceptId: 'omitted-subject',
      instruction:
        'Someone asks what you will do today. What does your answer mean?',
      sentence: s(
        '今日[きょう] 食[た]べます。',
        'Kyō tabemasu.',
        "(I)'ll eat today.",
      ),
      options: [
        { id: 'a', text: 'Today eats.' },
        { id: 'b', text: 'I ate today.' },
        { id: 'c', text: "I'll eat today." },
        { id: 'd', text: "I'll go today." },
      ],
      correctOptionId: 'c',
      explanation:
        'No subject is spoken, so it is "I" from context. 〜ます here describes something you will do.',
    },
    {
      id: 'l01-c4',
      type: 'error',
      conceptId: 'topic-wa',
      instruction:
        'Tap the part with the spelling mistake, then choose the fix.',
      parts: ['田中[たなか]さん', 'わ', '今日[きょう]', '行[い]きます'],
      errorIndex: 1,
      fixOptions: ['わ', 'は', 'ぱ'],
      acceptedFixes: ['は'],
      sentence: s(
        '田中[たなか]さんは 今日[きょう] 行[い]きます。',
        'Tanaka-san wa kyō ikimasu.',
        'Tanaka-san will go today.',
      ),
      explanation: 'The topic particle is pronounced "wa" but written は.',
    },
  ],
  references: [
    'tae-kim',
    'kana-orthography',
    'tufs-devoicing',
    'devoicing-article',
  ],
  reviewFlags: [
    'Scrambled orders (e.g. 明日 私は 行きます) are accepted as correct. They are grammatical, though the topic-first order is the most neutral.',
  ],
  alignment: { jlpt: 'N5', tags: ['word-order', 'zero-pronoun'] },
};
