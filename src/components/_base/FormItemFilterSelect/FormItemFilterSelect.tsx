import type { SizeType } from 'antd/es/config-provider/SizeContext'
import type { FCC } from '@/types'
import { Form, Select, Skeleton } from 'antd'
import { isArray } from 'lodash'
import React from 'react'

type FormItemFilterSelectProps = {
  name: string
  label: string
  value?: string
  options: string[] | Record<string, string>
  size?: SizeType
  placeholder?: string
  isLoading?: boolean
  mode?: 'multiple' | 'tags'
}

const FormItemFilterSelect: FCC<FormItemFilterSelectProps> = ({
  isLoading,
  value,
  options,
  mode,
  name,
  label,
  size = 'large',
  placeholder,
}) => {
  if (isLoading) {
    return <Skeleton.Input active size={size === 'middle' ? 'default' : size} />
  }
  return (
    <Form.Item name={name} label={label}>
      {options
        ? (
            <Select
              value={value}
              mode={mode}
              size={size}
              placeholder={placeholder}
              allowClear
            >
              {options && isArray(options)
                ? (options as string[])?.map((option: string) => (
                    <Select.Option key={option} value={option}>
                      {option || 'н/д'}
                    </Select.Option>
                  ))
                : Object.entries(options).map(([k, v]) => (
                    <Select.Option key={k} value={k}>
                      {v || 'н/д'}
                    </Select.Option>
                  ))}
            </Select>
          )
        : (
            'н/д'
          )}
    </Form.Item>
  )
}

FormItemFilterSelect.displayName = 'FormItemFilterSelect'

export default FormItemFilterSelect
