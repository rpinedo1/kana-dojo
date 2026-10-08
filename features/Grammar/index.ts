// ============================================================================
// Grammar Feature - Public API
// ============================================================================

export * from './types';
export { grammarCourse, grammarPacks } from './data';
export { gradeExercise, describeTileAnswer } from './lib/grade';
export { normalizeJapanese } from './lib/normalize';
export { validatePack } from './lib/validate';
export { useGrammarStore, GRAMMAR_STORAGE_KEY } from './store/useGrammarStore';

export { default as GrammarDojo } from './components/GrammarDojo';
export { default as LessonView } from './components/LessonView';
export { default as ReviewSession } from './components/ReviewSession';
