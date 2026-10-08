import type { GrammarLesson } from '../../../types';
import { permutationsWithTail, s } from '../helpers';

export const lesson08: GrammarLesson = {
  id: 'negative-past',
  number: 8,
  title: 'Negative & past forms',
  titleJa: '〜ません・〜ました',
  summary: 'Say "isn’t", "was", "didn’t" and "did" for nouns and polite verbs.',
  conceptIds: ['noun-negative-past', 'verb-negative-past'],
  prerequisites: ['ni-de-place-time'],
  explanation: [
    'Japanese marks tense and negation at the end of the sentence, on です or on the verb. The rest of the sentence does not change.',
    'Nouns: 学生です (is a student) → 学生じゃありません (is not) → 学生でした (was) → 学生じゃありませんでした (was not). じゃ is the everyday form of では; ではありません sounds more formal, and 学生じゃないです is also common and polite.',
    'Polite verbs: swap 〜ます for 〜ません (don’t / won’t), 〜ました (did), or 〜ませんでした (didn’t). 行きます → 行きません → 行きました → 行きませんでした.',
    'Japanese does not add a separate past-tense word like "did". The ending carries everything, so the order of the endings matters: negative first (ません), then past (でした).',
  ],
  pattern: {
    formula:
      'Noun じゃありません／でした／じゃありませんでした ・ Verb〜ません／〜ました／〜ませんでした',
    example: s(
      '昨日[きのう] 図書館[としょかん]に 行[い]きませんでした。',
      'Kinō toshokan ni ikimasen deshita.',
      "I didn't go to the library yesterday.",
      'ki-noh to-sho-kan ni i-ki-ma-sen de-shi-ta',
      'polite',
    ),
  },
  breakdown: [
    {
      part: '昨日[きのう]',
      romaji: 'kinō',
      role: 'Time word',
      note: '"Yesterday". No particle needed.',
    },
    {
      part: '図書館[としょかん]に',
      romaji: 'toshokan ni',
      role: 'Destination',
      note: '"To the library".',
    },
    {
      part: '行[い]き',
      romaji: 'iki',
      role: 'Verb stem',
      note: 'From 行きます.',
    },
    {
      part: 'ませんでした',
      romaji: 'masen deshita',
      role: 'Polite past negative',
      note: '"Did not". ません (not) + でした (past).',
    },
  ],
  examples: [
    s(
      '私[わたし]は 先生[せんせい]じゃありません。',
      'Watashi wa sensei ja arimasen.',
      "I'm not a teacher.",
      'wa-ta-shi wa sen-see ja a-ri-ma-sen',
      'polite',
    ),
    s(
      '昨日[きのう]は 日曜日[にちようび]でした。',
      'Kinō wa nichiyōbi deshita.',
      'Yesterday was Sunday.',
      'ki-noh wa ni-chi-yoh-bi de-shi-ta',
      'polite',
    ),
    s(
      '田中[たなか]さんは 学生[がくせい]じゃありませんでした。',
      'Tanaka-san wa gakusei ja arimasen deshita.',
      "Tanaka-san wasn't a student.",
      'ta-na-ka-san wa ga-ku-see ja a-ri-ma-sen de-shi-ta',
      'polite',
    ),
    s(
      'コーヒーを 飲[の]みました。',
      'Kōhī o nomimashita.',
      'I drank coffee.',
      'koh-hee o no-mi-ma-shi-ta',
      'polite',
    ),
    s(
      'テレビを 見[み]ません。',
      'Terebi o mimasen.',
      "I don't watch TV.",
      'te-re-bi o mi-ma-sen',
      'polite',
    ),
  ],
  pronunciationNotes: [
    'In でした and ました, the い in し is often whispered, so they can sound like "desh’ta" and "mash’ta". This varies by speaker and is not required.',
    'ません ends with ん: "ma-sen", with the ん held as its own beat.',
  ],
  mnemonic:
    'ません = "not" (n for no). ました = "done" (ta for past). ませんでした = "not" + "done".',
  commonMistakes: [
    {
      wrong: '行[い]きましたません。',
      right: '行[い]きませんでした。',
      why: 'Negative comes first (ません), then past (でした).',
    },
    {
      wrong: '昨日[きのう]は 日曜日[にちようび]です。',
      right: '昨日[きのう]は 日曜日[にちようび]でした。',
      why: 'Yesterday is in the past, so です changes to でした.',
    },
    {
      wrong: '学生[がくせい]でしたじゃありません。',
      right: '学生[がくせい]じゃありませんでした。',
      why: 'For "was not", say じゃありません first, then add でした.',
    },
  ],
  register: [
    {
      polite: s(
        '学生[がくせい]じゃありません。',
        'Gakusei ja arimasen.',
        "(I'm) not a student.",
        undefined,
        'polite',
      ),
      casual: s(
        '学生[がくせい]じゃない。',
        'Gakusei ja nai.',
        "(I'm) not a student.",
        undefined,
        'casual',
      ),
      note: 'Casual noun negative is じゃない; past is だった. Adding です (学生じゃないです) makes the casual form polite again.',
    },
    {
      polite: s(
        '行[い]きませんでした。',
        'Ikimasen deshita.',
        "(I) didn't go.",
        undefined,
        'polite',
      ),
      casual: s(
        '行[い]かなかった。',
        'Ikanakatta.',
        "(I) didn't go.",
        undefined,
        'casual',
      ),
      note: 'Casual verb forms depend on the verb group and are taught in a later pack. Recognise them for now.',
    },
  ],
  vocabulary: [
    { jp: '昨日[きのう]', romaji: 'kinō', en: 'yesterday' },
    {
      jp: 'じゃありません',
      romaji: 'ja arimasen',
      en: 'is not (after a noun)',
    },
    { jp: 'でした', romaji: 'deshita', en: 'was' },
    { jp: '〜ません', romaji: '-masen', en: "don't / won't" },
    { jp: '〜ました', romaji: '-mashita', en: 'did' },
    { jp: '〜ませんでした', romaji: '-masen deshita', en: "didn't" },
  ],
  practice: [
    {
      id: 'l08-p1',
      type: 'meaning',
      conceptId: 'verb-negative-past',
      instruction: 'What does this sentence mean?',
      sentence: s(
        '昨日[きのう] 図書館[としょかん]に 行[い]きませんでした。',
        'Kinō toshokan ni ikimasen deshita.',
        "I didn't go to the library yesterday.",
      ),
      options: [
        { id: 'a', text: "I won't go to the library tomorrow." },
        { id: 'b', text: 'I went to the library yesterday.' },
        { id: 'c', text: "I didn't go to the library yesterday." },
        { id: 'd', text: "I don't go to the library." },
      ],
      correctOptionId: 'c',
      hint: 'ません = not, でした = past.',
      explanation:
        '〜ませんでした is the polite past negative: "didn’t". 昨日 = yesterday.',
    },
    {
      id: 'l08-p2',
      type: 'build',
      conceptId: 'noun-negative-past',
      instruction: 'Build the sentence.',
      prompt: "I'm not a teacher.",
      constraint: 'Use all tiles.',
      tiles: ['私[わたし]', 'は', '先生[せんせい]', 'じゃありません'],
      accepted: [['私[わたし]', 'は', '先生[せんせい]', 'じゃありません']],
      sentence: s(
        '私[わたし]は 先生[せんせい]じゃありません。',
        'Watashi wa sensei ja arimasen.',
        "I'm not a teacher.",
      ),
      hint: 'じゃありません replaces です.',
      explanation:
        'じゃありません replaces です to make a noun sentence negative.',
    },
    {
      id: 'l08-p3',
      type: 'error',
      conceptId: 'noun-negative-past',
      instruction: 'Tap the incorrect part, then choose the fix.',
      parts: ['昨日[きのう]', 'は', '日曜日[にちようび]', 'です'],
      errorIndex: 3,
      fixOptions: ['でした', 'ました', 'じゃありません'],
      acceptedFixes: ['でした'],
      sentence: s(
        '昨日[きのう]は 日曜日[にちようび]でした。',
        'Kinō wa nichiyōbi deshita.',
        'Yesterday was Sunday.',
      ),
      hint: 'Yesterday is in the past.',
      explanation:
        'Yesterday is past, so です becomes でした. ました is for verbs only.',
    },
    {
      id: 'l08-p4',
      type: 'reverse',
      conceptId: 'verb-negative-past',
      instruction: 'Build the Japanese sentence.',
      prompt: 'I drank coffee.',
      constraint: 'Not every tile is needed.',
      tiles: ['コーヒー', 'を', '飲[の]みました'],
      distractors: ['飲[の]みます', 'でした'],
      accepted: [['コーヒー', 'を', '飲[の]みました']],
      sentence: s(
        'コーヒーを 飲[の]みました。',
        'Kōhī o nomimashita.',
        'I drank coffee.',
      ),
      hint: 'Which ending means "did"?',
      explanation:
        '〜ました is the polite past. 飲みます would be present/future.',
    },
  ],
  checkpoint: [
    {
      id: 'l08-c1',
      type: 'reverse',
      conceptId: 'noun-negative-past',
      instruction: 'Build the Japanese sentence.',
      prompt: "Tanaka-san wasn't a student.",
      constraint: 'Not every tile is needed.',
      tiles: [
        '田中[たなか]さん',
        'は',
        '学生[がくせい]',
        'じゃありませんでした',
      ],
      distractors: ['でした', 'じゃありません'],
      accepted: [
        ['田中[たなか]さん', 'は', '学生[がくせい]', 'じゃありませんでした'],
      ],
      sentence: s(
        '田中[たなか]さんは 学生[がくせい]じゃありませんでした。',
        'Tanaka-san wa gakusei ja arimasen deshita.',
        "Tanaka-san wasn't a student.",
      ),
      explanation:
        '"Was not" for a noun is じゃありませんでした: negative (じゃありません) + past (でした).',
    },
    {
      id: 'l08-c2',
      type: 'meaning',
      conceptId: 'noun-negative-past',
      instruction: 'What does this sentence mean?',
      sentence: s(
        '私[わたし]は 学生[がくせい]じゃありません。',
        'Watashi wa gakusei ja arimasen.',
        "I'm not a student.",
      ),
      options: [
        { id: 'a', text: "I wasn't a student." },
        { id: 'b', text: "I'm not a student." },
        { id: 'c', text: 'I was a student.' },
        { id: 'd', text: 'Am I a student?' },
      ],
      correctOptionId: 'b',
      explanation:
        'じゃありません is present negative ("is not"). The past would add でした.',
    },
    {
      id: 'l08-c3',
      type: 'error',
      conceptId: 'verb-negative-past',
      instruction:
        'The speaker means "Yesterday, I didn\'t watch TV." Tap the incorrect part, then fix it.',
      parts: ['昨日[きのう]', 'テレビを', '見[み]ません'],
      errorIndex: 2,
      fixOptions: ['見[み]ませんでした', '見[み]ました', '見[み]ます'],
      acceptedFixes: ['見[み]ませんでした'],
      sentence: s(
        '昨日[きのう] テレビを 見[み]ませんでした。',
        'Kinō terebi o mimasen deshita.',
        "Yesterday, I didn't watch TV.",
      ),
      explanation:
        'Yesterday is past and the meaning is negative, so the verb needs 〜ませんでした.',
    },
    {
      id: 'l08-c4',
      type: 'build',
      conceptId: 'verb-negative-past',
      instruction: 'Build the sentence.',
      prompt: 'I went to Tokyo yesterday.',
      constraint: 'Use all tiles.',
      tiles: ['昨日[きのう]', '東京[とうきょう]に', '行[い]きました'],
      accepted: permutationsWithTail(
        ['昨日[きのう]', '東京[とうきょう]に'],
        ['行[い]きました'],
      ),
      sentence: s(
        '昨日[きのう] 東京[とうきょう]に 行[い]きました。',
        'Kinō Tōkyō ni ikimashita.',
        'I went to Tokyo yesterday.',
      ),
      explanation:
        '〜ました is the polite past. The verb stays last; 昨日 and 東京に can swap.',
    },
  ],
  references: ['tae-kim', 'makino-tsutsui', 'tufs-devoicing'],
  alignment: { jlpt: 'N5', tags: ['negative', 'past'] },
};
