import type {
  ExerciseResponse,
  GrammarExercise,
  GradeResult,
} from '../../types';

export interface ExerciseViewProps<
  T extends GrammarExercise = GrammarExercise,
> {
  exercise: T;
  /** True after the answer is checked: inputs lock and marks appear */
  checked: boolean;
  grade: GradeResult | null;
  onChange: (response: ExerciseResponse | null) => void;
}
