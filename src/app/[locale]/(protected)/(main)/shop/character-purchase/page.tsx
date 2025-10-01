import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import { CharacterPurchaseTable } from '@/components/Shop/CharacterPurchaseTable'

type ShopPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(
  props: ShopPageProps,
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale,
    namespace: 'ShopPage',
  })

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  }
}

export default async function Page(_props: ShopPageProps) {
  return <CharacterPurchaseTable />
}
