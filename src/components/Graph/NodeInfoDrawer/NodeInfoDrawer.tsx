import type { FC } from 'react'
import type { ENTITY_TYPES } from '@/hooks/useGraph'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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

export interface NodeInfoModalProps {
  nodeData: Record<string, any>
  visible: boolean
  nodeId: string | null
  onClose: () => void
  entityType: ENTITY_TYPES | null
  onFinish?: (values: Record<string, any>) => void
}

type EntityTitles = {
  [key in ENTITY_TYPES]?: string
}

const NodeInfoModal: FC<NodeInfoModalProps> = ({
  visible,
  onClose,
  entityType,
  nodeData,
  onFinish,
}) => {
  const [isMounted, setIsMounted] = useState(false)

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

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [visible])

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

  const getDrawerTitle = () => {
    const baseTitle = 'Информация'

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
  const modalTitle = getDrawerTitle()

  const modalVariants = {
    hidden: { opacity: 0, y: '100%' },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: '100%',
      transition: { duration: 0.2 },
    },
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const modalRoot
    = typeof document !== 'undefined'
      ? document.getElementById('modal-root')
      : null

  const modalContent = (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            variants={backdropVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            onClick={onClose}
            className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm'
          />

          <motion.div
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='fixed inset-0 z-50 flex items-end justify-center md:items-center'
            onClick={onClose}
          >
            <div
              className='h-[100dvh] w-full overflow-hidden rounded-t-3xl border-0 border-indigo-500/20 bg-slate-900/95 shadow-2xl backdrop-blur-xl md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-2xl md:border'
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation()
                }
              }}
              role='dialog'
              tabIndex={-1}
            >
              {/* Header */}
              <div className='sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-indigo-500/20 bg-slate-900/95 p-4 backdrop-blur-xl md:p-6'>
                <h2 className='flex-1 truncate text-lg font-bold text-white md:text-xl'>
                  {modalTitle}
                </h2>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className='flex-shrink-0 p-1.5 text-gray-400 transition-colors hover:text-cyan-400'
                  aria-label='Close modal'
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Content */}
              <div className='flex max-h-[calc(100dvh-60px)] flex-col overflow-hidden md:max-h-[calc(90vh-80px)]'>
                <div className='flex-1 overflow-y-auto'>
                  <div className='p-4 md:p-6'>
                    <AwesomeFormGenerator
                      initialValues={nodeData}
                      fields={formFields}
                      onFinish={onFinish}
                    />

                    {/* Padding для мобильных */}
                    <div className='h-4 md:h-0' />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return isMounted && modalRoot ? createPortal(modalContent, modalRoot) : null
}

export default NodeInfoModal
