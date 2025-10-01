import type { FormField } from '@/components/_base/AwesomeFormGenerator/AwesomeFormGenerator'
import type { EventProps } from '@/models/Event'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

// Типизируем ключи полей на основе модели
type EventFormFields = keyof Omit<
  EventProps,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
  | 'uuid'
  | 'qr_code'
  | 'game_world_stories'
>

// Хук для получения конфигурации полей формы
export const useEventFormConfig = (eventId?: number) => {
  const t = useTranslations('EventForm')
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
        is_required: true,
        placeholder: t('fields.description.placeholder'),
        validation: {
          min: 10,
          max: 2000,
          message: tValidation('min_max_length', { min: 10, max: 2000 }),
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
        key: 'color',
        title: t('fields.color.label'),
        type: 'input',
        is_required: false,
        placeholder: t('fields.color.placeholder'),
      },
      {
        key: 'required_number',
        title: t('fields.required_number.label'),
        type: 'number',
        is_required: true,
        placeholder: t('fields.required_number.placeholder'),
        validation: {
          min: 1,
          message: tValidation('min_value', { min: 1 }),
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
        is_required: true,
        placeholder: t('fields.time_to_complete.placeholder'),
        validation: {
          min: 1,
          message: tValidation('min_value', { min: 1 }),
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
        key: 'artifacts',
        title: t('fields.artifacts.label'),
        type: 'select',
        is_required: false,
        options: {
          url: '/api/artifacts',
          qKey: 'event-artifacts',
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
          qKey: 'event-competencies',
          valueKey: 'id',
          labelKey: 'name',
          multiple: true,
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
          accept: '.jpg,.jpeg,.png,.svg,.ico',
          maxSize: 5, // 5MB для иконок
          content_type_id: 2, // ID типа контента для событий (нужно уточнить)
          object_id: eventId, // ID события для связи с файлом
        },
      },
    ],
    [t, tValidation, eventId],
  )

  return {
    formFields,
    getFieldConfig: (fieldKey: EventFormFields) =>
      formFields.find((field) => field.key === fieldKey),
    getFieldsByType: (type: FormField['type']) =>
      formFields.filter((field) => field.type === type),
  }
}

// Экспортируем типы для использования в других местах
export type { EventFormFields }
