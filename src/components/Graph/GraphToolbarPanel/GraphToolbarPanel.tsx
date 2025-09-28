import type { MenuProps } from 'antd'
import type { FCC } from 'src/types'
import {
  AimOutlined,
  BranchesOutlined, // MissionBranch
  CalendarOutlined, // Event
  ClearOutlined,
  FullscreenOutlined,
  GiftOutlined, // Artefact
  PlusOutlined,
  RocketOutlined, // Mission
  // Иконки для сущностей
  StarOutlined, // Rang
  TrophyOutlined, // Competency
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'
import { Button, Divider, Dropdown, Space, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'

import { ENTITY_COLORS } from '@/components/Graph/theme'
import { useTheme } from '@/providers/ThemeProvider'

interface EntityToolbarPanelProps {
  // Callbacks для добавления сущностей
  onAddRang?: () => void
  onAddMissionBranch?: () => void
  onAddMission?: () => void
  onAddArtefact?: () => void
  onAddCompetency?: () => void
  onAddEvent?: () => void
  onClearGraph?: () => void

  // Callbacks для управления графом
  onCenterContent?: () => void
  onFitContent?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
}

const EntityToolbarPanel: FCC<EntityToolbarPanelProps> = ({
  onAddRang,
  onAddMissionBranch,
  onAddMission,
  onAddArtefact,
  onAddCompetency,
  onAddEvent,
  onClearGraph,
  onCenterContent,
  onFitContent,
  onZoomIn,
  onZoomOut,
}) => {
  const t = useTranslations('Graph')
  const { themeConfig } = useTheme()

  // Меню для выпадающего списка сущностей
  const entityMenuItems: MenuProps['items'] = [
    {
      key: 'rang',
      label: t('entities.rang', { fallback: 'Rang' }),
      icon: <StarOutlined style={{ color: ENTITY_COLORS.rang }} />,
      onClick: onAddRang,
    },
    {
      key: 'missionBranch',
      label: t('entities.missionBranch', { fallback: 'Mission Branch' }),
      icon: <BranchesOutlined style={{ color: ENTITY_COLORS.missionBranch }} />,
      onClick: onAddMissionBranch,
    },
    {
      key: 'mission',
      label: t('entities.mission', { fallback: 'Mission' }),
      icon: <RocketOutlined style={{ color: ENTITY_COLORS.mission }} />,
      onClick: onAddMission,
    },
    {
      type: 'divider',
    },
    {
      key: 'artefact',
      label: t('entities.artefact', { fallback: 'Artefact' }),
      icon: <GiftOutlined style={{ color: ENTITY_COLORS.artefact }} />,
      onClick: onAddArtefact,
    },
    {
      key: 'competency',
      label: t('entities.competency', { fallback: 'Competency' }),
      icon: <TrophyOutlined style={{ color: ENTITY_COLORS.competency }} />,
      onClick: onAddCompetency,
    },
    {
      key: 'event',
      label: t('entities.event', { fallback: 'Event' }),
      icon: <CalendarOutlined style={{ color: ENTITY_COLORS.event }} />,
      onClick: onAddEvent,
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
            <Button type='primary' icon={<PlusOutlined />} size='small'>
              {t('add_entity', { fallback: 'Add Entity' })}
            </Button>
          </Dropdown>

          {/* Быстрые кнопки для популярных сущностей */}
          <Tooltip title={t('entities.rang', { fallback: 'Add Rang' })}>
            <Button
              icon={<StarOutlined style={{ color: ENTITY_COLORS.rang }} />}
              size='small'
              onClick={onAddRang}
            />
          </Tooltip>

          <Tooltip title={t('entities.mission', { fallback: 'Add Mission' })}>
            <Button
              icon={<RocketOutlined style={{ color: ENTITY_COLORS.mission }} />}
              size='small'
              onClick={onAddMission}
            />
          </Tooltip>

          <Tooltip title={t('entities.artefact', { fallback: 'Add Artefact' })}>
            <Button
              icon={<GiftOutlined style={{ color: ENTITY_COLORS.artefact }} />}
              size='small'
              onClick={onAddArtefact}
            />
          </Tooltip>
        </Space>

        <Divider type='vertical' style={{ margin: '0 4px', height: '24px' }} />

        {/* Секция управления видом */}
        <Space size='small'>
          <Tooltip title={t('center', { fallback: 'Center' })}>
            <Button
              icon={<AimOutlined />}
              size='small'
              onClick={onCenterContent}
            />
          </Tooltip>

          <Tooltip title={t('fit', { fallback: 'Fit' })}>
            <Button
              icon={<FullscreenOutlined />}
              size='small'
              onClick={onFitContent}
            />
          </Tooltip>

          <Tooltip title={t('zoom_in', { fallback: 'Zoom In' })}>
            <Button icon={<ZoomInOutlined />} size='small' onClick={onZoomIn} />
          </Tooltip>

          <Tooltip title={t('zoom_out', { fallback: 'Zoom Out' })}>
            <Button
              icon={<ZoomOutOutlined />}
              size='small'
              onClick={onZoomOut}
            />
          </Tooltip>
        </Space>

        <Divider type='vertical' style={{ margin: '0 4px', height: '24px' }} />

        {/* Секция действий */}
        <Space size='small'>
          <Tooltip title={t('clear_all', { fallback: 'Clear All' })}>
            <Button
              danger
              icon={<ClearOutlined />}
              size='small'
              onClick={onClearGraph}
            />
          </Tooltip>
        </Space>
      </Space>
    </div>
  )
}

EntityToolbarPanel.displayName = 'EntityToolbarPanel'

export default EntityToolbarPanel
