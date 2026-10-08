import type { GrammarPack } from '../../types';
import { beginnerConcepts } from './concepts';
import { beginnerReferences } from './references';
import { lesson01 } from './lessons/01-sentence-order';
import { lesson02 } from './lessons/02-noun-desu';
import { lesson03 } from './lessons/03-wa-vs-ga';
import { lesson04 } from './lessons/04-questions-ka';
import { lesson05 } from './lessons/05-no-possession';
import { lesson06 } from './lessons/06-wo-object-verbs';
import { lesson07 } from './lessons/07-ni-de-place-time';
import { lesson08 } from './lessons/08-negative-past';
import { lesson09 } from './lessons/09-adjectives';
import { lesson10 } from './lessons/10-mini-dialogues';

export const beginnerPack: GrammarPack = {
  id: 'beginner',
  title: 'Beginner Grammar',
  description:
    'Ten short lessons on how Japanese sentences work: word order, です, は and が, questions, particles, tense and adjectives.',
  level: 'Beginner (JLPT N5)',
  concepts: beginnerConcepts,
  lessons: [
    lesson01,
    lesson02,
    lesson03,
    lesson04,
    lesson05,
    lesson06,
    lesson07,
    lesson08,
    lesson09,
    lesson10,
  ],
  references: beginnerReferences,
};
