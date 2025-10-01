import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import GlobalStatistics from '@/components/Statistics/GlobalStatistics/GlobalStatistics'

type RankPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(
  props: RankPageProps,
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale,
    namespace: 'RankPage',
  })

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  }
}

export default async function RankPage(_props: RankPageProps) {
  return <GlobalStatistics />
}
