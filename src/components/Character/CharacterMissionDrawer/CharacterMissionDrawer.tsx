'use client'

import type { FCC } from 'src/types'
import type { CharacterMissionProps } from '@/models/CharacterMission'
import { DollarOutlined, TrophyOutlined } from '@ant-design/icons'
import { Button, Divider, Drawer, Space, Tag, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { DateTimeCalendar } from '@/components/_base/DateTimeCalendar'

const { Text, Title, Paragraph } = Typography

interface CharacterMissionDrawerProps {
  data: CharacterMissionProps
  open: boolean
  onClose: () => void
  onComplete?: () => void
  width?: number
}

const CharacterMissionDrawer: FCC<CharacterMissionDrawerProps> = ({
  data,
  open,
  onClose,
  onComplete,
  width = 700,
}) => {
  const t = useTranslations('MissionCard')
  const getStatusColor = () => {
    switch (data.status) {
      case 'IN_PROGRESS':
        return 'blue'
      case 'COMPLETED':
        return 'green'
      case 'NEED_IMPROVEMENT':
        return 'orange'
      case 'PENDING_REVIEW':
        return 'purple'
      case 'FAILED':
        return 'red'
      default:
        return 'default'
    }
  }

  const handleComplete = () => {
    onComplete?.()
    onClose()
  }

  return (
    <Drawer
      title={data.mission.name}
      placement='right'
      onClose={onClose}
      open={open}
      width={width}
      extra={<Tag color={getStatusColor()}>{data.status_display_name}</Tag>}
    >
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        {/* Описание */}
        <div>
          <Title level={5}>{t('mission_description')}</Title>
          <Paragraph>{data.mission.description}</Paragraph>
        </div>

        <Divider size='small' />

        {/* Награды */}
        <div>
          <Title level={5}>{t('rewards')}</Title>
          <Space size='large'>
            <Space>
              <TrophyOutlined style={{ color: '#faad14' }} />
              <Text>
                {data.mission.experience.toLocaleString()} {t('experience')}
              </Text>
            </Space>
            <Space>
              <DollarOutlined style={{ color: '#52c41a' }} />
              <Text>
                {data.mission.currency.toLocaleString()} {t('coins')}
              </Text>
            </Space>
          </Space>
        </div>

        <Divider size='small' />

        {/* Информация о ветке */}
        <div>
          <Title level={5}>{t('information')}</Title>
          <Space direction='vertical' size='small' style={{ width: '100%' }}>
            <Text>
              <strong>{t('branch')}:</strong> {data.mission.branch.name}
            </Text>
            <Text>
              <strong>{t('category')}:</strong>{' '}
              {data.mission.branch.category.name}
            </Text>
            <Text>
              <strong>{t('order')}:</strong> #{data.mission.order}
            </Text>
            <Text>
              <>
                <strong>{t('level')}:</strong> {data.mission.level}
              </>
            </Text>
          </Space>
        </div>

        <Divider size='small' />

        {/* Временные рамки */}
        <div>
          <Title level={5}>{t('timeframe')}</Title>
          <Space direction='vertical' size='small' style={{ width: '100%' }}>
            <Text>
              <DateTimeCalendar
                text={t('start_date')}
                datetime={data.start_datetime as string}
              />
            </Text>
            <Text>
              <DateTimeCalendar
                text={t('end_date')}
                datetime={data.end_datetime as string}
              />
            </Text>
          </Space>
        </div>

        {/* Описание ветки */}
        <div>
          <Title level={5}>
            {t('about_branch', { branchName: data.mission.branch.name })}
          </Title>
          <Paragraph type='secondary'>
            {data.mission.branch.description}
          </Paragraph>
        </div>

        {/* Кнопки действий */}
        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          <Space direction='vertical' style={{ width: '100%' }} size='middle'>
            {data.status === 'IN_PROGRESS' && (
              <Button
                size='large'
                type='primary'
                block
                onClick={handleComplete}
              >
                {t('complete_mission')}
              </Button>
            )}

            {data.status === 'COMPLETED' && (
              <Button size='large' block disabled>
                {t('completed')}
              </Button>
            )}

            {data.status === 'NEED_IMPROVEMENT' && (
              <Button
                size='large'
                block
                type='primary'
                onClick={handleComplete}
              >
                {t('resubmit')}
              </Button>
            )}

            {data.status === 'PENDING_REVIEW' && (
              <Button size='large' block disabled>
                {t('pending_review')}
              </Button>
            )}

            {data.status === 'FAILED' && (
              <Button
                size='large'
                block
                type='primary'
                onClick={handleComplete}
              >
                {t('retry')}
              </Button>
            )}

            <Button size='large' block onClick={onClose}>
              {t('close')}
            </Button>
          </Space>
        </div>
      </Space>
    </Drawer>
  )
}

CharacterMissionDrawer.displayName = 'CharacterMissionDrawer'

export default CharacterMissionDrawer
