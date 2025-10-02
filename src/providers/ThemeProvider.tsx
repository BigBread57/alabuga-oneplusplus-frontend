'use client'

import type { ThemeConfig } from 'antd'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { blueTheme, darkTheme, lightTheme } from '@/libs/AntdThemes'

type ThemeName = 'light' | 'dark' | 'blue'

type ThemeContextType = {
  currentTheme: ThemeName
  setTheme: (theme: ThemeName) => void
  themeConfig: ThemeConfig
  isHydrated: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const themes: Record<ThemeName, ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme,
} as const

const THEME_STORAGE_KEY = 'antd-theme'
const DEFAULT_THEME: ThemeName = 'light'

// Безопасная функция для работы с localStorage
const getStoredTheme = (): ThemeName | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null
    return stored && themes[stored] ? stored : null
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error)
    return null
  }
}

const setStoredTheme = (theme: ThemeName): void => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error)
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Инициализируем тему без обращения к localStorage на сервере
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(DEFAULT_THEME)
  const [isHydrated, setIsHydrated] = useState(false)

  // Восстанавливаем тему из localStorage после гидратации
  useEffect(() => {
    const storedTheme = getStoredTheme()
    if (storedTheme) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setCurrentTheme(storedTheme)
    }
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setIsHydrated(true)
  }, [])

  const setTheme = useCallback((theme: ThemeName) => {
    if (!themes[theme]) {
      console.warn(`Invalid theme: ${theme}. Using default theme.`)
      return
    }

    setCurrentTheme(theme)
    setStoredTheme(theme)
  }, [])

  const themeConfig = useMemo(() => {
    return themes[currentTheme] || themes[DEFAULT_THEME]
  }, [currentTheme])

  const contextValue = useMemo(
    () => ({
      currentTheme,
      setTheme,
      themeConfig,
      isHydrated,
    }),
    [currentTheme, setTheme, themeConfig, isHydrated],
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
