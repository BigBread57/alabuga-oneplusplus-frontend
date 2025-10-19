'use client'
import type { FCC } from 'src/types'
import React, { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type DataItem = {
  [key: string]: any
}

interface LineChartProps {
  data?: DataItem[]
  dataUrl?: string
  width?: number
  height?: number
  size?: 'small' | 'medium' | 'large'
  autoFit?: boolean
  xField?: string
  yFields?: string[]
  colors?: string[]
  appendPadding?: number[]
  showLegend?: boolean
  showGrid?: boolean
  strokeWidth?: number
  showDot?: boolean
  animated?: boolean
}

// Цветовая палитра (индиго + циан + красный)
const defaultColors = [
  '#06b6d4', // cyan-500
  '#ef4444', // red-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f59e0b', // amber-500
]

const LineChart: FCC<LineChartProps> = ({
  data: externalData,
  dataUrl,
  height = 400,
  size = 'medium',
  autoFit = true,
  xField = 'date',
  yFields = [],
  colors = defaultColors,
  appendPadding = [20, 20, 20, 20],
  showLegend = true,
  showGrid = true,
  strokeWidth = 2,
  showDot = true,
  animated = true,
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

  // Если yFields не указаны, автоматически определяем их
  const getLineFields = () => {
    if (yFields.length > 0) {
      return yFields
    }

    if (chartData.length === 0) {
      return []
    }

    // Берем все ключи кроме xField
    return Object.keys(chartData?.[0]).filter((key) => key !== xField)
  }

  const lineFields = getLineFields()

  // Определяем размеры в зависимости от пропса size
  const getSizeConfig = () => {
    if (height) {
      return { height }
    }

    switch (size) {
      case 'small':
        return { height: 250 }
      case 'large':
        return { height: 450 }
      case 'medium':
      default:
        return { height: 350 }
    }
  }

  const sizeConfig = getSizeConfig()

  if (!chartData || chartData.length === 0) {
    return (
      <div
        className='flex items-center justify-center rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/5 to-transparent backdrop-blur-xs'
        style={{ height: sizeConfig.height }}
      >
        <p className='text-sm text-indigo-300/60'>Нет данных для отображения</p>
      </div>
    )
  }

  return (
    <div
      className='w-full'
      style={{
        height: autoFit ? 'auto' : sizeConfig.height,
        minHeight: autoFit ? sizeConfig.height : 'auto',
      }}
      data-testid='test-LineChart'
    >
      <ResponsiveContainer
        width='100%'
        height={autoFit ? sizeConfig.height : '100%'}
      >
        <RechartsLineChart
          data={chartData}
          margin={{
            top: appendPadding[0],
            right: appendPadding[1],
            bottom: appendPadding[2],
            left: appendPadding[3],
          }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='rgba(99, 102, 241, 0.15)'
              vertical={false}
            />
          )}

          <XAxis
            dataKey={xField}
            stroke='rgba(148, 163, 184, 0.4)'
            style={{
              fontSize: '12px',
              fontWeight: 500,
            }}
            tick={{ fill: 'rgba(148, 163, 184, 0.6)' }}
          />

          <YAxis
            stroke='rgba(148, 163, 184, 0.4)'
            style={{
              fontSize: '12px',
              fontWeight: 500,
            }}
            tick={{ fill: 'rgba(148, 163, 184, 0.6)' }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(6, 182, 212, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
            labelStyle={{
              color: '#06b6d4',
              fontWeight: 700,
              fontSize: '13px',
            }}
            itemStyle={{
              color: '#06b6d4',
              fontWeight: 600,
              fontSize: '12px',
            }}
            cursor={{ stroke: 'rgba(99, 102, 241, 0.2)', strokeWidth: 1 }}
          />

          {showLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                color: 'rgba(148, 163, 184, 0.7)',
              }}
              contentStyle={{
                color: 'rgba(148, 163, 184, 0.7)',
                fontSize: '12px',
              }}
            />
          )}

          {/* Динамически создаем линии для каждого поля */}
          {lineFields.map((field, idx) => (
            <Line
              key={`line-${field}`}
              type='monotone'
              dataKey={field}
              stroke={colors[idx % colors.length]}
              strokeWidth={strokeWidth}
              dot={showDot}
              activeDot={{ r: 6 }}
              isAnimationActive={animated}
              animationDuration={600}
              connectNulls={true}
              tension={0.4}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

LineChart.displayName = 'LineChart'

export default LineChart
export type { LineChartProps }
