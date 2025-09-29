import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import GlobalStatistics from '@/components/Statistics/GlobalStatistics/GlobalStatistics'

type RangPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(
  props: RangPageProps,
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale,
    namespace: 'RangPage',
  })

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  }
}

export default async function RangPage(_props: RangPageProps) {
  return <GlobalStatistics />
}
