'use client'

import { SettingOutlined } from '@ant-design/icons'
import { Button, Divider, Drawer, Grid, Space, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { ThemeSwitcher } from '@/components/_base/ThemeSwitcher'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

type AppSettingsProps = {
  placement?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'small' | 'middle' | 'large'
  buttonVariant?: 'default' | 'text' | 'icon-only'
}

export const AppSettings = ({
  placement = 'right',
  size = 'middle',
  buttonVariant = 'icon-only',
}: AppSettingsProps = {}) => {
  const [open, setOpen] = useState(false)
  const t = useTranslations('AppSettings')
  const screens = useBreakpoint()

  const isMobile = screens.xs && !screens.sm
  const drawerWidth = isMobile ? '100%' : 400

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const renderTriggerButton = () => {
    if (buttonVariant === 'icon-only') {
      return (
        <Button
          type='text'
          size={size}
          icon={<SettingOutlined />}
          onClick={showDrawer}
          aria-label={t('aria_label')}
        />
      )
    }

    if (buttonVariant === 'text') {
      return (
        <Button
          type='text'
          size={size}
          icon={<SettingOutlined />}
          onClick={showDrawer}
        >
          {t('settings')}
        </Button>
      )
    }

    return (
      <Button size={size} icon={<SettingOutlined />} onClick={showDrawer}>
        {t('settings')}
      </Button>
    )
  }

  return (
    <>
      {renderTriggerButton()}

      <Drawer
        title={(
          <Space>
            <SettingOutlined />
            <span>{t('settings')}</span>
          </Space>
        )}
        placement={isMobile ? 'bottom' : placement}
        width={drawerWidth}
        height={isMobile ? '50%' : undefined}
        onClose={onClose}
        open={open}
        destroyOnClose
        styles={{
          body: {
            padding: '24px',
          },
        }}
      >
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          {/* Секция темы */}
          <div>
            <Title level={5} style={{ margin: 0, marginBottom: '12px' }}>
              {t('appearance.title')}
            </Title>
            <Text
              type='secondary'
              style={{
                fontSize: '14px',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              {t('appearance.description')}
            </Text>
            <ThemeSwitcher variant='default' size='large' />
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* Секция языка */}
          <div>
            <Title level={5} style={{ margin: 0, marginBottom: '12px' }}>
              {t('language.title')}
            </Title>
            <Text
              type='secondary'
              style={{
                fontSize: '14px',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              {t('language.description')}
            </Text>
            <LocaleSwitcher variant='default' size='large' />
          </div>

          {/* Дополнительные настройки */}
          <Divider style={{ margin: '16px 0' }} />

          <div>
            <Title level={5} style={{ margin: 0, marginBottom: '12px' }}>
              {t('other.title')}
            </Title>
            <Space direction='vertical' size='middle' style={{ width: '100%' }}>
              <Text type='secondary' style={{ fontSize: '14px' }}>
                {t('other.more_settings_coming')}
              </Text>
            </Space>
          </div>
        </Space>
      </Drawer>
    </>
  )
}

AppSettings.displayName = 'AppSettings'

export default AppSettings
