// hooks/useGraph.ts
import { Graph } from '@antv/x6'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/providers/ThemeProvider'

interface UseGraphOptions {
  data?: any
  themeConfig?: any
  gridVisible?: boolean
  gridSize?: number
  enablePanning?: boolean
  enableMousewheel?: boolean
}

// Типы фигур для добавления
const SHAPE_TYPES = {
  RECTANGLE: 'rect',
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
  TRIANGLE: 'polygon',
  DIAMOND: 'polygon',
  STAR: 'polygon',
} as const

interface UseGraphReturn {
  containerRef: React.RefObject<HTMLDivElement>
  graph: Graph | null
  isReady: boolean
  centerContent: () => void
  fitContent: () => void
  resize: (width?: number, height?: number) => void
  zoomIn: () => void
  zoomOut: () => void
  clearGraph: () => void
  // Функции добавления фигур
  addRectangle: () => void
  addCircle: () => void
  addEllipse: () => void
  addTriangle: () => void
  addDiamond: () => void
  addStar: () => void
}

export const useGraph = (options: UseGraphOptions = {}): UseGraphReturn => {
  const { themeConfig } = useTheme()

  const {
    data,
    gridVisible = true,
    gridSize = 10,
    enablePanning = true,
    enableMousewheel = true,
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [isReady, setIsReady] = useState(false)

  // Функция для обновления размеров контейнера
  const updateContainerSize = () => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setContainerSize({ width: offsetWidth, height: offsetHeight })
    }
  }

  // Слушаем изменения размеров окна
  useEffect(() => {
    updateContainerSize()

    const handleResize = () => updateContainerSize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Инициализация графа
  useEffect(() => {
    if (
      containerRef.current
      && !graphRef.current
      && containerSize.width > 0
      && containerSize.height > 0
    ) {
      graphRef.current = new Graph({
        container: containerRef.current,
        width: containerSize.width,
        height: containerSize.height,
        background: {
          color: themeConfig?.token?.colorBgBase || '#ffffff',
        },
        grid: {
          size: gridSize,
          visible: gridVisible,
        },
        panning: enablePanning,
        mousewheel: enableMousewheel,
      })

      // Загружаем данные если они есть
      if (data) {
        graphRef.current.fromJSON(data)
        graphRef.current.centerContent()
      }

      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setIsReady(true)
    }

    return () => {
      if (graphRef.current) {
        graphRef.current.dispose()
        graphRef.current = null
        setIsReady(false)
      }
    }
  }, [
    containerSize,
    themeConfig,
    gridVisible,
    gridSize,
    enablePanning,
    enableMousewheel,
    data,
  ])

  // Обновление размеров графа
  useEffect(() => {
    if (
      graphRef.current
      && containerSize.width > 0
      && containerSize.height > 0
    ) {
      graphRef.current.resize(containerSize.width, containerSize.height)
    }
  }, [containerSize])

  // Загрузка данных
  useEffect(() => {
    if (graphRef.current && data) {
      graphRef.current.fromJSON(data)
      graphRef.current.centerContent()
    }
  }, [data])

  // Вспомогательная функция для генерации случайных координат
  const getRandomPosition = () => ({
    x: Math.random() * 300 + 100,
    y: Math.random() * 300 + 100,
  })

  // Базовые методы управления графом
  const centerContent = () => {
    graphRef.current?.centerContent()
  }

  const zoomIn = () => {
    graphRef.current?.zoom(0.3, { absolute: false })
  }

  const zoomOut = () => {
    graphRef.current?.zoom(-0.3, { absolute: false })
  }

  const fitContent = () => {
    graphRef.current?.zoomToFit()
  }

  const resize = (width?: number, height?: number) => {
    if (graphRef.current) {
      if (width && height) {
        graphRef.current.resize(width, height)
      } else {
        updateContainerSize()
      }
    }
  }

  const clearGraph = () => {
    if (!graphRef.current) {
      return
    }
    graphRef.current.clearCells()
  }

  // Функции добавления фигур
  const addRectangle = () => {
    if (!graphRef.current) {
      return
    }

    const position = getRandomPosition()
    graphRef.current.addNode({
      shape: SHAPE_TYPES.RECTANGLE,
      width: 100,
      height: 60,
      x: position.x,
      y: position.y,
      attrs: {
        body: {
          fill: '#f0f0f0',
          stroke: '#333',
          strokeWidth: 2,
        },
        label: {
          text: 'Rectangle',
          fill: '#333',
          fontSize: 14,
        },
      },
    })
  }

  const addCircle = () => {
    if (!graphRef.current) {
      return
    }

    const position = getRandomPosition()
    graphRef.current.addNode({
      shape: SHAPE_TYPES.CIRCLE,
      width: 80,
      height: 80,
      x: position.x,
      y: position.y,
      attrs: {
        body: {
          fill: '#e6f7ff',
          stroke: '#1890ff',
          strokeWidth: 2,
        },
        label: {
          text: 'Circle',
          fill: '#333',
          fontSize: 14,
        },
      },
    })
  }

  const addEllipse = () => {
    if (!graphRef.current) {
      return
    }

    const position = getRandomPosition()
    graphRef.current.addNode({
      shape: SHAPE_TYPES.ELLIPSE,
      width: 120,
      height: 80,
      x: position.x,
      y: position.y,
      attrs: {
        body: {
          fill: '#f6ffed',
          stroke: '#52c41a',
          strokeWidth: 2,
        },
        label: {
          text: 'Ellipse',
          fill: '#333',
          fontSize: 14,
        },
      },
    })
  }

  const addTriangle = () => {
    if (!graphRef.current) {
      return
    }

    const position = getRandomPosition()
    graphRef.current.addNode({
      shape: SHAPE_TYPES.TRIANGLE,
      width: 80,
      height: 80,
      x: position.x,
      y: position.y,
      attrs: {
        body: {
          fill: '#fff2e8',
          stroke: '#fa8c16',
          strokeWidth: 2,
          refPoints: '40,5 5,75 75,75',
        },
        label: {
          text: 'Triangle',
          fill: '#333',
          fontSize: 12,
          refY: 50,
        },
      },
    })
  }

  const addDiamond = () => {
    if (!graphRef.current) {
      return
    }

    const position = getRandomPosition()
    graphRef.current.addNode({
      shape: SHAPE_TYPES.DIAMOND,
      width: 80,
      height: 80,
      x: position.x,
      y: position.y,
      attrs: {
        body: {
          fill: '#fff0f6',
          stroke: '#eb2f96',
          strokeWidth: 2,
          refPoints: '40,5 75,40 40,75 5,40',
        },
        label: {
          text: 'Diamond',
          fill: '#333',
          fontSize: 12,
        },
      },
    })
  }

  const addStar = () => {
    if (!graphRef.current) {
      return
    }

    const position = getRandomPosition()
    graphRef.current.addNode({
      shape: SHAPE_TYPES.STAR,
      width: 80,
      height: 80,
      x: position.x,
      y: position.y,
      attrs: {
        body: {
          fill: '#f9f0ff',
          stroke: '#722ed1',
          strokeWidth: 2,
          refPoints:
            '40,5 47,25 70,25 53,40 60,60 40,50 20,60 27,40 10,25 33,25',
        },
        label: {
          text: 'Star',
          fill: '#333',
          fontSize: 12,
        },
      },
    })
  }

  return {
    containerRef,
    graph: graphRef.current,
    isReady,
    centerContent,
    fitContent,
    resize,
    zoomIn,
    zoomOut,
    clearGraph,
    // Функции добавления фигур
    addRectangle,
    addCircle,
    addEllipse,
    addTriangle,
    addDiamond,
    addStar,
  }
}
