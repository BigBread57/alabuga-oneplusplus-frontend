'use client'

import type { FCC } from 'src/types'
import type { EntityData } from '@/components/Graph/GraphEntityCreationModal/GraphEntityCreationModal'
import type { ENTITY_TYPES } from '@/hooks/useGraph'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useContext, useState } from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import EntityCreationModal from '@/components/Graph/GraphEntityCreationModal/GraphEntityCreationModal'
import { GraphToolbarPanel } from '@/components/Graph/GraphToolbarPanel'
import { NodeInfoDrawer } from '@/components/Graph/NodeInfoDrawer'
import { useGraph } from '@/hooks/useGraph'
import { GameWorld } from '@/models/GameWorld'
import { useExtraActionsGet } from '@/services/base/hooks'

interface GraphCanvasProps {
  data?: any
  gridVisible?: boolean
  gridSize?: number
  enablePanning?: boolean
  enableMousewheel?: boolean
}
const MODEL = GameWorld
const GraphCanvas: FCC<GraphCanvasProps> = ({
  gridVisible = true,
  gridSize = 10,
  enablePanning = true,
  enableMousewheel = true,
}) => {
  const t = useTranslations('Graph')
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [isShowModal, setIsShowModal] = useState(false)
  const [currentEntityType, setCurrentEntityType]
    = useState<ENTITY_TYPES | null>(null)
  const { currentUser } = useContext(CurrentUserContext)

  const { data: response }: any = useExtraActionsGet({
    qKey: 'graph-all-info',
    extraUrl: MODEL.allInfoUrl(currentUser?.active_game_world as number),
    enabled: !!currentUser?.active_game_world,
  })

  const handleShowModal = (entityType: ENTITY_TYPES) => {
    setIsShowModal(true)
    setCurrentEntityType(entityType)
  }
  const handleHideModal = () => {
    setIsShowModal(false)
    setCurrentEntityType(null)
  }

  const handleNodeClick = (nodeId: string, entityType: ENTITY_TYPES) => {
    setSelectedNodeId(nodeId)
    setCurrentEntityType(entityType)
    setDrawerVisible(true)
  }

  const handleCloseDrawer = () => {
    setDrawerVisible(false)
    setCurrentEntityType(null)
    setSelectedNodeId(null)
  }

  const {
    containerRef,
    isReady,
    centerContent,
    fitContent,
    zoomIn,
    zoomOut,
    clearGraph,
    addEntity,
    toggleConnectingMode,
    isConnectingMode,
  } = useGraph({
    data: response?.data,
    gridVisible,
    gridSize,
    enablePanning,
    enableMousewheel,
    onNodeClick: handleNodeClick,
  })

  const handleAddEntity = (
    entityType: ENTITY_TYPES,
    entityData: EntityData,
  ) => {
    addEntity(entityType, entityData)
    handleHideModal()
  }
  return (
    <CardWrapper
      title=''
      extra={
        <Button type='primary' icon={<PlusOutlined />} size='middle'>
          {t('create_new_lor')}
        </Button>
      }
      styles={{
        body: {
          height: 'calc(80vh)',
          padding: 8,
        },
      }}
    >
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {/* Модальное окно для создания сущностей */}
        <EntityCreationModal
          visible={isShowModal}
          entityType={currentEntityType}
          onConfirm={handleAddEntity}
          onCancel={handleHideModal}
        />
        {/* Drawer для информации о ноде */}
        <NodeInfoDrawer
          visible={drawerVisible}
          nodeId={selectedNodeId}
          entityType={currentEntityType}
          onClose={handleCloseDrawer}
        />
        {/* Единая панель инструментов */}
        {isReady && (
          <GraphToolbarPanel
            onAddEntity={handleShowModal}
            onClearGraph={clearGraph}
            onCenterContent={centerContent}
            onFitContent={fitContent}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onToggleConnectingMode={toggleConnectingMode}
            isConnectingMode={isConnectingMode}
          />
        )}

        <div
          ref={containerRef}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '400px',
          }}
        />
      </div>
    </CardWrapper>
  )
}

GraphCanvas.displayName = 'GraphCanvas'

export default GraphCanvas
