'use client'

import { motion } from 'framer-motion'
import React, { useContext } from 'react'
import { AppSettings } from '@/components/_base/AppSettings/AppSettings'
import { MenuLinks } from '@/components/_base/MenuLinks'
import { CurrentUser } from '@/components/CurrentUser'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import { useScreens } from '@/hooks/useScreens'
import ActivityLogsCard from '../../ActivityLog/ActivityLogsCard/ActivityLogsCard'

type ResponsiveHeaderProps = {
  title?: string | React.ReactNode
  showIndividualSwitchers?: boolean
}

export const ResponsiveHeader = ({
  title = 'Ninja',
  showIndividualSwitchers = false,
}: ResponsiveHeaderProps = {}) => {
  const { currentUser } = useContext(CurrentUserContext)
  const { isMobile, isTablet } = useScreens()

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.header
      variants={headerVariants}
      initial='hidden'
      animate='visible'
      className='sticky top-0 z-40 w-full'
    >
      {/* Основной хедер */}
      <div className='border-b border-indigo-500/10 bg-slate-900/0 shadow-none backdrop-blur-xl transition-shadow duration-300 hover:shadow-lg'>
        {/* Контейнер */}
        <div className='mx-auto max-w-full px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:px-8'>
          {/* Flex контейнер */}
          <div className='flex items-center justify-between gap-2 sm:gap-4'>
            {/* Левая часть - Заголовок и меню */}
            <div className='flex min-w-0 flex-1 items-center gap-2 sm:gap-4'>
              {/* Логотип/Заголовок */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className='flex-shrink-0'
              >
                {title}
              </motion.div>

              {/* Меню на больших экранах */}
              {!isMobile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className='hidden md:flex'
                >
                  <MenuLinks />
                </motion.div>
              )}
            </div>

            {/* Правая часть - Действия */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className='flex flex-shrink-0 items-center gap-1 sm:gap-2 md:gap-4'
            >
              {/* Индивидуальные переключатели на десктопе */}
              {showIndividualSwitchers && !isMobile && !isTablet && (
                <div className='hidden gap-2 lg:flex'>
                  {/* Можно добавить дополнительные переключатели */}
                </div>
              )}
              <ActivityLogsCard />
              {/* Текущий пользователь */}
              <CurrentUser currentUser={currentUser} />
              {/* Настройки */}
              <AppSettings />
              {/* Мобильное меню кнопка */}
              {isMobile && (
                <motion.div
                  variants={menuVariants}
                  initial='hidden'
                  animate='visible'
                  exit='exit'
                  className='overflow-hidden'
                >
                  <MenuLinks />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Нижняя полоса свечения */}
        <div className='h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent' />
      </div>
    </motion.header>
  )
}

ResponsiveHeader.displayName = 'ResponsiveHeader'

export default ResponsiveHeader
