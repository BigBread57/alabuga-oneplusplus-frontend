'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Settings, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

const ModalContent = ({
  isOpen,
  onClose,
  t,
}: {
  isOpen: boolean
  onClose: () => void
  t: (key: string) => string
}) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.25, ease: 'easeOut' },
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          onClick={onClose}
          className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm'
        >
          <motion.div
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            onClick={(e) => e.stopPropagation()}
            className='relative w-full max-w-md rounded-2xl border border-indigo-500/20 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl'
          >
            {/* Кнопка закрытия */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className='absolute top-4 right-4 p-1.5 text-gray-400 transition-colors duration-200 hover:text-cyan-400'
            >
              <X size={20} />
            </motion.button>

            {/* Заголовок */}
            <div className='mb-6 flex items-center gap-3'>
              <div className='rounded-lg bg-indigo-500/20 p-2'>
                <Settings size={24} className='text-cyan-400' />
              </div>
              <h2 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-xl font-bold text-transparent'>
                {t('settings')}
              </h2>
            </div>

            {/* Контент */}
            <div className='flex flex-col gap-6'>
              {/* Секция темы */}
              <motion.div
                custom={0}
                variants={sectionVariants}
                initial='hidden'
                animate='visible'
              >
                <div className='space-y-3'>
                  <div>
                    <h3 className='mb-1 text-sm font-semibold text-gray-200'>
                      {t('appearance.title')}
                    </h3>
                    <p className='text-xs text-gray-400'>
                      {t('appearance.description')}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className='h-px origin-left bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent'
              />

              {/* Секция языка */}
              <motion.div
                custom={1}
                variants={sectionVariants}
                initial='hidden'
                animate='visible'
              >
                <div className='space-y-3'>
                  <div>
                    <h3 className='mb-1 text-sm font-semibold text-gray-200'>
                      {t('language.title')}
                    </h3>
                    <p className='text-xs text-gray-400'>
                      {t('language.description')}
                    </p>
                  </div>
                  <div className='flex justify-center'>
                    <LocaleSwitcher variant='default' size='middle' />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className='h-px origin-left bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent'
              />

              {/* Прочие настройки */}
              <motion.div
                custom={2}
                variants={sectionVariants}
                initial='hidden'
                animate='visible'
              >
                <div className='space-y-2'>
                  <h3 className='text-sm font-semibold text-gray-200'>
                    {t('other.title')}
                  </h3>
                  <p className='text-xs text-gray-400'>
                    {t('other.more_settings_coming')}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const AppSettings = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const t = useTranslations('AppSettings')

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setIsMounted(true)
  }, [])

  // Закрытие по ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const modalRoot
    = typeof document !== 'undefined'
      ? document.getElementById('modal-root')
      : null

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className='cursor-pointer rounded-lg p-2 text-cyan-400 transition-colors duration-200 hover:bg-indigo-500/10 focus:outline-none'
        aria-label={t('aria_label')}
      >
        <Settings size={24} />
      </motion.button>

      {/* Модалка через Portal */}
      {isMounted
        && modalRoot
        && createPortal(
          <ModalContent
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            t={t}
          />,
          modalRoot,
        )}
    </>
  )
}

AppSettings.displayName = 'AppSettings'

export default AppSettings
