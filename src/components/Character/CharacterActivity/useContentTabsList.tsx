import { Space } from 'antd'
import React from 'react'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { CharacterEvent } from '@/models/CharacterEvent'
import { CharacterMissionBranch } from '@/models/CharacterMissionBranch'
import EventCard from '../../Event/EventCard/EventCard'
import MissionBranchCollapse from '../../MissionBranch/MissionBranchCollapse/MissionBranchCollapse'

const MODEL_CHARACTER_MISSION_BRANCHES = CharacterMissionBranch
const MODEL_EVENTS = CharacterEvent

export const useContentTabsList = (filter: Record<string, any>) => {
  const filterMemo = React.useMemo(() => filter, [filter])
  return [
    {
      tab1: (
        <FetchMoreItemsComponent
          isParentCounter
          model={MODEL_CHARACTER_MISSION_BRANCHES}
          defFilters={filterMemo}
          renderItems={({ data, refetch }) => (
            <div
              style={{
                paddingRight: '8px',
              }}
            >
              <Space
                direction='vertical'
                size='large'
                style={{ width: '100%' }}
              >
                {data?.map((item) => (
                  <MissionBranchCollapse
                    data={item}
                    key={item.id}
                    externalFilter={filter}
                    onRefetch={refetch}
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
          defFilters={filterMemo}
          renderItems={({ data, refetch }) => (
            <div
              style={{
                paddingRight: '8px',
              }}
            >
              <Space
                direction='vertical'
                size='large'
                style={{ width: '100%' }}
              >
                {data?.map((item) => (
                  <EventCard data={item} key={item.id} onComplete={refetch} />
                ))}
              </Space>
            </div>
          )}
        />
      ),
    },
  ]
}
