'use client'

import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Compass,
  Globe,
  Rocket,
  ShoppingCart,
  Trophy,
  X,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { useScreens } from '@/hooks/useScreens'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

const AdminMenu: FCC = () => {
  const pathname = usePathname()
  const { isMobile, isTablet } = useScreens()
  const t = useTranslations('AdminMenu')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Определяем текущую выбранную вкладку
  const getSelectedKey = () => {
    if (pathname.includes('missions')) {
      return 'missions'
    }
    if (pathname.includes('events')) {
      return 'events'
    }
    if (pathname.includes('lor')) {
      return 'lor'
    }
    if (pathname.includes('statistics')) {
      return 'statistics'
    }
    if (pathname.includes('shop')) {
      return 'shop'
    }
    return 'admin'
  }

  const selectedKey = getSelectedKey()

  const menuItems = [
    {
      key: 'lor',
      icon: <Globe size={18} />,
      label: t('lor'),
      href: 'lor',
    },
    {
      key: 'missions',
      icon: <Rocket size={18} />,
      label: t('missions'),
      href: 'missions',
    },
    {
      key: 'events',
      icon: <Trophy size={18} />,
      label: t('events'),
      href: 'events',
    },
    {
      key: 'statistics',
      icon: <BarChart3 size={18} />,
      label: t('statistics'),
      href: 'statistics',
    },
    {
      key: 'shop',
      icon: <ShoppingCart size={18} />,
      label: t('shop'),
      href: 'shop',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  }

  // Мобильная версия - Модальное окно
  if (isMobile || isTablet) {
    return (
      <>
        <motion.button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className='flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 transition-colors hover:bg-indigo-500/20'
        >
          <Compass size={16} />
          <span>Навигация</span>
        </motion.button>

        {/* Модальное окно с меню */}
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs'
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className='w-full max-w-sm rounded-xl border border-indigo-500/20 bg-slate-900 p-6'
            >
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg font-bold text-cyan-400'>Админ меню</h3>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='text-indigo-400 transition-colors hover:text-indigo-300'
                >
                  <X size={20} />
                </button>
              </div>

              {/* Список пунктов меню */}
              <motion.div
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                className='space-y-2'
              >
                {menuItems.map((item) => (
                  <motion.div key={item.key} variants={itemVariants}>
                    <Link href={item.href}>
                      <motion.button
                        onClick={() => setIsModalOpen(false)}
                        className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                          selectedKey === item.key
                            ? 'bg-indigo-500/30 text-indigo-300'
                            : 'text-indigo-300 hover:bg-indigo-500/10'
                        }`}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            {item.icon}
                            <span className='font-medium'>{item.label}</span>
                          </div>
                          {selectedKey === item.key && (
                            <div className='h-2 w-2 rounded-full bg-indigo-400' />
                          )}
                        </div>
                      </motion.button>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </>
    )
  }

  // Десктопная версия - Развернутое меню
  return (
    <motion.div
      variants={sectionVariants}
      className='flex flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs lg:col-span-1'
    >
      <div className='flex items-center gap-2 border-b border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-transparent px-4 py-3'>
        <div className='rounded-lg bg-indigo-500/20 p-1.5'>
          <Compass size={18} className='text-indigo-400' />
        </div>
        <h3 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-sm font-bold text-transparent'>
          Навигация
        </h3>
      </div>

      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='flex-1 space-y-1 overflow-y-auto p-3'
      >
        {menuItems.map((item) => (
          <motion.div key={item.key} variants={itemVariants}>
            <Link href={item.href}>
              <motion.button
                className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                  selectedKey === item.key
                    ? 'bg-indigo-500/30 text-indigo-300'
                    : 'text-indigo-300/70 hover:bg-indigo-500/10 hover:text-indigo-300'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <span
                      className={`transition-colors ${
                        selectedKey === item.key
                          ? 'text-indigo-400'
                          : 'text-indigo-400/60'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className='font-medium'>{item.label}</span>
                  </div>
                  {selectedKey === item.key && (
                    <motion.div
                      layoutId='activeIndicator'
                      className='h-2 w-2 rounded-full bg-indigo-400'
                    />
                  )}
                </div>
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

AdminMenu.displayName = 'AdminMenu'

export default AdminMenu
