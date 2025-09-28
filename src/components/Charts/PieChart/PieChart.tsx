import type { FCC } from 'src/types'
import { Pie } from '@ant-design/plots'
import React, { useEffect } from 'react'

type DataItem = {
  type: string
  value: number
}

interface PieChartProps {
  data: DataItem[]
}

const PieChart: FCC<PieChartProps> = ({ data }) => {
  const [dataInner, setData] = React.useState([] as DataItem[])
  useEffect(() => {
    const timeout = setTimeout(() => {
      setData(data || [])
    }, 1000)
    return () => clearTimeout(timeout)
  }, [data])
  const config = {
    data: dataInner,
    angleField: 'value',
    colorField: 'type',
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
  }
  return <Pie {...config} />
}

PieChart.displayName = 'PieChart'

export default PieChart
