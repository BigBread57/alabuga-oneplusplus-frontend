import type { Metadata } from 'next'
import type { UserArtifact } from '@/components/Profile/ProfileCard/ProfileCard'
import { Col, Row } from 'antd'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import { ProfileCard } from '@/components/Profile/ProfileCard'

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
  const userDataMock = {
    userName: 'John Doe',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    rank: {
      icon: '⭐',
      name: 'Gold',
      currentExp: 1200,
      nextLevelExp: 2000,
      level: 5,
    },
    artifacts: [
      {
        id: '1',
        name: 'Excalibur',
        icon: '🗡️',
        rarity: 'legendary',
      },
      {
        id: '2',
        name: 'Dragon Shield',
        icon: '🛡️',
        rarity: 'epic',
      },
    ] as UserArtifact[],
    competencies: [
      {
        id: '1',
        name: 'JavaScript',
        icon: '📜',
        level: 4,
        maxLevel: 5,
      },
      {
        id: '2',
        name: 'React',
        icon: '⚛️',
        level: 3,
        maxLevel: 5,
      },
    ],
  }
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
        <ProfileCard
          userName={userDataMock.userName}
          userAvatar={userDataMock.userAvatar}
          rank={userDataMock.rank}
          artifacts={userDataMock.artifacts}
          competencies={userDataMock.competencies}
        />
      </Col>
    </Row>
  )
}
