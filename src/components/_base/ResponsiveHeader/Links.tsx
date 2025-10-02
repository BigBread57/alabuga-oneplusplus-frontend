import type { ComponentClass, FunctionComponent } from 'react'
import {
  AppstoreOutlined,
  BarChartOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { CharacterRole } from '@/models/Character'

export interface LinkProps {
  labelKey: string | React.ReactNode
  href: string
  isTab?: boolean
  isProfileTab?: boolean
  icon: string | FunctionComponent<object> | ComponentClass<object, any>
  roles?: CharacterRole[]
}

export interface LinksKeys {
  JOURNAL: LinkProps
  NEWS: LinkProps
  PROFILE: LinkProps
  RANK: LinkProps
  SHOP: LinkProps
  ADMIN: LinkProps
}

export const Links: LinksKeys = {
  JOURNAL: {
    icon: BarChartOutlined,
    labelKey: 'journal',
    href: '/journal',
    isTab: true,
  },
  NEWS: {
    icon: AppstoreOutlined,
    labelKey: 'news',
    href: '/news',
    isTab: true,
  },
  PROFILE: {
    icon: UserOutlined,
    labelKey: 'profile',
    href: '/profile',
    isTab: true,
  },
  RANK: {
    icon: TeamOutlined,
    labelKey: 'rank',
    href: '/rank',
    isTab: true,
  },
  SHOP: {
    icon: ShopOutlined,
    labelKey: 'shop',
    href: '/shop/showcase',
    isTab: true,
  },
  ADMIN: {
    icon: TeamOutlined,
    labelKey: 'admin',
    href: '/admin/lor',
    isProfileTab: true,
    roles: [
      CharacterRole.HR,
      CharacterRole.ORGANIZER,
      CharacterRole.ADMIN,
      CharacterRole.MANAGER,
      CharacterRole.CONTENT_MANAGER,
    ],
  },
}

export const FirstLineLinks = [
  {
    title: '+7 (495) 123-45-67',
    href: 'tel:+74951234567',
  },
  {
    title: 'Единая линия поддержки',
    href: 'https://t.me/pavlin_share',
  },
]
