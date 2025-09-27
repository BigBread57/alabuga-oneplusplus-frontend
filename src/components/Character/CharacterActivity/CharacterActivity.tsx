'use client'

import type { FCC } from 'src/types'
import React, { useState } from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { useActivityTabs } from '@/components/Character/CharacterActivity/useActivityTabs'
import { useContentTabsList } from '@/components/Character/CharacterActivity/useContentTabsList'
import { useFilter } from '@/hooks/useFilter'
import { CharacterEvent } from '@/models/CharacterEvent'
import {
  CharacterMission,
  CharacterMissionStatus,
} from '@/models/CharacterMission'
import { useFetchItems } from '@/services/base/hooks'
import MissionStatusFilter from '../MissionStatusFilter/MissionStatusFilter'

interface ChatacterActivityProps {
  prop?: any
}

const MODEL_MISSIONS = CharacterMission
const MODEL_EVENTS = CharacterEvent

const CharacterActivity: FCC<ChatacterActivityProps> = ({ prop }) => {
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
    model: MODEL_MISSIONS,
    filter: {
      limit: 1,
      offset: 0,
      status: filter.status,
    },
    qKey: 'missionsCardCount',
  })
  const { tabList } = useActivityTabs({
    missionData,
    eventData,
  })

  const [contentList]: Record<string, React.ReactNode>[]
    = useContentTabsList(filter)

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
      extra={
        <MissionStatusFilter
          value={filter.status}
          onChange={(status) => {
            handleSetFilter({ status })
          }}
        />
      }
      onTabChange={onTab1Change}
      {...prop}
    >
      {contentList?.[activeTabKey1]}
    </CardWrapper>
  )
}

CharacterActivity.displayName = 'CharacterActivity'

export default CharacterActivity
