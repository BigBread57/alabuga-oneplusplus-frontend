import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type NewsPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(
  props: NewsPageProps,
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale,
    namespace: 'NewsPage',
  })

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  }
}

export default async function NewsPage(_props: NewsPageProps) {
  return (
    <div>
      <h1>News Page</h1>
      {/* Add your news components here */}
    </div>
  )
}
