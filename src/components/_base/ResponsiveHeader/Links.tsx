import type { ComponentClass, FunctionComponent } from 'react'
import { CharacterRole } from '@/models/Character'
import { EmojiIcon } from '@/components/_base/EmojiIcon'

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
    icon: () => <EmojiIcon>🌌</EmojiIcon>,
    labelKey: 'journal',
    href: '/journal',
    isTab: true,
  },
  NEWS: {
    icon: () => <EmojiIcon>🛸</EmojiIcon>,
    labelKey: 'news',
    href: '/news',
    isTab: true,
  },
  PROFILE: {
    icon: () => <EmojiIcon>🧑‍🚀</EmojiIcon>,
    labelKey: 'profile',
    href: '/profile',
    isTab: true,
  },
  RANK: {
    icon: () => <EmojiIcon>⭐</EmojiIcon>,
    labelKey: 'rank',
    href: '/rank',
    isTab: true,
  },
  SHOP: {
    icon: () => <EmojiIcon>🌠</EmojiIcon>,
    labelKey: 'shop',
    href: '/shop/showcase',
    isTab: true,
  },
  ADMIN: {
    icon: () => <EmojiIcon>🔭</EmojiIcon>,
    labelKey: 'admin',
    href: '/admin/lor',
    isProfileTab: true,
    // roles: [
    // CharacterRole.HR,
    // CharacterRole.ORGANIZER,
    // CharacterRole.ADMIN,
    // CharacterRole.MANAGER,
    // CharacterRole.CONTENT_MANAGER,
    // ],
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
