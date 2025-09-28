'use client'

import type { FCC } from 'src/types'
import React from 'react'
import EntityCreationModal from '@/components/Graph/GraphEntityCreationModal/GraphEntityCreationModal'
import { GraphToolbarPanel } from '@/components/Graph/GraphToolbarPanel'
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
  const {
    containerRef,
    isReady,
    centerContent,
    fitContent,
    zoomIn,
    zoomOut,
    clearGraph,
    requestAddArtefact,
    requestAddCompetency,
    requestAddMissionBranch,
    requestAddMission,
    requestAddEvent,
    requestAddRang,
    modalVisible,
    currentEntityType,
    hideEntityModal,
    addEntity,
    toggleConnectingMode,
    isConnectingMode,
  } = useGraph({
    data,
    gridVisible,
    gridSize,
    enablePanning,
    enableMousewheel,
  })

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Модальное окно для создания сущностей */}

      <EntityCreationModal
        visible={modalVisible}
        entityType={currentEntityType}
        onConfirm={addEntity}
        onCancel={hideEntityModal}
      />
      {/* Единая панель инструментов */}
      {isReady && (
        <GraphToolbarPanel
          onAddRang={requestAddRang}
          onAddMissionBranch={requestAddMissionBranch}
          onAddMission={requestAddMission}
          onAddArtefact={requestAddArtefact}
          onAddCompetency={requestAddCompetency}
          onAddEvent={requestAddEvent}
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
