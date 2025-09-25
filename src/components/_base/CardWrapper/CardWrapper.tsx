'use client'

import type { CardProps } from 'antd'
import type { FCC } from '@/types'
import { Card, Space, Typography } from 'antd'
import { useTheme } from '@/providers/ThemeProvider'

const { Title } = Typography
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
        height: '100%',
      }}
      title={
        <Space>
          <Title level={3} style={{ margin: 0 }}>
            {cardProps.title}
          </Title>
        </Space>
      }
      {...cardProps}
    >
      {children}
    </Card>
  )
}

CardWrapper.displayName = 'CardWrapper'

export default CardWrapper
export type { CardWrapperProps }
