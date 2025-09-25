'use client'

import type { FCC } from 'src/types'
import type { GameWorldProps } from '@/models/GameWorld'
import type { MissionLevelProps } from '@/models/MissionLevel'
import type { RankProps } from '@/models/Rank'
import { Space } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { Mission } from '@/models/Mission'
import MissionCard from '../MissionCard/MissionCard'

interface MissionsCardProps {
  prop?: any
}

// Моковые игровые миры
const gameWorlds: GameWorldProps[] = [
  {
    id: 1,
    name: 'Мир фэнтези',
    description: 'Магический мир с драконами и волшебниками',
    color: '#8B4513',
    standard_experience: 100,
    standard_currency: 50,
    currency_name: 'Золотые монеты',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

// Моковые ранги
const ranks: RankProps[] = [
  {
    id: 1,
    name: 'Новичок',
    description: 'Начинающий авантюрист',
    required_experience: 0,
    icon: 'https://picsum.photos/300/300',
    color: '#8B4513',
    parent: null,
    game_world: gameWorlds[0] as GameWorldProps,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Опытный воин',
    description: 'Закаленный в боях боец',
    required_experience: 1000,
    icon: 'https://picsum.photos/300/300',
    color: '#C0C0C0',
    parent: null,
    game_world: gameWorlds[0] as GameWorldProps,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

// Моковые категории (заглушки)
const activityCategories: any[] = [
  {
    id: 1,
    name: 'Боевые навыки',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Магические исследования',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Социальные квесты',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

// Моковые пользователи-менторы (заглушки)
const mentors: any[] = [
  {
    id: 1,
    username: 'master_sword',
    email: 'sword@fantasy.world',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    username: 'archmage_fire',
    email: 'fire@fantasy.world',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

// Моковые уровни миссий
const missionLevels: MissionLevelProps[] = [
  {
    id: 1,
    name: 'Легкий',
    description: 'Простые задания для новичков',
    icon: 'https://picsum.photos/300/300',
    color: '#52c41a',
    multiplier_experience: 100,
    multiplier_currency: 100,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Средний',
    description: 'Задания средней сложности',
    icon: 'https://picsum.photos/300/300',
    color: '#faad14',
    multiplier_experience: 150,
    multiplier_currency: 120,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Сложный',
    description: 'Опасные задания для опытных',
    icon: 'https://picsum.photos/300/300',
    color: '#f5222d',
    multiplier_experience: 200,
    multiplier_currency: 150,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

// Моковые ветки миссий
const missionBranches: any[] = [
  {
    id: 1,
    name: 'Путь воина',
    description: 'Ветка боевых миссий для развития навыков сражения',
    icon: 'https://picsum.photos/300/300',
    color: '#8B4513',
    is_active: true,
    start_datetime: '2024-01-01T00:00:00Z',
    time_to_complete: 30,
    rank: ranks[0] as RankProps,
    category: activityCategories[0] as any,
    mentor: mentors[0],
    game_world: gameWorlds[0] as GameWorldProps,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Магические изыскания',
    description: 'Исследование тайн магии и древних артефактов',
    icon: 'https://picsum.photos/300/300',
    color: '#722ED1',
    is_active: true,
    start_datetime: '2024-01-15T00:00:00Z',
    time_to_complete: 45,
    rank: ranks[1] as RankProps,
    category: activityCategories[1],
    mentor: mentors[1],
    game_world: gameWorlds[0] as GameWorldProps,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Дипломатия и торговля',
    description: 'Социальные квесты и экономические задачи',
    icon: 'https://picsum.photos/300/300',
    color: '#1890FF',
    is_active: false,
    start_datetime: null,
    time_to_complete: 21,
    rank: ranks[0] as RankProps,
    category: activityCategories[2] as any,
    mentor: null,
    game_world: gameWorlds[0] as GameWorldProps,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

// Моковые миссии
const mockMissions: any[] = [
  {
    id: 1,
    icon: 'https://picsum.photos/300/300',
    name: 'Первый удар',
    description:
      'Изучите основы владения мечом и нанесите свой первый удар по тренировочному манекену. Это базовый навык, который пригодится вам в дальнейших приключениях.',
    experience: 100,
    currency: 50,
    order: 1,
    is_key_mission: true,
    is_active: true,
    time_to_complete: 3,
    branch: missionBranches[0],
    level: missionLevels[0],
    required_missions: [],
    game_world: gameWorlds[0] as GameWorldProps,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    icon: 'https://picsum.photos/300/300',
    name: 'Защита деревни',
    description:
      'В соседнюю деревню напали гоблины! Помогите местным жителям отбить атаку и защитить их дома. За это вы получите благодарность и награду.',
    experience: 200,
    currency: 100,
    order: 2,
    is_key_mission: false,
    is_active: true,
    time_to_complete: 7,
    branch: missionBranches[0],
    level: missionLevels[1],
    required_missions: [], // Будет установлено ниже
    game_world: gameWorlds[0] as GameWorldProps,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    icon: 'https://picsum.photos/300/300',
    name: 'Первые чары',
    description:
      'Освойте базовые заклинания огненной магии. Под руководством опытного мага изучите создание огненных шаров и управление пламенем.',
    experience: 150,
    currency: 75,
    order: 1,
    is_key_mission: true,
    is_active: true,
    time_to_complete: 5,
    branch: missionBranches[1],
    level: missionLevels[0],
    required_missions: [],
    game_world: gameWorlds[0] as GameWorldProps,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    icon: 'https://picsum.photos/300/300',
    name: 'Поиск древнего артефакта',
    description:
      'В старой библиотеке найдены упоминания о могущественном артефакте. Исследуйте древние тексты и найдите подсказки о его местонахождении.',
    experience: 300,
    currency: 150,
    order: 2,
    is_key_mission: true,
    is_active: true,
    time_to_complete: 14,
    branch: missionBranches[1],
    level: missionLevels[1],
    required_missions: [], // Будет установлено ниже
    game_world: gameWorlds[0] as GameWorldProps,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    icon: 'https://picsum.photos/300/300',
    name: 'Испытание героя',
    description:
      'Финальное испытание для получения звания героя. Вам предстоит сразиться с могущественным драконом и доказать свою доблесть.',
    experience: 500,
    currency: 250,
    order: 10,
    is_key_mission: true,
    is_active: true,
    time_to_complete: 21,
    branch: missionBranches[0],
    level: missionLevels[2],
    required_missions: [], // Будет установлено ниже
    game_world: gameWorlds[0] as GameWorldProps,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 6,
    icon: 'https://picsum.photos/300/300',
    name: 'Переговоры с купцами',
    description:
      'Местная торговая гильдия нуждается в посреднике для переговоров с иноземными купцами. Используйте свои дипломатические навыки.',
    experience: 120,
    currency: 200,
    order: 1,
    is_key_mission: false,
    is_active: false,
    time_to_complete: 10,
    branch: missionBranches[2],
    level: missionLevels[0],
    required_missions: [],
    game_world: gameWorlds[0] as GameWorldProps,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 7,
    icon: 'https://picsum.photos/300/300',
    name: 'Мастер стихий',
    description:
      'Продвинутое обучение магии стихий. Научитесь комбинировать заклинания огня, воды, земли и воздуха для создания мощных атак.',
    experience: 400,
    currency: 180,
    order: 3,
    is_key_mission: true,
    is_active: true,
    time_to_complete: 30,
    branch: missionBranches[1],
    level: missionLevels[2],
    required_missions: [], // Будет установлено ниже
    game_world: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

const MODEL = Mission
const MissionsCard: FCC<MissionsCardProps> = ({ prop }) => {
  const t = useTranslations('Mission')
  return (
    <CardWrapper
      title={t('missions').toUpperCase()}
      styles={{
        header: {
          fontSize: '18px',
        },
        body: {
          height: '90%',
          overflow: 'scroll',
        },
      }}
      {...prop}
    >
      <FetchMoreItemsComponent
        model={MODEL}
        defFilters={{}}
        renderItems={() => (
          <div
            style={{
              paddingRight: '8px',
            }}
          >
            <Space direction='vertical' size='large' style={{ width: '100%' }}>
              {mockMissions?.map((item) => (
                <MissionCard mission={item} key={item.id} />
              ))}
            </Space>
          </div>
        )}
      />
    </CardWrapper>
  )
}

MissionsCard.displayName = 'MissionsCard'

export default MissionsCard
