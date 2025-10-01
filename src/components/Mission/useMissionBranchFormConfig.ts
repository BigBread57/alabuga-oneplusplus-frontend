import type { FormField } from '@/components/_base/AwesomeFormGenerator/AwesomeFormGenerator'
import type { MissionBranchProps } from '@/models/MissionBranch' // Предполагаемая типизация
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

// Типизируем ключи полей на основе модели
type MissionBranchFormFields = keyof Omit<
  MissionBranchProps,
  'id' | 'uuid' | 'created_at' | 'updated_at' | 'deleted_at'
>

// Хук для получения конфигурации полей формы ветки миссий
export const useMissionBranchFormConfig = (missionBranchId?: number) => {
  const t = useTranslations('MissionBranchForm')
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
        key: 'color',
        title: t('fields.color.label'),
        type: 'input',
        is_required: false,
        placeholder: t('fields.color.placeholder'),
        validation: {
          min: 0,
          max: 256,
          message: tValidation('min_max_length', { min: 0, max: 256 }),
        },
      },
      {
        key: 'is_active',
        title: t('fields.is_active.label'),
        type: 'checkbox',
        is_required: false,
        placeholder: t('fields.is_active.placeholder'),
      },
      {
        key: 'start_datetime',
        title: t('fields.start_datetime.label'),
        type: 'datetime',
        is_required: false,
        placeholder: t('fields.start_datetime.placeholder'),
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
        key: 'rank',
        title: t('fields.rank.label'),
        type: 'select',
        is_required: true,
        options: {
          url: '/api/ranks',
          qKey: 'ranks',
          valueKey: 'id',
          labelKey: 'name',
          multiple: false,
        },
      },
      {
        key: 'category',
        title: t('fields.category.label'),
        type: 'select',
        is_required: true,
        options: {
          url: '/api/activity-categories',
          qKey: 'activity-categories',
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
          url: '/api/characters',
          qKey: 'characters',
          valueKey: 'id',
          labelKey: 'name',
          multiple: false,
        },
      },
      {
        key: 'game_world',
        title: t('fields.game_world.label'),
        type: 'select',
        is_required: true,
        options: {
          url: '/api/game-worlds',
          qKey: 'game-worlds',
          valueKey: 'id',
          labelKey: 'name',
          multiple: false,
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
          accept: '.jpg,.jpeg,.png,.svg,.ico,.webp',
          maxSize: 10, // 10MB для иконок веток миссий
          content_type_id: 2, // ID типа контента для веток миссий
          object_id: missionBranchId, // ID ветки миссии для связи с файлом
        },
      },
    ],
    [t, tValidation, missionBranchId],
  )

  return {
    formFields,
    getFieldConfig: (fieldKey: MissionBranchFormFields) =>
      formFields.find((field) => field.key === fieldKey),
    getFieldsByType: (type: FormField['type']) =>
      formFields.filter((field) => field.type === type),
  }
}

// Экспортируем типы для использования в других местах
export type { MissionBranchFormFields }
