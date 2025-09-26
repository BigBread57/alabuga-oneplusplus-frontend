import { Space } from 'antd'
import React from 'react'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { MissionCard } from '@/components/Mission/MissionCard'
import { CharacterEvent } from '@/models/CharacterEvent'
import { CharacterMission } from '@/models/CharacterMission'

const MODEL_MISSIONS = CharacterMission
const MODEL_EVENTS = CharacterEvent

export const useContentTabsList = (filter: Record<string, any>) => {
  const filterMemo = React.useMemo(() => filter, [filter])
  return [
    {
      tab1: (
        <FetchMoreItemsComponent
          isParentCounter
          model={MODEL_MISSIONS}
          defFilters={filterMemo}
          renderItems={({ data }) => (
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
                  <MissionCard data={item} key={item.id} />
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
          renderItems={({ data }) => (
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
                  <div key={item.id}>{item.id}</div>
                  // <CharacterEvetCard characterEnet={item} key={item.id} />
                ))}
              </Space>
            </div>
          )}
        />
      ),
    },
  ]
}
