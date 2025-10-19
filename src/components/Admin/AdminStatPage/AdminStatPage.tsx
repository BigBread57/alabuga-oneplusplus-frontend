'use client'
import type { FCC } from 'src/types'
import { useTranslations } from 'next-intl'
import React, { useContext, useMemo } from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { BarChart } from '@/components/Charts/BarChart'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import { GameWorld } from '@/models/GameWorld'
import { useExtraActionsGet } from '@/services/base/hooks'
import HorizontalBarChart from '../../Charts/HorizontalBarChart/HorizontalBarChart'
import LineChart from '../../Charts/LineChart/LineChart'

const MODEL = GameWorld

interface CharacterRank {
  name: string
  star: number
}

interface CompletedMissionData {
  date: string
  value: number
  type: string
}

// Трансформация данных рангов в формат для графика
const transformRanksData = (ranks: CharacterRank[]) => {
  return ranks.map((rank) => ({
    letter: rank.name,
    frequency: rank.star,
  }))
}

// Трансформация данных завершенных миссий для LineChart
const transformCompletedMissionsData = (missions: CompletedMissionData[]) => {
  const grouped: Record<string, any> = {}

  missions.forEach((mission) => {
    if (!grouped[mission.date]) {
      grouped[mission.date] = { date: mission.date }
    }
    grouped[mission.date][mission.type] = mission.value
  })

  return Object.values(grouped)
}

// Трансформация данных топ персонажей для отдельного графика (опционально)
const transformTopCharactersData = (characters: any[]) => {
  return characters.map((char) => ({
    letter: char.character_name,
    frequency: char.character_competencies_number,
  }))
}

const AdminStatPage: FCC = () => {
  const t = useTranslations('Statistics')
  const { currentUser } = useContext(CurrentUserContext)

  const { data: response }: any = useExtraActionsGet({
    qKey: 'statisticsForUser',
    extraUrl: MODEL.statisticsUrl(currentUser?.active_game_world as number),
    enabled: !!currentUser?.active_game_world,
  })

  // Трансформированные данные
  const ranksData = useMemo(() => {
    return transformRanksData(response?.data?.grouping_character_by_ranks || [])
  }, [response?.data?.grouping_character_by_ranks])

  const missionBranchData = useMemo(() => {
    return (
      response?.data?.number_of_character_who_closed_the_mission_branch || []
    )
  }, [response?.data?.number_of_character_who_closed_the_mission_branch])

  const missionData = useMemo(() => {
    return response?.data?.number_of_character_who_closed_the_mission || []
  }, [response?.data?.number_of_character_who_closed_the_mission])

  const completedMissionsData = useMemo(() => {
    return transformCompletedMissionsData(
      response?.data?.completed_or_failed_character_missions || [],
    )
  }, [response?.data?.completed_or_failed_character_missions])

  const topCharactersData = useMemo(() => {
    return transformTopCharactersData(response?.data?.top_characters || [])
  }, [response?.data?.top_characters])

  return (
    <div className='flex flex-col gap-4'>
      {/* Рейтинг персонажей по компетенциям */}
      <CardWrapper title={t('top_characters')}>
        <BarChart
          height={300}
          data={topCharactersData}
          xField='letter'
          yField='frequency'
          customShape={true}
          formatter={(value: number) => [`${value.toString()}`, 'Компетенций']}
        />
      </CardWrapper>

      {/* Распределение по рангам */}
      <CardWrapper title={t('grouping_character_by_ranks')}>
        <BarChart
          height={250}
          data={ranksData}
          xField='letter'
          yField='frequency'
          customShape={false}
          formatter={(value: number) => [`${value.toString()}`, 'Персонажей']}
        />
      </CardWrapper>

      {/* Количество персонажей, закрывших ветки миссий */}
      <CardWrapper
        title={t('number_of_character_who_closed_the_mission_branch')}
      >
        <HorizontalBarChart
          height={250}
          data={missionBranchData}
          xField='frequency'
          yField='letter'
          sortReverse={true}
          formatter={(value: number) => [`${value.toString()}`, 'Персонажей']}
        />
      </CardWrapper>

      {/* процент персонажей, закрывших миссии */}
      <CardWrapper title={t('number_of_character_who_closed_the_mission')}>
        <HorizontalBarChart
          height={400}
          data={missionData}
          xField='frequency'
          yField='letter'
          sortReverse={true}
          formatter={(value: number) => [`${value * 100}`, '% Персонажей']}
        />
      </CardWrapper>

      {/* Выполненные или провальные миссии */}
      <CardWrapper title={t('completed_or_failed_character_missions')}>
        <LineChart
          height={300}
          data={completedMissionsData}
          xField='date'
          yFields={['Выполнено', 'Провалено']}
          colors={['#06b6d4', '#ef4444']}
          strokeWidth={2.5}
          showDot={true}
          animated={true}
        />
      </CardWrapper>
    </div>
  )
}

AdminStatPage.displayName = 'AdminStatPage'

export default AdminStatPage
