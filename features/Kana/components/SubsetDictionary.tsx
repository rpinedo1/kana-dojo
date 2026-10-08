'use client';
import clsx from 'clsx';
import { kana } from '@/features/Kana/data/kana';
import { useParams } from 'next/navigation';
import { useThemePreferences } from '@/features/Preferences';
import { getKanaPhonetic } from '@/features/Kana/data/kanaPhonetics';
import KanaSoundButton from '@/features/Kana/components/KanaSoundButton';

const sliceRanges = {
  hiraganabase: [0, 10],
  hiraganadakuon: [10, 15],
  hiraganayoon: [15, 26],
  katakanabase: [26, 36],
  katakanadakuon: [36, 41],
  katakanayoon: [41, 52],
  katakanaforeign: [52, 60],
};

const SetDictionary = () => {
  const params = useParams<{ subset: string }>();
  const { subset }: { subset: string } = params;
  const [group, subgroup] = subset.split('-');
  const { displayKana } = useThemePreferences();

  const key = (group + subgroup) as keyof typeof sliceRanges;
  const range = sliceRanges[key];

  if (!range) return null;

  const [startIndex, endIndex] = range;

  const kanaToDisplay = kana.slice(startIndex, endIndex);

  return (
    <div className='flex min-h-[100dvh] max-w-[100dvw] flex-col gap-4 px-4 pb-10 sm:px-8 md:px-20 lg:px-30 xl:px-40 2xl:px-60'>
      <div className='flex flex-col rounded-2xl border-1 border-(--border-color) bg-(--card-color) px-4'>
        {kanaToDisplay.map(kanaSubgroup => {
          const phonetics = kanaSubgroup.kana.map(getKanaPhonetic);
          const notes = phonetics.map(p => p?.note);
          // A note every kana in the row shares (e.g. the tapped r) is shown once.
          const sharedNote =
            notes[0] && notes.every(note => note === notes[0])
              ? notes[0]
              : undefined;

          return (
            <div
              key={kanaSubgroup.groupName}
              className='flex flex-col gap-4 border-b-2 border-(--border-color) p-4'
            >
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'>
                {kanaSubgroup.kana.map((char, i) => (
                  <div key={char} className='flex flex-col items-start gap-1'>
                    <KanaSoundButton char={char} className='px-1 text-6xl' />
                    {!displayKana && (
                      <span
                        className={clsx(
                          'flex flex-row items-center rounded-2xl px-2 py-1',
                          'bg-(--border-color)',
                        )}
                      >
                        {kanaSubgroup.romanji[i]}
                      </span>
                    )}
                    {phonetics[i] && (
                      <span className='text-sm text-(--secondary-color)'>
                        {phonetics[i].hint}
                      </span>
                    )}
                    {!sharedNote && notes[i] && (
                      <span className='text-xs text-(--secondary-color) opacity-80'>
                        {notes[i]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {sharedNote && (
                <p className='text-xs text-(--secondary-color) opacity-80'>
                  {sharedNote}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SetDictionary;
