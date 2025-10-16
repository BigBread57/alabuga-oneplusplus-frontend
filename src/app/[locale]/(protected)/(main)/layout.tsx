'use client'

import { Layout } from 'antd'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveHeader } from '@/components/_base/ResponsiveHeader/ResponsiveHeader'
import { ResponsiveLayout } from '@/components/_base/ResponsiveLayout'
import { LogoSwitcher } from '@/components/_icons/logo/LogoSwitcher'
import { TourProvider } from '@/components/Tour/TourProvider'
import { useTheme } from '@/providers/ThemeProvider'

const { Content, Footer } = Layout

type MainLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { themeConfig } = useTheme()

  useEffect(() => {
    if (typeof document !== 'undefined' && themeConfig?.token?.colorBgBase) {
      const bodyElement = document.getElementsByTagName('body')[0]
      if (bodyElement) {
        bodyElement.style.backgroundColor = themeConfig.token
          .colorBgBase as string
      }
    }
  }, [themeConfig?.token?.colorBgBase])

  // Анимация для header
  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  // Анимация для контента
  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: 'easeOut',
      },
    },
  }

  // Анимация для footer
  const footerVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.4,
        ease: 'easeOut',
      },
    },
  }

  // Контейнер для лучшего контроля анимации
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <TourProvider>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <ResponsiveLayout>
          <motion.div variants={headerVariants}>
            <ResponsiveHeader title={<LogoSwitcher height={35} />} />
          </motion.div>

          <motion.div variants={contentVariants}>
            <Content style={{ padding: '24px 0', overflow: 'initial' }}>
              {children}
            </Content>
          </motion.div>

          <motion.div variants={footerVariants}>
            <Footer style={{ textAlign: 'center' }}>
              1++ ©{new Date().getFullYear()} Created by 1++
            </Footer>
          </motion.div>
        </ResponsiveLayout>
      </motion.div>
    </TourProvider>
  )
}

export default MainLayout
