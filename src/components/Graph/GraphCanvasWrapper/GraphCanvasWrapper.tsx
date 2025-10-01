'use client'

import type { FCC } from 'src/types'
import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { GraphCanvas } from '@/components/Graph/GraphCanvas'
import { fakeData } from '@/components/Graph/GraphCanvas/fake_data'

export const GRAPH_STORAGE_KEY = 'graph'

const GraphCanvasWrapper: FCC = () => {
  const [graphData, setGraphData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(GRAPH_STORAGE_KEY)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        // Проверяем, что данные не пустые
        if (parsedData && parsedData.cells && parsedData.cells.length > 0) {
          // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
          setGraphData(parsedData)
        } else {
          // Если граф был пустым, используем fake данные
          // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
          setGraphData(fakeData)
        }
      } else {
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setGraphData(fakeData)
      }
    } catch (error: any) {
      console.error('Error loading graph data from localStorage:', error)
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setGraphData(fakeData)
    } finally {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return <Spin spinning />
  }

  return <GraphCanvas data={graphData} />
}

GraphCanvasWrapper.displayName = 'GraphCanvasWrapper'

export default GraphCanvasWrapper
