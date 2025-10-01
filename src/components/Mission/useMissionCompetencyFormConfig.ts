import type { FormField } from '@/components/_base/AwesomeFormGenerator/AwesomeFormGenerator'
import type { MissionCompetencyProps } from '@/models/MissionCompetency'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

// Типизируем ключи полей на основе модели
type MissionCompetencyFormFields = keyof Omit<
  MissionCompetencyProps,
  'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'uuid'
>

// Хук для получения конфигурации полей формы компетенции миссии
export const useMissionCompetencyFormConfig = (
  missionCompetencyId?: number,
) => {
  const t = useTranslations('MissionCompetencyForm')
  const tValidation = useTranslations('FormValidation')

  const formFields = useMemo(
    (): FormField[] => [
      {
        key: 'mission',
        title: t('fields.mission.label'),
        type: 'select',
        is_required: true,
        placeholder: t('fields.mission.placeholder'),
        options: {
          url: '/api/missions',
          qKey: 'missions',
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
    [t, tValidation, missionCompetencyId],
  )

  return {
    formFields,
    getFieldConfig: (fieldKey: MissionCompetencyFormFields) =>
      formFields.find((field) => field.key === fieldKey),
    getFieldsByType: (type: FormField['type']) =>
      formFields.filter((field) => field.type === type),
  }
}

// Экспортируем типы для использования в других местах
export type { MissionCompetencyFormFields }
