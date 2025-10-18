import type { ApiResponse } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Loader, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useRef, useState } from 'react'
import { useExtraActionsGet } from '@/services/base/hooks'

type OptionData = {
  value: string | number
  label: string
  [key: string]: any
}

type SelectProps = {
  url: string
  qKey: string
  multiple?: boolean
  valueKey?: string
  labelKey?: string
  placeholder?: string
  onChange?: (
    value: string | number | (string | number)[],
    options?: OptionData | OptionData[],
  ) => void
  allowClear?: boolean
  style?: React.CSSProperties
  className?: string
  disabled?: boolean
}

const Select: React.FC<SelectProps> = ({
  url,
  qKey,
  multiple = false,
  valueKey = 'id',
  labelKey = 'name',
  placeholder,
  onChange,
  allowClear = false,
  style,
  className,
  disabled = false,
}) => {
  const t = useTranslations('Select')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, isError } = useExtraActionsGet<ApiResponse>({
    qKey,
    extraUrl: url,
  })

  // Форматируем данные в опции
  const options: OptionData[] = React.useMemo(() => {
    if (!data || isError) {
      return []
    }
    const items = data?.data?.results

    if (!Array.isArray(items)) {
      console.warn('Select component: items is not an array', items)
      return []
    }

    return items.map((item: any) => ({
      value: item[valueKey],
      label: item[labelKey],
      ...item,
    }))
  }, [data, isError, valueKey, labelKey])

  // Фильтруем опции по поисковому запросу
  const filteredOptions = React.useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [options, searchTerm])

  // Получаем выбранные объекты
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value),
  )

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current
        && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (value: string | number) => {
    let newValues: (string | number)[]

    if (multiple) {
      newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value]
    } else {
      newValues = [value]
      setIsOpen(false)
    }

    setSelectedValues(newValues)

    const selectedOpts = options.filter((option) =>
      newValues.includes(option.value),
    )

    onChange?.(
      multiple ? newValues : value,
      multiple ? selectedOpts : selectedOpts[0],
    )
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedValues([])
    setSearchTerm('')
    onChange?.(multiple ? [] : '', multiple ? [] : undefined)
  }

  const displayValue = multiple
    ? `${selectedValues.length} ${t('selected') || 'selected'}`
    : selectedOptions[0]?.label || placeholder || t('placeholder')

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

  return (
    <div
      ref={dropdownRef}
      className={`relative w-full ${className || ''}`}
      style={style}
      data-testid='test-Select'
    >
      {/* Trigger кнопка */}
      <motion.button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        disabled={disabled}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border-2 px-4 py-2 text-sm transition-all duration-300 ${
          disabled
            ? 'cursor-not-allowed border-gray-600 bg-gray-800/20 text-gray-500'
            : isOpen
              ? 'border-cyan-400/60 bg-slate-800/80'
              : 'border-indigo-500/20 bg-slate-800/30 hover:border-indigo-500/40'
        }`}
      >
        <span
          className={`truncate ${
            selectedValues.length === 0 ? 'text-gray-400' : 'text-cyan-300'
          }`}
        >
          {displayValue}
        </span>

        <div className='flex flex-shrink-0 items-center gap-1'>
          {allowClear && selectedValues.length > 0 && !disabled && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClear}
              className='text-gray-400 transition-colors hover:text-cyan-400'
            >
              <X size={16} />
            </motion.button>
          )}

          {isLoading
            ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader size={16} className='text-indigo-400' />
                </motion.div>
              )
            : (
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  } text-indigo-400`}
                />
              )}
        </div>
      </motion.button>

      {/* Dropdown меню */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            variants={menuVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg border border-indigo-500/20 bg-slate-900/90 shadow-2xl backdrop-blur-xl'
          >
            {/* Поиск */}
            <div className='border-b border-indigo-500/10 p-2'>
              <input
                type='text'
                placeholder={t('search') || 'Search...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full rounded-md border border-indigo-500/20 bg-slate-800/50 px-3 py-2 text-sm text-indigo-300 placeholder-gray-500 transition-colors outline-none focus:border-cyan-400/60 focus:bg-slate-800'
              />
            </div>

            {/* Список опций */}
            <div className='max-h-64 overflow-y-auto py-2'>
              {isError
                ? (
                    <div className='px-4 py-3 text-center text-sm text-red-400'>
                      {t('error')}
                    </div>
                  )
                : filteredOptions.length === 0
                  ? (
                      <div className='px-4 py-3 text-center text-sm text-gray-400'>
                        {t('no_data')}
                      </div>
                    )
                  : (
                      filteredOptions.map((option, index) => (
                        <motion.button
                          key={option.value}
                          onClick={() => handleSelect(option.value)}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className={`group flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-all duration-200 ${
                            selectedValues.includes(option.value)
                              ? 'bg-indigo-500/30 text-cyan-300'
                              : 'text-gray-300 hover:bg-indigo-500/10'
                          }`}
                        >
                          <span className='truncate'>{option.label}</span>

                          {selectedValues.includes(option.value) && (
                            <motion.div
                              layoutId={`selected-${option.value}`}
                              className='h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400'
                            />
                          )}
                        </motion.button>
                      ))
                    )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

Select.displayName = 'Select'

export default Select
