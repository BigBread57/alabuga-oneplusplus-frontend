import type { ThemeConfig } from 'antd'
import { theme } from 'antd'

// colors

// 40/58/151 - #283a97
// 0 93 172 - #005dac
// 0 174 239 - #00aeef
// 106 207 246 - #6acff6

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#005dac',
    colorBgBase: '#f5f8ff',
    colorTextBase: '#283a97',
    borderRadius: 8,
    boxShadow: '0 0px 4px #005dac',
  },
  algorithm: theme.defaultAlgorithm, // светлый алгоритм
}

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: '#00aeef',
    colorBgBase: '#283a97',
    colorTextBase: '#6acff6',
    borderRadius: 8,
    boxShadow: '0 0px 4px #00aeef',
  },
  algorithm: theme.darkAlgorithm, // тёмный алгоритм
}

// Дополнительные кастомные темы
export const blueTheme: ThemeConfig = {
  token: {
    colorPrimary: '#00aeef',
    colorBgBase: '#005dac',
    colorTextBase: '#6acff6',
    boxShadow: '0 0px 4px #00aeef',
  },
}

export const greenTheme: ThemeConfig = {
  token: {
    colorPrimary: '#52c41a',
    colorBgBase: '#f6ffed',
    colorTextBase: '#135200',
    boxShadow: '0 0px 4px #52c41a',
  },
}
