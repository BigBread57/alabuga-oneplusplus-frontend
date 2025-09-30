'use client'

import type { FCC } from 'src/types'
import type { GameWorldProps } from '@/models/GameWorld'
import type { RankProps } from '@/models/Rank'
import { Progress, Space, Tag, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ProfilePhoto } from '@/components/Profile/ProfilePhoto'

type ProfileRankProps = {
  characterId?: string | number
  userName: string
  userAvatar: string | undefined
  rank: RankProps
  gameWorld?: GameWorldProps
  currentExperience?: number
  nextRank?: RankProps | null
  showProgress?: boolean
  className?: string
  onUpdateAvatarSuccess?: (updatedCharacter: any) => void
}

const ProfileRank: FCC<ProfileRankProps> = ({
  rank,
  currentExperience = 0,
  className,
  gameWorld,
  nextRank,
  userAvatar,
  userName,
  characterId,
  onUpdateAvatarSuccess,
}) => {
  const t = useTranslations('ProfileRank')
  const { Text, Title } = Typography
  const progressPercent = currentExperience / (rank?.required_experience / 100)

  const experienceToNext = nextRank
    ? (rank.required_experience || 0) - currentExperience
    : 0

  const getRankIcon = () => {
    return (
      <Image
        src={rank?.icon || 'https://dummyimage.com/200'}
        alt={rank?.name || 'Rank Icon'}
        width={70}
        height={70}
        style={{
          objectFit: 'cover',
        }}
      />
    )
  }

  return (
    <div className={className} data-testid='test-ProfileRank'>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <Space align='start'>
          <ProfilePhoto
            characterId={characterId}
            username={userName}
            avatar={userAvatar}
            editable
            onSuccess={onUpdateAvatarSuccess}
          />

          <Space direction='vertical'>
            <Title level={3}>{userName}</Title>
            <Space direction='horizontal'>
              <Title
                level={4}
                style={{ margin: 0, color: rank?.color || '#1677ff' }}
              >
                {rank?.name}
              </Title>
              <div
                style={{
                  display: 'flex',
                  width: 30,
                  height: 30,
                }}
              >
                {getRankIcon()}
              </div>
            </Space>

            {rank?.description && (
              <Text type='secondary'>{rank.description}</Text>
            )}
          </Space>
        </Space>

        <Space direction='vertical' size='small' style={{ width: '100%' }}>
          <Space direction='vertical' size={4}>
            <Text strong>
              {t('required_experience')}:{' '}
              {rank?.required_experience?.toLocaleString()}
            </Text>

            {currentExperience > 0 && (
              <Text type='secondary'>
                {t('current_experience')}: {currentExperience?.toLocaleString()}
              </Text>
            )}
          </Space>
          <Space direction='vertical' size='small' style={{ width: '100%' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text>
                {t('progress_to_next_rank')}:{' '}
                <Tag color={nextRank?.color}>{nextRank?.name}</Tag>
              </Text>
              <Text type='secondary' style={{ fontSize: 12 }}>
                {experienceToNext?.toLocaleString()} {t('experience_left')}
              </Text>
            </Space>
            <Progress
              percent={progressPercent}
              strokeColor={rank?.color || '#1677ff'}
            />
          </Space>
          {gameWorld && (
            <>
              <Text type='secondary' style={{ fontSize: 12 }}>
                {t('game_world')}:
              </Text>
              <Text>{gameWorld?.name}</Text>
            </>
          )}
        </Space>
      </Space>
    </div>
  )
}

ProfileRank.displayName = 'ProfileRank'

export default ProfileRank
