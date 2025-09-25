'use client'

import type { ThemeConfig } from 'antd'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { blueTheme, darkTheme, greenTheme, lightTheme } from '@/libs/AntdThemes'

type ThemeName = 'light' | 'dark' | 'blue' | 'green'

type ThemeContextType = {
  currentTheme: ThemeName
  setTheme: (theme: ThemeName) => void
  themeConfig: ThemeConfig
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const themes: Record<ThemeName, ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme,
  green: greenTheme,
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage?.getItem('antd-theme') as ThemeName
      return savedTheme && themes[savedTheme] ? savedTheme : 'dark'
    }
    if (!!localStorage && localStorage.getItem('antd-theme')) {
      const savedTheme = localStorage?.getItem('antd-theme') as ThemeName
      return savedTheme && themes[savedTheme] ? savedTheme : 'dark'
    }
    return 'dark'
  })

  const setTheme = useCallback((theme: ThemeName) => {
    setCurrentTheme(theme)
    localStorage?.setItem('antd-theme', theme)
  }, [])

  const themeConfig = themes[currentTheme]

  const contextValue = useMemo(
    () => ({
      currentTheme,
      setTheme,
      themeConfig,
    }),
    [currentTheme, setTheme, themeConfig],
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
