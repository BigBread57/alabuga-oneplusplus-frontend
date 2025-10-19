'use client'
import type { FCC } from 'src/types'
import React, { useEffect, useState } from 'react'
import {
  CartesianGrid,
  ScatterChart as RechartsScatterChart,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'

type DataItem = {
  x: number
  y: number
  z: number
  [key: string]: any
}

interface ScatterChartProps {
  data?: DataItem[]
  dataUrl?: string
  width?: number
  height?: number
  size?: 'small' | 'medium' | 'large'
  autoFit?: boolean
  xField?: string
  yField?: string
  zField?: string
  xName?: string
  yName?: string
  zName?: string
  xUnit?: string
  yUnit?: string
  zUnit?: string
  color?: string
  appendPadding?: number[]
  showLegend?: boolean
  showGrid?: boolean
}

const ScatterChart: FCC<ScatterChartProps> = ({
  data: externalData,
  dataUrl,
  height = 400,
  autoFit = true,
  xField = 'x',
  yField = 'y',
  zField = 'z',
  xName = 'X Axis',
  yName = 'Y Axis',
  zName = 'Z Axis',
  xUnit = '',
  yUnit = '',
  zUnit = '',
  color = '#06b6d4',
  appendPadding = [20, 20, 20, 20],
  showGrid = true,
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

  if (!chartData || chartData.length === 0) {
    return (
      <div
        className='flex items-center justify-center rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/5 to-transparent backdrop-blur-xs'
        style={{ height }}
      >
        <p className='text-sm text-indigo-300/60'>Нет данных для отображения</p>
      </div>
    )
  }

  return (
    <div
      className='w-full'
      style={{
        height: autoFit ? 'auto' : height,
        minHeight: autoFit ? height : 'auto',
      }}
      data-testid='test-ScatterChart'
    >
      <ResponsiveContainer width='100%' height={autoFit ? height : '100%'}>
        <RechartsScatterChart
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
              vertical={true}
              horizontalPoints={[]}
            />
          )}

          <XAxis
            type='number'
            dataKey={xField}
            name={xName}
            unit={xUnit}
            stroke='rgba(148, 163, 184, 0.4)'
            style={{
              fontSize: '12px',
              fontWeight: 500,
            }}
            tick={{ fill: 'rgba(148, 163, 184, 0.6)' }}
          />

          <YAxis
            type='number'
            dataKey={yField}
            name={yName}
            unit={yUnit}
            stroke='rgba(148, 163, 184, 0.4)'
            style={{
              fontSize: '12px',
              fontWeight: 500,
            }}
            tick={{ fill: 'rgba(148, 163, 184, 0.6)' }}
          />

          <ZAxis
            type='number'
            dataKey={zField}
            name={zName}
            unit={zUnit}
            range={[60, 400]}
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
            cursor={{ strokeDasharray: '3 3' }}
          />
          <Scatter
            name={xName}
            data={chartData}
            fill={color}
            fillOpacity={0.6}
            isAnimationActive={true}
          />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

ScatterChart.displayName = 'ScatterChart'

export default ScatterChart
export type { ScatterChartProps }
