import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import { fakeGraphData } from '@/components/Graph/fakeData'
import { GraphCanvas } from '@/components/Graph/GraphCanvas'

type GraphProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(props: GraphProps): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale,
    namespace: 'AdminPage',
  })

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  }
}

export default async function Graph(_props: GraphProps) {
  return <GraphCanvas data={fakeGraphData} />
}
