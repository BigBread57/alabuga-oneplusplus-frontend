'use client'

import { StyleProvider } from '@ant-design/cssinjs'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import { useTheme } from '@/providers/ThemeProvider'

export function AntdProvider({ children }: { children: React.ReactNode }) {
  const { themeConfig } = useTheme()

  return (
    <AntdRegistry>
      <StyleProvider hashPriority='high'>
        <ConfigProvider
          locale={ruRU}
          theme={themeConfig} // theme передается сюда
        >
          {children}
        </ConfigProvider>
      </StyleProvider>
    </AntdRegistry>
  )
}
