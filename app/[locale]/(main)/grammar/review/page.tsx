import type { Metadata } from 'next';
import { routing } from '@/core/i18n/routing';
import ReviewSession from '@/features/Grammar/components/ReviewSession';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Review Missed Grammar - KanaDojo',
  robots: { index: false },
};

export default function GrammarReviewPage() {
  return <ReviewSession />;
}
