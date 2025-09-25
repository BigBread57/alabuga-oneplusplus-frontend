'use client'

import type { FCC } from 'src/types'
import type { UserRank } from '@/components/Profile/ProfileCard/ProfileCard'
import { Col, Row } from 'antd'
import React from 'react'
import { MissionsCard } from '@/components/Mission/MissionsCard'
import { ProfileCard } from '@/components/Profile/ProfileCard'

interface ProfilePageProps {
  prop?: any
}
const userDataMock = {
  userName: 'John Doe',
  userAvatar: 'https://i.pravatar.cc/150?img=3',
  rank: {} as UserRank,
  artifacts: [] as any[],
  competencies: [] as any[],
}
const ProfilePage: FCC<ProfilePageProps> = () => {
  return (
    <Row
      style={{
        height: '100%',
      }}
      gutter={[24, 24]}
    >
      <Col xs={24} sm={24} md={24} lg={8}>
        <ProfileCard
          userName={userDataMock.userName}
          userAvatar={userDataMock.userAvatar}
          rank={userDataMock.rank}
          artifacts={userDataMock.artifacts}
          competencies={userDataMock.competencies}
        />
      </Col>
      <Col
        xs={24}
        sm={24}
        md={24}
        lg={16}
        style={{
          height: 'calc(100vh - 130px)',
        }}
      >
        <MissionsCard />
      </Col>
    </Row>
  )
}

ProfilePage.displayName = 'ProfilePage'

export default ProfilePage
