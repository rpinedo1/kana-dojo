'use client';

import clsx from 'clsx';
import type { IKanjiObj } from '@/features/Kanji/store/useKanjiStore';
import {
  useAudioPreferences,
  useThemePreferences,
} from '@/features/Preferences';
import { usePronunciation } from '@/features/Preferences/hooks/usePronunciation';
import FuriganaText from '@/shared/ui-composite/text/FuriganaText';
import { useClick } from '@/shared/hooks/generic/useAudio';
import { removeVerbDuplicates } from '@/shared/utils/meanings';
import { getReadingClipSrc, parseReading } from '@/features/Kanji/lib/readings';
import {
  getCachedReadingExamples,
  getReadingExamples,
  type ReadingExample,
  type ReadingExamples,
} from '@/features/Kanji/services/readingExamplesService';
import { Volume2 } from 'lucide-react';
import { memo, useEffect, useState } from 'react';

type KanjiSetDictionaryProps = {
  words: IKanjiObj[];
};

const READING_TYPES = {
  on: {
    label: 'On',
    hint: 'Chinese-origin reading, mostly used in compound words',
  },
  kun: {
    label: 'Kun',
    hint: 'Native Japanese reading, used on its own or with trailing kana',
  },
} as const;

type ReadingListProps = {
  kanjiChar: string;
  readings: string[];
  type: keyof typeof READING_TYPES;
  examples: Record<string, ReadingExample> | undefined;
  showKana: boolean;
  onPlay: (text: string, clipSrcs: string[] | null) => void;
  pronunciationEnabled: boolean;
};

const ReadingList = ({
  kanjiChar,
  readings,
  type,
  examples,
  showKana,
  onPlay,
  pronunciationEnabled,
}: ReadingListProps) => {
  const { playClick } = useClick();
  const visible = readings.filter(Boolean);
  if (visible.length === 0) return null;

  return (
    <div className='flex flex-col gap-1'>
      <a
        className='hover:text-underline w-full text-xs text-(--main-color)/80 hover:text-(--main-color)'
        href='https://lingopie.com/blog/onyomi-vs-kunyomi/'
        target='_blank'
        rel='noopener'
        title={READING_TYPES[type].hint}
        onClick={() => {
          playClick();
        }}
      >
        {READING_TYPES[type].label}
      </a>
      <div className='flex flex-row flex-wrap gap-2'>
        {visible.map(raw => {
          const reading = parseReading(raw);
          const clipSrc = getReadingClipSrc(reading);
          const example = examples?.[raw];
          const canPlay = pronunciationEnabled && !!reading.spoken;

          return (
            <div
              key={raw}
              className='flex min-w-[8rem] flex-1 flex-col rounded-xl bg-(--background-color) px-2 py-1.5'
            >
              <button
                type='button'
                onClick={() =>
                  onPlay(reading.spoken, clipSrc ? [clipSrc] : null)
                }
                disabled={!canPlay}
                className={clsx(
                  'group flex flex-row items-center gap-2 bg-transparent text-sm text-(--secondary-color) md:text-base',
                  canPlay
                    ? 'hover:cursor-pointer md:hover:text-(--main-color)'
                    : 'cursor-not-allowed opacity-70',
                )}
                aria-label={`Play pronunciation for ${kanjiChar} ${type === 'on' ? "on'yomi" : "kun'yomi"} ${reading.spoken}`}
              >
                <span>
                  {showKana ? reading.kana : reading.romaji || reading.kana}
                </span>
                <span
                  className={clsx(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--card-color) text-(--main-color)',
                    'transition-colors duration-200',
                    canPlay && 'md:group-hover:bg-(--main-color)/15',
                  )}
                >
                  <Volume2 size={15} className='fill-current' />
                </span>
              </button>
              {example && <ExampleWord example={example} onPlay={onPlay} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ExampleWord = ({
  example: [word, kana, meaning, soundsLike],
  onPlay,
}: {
  example: ReadingExample;
  onPlay: (text: string, clipSrcs: string[] | null) => void;
}) => (
  <button
    type='button'
    onClick={() => onPlay(kana, null)}
    className='text-left text-xs text-(--secondary-color) opacity-80 hover:cursor-pointer hover:opacity-100'
    title={`Play ${word} (${kana})`}
  >
    <span lang='ja'>
      e.g. {word} ({kana})
    </span>{' '}
    · {meaning.split(',')[0]}
    {soundsLike && (
      <span className='block'>
        Sounds like <span lang='ja'>{soundsLike}</span> in this word
      </span>
    )}
  </button>
);

const KanjiSetDictionary = memo(function KanjiSetDictionary({
  words,
}: KanjiSetDictionaryProps) {
  const { playClick } = useClick();
  const { displayKana: showKana } = useThemePreferences();
  const { pronunciationEnabled } = useAudioPreferences();
  const { play } = usePronunciation();
  const [examples, setExamples] = useState<ReadingExamples | null>(
    getCachedReadingExamples,
  );

  useEffect(() => {
    if (examples) return;
    let cancelled = false;
    void getReadingExamples().then(data => {
      if (!cancelled) setExamples(data);
    });
    return () => {
      cancelled = true;
    };
  }, [examples]);

  const playReading = (text: string, clipSrcs: string[] | null) => {
    void play(text, clipSrcs);
  };

  return (
    <div className={clsx('flex flex-col')}>
      {words.map((kanjiObj, i) => (
        <div
          key={kanjiObj.id}
          className={clsx(
            'flex flex-col items-center justify-start gap-2 py-4 max-md:px-4',
            i !== words.length - 1 && 'border-b-1 border-(--border-color)',
          )}
        >
          <div className='flex w-full flex-row gap-4'>
            <a
              className='group relative flex aspect-square w-full max-w-[100px] items-center justify-center hover:cursor-pointer'
              href={`http://kanjiheatmap.com/?open=${kanjiObj.kanjiChar}`}
              rel='noopener'
              target='_blank'
              onClick={() => {
                playClick();
              }}
            >
              {/* 4-segment square background */}
              <div className='absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-xl border-1 border-(--border-color) bg-(--background-color) transition-all group-hover:bg-(--card-color)'>
                <div className='border-r border-b border-(--border-color)'></div>
                <div className='border-b border-(--border-color)'></div>
                <div className='border-r border-(--border-color)'></div>
                <div className=''></div>
              </div>

              <FuriganaText
                text={kanjiObj.kanjiChar}
                reading={kanjiObj.onyomi[0] || kanjiObj.kunyomi[0]}
                className='relative z-10 pb-2 text-7xl'
                lang='ja'
              />
            </a>

            <div className='flex w-full flex-col gap-2'>
              <ReadingList
                kanjiChar={kanjiObj.kanjiChar}
                readings={kanjiObj.onyomi}
                type='on'
                examples={examples?.[kanjiObj.kanjiChar]}
                showKana={showKana}
                onPlay={playReading}
                pronunciationEnabled={pronunciationEnabled}
              />
              <ReadingList
                kanjiChar={kanjiObj.kanjiChar}
                readings={kanjiObj.kunyomi}
                type='kun'
                examples={examples?.[kanjiObj.kanjiChar]}
                showKana={showKana}
                onPlay={playReading}
                pronunciationEnabled={pronunciationEnabled}
              />
            </div>
          </div>

          <p className='w-full text-xl text-(--secondary-color) md:text-2xl'>
            {removeVerbDuplicates(kanjiObj.meanings).join(', ')}
          </p>
        </div>
      ))}
    </div>
  );
});

export default KanjiSetDictionary;
