import type { FormField } from '@/components/_base/AwesomeFormGenerator/AwesomeFormGenerator'
import type { MissionProps } from '@/models/Mission'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

// Типизируем ключи полей на основе модели
type MissionFormFields = keyof Omit<
  MissionProps,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>

// Хук для получения конфигурации полей формы
export const useMissionFormConfig = (missionId?: number) => {
  const t = useTranslations('MissionForm')
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
          max: 100,
          message: tValidation('min_max_length', { min: 3, max: 100 }),
        },
      },
      {
        key: 'description',
        title: t('fields.description.label'),
        type: 'textarea',
        is_required: true,
        placeholder: t('fields.description.placeholder'),
        validation: {
          min: 10,
          max: 1000,
          message: tValidation('min_max_length', { min: 10, max: 1000 }),
        },
      },
      {
        key: 'experience',
        title: t('fields.experience.label'),
        type: 'number',
        is_required: true,
        placeholder: t('fields.experience.placeholder'),
        validation: {
          min: 0,
          message: tValidation('min_value', { min: 0 }),
        },
      },
      {
        key: 'currency',
        title: t('fields.currency.label'),
        type: 'number',
        is_required: true,
        placeholder: t('fields.currency.placeholder'),
        validation: {
          min: 0,
          message: tValidation('min_value', { min: 0 }),
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
          content_type_id: 1,
          object_id: missionId,
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
        key: 'order',
        title: t('fields.order.label'),
        type: 'number',
        is_required: true,
        placeholder: t('fields.order.placeholder'),
        validation: {
          min: 1,
          message: tValidation('min_value', { min: 1 }),
        },
      },
      {
        key: 'is_key_mission',
        title: t('fields.is_key_mission.label'),
        type: 'checkbox',
        is_required: false,
        placeholder: t('fields.is_key_mission.placeholder'),
      },
      {
        key: 'is_active',
        title: t('fields.is_active.label'),
        type: 'checkbox',
        is_required: false,
        placeholder: t('fields.is_active.placeholder'),
      },
      {
        key: 'time_to_complete',
        title: t('fields.time_to_complete.label'),
        type: 'number',
        is_required: false,
        placeholder: t('fields.time_to_complete.placeholder'),
        validation: {
          min: 1,
          message: tValidation('min_value', { min: 1 }),
        },
      },

      {
        key: 'level',
        title: t('fields.level.label'),
        type: 'select',
        is_required: false,
        options: {
          url: '/game-world/mission-levels/list/',
          qKey: 'mission-levels',
          valueKey: 'id',
          labelKey: 'name',
          multiple: false,
        },
      },
      {
        key: 'category',
        title: t('fields.category.label'),
        type: 'select',
        is_required: false,
        options: {
          url: '/game-world/mission-categories/list/',
          qKey: 'mission-categories',
          valueKey: 'id',
          labelKey: 'name',
          multiple: false,
        },
      },
      {
        key: 'mentor',
        title: t('fields.mentor.label'),
        type: 'select',
        is_required: false,
        options: {
          url: '/user/characters/list/',
          qKey: 'mentors',
          valueKey: 'id',
          labelKey: 'full_name',
          multiple: false,
        },
      },
    ],
    [missionId],
  )

  return {
    formFields,
    getFieldConfig: (fieldKey: MissionFormFields) =>
      formFields.find((field) => field.key === fieldKey),
    getFieldsByType: (type: FormField['type']) =>
      formFields.filter((field) => field.type === type),
  }
}

// Экспортируем типы для использования в других местах
export type { MissionFormFields }
