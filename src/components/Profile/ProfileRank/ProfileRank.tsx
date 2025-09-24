'use client'

import type { FCC } from 'src/types'
import { CrownOutlined, StarOutlined } from '@ant-design/icons'
import { Progress, Space, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

type GameWorld = {
  id: number
  name: string
}

type ProfileRankData = {
  id: number
  name: string
  description: string
  required_experience: number
  icon: string
  color: string
  parent?: ProfileRankData | null
  game_world: GameWorld
}

type ProfileRankProps = {
  rank: ProfileRankData
  currentExperience?: number
  nextRank?: ProfileRankData | null
  showProgress?: boolean
  className?: string
}

const ProfileRank: FCC<ProfileRankProps> = ({
  rank,
  currentExperience = 0,
  nextRank,
  showProgress = true,
  className,
}) => {
  const t = useTranslations('ProfileRank')
  const { Text, Title } = Typography

  const progressPercent = nextRank
    ? Math.min(
        ((currentExperience - rank.required_experience)
          / (nextRank.required_experience - rank.required_experience))
        * 100,
        100,
      )
    : 100

  const experienceToNext = nextRank
    ? Math.max(nextRank.required_experience - currentExperience, 0)
    : 0

  const getRankIcon = () => {
    if (rank.icon) {
      return (
        <Image
          src={rank.icon}
          alt={rank.name}
          width={70}
          height={70}
          style={{
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      )
    }

    return rank.parent
      ? (
          <StarOutlined style={{ fontSize: 24 }} />
        )
      : (
          <CrownOutlined style={{ fontSize: 24 }} />
        )
  }

  return (
    <div className={className} data-testid='test-ProfileRank'>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <Space align='start' size='large'>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 70,
              height: 70,
              borderRadius: '50%',
            }}
          >
            {getRankIcon()}
          </div>

          <div style={{ flex: 1 }}>
            <Title
              level={4}
              style={{ margin: 0, color: rank.color || '#1677ff' }}
            >
              {rank.name}
            </Title>

            {rank.description && (
              <Text type='secondary'>{rank.description}</Text>
            )}
          </div>
        </Space>

        <Space direction='vertical' size='small' style={{ width: '100%' }}>
          <Space direction='vertical' size={4}>
            <Text strong>
              {t('required_experience')}:{' '}
              {rank.required_experience.toLocaleString()}
            </Text>

            {currentExperience > 0 && (
              <Text type='secondary'>
                {t('current_experience')}: {currentExperience.toLocaleString()}
              </Text>
            )}
          </Space>
          {showProgress && nextRank
            ? (
                <Space direction='vertical' size='small' style={{ width: '100%' }}>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text>
                      {t('progress_to_next_rank')}: {nextRank.name}
                    </Text>
                    <Text type='secondary' style={{ fontSize: 12 }}>
                      {experienceToNext.toLocaleString()} {t('experience_left')}
                    </Text>
                  </Space>
                  <Progress
                    percent={progressPercent}
                    strokeColor={rank.color || '#1677ff'}
                  />
                </Space>
              )
            : null}
          {rank.game_world && (
            <Text type='secondary' style={{ fontSize: 12 }}>
              {t('game_world')}: {rank.game_world.name}
            </Text>
          )}
        </Space>
      </Space>
    </div>
  )
}

ProfileRank.displayName = 'ProfileRank'

export default ProfileRank
