import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

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

export default async function RangPage() {
  return (
    <div>
      <h1>Rang Page</h1>
      {/* Add your rang components here */}
    </div>
  )
}
