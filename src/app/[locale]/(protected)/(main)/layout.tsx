'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import ComponentLoading from '@/components/_base/Loading/Loading'
import { MessageDisplay } from '@/components/_base/MessageDisplay'
import { ResponsiveHeader } from '@/components/_base/ResponsiveHeader/ResponsiveHeader'
import { ResponsiveLayout } from '@/components/_base/ResponsiveLayout'
import { LogoSwitcher } from '@/components/_icons/logo/LogoSwitcher'
import { TourProvider } from '@/components/Tour/TourProvider'
import { MessageProvider } from '@/providers/MessageProvider'
import '@/styles/global.css'

type MainLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isLoading, setIsLoading] = useState(true)

  // Имитация загрузки
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const footerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.3 },
    },
  }

  return (
    <MessageProvider>
      <MessageDisplay />
      <TourProvider>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='relative flex min-h-screen flex-col'
        >
          {/* Лоадер при загрузке */}
          <AnimatePresence>
            {isLoading ? <ComponentLoading /> : null}
          </AnimatePresence>

          <ResponsiveLayout className='flex flex-1 flex-col'>
            {/* Хедер */}
            <ResponsiveHeader
              title={<LogoSwitcher height={35} width={100} />}
            />

            {/* Основной контент */}
            <motion.main variants={contentVariants} className='flex-1'>
              {children}
            </motion.main>

            {/* Футер */}
            <motion.footer
              variants={footerVariants}
              className='fixed bottom-0 w-full border-t border-indigo-500/10 py-8'
            >
              <div className='text-center'>
                <p className='text-sm text-gray-400 transition-colors duration-300 hover:text-gray-300'>
                  <span className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text font-semibold text-transparent'>
                    1++
                  </span>{' '}
                  ©{new Date().getFullYear()} Created by{' '}
                  <span className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text font-semibold text-transparent'>
                    1++
                  </span>
                </p>
              </div>
            </motion.footer>
          </ResponsiveLayout>

          {/* Контейнер для модалок */}
          <div id='modal-root' className='relative z-50' />
        </motion.div>
      </TourProvider>
    </MessageProvider>
  )
}

export default MainLayout
