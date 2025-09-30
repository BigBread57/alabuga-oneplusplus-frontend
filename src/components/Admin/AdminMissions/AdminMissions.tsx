'use client'

import type { FCC } from 'src/types'
import { Space, Tag } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { MissionStatusFilter } from '@/components/Character/MissionStatusFilter'
import { EventCard } from '@/components/Event/EventCard'
import { MissionCard } from '@/components/Mission/MissionCard'
import { useFilter } from '@/hooks/useFilter'
import { CharacterEventForInspector } from '@/models/CharacterEventForInspector'
import { CharacterMissionStatus } from '@/models/CharacterMission'
import { CharacterMissionForInspector } from '@/models/CharacterMissionForInspector'
import { useFetchItems } from '@/services/base/hooks'

const MODEL_EVENTS = CharacterEventForInspector
const MODEL_CHARACTER_MISSIONS = CharacterMissionForInspector

const contentTabsList = ({
  externalFilter,
  onRefetch,
}: {
  missionData?: any
  eventData?: any
  externalFilter?: Record<string, any>
  onRefetch?: () => void
}) => {
  const contentList: Record<string, React.ReactNode> = {
    tab1: (
      <FetchMoreItemsComponent
        isParentCounter
        model={MODEL_CHARACTER_MISSIONS}
        defFilters={externalFilter}
        renderItems={({ data, refetch }) => (
          <div style={{ paddingRight: '8px' }}>
            <Space direction='vertical' size='large' style={{ width: '100%' }}>
              {data?.map((item: any) => (
                <MissionCard
                  data={item}
                  key={item.id}
                  onComplete={() => {
                    refetch()
                    onRefetch?.()
                  }}
                />
              ))}
            </Space>
          </div>
        )}
      />
    ),
    tab2: (
      <FetchMoreItemsComponent
        isParentCounter
        model={MODEL_EVENTS}
        defFilters={externalFilter}
        renderItems={({ data, refetch }) => (
          <div style={{ paddingRight: '8px' }}>
            <Space direction='vertical' size='large' style={{ width: '100%' }}>
              {data?.map((item: any) => (
                <EventCard data={item} key={item.id} onComplete={refetch} />
              ))}
            </Space>
          </div>
        )}
      />
    ),
  }

  return contentList
}

const useActivityTabs = ({
  missionData,
  eventData,
}: {
  missionData?: any
  eventData?: any
}) => {
  const t = useTranslations('Mission')

  const tabList = [
    {
      key: 'tab1',
      tab: (
        <Space direction='horizontal'>
          {t('missions').toUpperCase()}
          <Tag>{missionData?.data?.count || 0}</Tag>
        </Space>
      ),
    },
    {
      key: 'tab2',
      tab: (
        <Space direction='horizontal'>
          {t('events').toUpperCase()}
          <Tag>{eventData?.data?.count || 0}</Tag>
        </Space>
      ),
    },
  ]
  return { tabList }
}

const AdminMissions: FCC = () => {
  const [activeTabKey1, setActiveTabKey1] = useState<string>('tab1')
  const onTab1Change = (key: string) => {
    setActiveTabKey1(key)
  }

  const [filter, handleSetFilter] = useFilter({
    status: CharacterMissionStatus.IN_PROGRESS,
  })

  const { data: eventData } = useFetchItems({
    model: MODEL_EVENTS,
    filter: {
      limit: 1,
      offset: 0,
      status: filter.status,
    },
    qKey: 'eventsCardCount',
  })

  const { data: missionData } = useFetchItems({
    model: MODEL_CHARACTER_MISSIONS,
    filter: {
      limit: 1,
      offset: 0,
      status: filter.status,
    },
    qKey: 'characterMissionsBranchCardCount',
  })

  const { tabList } = useActivityTabs({
    missionData,
    eventData,
  })

  const contentList = contentTabsList({
    missionData,
    eventData,
    externalFilter: filter,
  })

  return (
    <CardWrapper
      styles={{
        title: {
          display: 'none',
        },
        body: {
          height: '85%',
          overflow: 'scroll',
        },
      }}
      tabList={tabList}
      activeTabKey={activeTabKey1}
      onTabChange={onTab1Change}
      extra={
        <MissionStatusFilter
          value={filter.status}
          onChange={(status) => {
            handleSetFilter({ status })
          }}
        />
      }
    >
      {contentList?.[activeTabKey1]}
    </CardWrapper>
  )
}

AdminMissions.displayName = 'AdminMissions'

export default AdminMissions
