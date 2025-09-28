import type { ThemeConfig } from 'antd'
import { theme } from 'antd'

// colors
// 40/58/151 - #283a97
// 0 93 172 - #005dac
// 0 174 239 - #00aeef
// 106 207 246 - #6acff6

export const Blue = '#00aeef'
export const DarkBlue = '#005dac'
export const LightBlue = '#6acff6'
export const DarkPurple = '#283a97'

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: DarkBlue,
    colorBgBase: '#ffffff',
    colorTextBase: DarkPurple,
    borderRadius: 8,
    boxShadow: '0 0px 4px #005dac',
  },
  algorithm: theme.defaultAlgorithm, // светлый алгоритм
}

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: Blue,
    colorBgBase: DarkPurple,
    colorTextBase: LightBlue,
    boxShadow: `0 0px 4px ${Blue}`,
  },
  algorithm: theme.darkAlgorithm, // тёмный алгоритм
  components: {
    Menu: {
      itemSelectedColor: '#ffffff',
      itemSelectedBg: DarkBlue,
    },
  },
  hashed: true,
}

// Дополнительные кастомные темы
export const blueTheme: ThemeConfig = {
  token: {
    colorPrimary: Blue,
    colorBgBase: DarkBlue,
    colorTextBase: LightBlue,
    boxShadow: `0 0px 4px ${Blue}`,
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
