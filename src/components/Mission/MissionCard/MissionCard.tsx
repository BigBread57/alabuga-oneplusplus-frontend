'use client'
import type { CharacterMissionProps } from '@/models/CharacterMission'
import { EyeOutlined } from '@ant-design/icons'
import { Button, Card, Space, Tag, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { DateTimeCalendar } from '@/components/_base/DateTimeCalendar'
import { CharacterMissionDrawer } from '@/components/Character/CharacterMissionDrawer'
import { useUrlDrawer } from '@/hooks/useUrlDrawer'

const { Text, Title, Paragraph } = Typography

interface MissionCardProps {
  data: CharacterMissionProps
  onComplete?: () => void
}

const MissionCard: React.FC<MissionCardProps> = ({ data }) => {
  const t = useTranslations('MissionCard')
  const { isVisible, handleOpenDrawer, handleCloseDrawer } = useUrlDrawer({
    paramName: 'mission',
    itemId: data.id,
  })

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
    handleCloseDrawer()
  }

  return (
    <>
      {/* Основная карточка */}
      <Card hoverable onClick={handleOpenDrawer} style={{ cursor: 'pointer' }}>
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
                <DateTimeCalendar
                  text={t('start')}
                  datetime={data.start_datetime as string}
                />
              </Text>
              <Text type='secondary' style={{ fontSize: '12px' }}>
                <DateTimeCalendar
                  text={t('end')}
                  datetime={data.end_datetime as string}
                />
              </Text>
            </Space>
          </div>
          <Button
            type='text'
            icon={<EyeOutlined />}
            size='small'
            onClick={(e) => {
              e.stopPropagation()
              handleOpenDrawer()
            }}
            aria-label={t('view_details')}
          />
        </div>
      </Card>
      {/* Дровер с детальной информацией */}
      <CharacterMissionDrawer
        itemId={+data.id}
        open={isVisible}
        onClose={handleCloseDrawer}
        onComplete={handleComplete}
      />
    </>
  )
}

export default MissionCard
