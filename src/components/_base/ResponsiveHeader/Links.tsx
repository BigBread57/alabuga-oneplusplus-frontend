import type { ComponentClass, FunctionComponent } from 'react'
import {
  BarChart3,
  Newspaper,
  Rocket,
  ShoppingCart,
  Users,
  UserStar,
} from 'lucide-react'
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
    icon: BarChart3,
    labelKey: 'journal',
    href: '/journal',
    isTab: true,
  },
  NEWS: {
    icon: Newspaper,
    labelKey: 'news',
    href: '/news',
    isTab: true,
  },
  PROFILE: {
    icon: Rocket,
    labelKey: 'training_center',
    href: '/profile',
    isTab: true,
  },
  RANK: {
    icon: Users,
    labelKey: 'rank',
    href: '/rank',
    isTab: true,
  },
  SHOP: {
    icon: ShoppingCart,
    labelKey: 'shop',
    href: '/shop/showcase',
    isTab: true,
  },
  ADMIN: {
    icon: UserStar,
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
