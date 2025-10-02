import type { FormField } from '@/components/_base/AwesomeFormGenerator/AwesomeFormGenerator'
import type { ArtifactProps } from '@/models/Artifact'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

// Типизируем ключи полей на основе модели
type ArtifactFormFields = keyof Omit<
  ArtifactProps,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
  | 'game_world_stories'
  | 'uuid'
>

// Хук для получения конфигурации полей формы артефакта
export const useArtifactFormConfig = (artifactId?: number) => {
  const t = useTranslations('ArtifactForm')
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
          max: 2000,
          message: tValidation('min_max_length', { min: 0, max: 2000 }),
        },
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
          object_id: artifactId,
        },
      },
      {
        key: 'color',
        title: t('fields.color.label'),
        type: 'color',
        is_required: false,
        placeholder: t('fields.color.placeholder'),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [artifactId],
  )

  return {
    formFields,
    getFieldConfig: (fieldKey: ArtifactFormFields) =>
      formFields.find((field) => field.key === fieldKey),
    getFieldsByType: (type: FormField['type']) =>
      formFields.filter((field) => field.type === type),
  }
}

// Экспортируем типы для использования в других местах
export type { ArtifactFormFields }
