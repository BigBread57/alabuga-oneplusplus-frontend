import type { FC } from 'react'
import type { ENTITY_TYPES } from '@/hooks/useGraph'
import type { ApiResponse } from '@/types'
import { Drawer } from 'antd'
import { useTranslations } from 'next-intl'
import { useArtifactFormConfig } from '@/components/Mission/useArtifactFormConfig'
import { useCompetencyFormConfig } from '@/components/Mission/useCompetencyFormConfig'
import { useEventCompetencyFormConfig } from '@/components/Mission/useEventCompetencyFormConfig'
import { useEventFormConfig } from '@/components/Mission/useEventFormConfig'
import { useGameWorldStoryFormConfig } from '@/components/Mission/useGameWorldStoryFormConfig'
import { useMissionBranchFormConfig } from '@/components/Mission/useMissionBranchFormConfig'
import { useMissionCompetencyFormConfig } from '@/components/Mission/useMissionCompetencyFormConfig'
import { useMissionFormConfig } from '@/components/Mission/useMissionFormConfig'
import { useRankFormConfig } from '@/components/Mission/useRankFormConfig'
import { Mission } from '@/models/Mission'
import { useFetchOneItem } from '@/services/base/hooks'
import AwesomeFormGenerator from '../../_base/AwesomeFormGenerator/AwesomeFormGenerator'

export interface NodeInfoDrawerProps {
  visible: boolean
  nodeId: string | null
  onClose: () => void
  entityType: ENTITY_TYPES | null
}

const MISSION_MODEL = Mission

// Тип для заголовков сущностей
type EntityTitles = {
  [key in ENTITY_TYPES]?: string
}

const NodeInfoDrawer: FC<NodeInfoDrawerProps> = ({
  visible,
  nodeId,
  onClose,
  entityType,
}) => {
  const t = useTranslations('Common')

  // Конфигурации форм для разных типов сущностей
  const { formFields: missionFormFields } = useMissionFormConfig()
  const { formFields: rankFormFields } = useRankFormConfig()
  const { formFields: competencyFormFields } = useCompetencyFormConfig()
  const { formFields: eventFormFields } = useEventFormConfig()
  const { formFields: artifactFormFields } = useArtifactFormConfig()
  const { formFields: GameWorldStoryFormFields } = useGameWorldStoryFormConfig()
  const { formFields: eventCompetencyFormFields }
    = useEventCompetencyFormConfig()
  const { formFields: missionCompetencyFormFields }
    = useMissionCompetencyFormConfig()
  const { formFields: missionBranchFormFields } = useMissionBranchFormConfig()

  // Получение данных в зависимости от типа сущности
  const { data, isLoading } = useFetchOneItem<ApiResponse>({
    model: MISSION_MODEL,
    id: nodeId || undefined,
    qKey: `${entityType}NodeInfo`,
    enabled: visible && !!entityType && !!nodeId,
  })

  // Получение соответствующих полей формы для типа сущности
  const getFormFields = () => {
    switch (entityType) {
      case 'mission-node':
        return missionFormFields
      case 'event-node':
        return eventFormFields
      case 'competency-node':
        return competencyFormFields
      case 'event-competency-node':
        return eventCompetencyFormFields
      case 'mission-competency-node':
        return missionCompetencyFormFields
      case 'mission-branch-node':
        return missionBranchFormFields
      case 'game-world-story-node':
        return GameWorldStoryFormFields
      case 'artefact-node':
        return artifactFormFields
      case 'rank-node':
        return rankFormFields
      default:
        return []
    }
  }
  const loading = isLoading

  // Получение заголовка для Drawer в зависимости от типа сущности
  const getDrawerTitle = () => {
    const baseTitle = t('information')

    if (!entityType) {
      return baseTitle
    }

    const entityTitles: EntityTitles = {
      'mission-node': 'Миссия',
      'event-node': 'Событие',
      'event-competency-node': 'Компетенция события',
      'mission-competency-node': 'Компетенция миссии',
      'mission-branch-node': 'Ветка миссии',
      'artefact-node': 'Артефакт',
      'rank-node': 'Ранг',
      'game-world-story-node': 'Истории игрового мира',
    }

    const entityTitle = entityTitles[entityType]

    return entityTitle ? `${entityTitle} - ${baseTitle}` : baseTitle
  }

  const formFields = getFormFields()
  const drawerTitle = getDrawerTitle()

  return (
    <Drawer
      title={drawerTitle}
      placement='right'
      width={600}
      open={visible}
      loading={loading}
      onClose={onClose}
      destroyOnHidden
      styles={{
        body: {
          padding: '24px',
        },
      }}
    >
      <AwesomeFormGenerator
        loading={isLoading}
        initialValues={data?.data}
        layout='vertical'
        fields={formFields}
      />
    </Drawer>
  )
}

export default NodeInfoDrawer
