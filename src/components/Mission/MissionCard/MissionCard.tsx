'use client'

import type { FCC } from 'src/types'
import type { MissionProps } from '@/models/Mission'
import {
  CalendarOutlined,
  DollarOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { Button, Space, Tag, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useState } from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import ModalWrapper from '@/components/_base/ComponentModalWrapper/ComponentModalWrapper'
import styles from './MissionCard.module.scss'

const { Text, Title, Paragraph } = Typography

interface MissionCardProps {
  mission: MissionProps
  isCompleted?: boolean
  canComplete?: boolean
  onComplete?: (missionId: number) => void
  className?: string
}

const MissionCard: FCC<MissionCardProps> = ({
  mission,
  isCompleted = false,
  canComplete = true,
  onComplete,
  className,
}) => {
  const t = useTranslations('MissionCard')
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusColor = () => {
    if (isCompleted) {
      return 'success'
    }
    if (!canComplete) {
      return 'default'
    }
    if (mission.is_key_mission) {
      return 'warning'
    }
    return 'processing'
  }

  const getStatusText = () => {
    if (isCompleted) {
      return t('completed')
    }
    if (!canComplete) {
      return t('locked')
    }
    if (mission.is_key_mission) {
      return t('key_mission')
    }
    return t('available')
  }

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleComplete = () => {
    if (canComplete && !isCompleted && onComplete) {
      onComplete(mission.id as number) // Assuming mission.id is number
    }
  }

  return (
    <ModalWrapper
      trigger={
        <CardWrapper
          title={mission.name}
          className={className || ''}
          data-testid='test-MissionCard'
          hoverable={!isExpanded}
        >
          {/* Заголовок миссии (всегда видимый) */}
          <div
            role='button'
            tabIndex={0}
            key='header'
            onClick={handleToggleExpand}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleToggleExpand()
              }
            }}
          >
            <Space align='start' size='middle' style={{ width: '100%' }}>
              <div className={styles.iconWrapper}>
                <Image
                  src={mission.icon}
                  alt={mission.name}
                  className={styles.icon}
                  width={100}
                  height={100}
                />
              </div>

              <div className={styles.titleSection}>
                <Space direction='vertical' size={4} style={{ width: '100%' }}>
                  <div className={styles.titleRow}>
                    <Title level={5} className={styles.title}>
                      {mission.description}
                    </Title>
                  </div>

                  <Space wrap size='small'>
                    <Tag color={getStatusColor()}>{getStatusText()}</Tag>

                    <Tag color={mission.level.color}>{mission.level.name}</Tag>

                    {mission.is_key_mission && (
                      <Tag color='gold'>{t('key')}</Tag>
                    )}

                    {!mission.is_active && (
                      <Tag color='default'>{t('inactive')}</Tag>
                    )}
                  </Space>
                </Space>
              </div>
            </Space>
          </div>
        </CardWrapper>
      }
    >
      <div className={styles.expandedContent}>
        {/* Описание */}
        <Space direction='vertical' size='middle' style={{ width: '100%' }}>
          <div>
            <Text strong>{t('description')}:</Text>
            <Paragraph style={{ marginTop: 8 }}>
              {mission.description}
            </Paragraph>
          </div>

          {/* Награды */}
          <div className={styles.rewards}>
            <Text strong>{t('rewards')}:</Text>
            <Space size='large' style={{ marginTop: 8 }}>
              <Space>
                <TrophyOutlined style={{ color: '#faad14' }} />
                <Text>
                  {mission.experience.toLocaleString()} {t('experience')}
                </Text>
              </Space>
              <Space>
                <DollarOutlined style={{ color: '#52c41a' }} />
                <Text>
                  {mission.currency.toLocaleString()}{' '}
                  {mission?.game_world?.currency_name}
                </Text>
              </Space>
            </Space>
          </div>

          {/* Информация о ветке и времени */}
          <div className={styles.missionInfo}>
            <Space direction='vertical' size='small' style={{ width: '100%' }}>
              <Text type='secondary'>
                <strong>{t('branch')}:</strong> {mission.branch.name}
              </Text>

              {mission.time_to_complete && (
                <Text type='secondary'>
                  <CalendarOutlined /> {mission.time_to_complete}{' '}
                  {t('days_to_complete')}
                </Text>
              )}

              <Text type='secondary'>
                <strong>{t('order')}:</strong> #{mission.order}
              </Text>
            </Space>
          </div>

          {/* Требования */}
          {mission.required_missions
            && mission.required_missions.length > 0 && (
            <div className={styles.requirements}>
              <Text strong>{t('requirements')}:</Text>
              <div style={{ marginTop: 8 }}>
                {mission.required_missions.map((reqMission) => (
                  <Tag
                    key={reqMission.id}
                    color='blue'
                    style={{ marginBottom: 4 }}
                  >
                    {reqMission.name}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Кнопки действий */}
          <div className={styles.actions}>
            <Space>
              {!isCompleted && canComplete && mission.is_active && (
                <Button
                  type='primary'
                  onClick={handleComplete}
                  disabled={!canComplete}
                >
                  {t('complete_mission')}
                </Button>
              )}

              {isCompleted && <Button disabled>{t('completed')}</Button>}

              {!canComplete && <Button disabled>{t('locked')}</Button>}
            </Space>
          </div>
        </Space>
      </div>
    </ModalWrapper>
  )
}

MissionCard.displayName = 'MissionCard'

export default MissionCard
