import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import { AdminEvents } from '@/components/Admin/AdminEvents'

type AdminPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(
  props: AdminPageProps,
): Promise<Metadata> {
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

export default async function AdminPage(_props: AdminPageProps) {
  return <AdminEvents />
}
