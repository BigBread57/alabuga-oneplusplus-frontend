import type { FCC } from 'src/types'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Calendar,
  Gift,
  GitBranch,
  Link2,
  Maximize2,
  Plus,
  Rocket,
  Save,
  Star,
  Target,
  Trash2,
  Trophy,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

import { TooltipButton } from '@/components/_base/TooltipButton'
import { ENTITY_COLORS } from '@/components/Graph/theme'
import { ENTITY_TYPES } from '@/hooks/useGraph'

interface EntityToolbarPanelProps {
  onClearGraph?: () => void
  onDeleteSelected?: () => void
  onSave?: () => void
  isDeleteMode?: boolean
  onAddEntity: (entityType: ENTITY_TYPES) => void
  onCenterContent?: () => void
  onFitContent?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onToggleConnectingMode: () => void
  isConnectingMode: boolean
}

const EntityToolbarPanel: FCC<EntityToolbarPanelProps> = ({
  onClearGraph,
  onDeleteSelected,
  onSave,
  onCenterContent,
  onFitContent,
  onZoomIn,
  onZoomOut,
  onToggleConnectingMode,
  isConnectingMode = false,
  onAddEntity,
  isDeleteMode,
}) => {
  const t = useTranslations('Graph')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const entityMenuItems = [
    {
      key: 'rank',
      label: t('entities.rank', { fallback: 'Rank' }),
      icon: Star,
      color: ENTITY_COLORS.rank,
      onClick: () => {
        onAddEntity(ENTITY_TYPES.RANK)
        setIsDropdownOpen(false)
      },
    },
    {
      key: 'mission_branch',
      label: t('entities.mission_branch', { fallback: 'Mission Branch' }),
      icon: GitBranch,
      color: ENTITY_COLORS.missionBranch,
      onClick: () => {
        onAddEntity(ENTITY_TYPES.MISSION_BRANCH)
        setIsDropdownOpen(false)
      },
    },
    {
      key: 'mission',
      label: t('entities.mission', { fallback: 'Mission' }),
      icon: Rocket,
      color: ENTITY_COLORS.mission,
      onClick: () => {
        onAddEntity(ENTITY_TYPES.MISSION)
        setIsDropdownOpen(false)
      },
    },
    {
      key: 'artifact',
      label: t('entities.artifact', { fallback: 'Artifact' }),
      icon: Gift,
      color: ENTITY_COLORS.artifact,
      onClick: () => {
        onAddEntity(ENTITY_TYPES.ARTIFACT)
        setIsDropdownOpen(false)
      },
    },
    {
      key: 'competency',
      label: t('entities.competency', { fallback: 'Competency' }),
      icon: Trophy,
      color: ENTITY_COLORS.competency,
      onClick: () => {
        onAddEntity(ENTITY_TYPES.COMPETENCY)
        setIsDropdownOpen(false)
      },
    },
    {
      key: 'event',
      label: t('entities.event', { fallback: 'Event' }),
      icon: Calendar,
      color: ENTITY_COLORS.event,
      onClick: () => {
        onAddEntity(ENTITY_TYPES.EVENT)
        setIsDropdownOpen(false)
      },
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='absolute top-4 left-4 z-50'
    >
      <div className='rounded-xl border border-indigo-500/20 bg-slate-900/80 p-2 shadow-lg backdrop-blur-lg'>
        <div className='flex flex-wrap gap-2'>
          {/* Добавление сущностей */}
          <div className='flex gap-2'>
            <div className='relative'>
              <TooltipButton
                tooltip={t('add_entity', { fallback: 'Add Entity' })}
                icon={<Plus size={18} />}
                variant='primary'
                size='small'
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />

              {/* Dropdown меню */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className='absolute top-full left-0 z-50 mt-2 flex w-56 flex-col gap-1 rounded-lg border border-indigo-500/20 bg-slate-900/90 p-2 backdrop-blur-xl'
                  >
                    {entityMenuItems.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <motion.button
                          key={item.key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={item.onClick}
                          className='flex items-center gap-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-sm text-indigo-300 transition-all duration-200 hover:border-indigo-500/50 hover:bg-indigo-500/15'
                        >
                          <Icon size={16} style={{ color: item.color }} />
                          {item.label}
                        </motion.button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Быстрые кнопки */}
            <TooltipButton
              tooltip={t('entities.rank', { fallback: 'Add Rank' })}
              icon={<Star size={18} style={{ color: ENTITY_COLORS.rank }} />}
              size='small'
              onClick={() => onAddEntity(ENTITY_TYPES.RANK)}
            />

            <TooltipButton
              tooltip={t('entities.mission', { fallback: 'Add Mission' })}
              icon={
                <Rocket size={18} style={{ color: ENTITY_COLORS.mission }} />
              }
              size='small'
              onClick={() => onAddEntity(ENTITY_TYPES.MISSION)}
            />

            <TooltipButton
              tooltip={t('entities.artifact', { fallback: 'Add Artifact' })}
              icon={
                <Gift size={18} style={{ color: ENTITY_COLORS.artifact }} />
              }
              size='small'
              onClick={() => onAddEntity(ENTITY_TYPES.ARTIFACT)}
            />
          </div>

          {/* Разделитель */}
          <div className='h-8 w-px bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent' />

          {/* Соединение узлов */}
          <TooltipButton
            tooltip={
              isConnectingMode
                ? t('exit_connect_mode', { fallback: 'Exit Connect Mode' })
                : t('connect_nodes', { fallback: 'Connect Nodes' })
            }
            icon={<Link2 size={18} />}
            size='small'
            variant={isConnectingMode ? 'primary' : 'default'}
            onClick={onToggleConnectingMode}
          />

          {/* Разделитель */}
          <div className='h-8 w-px bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent' />

          {/* Управление видом */}
          <div className='flex gap-2'>
            <TooltipButton
              tooltip={t('center', { fallback: 'Center' })}
              icon={<Target size={18} />}
              size='small'
              onClick={onCenterContent || (() => {})}
            />

            <TooltipButton
              tooltip={t('fit', { fallback: 'Fit' })}
              icon={<Maximize2 size={18} />}
              size='small'
              onClick={onFitContent || (() => {})}
            />

            <TooltipButton
              tooltip={t('zoom_in', { fallback: 'Zoom In' })}
              icon={<ZoomIn size={18} />}
              size='small'
              onClick={onZoomIn || (() => {})}
            />

            <TooltipButton
              tooltip={t('zoom_out', { fallback: 'Zoom Out' })}
              icon={<ZoomOut size={18} />}
              size='small'
              onClick={onZoomOut || (() => {})}
            />
          </div>

          {/* Разделитель */}
          <div className='h-8 w-px bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent' />

          {/* Действия */}
          <div className='flex gap-2'>
            <TooltipButton
              tooltip={t('save', { fallback: 'Save' })}
              icon={<Save size={18} />}
              size='small'
              variant='primary'
              onClick={onSave || (() => {})}
            />

            <TooltipButton
              tooltip={t('delete_selected', { fallback: 'Delete Selected' })}
              icon={<Trash2 size={18} />}
              size='small'
              variant={isDeleteMode ? 'danger' : 'default'}
              onClick={onDeleteSelected || (() => {})}
            />

            <TooltipButton
              tooltip={t('clear_all', { fallback: 'Clear All' })}
              icon={<X size={18} />}
              size='small'
              variant='danger'
              onClick={onClearGraph || (() => {})}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

EntityToolbarPanel.displayName = 'EntityToolbarPanel'

export default EntityToolbarPanel
