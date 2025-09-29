import type { FC } from 'react'
import type { ENTITY_TYPES } from '@/hooks/useGraph'
import type { ApiResponse } from '@/types'
import { Drawer } from 'antd'
import { useTranslations } from 'next-intl'
import { useMissionFormConfig } from '@/components/Mission/useMissionFormConfig'
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

const NodeInfoDrawer: FC<NodeInfoDrawerProps> = ({
  visible,
  nodeId,
  onClose,
  entityType,
}) => {
  const t = useTranslations('Common')

  const { data, isLoading } = useFetchOneItem<ApiResponse>({
    model: MISSION_MODEL,
    id: nodeId || undefined,
    qKey: 'missionNodeInfo',
    enabled: visible && entityType === 'mission' && !!nodeId,
  })
  const { formFields: mission } = useMissionFormConfig()
  const getFields = () => {
    switch (entityType) {
      case 'mission':
        return mission
      default:
        return []
    }
  }
  const loading = isLoading
  return (
    <Drawer
      title={t('information')}
      placement='right'
      width={600}
      open={visible}
      loading={loading}
      onClose={onClose}
      destroyOnHidden
    >
      <AwesomeFormGenerator
        loading={isLoading}
        initialValues={data?.data}
        layout='vertical'
        fields={getFields()}
      />
    </Drawer>
  )
}

export default NodeInfoDrawer
