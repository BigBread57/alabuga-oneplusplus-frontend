'use client'
import type { FCC } from 'src/types'
import { Column } from '@ant-design/plots'
import { forEach, groupBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import styles from './ColumnChart.module.scss'

type DataItem = {
  year: string
  type: string
  value: number
}

interface ColumnChartProps {
  xField?: string
  yField?: string
  colorField?: string
  data?: DataItem[]
  dataUrl?: string
  width?: number
  height?: number
  size?: 'small' | 'medium' | 'large'
  autoFit?: boolean
  stack?: boolean
  showLabel?: boolean
  labelPosition?: 'top' | 'bottom' | 'inside'
  labelBaseline?: 'top' | 'middle' | 'bottom'
  labelFontSize?: number
  labelColor?: string
  showAnnotations?: boolean
  annotationFontSize?: number
  annotationColor?: string
  annotationPosition?: 'top' | 'center' | 'bottom'
}

const ColumnChart: FCC<ColumnChartProps> = ({
  data: externalData,
  dataUrl,
  width,
  height,
  size = 'medium',
  autoFit = true,
  stack = true,
  showLabel = true,
  labelPosition = 'inside',
  labelBaseline = 'bottom',
  labelFontSize = 12,
  labelColor = '#000',
  showAnnotations = true,
  annotationFontSize = 14,
  annotationColor = 'rgba(0,0,0,0.85)',
  annotationPosition = 'top',
  xField = 'year',
  yField = 'value',
  colorField = 'type',
}) => {
  const [internalData, setInternalData] = useState<DataItem[]>([])

  // Загрузка данных, если передан dataUrl
  useEffect(() => {
    if (dataUrl) {
      const asyncFetch = () => {
        fetch(dataUrl)
          .then((response) => response.json())
          .then((json) => setInternalData(json))
          .catch((error) => {
            console.warn('fetch data failed', error)
          })
      }
      asyncFetch()
    }
  }, [dataUrl])

  // Используем внешние данные или внутренние
  const chartData = externalData || internalData

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
        return { width: 400, height: 300 }
      case 'large':
        return { width: 800, height: 500 }
      case 'medium':
      default:
        return { width: 600, height: 400 }
    }
  }

  const sizeConfig = getSizeConfig()

  // Генерация аннотаций
  const generateAnnotations = () => {
    if (!showAnnotations || !chartData.length) {
      return []
    }

    const annotations: any[] = []
    forEach(groupBy(chartData, xField), (values, key) => {
      const totalValue = values.reduce(
        (sum, item) => sum + (item as any)[yField],
        0,
      )

      annotations.push({
        type: 'text',
        data: [key, totalValue],
        xField,
        yField,
        style: {
          text: `${totalValue}`,
          textAlign: 'center',
          fontSize: annotationFontSize,
          fill: annotationColor,
          textBaseline: 'bottom',
        },
        position: annotationPosition,
        tooltip: false,
      })
    })

    return annotations
  }

  const annotations = generateAnnotations()

  const config = {
    data: chartData,
    xField,
    yField,
    colorField,
    stack,
    ...sizeConfig,
    label: showLabel
      ? {
          text: yField,
          textBaseline: labelBaseline,
          position: labelPosition,
          style: {
            fontSize: labelFontSize,
            fill: labelColor,
          },
        }
      : false,
    annotations: annotations.length > 0 ? annotations : undefined,
    interaction: {
      tooltip: {
        shared: true,
      },
    },
    // Настройки отступов
    appendPadding: [20, 20, 20, 20],
  }

  return (
    <div className={styles.container} data-testid='test-ColumnChart'>
      <Column {...config} />
    </div>
  )
}

ColumnChart.displayName = 'ColumnChart'

export default ColumnChart
