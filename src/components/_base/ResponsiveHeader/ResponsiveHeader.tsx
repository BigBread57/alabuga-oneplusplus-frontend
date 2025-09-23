'use client'

import { Layout, Space, Typography } from 'antd'
import React from 'react'
import { AppSettings } from '@/components/_base/AppSettings/AppSettings'
import { MenuLinks } from '@/components/_base/MenuLinks'
import { useScreens } from '@/hooks/useScreens'
import { useTheme } from '@/providers/ThemeProvider'

const { Header: AntHeader } = Layout
const { Title } = Typography

type ResponsiveHeaderProps = {
  title?: string | React.ReactNode
  showIndividualSwitchers?: boolean
}

export const ResponsiveHeader = ({
  title = 'My App',
  showIndividualSwitchers = false,
}: ResponsiveHeaderProps = {}) => {
  const { themeConfig } = useTheme()
  const { isMobile, isTablet } = useScreens()

  return (
    <AntHeader
      style={{
        position: 'sticky',
        top: 5,
        zIndex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 0,
        // background: 'var(--ant-color-bg-container)',
        background: 'transparent',
        borderBottom: '1px solid var(--ant-color-border)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: '16px',
          minWidth: 0,
          overflow: 'hidden',
          borderRadius: '8px',
          padding: '0 16px',
          boxShadow: themeConfig.token?.boxShadow,
          background: themeConfig.token?.colorBgBase,
        }}
      >
        <Title level={isMobile ? 4 : 3} style={{ margin: 0, color: 'inherit' }}>
          {title}
        </Title>
        <MenuLinks />

        <Space size={isMobile ? 'small' : 'middle'}>
          {/* На больших экранах можно показывать отдельные переключатели */}
          {showIndividualSwitchers && !isMobile && !isTablet && (
            <>{/* Здесь можно добавить индивидуальные переключатели */}</>
          )}

          {/* Всегда показываем настройки */}
          <AppSettings
            placement={isMobile ? 'top' : 'right'}
            size='large'
            buttonVariant='icon-only'
          />
        </Space>
      </div>
    </AntHeader>
  )
}

ResponsiveHeader.displayName = 'ResponsiveHeader'

export default ResponsiveHeader
