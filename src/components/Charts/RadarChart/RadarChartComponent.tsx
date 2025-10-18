'use client'

import type { FCC } from 'src/types'
import React from 'react'
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

type DataItem = {
  item: string
  type: string
  score: number
}

interface RadarChartProps {
  data: DataItem[]
  maxValue?: number
}

const RadarChartComponent: FCC<RadarChartProps> = ({ data, maxValue = 10 }) => {
  // Преобразуем данные в формат recharts
  // Группируем по компетенциям (item)
  const transformedData = data?.reduce(
    (acc, curr) => {
      const existing = acc?.find((d) => d.subject === curr.item)
      if (existing) {
        existing[curr.type] = curr.score
      } else {
        acc.push({
          subject: curr.item,
          [curr.type]: curr.score,
          fullMark: maxValue,
        })
      }
      return acc
    },
    [] as Array<Record<string, any>>,
  )

  const uniqueTypes = [...new Set(data?.map((d) => d.type))]

  const colors = [
    '#283a97', // DeepDarkBlue
    '#6acff6', // LightBlue
    '#06b6d4',
    '#f59e0b',
    '#8b5cf6',
    '#10b981',
  ]
  return (
    <ResponsiveContainer height={500}>
      <RadarChart data={transformedData}>
        <PolarGrid stroke='rgba(99, 102, 241, 0.2)' />
        <PolarAngleAxis
          dataKey='subject'
          tick={{ fill: '#e5e7eb', fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, maxValue]}
          tick={{ fill: '#9ca3af', fontSize: 11 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '8px',
            color: '#e5e7eb',
          }}
        />
        <Legend />
        {uniqueTypes?.map((type, idx) => (
          <Radar
            key={String(type)}
            name={String(type)}
            dataKey={type}
            stroke={colors[idx % colors.length]}
            fill={colors[idx % colors.length]}
            fillOpacity={0.5}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  )
}

RadarChartComponent.displayName = 'RadarChart'

export default RadarChartComponent
