'use client'

import type { ThemeConfig } from 'antd'
import { createContext } from 'react'

export type ThemeName = 'light' | 'dark' | 'blue' | 'green'

type ThemeContextType = {
  currentTheme: ThemeName
  setTheme: (theme: ThemeName) => void
  themeConfig: ThemeConfig
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
)
