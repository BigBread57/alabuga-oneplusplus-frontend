'use client'
import type { FCC } from 'src/types'
import React, { useMemo } from 'react'
import {
  Bar,
  CartesianGrid,
  Cell,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type DataItem = {
  letter: string
  frequency: number
  [key: string]: any
}

interface HorizontalBarChartProps {
  data: DataItem[] | { type: string, value: string }[] | undefined
  xField?: string
  yField?: string
  name?: string
  width?: number
  height?: number
  size?: 'small' | 'medium' | 'large'
  autoFit?: boolean
  sortReverse?: boolean
  colors?: string[]
  appendPadding?: number[]
  formatter?: (value: any, name: string, props: any) => string[]
}

// Цветовая палитра (индиго + циан градиенты)
const colorPalette = [
  '#06b6d4', // cyan-500
  '#0e7490', // cyan-700
  '#6366f1', // indigo-500
  '#4f46e5', // indigo-600
  '#4c1d95', // purple-900
  '#7c3aed', // violet-600
  '#a855f7', // purple-600
  '#d946ef', // fuchsia-500
]

const HorizontalBarChart: FCC<HorizontalBarChartProps> = ({
  data,
  xField = 'frequency',
  yField = 'letter',
  height = 300,
  autoFit = true,
  sortReverse = true,
  colors = colorPalette,
  appendPadding = [20, 20, 20, 20],
  formatter,
}) => {
  // Сортируем данные если нужно
  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return []
    }

    const sorted = [...data].sort((a, b) => {
      const aVal = Number(a[xField]) || 0
      const bVal = Number(b[xField]) || 0
      return sortReverse ? bVal - aVal : aVal - bVal
    })

    return sorted
  }, [data, xField, sortReverse])

  if (!sortedData || sortedData.length === 0) {
    return (
      <div
        className='flex items-center justify-center rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/5 to-transparent backdrop-blur-xs'
        style={{ height }}
      >
        <p className='text-sm text-indigo-300/60'>Нет данных для отображения</p>
      </div>
    )
  }

  // Динамическая высота в зависимости от количества элементов
  const calculatedHeight = Math.max(height, sortedData.length * 40 + 60)

  return (
    <div
      className='w-full'
      style={{
        height: autoFit ? 'auto' : height,
        minHeight: autoFit ? calculatedHeight : height,
      }}
      data-testid='test-HorizontalBarChart'
    >
      <ResponsiveContainer
        width='100%'
        height={autoFit ? calculatedHeight : '100%'}
      >
        <RechartsBarChart
          data={sortedData}
          layout='vertical'
          margin={{
            top: appendPadding[0],
            right: appendPadding[1],
            bottom: appendPadding[2],
            left: appendPadding[3],
          }}
        >
          <defs>
            {/* Градиенты для каждого цвета */}
            {colors.map((color, idx) => (
              <linearGradient
                key={`gradient-${idx}`}
                id={`gradient-horizontal-${idx}`}
                x1='0'
                y1='0'
                x2='1'
                y2='0'
              >
                <stop offset='5%' stopColor={color} stopOpacity={0.9} />
                <stop offset='95%' stopColor={color} stopOpacity={0.3} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            strokeDasharray='3 3'
            stroke='rgba(99, 102, 241, 0.15)'
            vertical={true}
            horizontalPoints={[]}
          />

          <XAxis
            type='number'
            stroke='rgba(148, 163, 184, 0.4)'
            style={{
              fontSize: '12px',
              fontWeight: 500,
            }}
            tick={{ fill: 'rgba(148, 163, 184, 0.6)' }}
          />

          <YAxis
            dataKey={yField}
            type='category'
            stroke='rgba(148, 163, 184, 0.4)'
            style={{
              fontSize: '12px',
              fontWeight: 500,
            }}
            tick={{ fill: 'rgba(148, 163, 184, 0.6)' }}
            width={150}
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
            cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
            separator=': '
            formatter={formatter}
          />

          <Bar
            dataKey={xField}
            name=''
            radius={[0, 12, 12, 0]}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing='ease-in-out'
          >
            {sortedData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#gradient-horizontal-${index % colors.length})`}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

HorizontalBarChart.displayName = 'HorizontalBarChart'

export default HorizontalBarChart
export type { HorizontalBarChartProps }
