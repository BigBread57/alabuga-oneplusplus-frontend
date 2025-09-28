import type { SelectProps as AntSelectProps } from 'antd'
import type { ApiResponse } from '@/types'
import { Select as AntSelect } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { useExtraActionsGet } from '@/services/base/hooks'
import styles from './Select.module.scss'

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
  onChange?: (
    value: string | number | (string | number)[],
    options?: OptionData | OptionData[],
  ) => void
} & Omit<AntSelectProps, 'onChange' | 'options' | 'loading'>

const Select: React.FC<SelectProps> = ({
  url,
  qKey,
  multiple = false,
  valueKey = 'id',
  labelKey = 'name',
  onChange,
  ...restProps
}) => {
  const t = useTranslations('Select')

  const { data, isLoading, isError } = useExtraActionsGet<ApiResponse>({
    qKey,
    extraUrl: url,
  })

  // Форматируем данные в опции для Select
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

  const handleChange = (
    value: string | number | (string | number)[],
    option: any,
  ) => {
    onChange?.(value, option)
  }

  return (
    <AntSelect
      {...restProps}
      className={styles.container}
      mode={multiple ? 'multiple' : undefined}
      placeholder={restProps.placeholder || t('placeholder')}
      loading={isLoading}
      onChange={handleChange}
      options={options}
      notFoundContent={isError ? t('error') : t('no_data')}
      data-testid='test-Select'
    />
  )
}

Select.displayName = 'Select'

export default Select
