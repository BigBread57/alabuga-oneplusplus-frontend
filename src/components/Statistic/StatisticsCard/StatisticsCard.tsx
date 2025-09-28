'use client'

import type { FCC } from 'src/types'
import { Divider } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { PieChart } from '@/components/Charts/PieChart'

interface StatisticsCardProps {
  prop?: any
}

const StatisticsCard: FCC<StatisticsCardProps> = () => {
  const t = useTranslations('Statistics')
  return (
    <CardWrapper
      title={t('title').toUpperCase()}
      styles={{
        body: {
          height: '85%',
          overflow: 'scroll',
        },
      }}
    >
      <Divider>SOME</Divider>
      <PieChart
        data={[
          { type: '分类一', value: 27 },
          { type: '分类二', value: 25 },
          { type: '分类三', value: 18 },
          { type: '分类四', value: 15 },
          { type: '分类五', value: 10 },
          { type: '其他', value: 5 },
        ]}
      />
    </CardWrapper>
  )
}

StatisticsCard.displayName = 'StatisticsCard'

export default StatisticsCard
