'use client'

import type { MenuProps } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { usePathname } from '@/libs/I18nNavigation'
import { routing } from '@/libs/I18nRouting'

type LocaleOption = {
  value: string
  label: string
  flag: string
}

const localeOptions: LocaleOption[] = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'ru', label: 'Русский', flag: '🇷🇺' },
]

type LocaleSwitcherProps = {
  variant?: 'default' | 'compact'
  size?: 'small' | 'middle' | 'large'
}

export const LocaleSwitcher = ({
  variant = 'default',
  size = 'middle',
}: LocaleSwitcherProps = {}) => {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('LocaleSwitcher')

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(`/${key}${pathname}`)
    router.refresh()
  }

  const currentLocale = localeOptions.find((opt) => opt.value === locale)

  const menuItems: MenuProps['items'] = routing.locales.map((localeCode) => {
    const option = localeOptions.find((opt) => opt.value === localeCode)
    return {
      key: localeCode,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{option?.flag || '🌍'}</span>
          <span>{option?.label || localeCode.toUpperCase()}</span>
        </div>
      ),
      disabled: localeCode === locale,
    }
  })

  if (variant === 'compact') {
    return (
      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        placement='bottomRight'
        arrow
      >
        <Button
          type='text'
          size={size}
          icon={<GlobalOutlined />}
          aria-label={t('aria_label')}
        >
          {currentLocale?.flag}
        </Button>
      </Dropdown>
    )
  }

  return (
    <Dropdown
      menu={{ items: menuItems, onClick: handleMenuClick }}
      placement='bottomRight'
      arrow
    >
      <Button
        type='text'
        size={size}
        icon={<GlobalOutlined />}
        aria-label={t('aria_label')}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {currentLocale?.flag}
          <span>{currentLocale?.value.toUpperCase()}</span>
        </span>
      </Button>
    </Dropdown>
  )
}
