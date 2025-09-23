'use client'

import type { CardProps } from 'antd'
import type { FCC } from '@/types'
import { Card } from 'antd'
import { useTheme } from '@/providers/ThemeProvider'

type CardWrapperProps = CardProps

const CardWrapper: FCC<CardWrapperProps> = ({ children, ...cardProps }) => {
  const { themeConfig } = useTheme()

  return (
    <Card
      hoverable
      data-testid='CardWrapper-data-testid'
      style={{
        boxShadow: themeConfig.token?.boxShadow,
        background: themeConfig.token?.colorBgBase,
      }}
      styles={{
        header: {},
      }}
      {...cardProps}
    >
      {children}
    </Card>
  )
}

CardWrapper.displayName = 'CardWrapper'

export default CardWrapper
export type { CardWrapperProps }
