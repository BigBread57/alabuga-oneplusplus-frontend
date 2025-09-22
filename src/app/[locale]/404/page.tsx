import type { Metadata } from 'next'
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons'
import { Button, Layout, Result } from 'antd'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

type NotFoundProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(
  props: NotFoundProps,
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale,
    namespace: 'NotFound',
  })

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  }
}

export default async function LocalizedNotFound(props: NotFoundProps) {
  const { locale } = await props.params
  const t = await getTranslations({
    locale,
    namespace: 'NotFound',
  })

  return (
    <Layout
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Result
        status='404'
        title='404'
        subTitle={t('description')}
        extra={[
          <Link href={`/${locale}`} key='home'>
            <Button type='primary' icon={<HomeOutlined />} size='large'>
              {t('go_home')}
            </Button>
          </Link>,
          <Button key='back' icon={<ArrowLeftOutlined />} size='large'>
            {t('go_back')}
          </Button>,
        ]}
      />
    </Layout>
  )
}
