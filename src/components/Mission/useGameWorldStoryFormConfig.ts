import type { FormField } from '@/components/_base/AwesomeFormGenerator/AwesomeFormGenerator'
import type { GameWorldStoryProps } from '@/models/GameWorldStory'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

// Типизируем ключи полей на основе модели
type useGameWorldStoryForm = keyof Omit<
  GameWorldStoryProps,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
  | 'uuid'
  | 'content_type'
  | 'object_id'
  | 'content_object'
>

// Хук для получения конфигурации полей формы
export const useGameWorldStoryFormConfig = (gameWorldStoryId?: number) => {
  const t = useTranslations('GameWorldStoryForm')
  const tValidation = useTranslations('FormValidation')

  const formFields = useMemo(
    (): FormField[] => [
      {
        key: 'text',
        title: t('fields.text.label'),
        type: 'textarea',
        is_required: true,
        placeholder: t('fields.text.placeholder'),
        validation: {
          min: 10,
          max: 5000,
          message: tValidation('min_max_length', { min: 10, max: 5000 }),
        },
      },
      {
        key: 'image',
        title: t('fields.image.label'),
        type: 'file',
        is_required: false,
        placeholder: t('fields.image.placeholder'),
        fileProps: {
          maxCount: 1,
          accept: '.jpg,.jpeg,.png,.webp',
          maxSize: 10,
          content_type_id: 3,
          object_id: gameWorldStoryId,
        },
      },
    ],
    [gameWorldStoryId],
  )

  return {
    formFields,
    getFieldConfig: (fieldKey: useGameWorldStoryForm) =>
      formFields.find((field) => field.key === fieldKey),
    getFieldsByType: (type: FormField['type']) =>
      formFields.filter((field) => field.type === type),
  }
}

// Экспортируем типы для использования в других местах
export type { useGameWorldStoryForm }
