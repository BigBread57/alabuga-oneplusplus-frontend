import { useCallback } from 'react'

export const useGraphFunc = () => {
  // Функция для получения цвета из узла-источника
  const getSourceColor = useCallback((edge: any) => {
    const sourceNode = edge.getSourceNode()
    return sourceNode ? sourceNode.attr('body/fill') : '#A2B1C3'
  }, [])

  // Функция для обновления цвета ребра
  const updateEdgeColor = useCallback(
    (edge: any) => {
      const sourceColor = getSourceColor(edge)
      edge.attr({
        line: {
          stroke: sourceColor,
          targetMarker: {
            fill: sourceColor,
          },
        },
      })
    },
    [getSourceColor],
  )

  const getTopLeftPosition = useCallback((graphRef: any) => {
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

  return { getSourceColor, updateEdgeColor, getTopLeftPosition }
}
