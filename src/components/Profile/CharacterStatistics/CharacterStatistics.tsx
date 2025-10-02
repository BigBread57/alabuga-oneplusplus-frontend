'use client'
import type { FCC } from 'src/types'
import { Col, Divider, Row } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useContext } from 'react'
import { CardLoader } from '@/components/_base/CardLoader'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { PieChart } from '@/components/Charts/PieChart'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import { Character } from '@/models/Character'
import { useExtraActionsGet } from '@/services/base/hooks'
import RadarChart from '../../Charts/RadarChart/RadarChart'

const MODEL = Character
const CharacterStatistics: FCC = () => {
  const t = useTranslations('Statistics')
  const { currentUser } = useContext(CurrentUserContext)

  const { data: response, isLoading }: any = useExtraActionsGet({
    qKey: 'statisticsForUser',
    extraUrl: MODEL.statisticsForUserUrl(
      currentUser?.active_character as number,
    ),
    enabled: !!currentUser?.active_character,
  })
  return (
    <CardLoader isLoading={isLoading}>
      <CardWrapper
        title={t('title').toUpperCase()}
        styles={{
          body: {
            height: '90%',
            overflow: 'scroll',
          },
        }}
      >
        <Row justify='center'>
          <Col xs={24} lg={24}>
            <Divider size='small'>{t('competencies')}</Divider>
            <RadarChart
              autoFit={true}
              maxValue={10}
              height={250}
              labelFontSize={9}
              labelRotate={30}
              labelStyle={{
                textOverflow: 'ellipsis',
                maxWidth: '60px',
              }}
              data={response?.data?.competencies?.by_name}
            />
          </Col>
          <Divider size='small'>{t('missions')}</Divider>
          <Col xs={24} lg={12}>
            <PieChart
              key='by_level'
              legendPosition='left'
              height={250}
              data={response?.data?.missions?.by_level}
            />
          </Col>
          <Col xs={24} lg={12}>
            <PieChart
              key='by_status'
              legendPosition='left'
              height={250}
              data={response?.data?.missions.by_status}
            />
          </Col>
          <Col xs={24} lg={24}>
            <Row>
              <Col xs={24} lg={12}>
                <Divider size='small'>{t('events')}</Divider>
                <PieChart
                  key='by_status_events'
                  legendPosition='left'
                  height={250}
                  data={response?.data?.events.by_status}
                />
              </Col>
              <Col xs={24} lg={12}>
                <Divider size='small'>{t('artifacts')}</Divider>
                <PieChart
                  key='by_type_artifacts'
                  legendPosition='left'
                  height={250}
                  data={response?.data?.artifacts.by_type}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </CardWrapper>
    </CardLoader>
  )
}

CharacterStatistics.displayName = 'CharacterStatistics'

export default CharacterStatistics
