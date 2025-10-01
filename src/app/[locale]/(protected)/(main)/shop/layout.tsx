'use client'

import { ShopOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Card, Menu, Space } from 'antd'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTheme } from '@/providers/ThemeProvider'

type ShopPageProps = {
  params: Promise<{ locale: string }>
  children: React.ReactNode
}

export default function Layout(props: ShopPageProps) {
  const params = useParams()
  const locale = params.locale as string
  const { themeConfig } = useTheme()
  const t = useTranslations('ShopPage')

  const menuItems = [
    {
      key: 'shop',
      icon: <ShopOutlined />,
      label: <Link href={`/${locale}/shop/showcase`}>{t('menu_shop')}</Link>,
    },
    {
      key: 'purchases',
      icon: <ShoppingOutlined />,
      label: (
        <Link href={`/${locale}/shop/character-purchase`}>
          {t('menu_purchases')}
        </Link>
      ),
    },
  ]

  return (
    <Space
      direction='vertical'
      size='large'
      style={{
        width: '100%',
      }}
    >
      <Card
        title=''
        style={{
          boxShadow: themeConfig.token?.boxShadow,
          border: 'none',
        }}
        styles={{
          body: { padding: 8 },
        }}
      >
        <Menu mode='horizontal' items={menuItems} />
      </Card>

      {props.children}
    </Space>
  )
}
