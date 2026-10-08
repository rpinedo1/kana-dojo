# Grammar Dojo

A beginner grammar course that **teaches before it tests**: each lesson explains
a pattern, then runs guided practice and a graded checkpoint. Everything runs
in the browser; there is no account, database, paid API or AI grading.

Routes (under the `(main)` sidebar layout, like Kana/Vocabulary/Kanji):

| Route                 | Purpose                                                  |
| --------------------- | -------------------------------------------------------- |
| `/grammar`            | Course overview, progress, concept accuracy, lesson list |
| `/grammar/[lessonId]` | Lesson: Learn → Practice → Checkpoint tabs               |
| `/grammar/review`     | Review session built from missed concepts                |

## Architecture

```
features/Grammar/
  types.ts                 Content + progress types (the content contract)
  data/
    index.ts               Registered packs (grammarPacks, grammarCourse)
    beginner/
      concepts.ts          Stable concept IDs
      references.ts        Sources used to cross-check content
      helpers.ts           s() sentence shorthand, permutationsWithTail()
      lessons/NN-*.ts      One file per lesson (content only, no logic)
  lib/
    ruby.ts                '学生[がくせい]' ruby notation parser
    normalize.ts           Whitespace/punctuation/width normalisation
    grade.ts               Pure grading + "why was this wrong" feedback
    validate.ts            Content validator (run by tests)
    mastery.ts             Mastery rule + review queue
    session.ts             Checkpoint pass mark, review session builder
  store/useGrammarStore.ts Zustand + localStorage persistence (versioned)
  components/              Rendering only; no grading logic
  __tests__/               Grading, variants, validation, mastery, persistence
```

Content is plain typed data, grading is pure functions, and components only
render. A new pack needs no component changes.

### Exercise types

| Type       | Learner action                                    | Graded by                             |
| ---------- | ------------------------------------------------- | ------------------------------------- |
| `meaning`  | Choose the English meaning                        | `correctOptionId`                     |
| `particle` | Fill the blank (particle, な, か…)                | any of `accepted`                     |
| `build`    | Tap every tile into order                         | any arrangement in `accepted`         |
| `reverse`  | Build Japanese from English; bank has distractors | any arrangement in `accepted`         |
| `error`    | Tap the wrong part, then choose the fix           | `errorIndex` + any of `acceptedFixes` |

Tile answers are compared after normalisation (ruby readings, whitespace,
full-width spaces and sentence punctuation removed; NFKC). Japanese allows
several word orders, so **every valid order that satisfies the stated
constraint must be listed in `accepted`**; `permutationsWithTail()` helps when
any order of the pre-verb phrases is grammatical. The first arrangement is the
model answer shown in feedback; the others are shown as "Also accepted".

Feedback always shows the correct sentence, its meaning, the exercise
explanation and the concept rule, plus a specific reason when possible
(a distractor was used, tiles were left out, the order is wrong, the wrong part
was picked, or the right part got the wrong fix).

### Accessibility and touch

- Tiles are `<button>`s: tap to add, tap to remove, **Reset** clears. No dragging.
- Each tile has an `aria-label` ("Add 私は", "Remove 私は, position 1"); the
  current sentence is announced through a polite live region.
- Choices use `role="radio"`; correctness is shown with icons and text, not
  colour alone. Focus moves to the feedback panel after Check and back to the
  question on Continue.

## Progress, mastery and review

Stored in `localStorage` under **`kanadojo-grammar-progress`** (a new key; no
existing KanaDojo data is read or changed). The store is versioned
(`GRAMMAR_STORE_VERSION`); `migrateGrammarProgress()` and
`sanitizeGrammarProgress()` drop malformed data instead of crashing. Add a
migration step there when the shape changes.

Recorded per lesson: started/read/practice-completed/completed timestamps and
checkpoint attempts, best score, last score and pass. Recorded per concept:
attempts, correct answers, recent attempts and the sessions that produced
correct answers. Only the **first** submission of each exercise in a session
counts (practice retries do not inflate accuracy).

**Checkpoint pass:** at least 80% correct (`CHECKPOINT_PASS_RATIO`). A pass is
kept even if a later retry scores lower. Passing completes the lesson.

**Mastery rule** (`lib/mastery.ts`): a concept is mastered when it has

1. at least 4 correct answers in total,
2. its 3 most recent attempts all correct, and
3. correct answers from at least 2 separate sessions (practice run,
   checkpoint attempt or review session).

One correct answer, or a long streak within one sitting, is never mastery, and
a later wrong answer removes mastery until the streak is rebuilt.

**Review queue:** any wrong first answer adds the concept (and the missed
exercise) to the queue. It leaves after 2 correct answers in a row **from a
later session** than the miss, so retrying straight after the explanation does
not clear it. `/grammar/review` serves missed exercises first, then other
exercises for the same concept (max 3 per concept, 8 per session).

## Adding a lesson

1. Create `features/Grammar/data/beginner/lessons/11-your-topic.ts` exporting a
   `GrammarLesson` (copy an existing lesson as a template). Give it a new
   kebab-case `id`, the next `number`, and `prerequisites` pointing at earlier
   lessons.
2. Add any new concepts to `concepts.ts` with `lessonId` set to the new lesson,
   and list them in the lesson's `conceptIds`.
3. Write Japanese in ruby notation: every kanji run needs a kana reading,
   e.g. `'日本語[にほんご]を 勉強[べんきょう]します'`. Spaces are display-only.
4. Add at least 3 `practice` and 3 `checkpoint` exercises. Checkpoints must not
   have hints. Give each exercise a globally unique `id` and an `explanation`
   tied to the rule. For tile exercises, state the constraint explicitly
   ("Use all tiles.", "Not every tile is needed.", "Build the polite
   version.") and list every valid arrangement.
5. Import the lesson in `data/beginner/index.ts` and append it to `lessons`.
6. Run `npx vitest run features/Grammar`. The content test validates IDs,
   readings, prerequisite order (no concept tested before it is taught),
   answers that rebuild the feedback sentence, tile arrangements that use every
   tile, and grades every authored answer.
7. Add references for new claims to `references.ts` and note them in
   [REFERENCES.md](./REFERENCES.md). Flag simplifications in `reviewFlags`
   rather than over-explaining.

A new **pack** is a new `data/<pack>/index.ts` exporting a `GrammarPack`,
registered in `data/index.ts`. IDs (lessons, concepts, exercises) are progress
keys: never rename them once shipped.

Optional `alignment` metadata (`jlpt`, `tags`, `externalRefs`) exists so lessons
can later be mapped to an external course; nothing depends on it yet.

## Localisation

UI strings live in the `grammar` namespace (`core/i18n/locales/{en,es}/grammar.json`);
English is the fallback. Lesson content is English-only for now.

## Screenshots

See [`screenshots/`](./screenshots): desktop and iPhone-sized (390×844) views
of the dojo, a lesson, the sentence builder and feedback.
