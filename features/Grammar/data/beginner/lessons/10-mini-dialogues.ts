import type { GrammarLesson } from '../../../types';
import { permutationsWithTail, s } from '../helpers';

export const lesson10: GrammarLesson = {
  id: 'mini-dialogues',
  number: 10,
  title: 'Putting it together: mini-dialogues',
  titleJa: '会話[かいわ]',
  summary:
    'Combine topics, questions, places, times and tenses in short conversations.',
  conceptIds: ['combining-patterns'],
  prerequisites: ['adjectives'],
  explanation: [
    'Real conversations stack the patterns you already know. A typical polite sentence is: (topic は) + time + place + object + verb. Only the parts the listener needs are said out loud.',
    'Questions keep the same order and add か. Answers often drop everything the question already said: 何を 食べましたか → すしを 食べました, or just すしです.',
    'X は？ (with rising intonation) is a short way to turn a question back: 山田さんは？ "And you, Yamada-san?"',
    'Read the dialogues below, then try the exercises. Each exercise reuses a rule from an earlier lesson; the feedback tells you which one.',
  ],
  pattern: {
    formula: '(Topic は) + Time + Place + Object + Verb',
    example: s(
      '日曜日[にちようび]に 図書館[としょかん]で 本[ほん]を 読[よ]みます。',
      'Nichiyōbi ni toshokan de hon o yomimasu.',
      "On Sunday I'll read books at the library.",
      'ni-chi-yoh-bi ni to-sho-kan de hon o yo-mi-mas(u)',
      'polite',
    ),
  },
  breakdown: [
    {
      part: '日曜日[にちようび]に',
      romaji: 'nichiyōbi ni',
      role: 'When',
      note: 'Day + に (lesson 7).',
    },
    {
      part: '図書館[としょかん]で',
      romaji: 'toshokan de',
      role: 'Where (action)',
      note: 'Place + で (lesson 7).',
    },
    {
      part: '本[ほん]を',
      romaji: 'hon o',
      role: 'What',
      note: 'Object + を (lesson 6).',
    },
    {
      part: '読[よ]みます',
      romaji: 'yomimasu',
      role: 'Verb',
      note: 'Polite, last (lessons 1 & 6).',
    },
  ],
  examples: [
    s(
      '日曜日[にちようび]に 何[なに]を しますか。',
      'Nichiyōbi ni nani o shimasu ka.',
      'What will you do on Sunday?',
      'ni-chi-yoh-bi ni na-ni o shi-mas(u) ka',
      'polite',
    ),
    s(
      '昨日[きのう] 何[なに]を 食[た]べましたか。',
      'Kinō nani o tabemashita ka.',
      'What did you eat yesterday?',
      'ki-noh na-ni o ta-be-ma-shi-ta ka',
      'polite',
    ),
  ],
  dialogues: [
    {
      title: 'Weekend plans',
      setting: 'Two classmates, Tanaka (A) and Yamada (B), talk on Friday.',
      lines: [
        {
          speaker: 'A',
          sentence: s(
            '日曜日[にちようび]に 何[なに]を しますか。',
            'Nichiyōbi ni nani o shimasu ka.',
            'What will you do on Sunday?',
            undefined,
            'polite',
          ),
        },
        {
          speaker: 'B',
          sentence: s(
            '図書館[としょかん]で 本[ほん]を 読[よ]みます。',
            'Toshokan de hon o yomimasu.',
            "I'll read books at the library.",
            undefined,
            'polite',
          ),
        },
        {
          speaker: 'A',
          sentence: s(
            'いいですね。',
            'Ii desu ne.',
            'That sounds nice.',
            undefined,
            'polite',
          ),
        },
        {
          speaker: 'B',
          sentence: s(
            '田中[たなか]さんは？',
            'Tanaka-san wa?',
            'How about you, Tanaka-san?',
            undefined,
            'polite',
          ),
        },
        {
          speaker: 'A',
          sentence: s(
            '東京[とうきょう]に 行[い]きます。',
            'Tōkyō ni ikimasu.',
            "I'm going to Tokyo.",
            undefined,
            'polite',
          ),
        },
      ],
    },
    {
      title: 'Yesterday’s dinner',
      setting: 'Coworkers chat on Monday morning.',
      lines: [
        {
          speaker: 'A',
          sentence: s(
            '昨日[きのう] 何[なに]を 食[た]べましたか。',
            'Kinō nani o tabemashita ka.',
            'What did you eat yesterday?',
            undefined,
            'polite',
          ),
        },
        {
          speaker: 'B',
          sentence: s(
            'すしを 食[た]べました。とても おいしかったです。',
            'Sushi o tabemashita. Totemo oishikatta desu.',
            'I ate sushi. It was very delicious.',
            undefined,
            'polite',
          ),
        },
        {
          speaker: 'A',
          sentence: s(
            '高[たか]かったですか。',
            'Takakatta desu ka.',
            'Was it expensive?',
            undefined,
            'polite',
          ),
        },
        {
          speaker: 'B',
          sentence: s(
            'いいえ、高[たか]くなかったです。',
            'Iie, takakunakatta desu.',
            "No, it wasn't expensive.",
            undefined,
            'polite',
          ),
        },
      ],
    },
  ],
  pronunciationNotes: [
    'いいですね is often said quickly: "ii des ne", with the す of です whispered.',
    'Short return questions like 田中さんは？ rely on rising intonation—without it, they sound unfinished.',
  ],
  mnemonic: 'When (に) → Where (で) → What (を) → Do (verb). "WWW-Do".',
  commonMistakes: [
    {
      wrong:
        '日曜日[にちようび]に 図書館[としょかん]に 本[ほん]を 読[よ]みました。',
      right:
        '日曜日[にちようび]に 図書館[としょかん]で 本[ほん]を 読[よ]みました。',
      why: 'Two に in a row is a hint to check: the library is where reading happens, so it takes で.',
    },
    {
      wrong: 'これは だれの 本[ほん]です。',
      right: 'これは だれの 本[ほん]ですか。',
      why: 'A question with a question word still needs か in polite speech.',
    },
  ],
  register: [
    {
      polite: s(
        '何[なに]を 食[た]べましたか。',
        'Nani o tabemashita ka.',
        'What did you eat?',
        undefined,
        'polite',
      ),
      casual: s(
        '何[なに] 食[た]べた？',
        'Nani tabeta?',
        'What did you eat?',
        undefined,
        'casual',
      ),
      note: 'Between friends, を and か are often dropped and the plain past (食べた) is used, with rising intonation.',
    },
  ],
  vocabulary: [
    { jp: 'します', romaji: 'shimasu', en: 'do' },
    { jp: 'とても', romaji: 'totemo', en: 'very' },
    {
      jp: 'いいですね',
      romaji: 'ii desu ne',
      en: 'that sounds good (ね seeks agreement)',
    },
    { jp: '会話[かいわ]', romaji: 'kaiwa', en: 'conversation' },
  ],
  practice: [
    {
      id: 'l10-p1',
      type: 'meaning',
      conceptId: 'combining-patterns',
      instruction: 'What does this question mean?',
      sentence: s(
        '日曜日[にちようび]に 何[なに]を しますか。',
        'Nichiyōbi ni nani o shimasu ka.',
        'What will you do on Sunday?',
      ),
      options: [
        { id: 'a', text: 'What did you do on Sunday?' },
        { id: 'b', text: 'Where will you go on Sunday?' },
        { id: 'c', text: 'What will you do on Sunday?' },
        { id: 'd', text: 'Is Sunday a holiday?' },
      ],
      correctOptionId: 'c',
      hint: 'します = do. Is it past?',
      explanation:
        '日曜日に = on Sunday; 何を = what (object); しますか = will (you) do? 〜ます is not past.',
    },
    {
      id: 'l10-p2',
      type: 'build',
      conceptId: 'combining-patterns',
      instruction: 'Build the sentence.',
      prompt: "On Sunday I'll read books at the library.",
      constraint: 'Use all tiles.',
      tiles: [
        '日曜日[にちようび]に',
        '図書館[としょかん]で',
        '本[ほん]を',
        '読[よ]みます',
      ],
      accepted: permutationsWithTail(
        ['日曜日[にちようび]に', '図書館[としょかん]で', '本[ほん]を'],
        ['読[よ]みます'],
      ),
      sentence: s(
        '日曜日[にちようび]に 図書館[としょかん]で 本[ほん]を 読[よ]みます。',
        'Nichiyōbi ni toshokan de hon o yomimasu.',
        "On Sunday I'll read books at the library.",
      ),
      hint: 'When → where → what → verb.',
      explanation:
        'Any order is accepted as long as 読みます is last. When → where → what is the most neutral.',
    },
    {
      id: 'l10-p3',
      type: 'particle',
      conceptId: 'wo-object',
      instruction: 'Choose the particle for the blank.',
      context: '"What did you eat yesterday?"',
      before: '昨日[きのう] 何[なに]',
      after: ' 食[た]べましたか。',
      options: ['を', 'が', 'に'],
      accepted: ['を'],
      sentence: s(
        '昨日[きのう] 何[なに]を 食[た]べましたか。',
        'Kinō nani o tabemashita ka.',
        'What did you eat yesterday?',
      ),
      hint: '"What" is the thing eaten.',
      explanation: '何 is the object of 食べました, so it takes を (lesson 6).',
    },
    {
      id: 'l10-p4',
      type: 'error',
      conceptId: 'de-location',
      instruction:
        'The speaker means "On Sunday I read books at the library." Tap the mistake, then fix it.',
      parts: [
        '日曜日[にちようび]',
        'に',
        '図書館[としょかん]',
        'に',
        '本[ほん]を',
        '読[よ]みました',
      ],
      errorIndex: 3,
      fixOptions: ['で', 'へ', 'を'],
      acceptedFixes: ['で'],
      sentence: s(
        '日曜日[にちようび]に 図書館[としょかん]で 本[ほん]を 読[よ]みました。',
        'Nichiyōbi ni toshokan de hon o yomimashita.',
        'On Sunday I read books at the library.',
      ),
      hint: 'One に is for time. What about the place where you read?',
      explanation:
        'The first に is correct (time). The library is where reading happens, so it takes で (lesson 7).',
    },
  ],
  checkpoint: [
    {
      id: 'l10-c1',
      type: 'reverse',
      conceptId: 'combining-patterns',
      instruction: 'Build the Japanese question.',
      prompt: 'What did you eat yesterday?',
      constraint: 'Not every tile is needed.',
      tiles: ['昨日[きのう]', '何[なに]', 'を', '食[た]べましたか'],
      distractors: ['食[た]べますか', 'が'],
      accepted: [
        ['昨日[きのう]', '何[なに]', 'を', '食[た]べましたか'],
        ['何[なに]', 'を', '昨日[きのう]', '食[た]べましたか'],
      ],
      sentence: s(
        '昨日[きのう] 何[なに]を 食[た]べましたか。',
        'Kinō nani o tabemashita ka.',
        'What did you eat yesterday?',
      ),
      explanation:
        'Past question: 〜ましたか. 何 is the object, so 何を. Time first is most natural.',
    },
    {
      id: 'l10-c2',
      type: 'meaning',
      conceptId: 'i-adjectives',
      instruction:
        'A friend asks "Was it expensive?". What does your answer mean?',
      sentence: s(
        'いいえ、高[たか]くなかったです。',
        'Iie, takakunakatta desu.',
        "No, it wasn't expensive.",
      ),
      options: [
        { id: 'a', text: "No, it isn't expensive." },
        { id: 'b', text: "No, it wasn't expensive." },
        { id: 'c', text: 'Yes, it was expensive.' },
        { id: 'd', text: 'No, it will be expensive.' },
      ],
      correctOptionId: 'b',
      explanation:
        '高くなかった = wasn’t expensive: くない (not) + かった (past), from lesson 9.',
    },
    {
      id: 'l10-c3',
      type: 'particle',
      conceptId: 'topic-wa',
      instruction: 'Choose the particle for the blank.',
      context:
        'Turning the question back: "And you, Yamada-san—what will you do?"',
      before: '山田[やまだ]さん',
      after: ' 何[なに]を しますか。',
      options: ['は', 'が', 'を'],
      accepted: ['は'],
      sentence: s(
        '山田[やまだ]さんは 何[なに]を しますか。',
        'Yamada-san wa nani o shimasu ka.',
        'And you, Yamada-san—what will you do?',
      ),
      explanation:
        'You are switching the topic to Yamada-san, so は is natural. (The question word here is 何, the object.)',
    },
    {
      id: 'l10-c4',
      type: 'build',
      conceptId: 'combining-patterns',
      instruction: 'Build the sentence.',
      prompt: 'Tanaka-san went to Tokyo on Sunday.',
      constraint: 'Use all tiles.',
      tiles: [
        '田中[たなか]さんは',
        '日曜日[にちようび]に',
        '東京[とうきょう]に',
        '行[い]きました',
      ],
      accepted: permutationsWithTail(
        ['田中[たなか]さんは', '日曜日[にちようび]に', '東京[とうきょう]に'],
        ['行[い]きました'],
      ),
      sentence: s(
        '田中[たなか]さんは 日曜日[にちようび]に 東京[とうきょう]に 行[い]きました。',
        'Tanaka-san wa nichiyōbi ni Tōkyō ni ikimashita.',
        'Tanaka-san went to Tokyo on Sunday.',
      ),
      explanation:
        'Topic, time (に), destination (に), then the past verb last. The particles keep the meaning clear in any order.',
    },
    {
      id: 'l10-c5',
      type: 'error',
      conceptId: 'question-ka',
      instruction:
        'The speaker wants to ask "Whose book is this?" politely. Tap the mistake, then fix it.',
      parts: ['これは', 'だれの', '本[ほん]', 'です'],
      errorIndex: 3,
      fixOptions: ['ですか', 'でした', 'じゃありません'],
      acceptedFixes: ['ですか'],
      sentence: s(
        'これは だれの 本[ほん]ですか。',
        'Kore wa dare no hon desu ka.',
        'Whose book is this?',
      ),
      explanation:
        'A polite question needs か at the end, even with a question word (lesson 4).',
    },
  ],
  references: ['tae-kim', 'makino-tsutsui'],
  alignment: { jlpt: 'N5', tags: ['review', 'dialogue'] },
};
