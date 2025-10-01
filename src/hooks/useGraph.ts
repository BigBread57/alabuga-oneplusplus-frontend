import type { EntityData } from '@/components/Graph/GraphEntityCreationModal/GraphEntityCreationModal'
import { Graph } from '@antv/x6'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { registerEntityNodes } from '@/components/Graph/registerNodes'
import { ENTITY_COLORS } from '@/components/Graph/theme'
import { useGraphFunc } from '@/components/Graph/useGraphFunc'
import { useTheme } from '@/providers/ThemeProvider'

interface UseGraphOptions {
  data?: any
  themeConfig?: any
  gridVisible?: boolean
  gridSize?: number
  enablePanning?: boolean
  enableMousewheel?: boolean
  onNodeClick?: (
    nodeId: string,
    entityType: ENTITY_TYPES,
    data: any,
    attrs: any,
  ) => void
  onGraphChange?: (data: any) => void
}

export enum ENTITY_TYPES {
  RANK = 'rank',
  MISSION_BRANCH = 'mission_branch',
  MISSION = 'mission',
  ARTEFACT = 'artefact',
  COMPETENCY = 'competency',
  EVENT = 'event',
  EVENT_COMPETENCY = 'event_competency',
  MISSION_COMPETENCY = 'mission_competency',
  GAME_WORLD_STORY = 'game_world_story',
}

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
  addEntity: (entityType: ENTITY_TYPES, data: EntityData) => boolean
  updateEntity: (nodeId: string, newData: Record<string, any>) => boolean
  getNodeData: (nodeId?: string) => any
  toggleConnectingMode: () => void
  isConnectingMode: boolean
  toggleDeleteMode: () => void
  isDeleteMode: boolean
}

