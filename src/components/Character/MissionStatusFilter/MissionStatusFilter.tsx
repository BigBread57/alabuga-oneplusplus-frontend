'use client'

import type { FCC } from 'src/types'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Filter,
  Loader,
  X,
  XCircle,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useRef, useState } from 'react'
import { useScreens } from '@/hooks/useScreens'
import { CharacterMissionStatus } from '@/models/CharacterMission'

type MissionStatusFilterProps = {
  value?: CharacterMissionStatus
  onChange?: (value: CharacterMissionStatus) => void
  size?: 'small' | 'middle' | 'large'
  direction?: 'horizontal' | 'vertical'
}

const MissionStatusFilter: FCC<MissionStatusFilterProps> = ({
  value,
  onChange,
  size = 'middle',
  direction = 'horizontal',
}) => {
  const t = useTranslations('MissionStatus')
  const { isMobile, isTablet } = useScreens()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const options = [
    {
      label: t('in_progress'),
      value: CharacterMissionStatus.IN_PROGRESS,
      icon: Loader,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
    },
    {
      label: t('completed'),
      value: CharacterMissionStatus.COMPLETED,
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
    },
    {
      label: t('need_improvement'),
      value: CharacterMissionStatus.NEED_IMPROVEMENT,
      icon: AlertCircle,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
    },
    {
      label: t('pending_review'),
      value: CharacterMissionStatus.PENDING_REVIEW,
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
    },
    {
      label: t('failed'),
      value: CharacterMissionStatus.FAILED,
      icon: XCircle,
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
    },
  ]

  const getCurrentLabel = () => {
    const currentOption = options.find((option) => option.value === value)
    return currentOption?.label
  }

  const getCurrentOption = () => {
    return options.find((option) => option.value === value)
  }

  // Закрытие при клике вне dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current
        && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMenuClick = (selectedValue: CharacterMissionStatus) => {
    onChange?.(selectedValue)
    setIsDropdownOpen(false)
  }

  const handleClear = () => {
    onChange?.(undefined as any)
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-sm'
      case 'large':
        return 'px-6 py-3 text-base'
      default:
        return 'px-4 py-2 text-sm'
    }
  }

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

  // Десктопная версия - Radio группа с иконками
  if (!isMobile && !isTablet) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-wrap gap-2 ${direction === 'vertical' ? 'flex-col' : ''}`}
      >
        {options.map((option) => {
          const IconComponent = option.icon
          return (
            <motion.button
              key={option.value}
              onClick={() => onChange?.(option.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${getSizeClasses()} flex items-center gap-2 rounded-lg border-2 font-medium transition-all duration-300 ${
                value === option.value
                  ? `border-transparent bg-gradient-to-r ${option.color} text-white shadow-lg`
                  : 'border-indigo-500/20 bg-slate-800/30 text-gray-300 hover:border-indigo-500/40 hover:text-cyan-400'
              }`}
            >
              <IconComponent size={16} />
              <span>{option.label}</span>
            </motion.button>
          )
        })}
      </motion.div>
    )
  }

  // Мобильная версия - Dropdown с иконками
  const currentOption = getCurrentOption()

  return (
    <div ref={dropdownRef} className='relative w-full'>
      {/* Trigger кнопка */}
      <motion.button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border-2 transition-all duration-300 ${
          isDropdownOpen
            ? 'border-cyan-400/60 bg-slate-800/80'
            : 'border-indigo-500/20 bg-slate-800/30 hover:border-indigo-500/40'
        } ${getSizeClasses()}`}
      >
        <div className='flex min-w-0 items-center gap-2'>
          <Filter
            size={18}
            className={
              currentOption
                ? 'flex-shrink-0 text-cyan-400'
                : 'flex-shrink-0 text-gray-400'
            }
          />
          <span
            className={`${currentOption ? 'font-medium text-cyan-400' : 'text-gray-400'} truncate`}
          >
            {getCurrentLabel() || t('all')}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      {/* Dropdown меню */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            variants={menuVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg border border-indigo-500/20 bg-slate-900/90 shadow-2xl backdrop-blur-xl'
          >
            <div className='py-2'>
              {/* Опция "Все" */}
              <motion.button
                onClick={handleClear}
                className='group flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-indigo-500/10'
              >
                <span>{t('all')}</span>
                {!value && <X size={16} className='text-cyan-400' />}
              </motion.button>

              {/* Разделитель */}
              <div className='my-1 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent' />

              {/* Остальные опции */}
              {options.map((option, index) => {
                const IconComponent = option.icon
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => handleMenuClick(option.value)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-all duration-200 ${
                      value === option.value
                        ? `${option.bgColor} font-medium text-cyan-400`
                        : 'text-gray-300 hover:bg-indigo-500/10'
                    }`}
                  >
                    <div className='flex min-w-0 items-center gap-2'>
                      <IconComponent size={16} className='flex-shrink-0' />
                      <span className='truncate'>{option.label}</span>
                    </div>
                    {value === option.value && (
                      <div
                        className={`h-2 w-2 rounded-full bg-gradient-to-r ${option.color} flex-shrink-0`}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

MissionStatusFilter.displayName = 'MissionStatusFilter'

export default MissionStatusFilter
