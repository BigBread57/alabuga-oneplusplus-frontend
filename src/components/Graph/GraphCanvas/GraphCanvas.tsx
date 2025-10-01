'use client'

import type { FCC } from 'src/types'
import type { EntityData } from '@/components/Graph/GraphEntityCreationModal/GraphEntityCreationModal'
import type { ENTITY_TYPES } from '@/hooks/useGraph'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { GRAPH_STORAGE_KEY } from '@/components/Graph/GraphCanvasWrapper/GraphCanvasWrapper'
import EntityCreationModal from '@/components/Graph/GraphEntityCreationModal/GraphEntityCreationModal'
import { GraphToolbarPanel } from '@/components/Graph/GraphToolbarPanel'
import { NodeInfoDrawer } from '@/components/Graph/NodeInfoDrawer'
import { useGraph } from '@/hooks/useGraph'

interface GraphCanvasProps {
  data: any // Теперь обязательный prop
  gridVisible?: boolean
  gridSize?: number
  enablePanning?: boolean
  isLoadingGenerate?: boolean
  enableMousewheel?: boolean
  onChange?: (data: Record<string, any>) => void
  onNewLoreClick?: () => void
}

const EMPTY_GRAPH = { cells: [] }

const GraphCanvas: FCC<GraphCanvasProps> = ({
  data,
  gridVisible = true,
  gridSize = 10,
  enablePanning = true,
  enableMousewheel = true,
  onChange,
  onNewLoreClick,
  isLoadingGenerate,
}) => {
  const t = useTranslations('Graph')
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedNodeData, setSelectedNodeData] = useState<Record<
    string,
    any
  > | null>(null)
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

  const handleNodeClick = (
    nodeId: string,
    entityType: ENTITY_TYPES,
    nodeData: Record<string, null>,
  ) => {
    setSelectedNodeId(nodeId)
    setCurrentEntityType(entityType)
    setSelectedNodeData(nodeData)
    setDrawerVisible(true)
  }

  const handleCloseDrawer = () => {
    setDrawerVisible(false)
    setCurrentEntityType(null)
    setSelectedNodeId(null)
    setSelectedNodeData(null)
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
    updateEntity,
    toggleConnectingMode,
    isConnectingMode,
    toggleDeleteMode,
    isDeleteMode,
  } = useGraph({
    data,
    gridVisible,
    gridSize,
    enablePanning,
    enableMousewheel,
    onNodeClick: handleNodeClick,
    onGraphChange: onChange,
  })

  const handleAddEntity = (
    entityType: ENTITY_TYPES,
    entityData: EntityData,
  ) => {
    addEntity(entityType, entityData)
    handleHideModal()
  }

  const handleFinish = (values: Record<string, any>) => {
    if (selectedNodeId && currentEntityType) {
      updateEntity(selectedNodeId, values)
      handleCloseDrawer()
    }
  }

  const handleClearAll = () => {
    clearGraph()
    localStorage.setItem(GRAPH_STORAGE_KEY, JSON.stringify(EMPTY_GRAPH))
  }

  return (
    <CardWrapper
      title=''
      extra={
        <Button
          loading={isLoadingGenerate}
          type='primary'
          icon={<PlusOutlined />}
          size='middle'
          onClick={onNewLoreClick}
        >
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
        <EntityCreationModal
          visible={isShowModal}
          entityType={currentEntityType}
          onConfirm={handleAddEntity}
          onCancel={handleHideModal}
        />

        <NodeInfoDrawer
          nodeData={selectedNodeData as Record<string, any>}
          visible={drawerVisible}
          nodeId={selectedNodeId}
          entityType={currentEntityType}
          onClose={handleCloseDrawer}
          onFinish={handleFinish}
        />

        {isReady && (
          <GraphToolbarPanel
            onAddEntity={handleShowModal}
            onClearGraph={handleClearAll}
            onCenterContent={centerContent}
            onFitContent={fitContent}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onToggleConnectingMode={toggleConnectingMode}
            isConnectingMode={isConnectingMode}
            isDeleteMode={isDeleteMode}
            onDeleteSelected={toggleDeleteMode}
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
