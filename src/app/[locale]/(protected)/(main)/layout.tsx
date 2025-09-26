'use client'

import { Layout } from 'antd'
import React, { useEffect } from 'react'
import { ResponsiveHeader } from '@/components/_base/ResponsiveHeader/ResponsiveHeader'
import { ResponsiveLayout } from '@/components/_base/ResponsiveLayout'
import { LogoSwitcher } from '@/components/_icons/logo/LogoSwitcher'
import { useTheme } from '@/providers/ThemeProvider'

const { Content, Footer } = Layout

type MainLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { themeConfig } = useTheme()

  // Безопасное обновление стилей body только на клиенте
  useEffect(() => {
    if (typeof document !== 'undefined' && themeConfig?.token?.colorBgBase) {
      const bodyElement = document.getElementsByTagName('body')[0]
      if (bodyElement) {
        bodyElement.style.backgroundColor = themeConfig.token
          .colorBgBase as string
      }
    }
  }, [themeConfig?.token?.colorBgBase])

  return (
    <ResponsiveLayout>
      <ResponsiveHeader title={<LogoSwitcher height={50} />} />
      <Content style={{ padding: '24px 0', overflow: 'initial' }}>
        {children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        1++ ©{new Date().getFullYear()} Created by 1++
      </Footer>
    </ResponsiveLayout>
  )
}

export default MainLayout
