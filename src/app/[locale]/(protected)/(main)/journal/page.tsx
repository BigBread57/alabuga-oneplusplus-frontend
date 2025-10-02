import type { Metadata } from 'next'
import { Col, Row } from 'antd'
import { getTranslations } from 'next-intl/server'
import { ActivityLogsCard } from '@/components/ActivityLog/ActivityLogsCard'
import { CharacterStatistics } from '@/components/Profile/CharacterStatistics'

type JournalPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(
  props: JournalPageProps,
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale,
    namespace: 'JournalPage',
  })

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  }
}

export default async function JournalPage(_props: JournalPageProps) {
  return (
    <Row
      style={{
        height: '100%',
      }}
      gutter={[24, 24]}
    >
      <Col
        xs={24}
        sm={24}
        md={24}
        lg={16}
        style={{
          height: 'calc(100vh - 130px)',
        }}
      >
        <CharacterStatistics />
      </Col>
      <Col
        xs={24}
        sm={24}
        md={24}
        lg={8}
        style={{
          height: 'calc(100vh - 130px)',
        }}
      >
        <ActivityLogsCard />
      </Col>
    </Row>
  )
}
