import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import { FileUpload } from '@/components/_base/FileUpload'
import SimpleSelect from '../SimpleSelect/SimpleSelect'

type FieldType
  = | 'input'
    | 'textarea'
    | 'checkbox'
    | 'select'
    | 'password'
    | 'email'
    | 'number'
    | 'file'
    | 'datetime'
    | 'color'

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
  onFinish?: (values: Record<string, any>) => void
  onValuesChange?: (
    changedValues: Record<string, any>,
    allValues: Record<string, any>,
  ) => void
  initialValues?: Record<string, any>
  loading?: boolean
  submitText?: string
  layout?: 'horizontal' | 'vertical' | 'inline'
  fileValues?: Record<string, any[]>
}

const AwesomeFormGenerator: React.FC<AwesomeFormGeneratorProps> = ({
  fields,
  onFinish,
  onValuesChange,
  initialValues,
  loading = false,
  submitText,
  fileValues,
}) => {
  const t = useTranslations('Form')
  const [formValues, setFormValues] = useState<Record<string, any>>(
    initialValues || {},
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues)
    }
  }, [initialValues])

  const getValidationRules = (field: FormField) => {
    const rules: Array<{
      required?: boolean
      type?: string
      min?: number
      max?: number
      pattern?: RegExp
      message: string
    }> = []

    if (field.is_required) {
      rules.push({
        required: true,
        message:
          field.validation?.message || t('required', { field: field.title }),
      })
    }

    switch (field.type) {
      case 'email':
        rules.push({
          type: 'email',
          message: t('invalid_email'),
        })
        break
    }

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

  const validateField = (field: FormField, value: any): string | null => {
    const rules = getValidationRules(field)

    for (const rule of rules) {
      if (rule.required && !value) {
        return rule.message
      }

      if (rule.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return rule.message
        }
      }

      if (rule.min !== undefined && value && value.length < rule.min) {
        return rule.message
      }

      if (rule.max !== undefined && value && value.length > rule.max) {
        return rule.message
      }

      if (rule.pattern && value && !rule.pattern.test(value)) {
        return rule.message
      }
    }

    return null
  }

  const handleFieldChange = (key: string, value: any) => {
    const field = fields.find((f) => f.key === key)
    if (!field) {
      return
    }

    const error = validateField(field, value)

    setFormValues((prev) => {
      const updated = { ...prev, [key]: value }
      onValuesChange?.({ [key]: value }, updated)
      return updated
    })

    if (error) {
      setErrors((prev) => ({ ...prev, [key]: error }))
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    fields.forEach((field) => {
      const error = validateField(field, formValues[field.key])
      if (error) {
        newErrors[field.key] = error
      }
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onFinish?.(formValues)
    }
  }

  const renderField = (field: FormField) => {
    const value = formValues[field.key] ?? ''
    const error = errors[field.key]
    const fieldFiles = fileValues?.[field.key] || []

    const baseInputClasses = `w-full rounded-lg border-2 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-gray-500 transition-all focus:outline-none ${
      error
        ? 'border-red-500/50 focus:border-red-500'
        : 'border-indigo-500/20 focus:border-cyan-400/60'
    } disabled:cursor-not-allowed disabled:opacity-50`

    switch (field.type) {
      case 'input':
        return (
          <input
            type='text'
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder || field.title}
            disabled={loading}
            className={baseInputClasses}
          />
        )

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder || field.title}
            disabled={loading}
            rows={4}
            className={`${baseInputClasses} resize-none`}
          />
        )

      case 'password':
        return (
          <input
            type='password'
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder || field.title}
            disabled={loading}
            className={baseInputClasses}
          />
        )

      case 'email':
        return (
          <input
            type='email'
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder || field.title}
            disabled={loading}
            className={baseInputClasses}
          />
        )

      case 'number':
        return (
          <input
            type='number'
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder || field.title}
            disabled={loading}
            className={baseInputClasses}
          />
        )

      case 'checkbox':
        return (
          <label className='flex cursor-pointer items-center gap-3'>
            <input
              type='checkbox'
              checked={value || false}
              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
              disabled={loading}
              className='h-4 w-4 cursor-pointer rounded border-indigo-500/30 bg-slate-800 accent-cyan-400'
            />
            <span className='text-sm text-gray-300'>
              {field.placeholder || field.title}
            </span>
          </label>
        )

      case 'color':
        return (
          <div className='flex items-center gap-3'>
            <input
              type='color'
              value={value || '#000000'}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              disabled={loading}
              className='h-10 w-20 cursor-pointer rounded-lg border-2 border-indigo-500/20'
            />
            <input
              type='text'
              value={value || ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder='#000000'
              disabled={loading}
              className={`${baseInputClasses} flex-1`}
            />
          </div>
        )

      case 'select':
        if (!field.options?.url || !field.options?.qKey) {
          console.warn(
            `Select field "${field.key}" requires options.url and options.qKey`,
          )
          return <input type='text' disabled className={baseInputClasses} />
        }

        return (
          <div style={{ position: 'relative', zIndex: 50 }}>
            <SimpleSelect
              url={field.options.url}
              qKey={field.options.qKey}
              multiple={field.options.multiple || false}
              valueKey={field.options.valueKey || 'id'}
              labelKey={field.options.labelKey || 'name'}
              placeholder={field.placeholder}
              value={value}
              onChange={(selectedValue) => {
                handleFieldChange(field.key, selectedValue)
              }}
              disabled={loading}
              style={{ width: '100%' }}
            />
          </div>
        )

      case 'file':
        return (
          <FileUpload
            fileList={fieldFiles}
            onChange={() => {
              const updatedValues = { ...formValues, [field.key]: fieldFiles }
              onValuesChange?.({ [field.key]: fieldFiles }, updatedValues)
            }}
            maxCount={field.fileProps?.maxCount || 10}
            accept={
              field.fileProps?.accept || '.jpg,.jpeg,.png,.pdf,.doc,.docx,.txt'
            }
            maxSize={field.fileProps?.maxSize || 10}
            content_type_id={field.fileProps?.content_type_id}
            object_id={field.fileProps?.object_id}
            disabled={loading}
          />
        )

      default:
        return (
          <input
            type='text'
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder || field.title}
            disabled={loading}
            className={baseInputClasses}
          />
        )
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className='space-y-4'
    >
      {fields?.map((field, index) => (
        <motion.div
          key={field.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className='space-y-2'
        >
          <label className='flex items-center gap-1 text-sm font-medium text-gray-300'>
            {field.title}
            {field.is_required && <span className='text-red-400'>*</span>}
          </label>

          {renderField(field)}

          {errors[field.key] && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-xs text-red-400'
            >
              {errors[field.key]}
            </motion.p>
          )}
        </motion.div>
      ))}

      {onFinish && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type='submit'
          disabled={loading}
          className='w-full rounded-lg bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 md:py-3'
        >
          {loading
            ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className='inline-block'
                >
                  ⟳
                </motion.span>
              )
            : (
                submitText || t('save')
              )}
        </motion.button>
      )}
    </form>
  )
}

AwesomeFormGenerator.displayName = 'AwesomeFormGenerator'

export default AwesomeFormGenerator
