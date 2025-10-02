'use client'

import type { MenuProps } from 'antd'
import type { FCC } from 'src/types'
import { MenuOutlined } from '@ant-design/icons'
import { Button, Drawer, Menu } from 'antd'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React, { useContext } from 'react'
import { Links } from '@/components/_base/ResponsiveHeader/Links'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import { useTour } from '@/components/Tour/useTour'
import { useScreens } from '@/hooks/useScreens'

// Определяем навигационные элементы с маршрутами
const navigationItems = [
  Links.PROFILE,
  Links.JOURNAL,
  Links.SHOP,
  Links.RANK,
  Links.NEWS,
  Links.ADMIN,
]

const MenuLinks: FCC = () => {
  const { currentUser } = useContext(CurrentUserContext)
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('MenuLinks')
  const { isMobile, isTablet } = useScreens()
  const {
    menuButtonRef,
    profileRef,
    journalRef,
    shopRef,
    rankRef,
    newsRef,
    adminRef,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useTour()

  const isCompact = isMobile || isTablet

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
  }

  // Функция для получения рефа по ключу
  const getMenuItemRef = (href: string): React.RefObject<HTMLAnchorElement> => {
    switch (href) {
      case Links.PROFILE.href:
        return profileRef
      case Links.JOURNAL.href:
        return journalRef
      case Links.SHOP.href:
        return shopRef
      case Links.RANK.href:
        return rankRef
      case Links.NEWS.href:
        return newsRef
      case Links.ADMIN.href:
        return adminRef
      default:
        return { current: null }
    }
  }

  const createMenuItems = (isVertical = false): MenuProps['items'] =>
    navigationItems
      ?.filter((link) => {
        if (!link.roles) {
          return true
        }
        return (
          link.roles
          && link?.roles?.includes(currentUser?.active_character_role)
        )
      })
      .map((item) => {
        const itemRef = getMenuItemRef(item.href)

        const labelContent = isVertical
          ? (
              <Link
                href={`/${locale}${item.href}`}
                onClick={handleDrawerClose}
                ref={itemRef}
              >
                {t(item.labelKey as any).toUpperCase()}
              </Link>
            )
          : (
              <Link href={`/${locale}${item.href}`} ref={itemRef}>
                <Button
                  size={isTablet ? 'middle' : 'large'}
                  type='text'
                  icon={React.createElement(item.icon)}
                >
                  {t(item.labelKey as any).toUpperCase()}
                </Button>
              </Link>
            )

        return {
          key: item.href,
          icon: isCompact && React.createElement(item.icon),
          label: labelContent,
        }
      })

  // Определяем активный ключ на основе текущего пути
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/home'
  const selectedKeys = [pathWithoutLocale]

  // Мобильная версия с бургер-меню
  if (isCompact) {
    return (
      <>
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
            ref={menuButtonRef}
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
      </>
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
