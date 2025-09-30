'use client'

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { useActivityTabs } from '@/components/Character/CharacterActivity/useActivityTabs'
import { useContentTabsList } from '@/components/Character/CharacterActivity/useContentTabsList'
import { useFilter } from '@/hooks/useFilter'
import { CharacterEvent } from '@/models/CharacterEvent'
import { CharacterMissionStatus } from '@/models/CharacterMission'
import { CharacterMissionBranch } from '@/models/CharacterMissionBranch'
import { useFetchItems } from '@/services/base/hooks'
import MissionStatusFilter from '../MissionStatusFilter/MissionStatusFilter'

interface CharacterActivityProps {
  prop?: any
}

export type CharacterActivityRef = {
  getTourRefs: () => Record<string, React.RefObject<any>>
}

const MODEL_EVENTS = CharacterEvent
const MODEL_CHARACTER_MISSION_BRANCHES = CharacterMissionBranch

const CharacterActivity = forwardRef<
  CharacterActivityRef,
  CharacterActivityProps
>(({ prop }, ref) => {
  const [activeTabKey1, setActiveTabKey1] = useState<string>('tab1')
  const onTab1Change = (key: string) => {
    setActiveTabKey1(key)
  }

  const [filter, handleSetFilter] = useFilter({
    status: CharacterMissionStatus.IN_PROGRESS,
  })

  // Рефы для тура
  const activitySectionRef = useRef<HTMLDivElement>(null)
  const statusFilterRef = useRef<HTMLDivElement>(null)
  const activityTabsRef = useRef<HTMLDivElement>(null)

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
    model: MODEL_CHARACTER_MISSION_BRANCHES,
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

  const [contentList]: Record<string, React.ReactNode>[]
    = useContentTabsList(filter)

  // Экспортируем рефы для родительского компонента
  useImperativeHandle(ref, () => ({
    getTourRefs: () => ({
      activitySection: activitySectionRef,
      statusFilter: statusFilterRef,
      activityTabs: activityTabsRef,
    }),
  }))

  return (
    <div ref={activitySectionRef}>
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
          <div ref={statusFilterRef}>
            <MissionStatusFilter
              value={filter.status}
              onChange={(status) => {
                handleSetFilter({ status })
              }}
            />
          </div>
        }
        {...prop}
      >
        <div ref={activityTabsRef}>{contentList?.[activeTabKey1]}</div>
      </CardWrapper>
    </div>
  )
})

CharacterActivity.displayName = 'CharacterActivity'

export default CharacterActivity
