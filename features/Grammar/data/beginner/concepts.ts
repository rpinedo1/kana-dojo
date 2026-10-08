import type { GrammarConcept } from '../../types';

// Concept IDs are stable: learner progress is keyed by them.
export const beginnerConcepts: GrammarConcept[] = [
  {
    id: 'sentence-order',
    name: 'Verb goes last',
    summary:
      'The verb (or です) closes the sentence; other parts come before it.',
    lessonId: 'sentence-order',
  },
  {
    id: 'omitted-subject',
    name: 'Leaving out the subject',
    summary: 'When context makes it clear who you mean, leave the subject out.',
    lessonId: 'sentence-order',
  },
  {
    id: 'topic-wa',
    name: 'Topic は',
    summary: 'は (said "wa") marks the topic: what the sentence is about.',
    lessonId: 'sentence-order',
  },
  {
    id: 'desu-copula',
    name: 'Noun + です',
    summary: 'Noun + です politely says "is / am / are" and ends the sentence.',
    lessonId: 'noun-desu',
  },
  {
    id: 'subject-ga',
    name: 'Subject が',
    summary:
      'が marks the subject, often new information or the answer to "who?".',
    lessonId: 'wa-vs-ga',
  },
  {
    id: 'question-ka',
    name: 'Questions with か',
    summary: 'Add か to the end of a polite sentence to ask a question.',
    lessonId: 'questions-ka',
  },
  {
    id: 'question-words',
    name: 'Question words',
    summary:
      '何 (what), だれ (who), どこ (where) sit where the answer would go.',
    lessonId: 'questions-ka',
  },
  {
    id: 'no-possession',
    name: 'Linking nouns with の',
    summary: 'A の B: A describes or owns B; B is the main noun.',
    lessonId: 'no-possession',
  },
  {
    id: 'wo-object',
    name: 'Object を',
    summary: 'を (said "o") marks the thing the action is done to.',
    lessonId: 'wo-object-verbs',
  },
  {
    id: 'masu-verbs',
    name: 'Polite verbs (〜ます)',
    summary: '〜ます verbs are polite and cover habits and the future.',
    lessonId: 'wo-object-verbs',
  },
  {
    id: 'ni-destination',
    name: 'Destination に / へ',
    summary: 'に or へ (said "e") marks where you go or come to.',
    lessonId: 'ni-de-place-time',
  },
  {
    id: 'ni-time',
    name: 'Time に',
    summary: 'に marks clock times and days; 今日, 明日, 毎日 take no に.',
    lessonId: 'ni-de-place-time',
  },
  {
    id: 'de-location',
    name: 'Action location で',
    summary: 'で marks the place where an action happens.',
    lessonId: 'ni-de-place-time',
  },
  {
    id: 'noun-negative-past',
    name: 'Noun negative & past',
    summary:
      'じゃありません = is not; でした = was; じゃありませんでした = was not.',
    lessonId: 'negative-past',
  },
  {
    id: 'verb-negative-past',
    name: 'Verb negative & past',
    summary: '〜ません = don’t; 〜ました = did; 〜ませんでした = didn’t.',
    lessonId: 'negative-past',
  },
  {
    id: 'i-adjectives',
    name: 'い-adjectives',
    summary:
      'い-adjectives change their ending: 高くない, 高かった. です only adds politeness.',
    lessonId: 'adjectives',
  },
  {
    id: 'na-adjectives',
    name: 'な-adjectives',
    summary:
      'な-adjectives take な before a noun and behave like nouns before です.',
    lessonId: 'adjectives',
  },
  {
    id: 'combining-patterns',
    name: 'Combining patterns',
    summary:
      'Real sentences stack topic, time, place, object and verb—verb last.',
    lessonId: 'mini-dialogues',
  },
];
