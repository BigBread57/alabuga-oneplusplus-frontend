'use client'

import type { MenuProps } from 'antd'
import type { FCC } from 'src/types'
import { MenuOutlined } from '@ant-design/icons'
import { Button, Drawer, Menu } from 'antd'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { Links } from '@/components/_base/ResponsiveHeader/Links'
import { useScreens } from '@/hooks/useScreens'

// Определяем навигационные элементы с маршрутами
const navigationItems = [
  Links.PROFILE,
  Links.JOURNAL,
  Links.SHOP,
  Links.RANG,
  Links.NEWS,
]

const MenuLinks: FCC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('MenuLinks')
  const { isMobile, isTablet } = useScreens()

  const isCompact = isMobile || isTablet

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
  }

  const createMenuItems = (isVertical = false): MenuProps['items'] =>
    navigationItems?.map((item) => ({
      key: item.href,
      icon: isCompact && React.createElement(item.icon),
      label: isVertical
        ? (
            <Link href={`/${locale}${item.href}`} onClick={handleDrawerClose}>
              {t(item.labelKey as any).toUpperCase()}
            </Link>
          )
        : (
            <Link href={`/${locale}${item.href}`}>
              <Button
                size={isTablet ? 'middle' : 'large'}
                type='text'
                icon={React.createElement(item.icon)}
              >
                {t(item.labelKey as any).toUpperCase()}
              </Button>
            </Link>
          ),
    }))

  // Определяем активный ключ на основе текущего пути
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/home'
  const selectedKeys = [pathWithoutLocale]

  // Мобильная версия с бургер-меню
  if (isCompact) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          minWidth: 0,
          background: 'transparent',
          border: 'none',
        }}
      >
        <Button
          type='text'
          icon={<MenuOutlined />}
          onClick={handleDrawerToggle}
          size='large'
          aria-label={t('open_menu')}
        />

        <Drawer
          title={t('navigation')}
          placement='left'
          onClose={handleDrawerClose}
          open={isDrawerOpen}
          width={isMobile ? '90%' : 300}
        >
          <Menu
            mode='vertical'
            selectedKeys={selectedKeys}
            items={createMenuItems(true)}
            style={{
              border: 'none',
              background: 'transparent',
            }}
          />
        </Drawer>
      </div>
    )
  }

  // Десктопная версия
  return (
    <Menu
      mode='horizontal'
      selectedKeys={selectedKeys}
      items={createMenuItems(false)}
      style={{
        flex: 1,
        minWidth: 0,
        background: 'transparent',
        border: 'none',
      }}
    />
  )
}

MenuLinks.displayName = 'MenuLinks'

export default MenuLinks
