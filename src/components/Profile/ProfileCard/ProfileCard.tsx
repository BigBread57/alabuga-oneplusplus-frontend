'use client'

import type { CardWrapperProps } from '@/components/_base/CardWrapper/CardWrapper'
import type { CharacterProps } from '@/models/Character'
import type { GameWorldProps } from '@/models/GameWorld'
import type { FCC } from '@/types'
import { Col, Divider, Row } from 'antd'
import { useTranslations } from 'next-intl'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { Artifacts } from '@/components/Profile/Artifacts'
import { ProfileRank } from '@/components/Profile/ProfileRank'

type ProfileCardProps = {
  userName: string
  userAvatar?: string
  character: CharacterProps
  // artifacts: UserArtifact[]
  // competencies: UserCompetency[]
  showProgress?: boolean
  gameWorld?: GameWorldProps
  isLoading?: boolean
} & Omit<CardWrapperProps, 'children'>

const ProfileCard: FCC<ProfileCardProps> = ({
  userName,
  userAvatar,
  character,
  gameWorld,
  isLoading,
  ...cardProps
}) => {
  const t = useTranslations('ProfileCard')

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
        <Col xs={24}>
          <ProfileRank
            characterId={character?.id}
            userName={userName}
            userAvatar={userAvatar}
            rank={character?.character_rank?.rank}
            nextRank={character?.character_rank?.next_rank || null}
            gameWorld={gameWorld}
            showProgress
            currentExperience={character?.character_rank?.experience}
          />
        </Col>
        <Divider>{t('artifacts')}</Divider>

        <Col>
          <Artifacts />
        </Col>
        <Divider>{t('competencies')}</Divider>

        <Col>{/* <Competencies items={competencesMock} /> */}</Col>
      </Row>
    </CardWrapper>
  )
}

ProfileCard.displayName = 'ProfileCard'

export default ProfileCard
