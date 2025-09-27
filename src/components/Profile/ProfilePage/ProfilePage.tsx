'use client'

import type { FCC } from 'src/types'
import { Col, Row, Spin } from 'antd'
import React, { Suspense } from 'react'
import { CharacterActivity } from '@/components/Character/CharacterActivity'
import { ProfileCard } from '@/components/Profile/ProfileCard'
import { Character } from '@/models/Character'
import { useFetchExtraAction } from '@/services/base/hooks'

const MODEL = Character

const ProfilePage: FCC = () => {
  const {
    data,
    isLoading,
  }: {
    data: any
    isLoading: boolean
  } = useFetchExtraAction({
    extraUrl: MODEL.actualForUserUrl(),
    qKey: 'CharacterActualForUser',
  })

  return (
    <Row
      style={{
        height: '100%',
      }}
      gutter={[24, 24]}
    >
      <Col xs={24} sm={24} md={24} lg={8}>
        <ProfileCard
          isLoading={isLoading}
          userName={data?.data?.user?.full_name || data?.data?.user?.username}
          userAvatar={data?.data?.avatar}
          character={data?.data}
          gameWorld={data?.data?.game_world}
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
        <Suspense fallback={<Spin spinning />}>
          <CharacterActivity />
        </Suspense>
      </Col>
    </Row>
  )
}

ProfilePage.displayName = 'ProfilePage'

export default ProfilePage
