import type { MenuProps } from 'antd'
import type { FCC } from 'src/types'
import {
  AimOutlined,
  AppstoreOutlined,
  BorderOutlined,
  ClearOutlined,
  FullscreenOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  RadiusSettingOutlined,
  StarOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'
import { Button, Divider, Dropdown, Space, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { useTheme } from '@/providers/ThemeProvider'

interface GraphToolbarPanelProps {
  // Callbacks для добавления фигур
  onAddRectangle?: () => void
  onAddCircle?: () => void
  onAddEllipse?: () => void
  onAddTriangle?: () => void
  onAddDiamond?: () => void
  onAddStar?: () => void
  onClearGraph?: () => void

  // Callbacks для управления графом (из GraphActionButtons)
  onCenterContent?: () => void
  onFitContent?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
}

const GraphToolbarPanel: FCC<GraphToolbarPanelProps> = ({
  onAddRectangle,
  onAddCircle,
  onAddEllipse,
  onAddTriangle,
  onAddDiamond,
  onAddStar,
  onClearGraph,
  onCenterContent,
  onFitContent,
  onZoomIn,
  onZoomOut,
}) => {
  const t = useTranslations('Graph')
  const { themeConfig } = useTheme()
  // Меню для выпадающего списка фигур
  const shapeMenuItems: MenuProps['items'] = [
    {
      key: 'rectangle',
      label: t('shapes.rectangle', { fallback: 'Rectangle' }),
      icon: <BorderOutlined />,
      onClick: onAddRectangle,
    },
    {
      key: 'circle',
      label: t('shapes.circle', { fallback: 'Circle' }),
      icon: <RadiusSettingOutlined />,
      onClick: onAddCircle,
    },
    {
      key: 'ellipse',
      label: t('shapes.ellipse', { fallback: 'Ellipse' }),
      icon: <RadiusSettingOutlined />,
      onClick: onAddEllipse,
    },
    {
      type: 'divider',
    },
    {
      key: 'triangle',
      label: t('shapes.triangle', { fallback: 'Triangle' }),
      icon: <PlayCircleOutlined />,
      onClick: onAddTriangle,
    },
    {
      key: 'diamond',
      label: t('shapes.diamond', { fallback: 'Diamond' }),
      icon: <AppstoreOutlined />,
      onClick: onAddDiamond,
    },
    {
      key: 'star',
      label: t('shapes.star', { fallback: 'Star' }),
      icon: <StarOutlined />,
      onClick: onAddStar,
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
        // boxShadow: '0 1px 10px rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(0, 0, 0, 0.3)',
      }}
    >
      <Space wrap size='small'>
        {/* Секция добавления фигур */}
        <Space size='small'>
          <Dropdown
            menu={{ items: shapeMenuItems }}
            placement='bottomLeft'
            arrow
            trigger={['click']}
          >
            <Button type='primary' icon={<PlusOutlined />} size='small'>
              {t('add_shape', { fallback: 'Add Shape' })}
            </Button>
          </Dropdown>

          {/* Быстрые кнопки для популярных фигур */}
          <Tooltip title={t('shapes.rectangle', { fallback: 'Add Rectangle' })}>
            <Button
              icon={<BorderOutlined />}
              size='small'
              onClick={onAddRectangle}
            />
          </Tooltip>

          <Tooltip title={t('shapes.circle', { fallback: 'Add Circle' })}>
            <Button
              icon={<RadiusSettingOutlined />}
              size='small'
              onClick={onAddCircle}
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

GraphToolbarPanel.displayName = 'GraphToolbarPanel'

export default GraphToolbarPanel
