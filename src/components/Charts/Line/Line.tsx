import type { FCC } from 'src/types'
import { Line } from '@ant-design/plots'
import React from 'react'

interface LineData {
  year: string
  value: number
}

interface LineProps {
  data?: LineData[]
  height?: number
  xField?: string
  yField?: string
  style?: {
    lineWidth?: number
  }
}

const LineChart: FCC<LineProps> = ({ data, height, xField, yField, style }) => {
  const config = {
    data,
    height,
    xField,
    yField,
    style,
  }

  return <Line {...config} />
}

LineChart.displayName = 'LineChart'

export default LineChart
