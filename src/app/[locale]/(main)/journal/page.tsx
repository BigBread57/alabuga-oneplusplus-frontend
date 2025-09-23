import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type JournalPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(
  props: JournalPageProps,
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale,
    namespace: 'JournalPage',
  })

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  }
}

export default async function JournalPage() {
  return (
    <div>
      <h1>Journal Page</h1>
      {/* Add your journal components here */}
    </div>
  )
}
