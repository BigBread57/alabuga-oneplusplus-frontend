'use client'

import type { FCC } from 'src/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Links } from '@/components/_base/ResponsiveHeader/Links'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import { useTour } from '@/components/Tour/useTour'
import { useScreens } from '@/hooks/useScreens'

const navigationItems = [
  Links.ADMIN,
  Links.MISSION,
  Links.EVENTS,
  Links.JOURNAL,
  Links.SHOP,
  Links.RANK,
  Links.NEWS,
]

const MobileModal = ({
  isOpen,
  onClose,
  filteredItems,
  locale,
  isActive,
  t,
}: {
  isOpen: boolean
  onClose: () => void
  filteredItems: typeof navigationItems
  locale: string
  isActive: (href: string) => boolean
  t: (key: string) => string
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className='fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Модалка */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className='fixed inset-0 z-[9999] flex items-center justify-center p-4'
            onClick={onClose}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className='w-full max-w-md rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-2xl'
            >
              {/* Header */}
              <div className='mb-4 flex items-center justify-between'>
                <h2 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-lg font-bold text-transparent'>
                  {t('navigation')}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className='rounded-lg p-1 transition-colors hover:bg-indigo-500/10'
                >
                  <X size={20} className='text-cyan-400' />
                </motion.button>
              </div>

              {/* Меню */}
              <div className='grid grid-cols-2 gap-3'>
                {filteredItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    custom={i}
                    variants={itemVariants}
                    initial='hidden'
                    animate='visible'
                  >
                    <Link
                      href={`/${locale}${item.href}`}
                      onClick={onClose}
                      className={`flex flex-col items-center justify-center rounded-xl p-4 text-center transition-all duration-200 ${
                        isActive(item.href)
                          ? 'border border-cyan-400/50 bg-indigo-500/20 text-cyan-400'
                          : 'border border-transparent text-gray-300 hover:bg-indigo-500/10 hover:text-cyan-400'
                      }`}
                    >
                      <span className='mb-2 text-2xl'>
                        {React.createElement(item.icon)}
                      </span>
                      <span className='text-xs font-medium uppercase'>
                        {t(item.labelKey as any)}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

const MenuLinks: FCC = () => {
  const { currentUser } = useContext(CurrentUserContext)
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('MenuLinks')
  const { isMobile, isTablet } = useScreens()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setIsMounted(true)
  }, [])

  // Закрытие по ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const { menuButtonRef } = useTour()
  const isCompact = isMobile || isTablet

  const handleModalClose = () => setIsModalOpen(false)

  const filteredItems = navigationItems.filter((link) => {
    if (!link.roles) {
      return true
    }
    return link.roles?.includes(currentUser?.active_character_role)
  })

  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/home'
  const isActive = (href: string) => pathWithoutLocale === href

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  }

  const modalRoot
    = typeof document !== 'undefined'
      ? document.getElementById('modal-root')
      : null

  // --- Мобильная версия с модалкой ---
  if (isCompact) {
    return (
      <>
        {/* Кнопка меню */}
        <motion.button
          ref={menuButtonRef as any}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='cursor-pointer rounded-lg p-2 text-cyan-400 transition-colors duration-200 hover:bg-indigo-500/10 md:hidden'
          aria-label={t('open_menu')}
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          {isModalOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>

        {/* Модалка через Portal */}
        {isMounted
          && modalRoot
          && createPortal(
            <MobileModal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              filteredItems={filteredItems}
              locale={locale}
              isActive={isActive}
              t={t}
            />,
            modalRoot,
          )}
      </>
    )
  }

  // --- Десктопная версия ---
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className='hidden items-center gap-2 md:flex'
    >
      {filteredItems.map((item, i) => (
        <motion.div
          key={item.href}
          custom={i}
          variants={itemVariants}
          initial='hidden'
          animate='visible'
        >
          <Link
            href={`/${locale}${item.href}`}
            className={`group relative flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-200 ${
              isActive(item.href)
                ? 'text-cyan-400'
                : 'text-gray-300 hover:text-cyan-400'
            }`}
          >
            <span className='flex-shrink-0 text-lg'>
              {React.createElement(item.icon)}
            </span>
            <span className='hidden text-sm font-medium uppercase lg:inline'>
              {t(item.labelKey as any)}
            </span>
            <motion.div
              layoutId={isActive(item.href) ? 'activeLink' : undefined}
              className='absolute right-4 bottom-0 left-4 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-400'
              initial={false}
              animate={isActive(item.href) ? { opacity: 1 } : { opacity: 0 }}
            />
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  )
}

MenuLinks.displayName = 'MenuLinks'

export default MenuLinks
