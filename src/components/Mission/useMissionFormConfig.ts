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
        key: 'branch',
        title: t('fields.branch.label'),
        type: 'select',
        is_required: true,
        options: {
          url: '/api/mission-branches',
          qKey: 'mission-branches',
          valueKey: 'id',
          labelKey: 'name',
          multiple: false,
        },
      },
      {
        key: 'level',
        title: t('fields.level.label'),
        type: 'select',
        is_required: true,
        options: {
          url: '/api/mission-levels',
          qKey: 'mission-levels',
          valueKey: 'id',
          labelKey: 'name',
          multiple: false,
        },
      },
      {
        key: 'game_world',
        title: t('fields.game_world.label'),
        type: 'select',
        is_required: false,
        options: {
          url: '/api/game-worlds',
          qKey: 'game-worlds',
          valueKey: 'id',
          labelKey: 'name',
          multiple: false,
        },
      },
      {
        key: 'game_world_stories',
        title: t('fields.game_world_stories.label'),
        type: 'select',
        is_required: false,
        options: {
          url: '/api/game-world-stories',
          qKey: 'game-world-stories',
          valueKey: 'id',
          labelKey: 'title',
          multiple: true,
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
        key: 'time_to_complete',
        title: t('fields.time_to_complete.label'),
        type: 'number',
        is_required: true,
        placeholder: t('fields.time_to_complete.placeholder'),
        validation: {
          min: 1,
          message: tValidation('min_value', { min: 1 }),
        },
      },
      {
        key: 'required_missions',
        title: t('fields.required_missions.label'),
        type: 'select',
        is_required: false,
        options: {
          url: '/api/missions',
          qKey: 'required-missions',
          valueKey: 'id',
          labelKey: 'name',
          multiple: true,
        },
      },
      {
        key: 'artifacts',
        title: t('fields.artifacts.label'),
        type: 'select',
        is_required: false,
        options: {
          url: '/api/artifacts',
          qKey: 'mission-artifacts',
          valueKey: 'id',
          labelKey: 'name',
          multiple: true,
        },
      },
      {
        key: 'competencies',
        title: t('fields.competencies.label'),
        type: 'select',
        is_required: false,
        options: {
          url: '/api/competencies',
          qKey: 'mission-competencies',
          valueKey: 'id',
          labelKey: 'name',
          multiple: true,
        },
      },
      {
        key: 'icon',
        title: t('fields.icon.label'),
        type: 'file',
        is_required: true,
        placeholder: t('fields.icon.placeholder'),
        fileProps: {
          maxCount: 1,
          accept: '.jpg,.jpeg,.png,.svg,.ico',
          maxSize: 5, // 5MB для иконок
          content_type_id: 1, // ID типа контента для миссий (нужно получить из API или константы)
          object_id: missionId, // ID миссии для связи с файлом
        },
      },
    ],
    [t, tValidation, missionId],
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
