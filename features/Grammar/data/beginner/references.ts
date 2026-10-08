import type { GrammarReference } from '../../types';

// Sources used to cross-check instructional claims. Lesson text is original;
// nothing here is copied from these works. See docs/grammar/REFERENCES.md for
// which claims were checked against which source and how.
export const beginnerReferences: GrammarReference[] = [
  {
    id: 'tae-kim',
    title: "Tae Kim's Guide to Learning Japanese",
    url: 'https://guidetojapanese.org/learn/grammar',
    note: 'Free grammar guide; standard reference for は/が, particles, polite forms.',
  },
  {
    id: 'makino-tsutsui',
    title:
      'A Dictionary of Basic Japanese Grammar (Makino & Tsutsui, The Japan Times)',
    note: 'Print reference for particle and copula usage. Recommended for maintainers.',
  },
  {
    id: 'kana-orthography',
    title: 'Historical kana orthography (Wikipedia)',
    url: 'https://en.wikipedia.org/wiki/Historical_kana_orthography',
    note: 'Why particles は, へ, を are written that way but said wa, e, o.',
  },
  {
    id: 'tufs-devoicing',
    title: 'TUFS Language Modules: Japanese pronunciation, vowel devoicing',
    url: 'https://www.coelang.tufs.ac.jp/ja/en/pmod/practical/02-11-01.php',
    note: 'Devoiced high vowels (す in です/ます, し in した) in Tokyo speech.',
  },
  {
    id: 'devoicing-article',
    title: 'Self Taught Japanese: when vowels get quiet',
    url: 'https://selftaughtjapanese.com/2019/03/11/japanese-pronunciation-when-vowels-get-quiet/',
    note: 'Devoicing is common but varies by speaker, speed and region.',
  },
  {
    id: 'genki-time',
    title: 'St. Olaf Japanese: time reference (Genki I ch.3 index)',
    url: 'https://wp.stolaf.edu/japanese/grammar-index/genki-i-ii-grammar-index/time-reference-genki-i-chapter-3/',
    note: 'に with clock times and days; no に with relative time words.',
  },
  {
    id: 'ni-vs-de',
    title: 'に vs で (Gyanmirai)',
    url: 'https://www.gyanmirai.com/blog/ni-vs-de',
    note: 'Choose by verb: action location で, destination/existence に.',
  },
  {
    id: 'nani-nan',
    title: 'When 何 is なに and when it is なん (The Japanese Page)',
    url: 'https://thejapanesepage.com/when-to-use-what/',
    note: 'なん before です, の and counters; なに before を, が and most nouns.',
  },
  {
    id: 'i-adjective-mistakes',
    title: 'Adding だ/でした to い-adjectives (elon.io)',
    url: 'https://elon.io/grammar/japanese/mistakes/i-adjective-da',
    note: '高いでした is a learner error; the past tense lives in the adjective.',
  },
  {
    id: 'kirei-na',
    title: 'Why isn’t きれい an い-adjective? (WaniKani community)',
    url: 'https://community.wanikani.com/t/bunpro-question-why-isnt-%E3%81%8D%E3%82%8C%E3%81%84-considered-an-%E3%81%84-adjective/30174',
    note: 'きれい is a な-adjective; its final い is part of the word.',
  },
];
