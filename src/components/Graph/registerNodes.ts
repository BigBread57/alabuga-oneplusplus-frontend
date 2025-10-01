import { Graph } from '@antv/x6'
import { baseNodeConfig } from '@/components/Graph/registerCustomNodesBaseConfig'
import { ENTITY_COLORS } from '@/components/Graph/theme'
import { ENTITY_TYPES } from '@/hooks/useGraph'

export const registerEntityNodes = () => {
  const entityConfigs = [
    { type: ENTITY_TYPES.RANK, color: ENTITY_COLORS.rank, icon: '🎖️' },
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
    'edge',
    {
      zIndex: -1,
      attrs: {
        line: {
          fill: 'none',
          strokeLinejoin: 'round',
          strokeWidth: 2,
          stroke: '{sourceColor}', // будет заменено динамически
          sourceMarker: null,
          targetMarker: {
            name: 'block',
            width: 8,
            height: 6,
            fill: '{sourceColor}', // будет заменено динамически
          },
        },
      },
    },
    true,
  )
}
