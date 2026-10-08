'use client';

import type { ReactNode } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/shared/utils/utils';

export type ChoiceMark = 'correct' | 'wrong' | null;

interface ChoiceButtonProps {
  selected: boolean;
  mark?: ChoiceMark;
  disabled?: boolean;
  onSelect: () => void;
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}

/** Selectable answer used by meaning, particle and error exercises. */
const ChoiceButton = ({
  selected,
  mark = null,
  disabled,
  onSelect,
  children,
  ariaLabel,
  className,
}: ChoiceButtonProps) => (
  <button
    type='button'
    role='radio'
    aria-checked={selected}
    aria-label={ariaLabel}
    disabled={disabled}
    onClick={onSelect}
    className={cn(
      'relative flex min-h-12 items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-left text-lg',
      'border-b-4 transition-all duration-150',
      'focus-visible:ring-2 focus-visible:ring-(--main-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--background-color) focus-visible:outline-none',
      !disabled && 'cursor-pointer active:translate-y-[2px] active:border-b-2',
      mark === 'correct'
        ? 'border-(--main-color-accent) bg-(--main-color) text-(--background-color)'
        : mark === 'wrong'
          ? 'border-(--border-color) bg-(--card-color) text-(--secondary-color) line-through decoration-2'
          : selected
            ? 'border-(--secondary-color-accent) bg-(--secondary-color) text-(--background-color)'
            : 'border-(--border-color) bg-(--card-color) text-(--main-color) hover:bg-(--border-color)',
      disabled && !mark && 'opacity-60',
      className,
    )}
  >
    <span className='flex-1'>{children}</span>
    {mark === 'correct' && <Check aria-hidden className='h-5 w-5 shrink-0' />}
    {mark === 'wrong' && <X aria-hidden className='h-5 w-5 shrink-0' />}
  </button>
);

export default ChoiceButton;
