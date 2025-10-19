import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CharacterStatistics } from '@/components/Profile/CharacterStatistics'

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

export default async function JournalPage(_props: JournalPageProps) {
  return (
    <div className='mt-4 flex h-full w-full flex-col gap-6 lg:flex-row'>
      {/* Character Statistics */}
      <div className='h-[calc(100vh-200px)] w-full overflow-hidden'>
        <CharacterStatistics />
      </div>
    </div>
  )
}
