---
to: <%= absPath %>/page.tsx
---
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type <%= h.changeCase.pascal(component_name) %>PageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(
  props: <%= h.changeCase.pascal(component_name) %>PageProps,
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale,
    namespace: '<%= h.changeCase.pascal(component_name) %>Page',
  })

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  }
}

export default async function Page(props: <%= h.changeCase.pascal(component_name) %>PageProps) {
  return <>COMPONENTS</>
}