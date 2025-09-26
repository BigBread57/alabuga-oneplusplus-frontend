import type { FCC } from 'src/types'
import { Layout } from 'antd'
import React from 'react'
import { useScreens } from '@/hooks/useScreens'

type ResponsiveLayoutProps = {
  prop?: any
}

const ResponsiveLayout: FCC<ResponsiveLayoutProps> = ({ children }) => {
  const { isMobile, isTablet } = useScreens()

  return (
    <Layout
      style={{
        minHeight: '100vh',
        padding: isMobile ? '8px' : isTablet ? '16px' : '24px',
      }}
    >
      {children}
    </Layout>
  )
}

ResponsiveLayout.displayName = 'ResponsiveLayout'

export default ResponsiveLayout
