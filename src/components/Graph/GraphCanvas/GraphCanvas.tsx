'use client'

import type { FCC } from 'src/types'
import React from 'react'
import { GraphToolbarPanel } from '@/components/Graph/GraphToolbarPanel'
import { useGraph } from '@/hooks/useGraph'

interface GraphCanvasProps {
  prop?: any
  data?: any
  gridVisible?: boolean
  gridSize?: number
  enablePanning?: boolean
  enableMousewheel?: boolean
}

const GraphCanvas: FCC<GraphCanvasProps> = ({
  data: externalData,
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
    addRectangle,
    addCircle,
    addEllipse,
    addTriangle,
    addDiamond,
    addStar,
  } = useGraph({
    data: externalData,
    gridVisible,
    gridSize,
    enablePanning,
    enableMousewheel,
  })

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Единая панель инструментов */}
      {isReady && (
        <GraphToolbarPanel
          // Функции для добавления фигур из хука
          onAddRectangle={addRectangle}
          onAddCircle={addCircle}
          onAddEllipse={addEllipse}
          onAddTriangle={addTriangle}
          onAddDiamond={addDiamond}
          onAddStar={addStar}
          onClearGraph={clearGraph}
          // Функции управления графом из хука
          onCenterContent={centerContent}
          onFitContent={fitContent}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
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
