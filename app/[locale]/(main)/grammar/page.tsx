import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';
import { routing } from '@/core/i18n/routing';
import { Breadcrumbs } from '@/shared/ui-composite/Breadcrumbs';
import GrammarDojo from '@/features/Grammar/components/GrammarDojo';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return await generatePageMetadata('grammar', {
    locale,
    pathname: '/grammar',
  });
}

export default async function GrammarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tGrammar = await getTranslations({ locale, namespace: 'grammar' });

  return (
    <>
      <Breadcrumbs
        className='hidden'
        items={[
          { name: t('menu.home'), url: '/' },
          { name: tGrammar('dojo.title'), url: '/grammar' },
        ]}
      />
      <GrammarDojo />
    </>
  );
}
