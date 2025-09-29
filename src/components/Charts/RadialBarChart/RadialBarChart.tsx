import type { FCC } from 'src/types'
import { RadialBar } from '@ant-design/plots'
import React from 'react'
import styles from './RadialBarChart.module.scss' // создайте соответствующий CSS модуль

type DataItem = {
  name: string
  star: number
}

interface RadialBarChartProps {
  data: DataItem[]
  xField?: string
  yField?: string
  radius?: number
  innerRadius?: number
  width?: number
  height?: number
  size?: 'small' | 'medium' | 'large'
  autoFit?: boolean
  showLegend?: boolean
  markBackgroundOpacity?: number
  maxValue?: number
  styleRadius?: number
  tooltipItems?: string[]
  axisY?: boolean
}

const RadialBarChart: FCC<RadialBarChartProps> = ({
  data,
  xField = 'name',
  yField = 'star',
  radius = 1,
  innerRadius = 0.2,
  width,
  height,
  size = 'medium',
  autoFit = true,
  showLegend = false,
  markBackgroundOpacity = 0.25,
  maxValue = 12000,
  styleRadius = 180,
  tooltipItems = ['star'],
  axisY = false,
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
    xField,
    yField,
    radius,
    innerRadius,
    ...sizeConfig,
    tooltip: {
      items: tooltipItems,
    },
    legend: showLegend,
    axis: {
      y: axisY,
    },
    markBackground: {
      opacity: markBackgroundOpacity,
    },
    scale: {
      y: {
        domain: [0, maxValue],
      },
    },
    style: {
      radius: styleRadius,
      fill: ({ star }: { star: number }) => {
        if (star > 10000) {
          return '#6349ec'
        } else if (star > 1000) {
          return '#ff9300'
        }
        return '#ff93a7'
      },
    },
    // Дополнительные настройки для взаимодействия
    interaction: {
      tooltip: {
        shared: true,
      },
    },
  }

  return (
    <div className={styles.container} data-testid='test-RadialBarChart'>
      <RadialBar {...config} />
    </div>
  )
}

RadialBarChart.displayName = 'RadialBarChart'

export default RadialBarChart