export const useGraph = (options: UseGraphOptions = {}): UseGraphReturn => {
  const { themeConfig } = useTheme()

  const {
    data,
    gridVisible = true,
    gridSize = 10,
    enablePanning = true,
    enableMousewheel = true,
    onNodeClick,
    onGraphChange,
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [isReady, setIsReady] = useState(false)
  const [isConnectingMode, setIsConnectingMode] = useState(false)
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const firstSelectedNodeRef = useRef<string | null>(null)
  const { updateEdgeColor, getTopLeftPosition } = useGraphFunc()

  // Используем ref для актуальных значений
  const onNodeClickRef = useRef(onNodeClick)
  const isConnectingModeRef = useRef(isConnectingMode)
  const isDeleteModeRef = useRef(isDeleteMode)

  useEffect(() => {
    onNodeClickRef.current = onNodeClick
  }, [onNodeClick])

  useEffect(() => {
    isConnectingModeRef.current = isConnectingMode
  }, [isConnectingMode])

  useEffect(() => {
    isDeleteModeRef.current = isDeleteMode
  }, [isDeleteMode])

  // Мемоизируем конфиг регистрации для предотвращения пересоздания
  const registrationConfig = useMemo(
    () => ({
      gridVisible,
      gridSize,
      enablePanning,
      enableMousewheel,
    }),
    [gridVisible, gridSize, enablePanning, enableMousewheel],
  )

  // Обновление размеров контейнера
  const updateContainerSize = useCallback(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current

      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setContainerSize({ width: offsetWidth, height: offsetHeight })
    }
  }, [])

  // Resize observer для контейнера
  useEffect(() => {
    updateContainerSize()

    const handleResize = () => updateContainerSize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [updateContainerSize])

  const registerEntityNodesCall = useCallback(() => {
    registerEntityNodes()
  }, [])

  // Инициализация графа - КРИТИЧНО: минимальные зависимости
  useEffect(() => {
    if (
      !containerRef.current
      || graphRef.current
      || containerSize.width === 0
      || containerSize.height === 0
    ) {
      return
    }
    // Регистрируем узлы
    registerEntityNodesCall()

    const graph = new Graph({
      container: containerRef.current,
      width: containerSize.width,
      height: containerSize.height,
      background: {
        color: themeConfig?.token?.colorBgBase || '#ffffff',
      },
      grid: {
        size: registrationConfig.gridSize,
        visible: registrationConfig.gridVisible,
      },
      panning: registrationConfig.enablePanning,
      mousewheel: registrationConfig.enableMousewheel,
      connecting: {
        anchor: 'orth',
        connectionPoint: 'boundary',
        router: 'orth',
      },
    })

    // Обработчик для обновления цвета ребра при создании
    const handleEdgeConnected = ({ edge }: { edge: any }) => {
      updateEdgeColor(edge)
    }

    // Обработчик клика - использует ref для актуальных значений
    const handleNodeClickEvent = ({ node }: { node: any }) => {
      const nodeId = node.id

      if (!graphRef.current) {
        return
      }

      const clickedNode = graphRef.current.getCellById(nodeId)
      if (!clickedNode) {
        return
      }

      // Режим удаления - проверяем ПЕРВЫМ
      if (isDeleteModeRef.current) {
        graphRef.current.removeCell(nodeId)
        return
      }

      // Режим соединения - используем ref для актуального значения
      if (isConnectingModeRef.current) {
        if (!firstSelectedNodeRef.current) {
          // Выбираем первый узел
          clickedNode.attr('body/stroke', '#009707')
          clickedNode.attr('body/strokeWidth', 5)
          firstSelectedNodeRef.current = nodeId
        } else if (firstSelectedNodeRef.current !== nodeId) {
          // Получаем данные первого узла ДО создания связи
          const firstNode = graphRef.current.getCellById(
            firstSelectedNodeRef.current,
          )
          const firstNodeData = firstNode?.getData()
          const sourceType = firstNodeData?.type
          const targetType = clickedNode.getData()?.type

          // Создаем связь с правильными типами
          const newEdge = graphRef.current.addEdge({
            shape: 'edge',
            source: firstSelectedNodeRef.current,
            target: nodeId,
            data: {
              source_type: sourceType,
              target_type: targetType,
            },
          })

          // Обновляем цвет новой связи
          updateEdgeColor(newEdge)

          // Сбрасываем выделение первого узла
          if (firstNode) {
            const entityType = firstNodeData?.type
            if (
              entityType
              && ENTITY_COLORS[entityType as keyof typeof ENTITY_COLORS]
            ) {
              firstNode.attr(
                'body/stroke',
                ENTITY_COLORS[entityType as keyof typeof ENTITY_COLORS],
              )
              firstNode.attr('body/strokeWidth', 2)
            }
          }

          // Выходим из режима соединения
          setIsConnectingMode(false)
          firstSelectedNodeRef.current = null
        }
        return
      }

      // Обычный клик - показываем информацию
      const nodeData = clickedNode.getData()
      const nodeAttrs = clickedNode.getAttrs()
      const entityType = nodeData?.type || 'unknown'

      if (onNodeClickRef.current) {
        onNodeClickRef.current(nodeId, entityType, nodeData, nodeAttrs)
      }
    }

    const handleEdgeClickEvent = ({ edge }: { edge: any }) => {
      if (edge?.id) {
        graph.removeCell(edge.id)
      }
    }
    const handleGraphChange = () => {
      if (onGraphChange && graphRef.current) {
        const graphData = graphRef.current.toJSON()
        onGraphChange(graphData)
      }
    }

    // Подписываемся на все изменения
    graph.on('cell:added', handleGraphChange)
    graph.on('cell:removed', handleGraphChange)
    graph.on('cell:change:*', handleGraphChange)
    graph.on('node:click', handleNodeClickEvent)
    graph.on('edge:click', handleEdgeClickEvent)
    graph.on('edge:connected', handleEdgeConnected)

    graphRef.current = graph

    // Загружаем данные если есть
    if (data) {
      graph.fromJSON(data)

      // Обновляем цвета всех существующих ребер
      graph.getEdges().forEach((edge) => {
        updateEdgeColor(edge)
      })

      graph.centerContent()
    }

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setIsReady(true)

    // Cleanup
    return () => {
      if (graphRef.current) {
        graphRef.current.off('cell:added', handleGraphChange)
        graphRef.current.off('cell:removed', handleGraphChange)
        graphRef.current.off('cell:change:*', handleGraphChange)
        graphRef.current.off('node:click', handleNodeClickEvent)
        graphRef.current.off('edge:click', handleEdgeClickEvent)
        graphRef.current.off('edge:connected', handleEdgeConnected)
        graphRef.current.dispose()
        graphRef.current = null
      }
      setIsReady(false)
      firstSelectedNodeRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    containerSize.width,
    containerSize.height,
    themeConfig?.token?.colorBgBase,
    registrationConfig,
    registerEntityNodes,
    updateEdgeColor,
  ])

  // Обновление размеров графа при изменении контейнера
  useEffect(() => {
    if (
      graphRef.current
      && containerSize.width > 0
      && containerSize.height > 0
    ) {
      graphRef.current.resize(containerSize.width, containerSize.height)
    }
  }, [containerSize.width, containerSize.height])

  // Отдельный эффект для загрузки данных
  useEffect(() => {
    if (graphRef.current && data && isReady) {
      graphRef.current.fromJSON(data)

      // Обновляем цвета всех существующих ребер
      graphRef.current.getEdges().forEach((edge) => {
        updateEdgeColor(edge)
      })

      graphRef.current.centerContent()
    }
  }, [data, isReady, updateEdgeColor])

  // API методы
  const centerContent = useCallback(() => {
    graphRef.current?.centerContent()
  }, [])

  const zoomIn = useCallback(() => {
    graphRef.current?.zoom(0.3, { absolute: false })
  }, [])

  const zoomOut = useCallback(() => {
    graphRef.current?.zoom(-0.3, { absolute: false })
  }, [])

  const fitContent = useCallback(() => {
    graphRef.current?.zoomToFit()
  }, [])

  const resize = useCallback(
    (width?: number, height?: number) => {
      if (graphRef.current) {
        if (width && height) {
          graphRef.current.resize(width, height)
        } else {
          updateContainerSize()
        }
      }
    },
    [updateContainerSize],
  )

  const clearGraph = useCallback(() => {
    graphRef.current?.clearCells()
    setIsConnectingMode(false)
    setIsDeleteMode(false)
    firstSelectedNodeRef.current = null
  }, [])

  const toggleConnectingMode = useCallback(() => {
    setIsConnectingMode((prev) => {
      const newMode = !prev

      // Если включаем режим соединения, выключаем режим удаления
      if (newMode) {
        setIsDeleteMode(false)
      }

      // Если выключаем режим соединения, сбрасываем все выделения
      if (prev && graphRef.current) {
        graphRef.current.getNodes().forEach((node) => {
          const nodeData = node.getData()
          const entityType = nodeData?.type

          if (
            entityType
            && ENTITY_COLORS[entityType as keyof typeof ENTITY_COLORS]
          ) {
            node.attr(
              'body/stroke',
              ENTITY_COLORS[entityType as keyof typeof ENTITY_COLORS],
            )
            node.attr('body/strokeWidth', 2)
          }
        })
      }

      return newMode
    })
    firstSelectedNodeRef.current = null
  }, [])
  const toggleDeleteMode = useCallback(() => {
    setIsDeleteMode((prev) => {
      const newMode = !prev

      // Если включаем режим удаления, выключаем режим соединения
      if (newMode) {
        setIsConnectingMode(false)
        firstSelectedNodeRef.current = null

        // Сбрасываем выделения узлов
        if (graphRef.current) {
          graphRef.current.getNodes().forEach((node) => {
            const nodeData = node.getData()
            const entityType = nodeData?.type

            if (
              entityType
              && ENTITY_COLORS[entityType as keyof typeof ENTITY_COLORS]
            ) {
              node.attr(
                'body/stroke',
                ENTITY_COLORS[entityType as keyof typeof ENTITY_COLORS],
              )
              node.attr('body/strokeWidth', 2)
            }
          })
        }
      }

      return newMode
    })
  }, [])

  const addEntity = useCallback(
    (entityType: ENTITY_TYPES, data: EntityData) => {
      if (!graphRef.current) {
        return false
      }

      const position = getTopLeftPosition(graphRef)

      graphRef.current.addNode({
        shape: entityType,
        x: position.x,
        y: position.y,
        attrs: {
          title: { text: data.name },
          description: { text: data.description },
        },
        data: {
          type: entityType,
          ...data,
        },
      })

      return true
    },
    [getTopLeftPosition],
  )

  const updateEntity = useCallback(
    (nodeId: string, newData: Record<string, any>) => {
      if (!graphRef.current) {
        return false
      }

      const node = graphRef.current.getCellById(nodeId)
      if (!node) {
        return false
      }
      const currentData = node.getData() || {}
      node.updateData({
        ...currentData,
        ...newData,
      })
      // Обновляем визуальные атрибуты если есть title и description
      if (newData.name) {
        node.attr('title/text', newData.name)
      }
      if (newData.description) {
        node.attr('description/text', newData.description)
      }
      return true
    },
    [],
  )

  const getNodeData = useCallback((nodeId?: string) => {
    if (!graphRef.current) {
      return null
    }

    if (nodeId) {
      const node = graphRef.current.getCellById(nodeId)
      return node?.getData() || null
    }

    return graphRef.current.getNodes().map((node) => ({
      id: node.id,
      ...node.getData(),
    }))
  }, [])

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
    addEntity,
    updateEntity,
    getNodeData,
    toggleConnectingMode,
    isConnectingMode,
    toggleDeleteMode,
    isDeleteMode,
  }
}
