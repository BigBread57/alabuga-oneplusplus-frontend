'use client'
import type { FCC } from 'src/types'
import { Bar } from '@ant-design/plots'
import React from 'react'
import styles from './BarChart.module.scss'

type DataItem = {
  letter: string
  frequency: number
}

interface BarChartProps {
  data: DataItem[] | { type: string, value: string }
  xField?: string
  yField?: string
  width?: number
  height?: number
  size?: 'small' | 'medium' | 'large'
  autoFit?: boolean
  sortReverse?: boolean
  label?: {
    text?: string
    formatter?: string
    style?: {
      textAlign?: (d: any) => 'left' | 'right' | 'center' | 'start' | 'end'
      fill?: (d: any) => string
      dx?: (d: any) => number
    }
  }
  axis?: {
    y?: {
      labelFormatter?: string
    }
    x?: {
      labelFormatter?: string
    }
  }
  color?: string
  appendPadding?: number[]
}

const BarChart: FCC<BarChartProps> = ({
  data,
  xField = 'letter',
  yField = 'frequency',
  width,
  height,
  size = 'medium',
  autoFit = true,
  sortReverse = true,
  label,
  axis,
  color,
  appendPadding,
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
        return { width: 600, height: 400 }
      case 'medium':
      default:
        return { width: 400, height: 300 }
    }
  }

  const sizeConfig = getSizeConfig()

  // Базовая конфигурация для label
  const defaultLabelConfig = {
    text: yField,
    formatter: '.1%',
    style: {
      textAlign: (d: any) => (+d[yField] > 0.008 ? 'right' : 'start'),
      fill: (d: any) => (+d[yField] > 0.008 ? '#fff' : '#000'),
      dx: (d: any) => (+d[yField] > 0.008 ? -5 : 5),
    },
  }

  // Базовая конфигурация для axis
  const defaultAxisConfig = {
    y: {
      labelFormatter: '.0%',
    },
  }

  const config = {
    data,
    xField,
    yField,
    ...sizeConfig,
    sort: {
      reverse: sortReverse,
    },
    label: label || defaultLabelConfig,
    axis: axis || defaultAxisConfig,
    color,
    appendPadding: appendPadding || [20, 20, 20, 20],
  }

  return (
    <div className={styles.container} data-testid='test-BarChart'>
      <Bar {...config} />
    </div>
  )
}

BarChart.displayName = 'BarChart'

export default BarChart
