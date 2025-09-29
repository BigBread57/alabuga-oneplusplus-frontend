import type { FormInstance } from 'antd'
import { Button, Checkbox, Col, Form, Input, Row } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import { FileUpload } from '@/components/_base/FileUpload'
import { Select } from '@/components/_base/Select'

type FieldType
  = | 'input'
    | 'textarea'
    | 'checkbox'
    | 'select'
    | 'password'
    | 'email'
    | 'number'
    | 'file'

export type FormField = {
  key: string
  title: string
  type: FieldType
  is_required: boolean
  placeholder?: string
  options?: {
    url?: string
    qKey?: string
    valueKey?: string
    labelKey?: string
    multiple?: boolean
  }
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  fileProps?: {
    maxCount?: number
    accept?: string
    maxSize?: number
    content_type_id?: number
    object_id?: number
  }
}

type AwesomeFormGeneratorProps = {
  fields: FormField[]
  onSubmit?: (values: Record<string, any>) => void
  onValuesChange?: (
    changedValues: Record<string, any>,
    allValues: Record<string, any>,
  ) => void
  initialValues?: Record<string, any>
  loading?: boolean
  submitText?: string
  form?: FormInstance
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelCol?: { span: number }
  wrapperCol?: { span: number }
  fileValues?: Record<string, any[]> // Для хранения загруженных файлов
}

const AwesomeFormGenerator: React.FC<AwesomeFormGeneratorProps> = ({
  fields,
  onSubmit,
  onValuesChange,
  initialValues,
  loading = false,
  submitText,
  form,
  layout = 'vertical',
  labelCol,
  wrapperCol,
  fileValues,
}) => {
  const t = useTranslations('Form')
  const [formInstance] = Form.useForm(form)

  // Устанавливаем значения при изменении initialValues
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      formInstance.setFieldsValue(initialValues)
    }
  }, [initialValues, formInstance])

  // Сбрасываем форму при изменении полей или если initialValues стали пустыми
  useEffect(() => {
    if (!initialValues || Object.keys(initialValues).length === 0) {
      formInstance.resetFields()
    }
  }, [fields, initialValues, formInstance])

  const handleFinish = (values: Record<string, any>) => {
    onSubmit?.(values)
  }

  const getValidationRules = (field: FormField) => {
    const rules: any[] = []

    // Обязательное поле
    if (field.is_required) {
      rules.push({
        required: true,
        message:
          field.validation?.message || t('required', { field: field.title }),
      })
    }

    // Валидация по типу
    switch (field.type) {
      case 'email':
        rules.push({
          type: 'email',
          message: t('invalid_email'),
        })
        break
      case 'number':
        rules.push({
          type: 'number',
          message: t('invalid_number'),
        })
        break
    }

    // Кастомная валидация
    if (field.validation) {
      if (field.validation.min !== undefined) {
        rules.push({
          min: field.validation.min,
          message:
            field.validation.message
            || t('min_length', { min: field.validation.min }),
        })
      }

      if (field.validation.max !== undefined) {
        rules.push({
          max: field.validation.max,
          message:
            field.validation.message
            || t('max_length', { max: field.validation.max }),
        })
      }

      if (field.validation.pattern) {
        rules.push({
          pattern: new RegExp(field.validation.pattern),
          message: field.validation.message || t('invalid_format'),
        })
      }
    }

    return rules
  }

  const renderField = (field: FormField) => {
    const commonProps = {
      placeholder: field.placeholder || field.title,
      disabled: loading,
    }
    const fieldFiles = fileValues?.[field.key] || []

    switch (field.type) {
      case 'input':
        return <Input {...commonProps} />

      case 'textarea':
        return <Input.TextArea {...commonProps} rows={4} />

      case 'password':
        return <Input.Password {...commonProps} />

      case 'email':
        return <Input {...commonProps} type='email' />

      case 'number':
        return <Input {...commonProps} type='number' />

      case 'checkbox':
        return (
          <Checkbox disabled={loading}>
            {field.placeholder || field.title}
          </Checkbox>
        )

      case 'select':
        if (!field.options?.url || !field.options?.qKey) {
          console.warn(
            `Select field "${field.key}" requires options.url and options.qKey`,
          )
          return <Input {...commonProps} disabled />
        }

        return (
          <Select
            url={field.options.url}
            qKey={field.options.qKey}
            multiple={field.options.multiple || false}
            valueKey={field.options.valueKey || 'id'}
            labelKey={field.options.labelKey || 'name'}
            placeholder={field.placeholder}
            disabled={loading}
          />
        )

      case 'file':
        return (
          <FileUpload
            fileList={fieldFiles}
            onChange={() => {
              // При изменении файлов обновляем значения формы
              const currentValues = formInstance.getFieldsValue()
              const updatedValues = {
                ...currentValues,
                [field.key]: fieldFiles,
              }

              // Вызываем callback для обновления состояния родительского компонента
              onValuesChange?.({ [field.key]: fieldFiles }, updatedValues)
            }}
            maxCount={field.fileProps?.maxCount || 10}
            accept={
              field.fileProps?.accept || '.jpg,.jpeg,.png,.pdf,.doc,.docx,.txt'
            }
            maxSize={field.fileProps?.maxSize || 10}
            content_type_id={field.fileProps?.content_type_id}
            object_id={field.fileProps?.object_id}
          />
        )

      default:
        return <Input {...commonProps} />
    }
  }

  return (
    <Form
      form={formInstance}
      layout={layout}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      initialValues={initialValues}
      onFinish={handleFinish}
      onValuesChange={onValuesChange}
      disabled={loading}
    >
      <Row gutter={[16, 0]}>
        {fields.map((field) => (
          <Col xs={24} key={field.key}>
            <Form.Item
              name={field.key}
              label={field.title}
              rules={getValidationRules(field)}
              valuePropName={field.type === 'checkbox' ? 'checked' : 'value'}
            >
              {renderField(field)}
            </Form.Item>
          </Col>
        ))}
      </Row>

      {onSubmit && (
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            size='large'
          >
            {submitText || t('submit')}
          </Button>
        </Form.Item>
      )}
    </Form>
  )
}

AwesomeFormGenerator.displayName = 'AwesomeFormGenerator'

export default AwesomeFormGenerator
