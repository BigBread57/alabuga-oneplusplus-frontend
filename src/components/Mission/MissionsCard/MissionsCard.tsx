'use client'

import type { FCC } from 'src/types'
import { Space } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { Mission } from '@/models/Mission'
import MissionCard from '../MissionCard/MissionCard'

interface MissionsCardProps {
  prop?: any
}

const MODEL = Mission
const MissionsCard: FCC<MissionsCardProps> = ({ prop }) => {
  const t = useTranslations('Mission')
  return (
    <CardWrapper
      title={t('missions').toUpperCase()}
      styles={{
        body: {
          height: '90%',
          overflow: 'scroll',
        },
      }}
      {...prop}
    >
      <FetchMoreItemsComponent
        model={MODEL}
        defFilters={{}}
        renderItems={({ data }) => (
          <div
            style={{
              paddingRight: '8px',
            }}
          >
            <Space direction='vertical' size='large' style={{ width: '100%' }}>
              {data?.map((item) => (
                <MissionCard mission={item} key={item.id} />
              ))}
            </Space>
          </div>
        )}
      />
    </CardWrapper>
  )
}

MissionsCard.displayName = 'MissionsCard'

export default MissionsCard
