import type { FCC } from 'src/types'
import {
  BarChartOutlined,
  GlobalOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { Card, Menu } from 'antd'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useScreens } from '@/hooks/useScreens'
import { useTheme } from '@/providers/ThemeProvider'

const AdminMenu: FCC = () => {
  const pathname = usePathname()
  const { isMobile, isTablet } = useScreens()
  const t = useTranslations('AdminMenu')
  const { themeConfig } = useTheme()

  // Определяем текущую выбранную вкладку
  const getSelectedKey = () => {
    if (pathname.includes('missions')) {
      return 'missions'
    }
    if (pathname.includes('lor')) {
      return 'lor'
    }
    if (pathname.includes('statistics')) {
      return 'statistics'
    }
    if (pathname.includes('shop')) {
      return 'shop'
    }
    return 'admin'
  }

  const menuItems = [
    {
      key: 'lor',
      icon: <GlobalOutlined />,
      label: <Link href='lor'>{t('lor')}</Link>,
    },
    {
      key: 'missions',
      icon: <TrophyOutlined />,
      label: <Link href='missions'>{t('missions')}</Link>,
    },
    {
      key: 'statistics',
      icon: <BarChartOutlined />,
      label: <Link href='statistics'>{t('statistics')}</Link>,
    },
    {
      key: 'shop',
      icon: <BarChartOutlined />,
      label: <Link href='shop'>{t('shop')}</Link>,
    },
  ]

  return (
    <Card
      title=''
      styles={{
        body: { padding: isMobile || isTablet ? 0 : undefined },
      }}
      style={{
        boxShadow: themeConfig.token?.boxShadow,
      }}
    >
      <Menu
        mode={isMobile || isTablet ? 'horizontal' : 'vertical'}
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        style={{
          background: 'transparent',

          border: 'none',
        }}
      />
    </Card>
  )
}

AdminMenu.displayName = 'AdminMenu'

export default AdminMenu
