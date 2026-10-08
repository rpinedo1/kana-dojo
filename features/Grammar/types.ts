// ============================================================================
// Grammar Dojo - Content & Progress Types
// ============================================================================
//
// Japanese text in lesson content uses inline ruby notation so that kana
// readings stay next to the kanji they annotate:
//
//   '私[わたし]は 学生[がくせい]です。'
//
// A bracketed reading applies to the run of kanji immediately before it.
// Spaces are display-only word breaks and are ignored when grading.
// See features/Grammar/lib/ruby.ts and docs/grammar/AUTHORING.md.

/** Japanese text in inline ruby notation, e.g. '学生[がくせい]です' */
export type RubyText = string;

/** Speech register of an example. */
export type Register = 'polite' | 'casual';

export interface GrammarSentence {
  /** Japanese in ruby notation */
  jp: RubyText;
  /** Romaji scaffold (shown only when the learner enables romaji) */
  romaji: string;
  /** English meaning */
  en: string;
  /** Learner-friendly syllable guide, e.g. 'wa-ta-shi wa ga-ku-see de(s)' */
  pronunciation?: string;
  register?: Register;
}

export interface GrammarConcept {
  /** Stable ID. Never rename once shipped: progress is keyed by it. */
  id: string;
  name: string;
  /** One-line rule used in feedback */
  summary: string;
  /** Lesson that introduces the concept */
  lessonId: string;
}

export interface BreakdownPart {
  part: RubyText;
  romaji: string;
  role: string;
  note: string;
}

export interface CommonMistake {
  wrong: RubyText;
  right: RubyText;
  why: string;
  /**
   * 'error' (default): ungrammatical or wrong. 'unnatural': grammatical but
   * sounds off; shown with a softer marker instead of a cross.
   */
  kind?: 'error' | 'unnatural';
}

export interface RegisterPair {
  polite: GrammarSentence;
  casual: GrammarSentence;
  note: string;
}

export interface DialogueLine {
  speaker: string;
  sentence: GrammarSentence;
}

export interface Dialogue {
  title: string;
  setting: string;
  lines: DialogueLine[];
}

export interface LessonVocab {
  jp: RubyText;
  romaji: string;
  en: string;
}

// ----------------------------------------------------------------------------
// Exercises
// ----------------------------------------------------------------------------

interface ExerciseBase {
  /** Stable ID, unique across all packs. */
  id: string;
  /** Concept this exercise measures */
  conceptId: string;
  /** Instruction shown above the exercise */
  instruction: string;
  /** Rule-based explanation shown after submission */
  explanation: string;
  /** Optional nudge offered during guided practice (never in checkpoints) */
  hint?: string;
}

export interface ChoiceOption {
  id: string;
  text: string;
}

/** 1. Choose the correct English meaning of a Japanese sentence. */
export interface MeaningExercise extends ExerciseBase {
  type: 'meaning';
  sentence: GrammarSentence;
  options: ChoiceOption[];
  correctOptionId: string;
}

/** 2. Fill a blank with a particle. `before`/`after` surround the blank. */
export interface ParticleExercise extends ExerciseBase {
  type: 'particle';
  before: RubyText;
  after: RubyText;
  /** English meaning that disambiguates the intended particle */
  context: string;
  options: string[];
  /** Every particle that is correct in this context (e.g. に and へ) */
  accepted: string[];
  /** The completed sentence, shown in feedback */
  sentence: GrammarSentence;
}

/**
 * 3. Sentence building: arrange every tile into a sentence.
 * 4. Reverse practice: build Japanese from an English meaning; the tile bank
 *    may contain distractors that must be left out.
 */
export interface TileExercise extends ExerciseBase {
  type: 'build' | 'reverse';
  /** English meaning shown as the target */
  prompt: string;
  /** Explicit constraint, e.g. 'Use all tiles.' or 'Build the polite version.' */
  constraint: string;
  tiles: RubyText[];
  /** Tiles that are not part of any accepted answer */
  distractors?: RubyText[];
  /**
   * Accepted arrangements, each an ordered list of tiles. The first entry is
   * the model answer shown in feedback. Every valid order that satisfies the
   * constraint must be listed.
   */
  accepted: RubyText[][];
  /** Meaning shown in feedback for the model answer */
  sentence: GrammarSentence;
}

