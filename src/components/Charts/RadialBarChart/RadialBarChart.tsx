import type { FCC } from '@/types'
import React from 'react'
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts'

type DataItem = {
  name: string
  star?: number
  value?: number
  fill?: string
}

interface PieChartComponentProps {
  data?: DataItem[]
  height?: number
  autoFit?: boolean
  isAnimationActive?: boolean
}

const RadialBarChartComponent: FCC<PieChartComponentProps> = ({
  data,
  height = 400,
  autoFit = true,
  isAnimationActive = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className='flex h-full items-center justify-center text-gray-400'>
        <p>Нет данных</p>
      </div>
    )
  }

  const colors = [
    '#06b6d4',
    '#0ea5e9',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#d946ef',
    '#ec4899',
    '#f43f5e',
    '#f97316',
  ]

  // Преобразуем данные
  const chartData = data.map((item, index) => ({
    name: item.name,
    value: item.value ?? item.star ?? 0,
    fill: item.fill ?? colors[index % colors.length],
  }))

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='rounded-lg border border-indigo-500/20 bg-slate-900/95 p-3 backdrop-blur-sm'>
          <p className='text-xs font-medium text-cyan-300'>{payload[0].name}</p>
          <p className='text-sm font-semibold text-cyan-200'>
            {payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div
      style={{
        width: '100%',
        height: autoFit ? height : 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <PieChart
        style={{ width: '100%', maxWidth: '500px', aspectRatio: 1 }}
        responsive
      >
        <Pie
          data={chartData}
          innerRadius='80%'
          outerRadius='100%'
          cornerRadius='50%'
          paddingAngle={5}
          dataKey='value'
          isAnimationActive={isAnimationActive}
        >
          {chartData?.map((entry) => (
            <Cell key={`cell-${entry?.name}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={customTooltip} />
        <Legend />
      </PieChart>
    </div>
  )
}

RadialBarChartComponent.displayName = 'RadialBarChartComponent'

export default RadialBarChartComponent
