import type {
  EntityData,
  EntityType,
} from '@/components/Graph/GraphEntityCreationModal/GraphEntityCreationModal'
// hooks/useGraph.ts
import { Graph } from '@antv/x6'
import { useEffect, useRef, useState } from 'react'
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
    entityType: string,
    data: any,
    attrs: any,
  ) => void
}

const ENTITY_TYPES = {
  RANG: 'rang-node',
  MISSION_BRANCH: 'mission-branch-node',
  MISSION: 'mission-node',
  ARTEFACT: 'artefact-node',
  COMPETENCY: 'competency-node',
  EVENT: 'event-node',
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
  addEntity: (entityType: EntityType, data: EntityData) => void
  requestAddRang: () => void
  requestAddMissionBranch: () => void
  requestAddMission: () => void
  requestAddArtefact: () => void
  requestAddCompetency: () => void
  requestAddEvent: () => void
  getNodeData: (nodeId?: string) => any
  modalVisible: boolean
  currentEntityType: EntityType | null
  showEntityModal: (entityType: EntityType) => void
  hideEntityModal: () => void
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

  // состояние модального окна
  const [modalVisible, setModalVisible] = useState(false)
  const [currentEntityType, setCurrentEntityType] = useState<EntityType | null>(
    null,
  )

  // режим соединения
  const [isConnectingMode, setIsConnectingMode] = useState(false)
  const isConnectingModeRef = useRef(isConnectingMode)
  useEffect(() => {
    isConnectingModeRef.current = isConnectingMode
  }, [isConnectingMode])

  const [_, setFirstSelectedNode] = useState<string | null>(null)

  // обновление размеров контейнера
  const updateContainerSize = () => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setContainerSize({ width: offsetWidth, height: offsetHeight })
    }
  }

  // обработчик клика по узлу (без useCallback, стабилен)
  const handleNodeClick = (nodeId: string) => {
    if (!graphRef.current) {
      return
    }

    const node = graphRef.current.getCellById(nodeId)
    if (!node) {
      return
    }

    if (isConnectingModeRef.current) {
      setFirstSelectedNode((prevFirst) => {
        if (!prevFirst) {
          node.attr('body/stroke', '#FF6B6B')
          node.attr('body/strokeWidth', 5)
          return nodeId
        } else if (prevFirst !== nodeId) {
          graphRef.current!.addEdge({
            shape: 'entity-edge',
            source: prevFirst,
            target: nodeId,
          })

          // сброс выделения
          const firstNode = graphRef.current!.getCellById(prevFirst)
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

          setIsConnectingMode(false)
          return null
        }
        return prevFirst
      })
      return
    }

    // обычный клик — показать инфо
    const nodeData = node.getData()
    const nodeAttrs = node.getAttrs()

    const entityType = nodeData?.type || 'unknown'
    if (onNodeClick) {
      onNodeClick(nodeId, entityType, nodeData, nodeAttrs)
    }
  }

  // регистрация узлов
  const registerEntityNodes = () => {
    Graph.registerNode(
      ENTITY_TYPES.RANG,
      {
        ...baseNodeConfig,
        attrs: {
          ...baseNodeConfig.attrs,
          body: {
            ...baseNodeConfig.attrs.body,
            fill: ENTITY_COLORS.rang,
            stroke: ENTITY_COLORS.rang,
          },
          icon: { ...baseNodeConfig.attrs.icon, text: '🎖️' },
        },
      },
      true,
    )
    Graph.registerNode(
      ENTITY_TYPES.MISSION_BRANCH,
      {
        ...baseNodeConfig,
        attrs: {
          ...baseNodeConfig.attrs,
          body: {
            ...baseNodeConfig.attrs.body,
            fill: ENTITY_COLORS.missionBranch,
            stroke: ENTITY_COLORS.missionBranch,
          },
          icon: { ...baseNodeConfig.attrs.icon, text: '🧭' },
        },
      },
      true,
    )
    Graph.registerNode(
      ENTITY_TYPES.MISSION,
      {
        ...baseNodeConfig,
        attrs: {
          ...baseNodeConfig.attrs,
          body: {
            ...baseNodeConfig.attrs.body,
            fill: ENTITY_COLORS.mission,
            stroke: ENTITY_COLORS.mission,
          },
          icon: { ...baseNodeConfig.attrs.icon, text: '🚀' },
        },
      },
      true,
    )
    Graph.registerNode(
      ENTITY_TYPES.ARTEFACT,
      {
        ...baseNodeConfig,
        attrs: {
          ...baseNodeConfig.attrs,
          body: {
            ...baseNodeConfig.attrs.body,
            fill: ENTITY_COLORS.artefact,
            stroke: ENTITY_COLORS.artefact,
          },
          icon: { ...baseNodeConfig.attrs.icon, text: '🎁' },
        },
      },
      true,
    )
    Graph.registerNode(
      ENTITY_TYPES.COMPETENCY,
      {
        ...baseNodeConfig,
        attrs: {
          ...baseNodeConfig.attrs,
          body: {
            ...baseNodeConfig.attrs.body,
            fill: ENTITY_COLORS.competency,
            stroke: ENTITY_COLORS.competency,
          },
          icon: { ...baseNodeConfig.attrs.icon, text: '🏆' },
        },
      },
      true,
    )
    Graph.registerNode(
      ENTITY_TYPES.EVENT,
      {
        ...baseNodeConfig,
        attrs: {
          ...baseNodeConfig.attrs,
          body: {
            ...baseNodeConfig.attrs.body,
            fill: ENTITY_COLORS.event,
            stroke: ENTITY_COLORS.event,
          },
          icon: { ...baseNodeConfig.attrs.icon, text: '📅' },
        },
      },
      true,
    )
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
  }

  // resize контейнера
  useEffect(() => {
    updateContainerSize()
    const handleResize = () => updateContainerSize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // init графа
  useEffect(() => {
    if (
      containerRef.current
      && !graphRef.current
      && containerSize.width > 0
      && containerSize.height > 0
    ) {
      registerEntityNodes()
      graphRef.current = new Graph({
        container: containerRef.current,
        width: containerSize.width,
        height: containerSize.height,
        background: {
          color: themeConfig?.token?.colorBgBase || '#ffffff',
        },
        grid: { size: gridSize, visible: gridVisible },
        panning: enablePanning,
        mousewheel: enableMousewheel,
        connecting: {
          anchor: 'orth',
          connectionPoint: 'boundary',
          router: 'orth',
        },
      })

      graphRef.current.on('node:click', ({ node }) => {
        handleNodeClick(node.id)
      })

      graphRef.current.on('edge:click', ({ edge }) => {
        if (edge) {
          const edgeId = edge.id
          graphRef.current?.removeCell(edgeId)
        }
      })
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
    onNodeClick,
  ])

  // обновление размеров графа
  useEffect(() => {
    if (
      graphRef.current
      && containerSize.width > 0
      && containerSize.height > 0
    ) {
      graphRef.current.resize(containerSize.width, containerSize.height)
    }
  }, [containerSize])

  // загрузка данных
  useEffect(() => {
    if (graphRef.current && data) {
      graphRef.current.fromJSON(data)
      graphRef.current.centerContent()
    }
  }, [data])

  // utils
  const getRandomPosition = () => ({
    x: Math.random() * 300 + 100,
    y: Math.random() * 300 + 100,
  })

  const showEntityModal = (entityType: EntityType) => {
    setCurrentEntityType(entityType)
    setModalVisible(true)
  }

  const hideEntityModal = () => {
    setModalVisible(false)
    setCurrentEntityType(null)
  }

  const centerContent = () => graphRef.current?.centerContent()
  const zoomIn = () => graphRef.current?.zoom(0.3, { absolute: false })
  const zoomOut = () => graphRef.current?.zoom(-0.3, { absolute: false })
  const fitContent = () => graphRef.current?.zoomToFit()
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
    graphRef.current?.clearCells()
    setIsConnectingMode(false)
    setFirstSelectedNode(null)
  }

  const toggleConnectingMode = () => {
    setIsConnectingMode((prev) => !prev)
    setFirstSelectedNode(null)

    if (isConnectingMode && graphRef.current) {
      graphRef.current.getNodes().forEach((node) => {
        const nodeData = node.getData()
        const entityType = nodeData?.type
        if (
          entityType
          && ENTITY_COLORS?.[entityType as keyof typeof ENTITY_COLORS]
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

  const addEntity = (entityType: EntityType, data: EntityData) => {
    if (!graphRef.current) {
      return
    }

    const position = getRandomPosition()
    const shapeMap = {
      rang: ENTITY_TYPES.RANG,
      missionBranch: ENTITY_TYPES.MISSION_BRANCH,
      mission: ENTITY_TYPES.MISSION,
      artefact: ENTITY_TYPES.ARTEFACT,
      competency: ENTITY_TYPES.COMPETENCY,
      event: ENTITY_TYPES.EVENT,
    }

    graphRef.current.addNode({
      shape: shapeMap[entityType],
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

    hideEntityModal()
  }

  const getNodeData = (nodeId?: string) => {
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
  }

  const requestAddRang = () => showEntityModal('rang')
  const requestAddMissionBranch = () => showEntityModal('missionBranch')
  const requestAddMission = () => showEntityModal('mission')
  const requestAddArtefact = () => showEntityModal('artefact')
  const requestAddCompetency = () => showEntityModal('competency')
  const requestAddEvent = () => showEntityModal('event')

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
    requestAddRang,
    requestAddMissionBranch,
    requestAddMission,
    requestAddArtefact,
    requestAddCompetency,
    requestAddEvent,
    getNodeData,
    modalVisible,
    currentEntityType,
    showEntityModal,
    hideEntityModal,
    toggleConnectingMode,
    isConnectingMode,
  }
}