/** 5. Error correction: tap the wrong part, then choose the fix. */
export interface ErrorExercise extends ExerciseBase {
  type: 'error';
  /** Sentence containing exactly one beginner mistake, split into parts */
  parts: RubyText[];
  /** Index into `parts` of the mistaken part */
  errorIndex: number;
  /** Replacement options for the mistaken part */
  fixOptions: RubyText[];
  /** Every replacement that makes the sentence correct */
  acceptedFixes: RubyText[];
  /** The corrected sentence, shown in feedback */
  sentence: GrammarSentence;
}

export type GrammarExercise =
  | MeaningExercise
  | ParticleExercise
  | TileExercise
  | ErrorExercise;

export type ExerciseType = GrammarExercise['type'];

/** Learner response, by exercise type. */
export type ExerciseResponse =
  | { type: 'meaning'; optionId: string }
  | { type: 'particle'; particle: string }
  | { type: 'build' | 'reverse'; tiles: RubyText[] }
  | { type: 'error'; partIndex: number; fix: RubyText };

export interface GradeResult {
  correct: boolean;
  /** Partial credit details used for feedback (error correction only) */
  foundError?: boolean;
}

// ----------------------------------------------------------------------------
// Lessons & packs
// ----------------------------------------------------------------------------

/**
 * Optional metadata for aligning lessons with external courses later.
 * Nothing in the app depends on these fields.
 */
export interface CourseAlignment {
  jlpt?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  tags?: string[];
  /** Free-form pointers, e.g. 'Genki I ch.1 (topic: X は Y です)' */
  externalRefs?: string[];
}

export interface GrammarLesson {
  /** Stable ID. Never rename once shipped: progress is keyed by it. */
  id: string;
  number: number;
  title: string;
  titleJa: RubyText;
  summary: string;
  /** Concepts introduced in this lesson */
  conceptIds: string[];
  /** Lessons that should be completed first */
  prerequisites: string[];
  explanation: string[];
  pattern: {
    formula: string;
    example: GrammarSentence;
  };
  breakdown: BreakdownPart[];
  examples: GrammarSentence[];
  pronunciationNotes: string[];
  mnemonic?: string;
  commonMistakes: CommonMistake[];
  register?: RegisterPair[];
  /** Mini-dialogues that combine patterns */
  dialogues?: Dialogue[];
  vocabulary: LessonVocab[];
  /** Guided practice: hints allowed, retry allowed */
  practice: GrammarExercise[];
  /** Graded checkpoint */
  checkpoint: GrammarExercise[];
  /** IDs into the pack's reference list */
  references: string[];
  /** Linguistic points flagged for review instead of being over-explained */
  reviewFlags?: string[];
  alignment?: CourseAlignment;
}

export interface GrammarReference {
  id: string;
  title: string;
  url?: string;
  note: string;
}

export interface GrammarPack {
  id: string;
  title: string;
  description: string;
  level: string;
  concepts: GrammarConcept[];
  lessons: GrammarLesson[];
  references: GrammarReference[];
}

// ----------------------------------------------------------------------------
// Progress (browser-local)
// ----------------------------------------------------------------------------

export interface ConceptAttempt {
  correct: boolean;
  /** Practice session that produced the attempt */
  sessionId: string;
  at: number;
}

export interface ConceptProgress {
  attempts: number;
  correct: number;
  /** Most recent attempts, newest last (capped) */
  recent: ConceptAttempt[];
  /** Distinct session IDs that produced a correct answer (capped) */
  correctSessions: string[];
  masteredAt?: number;
}

export interface CheckpointResult {
  attempts: number;
  bestScore: number;
  lastScore: number;
  total: number;
  passed: boolean;
  lastAttemptAt: number;
}

export interface LessonProgress {
  startedAt?: number;
  readAt?: number;
  practiceCompletedAt?: number;
  completedAt?: number;
  checkpoint?: CheckpointResult;
}

export interface ReviewItem {
  conceptId: string;
  addedAt: number;
  missedExerciseIds: string[];
  /** Session of the most recent miss; answers in that session do not count */
  lastMissSessionId?: string;
  /** Correct answers in a row, from later sessions, since the most recent miss */
  correctSinceMiss: number;
}

export type ConceptStatus = 'new' | 'learning' | 'review' | 'mastered';
