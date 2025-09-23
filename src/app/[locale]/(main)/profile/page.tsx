import type { Metadata } from 'next'
import { Card, Col, Row } from 'antd'
import { getTranslations } from 'next-intl/server'
import React from 'react'

type IMainPageProps = {
  params: Promise<{ locale: string }>
  children: React.ReactNode
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

export default async function MainPage() {
  return (
    <Row
      style={{
        height: '100%',
      }}
    >
      <Col
        style={{
          height: '100%',
        }}
        xs={24}
        sm={24}
        md={24}
        lg={8}
      >
        <Card>
          <div>Left Column Content</div>
        </Card>
      </Col>
    </Row>
  )
}
