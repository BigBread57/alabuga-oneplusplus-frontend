'use client'

import type { FCC } from 'src/types'
import type { EntityData } from '@/components/Graph/GraphEntityCreationModal/GraphEntityCreationModal'
import type { ENTITY_TYPES } from '@/hooks/useGraph'
import { AnimatePresence, motion } from 'framer-motion'
import { Network, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { RocketLoader } from '@/components/_base/RocketLoader'
import { GRAPH_STORAGE_KEY } from '@/components/Graph/GraphCanvasWrapper/GraphCanvasWrapper'
import EntityCreationModal from '@/components/Graph/GraphEntityCreationModal/GraphEntityCreationModal'
import { GraphToolbarPanel } from '@/components/Graph/GraphToolbarPanel'
import { NodeInfoDrawer } from '@/components/Graph/NodeInfoDrawer'
import { useGraph } from '@/hooks/useGraph'

interface GraphCanvasProps {
  isLoading: boolean
  data: any
  gridVisible?: boolean
  gridSize?: number
  enablePanning?: boolean
  isLoadingGenerate?: boolean
  enableMousewheel?: boolean
  onChange?: (data: Record<string, any>) => void
  onNewLoreClick?: () => void
  onSave?: () => void
}

const EMPTY_GRAPH = { cells: [] }

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const GraphCanvas: FCC<GraphCanvasProps> = ({
  data,
  gridVisible = true,
  gridSize = 10,
  enablePanning = true,
  enableMousewheel = true,
  onChange,
  onNewLoreClick,
  isLoadingGenerate,
  onSave,
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
    <motion.div
      initial='hidden'
      animate='visible'
      style={{
        height: '80vh',
      }}
      variants={sectionVariants}
      className='flex flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs'
    >
      {/* Заголовок */}
      <div className='flex items-center justify-between gap-2 border-b border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-transparent px-6 py-3 md:px-8'>
        <div className='flex items-center gap-2'>
          <div className='rounded-lg bg-indigo-500/20 p-1.5'>
            <Network size={18} className='text-indigo-400' />
          </div>
          <div className='flex items-center gap-2'>
            <h2 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-sm font-bold text-transparent md:text-base'>
              {t('lor')}
            </h2>
          </div>
        </div>
        {/* Кнопка создания */}
        {!isReady && (
          <motion.button
            onClick={onNewLoreClick}
            disabled={isLoadingGenerate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='flex items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/20 px-4 py-1 text-sm font-medium text-indigo-300 transition-all hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isLoadingGenerate
              ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <Plus size={16} />
                    </motion.div>
                    <span>{t('generating')}</span>
                  </>
                )
              : (
                  <>
                    <Plus size={16} />
                    <span>{t('create_new_lor')}</span>
                  </>
                )}
          </motion.button>
        )}
      </div>

      {/* Контент */}
      <div className='relative flex min-h-[400px] flex-1 flex-col overflow-hidden p-2 md:p-4'>
        {/* Лоадер при загрузке */}
        <AnimatePresence>
          {isLoadingGenerate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='pointer-events-none absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-slate-900/40 backdrop-blur-sm'
            >
              <RocketLoader />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Контейнер для графика */}
        <div
          className={`relative flex h-full w-full flex-col gap-4 ${
            isLoadingGenerate ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          {/* Модальное окно создания сущности */}
          <EntityCreationModal
            visible={isShowModal}
            entityType={currentEntityType}
            onConfirm={handleAddEntity}
            onCancel={handleHideModal}
          />

          {/* Drawer информации о ноде */}
          <NodeInfoDrawer
            nodeData={selectedNodeData as Record<string, any>}
            visible={drawerVisible}
            nodeId={selectedNodeId}
            entityType={currentEntityType}
            onClose={handleCloseDrawer}
            onFinish={handleFinish}
          />

          {/* Тулбар */}
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
              onSave={onSave}
            />
          )}

          {/* Контейнер для canvas */}
          <div
            ref={containerRef}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '400px',
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}

GraphCanvas.displayName = 'GraphCanvas'

export default GraphCanvas
