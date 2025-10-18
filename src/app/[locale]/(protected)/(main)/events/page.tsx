import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import { EventsPage } from '@/components/Event/EventsPage'

type PageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'MainPage',
  })

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  }
}

export default async function Page(_props: PageProps) {
  return <EventsPage />
}
