'use client'

import type { CardWrapperProps } from '@/components/_base/CardWrapper/CardWrapper'
import type { CharacterProps } from '@/models/Character'
import type { GameWorldProps } from '@/models/GameWorld'
import { Col, Divider, Row } from 'antd'
import { useTranslations } from 'next-intl'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { Artifacts } from '@/components/Profile/Artifacts'
import { Competencies } from '@/components/Profile/Competencies'
import { ProfileRank } from '@/components/Profile/ProfileRank'

type ProfileCardProps = {
  userName: string
  userAvatar?: string
  character: CharacterProps
  showProgress?: boolean
  gameWorld?: GameWorldProps
  isLoading?: boolean
  onUpdateAvatarSuccess?: (updatedCharacter: any) => void
} & Omit<CardWrapperProps, 'children'>

export type ProfileCardRef = {
  getTourRefs: () => Record<string, React.RefObject<any>>
}

const ProfileCard = forwardRef<ProfileCardRef, ProfileCardProps>(
  (
    {
      userName,
      userAvatar,
      character,
      gameWorld,
      isLoading,
      onUpdateAvatarSuccess,
      ...cardProps
    },
    ref,
  ) => {
    const t = useTranslations('ProfileCard')

    // Рефы для тура
    const profileSectionRef = useRef<HTMLDivElement>(null)
    const artifactsSectionRef = useRef<HTMLDivElement>(null)
    const competenciesSectionRef = useRef<HTMLDivElement>(null)

    // Экспортируем рефы для родительского компонента
    useImperativeHandle(ref, () => ({
      getTourRefs: () => ({
        profileSection: profileSectionRef,
        artifactsSection: artifactsSectionRef,
        competenciesSection: competenciesSectionRef,
      }),
    }))

    return (
      <CardWrapper
        loading={isLoading}
        title={t('profile').toUpperCase()}
        styles={{
          header: {
            fontSize: '18px',
          },
          body: {
            height: '100%',
            overflow: 'scroll',
          },
        }}
        {...cardProps}
      >
        <Row justify='center'>
          {/* Секция профиля с рефом */}
          <Col xs={24} ref={profileSectionRef}>
            <ProfileRank
              characterId={character?.id}
              userName={userName}
              userAvatar={userAvatar}
              rank={character?.character_rank?.rank}
              nextRank={character?.character_rank?.next_rank || null}
              currency={character?.currency}
              gameWorld={gameWorld}
              showProgress
              currentExperience={character?.character_rank?.experience}
              onUpdateAvatarSuccess={onUpdateAvatarSuccess}
            />
          </Col>

          <Col ref={artifactsSectionRef}>
            {/* Секция артефактов с рефом */}
            <Divider>{t('artifacts')}</Divider>
            <Artifacts />
          </Col>

          <Col ref={competenciesSectionRef}>
            {/* Секция компетенций с рефом */}
            <Divider>{t('competencies')}</Divider>
            <Competencies />
          </Col>
        </Row>
      </CardWrapper>
    )
  },
)

ProfileCard.displayName = 'ProfileCard'

export default ProfileCard
