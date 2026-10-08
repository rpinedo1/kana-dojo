'use client';

import { useMemo, useState } from 'react';
import type { MeaningExercise } from '../../types';
import { shuffled } from '../../lib/session';
import RubyText from '../RubyText';
import ChoiceButton from './ChoiceButton';
import type { ExerciseViewProps } from './types';
import { useGrammarStore } from '../../store/useGrammarStore';

const MeaningView = ({
  exercise,
  checked,
  onChange,
}: ExerciseViewProps<MeaningExercise>) => {
  const options = useMemo(() => shuffled(exercise.options), [exercise]);
  const [selected, setSelected] = useState<string | null>(null);
  const showRomaji = useGrammarStore(state => state.showRomaji);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1 rounded-2xl bg-(--card-color) p-4'>
        <RubyText
          text={exercise.sentence.jp}
          className='text-2xl md:text-3xl'
        />
        {showRomaji && (
          <span className='text-sm text-(--secondary-color) italic'>
            {exercise.sentence.romaji}
          </span>
        )}
      </div>
      <div
        role='radiogroup'
        aria-label={exercise.instruction}
        className='grid gap-2 sm:grid-cols-2'
      >
        {options.map(option => (
          <ChoiceButton
            key={option.id}
            selected={selected === option.id}
            disabled={checked}
            mark={
              checked
                ? option.id === exercise.correctOptionId
                  ? 'correct'
                  : selected === option.id
                    ? 'wrong'
                    : null
                : null
            }
            onSelect={() => {
              setSelected(option.id);
              onChange({ type: 'meaning', optionId: option.id });
            }}
          >
            {option.text}
          </ChoiceButton>
        ))}
      </div>
    </div>
  );
};

export default MeaningView;
