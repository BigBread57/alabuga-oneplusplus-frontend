import type { FCC } from 'src/types'
import { Pie } from '@ant-design/plots'
import React, { useEffect } from 'react'

type DataItem = {
  type: string
  value: number
}

interface PieChartProps {
  data: DataItem[]
  width?: number
  height?: number
  legendPosition?: 'top' | 'left' | 'right' | 'bottom'
}

const PieChart: FCC<PieChartProps> = ({
  data,
  legendPosition = 'right',
  width,
  height,
}) => {
  const [dataInner, setData] = React.useState([] as DataItem[])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setData(data)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [data])

  const config = {
    data: dataInner,
    angleField: 'value',
    colorField: 'type',
    innerRadius: 0.6,
    autoFit: true,
    width,
    height,
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: legendPosition,
        rowPadding: 5,
      },
    },
    tooltip: {
      title: 'type', // Заголовок тултипа будет показывать тип
      items: [
        {
          field: 'value',
          name: 'Всего', // Название для значения
        },
      ],
    },
  }

  return <Pie {...config} />
}

PieChart.displayName = 'PieChart'

export default PieChart
