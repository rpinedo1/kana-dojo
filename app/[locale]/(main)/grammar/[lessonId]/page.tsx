import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { routing } from '@/core/i18n/routing';
import { grammarCourse } from '@/features/Grammar/data';
import LessonView from '@/features/Grammar/components/LessonView';

export function generateStaticParams() {
  return routing.locales.flatMap(locale =>
    grammarCourse.lessons.map(lesson => ({ locale, lessonId: lesson.id })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; lessonId: string }>;
}): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = grammarCourse.lessons.find(item => item.id === lessonId);
  if (!lesson) return {};
  return {
    title: `Lesson ${lesson.number}: ${lesson.title} - Japanese Grammar | KanaDojo`,
    description: `${lesson.summary} A short beginner Japanese grammar lesson with examples, pronunciation notes, common mistakes and practice.`,
  };
}

export default async function GrammarLessonPage({
  params,
}: {
  params: Promise<{ locale: string; lessonId: string }>;
}) {
  const { lessonId } = await params;
  if (!grammarCourse.lessons.some(lesson => lesson.id === lessonId)) notFound();
  return <LessonView lessonId={lessonId} />;
}
