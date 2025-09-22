import type { FormItemProps } from 'antd/es/form/FormItem'
import type { FormError } from '@/hooks/useFormErrors'
import { Form } from 'antd'
import React from 'react'

export type PropsFormItem = {
  errors?: FormError
} & FormItemProps
export const FormItem: React.FC<PropsFormItem> = (props) => {
  return (
    <Form.Item {...props} {...props.errors}>
      {props.children}
    </Form.Item>
  )
}

FormItem.displayName = 'FormItem'

export default FormItem
