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
}

// Типы сущностей
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
  // Функции добавления сущностей (теперь принимают данные)
  addEntity: (entityType: EntityType, data: EntityData) => void
  // Функции для запроса создания сущностей (триггеры для модального окна)
  requestAddRang: () => void
  requestAddMissionBranch: () => void
  requestAddMission: () => void
  requestAddArtefact: () => void
  requestAddCompetency: () => void
  requestAddEvent: () => void
  getNodeData: (nodeId?: string) => any
  // Состояние модального окна
  modalVisible: boolean
  currentEntityType: EntityType | null
  showEntityModal: (entityType: EntityType) => void
  hideEntityModal: () => void
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

  // Состояние для модального окна создания сущностей
  const [modalVisible, setModalVisible] = useState(false)
  const [currentEntityType, setCurrentEntityType] = useState<EntityType | null>(
    null,
  )

  // Функция для обновления размеров контейнера
  const updateContainerSize = () => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setContainerSize({ width: offsetWidth, height: offsetHeight })
    }
  }

  // Регистрация кастомных узлов для сущностей
  const registerEntityNodes = () => {
    // Регистрируем узел Rang
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
          icon: {
            ...baseNodeConfig.attrs.icon,
            text: '🎖️',
          },
        },
      },
      true,
    )

    // Регистрируем узел MissionBranch
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
          icon: {
            ...baseNodeConfig.attrs.icon,
            text: '🧭',
          },
        },
      },
      true,
    )

    // Регистрируем узел Mission
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
          icon: {
            ...baseNodeConfig.attrs.icon,
            text: '🚀',
          },
        },
      },
      true,
    )

    // Регистрируем узел Artefact
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
          icon: {
            ...baseNodeConfig.attrs.icon,
            text: '🎁',
          },
        },
      },
      true,
    )

    // Регистрируем узел Competency
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
          icon: {
            ...baseNodeConfig.attrs.icon,
            text: '🏆',
          },
        },
      },
      true,
    )

    // Регистрируем узел Event
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
          icon: {
            ...baseNodeConfig.attrs.icon,
            text: '📅',
          },
        },
      },
      true,
    )

    // Регистрируем кастомный край
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
              name: 'ellipse',
              rx: 4,
              ry: 3,
              fill: '#A2B1C3',
            },
          },
        },
      },
      true,
    )
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
      // Регистрируем узлы перед созданием графа
      registerEntityNodes()

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
        connecting: {
          anchor: 'orth',
          connectionPoint: 'boundary',
          router: 'orth',
        },
      }) as Graph

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

  // Функции управления модальным окном
  const showEntityModal = (entityType: EntityType) => {
    setCurrentEntityType(entityType)
    setModalVisible(true)
  }

  const hideEntityModal = () => {
    setModalVisible(false)
    setCurrentEntityType(null)
  }

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

  // Универсальная функция добавления сущности
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

    // Закрываем модальное окно после создания
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

    // Получить данные всех узлов
    return graphRef.current.getNodes().map((node) => ({
      id: node.id,
      ...node.getData(),
    }))
  }

  // Функции для запроса создания сущностей (показывают модальное окно)
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
    // Функции для работы с сущностями
    addEntity,
    requestAddRang,
    requestAddMissionBranch,
    requestAddMission,
    requestAddArtefact,
    requestAddCompetency,
    requestAddEvent,
    getNodeData,
    // Состояние модального окна
    modalVisible,
    currentEntityType,
    showEntityModal,
    hideEntityModal,
  }
}
