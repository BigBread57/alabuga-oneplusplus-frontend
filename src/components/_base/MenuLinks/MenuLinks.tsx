import type { MenuProps } from 'antd'
import type { FCC } from 'src/types'
import {
  AppstoreOutlined,
  BarChartOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, Menu } from 'antd'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'

// Определяем навигационные элементы с маршрутами
const navigationItems = [
  { icon: UserOutlined, labelKey: 'profile', href: '/profile' },
  { icon: BarChartOutlined, labelKey: 'journal', href: '/journal' },
  { icon: ShopOutlined, labelKey: 'shop', href: '/shop' },
  { icon: TeamOutlined, labelKey: 'rang', href: '/rang' },
  { icon: AppstoreOutlined, labelKey: 'news', href: '/news' },
]

const MenuLinks: FCC = () => {
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('MenuLinks')

  const items: MenuProps['items'] = navigationItems.map((item) => ({
    key: item.href,
    label: (
      <Link href={`/${locale}${item.href}`}>
        <Button size='large' type='text' icon={React.createElement(item.icon)}>
          {t(item.labelKey as any).toUpperCase()}
        </Button>
      </Link>
    ),
  }))

  // Определяем активный ключ на основе текущего пути
  // Убираем локаль из pathname для сравнения
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/home'
  const selectedKeys = [pathWithoutLocale]

  return (
    <Menu
      mode='horizontal'
      selectedKeys={selectedKeys}
      items={items}
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
