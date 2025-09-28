import type { FCC } from 'src/types'
import { Radar } from '@ant-design/plots'
import React from 'react'
import styles from './RadarChart.module.scss'

type DataItem = {
  item: string
  type: string
  score: number
}

interface RadarChartProps {
  xField?: string
  yField?: string
  colorField?: string
  data: DataItem[]
  width?: number
  height?: number
  size?: 'small' | 'medium' | 'large'
  autoFit?: boolean
  fillOpacity?: number
  lineWidth?: number
  maxValue?: number
  tickCount?: number
  showGrid?: boolean
  smooth?: boolean
  labelFontSize?: number
  labelRotate?: number
  labelOffset?: number
  labelStyle?: React.CSSProperties
}

const RadarChart: FCC<RadarChartProps> = ({
  data,
  width,
  height,
  size = 'medium',
  autoFit = true,
  fillOpacity = 0.5,
  lineWidth = 2,
  maxValue = 100,
  tickCount = 5,
  showGrid = true,
  smooth = true,
  labelFontSize = 12,
  labelRotate = 0,
  labelOffset = 10,
  labelStyle,
  xField,
  yField,
  colorField,
}) => {
  // Определяем размеры в зависимости от пропса size
  const getSizeConfig = () => {
    // Если autoFit включен, не задаем фиксированные размеры
    if (autoFit) {
      return { autoFit: true }
    }

    if (width && height) {
      return { width, height }
    }

    switch (size) {
      case 'small':
        return { width: 300, height: 300 }
      case 'large':
        return { width: 600, height: 600 }
      case 'medium':
      default:
        return { width: 400, height: 400 }
    }
  }

  const sizeConfig = getSizeConfig()

  const config = {
    data,
    xField: xField || 'item',
    yField: yField || 'score',
    colorField: colorField || 'type',
    shapeField: smooth ? 'smooth' : undefined,
    ...sizeConfig,
    area: {
      style: {
        fillOpacity,
      },
    },
    scale: {
      x: {
        padding: 0.5,
        align: 0,
      },
      y: {
        tickCount,
        domainMax: maxValue,
      },
    },
    axis: {
      x: {
        grid: showGrid,
        // Настройки для подписей осей X
        label: {
          style: {
            fontSize: labelFontSize,
            textAlign: 'center',
            textBaseline: 'middle',
            ...labelStyle,
          },
          rotate: labelRotate,
          offset: labelOffset,
          // Автоматический перенос длинных подписей
          formatter: (text: string) => {
            if (text.length > 8) {
              return `${text.substring(0, 8)}...`
            }
            return text
          },
        },
        // Увеличиваем отступы для подписей
        labelSpacing: 4,
      },
      y: {
        zIndex: 1,
        title: false,
        label: {
          style: {
            fontSize: labelFontSize - 1,
            fill: '#666',
            ...labelStyle,
          },
        },
      },
    },
    style: {
      lineWidth,
    },
    // Дополнительные настройки для избежания перекрытия
    interaction: {
      tooltip: {
        shared: true,
      },
    },
    // Настройки отступов
    appendPadding: [20, 20, 20, 20], // top, right, bottom, left
  }

  return (
    <div className={styles.container} data-testid='test-RadarChart'>
      <Radar {...config} />
    </div>
  )
}

RadarChart.displayName = 'RadarChart'

export default RadarChart
