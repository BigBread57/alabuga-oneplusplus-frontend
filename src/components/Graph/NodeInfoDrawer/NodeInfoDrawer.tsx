import type { FC } from 'react'
import type { ENTITY_TYPES } from '@/hooks/useGraph'
import { Drawer } from 'antd'
import { useTranslations } from 'next-intl'
import { AwesomeFormGenerator } from '@/components/_base/AwesomeFormGenerator'
import { useArtifactFormConfig } from '@/components/Mission/useArtifactFormConfig'
import { useCompetencyFormConfig } from '@/components/Mission/useCompetencyFormConfig'
import { useEventCompetencyFormConfig } from '@/components/Mission/useEventCompetencyFormConfig'
import { useEventFormConfig } from '@/components/Mission/useEventFormConfig'
import { useGameWorldStoryFormConfig } from '@/components/Mission/useGameWorldStoryFormConfig'
import { useMissionBranchFormConfig } from '@/components/Mission/useMissionBranchFormConfig'
import { useMissionCompetencyFormConfig } from '@/components/Mission/useMissionCompetencyFormConfig'
import { useMissionFormConfig } from '@/components/Mission/useMissionFormConfig'
import { useRankFormConfig } from '@/components/Mission/useRankFormConfig'

export interface NodeInfoDrawerProps {
  nodeData: Record<string, any>
  visible: boolean
  nodeId: string | null
  onClose: () => void
  entityType: ENTITY_TYPES | null
  onFinish?: (values: Record<string, any>) => void
}

// Тип для заголовков сущностей
type EntityTitles = {
  [key in ENTITY_TYPES]?: string
}

const NodeInfoDrawer: FC<NodeInfoDrawerProps> = ({
  visible,
  onClose,
  entityType,
  nodeData,
  onFinish,
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

  // Получение соответствующих полей формы для типа сущности
  const getFormFields = () => {
    switch (entityType) {
      case 'mission':
        return missionFormFields
      case 'event':
        return eventFormFields
      case 'competency':
        return competencyFormFields
      case 'event_competency':
        return eventCompetencyFormFields
      case 'mission_competency':
        return missionCompetencyFormFields
      case 'mission_branch':
        return missionBranchFormFields
      case 'game_world_story':
        return GameWorldStoryFormFields
      case 'artifact':
        return artifactFormFields
      case 'rank':
        return rankFormFields
      default:
        return []
    }
  }

  // Получение заголовка для Drawer в зависимости от типа сущности
  const getDrawerTitle = () => {
    const baseTitle = t('information')

    if (!entityType) {
      return baseTitle
    }

    const entityTitles: EntityTitles = {
      mission: 'Миссия',
      event: 'Событие',
      event_competency: 'Компетенция события',
      mission_competency: 'Компетенция миссии',
      mission_branch: 'Ветка миссии',
      artifact: 'Артефакт',
      rank: 'Ранг',
      game_world_story: 'Истории игрового мира',
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
      onClose={onClose}
      destroyOnHidden
      styles={{
        body: {
          padding: '24px',
        },
      }}
    >
      <AwesomeFormGenerator
        initialValues={nodeData}
        layout='vertical'
        fields={formFields}
        onFinish={onFinish}
      />
    </Drawer>
  )
}

export default NodeInfoDrawer
