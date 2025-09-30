'use client'
import type { CharacterMissionBranchProps } from '@/models/CharacterMissionBranch'
import { Collapse, Space, Spin, Tag, Typography } from 'antd'
import React from 'react'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { MissionCard } from '@/components/Mission/MissionCard'
import { useFilter } from '@/hooks/useFilter'
import { CharacterMission } from '@/models/CharacterMission'
import { useTheme } from '@/providers/ThemeProvider'
import { useFetchItems } from '@/services/base/hooks'

const { Text } = Typography

interface MissionBranchCollapseProps {
  data: CharacterMissionBranchProps
  externalFilter?: Record<string, any>
  onRefetch?: () => void
}

const MODEL_MISSIONS = CharacterMission

const MissionBranchCollapse: React.FC<MissionBranchCollapseProps> = ({
  data,
  externalFilter,
  onRefetch,
}) => {
  const { themeConfig } = useTheme()
  const [_, setFilter] = useFilter(externalFilter)

  const handleSetFilter = () => {
    setFilter({ branch: data?.branch?.id })
  }
  const { data: missionData, refetch: refetchItem } = useFetchItems({
    model: MODEL_MISSIONS,
    filter: {
      limit: 1,
      offset: 0,
      status: externalFilter?.status,
    },
    qKey: 'missionsCardCount',
  })

  const handleRefetch = () => {
    refetchItem()
    onRefetch?.()
  }

  return (
    <Collapse
      style={{
        boxShadow: themeConfig.token?.boxShadow,
      }}
      bordered={false}
      accordion
      items={[
        {
          key: data?.branch?.id,
          label: (
            <Space>
              <Text strong>{data?.branch?.name}</Text>
              <Tag>{missionData?.data?.count || <Spin spinning />}</Tag>
            </Space>
          ),
          children: (
            <FetchMoreItemsComponent
              isParentCounter
              model={MODEL_MISSIONS}
              defFilters={externalFilter}
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
                      <MissionCard
                        data={item}
                        key={item.id}
                        onComplete={() => {
                          refetch()
                          handleRefetch()
                        }}
                      />
                    ))}
                  </Space>
                </div>
              )}
            />
          ),
        },
      ]}
      onChange={handleSetFilter}
    />
  )
}

export default MissionBranchCollapse
