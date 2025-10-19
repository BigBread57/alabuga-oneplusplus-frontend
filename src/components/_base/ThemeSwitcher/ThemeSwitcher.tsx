'use client'

import type { MenuProps } from 'antd'
import { BulbOutlined } from '@ant-design/icons'
import { Button, Dropdown, Space } from 'antd'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/providers/ThemeProvider'

type ThemeOption = {
  key: string
  icon: string
  labelKey: 'light' | 'dark' | 'blue' | 'green'
}

const themeOptions: ThemeOption[] = [
  { key: 'light', icon: '🌞', labelKey: 'light' },
  { key: 'dark', icon: '🌙', labelKey: 'dark' },
  { key: 'blue', icon: '🔵', labelKey: 'blue' },
]

type ThemeSwitcherProps = {
  variant?: 'default' | 'compact' | 'icon-only'
  size?: 'small' | 'middle' | 'large'
  showCurrentTheme?: boolean
}

export function ThemeSwitcher({
  variant = 'default',
  size = 'middle',
  showCurrentTheme = true,
}: ThemeSwitcherProps = {}) {
  const { currentTheme, setTheme } = useTheme()
  const t = useTranslations('ThemeSwitcher')

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    setTheme(key as any)
  }

  const menuItems: MenuProps['items'] = themeOptions?.map((theme) => ({
    key: theme.key,
    label: (
      <Space>
        <span>{theme.icon}</span>
        <span>{t(`themes.${theme.labelKey}`)}</span>
      </Space>
    ),
    disabled: theme.key === currentTheme,
  }))

  const currentThemeOption = themeOptions.find(
    (theme) => theme.key === currentTheme,
  )
  const currentThemeIcon = currentThemeOption?.icon || '🎨'
  const currentThemeLabel = currentThemeOption
    ? t(`themes.${currentThemeOption.labelKey}`)
    : currentTheme

  if (variant === 'icon-only') {
    return (
      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        placement='bottomRight'
        arrow
      >
        <Button
          type='text'
          size={size}
          icon={<BulbOutlined />}
          aria-label={t('aria_label')}
        >
          {currentThemeIcon}
        </Button>
      </Dropdown>
    )
  }

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
          icon={<BulbOutlined />}
          aria-label={t('aria_label')}
        >
          <Space>
            {currentThemeIcon}
            <span style={{ textTransform: 'capitalize' }}>
              {currentThemeLabel}
            </span>
          </Space>
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
        icon={<BulbOutlined />}
        aria-label={t('aria_label')}
      >
        <Space>
          {t('theme')}
          {showCurrentTheme && (
            <span
              style={{
                fontSize: '12px',
                opacity: 0.7,
                textTransform: 'capitalize',
              }}
            >
              {currentThemeLabel}
            </span>
          )}
        </Space>
      </Button>
    </Dropdown>
  )
}
