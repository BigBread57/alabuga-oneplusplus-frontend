import type { ThemeConfig } from 'antd'
import { theme } from 'antd'

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    colorBgBase: '#ffffff',
    colorTextBase: '#000000',
    borderRadius: 6,
  },
  algorithm: theme.defaultAlgorithm, // светлый алгоритм
}

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    colorBgBase: '#141414',
    colorTextBase: '#ffffff',
    borderRadius: 6,
  },
  algorithm: theme.darkAlgorithm, // тёмный алгоритм
}

// Дополнительные кастомные темы
export const blueTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorBgBase: '#f5f8ff',
    colorTextBase: '#003366',
  },
}

export const greenTheme: ThemeConfig = {
  token: {
    colorPrimary: '#52c41a',
    colorBgBase: '#f6ffed',
    colorTextBase: '#135200',
  },
}
