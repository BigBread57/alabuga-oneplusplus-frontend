'use client'

import type { FCC } from 'src/types'
import { useTranslations } from 'next-intl'
import React from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { CharacterStatistics } from '@/components/Profile/CharacterStatistics'

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
          height: '90%',
          overflow: 'scroll',
        },
      }}
    >
      <CharacterStatistics />
    </CardWrapper>
  )
}

StatisticsCard.displayName = 'StatisticsCard'

export default StatisticsCard
