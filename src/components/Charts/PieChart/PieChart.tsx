'use client'

import type { FCC } from 'src/types'
import React, { useEffect, useState } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

type DataItem = {
  type: string
  value: number
}

interface PieChartProps {
  data: DataItem[]
  legendPosition?: 'top' | 'left' | 'right' | 'bottom'
  isAnimationActive?: boolean
}

const PieChartComponent: FCC<PieChartProps> = ({
  data,
  legendPosition = 'bottom',
  isAnimationActive = true,
}) => {
  const [dataInner, setData] = useState<Array<{ name: string; value: number }>>(
    [],
  )

  useEffect(() => {
    const filteredData = data
      ?.filter((item) => item.value > 0)
      ?.map((item) => ({
        name: item.type,
        value: item.value,
      }))

    const timeout = setTimeout(() => {
      setData(filteredData)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [data])

  const colors = [
    '#00aeef', // Blue
    '#005dac', // DarkBlue
    '#6acff6', // LightBlue
    '#283a97', // DeepDarkBlue
    '#00d9ff', // cosmic.neon.cyan
    '#0099ff', // cosmic.neon.blue
    '#00ff88', // cosmic.neon.green
    '#6366f1', // cosmic.primary
    '#06b6d4', // cosmic.accent
    '#4f46e5', // cosmic.muted
  ]

  const getLegendPosition = () => {
    switch (legendPosition) {
      case 'top':
        return { align: 'center' as const, verticalAlign: 'top' as const }
      case 'left':
        return { align: 'left' as const, verticalAlign: 'middle' as const }
      case 'right':
        return { align: 'right' as const, verticalAlign: 'middle' as const }
      case 'bottom':
      default:
        return { align: 'center' as const, verticalAlign: 'bottom' as const }
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            dataKey='value'
            data={dataInner}
            cx='50%'
            cy='50%'
            outerRadius={80}
            fill='#8884d8'
            label
            isAnimationActive={isAnimationActive}
          >
            {dataInner?.map((entry, index) => (
              <Cell
                key={`cell-${entry}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#6acff6',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '8px',
              color: '#ffffff',
            }}
          />
          <Legend
            {...getLegendPosition()}
            wrapperStyle={{ color: '#e5e7eb', paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

PieChartComponent.displayName = 'PieChart'

export default PieChartComponent
