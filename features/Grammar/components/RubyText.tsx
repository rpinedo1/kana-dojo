'use client';

import { Fragment } from 'react';
import { cn } from '@/shared/utils/utils';
import { parseRuby } from '../lib/ruby';
import { useGrammarStore } from '../store/useGrammarStore';
import type { RubyText as RubyTextValue } from '../types';

interface RubyTextProps {
  text: RubyTextValue;
  className?: string;
  /** Overrides the learner's furigana setting */
  showFurigana?: boolean;
  /** Classes for the reading text (defaults to the secondary colour) */
  rtClassName?: string;
}

/** Renders ruby notation ('学生[がくせい]') as Japanese with optional furigana. */
const RubyText = ({
  text,
  className,
  showFurigana,
  rtClassName = 'text-(--secondary-color)',
}: RubyTextProps) => {
  const furiganaSetting = useGrammarStore(state => state.showFurigana);
  const withFurigana = showFurigana ?? furiganaSetting;

  return (
    <span
      lang='ja'
      // Break only at the authored word spaces, not inside words.
      className={cn('leading-[1.9] [word-break:keep-all]', className)}
    >
      {parseRuby(text).map((segment, index) =>
        segment.reading && withFurigana ? (
          // ruby-align: center keeps readings (and wide-reading bases) compact
          // instead of spreading the characters apart (Chrome 128+, Safari 18.2+).
          <ruby key={index} className='[ruby-align:center]'>
            {segment.text}
            <rp>(</rp>
            <rt className={cn('text-[0.5em] font-normal', rtClassName)}>
              {segment.reading}
            </rt>
            <rp>)</rp>
          </ruby>
        ) : (
          <Fragment key={index}>{segment.text}</Fragment>
        ),
      )}
    </span>
  );
};

export default RubyText;
