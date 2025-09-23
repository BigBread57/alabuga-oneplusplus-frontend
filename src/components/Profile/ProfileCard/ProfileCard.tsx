'use client'

import type { CardWrapperProps } from '@/components/_base/CardWrapper/CardWrapper'
import type { FCC } from '@/types'
import { Space, Typography } from 'antd'
import CardWrapper from '@/components/_base/CardWrapper/CardWrapper'

const { Title } = Typography

type UserRank = {
  icon: React.ReactNode
  name: string
  currentExp: number
  nextLevelExp: number
  level: number
}

type UserArtifact = {
  id: string
  name: string
  icon: React.ReactNode
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

type UserCompetency = {
  id: string
  name: string
  icon: React.ReactNode
  level: number
  maxLevel: number
}

type ProfileCardProps = {
  userName: string
  userAvatar?: string
  rank: UserRank
  artifacts: UserArtifact[]
  competencies: UserCompetency[]
  showProgress?: boolean
} & Omit<CardWrapperProps, 'children'>

const ProfileCard: FCC<ProfileCardProps> = ({
  userName,
  userAvatar,
  rank,
  artifacts,
  competencies,
  ...cardProps
}) => {
  return (
    <CardWrapper
      title={
        <Space>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              {userName}
            </Title>
          </div>
        </Space>
      }
      {...cardProps}
    >
      Photo block Rank Artifacts Competencies
    </CardWrapper>
  )
}

ProfileCard.displayName = 'ProfileCard'

export default ProfileCard
export type { ProfileCardProps, UserArtifact, UserCompetency, UserRank }
