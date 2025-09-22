import type { Metadata } from 'next'
import { Button } from 'antd'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

type IMainPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(
  props: IMainPageProps,
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale,
    namespace: 'MainPage',
  })

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  }
}

export default async function MainPage(props: IMainPageProps) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const t = await getTranslations({
    locale,
    namespace: 'MainPage',
  })

  return (
    <>
      <LocaleSwitcher />
      <p>
        <Button type="primary">
          {t('home')}
          {' '}
        </Button>
        {t('home')}
        {' '}
        {locale}
        !
      </p>
    </>
  )
}
