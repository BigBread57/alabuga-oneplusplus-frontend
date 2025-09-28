'use client'

import type { FCC } from 'src/types'
import type { EntityData } from '@/components/Graph/GraphEntityCreationModal/GraphEntityCreationModal'
import type { ENTITY_TYPES } from '@/hooks/useGraph'
import React, { useState } from 'react'
import EntityCreationModal from '@/components/Graph/GraphEntityCreationModal/GraphEntityCreationModal'
import { GraphToolbarPanel } from '@/components/Graph/GraphToolbarPanel'
import { NodeInfoDrawer } from '@/components/Graph/NodeInfoDrawer'
import { useGraph } from '@/hooks/useGraph'

interface GraphCanvasProps {
  data?: any
  gridVisible?: boolean
  gridSize?: number
  enablePanning?: boolean
  enableMousewheel?: boolean
}

const GraphCanvas: FCC<GraphCanvasProps> = ({
  data,
  gridVisible = true,
  gridSize = 10,
  enablePanning = true,
  enableMousewheel = true,
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const [isShowModal, setIsShowModal] = useState(false)
  const [currentEntityType, setCurrentEntityType]
    = useState<ENTITY_TYPES | null>(null)
  const handleShowModal = (entityType: ENTITY_TYPES) => {
    setIsShowModal(true)
    setCurrentEntityType(entityType)
  }
  const handleHideModal = () => {
    setIsShowModal(false)
    setCurrentEntityType(null)
  }

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId)
    setDrawerVisible(true)
  }

  const handleCloseDrawer = () => {
    setDrawerVisible(false)
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
    data,
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
  )
}

GraphCanvas.displayName = 'GraphCanvas'

export default GraphCanvas
