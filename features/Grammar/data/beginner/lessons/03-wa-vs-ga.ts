import type { GrammarLesson } from '../../../types';
import { s } from '../helpers';

export const lesson03: GrammarLesson = {
  id: 'wa-vs-ga',
  number: 3,
  title: 'Topic は and subject が',
  titleJa: '「は」と「が」',
  summary:
    'Two beginner-safe uses: は for the topic, が for the answer to "who?".',
  conceptIds: ['subject-ga'],
  prerequisites: ['noun-desu'],
  explanation: [
    'は and が can both appear after the person doing something, so they are easy to confuse. They are not interchangeable, and no single rule explains every case—even advanced learners keep refining their feel for them. This lesson gives you two safe starting points.',
    'Use は to set up the topic: something already in the conversation that you are now commenting on. 私は 行きます is "As for me, I will go." は can also suggest a contrast ("I, at least, will go"), which you will notice more later.',
    'Use が when the person or thing doing the action is the new, important information—especially when it answers "who?". If someone asks who is coming, the answer is 田中さんが 来ます: "Tanaka-san (is the one who) will come."',
    'が is also natural for simply describing something that happens, like the weather: 雨が 降ります, "It will rain" (literally "rain will fall").',
  ],
  pattern: {
    formula: 'Known topic は … / New subject が + Verb',
    example: s(
      '田中[たなか]さんが 来[き]ます。',
      'Tanaka-san ga kimasu.',
      '(Answering "Who is coming?") Tanaka-san is coming.',
      'ta-na-ka-san ga ki-mas(u)',
      'polite',
    ),
  },
  breakdown: [
    {
      part: '田中[たなか]さん',
      romaji: 'Tanaka-san',
      role: 'Subject',
      note: 'The new information: the one who comes.',
    },
    {
      part: 'が',
      romaji: 'ga',
      role: 'Subject particle',
      note: 'Points at the subject as the answer.',
    },
    {
      part: '来[き]ます',
      romaji: 'kimasu',
      role: 'Verb (polite)',
      note: '"Come / will come".',
    },
  ],
  examples: [
    s(
      '私[わたし]は 行[い]きます。',
      'Watashi wa ikimasu.',
      'As for me, I will go.',
      'wa-ta-shi wa i-ki-mas(u)',
      'polite',
    ),
    s(
      '山田[やまだ]さんが 行[い]きます。',
      'Yamada-san ga ikimasu.',
      '(Answering "Who will go?") Yamada-san will go.',
      'ya-ma-da-san ga i-ki-mas(u)',
      'polite',
    ),
    s(
      '雨[あめ]が 降[ふ]ります。',
      'Ame ga furimasu.',
      'It will rain.',
      'a-me ga fu-ri-mas(u)',
      'polite',
    ),
    s(
      '田中[たなか]さんは 先生[せんせい]です。',
      'Tanaka-san wa sensei desu.',
      'Tanaka-san is a teacher. (Talking about Tanaka-san.)',
      'ta-na-ka-san wa sen-see des(u)',
      'polite',
    ),
  ],
  pronunciationNotes: [
    'は as a particle is "wa"; が is "ga". In some speakers’ speech the g in が sounds softer, closer to "nga"—both are understood.',
    '来ます is "ki-mas(u)". The dictionary form 来る is read くる, so the kanji 来 has different readings.',
  ],
  mnemonic:
    'は = "speaking of…" (sets the scene). が = "it’s THIS one" (points at the answer).',
  commonMistakes: [
    {
      wrong: '(Who will come?) 田中[たなか]さんは 来[き]ます。',
      right: '(Who will come?) 田中[たなか]さんが 来[き]ます。',
      why: 'When your sentence answers "who?", the answer is new information and takes が. は here sounds like you are changing the topic.',
    },
    {
      wrong: '雨[あめ]わ 降[ふ]ります。',
      right: '雨[あめ]が 降[ふ]ります。',
      why: 'Use が to describe weather happening. (Also, the particle "wa" is always written は, never わ.)',
    },
  ],
  register: [
    {
      polite: s(
        '田中[たなか]さんが 来[き]ます。',
        'Tanaka-san ga kimasu.',
        'Tanaka-san will come.',
        undefined,
        'polite',
      ),
      casual: s(
        '田中[たなか]さんが 来[く]る。',
        'Tanaka-san ga kuru.',
        'Tanaka-san will come.',
        undefined,
        'casual',
      ),
      note: 'The particles do not change between polite and casual speech; only the verb ending does.',
    },
  ],
  vocabulary: [
    { jp: '来[き]ます', romaji: 'kimasu', en: 'come, will come' },
    { jp: '雨[あめ]', romaji: 'ame', en: 'rain' },
    { jp: '降[ふ]ります', romaji: 'furimasu', en: '(rain/snow) falls' },
    { jp: 'が', romaji: 'ga', en: 'subject particle' },
  ],
  practice: [
    {
      id: 'l03-p1',
      type: 'particle',
      conceptId: 'subject-ga',
      instruction: 'Choose the particle for the blank.',
      context: 'Q: "Who will go?"  A: "Tanaka-san will go."',
      before: '田中[たなか]さん',
      after: ' 行[い]きます。',
      options: ['は', 'が'],
      accepted: ['が'],
      sentence: s(
        '田中[たなか]さんが 行[い]きます。',
        'Tanaka-san ga ikimasu.',
        'Tanaka-san will go.',
      ),
      hint: 'Is Tanaka-san the answer to "who?"',
      explanation:
        'Tanaka-san is the answer to "who?"—new information—so が is used.',
    },
    {
      id: 'l03-p2',
      type: 'particle',
      conceptId: 'topic-wa',
      instruction: 'Choose the particle for the blank.',
      context: 'Introducing yourself: "As for me, I am a student."',
      before: '私[わたし]',
      after: ' 学生[がくせい]です。',
      options: ['は', 'が'],
      accepted: ['は'],
      sentence: s(
        '私[わたし]は 学生[がくせい]です。',
        'Watashi wa gakusei desu.',
        'I am a student.',
      ),
      hint: '"As for me…" sets a topic.',
      explanation:
        'You are setting yourself as the topic, so は is used. 私が 学生です would mean "I am the one who is the student".',
    },
    {
      id: 'l03-p3',
      type: 'meaning',
      conceptId: 'subject-ga',
      instruction: 'What does this sentence mean?',
      sentence: s(
        '雨[あめ]が 降[ふ]ります。',
        'Ame ga furimasu.',
        'It will rain.',
      ),
      options: [
        { id: 'a', text: 'It is raining heavily now.' },
        { id: 'b', text: 'It will rain.' },
        { id: 'c', text: 'I like rain.' },
        { id: 'd', text: 'Rain is the topic.' },
      ],
      correctOptionId: 'b',
      hint: '降ります is a 〜ます form: habits or the future.',
      explanation:
        '雨が 降ります describes something happening: "rain will fall", i.e. "it will rain". が marks the subject, 雨.',
    },
    {
      id: 'l03-p4',
      type: 'build',
      conceptId: 'subject-ga',
      instruction: 'Answer the question "Who will come?"',
      prompt: 'Yamada-san will come.',
      constraint: 'Use all tiles.',
      tiles: ['山田[やまだ]さん', 'が', '来[き]ます'],
      accepted: [['山田[やまだ]さん', 'が', '来[き]ます']],
      sentence: s(
        '山田[やまだ]さんが 来[き]ます。',
        'Yamada-san ga kimasu.',
        'Yamada-san will come.',
      ),
      hint: 'Subject, particle, verb.',
      explanation: 'The answer to "who?" takes が, and the verb goes last.',
    },
  ],
  checkpoint: [
    {
      id: 'l03-c1',
      type: 'particle',
      conceptId: 'subject-ga',
      instruction: 'Choose the particle for the blank.',
      context: 'Q: "Who will eat?"  A: "Tanaka-san will eat."',
      before: '田中[たなか]さん',
      after: ' 食[た]べます。',
      options: ['は', 'が'],
      accepted: ['が'],
      sentence: s(
        '田中[たなか]さんが 食[た]べます。',
        'Tanaka-san ga tabemasu.',
        'Tanaka-san will eat.',
      ),
      explanation: 'The answer to "who?" is new information, so it takes が.',
    },
    {
      id: 'l03-c2',
      type: 'particle',
      conceptId: 'topic-wa',
      instruction: 'Choose the particle for the blank.',
      context: 'Introducing yourself: "As for me, I am Yamada."',
      before: '私[わたし]',
      after: ' 山田[やまだ]です。',
      options: ['は', 'が'],
      accepted: ['は'],
      sentence: s(
        '私[わたし]は 山田[やまだ]です。',
        'Watashi wa Yamada desu.',
        'I am Yamada.',
      ),
      explanation:
        'A self-introduction sets yourself as the topic, so は is natural.',
    },
    {
      id: 'l03-c3',
      type: 'error',
      conceptId: 'subject-ga',
      instruction:
        'Someone asks "Who will come?". Tap the mistake in the answer, then fix it.',
      parts: ['田中[たなか]さん', 'は', '来[き]ます'],
      errorIndex: 1,
      fixOptions: ['が', 'は', 'わ'],
      acceptedFixes: ['が'],
      sentence: s(
        '田中[たなか]さんが 来[き]ます。',
        'Tanaka-san ga kimasu.',
        'Tanaka-san will come.',
      ),
      explanation:
        'Answering "who?" calls for が. は would treat Tanaka-san as an old topic rather than the answer.',
    },
    {
      id: 'l03-c4',
      type: 'reverse',
      conceptId: 'subject-ga',
      instruction: 'Build the Japanese sentence.',
      prompt: 'It will rain tomorrow.',
      constraint: 'Not every tile is needed.',
      tiles: ['明日[あした]', '雨[あめ]', 'が', '降[ふ]ります'],
      distractors: ['来[き]ます', 'です'],
      accepted: [
        ['明日[あした]', '雨[あめ]', 'が', '降[ふ]ります'],
        ['雨[あめ]', 'が', '明日[あした]', '降[ふ]ります'],
      ],
      sentence: s(
        '明日[あした] 雨[あめ]が 降[ふ]ります。',
        'Ashita ame ga furimasu.',
        'It will rain tomorrow.',
      ),
      explanation:
        '雨が 降ります describes the weather; 明日 needs no particle. Time first is most natural, but 雨が 明日 降ります is also grammatical.',
    },
    {
      id: 'l03-c5',
      type: 'meaning',
      conceptId: 'subject-ga',
      instruction: 'Someone asked "Who will go?". What does this answer mean?',
      sentence: s(
        '山田[やまだ]さんが 行[い]きます。',
        'Yamada-san ga ikimasu.',
        'Yamada-san will go.',
      ),
      options: [
        { id: 'a', text: 'Yamada-san will come.' },
        { id: 'b', text: 'I will go with Yamada-san.' },
        { id: 'c', text: "It's Yamada-san who will go." },
        { id: 'd', text: 'Will Yamada-san go?' },
      ],
      correctOptionId: 'c',
      explanation:
        'が points at Yamada-san as the answer: "It\'s Yamada-san (who) will go."',
    },
  ],
  references: ['tae-kim', 'makino-tsutsui'],
  reviewFlags: [
    'は/が is deliberately reduced to two beginner uses (topic vs. answer-to-who / describing events). Contrastive は and exhaustive-listing が are only mentioned, not tested.',
  ],
  alignment: { jlpt: 'N5', tags: ['wa-ga'] },
};
