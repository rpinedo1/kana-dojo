'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import {
  Check,
  X,
  Lightbulb,
  Info as InfoIcon,
  TriangleAlert,
} from 'lucide-react';
import { useGrammarStore } from '../store/useGrammarStore';
import type { GrammarLesson } from '../types';
import RubyText from './RubyText';
import SpeakButton from './SpeakButton';
import SentenceCard from './SentenceCard';

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className='flex flex-col gap-3'>
    <h3 className='text-xl font-semibold text-(--main-color) md:text-2xl'>
      {title}
    </h3>
    {children}
  </section>
);

const Card = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`rounded-2xl bg-(--card-color) p-4 ${className}`}>
    {children}
  </div>
);

/** Teaching content of a lesson: explanation, pattern, breakdown, notes. */
const LessonLearn = ({ lesson }: { lesson: GrammarLesson }) => {
  const t = useTranslations('grammar.lesson');
  const showRomaji = useGrammarStore(state => state.showRomaji);

  return (
    <div className='flex flex-col gap-8'>
      <Section title={t('explanation')}>
        <Card className='flex flex-col gap-3 text-lg leading-relaxed'>
          {lesson.explanation.map(paragraph => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Card>
      </Section>

      <Section title={t('pattern')}>
        <Card className='flex flex-col gap-3 border-l-4 border-(--main-color)'>
          <p className='font-mono text-lg text-(--secondary-color)'>
            <RubyText text={lesson.pattern.formula} showFurigana={false} />
          </p>
          <SentenceCard
            sentence={lesson.pattern.example}
            size='lg'
            showPronunciation
          />
        </Card>
      </Section>

      <Section title={t('breakdown')}>
        <ul className='grid gap-2 sm:grid-cols-2'>
          {lesson.breakdown.map(part => (
            <li
              key={part.part}
              className='flex flex-col gap-0.5 rounded-2xl bg-(--card-color) p-4'
            >
              <div className='flex flex-wrap items-baseline gap-2'>
                <RubyText text={part.part} className='text-2xl' />
                {showRomaji && (
                  <span className='text-sm text-(--secondary-color) italic'>
                    {part.romaji}
                  </span>
                )}
              </div>
              <span className='text-sm font-semibold text-(--secondary-color) uppercase'>
                {part.role}
              </span>
              <span>{part.note}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t('examples')}>
        <ul className='flex flex-col gap-2'>
          {lesson.examples.map(example => (
            <li key={example.jp}>
              <Card>
                <SentenceCard sentence={example} showPronunciation />
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {lesson.dialogues?.length ? (
        <Section title={t('dialogues')}>
          {lesson.dialogues.map(dialogue => (
            <Card key={dialogue.title} className='flex flex-col gap-3'>
              <div>
                <h4 className='text-lg font-semibold'>{dialogue.title}</h4>
                <p className='text-sm text-(--secondary-color)'>
                  {dialogue.setting}
                </p>
              </div>
              <ol className='flex flex-col gap-3'>
                {dialogue.lines.map((line, index) => (
                  <li key={index} className='flex gap-3'>
                    <span
                      aria-hidden
                      className='flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-(--secondary-color) text-(--background-color)'
                    >
                      {line.speaker}
                    </span>
                    <span className='sr-only'>{line.speaker}:</span>
                    <SentenceCard
                      sentence={{ ...line.sentence, register: undefined }}
                    />
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </Section>
      ) : null}

      <Section title={t('pronunciation')}>
        <Card className='flex flex-col gap-2'>
          <ul className='flex list-disc flex-col gap-2 pl-5'>
            {lesson.pronunciationNotes.map(note => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <p className='text-sm text-(--secondary-color)'>
            {t('pronunciationLegend')}
          </p>
        </Card>
      </Section>

      {lesson.mnemonic && (
        <Section title={t('mnemonic')}>
          <Card className='flex items-start gap-3'>
            <Lightbulb
              aria-hidden
              className='mt-1 h-5 w-5 shrink-0 text-(--secondary-color)'
            />
            <p className='text-lg'>{lesson.mnemonic}</p>
          </Card>
        </Section>
      )}

      <Section title={t('mistakes')}>
        <ul className='flex flex-col gap-2'>
          {lesson.commonMistakes.map(mistake => {
            const unnatural = mistake.kind === 'unnatural';
            return (
              <li
                key={mistake.wrong}
                className='flex flex-col gap-2 rounded-2xl bg-(--card-color) p-4'
              >
                {unnatural && (
                  <span className='w-fit rounded-lg border border-(--border-color) px-2 py-0.5 text-xs text-(--secondary-color) uppercase'>
                    {t('unnatural')}
                  </span>
                )}
                <span className='flex items-center gap-2 text-(--secondary-color)'>
                  {unnatural ? (
                    <TriangleAlert
                      aria-label={t('unnatural')}
                      className='h-5 w-5 shrink-0'
                    />
                  ) : (
                    <X
                      aria-label={t('incorrect')}
                      className='h-5 w-5 shrink-0'
                    />
                  )}
                  <RubyText
                    text={mistake.wrong}
                    className={
                      unnatural
                        ? 'text-xl'
                        : 'text-xl line-through decoration-1'
                    }
                  />
                </span>
                <span className='flex items-center gap-2'>
                  <Check
                    aria-label={unnatural ? t('moreNatural') : t('correct')}
                    className='h-5 w-5 shrink-0 text-(--main-color)'
                  />
                  <RubyText text={mistake.right} className='text-xl' />
                </span>
                <p className='text-(--secondary-color)'>{mistake.why}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      {lesson.register?.length ? (
        <Section title={t('register')}>
          <ul className='flex flex-col gap-2'>
            {lesson.register.map(pair => (
              <li
                key={pair.polite.jp}
                className='flex flex-col gap-3 rounded-2xl bg-(--card-color) p-4'
              >
                <div className='grid gap-3 sm:grid-cols-2'>
                  <SentenceCard sentence={pair.polite} />
                  <SentenceCard sentence={pair.casual} />
                </div>
                <p className='text-(--secondary-color)'>{pair.note}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title={t('vocabulary')}>
        <ul className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
          {lesson.vocabulary.map(word => (
            <li
              key={word.jp}
              className='flex flex-col rounded-2xl bg-(--card-color) px-4 py-3'
            >
              <div className='flex items-center gap-2'>
                <RubyText text={word.jp} className='text-xl' />
                <SpeakButton jp={word.jp} />
              </div>
              {showRomaji && (
                <span className='text-sm text-(--secondary-color) italic'>
                  {word.romaji}
                </span>
              )}
              <span className='text-sm'>{word.en}</span>
            </li>
          ))}
        </ul>
      </Section>

      {lesson.reviewFlags?.length ? (
        <Section title={t('simplified')}>
          <Card className='flex items-start gap-3'>
            <InfoIcon
              aria-hidden
              className='mt-1 h-5 w-5 shrink-0 text-(--secondary-color)'
            />
            <ul className='flex flex-col gap-1 text-(--secondary-color)'>
              {lesson.reviewFlags.map(flag => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
          </Card>
        </Section>
      ) : null}
    </div>
  );
};

export default LessonLearn;
