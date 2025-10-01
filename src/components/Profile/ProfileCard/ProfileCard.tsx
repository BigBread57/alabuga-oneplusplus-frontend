'use client'

import type { CardWrapperProps } from '@/components/_base/CardWrapper/CardWrapper'
import type { CharacterProps } from '@/models/Character'
import type { GameWorldProps } from '@/models/GameWorld'
import { QuestionIcon } from '@storybook/icons'
import { Col, Divider, Row } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { TooltipButton } from '@/components/_base/TooltipButton'
import { Artifacts } from '@/components/Profile/Artifacts'
import { Competencies } from '@/components/Profile/Competencies'
import { ProfileRank } from '@/components/Profile/ProfileRank'
import { ProfileTour } from '@/components/Tour/ProfileTour/ProfileTour'
import { useProfileTour } from '@/components/Tour/ProfileTour/useProfileTour'
import { useTour } from '@/components/Tour/useTour'

type ProfileCardProps = {
  userName: string
  userAvatar?: string
  character: CharacterProps
  showProgress?: boolean
  gameWorld?: GameWorldProps
  isLoading?: boolean
  onUpdateAvatarSuccess?: (updatedCharacter: any) => void
} & Omit<CardWrapperProps, 'children'>

const ProfileCard: React.FC<ProfileCardProps> = ({
  userName,
  userAvatar,
  character,
  gameWorld,
  isLoading = false,
  onUpdateAvatarSuccess,
  ...cardProps
}) => {
  const t = useTranslations('ProfileCard')
  const {
    profileSectionRef,
    artifactsSectionRef,
    competenciesSectionRef,
    steps,
  } = useTour()

  const {
    isModalOpen,
    tourOpen,
    currentStep,
    handleStartTour,
    handleSkipTour,
    handleCloseTour,
    handleStepChange,
  } = useProfileTour()

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
      extra={
        <TooltipButton
          tooltip={t('start_tour')}
          type='text'
          size='middle'
          icon={<QuestionIcon size={20} />}
          onClick={handleStartTour}
        />
      }
      {...cardProps}
    >
      <ProfileTour
        isModalOpen={isModalOpen}
        tourOpen={tourOpen}
        steps={steps}
        currentStep={currentStep}
        onStartTour={handleStartTour}
        onSkipTour={handleSkipTour}
        onCloseTour={handleCloseTour}
        onStepChange={handleStepChange}
      />
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
}

ProfileCard.displayName = 'ProfileCard'

export default ProfileCard
