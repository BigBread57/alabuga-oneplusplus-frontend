'use client'

import type { CharacterMissionProps } from '@/models/CharacterMission'
import {
  CalendarOutlined,
  DollarOutlined,
  EyeOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { Button, Card, Divider, Drawer, Space, Tag, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { useDateTimePrettyStr } from '@/hooks/useDateTimePrettyStr'

const { Text, Title, Paragraph } = Typography

interface MissionCardProps {
  data: CharacterMissionProps
  onComplete?: () => void
}

const MissionCard: React.FC<MissionCardProps> = ({ data, onComplete }) => {
  const t = useTranslations('MissionCard')
  const [drawerVisible, setDrawerVisible] = useState(false)

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

  const { timeDateString } = useDateTimePrettyStr()

  const handleComplete = () => {
    onComplete?.()
    setDrawerVisible(false)
  }

  return (
    <>
      {/* Основная карточка */}
      <Card
        hoverable
        onClick={() => setDrawerVisible(true)}
        style={{ cursor: 'pointer' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: 1 }}>
            <Title level={5} style={{ color: data.mission.branch.color }}>
              {data.mission.name}
            </Title>

            <Paragraph ellipsis={{ rows: 2 }}>
              {data.mission.description}
            </Paragraph>

            <Space wrap size='small' style={{ marginBottom: 8 }}>
              <Tag color={getStatusColor()}>{data.status_display_name}</Tag>

              {data.mission.is_key_mission && (
                <Tag color='gold'>{t('key_mission')}</Tag>
              )}

              <Tag color='blue'>
                <>
                  {t('level')} {data?.mission?.level}
                </>
              </Tag>
            </Space>

            <Space direction='vertical' size={4}>
              <Text type='secondary' style={{ fontSize: '12px' }}>
                <CalendarOutlined /> {t('start')}:{' '}
                {timeDateString(data.start_datetime)}
              </Text>
              <Text type='secondary' style={{ fontSize: '12px' }}>
                <CalendarOutlined /> {t('end')}:{' '}
                {timeDateString(data?.end_datetime as string)}
              </Text>
            </Space>
          </div>

          <Button
            type='text'
            icon={<EyeOutlined />}
            size='small'
            onClick={(e) => {
              e.stopPropagation()
              setDrawerVisible(true)
            }}
            aria-label={t('view_details')}
          />
        </div>
      </Card>

      {/* Дровер с детальной информацией */}
      <Drawer
        title={data.mission.name}
        placement='right'
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={700}
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
                <CalendarOutlined /> <strong>{t('start_date')}:</strong>{' '}
                {timeDateString(data.start_datetime)}
              </Text>
              <Text>
                <CalendarOutlined /> <strong>{t('end_date')}:</strong>{' '}
                {timeDateString(data.end_datetime as string)}
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

              <Button
                size='large'
                block
                onClick={() => setDrawerVisible(false)}
              >
                {t('close')}
              </Button>
            </Space>
          </div>
        </Space>
      </Drawer>
    </>
  )
}

export default MissionCard
