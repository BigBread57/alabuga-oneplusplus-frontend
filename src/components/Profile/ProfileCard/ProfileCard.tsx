'use client'

import type { CardWrapperProps } from '@/components/_base/CardWrapper/CardWrapper'
import type { ArtifactModel } from '@/components/Profile/Artifact/Artifact'
import type { CompetenceModel } from '@/components/Profile/Competence/Competence'
import type { FCC } from '@/types'
import { Col, Divider, Row, Space, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import CardWrapper from '@/components/_base/CardWrapper/CardWrapper'
import { Artifacts } from '@/components/Profile/Artifacts'
import { Competencies } from '@/components/Profile/Competencies'
import { ProfilePhoto } from '../ProfilePhoto/ProfilePhoto'
import ProfileRank from '../ProfileRank/ProfileRank'

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
// Моковые данные
const gameWorld = {
  id: 1,
  name: 'Мир фэнтези',
}

const goldRank = {
  id: 3,
  name: 'Золотой чемпион',
  description: 'Ранг для элитных воинов',
  required_experience: 2500,
  icon: 'https://picsum.photos/200/200',
  color: '#ffd700',
  parent: null,
  game_world: gameWorld,
}

const silverRank = {
  id: 2,
  name: 'Серебряный страж',
  description: 'Ранг для опытных бойцов',
  required_experience: 1000,
  icon: 'https://picsum.photos/200/200',
  color: '#c0c0c0',
  parent: goldRank,
  game_world: gameWorld,
}
const bronzeRank = {
  id: 1,
  name: 'Бронзовый воин',
  description: 'Начальный ранг для новых игроков в мире фэнтези',
  required_experience: 500,
  icon: 'https://picsum.photos/200/200',
  color: '#cd7f32',
  parent: silverRank,
  game_world: gameWorld,
}

const competencesMock: CompetenceModel[] = [
  {
    id: '1',
    name: 'Teamwork',
    description: 'Ability to collaborate effectively in diverse teams',
    required_experience: 120,
    icon: 'https://picsum.photos/200/200',
    color: '#1677ff',
    parent: null,
    game_world: 'world-1',
  },
  {
    id: '2',
    name: 'Problem Solving',
    description: 'Identify and resolve complex issues efficiently',
    required_experience: 200,
    icon: 'https://picsum.photos/200/200',
    color: '#52c41a',
    parent: null,
    game_world: 'world-1',
  },
  {
    id: '3',
    name: 'Leadership',
    description: 'Guide teams and inspire others towards success',
    required_experience: 350,
    icon: 'https://picsum.photos/200/200',
    color: '#fa8c16',
    parent: null,
    game_world: 'world-1',
  },
  {
    id: '4',
    name: 'Leadership',
    description: 'Guide teams and inspire others towards success',
    required_experience: 350,
    icon: 'https://picsum.photos/200/200',
    color: '#fa8c16',
    parent: null,
    game_world: 'world-1',
  },
  {
    id: '5',
    name: 'Leadership',
    description: 'Guide teams and inspire others towards success',
    required_experience: 350,
    icon: 'https://picsum.photos/200/200',
    color: '#fa8c16',
    parent: null,
    game_world: 'world-1',
  },
]

const artifactsMock: ArtifactModel[] = [
  {
    id: '1',
    name: 'Ancient Amulet',
    description: 'Grants additional experience from all activities',
    icon: 'https://picsum.photos/200/200',
    color: '#52c41a',
    modifier: 'EXPERIENCE_GAIN',
    modifier_value: 15,
    game_world: 'world-1',
  },
  {
    id: '2',
    name: 'Golden Coin',
    description: 'Increases currency gain during quests',
    icon: 'https://picsum.photos/200/200',
    color: '#faad14',
    modifier: 'CURRENCY_GAIN',
    modifier_value: 20,
    game_world: 'world-1',
  },
  {
    id: '3',
    name: 'Merchant’s Charm',
    description: 'Provides discounts in the in-game store',
    icon: 'https://picsum.photos/200/200',
    color: '#722ed1',
    modifier: 'STORE_DISCOUNT',
    modifier_value: 10,
    game_world: 'world-1',
  },
  {
    id: '4',
    name: 'Merchant’s Charm',
    description: 'Provides discounts in the in-game store',
    icon: 'https://picsum.photos/200/200',
    color: '#722ed1',
    modifier: 'STORE_DISCOUNT',
    modifier_value: 10,
    game_world: 'world-1',
  },
  {
    id: '6',
    name: 'Merchant’s Charm',
    description: 'Provides discounts in the in-game store',
    icon: 'https://picsum.photos/200/200',
    color: '#722ed1',
    modifier: 'STORE_DISCOUNT',
    modifier_value: 10,
    game_world: 'world-1',
  },
  {
    id: '7',
    name: 'Merchant’s Charm',
    description: 'Provides discounts in the in-game store',
    icon: 'https://picsum.photos/200/200',
    color: '#722ed1',
    modifier: 'STORE_DISCOUNT',
    modifier_value: 10,
    game_world: 'world-1',
  },
  {
    id: '337',
    name: 'Merchant’s Charm',
    description: 'Provides discounts in the in-game store',
    icon: 'https://picsum.photos/200/200',
    color: '#722ed1',
    modifier: 'STORE_DISCOUNT',
    modifier_value: 10,
    game_world: 'world-1',
  },
  {
    id: '9877',
    name: 'Merchant’s Charm',
    description: 'Provides discounts in the in-game store',
    icon: 'https://picsum.photos/300/300',
    color: '#722ed1',
    modifier: 'STORE_DISCOUNT',
    modifier_value: 10,
    game_world: 'world-1',
  },
  {
    id: '75',
    name: 'Merchant’s Charm',
    description: 'Provides discounts in the in-game store',
    icon: 'https://picsum.photos/200/200',
    color: '#722ed1',
    modifier: 'STORE_DISCOUNT',
    modifier_value: 10,
    game_world: 'world-1',
  },
  {
    id: '47',
    name: 'Merchant’s Charm',
    description: 'Provides discounts in the in-game store',
    icon: 'https://picsum.photos/200/200',
    color: '#722ed1',
    modifier: 'STORE_DISCOUNT',
    modifier_value: 10,
    game_world: 'world-1',
  },
]

const ProfileCard: FCC<ProfileCardProps> = ({
  userName,
  userAvatar,
  rank,
  artifacts,
  competencies,
  ...cardProps
}) => {
  const t = useTranslations('ProfileCard')

  return (
    <CardWrapper
      title={
        <Space>
          <Title level={3} style={{ margin: 0 }}>
            {userName}
          </Title>
        </Space>
      }
      {...cardProps}
    >
      <Row justify='center'>
        <Col>
          <ProfilePhoto editable />
        </Col>
        <Divider>{t('rank')}</Divider>
        <Col xs={24}>
          <ProfileRank
            rank={bronzeRank}
            showProgress
            currentExperience={silverRank.required_experience}
            nextRank={bronzeRank.parent}
          />
        </Col>
        <Divider>{t('artifacts')}</Divider>

        <Col>
          <Artifacts items={artifactsMock} />
        </Col>
        <Divider>{t('competencies')}</Divider>

        <Col>
          <Competencies items={competencesMock} />
        </Col>
      </Row>
    </CardWrapper>
  )
}

ProfileCard.displayName = 'ProfileCard'

export default ProfileCard
export type { ProfileCardProps, UserArtifact, UserCompetency, UserRank }
