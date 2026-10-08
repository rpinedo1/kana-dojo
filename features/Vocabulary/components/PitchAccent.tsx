'use client';
import { toRomaji } from 'wanakana';
import {
  getPitchName,
  getPitchPattern,
  splitMorae,
  type Pitch,
} from '@/features/Vocabulary/lib/pitchAccent';
import { cn } from '@/shared/utils/utils';

interface PitchAccentProps {
  kana: string;
  /** Mora after which the pitch drops; 0 = never drops */
  downstep: number;
  showKana: boolean;
  className?: string;
}

/**
 * The word's sounds with a line over the high ones and a hook where the pitch
 * drops, plus a faint particle (が) to show whether a following word stays high.
 */
const PitchAccent = ({
  kana,
  downstep,
  showKana,
  className,
}: PitchAccentProps) => {
  const morae = splitMorae(kana);
  const { morae: pitches, particle } = getPitchPattern(morae.length, downstep);
  const { name, description } = getPitchName(morae.length, downstep);
  const cells: { label: string; pitch: Pitch; isParticle?: boolean }[] = [
    ...morae.map((mora, i) => ({
      label: showKana ? mora : toRomaji(mora),
      pitch: pitches[i],
    })),
    { label: showKana ? 'が' : 'ga', pitch: particle, isParticle: true },
  ];

  return (
    <span
      className={cn('inline-flex flex-row items-center gap-2', className)}
      title={`${name}: ${description}`}
    >
      <span
        className='inline-flex flex-row items-end'
        aria-label={`Pitch accent: ${name}. ${description}`}
      >
        {cells.map((cell, i) => {
          const dropsAfter = cell.pitch === 'H' && cells[i + 1]?.pitch === 'L';
          return (
            <span
              key={i}
              aria-hidden='true'
              className={cn(
                'border-t-2 border-r-2 border-t-transparent border-r-transparent px-0.5 pt-0.5 leading-tight',
                cell.pitch === 'H' && 'border-t-(--main-color)',
                dropsAfter && 'border-r-(--main-color)',
                cell.isParticle && 'opacity-40',
              )}
            >
              {cell.label}
            </span>
          );
        })}
      </span>
      <span className='text-xs text-(--secondary-color) opacity-80'>
        {name}
      </span>
    </span>
  );
};

export default PitchAccent;
