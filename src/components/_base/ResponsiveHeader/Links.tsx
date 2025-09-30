import type { ComponentClass, FunctionComponent } from 'react'
import {
  AppstoreOutlined,
  BarChartOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'

export interface LinkProps {
  labelKey: string | React.ReactNode
  href: string
  isTab?: boolean
  isProfileTab?: boolean
  icon: string | FunctionComponent<object> | ComponentClass<object, any>
}

export interface LinksKeys {
  JOURNAL: LinkProps
  NEWS: LinkProps
  PROFILE: LinkProps
  RANG: LinkProps
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
  RANG: {
    icon: TeamOutlined,
    labelKey: 'rang',
    href: '/rang',
    isTab: true,
  },
  SHOP: {
    icon: ShopOutlined,
    labelKey: 'shop',
    href: '/shop',
    isTab: true,
  },
  ADMIN: {
    icon: TeamOutlined,
    labelKey: 'admin',
    href: '/admin/lor',
    isProfileTab: true,
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
