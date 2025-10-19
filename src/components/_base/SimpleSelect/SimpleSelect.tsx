import type { ApiResponse } from '@/types'
import { get } from 'lodash'
import { Loader } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useCallback, useState } from 'react'
import { useExtraActionsGet } from '@/services/base/hooks'

type OptionData = {
  value: string | number
  label: string
  [key: string]: any
}

type SimpleSelectProps = {
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
  value?: string | number | (string | number)[]
  style?: React.CSSProperties
  className?: string
  disabled?: boolean
}

const SimpleSelect: React.FC<SimpleSelectProps> = ({
  url,
  qKey,
  multiple = false,
  valueKey = 'id',
  labelKey = 'name',
  placeholder,
  onChange,
  value: controlledValue,
  style,
  className,
  disabled = false,
}) => {
  const t = useTranslations('Select')
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>([])

  const { data, isLoading, isError } = useExtraActionsGet<ApiResponse>({
    qKey,
    extraUrl: url,
  })

  const options: OptionData[] = React.useMemo(() => {
    if (!data || isError) {
      return []
    }
    const items = data?.data?.results

    if (!Array.isArray(items)) {
      console.warn('Select component: items is not an array', items)
      return []
    }

    return items?.map((item: any) => ({
      value: get(item, valueKey, ''),
      label: get(item, labelKey, ''),
      ...item,
    }))
  }, [data, isError, valueKey, labelKey])

  const currentValue = controlledValue ?? selectedValues

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSelected = Array.from(e.target.selectedOptions, (opt) => {
        const val = opt.value
        // eslint-disable-next-line unicorn/prefer-number-properties
        return isNaN(Number(val)) ? val : Number(val)
      })

      if (!multiple) {
        const value = newSelected[0] ?? ''
        setSelectedValues([value])

        const selectedOpt = options.find((option) => option.value === value)
        onChange?.(value, selectedOpt)
      } else {
        setSelectedValues(newSelected)

        const selectedOpts = options.filter((option) =>
          newSelected.includes(option.value),
        )
        onChange?.(newSelected, selectedOpts)
      }
    },
    [multiple, options, onChange],
  )

  const baseSelectClasses = `w-full rounded-lg border-2 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-gray-500 transition-all focus:outline-none ${
    disabled
      ? 'cursor-not-allowed border-gray-600 bg-gray-800/20 text-gray-500 opacity-50'
      : 'border-indigo-500/20 focus:border-cyan-400/60 hover:border-indigo-500/40'
  }`

  const selectValue = Array.isArray(currentValue)
    ? currentValue.map(String)
    : String(currentValue ?? '')

  return (
    <div
      className={`relative w-full ${className || ''}`}
      style={style}
      data-testid='test-SimpleSelect'
    >
      {isLoading && (
        <div className='pointer-events-none absolute top-2.5 right-3 z-10'>
          <Loader size={16} className='animate-spin text-indigo-400' />
        </div>
      )}

      <select
        multiple={multiple}
        value={selectValue}
        onChange={handleChange}
        disabled={disabled || isLoading}
        className={baseSelectClasses}
      >
        {!multiple && (
          <option value=''>{placeholder || t('placeholder')}</option>
        )}

        {isError && <option disabled>{t('error')}</option>}

        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

SimpleSelect.displayName = 'SimpleSelect'

export default SimpleSelect
