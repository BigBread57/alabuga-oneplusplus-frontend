'use client'
import type { FCC } from 'src/types'
import { Col, Row, Table, Tabs } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useContext } from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import RadialBarChart from '@/components/Charts/RadialBarChart/RadialBarChart'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import { GameWorld } from '@/models/GameWorld'
import { useExtraActionsGet } from '@/services/base/hooks'

const MODEL = GameWorld
const GlobalStatistics: FCC = () => {
  const t = useTranslations('Statistics')
  const { currentUser } = useContext(CurrentUserContext)

  const { data: response }: any = useExtraActionsGet({
    qKey: 'statisticsForUser',
    extraUrl: MODEL.statisticsUrl(currentUser?.active_game_world as number),
    enabled: !!currentUser?.active_game_world,
  })

  const tabItems: any[] = [
    {
      key: '1',
      label: 'Топ по выполненным миссиям',
      children: (
        <Table
          columns={[
            {
              title: t('character_place'),
              dataIndex: 'character_missions_place',
              key: 'character_missions_place',
            },
            {
              title: t('character_name'),
              dataIndex: 'character_name',
              key: 'character_name',
            },
            {
              title: t('character_number'),
              dataIndex: 'character_missions_number',
              key: 'character_missions_number',
            },
          ]}
          dataSource={response?.data?.top_characters}
          rowKey='character_name'
        />
      ),
    },
    {
      key: '2',
      label: 'Топ по выполненным событиям',
      children: (
        <Table
          columns={[
            {
              title: t('character_place'),
              dataIndex: 'character_events_place',
              key: 'character_events_place',
            },
            {
              title: t('character_name'),
              dataIndex: 'character_name',
              key: 'character_name',
            },
            {
              title: t('character_number'),
              dataIndex: 'character_events_number',
              key: 'character_events_number',
            },
          ]}
          dataSource={response?.data?.top_characters}
          rowKey='character_name'
        />
      ),
    },
    {
      key: '3',
      label: 'Топ по количеству артефактов',
      children: (
        <Table
          columns={[
            {
              title: t('character_place'),
              dataIndex: 'character_artifacts_place',
              key: 'character_artifacts_place',
            },
            {
              title: t('character_name'),
              dataIndex: 'character_name',
              key: 'character_name',
            },
            {
              title: t('character_number'),
              dataIndex: 'character_artifacts_number',
              key: 'character_artifacts_number',
            },
          ]}
          dataSource={response?.data?.top_characters}
          rowKey='character_name'
        />
      ),
    },
    {
      key: '4',
      label: 'Топ по количеству компетенций',
      children: (
        <Table
          columns={[
            {
              title: t('character_place'),
              dataIndex: 'character_competencies_place',
              key: 'character_competencies_place',
            },
            {
              title: t('character_name'),
              dataIndex: 'character_name',
              key: 'character_name',
            },
            {
              title: t('character_number'),
              dataIndex: 'character_competencies_number',
              key: 'character_competencies_number',
            },
          ]}
          dataSource={response?.data?.top_characters}
          rowKey='character_name'
        />
      ),
    },
  ]

  return (
    <Row justify='center' gutter={[16, 16]}>
      <Col xs={24} lg={24}>
        <CardWrapper title={t('top_characters').toUpperCase()}>
          <Tabs defaultActiveKey='1' items={tabItems} />
        </CardWrapper>
      </Col>
      <Col xs={24} lg={24}>
        <CardWrapper title={t('grouping_character_by_ranks').toUpperCase()}>
          <RadialBarChart
            autoFit={true}
            maxValue={10}
            height={250}
            data={response?.data?.grouping_character_by_ranks}
          />
        </CardWrapper>
      </Col>
    </Row>
  )
}

GlobalStatistics.displayName = 'GlobalStatistics'

export default GlobalStatistics
