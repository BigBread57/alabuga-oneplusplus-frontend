import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { RegisterForm } from '@/components/auth/RegisterForm'

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

export default async function Page() {
  return <RegisterForm />
}
