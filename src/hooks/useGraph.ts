import type { EntityData } from '@/components/Graph/GraphEntityCreationModal/GraphEntityCreationModal'
import { Graph } from '@antv/x6'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { baseNodeConfig } from '@/components/Graph/registerCustomNodesBaseConfig'
import { ENTITY_COLORS } from '@/components/Graph/theme'
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
}

export enum ENTITY_TYPES {
  RANG = 'rang',
  MISSION_BRANCH = 'mission_branch',
  MISSION = 'mission',
  ARTEFACT = 'artefact',
  COMPETENCY = 'competency',
  EVENT = 'event',
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
  getNodeData: (nodeId?: string) => any
  toggleConnectingMode: () => void
  isConnectingMode: boolean
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
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [isReady, setIsReady] = useState(false)
  const [isConnectingMode, setIsConnectingMode] = useState(false)
  const firstSelectedNodeRef = useRef<string | null>(null)

  // Используем ref для актуальных значений
  const onNodeClickRef = useRef(onNodeClick)
  const isConnectingModeRef = useRef(isConnectingMode)

  useEffect(() => {
    onNodeClickRef.current = onNodeClick
  }, [onNodeClick])

  useEffect(() => {
    isConnectingModeRef.current = isConnectingMode
  }, [isConnectingMode])

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

  // Регистрация узлов - вызывается только один раз
  const registerEntityNodes = useCallback(() => {
    const entityConfigs = [
      { type: ENTITY_TYPES.RANG, color: ENTITY_COLORS.rang, icon: '🎖️' },
      {
        type: ENTITY_TYPES.MISSION_BRANCH,
        color: ENTITY_COLORS.missionBranch,
        icon: '🧭',
      },
      { type: ENTITY_TYPES.MISSION, color: ENTITY_COLORS.mission, icon: '🚀' },
      {
        type: ENTITY_TYPES.ARTEFACT,
        color: ENTITY_COLORS.artefact,
        icon: '🎁',
      },
      {
        type: ENTITY_TYPES.COMPETENCY,
        color: ENTITY_COLORS.competency,
        icon: '🏆',
      },
      { type: ENTITY_TYPES.EVENT, color: ENTITY_COLORS.event, icon: '📅' },
    ]

    entityConfigs.forEach(({ type, color, icon }) => {
      Graph.registerNode(
        type,
        {
          ...baseNodeConfig,
          attrs: {
            ...baseNodeConfig.attrs,
            body: {
              ...baseNodeConfig.attrs.body,
              fill: color,
              stroke: color,
            },
            icon: { ...baseNodeConfig.attrs.icon, text: icon },
          },
        },
        true,
      )
    })

    Graph.registerEdge(
      'entity-edge',
      {
        zIndex: -1,
        attrs: {
          line: {
            fill: 'none',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            stroke: '#A2B1C3',
            sourceMarker: null,
            targetMarker: {
              name: 'block',
              width: 8,
              height: 6,
              fill: '#A2B1C3',
            },
          },
        },
      },
      true,
    )
  }, [])

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

    registerEntityNodes()

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

      // Режим соединения - используем ref для актуального значения
      if (isConnectingModeRef.current) {
        if (!firstSelectedNodeRef.current) {
          // Выбираем первый узел
          clickedNode.attr('body/stroke', '#009707')
          clickedNode.attr('body/strokeWidth', 5)
          firstSelectedNodeRef.current = nodeId
        } else if (firstSelectedNodeRef.current !== nodeId) {
          // Создаем связь
          graphRef.current.addEdge({
            shape: 'entity-edge',
            source: firstSelectedNodeRef.current,
            target: nodeId,
          })

          // Сбрасываем выделение первого узла
          const firstNode = graphRef.current.getCellById(
            firstSelectedNodeRef.current,
          )
          if (firstNode) {
            const firstNodeData = firstNode.getData()
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

    graph.on('node:click', handleNodeClickEvent)
    graph.on('edge:click', handleEdgeClickEvent)

    graphRef.current = graph

    // Загружаем данные если есть
    if (data) {
      graph.fromJSON(data)
      graph.centerContent()
    }

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setIsReady(true)

    // Cleanup
    return () => {
      if (graphRef.current) {
        graphRef.current.off('node:click', handleNodeClickEvent)
        graphRef.current.off('edge:click', handleEdgeClickEvent)
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
      graphRef.current.centerContent()
    }
  }, [data, isReady])

  // Получение координат левого верхнего угла видимой области
  const getTopLeftPosition = useCallback(() => {
    if (!graphRef.current) {
      return { x: 50, y: 50 }
    }

    try {
      const zoom = graphRef.current.zoom()
      const translate = graphRef.current.translate()

      const x = -translate.tx / zoom + 50
      const y = -translate.ty / zoom + 50

      return { x, y }
    } catch (error) {
      console.warn('Could not get graph transform:', error)
      return { x: 50, y: 50 }
    }
  }, [])

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
    firstSelectedNodeRef.current = null
  }, [])

  const toggleConnectingMode = useCallback(() => {
    setIsConnectingMode((prev) => {
      const newMode = !prev

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

  const addEntity = useCallback(
    (entityType: ENTITY_TYPES, data: EntityData) => {
      if (!graphRef.current) {
        return false
      }

      const position = getTopLeftPosition()

      graphRef.current.addNode({
        shape: entityType,
        x: position.x,
        y: position.y,
        attrs: {
          title: { text: data.title },
          description: { text: data.description },
        },
        data: {
          type: entityType,
          title: data.title,
          description: data.description,
        },
      })

      return true
    },
    [getTopLeftPosition],
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
    getNodeData,
    toggleConnectingMode,
    isConnectingMode,
  }
}
