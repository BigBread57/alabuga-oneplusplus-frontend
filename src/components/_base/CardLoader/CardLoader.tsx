import type { FCC } from 'src/types'
import { Card } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'

interface CardLoaderProps {
  isLoading: boolean
}

const CardLoader: FCC<CardLoaderProps> = ({ isLoading, children }) => {
  const t = useTranslations('Common')

  if (!isLoading) {
    return children
  }
  return <Card title={t('loading')} loading={isLoading} />
}

CardLoader.displayName = 'CardLoader'

export default CardLoader
