'use client'

import { Layout } from 'antd'
import React from 'react'
import { ResponsiveHeader } from '@/components/_base/ResponsiveHeader/ResponsiveHeader'
import { ResponsiveLayout } from '@/components/_base/ResponsiveLayout'
import { LogoSwitcher } from '@/components/_icons/logo/LogoSwitcher'

const { Content, Footer } = Layout

const MainLayout = (props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) => {
  return (
    <ResponsiveLayout>
      <ResponsiveHeader title={<LogoSwitcher height={50} />} />
      <Content style={{ padding: '24px 0', overflow: 'initial' }}>
        {props.children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        1++ ©{new Date().getFullYear()} Created by 1++
      </Footer>
    </ResponsiveLayout>
  )
}

export default MainLayout
