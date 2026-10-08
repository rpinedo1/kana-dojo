import { toHiragana } from '@/features/Kana/lib/kanaAudio';

export interface KanaPhonetic {
  /** English sound-alike, e.g. "shee (as in 'sheep')" */
  hint: string;
  /** When the kana sounds different from its usual reading */
  note?: string;
}

const R_TAP =
  "Japanese r is a light tap of the tongue, between English r, l and d (like the 'tt' in American 'butter').";
const YOON = 'Said as one quick beat, not two separate sounds (not "kee-yah").';
const V_SOUND =
  'Many speakers say a plain b-sound instead: ヴァイオリン (violin) is often "baiorin".';

// Keyed by hiragana; katakana shares the same entry (カ uses か).
const phonetics: Record<string, KanaPhonetic> = {
  // Vowels
  あ: { hint: "ah (as in 'father')" },
  い: {
    hint: "ee (as in 'see')",
    note: 'After an e-sound it usually stretches that vowel: せんせい sounds like "sen-seh".',
  },
  う: {
    hint: "oo (as in 'food'), with relaxed lips",
    note: 'After an o-sound it stretches that vowel: ありがとう ends in a long "toh".',
  },
  え: { hint: "eh (as in 'bed')" },
  お: { hint: "oh (as in 'note', but short and pure)" },

  // K
  か: { hint: "kah (as in 'car')" },
  き: { hint: "kee (as in 'key')" },
  く: { hint: "koo (as in 'cool')" },
  け: { hint: "keh (as in 'kept')" },
  こ: { hint: "koh (as in 'coat')" },

  // S
  さ: { hint: "sah (as in 'saw')" },
  し: {
    hint: "shee (as in 'sheep')",
    note: 'The "ee" is often whispered between hard sounds: した sounds like "shta".',
  },
  す: {
    hint: "soo (as in 'soup')",
    note: 'At the end of words the "oo" is often nearly silent: です sounds like "dess", ます like "mass".',
  },
  せ: { hint: "seh (as in 'set')" },
  そ: { hint: "soh (as in 'so')" },

  // T
  た: { hint: "tah (as in 'top', British)" },
  ち: { hint: "chee (as in 'cheese')" },
  つ: {
    hint: "tsoo ('ts' as in 'cats')",
    note: 'Written small (っ/ッ) it is a short pause that doubles the next consonant: きって sounds like "kit-teh".',
  },
  て: { hint: "teh (as in 'ten')" },
  と: { hint: "toh (as in 'toe')" },

  // N
  な: { hint: "nah (as in 'not', British)" },
  に: { hint: "nee (as in 'knee')" },
  ぬ: { hint: "noo (as in 'noodle')" },
  ね: { hint: "neh (as in 'net')" },
  の: { hint: "noh (as in 'no')" },

  // H
  は: {
    hint: "hah (as in 'ha!')",
    note: 'As the topic particle it is said "wa": わたしは sounds like "watashi wa".',
  },
  ひ: { hint: "hee (as in 'he', breathy like the start of 'huge')" },
  ふ: {
    hint: 'foo, softly (blow through your lips, no teeth)',
    note: 'Between English h and f: your upper teeth should not touch your lip.',
  },
  へ: {
    hint: "heh (as in 'hen')",
    note: 'As the direction particle it is said "e": がっこうへ sounds like "gakkou e".',
  },
  ほ: { hint: "hoh (as in 'hope')" },

  // M
  ま: { hint: "mah (as in 'ma')" },
  み: { hint: "mee (as in 'me')" },
  む: { hint: "moo (as in 'moon')" },
  め: { hint: "meh (as in 'met')" },
  も: { hint: "moh (as in 'mow')" },

  // Y
  や: {
    hint: "yah (as in 'yacht')",
    note: 'Written small after an "i" kana it blends into one beat: き + ゃ = きゃ "kyah".',
  },
  ゆ: {
    hint: "yoo (as in 'you')",
    note: 'Written small after an "i" kana it blends into one beat: し + ゅ = しゅ "shoo".',
  },
  よ: {
    hint: "yoh (as in 'yo')",
    note: 'Written small after an "i" kana it blends into one beat: ち + ょ = ちょ "choh".',
  },

  // R
  ら: { hint: 'rah (tapped r)', note: R_TAP },
  り: { hint: 'ree (tapped r)', note: R_TAP },
  る: { hint: 'roo (tapped r)', note: R_TAP },
  れ: { hint: 'reh (tapped r)', note: R_TAP },
  ろ: { hint: 'roh (tapped r)', note: R_TAP },

  // W and N
  わ: { hint: "wah (as in 'want', British)" },
  を: {
    hint: 'oh (same sound as お)',
    note: 'Only used as the object particle: ほんをよむ sounds like "hon o yomu".',
  },
  ん: {
    hint: "n (as in 'pen'), held for a full beat",
    note: 'Changes with the next sound: "m" before m/b/p (さんぽ "sampo"), "ng" before k/g (りんご "ringo").',
  },

  // G
  が: { hint: "gah (as in 'got', British)" },
  ぎ: { hint: "ghee (hard g, as in 'geese')" },
  ぐ: { hint: "goo (as in 'goose')" },
  げ: { hint: "geh (as in 'get')" },
  ご: { hint: "goh (as in 'go')" },

  // Z
  ざ: { hint: "zah (as in 'pizza' without the t)" },
  じ: { hint: "jee (as in 'jeep')" },
  ず: { hint: "zoo (as in 'zoo')" },
  ぜ: { hint: "zeh (as in 'zest')" },
  ぞ: { hint: "zoh (as in 'zone')" },

  // D
  だ: { hint: "dah (as in 'dot', British)" },
  ぢ: {
    hint: "jee (as in 'jeep')",
    note: 'Sounds exactly like じ. Rare; mostly in compounds like はなぢ (nosebleed).',
  },
  づ: {
    hint: "zoo (as in 'zoo')",
    note: 'Sounds exactly like ず. Rare; mostly in compounds like つづく (to continue).',
  },
  で: { hint: "deh (as in 'den')" },
  ど: { hint: "doh (as in 'dough')" },

  // B
  ば: { hint: "bah (as in 'bar')" },
  び: { hint: "bee (as in 'bee')" },
  ぶ: { hint: "boo (as in 'boot')" },
  べ: { hint: "beh (as in 'bed')" },
  ぼ: { hint: "boh (as in 'boat')" },

  // P
  ぱ: { hint: "pah (as in 'pa')" },
  ぴ: { hint: "pee (as in 'peak')" },
  ぷ: { hint: "poo (as in 'pool')" },
  ぺ: { hint: "peh (as in 'pet')" },
  ぽ: { hint: "poh (as in 'pole')" },

  // Combination sounds (yōon)
  きゃ: { hint: "kyah (as in 'Kyoto' with 'ah')", note: YOON },
  きゅ: { hint: "kyoo (as in 'cute')", note: YOON },
  きょ: { hint: "kyoh (as in 'Kyoto')", note: YOON },
  ぎゃ: { hint: "gyah (hard g + 'yah')", note: YOON },
  ぎゅ: { hint: "gyoo (as in 'argue')", note: YOON },
  ぎょ: { hint: "gyoh (as in 'gyoza')", note: YOON },
  しゃ: { hint: "shah (as in 'shop', British)", note: YOON },
  しゅ: { hint: "shoo (as in 'shoe')", note: YOON },
  しょ: { hint: "shoh (as in 'show')", note: YOON },
  じゃ: { hint: "jah (as in 'jar')", note: YOON },
  じゅ: { hint: "joo (as in 'June')", note: YOON },
  じょ: { hint: "joh (as in 'Joe')", note: YOON },
  ちゃ: { hint: "chah (as in 'cha-cha')", note: YOON },
  ちゅ: { hint: "choo (as in 'choose')", note: YOON },
  ちょ: { hint: "choh (as in 'chose')", note: YOON },
  にゃ: { hint: "nyah (as in 'lasagna')", note: YOON },
  にゅ: { hint: "nyoo (as in 'menu')", note: YOON },
  にょ: { hint: "nyoh ('ny' + 'oh')", note: YOON },
  みゃ: { hint: "myah ('my' + 'ah')", note: YOON },
  みゅ: { hint: "myoo (as in 'music')", note: YOON },
  みょ: { hint: "myoh ('my' + 'oh')", note: YOON },
  りゃ: { hint: "ryah (tapped r + 'yah')", note: `${YOON} ${R_TAP}` },
  りゅ: { hint: "ryoo (tapped r + 'you')", note: `${YOON} ${R_TAP}` },
  りょ: { hint: "ryoh (tapped r + 'yo')", note: `${YOON} ${R_TAP}` },
  ひゃ: { hint: "hyah ('h' + 'yah')", note: YOON },
  ひゅ: { hint: "hyoo (as in 'huge')", note: YOON },
  ひょ: { hint: "hyoh ('h' + 'yo')", note: YOON },
  びゃ: { hint: "byah ('b' + 'yah')", note: YOON },
  びゅ: { hint: "byoo (as in 'beautiful')", note: YOON },
  びょ: { hint: "byoh ('b' + 'yo')", note: YOON },
  ぴゃ: { hint: "pyah ('p' + 'yah')", note: YOON },
  ぴゅ: { hint: "pyoo (as in 'pew')", note: YOON },
  ぴょ: { hint: "pyoh ('p' + 'yo')", note: YOON },

  // Foreign-sound katakana (stored as hiragana keys)
  ふぁ: { hint: "fah (as in 'father')" },
  ふぃ: { hint: "fee (as in 'feet')" },
  ふぇ: { hint: "feh (as in 'fed')" },
  ふぉ: { hint: "foh (as in 'phone')" },
  ふゅ: { hint: "fyoo (as in 'few')" },
  うぃ: { hint: "wee (as in 'week')" },
  うぇ: { hint: "weh (as in 'wet')" },
  うぉ: { hint: "woh (as in 'woke')" },
  ゔぁ: { hint: "vah (as in 'vast')", note: V_SOUND },
  ゔぃ: { hint: "vee (as in 'veal')", note: V_SOUND },
  ゔ: { hint: "voo (as in 'voodoo')", note: V_SOUND },
  ゔぇ: { hint: "veh (as in 'vet')", note: V_SOUND },
  ゔぉ: { hint: "voh (as in 'vote')", note: V_SOUND },
  てぃ: { hint: "tee (as in 'tea')" },
  とぅ: { hint: "too (as in 'two')" },
  でぃ: { hint: "dee (as in 'deep')" },
  どぅ: { hint: "doo (as in 'do')" },
  しぇ: { hint: "sheh (as in 'shed')" },
  すぃ: { hint: "see (as in 'see')" },
  ちぇ: { hint: "cheh (as in 'check')" },
  じぇ: { hint: "jeh (as in 'jet')" },
  つぁ: { hint: "tsah ('ts' + 'ah')" },
  つぃ: { hint: "tsee ('ts' + 'ee')" },
  つぇ: { hint: "tseh ('ts' + 'eh')" },
  つぉ: { hint: "tsoh ('ts' + 'oh')" },
};

/** Sound-alike hint for a kana (hiragana or katakana), if one exists. */
export const getKanaPhonetic = (char: string): KanaPhonetic | undefined =>
  phonetics[toHiragana(char)];
