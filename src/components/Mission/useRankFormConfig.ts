import type { FormField } from '@/components/_base/AwesomeFormGenerator/AwesomeFormGenerator'
import type { RankProps } from '@/models/Rank'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

// Типизируем ключи полей на основе модели
type RankFormFields = keyof Omit<
  RankProps,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
  | 'uuid'
  | 'game_world_stories'
>

// Хук для получения конфигурации полей формы
export const useRankFormConfig = (rankId?: number) => {
  const t = useTranslations('RankForm')
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
          min: 1,
          max: 256,
          message: tValidation('min_max_length', { min: 1, max: 256 }),
        },
      },
      {
        key: 'description',
        title: t('fields.description.label'),
        type: 'textarea',
        is_required: false,
        placeholder: t('fields.description.placeholder'),
        validation: {
          min: 0,
          max: 1000,
          message: tValidation('min_max_length', { min: 0, max: 1000 }),
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
          maxSize: 5, // 5MB для иконок
          content_type_id: 2, // ID типа контента для рангов (нужно получить из API или константы)
          object_id: rankId, // ID ранга для связи с файлом
        },
      },
    ],
    [t, tValidation, rankId],
  )

  return {
    formFields,
    getFieldConfig: (fieldKey: RankFormFields) =>
      formFields.find((field) => field.key === fieldKey),
    getFieldsByType: (type: FormField['type']) =>
      formFields.filter((field) => field.type === type),
  }
}

// Экспортируем типы для использования в других местах
export type { RankFormFields }
