import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

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

export default async function ShopPage() {
  return (
    <div>
      <h1>Shop Page</h1>
      {/* Add your shop components here */}
    </div>
  )
}
