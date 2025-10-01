'use client'

import type { CardProps } from 'antd'
import type { FCC } from '@/types'
import { RocketOutlined } from '@ant-design/icons'
import { Card, Typography } from 'antd'
import React from 'react'
import { useTheme } from '@/providers/ThemeProvider'

const { Title } = Typography

type CardWrapperProps = CardProps & {
  backgroundIcon?: React.ComponentType<any>
  iconSize?: number
  iconOpacity?: number
  iconStyle?: React.CSSProperties
}

const CardWrapper: FCC<CardWrapperProps> = ({
  children,
  backgroundIcon: BackgroundIcon = RocketOutlined,
  iconSize = 300,
  iconOpacity = 0.09,
  iconStyle,
  ...cardProps
}) => {
  const { themeConfig } = useTheme()

  return (
    <Card
      hoverable
      data-testid='CardWrapper-data-testid'
      style={{
        boxShadow: themeConfig.token?.boxShadow,
        background: themeConfig.token?.colorBgBase,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        ...cardProps.style,
      }}
      title={<Title level={3}>{cardProps?.title}</Title>}
      {...cardProps}
    >
      <BackgroundIcon
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: `${iconSize}px`,
          color: `rgba(0, 0, 0, ${iconOpacity})`,
          zIndex: 0,
          pointerEvents: 'none',
          ...iconStyle,
        }}
      />
      <div style={{ position: 'relative' }}>{children}</div>
    </Card>
  )
}

CardWrapper.displayName = 'CardWrapper'

export default CardWrapper
export type { CardWrapperProps }
