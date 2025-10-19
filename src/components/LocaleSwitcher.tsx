'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, Globe } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from '@/libs/I18nNavigation'
import { routing } from '@/libs/I18nRouting'

type LocaleOption = {
  value: string
  label: string
  flag: string
}

const localeOptions: LocaleOption[] = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'ru', label: 'Русский', flag: '🇷🇺' },
]

type LocaleSwitcherProps = {
  variant?: 'default' | 'compact'
  size?: 'small' | 'middle' | 'large'
}

export const LocaleSwitcher = ({
  variant = 'default',
  size = 'middle',
}: LocaleSwitcherProps = {}) => {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('LocaleSwitcher')
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleMenuClick = (localeCode: string) => {
    if (localeCode !== locale) {
      router.push(`/${localeCode}${pathname}`)
      router.refresh()
    }
    setIsOpen(false)
  }

  const currentLocale = localeOptions.find((opt) => opt.value === locale)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const menuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 },
    }),
  }

  // Компактный вариант
  if (variant === 'compact') {
    return (
      <div className='relative' ref={menuRef}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-cyan-400 transition-all duration-300 hover:text-indigo-400 focus:outline-none'
          aria-label={t('aria_label')}
        >
          <Globe size={size === 'small' ? 18 : size === 'large' ? 24 : 20} />
          <span className='text-sm font-medium'>{currentLocale?.flag}</span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              className='absolute right-0 mt-2 min-w-[140px] rounded-lg border border-indigo-500/20 bg-slate-900/80 shadow-2xl backdrop-blur-xl'
            >
              {routing.locales?.map((localeCode, i) => {
                const option = localeOptions.find(
                  (opt) => opt.value === localeCode,
                )
                const isSelected = localeCode === locale

                return (
                  <motion.button
                    key={localeCode}
                    custom={i}
                    variants={itemVariants}
                    initial='hidden'
                    animate='visible'
                    onClick={() => handleMenuClick(localeCode)}
                    disabled={isSelected}
                    className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-all duration-200 ${
                      isSelected
                        ? 'bg-indigo-500/20 text-cyan-400'
                        : 'text-gray-300 hover:bg-indigo-500/10 hover:text-cyan-400'
                    } disabled:cursor-not-allowed ${i > 0 ? 'border-t border-indigo-500/10' : ''}`}
                  >
                    <span className='text-base'>{option?.flag || '🌍'}</span>
                    <span className='flex-1'>
                      {option?.label || localeCode.toUpperCase()}
                    </span>
                    {isSelected && (
                      <Check size={16} className='text-cyan-400' />
                    )}
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Полный вариант
  return (
    <div className='relative' ref={menuRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='flex items-center gap-2 rounded-lg px-4 py-2.5 text-white transition-all duration-300 hover:bg-indigo-500/10 focus:outline-none'
        aria-label={t('aria_label')}
      >
        <Globe
          size={size === 'small' ? 18 : size === 'large' ? 24 : 20}
          className='text-cyan-400'
        />
        <span className='font-medium'>{currentLocale?.flag}</span>
        <span className='text-sm text-gray-300'>
          {currentLocale?.value.toUpperCase()}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='absolute right-0 mt-2 min-w-[180px] overflow-hidden rounded-lg border border-indigo-500/20 bg-slate-900/80 shadow-2xl backdrop-blur-xl'
          >
            {routing.locales?.map((localeCode, i) => {
              const option = localeOptions.find(
                (opt) => opt.value === localeCode,
              )
              const isSelected = localeCode === locale

              return (
                <motion.button
                  key={localeCode}
                  custom={i}
                  variants={itemVariants}
                  initial='hidden'
                  animate='visible'
                  onClick={() => handleMenuClick(localeCode)}
                  disabled={isSelected}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-indigo-500/20 text-cyan-400'
                      : 'text-gray-300 hover:bg-indigo-500/10 hover:text-cyan-400'
                  } disabled:cursor-not-allowed ${i > 0 ? 'border-t border-indigo-500/10' : ''}`}
                >
                  <span className='text-lg'>{option?.flag || '🌍'}</span>
                  <div className='flex-1'>
                    <div className='font-medium'>
                      {option?.label || localeCode.toUpperCase()}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {localeCode.toUpperCase()}
                    </div>
                  </div>
                  {isSelected && <Check size={18} className='text-cyan-400' />}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
