import type { MenuProps } from 'antd'
import type { FCC } from 'src/types'
import {
  AimOutlined,
  BranchesOutlined, // MissionBranch
  CalendarOutlined, // Event
  ClearOutlined,
  DeleteOutlined,
  FullscreenOutlined,
  GiftOutlined, // Artifact
  LinkOutlined, // Connect nodes
  PlusOutlined,
  RocketOutlined, // Mission
  SaveOutlined, // Добавили иконку сохранения
  // Иконки для сущностей
  StarOutlined, // Rank
  TrophyOutlined, // Competency
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'
import { Divider, Dropdown, Space } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'

import { TooltipButton } from '@/components/_base/TooltipButton'
import { ENTITY_COLORS } from '@/components/Graph/theme'
import { ENTITY_TYPES } from '@/hooks/useGraph'
import { useTheme } from '@/providers/ThemeProvider'

interface EntityToolbarPanelProps {
  onClearGraph?: () => void
  onDeleteSelected?: () => void
  onSave?: () => void // Добавили новый проп для сохранения
  isDeleteMode?: boolean
  onAddEntity: (entityType: ENTITY_TYPES) => void

  // Callbacks для управления графом
  onCenterContent?: () => void
  onFitContent?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void

  // Callbacks для режима соединения
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
  const { themeConfig } = useTheme()

  // Меню для выпадающего списка сущностей
  const entityMenuItems: MenuProps['items'] = [
    {
      key: 'rank',
      label: t('entities.rank', { fallback: 'Rank' }),
      icon: <StarOutlined style={{ color: ENTITY_COLORS.rank }} />,
      onClick: () => onAddEntity(ENTITY_TYPES.RANK),
    },
    {
      key: 'mission_ranch',
      label: t('entities.mission_branch', { fallback: 'Mission Branch' }),
      icon: <BranchesOutlined style={{ color: ENTITY_COLORS.missionBranch }} />,
      onClick: () => onAddEntity(ENTITY_TYPES.MISSION_BRANCH),
    },
    {
      key: 'mission',
      label: t('entities.mission', { fallback: 'Mission' }),
      icon: <RocketOutlined style={{ color: ENTITY_COLORS.mission }} />,
      onClick: () => onAddEntity(ENTITY_TYPES.MISSION),
    },
    {
      type: 'divider',
    },
    {
      key: 'artifact',
      label: t('entities.artifact', { fallback: 'Artifact' }),
      icon: <GiftOutlined style={{ color: ENTITY_COLORS.artifact }} />,
      onClick: () => onAddEntity(ENTITY_TYPES.ARTIFACT),
    },
    {
      key: 'competency',
      label: t('entities.competency', { fallback: 'Competency' }),
      icon: <TrophyOutlined style={{ color: ENTITY_COLORS.competency }} />,
      onClick: () => onAddEntity(ENTITY_TYPES.COMPETENCY),
    },
    {
      key: 'event',
      label: t('entities.event', { fallback: 'Event' }),
      icon: <CalendarOutlined style={{ color: ENTITY_COLORS.event }} />,
      onClick: () => onAddEntity(ENTITY_TYPES.EVENT),
    },
  ]

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1000,
        background: themeConfig?.token?.colorBgBase,
        padding: '8px',
        borderRadius: '6px',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(0, 0, 0, 0.3)',
      }}
    >
      <Space wrap size='small'>
        {/* Секция добавления сущностей */}
        <Space size='small'>
          <Dropdown
            menu={{ items: entityMenuItems }}
            placement='bottomLeft'
            arrow
            trigger={['click']}
          >
            <TooltipButton
              type='primary'
              icon={<PlusOutlined />}
              size='small'
              tooltip={t('add_entity', { fallback: 'Add Entity' })}
            />
          </Dropdown>

          {/* Быстрые кнопки для популярных сущностей */}
          <TooltipButton
            tooltip={t('entities.rank', { fallback: 'Add Rank' })}
            icon={<StarOutlined style={{ color: ENTITY_COLORS.rank }} />}
            size='small'
            onClick={() => onAddEntity(ENTITY_TYPES.RANK)}
          />

          <TooltipButton
            tooltip={t('entities.mission', { fallback: 'Add Mission' })}
            icon={<RocketOutlined style={{ color: ENTITY_COLORS.mission }} />}
            size='small'
            onClick={() => onAddEntity(ENTITY_TYPES.MISSION)}
          />
          <TooltipButton
            tooltip={t('entities.artifact', { fallback: 'Add Artifact' })}
            icon={<GiftOutlined style={{ color: ENTITY_COLORS.artifact }} />}
            size='small'
            onClick={() => onAddEntity(ENTITY_TYPES.ARTIFACT)}
          />
        </Space>

        <Divider type='vertical' style={{ margin: '0 4px', height: '24px' }} />

        {/* Секция соединения узлов */}
        <Space size='small'>
          <TooltipButton
            tooltip={
              isConnectingMode
                ? t('exit_connect_mode', { fallback: 'Exit Connect Mode' })
                : t('connect_nodes', { fallback: 'Connect Nodes' })
            }
            icon={<LinkOutlined />}
            size='small'
            type={isConnectingMode ? 'primary' : 'default'}
            onClick={onToggleConnectingMode}
            style={{
              backgroundColor: isConnectingMode ? '#ff4d4f' : undefined,
              borderColor: isConnectingMode ? '#ff4d4f' : undefined,
            }}
          />
        </Space>

        <Divider type='vertical' style={{ margin: '0 4px', height: '24px' }} />

        {/* Секция управления видом */}
        <Space size='small'>
          <TooltipButton
            tooltip={t('center', { fallback: 'Center' })}
            icon={<AimOutlined />}
            size='small'
            onClick={onCenterContent}
          />

          <TooltipButton
            tooltip={t('fit', { fallback: 'Fit' })}
            icon={<FullscreenOutlined />}
            size='small'
            onClick={onFitContent}
          />

          <TooltipButton
            tooltip={t('zoom_in', { fallback: 'Zoom In' })}
            icon={<ZoomInOutlined />}
            size='small'
            onClick={onZoomIn}
          />

          <TooltipButton
            tooltip={t('zoom_out', { fallback: 'Zoom Out' })}
            icon={<ZoomOutOutlined />}
            size='small'
            onClick={onZoomOut}
          />
        </Space>

        <Divider type='vertical' style={{ margin: '0 4px', height: '24px' }} />

        {/* Секция действий */}
        <Space size='small'>
          <TooltipButton
            tooltip={t('save', { fallback: 'Save' })}
            icon={<SaveOutlined />}
            size='small'
            color='geekblue'
            variant='solid'
            onClick={onSave}
          />

          <TooltipButton
            tooltip={t('delete_selected', { fallback: 'Delete Selected' })}
            danger
            type={isDeleteMode ? 'primary' : 'default'}
            icon={<DeleteOutlined />}
            size='small'
            onClick={onDeleteSelected}
          />

          <TooltipButton
            tooltip={t('clear_all', { fallback: 'Clear All' })}
            danger
            icon={<ClearOutlined />}
            size='small'
            onClick={onClearGraph}
          />
        </Space>
      </Space>
    </div>
  )
}

EntityToolbarPanel.displayName = 'EntityToolbarPanel'

export default EntityToolbarPanel
