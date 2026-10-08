# Grammar content: references and verification log

All lesson text, examples and exercises are original. No textbook passages or
exercises were copied. References were used to cross-check claims only.

## How claims were checked (first release, 2026-10-08)

A verification pass checked the linguistic claims below with web searches.
**Limitation:** the network proxy blocked opening Wikipedia and Tae Kim's guide
in full, so verdicts are based on search-result content from the listed pages
plus standard reference knowledge. A maintainer with a print reference (e.g.
Makino & Tsutsui) should spot-check the flagged items.

| Claim (where used)                                                              | Verdict                | Sources seen                                                               |
| ------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------- |
| Particles は/へ/を are said wa/e/o (L1, L6, L7)                                 | Verified               | Historical kana orthography (Wikipedia); elon.io particles; JapanesePod101 |
| /u/ in です/ます often devoiced in Tokyo speech, not always silent (L1, L2, L6) | Verified               | TUFS Language Modules; Self Taught Japanese; devoicing module PDF          |
| /i/ in し (した, でした) and /u/ in す (好き) often devoiced (L8, L9)           | Verified               | TUFS; Self Taught Japanese                                                 |
| Verb-final word order; subjects omitted when clear (L1)                         | Verified               | Lehmann, Japanese typology (UT Austin LRC)                                 |
| Question-word subjects take が, not は (L3, L4)                                 | Verified               | WaniKani community; JREF                                                   |
| は = topic / が = subject, new info; no single rule explains all (L3)           | Verified               | UNCW particle notes; JREF                                                  |
| Polite か questions; 。 common, ？ fine (L4)                                    | Verified               | elon.io か; Bunpro                                                         |
| に with clock times/days; none with 今日/明日/毎日 (L7)                         | Verified               | St. Olaf Genki time reference; MIT 21G.501 key                             |
| で = action location; に = destination/existence (L7)                           | Verified               | Gyanmirai; Migaku                                                          |
| じゃありません／でした／じゃありませんでした; ます-forms (L8)                   | Verified               | standard                                                                   |
| い-adj 〜くない/〜かった; いい → よくない; 高いでした is wrong (L9)             | Verified               | elon.io i-adjective mistakes                                               |
| な-adjectives take な before nouns; きれい is a な-adjective (L9)               | Verified               | WaniKani community; italki                                                 |
| Casual questions: 学生？/学生なの？; 学生だ？ is not neutral (L4)               | Needs nuance → applied | Wasabi question markers; Bunpro                                            |
| 何 is なん before です/の/counters, なに before を/が (L4, L6)                  | Needs nuance → applied | The Japanese Page; elon.io                                                 |
| 明日 = あした (あす formal); 今日 = きょう (L1)                                 | Verified               | JREF; tkgje                                                                |

## Deliberate simplifications (shown to learners as "Simplified on purpose")

- **L1** – Scrambled orders such as 明日 私は 行きます are accepted; topic-first
  is the most neutral.
- **L3** – は/が reduced to two beginner uses; contrastive は and
  exhaustive-listing が are mentioned, not tested.
- **L7** – に/へ treated as interchangeable for destinations of 行きます/来ます/帰ります;
  existence に (〜にいます/あります) postponed.
- **L9** – 〜くありません is equally polite but only 〜くないです is taught.

## Open items for a native-speaker review

- Accepted arrangements that are grammatical but marked (e.g. 本を 私は 読みます,
  東京に 田中さんは 日曜日に 行きました) are accepted to avoid rejecting valid
  Japanese. A reviewer may prefer to narrow some prompts with constraints instead.
- Pronunciation respellings (e.g. "ga-ku-see des(u)") are approximations for
  English speakers, not phonetic transcriptions.

## Reference list

See `features/Grammar/data/beginner/references.ts` (shown per lesson via IDs).
Also recommended for maintainers: _A Dictionary of Basic Japanese Grammar_
(Makino & Tsutsui) and Tae Kim's Guide to Learning Japanese.
