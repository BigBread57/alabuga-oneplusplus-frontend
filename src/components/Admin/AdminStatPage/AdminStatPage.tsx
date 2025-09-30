'use client'
import type { FCC } from 'src/types'
import { Space } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useContext } from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { BarChart } from '@/components/Charts/BarChart'
import { ColumnChart } from '@/components/Charts/ColumnChart'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import { GameWorld } from '@/models/GameWorld'
import { useExtraActionsGet } from '@/services/base/hooks'

const MODEL = GameWorld

const AdminStatPage: FCC = () => {
  const t = useTranslations('Statistics')
  const { currentUser } = useContext(CurrentUserContext)

  const { data: response }: any = useExtraActionsGet({
    qKey: 'statisticsForUser',
    extraUrl: MODEL.statisticsUrl(currentUser?.active_game_world as number),
    enabled: !!currentUser?.active_game_world,
  })

  return (
    <Space direction='vertical' style={{ width: '100%' }} size='large'>
      <CardWrapper
        title={t('number_of_character_who_closed_the_mission_branch')}
      >
        <BarChart
          height={250}
          data={
            response?.data?.number_of_character_who_closed_the_mission_branch
          }
        />
      </CardWrapper>
      <CardWrapper title={t('number_of_character_who_closed_the_mission')}>
        <BarChart
          height={250}
          data={response?.data?.number_of_character_who_closed_the_mission}
        />
      </CardWrapper>
      <CardWrapper title={t('completed_or_failed_character_missions')}>
        <ColumnChart
          height={250}
          data={response?.data?.completed_or_failed_character_missions}
        />
      </CardWrapper>
    </Space>
  )
}

AdminStatPage.displayName = 'AdminStatPage'

export default AdminStatPage
