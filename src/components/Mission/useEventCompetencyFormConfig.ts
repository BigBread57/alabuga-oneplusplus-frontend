import type { FormField } from '@/components/_base/AwesomeFormGenerator/AwesomeFormGenerator'
import type { EventCompetencyProps } from '@/models/EventCompetency'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

// Типизируем ключи полей на основе модели
type EventCompetencyFormFields = keyof Omit<
  EventCompetencyProps,
  'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'uuid'
>

// Хук для получения конфигурации полей формы
export const useEventCompetencyFormConfig = (eventCompetencyId?: number) => {
  const t = useTranslations('EventCompetencyForm')
  const tValidation = useTranslations('FormValidation')

  const formFields = useMemo(
    (): FormField[] => [
      {
        key: 'event',
        title: t('fields.event.label'),
        type: 'select',
        is_required: true,
        placeholder: t('fields.event.placeholder'),
        options: {
          url: '/api/events',
          qKey: 'events',
          valueKey: 'id',
          labelKey: 'name',
          multiple: false,
        },
      },
      {
        key: 'competency',
        title: t('fields.competency.label'),
        type: 'select',
        is_required: true,
        placeholder: t('fields.competency.placeholder'),
        options: {
          url: '/api/competencies',
          qKey: 'competencies',
          valueKey: 'id',
          labelKey: 'name',
          multiple: false,
        },
      },
      {
        key: 'experience',
        title: t('fields.experience.label'),
        type: 'number',
        is_required: true,
        placeholder: t('fields.experience.placeholder'),
        validation: {
          min: 1,
          message: tValidation('min_value', { min: 1 }),
        },
      },
    ],
    [t, tValidation, eventCompetencyId],
  )

  return {
    formFields,
    getFieldConfig: (fieldKey: EventCompetencyFormFields) =>
      formFields.find((field) => field.key === fieldKey),
    getFieldsByType: (type: FormField['type']) =>
      formFields.filter((field) => field.type === type),
  }
}

// Экспортируем типы для использования в других местах
export type { EventCompetencyFormFields }
