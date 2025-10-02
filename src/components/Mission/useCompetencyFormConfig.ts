import type { FormField } from '@/components/_base/AwesomeFormGenerator/AwesomeFormGenerator'
import type { CompetencyProps } from '@/models/Competency'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

// Типизируем ключи полей на основе модели
type CompetencyFormFields = keyof Omit<
  CompetencyProps,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
  | 'uuid'
  | 'game_world_stories'
>

// Хук для получения конфигурации полей формы
export const useCompetencyFormConfig = (competencyId?: number) => {
  const t = useTranslations('CompetencyForm')
  const tValidation = useTranslations('FormValidation')

  const formFields = useMemo(
    (): FormField[] => [
      {
        key: 'name',
        title: t('fields.name.label'),
        type: 'input',
        is_required: true,
        placeholder: t('fields.name.placeholder'),
        validation: {
          min: 3,
          max: 256,
          message: tValidation('min_max_length', { min: 3, max: 256 }),
        },
      },
      {
        key: 'description',
        title: t('fields.description.label'),
        type: 'textarea',
        is_required: false,
        placeholder: t('fields.description.placeholder'),
        validation: {
          min: 10,
          max: 2000,
          message: tValidation('min_max_length', { min: 10, max: 2000 }),
        },
      },
      {
        key: 'required_experience',
        title: t('fields.required_experience.label'),
        type: 'number',
        is_required: true,
        placeholder: t('fields.required_experience.placeholder'),
        validation: {
          min: 0,
          message: tValidation('min_value', { min: 0 }),
        },
      },
      {
        key: 'level',
        title: t('fields.level.label'),
        type: 'number',
        is_required: true,
        placeholder: t('fields.level.placeholder'),
        validation: {
          min: 1,
          message: tValidation('min_value', { min: 1 }),
        },
      },
      {
        key: 'color',
        title: t('fields.color.label'),
        type: 'color',
        is_required: false,
        placeholder: t('fields.color.placeholder'),
      },
      {
        key: 'icon',
        title: t('fields.icon.label'),
        type: 'file',
        is_required: false,
        placeholder: t('fields.icon.placeholder'),
        fileProps: {
          maxCount: 1,
          accept: '.jpg,.jpeg,.png,.svg,.ico',
          maxSize: 5,
          content_type_id: 2,
          object_id: competencyId,
        },
      },
    ],
    [t, tValidation, competencyId],
  )

  return {
    formFields,
    getFieldConfig: (fieldKey: CompetencyFormFields) =>
      formFields.find((field) => field.key === fieldKey),
    getFieldsByType: (type: FormField['type']) =>
      formFields.filter((field) => field.type === type),
  }
}

// Экспортируем типы для использования в других местах
export type { CompetencyFormFields }
