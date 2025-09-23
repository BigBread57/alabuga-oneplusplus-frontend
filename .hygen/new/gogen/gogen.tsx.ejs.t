---
to: app/[locale]/(main)/<%= h.changeCase.lower(page_name) %>/page.tsx
---
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type <%= h.changeCase.pascal(page_name) %>PageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(
  props: <%= h.changeCase.pascal(page_name) %>PageProps,
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale,
    namespace: '<%= h.changeCase.pascal(page_name) %>Page',
  })

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  }
}

export default async function <%= h.changeCase.pascal(page_name) %>Page(props: <%= h.changeCase.pascal(page_name) %>PageProps) {
  return (
    <div>
      <h1><%= h.changeCase.pascal(page_name) %> Page</h1>
      {/* Add your <%= h.changeCase.lower(page_name) %> components here */}
    </div>
  )
}