'use client'

import type { MenuProps, TourProps } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { Button, Drawer, Menu, Modal, Tour } from 'antd'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Links } from '@/components/_base/ResponsiveHeader/Links'
import { useScreens } from '@/hooks/useScreens'

// Определяем навигационные элементы с маршрутами
const navigationItems = [
  Links.PROFILE,
  Links.JOURNAL,
  Links.SHOP,
  Links.RANG,
  Links.NEWS,
  Links.ADMIN,
]

// Тип для рефов меню
export type MenuLinksRef = {
  getTourRefs: () => Record<
    string,
    React.RefObject<HTMLAnchorElement | HTMLButtonElement>
  >
}

const MenuLinks = forwardRef<MenuLinksRef>((_props, ref) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [tourOpen, setTourOpen] = useState(false)
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('MenuLinks')
  const { isMobile, isTablet } = useScreens()

  const isCompact = isMobile || isTablet

  // Рефы для элементов меню
  const profileRef = useRef<HTMLAnchorElement>(null)
  const journalRef = useRef<HTMLAnchorElement>(null)
  const shopRef = useRef<HTMLAnchorElement>(null)
  const rangRef = useRef<HTMLAnchorElement>(null)
  const newsRef = useRef<HTMLAnchorElement>(null)
  const adminRef = useRef<HTMLAnchorElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // Экспортируем рефы для родительского компонента
  useImperativeHandle(ref, () => ({
    getTourRefs: () => ({
      profileMenuItem: profileRef,
      journalMenuItem: journalRef,
      shopMenuItem: shopRef,
      rangMenuItem: rangRef,
      newsMenuItem: newsRef,
      adminMenuItem: adminRef,
      menuButton: menuButtonRef,
    }),
  }))

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
  }

  const handleOk = () => {
    setIsModalOpen(false)
    // Запускаем тур после закрытия модального окна
    setTimeout(() => setTourOpen(true), 300)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // Шаги тура для меню
  const menuTourSteps: TourProps['steps'] = [
    {
      title: 'Профиль',
      description:
        'Перейдите в свой профиль, чтобы посмотреть статистику, артефакты и компетенции.',
      target: () => profileRef.current || document.body,
    },
    {
      title: 'Журнал',
      description:
        'Здесь вы можете просмотреть историю своих действий и достижений.',
      target: () => journalRef.current || document.body,
    },
    {
      title: 'Магазин',
      description:
        'Приобретайте полезные предметы и улучшения для вашего персонажа.',
      target: () => shopRef.current || document.body,
    },
    {
      title: 'Рейтинг',
      description:
        'Сравните свои достижения с другими игроками в рейтинговой таблице.',
      target: () => rangRef.current || document.body,
    },
    {
      title: 'Новости',
      description: 'Будьте в курсе последних обновлений и событий в игре.',
      target: () => newsRef.current || document.body,
    },
    {
      title: 'Админ-панель',
      description:
        'Для администраторов: управление контентом и пользователями.',
      target: () => adminRef.current || document.body,
    },
  ]

  // Функция для получения рефа по ключу
  const getMenuItemRef = (href: string): React.RefObject<HTMLAnchorElement> => {
    switch (href) {
      case Links.PROFILE.href:
        return profileRef
      case Links.JOURNAL.href:
        return journalRef
      case Links.SHOP.href:
        return shopRef
      case Links.RANG.href:
        return rangRef
      case Links.NEWS.href:
        return newsRef
      case Links.ADMIN.href:
        return adminRef
      default:
        return { current: null }
    }
  }

  const createMenuItems = (isVertical = false): MenuProps['items'] =>
    navigationItems?.map((item) => {
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
    <>
      {/* Модальное окно приветствия */}
      <Modal
        title={t('welcome')}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={t('start_tour')}
        cancelText={t('skip_tour')}
      >
        <p>{t('welcome_text')}</p>
        <p>Хотите пройти ознакомительный тур по странице профиля?</p>
      </Modal>
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

      {/* Тур для десктопного меню */}
      <Tour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        steps={menuTourSteps}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
      />
    </>
  )
})

MenuLinks.displayName = 'MenuLinks'

export default MenuLinks
