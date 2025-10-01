'use client'

import type { FCC } from 'src/types'
import { Spin } from 'antd'
import { debounce } from 'lodash'
import { useTranslations } from 'next-intl'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import { GraphCanvas } from '@/components/Graph/GraphCanvas'
import { fakeData } from '@/components/Graph/GraphCanvas/fake_data'
import useMessage from '@/hooks/useMessages'
import { GameWorld } from '@/models/GameWorld'
import { useExtraActionsGet, usePostExtraActions } from '@/services/base/hooks'

export const GRAPH_STORAGE_KEY = 'graph'
const MODEL = GameWorld

const GraphCanvasWrapper: FCC = () => {
  const t = useTranslations('Graph')
  const [graphData, setGraphData] = useState<any>(null)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const { currentUser } = useContext(CurrentUserContext)
  const { messageSuccess, messageError } = useMessage()

  const { data: response, isLoading }: any = useExtraActionsGet({
    qKey: 'graph-all-info',
    extraUrl: MODEL.allInfoUrl(currentUser?.active_game_world as number),
    enabled: !!currentUser?.active_game_world,
  })

  const { mutate: updateGraph, isLoading: isLoadingUpdate }: any
    = usePostExtraActions(
      'updateOrCreateAllEntitiesUrl',
      MODEL.updateOrCreateAllEntitiesUrl(
        currentUser?.active_game_world as number,
      ),
    )

  const handleUpdateGraph = (graphData: Record<string, any>) => {
    updateGraph(graphData, {
      onSuccess: () => {
        messageSuccess(t('graph_saved_successfully'))
      },
      onError: (err: any) => {
        if (err?.response?.data?.detail) {
          messageError(err?.response?.data?.detail)
        } else {
          messageError(t('error_saving_graph'))
        }
      },
    })
  }

  const handleGraphChange = useMemo(
    () =>
      debounce((graphData: any) => {
        try {
          localStorage.setItem(GRAPH_STORAGE_KEY, JSON.stringify(graphData))
          handleUpdateGraph(graphData)
        } catch (error) {
          console.error('Ошибка при сохранении в localStorage:', error)
        }
      }, 5000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // Загрузка данных с приоритетом: сервер -> localStorage -> fakeData
  useEffect(() => {
    // Ждём завершения загрузки с сервера
    if (isLoading) {
      return
    }

    try {
      // // Приоритет 1: Данные с сервера
      // if (
      //   response?.data &&
      //   response.data.cells &&
      //   response.data.cells.length > 0
      // ) {
      //   // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      //   setGraphData(response.data)
      //   // Сохраняем серверные данные в localStorage для кэширования
      //   localStorage.setItem(GRAPH_STORAGE_KEY, JSON.stringify(response.data))
      //   // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      //   setIsDataLoaded(true)
      //   return
      // }

      // Приоритет 2: localStorage (если сервер вернул пустые данные или ошибку)
      const savedData = localStorage.getItem(GRAPH_STORAGE_KEY)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        if (parsedData && parsedData.cells && parsedData.cells.length > 0) {
          // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
          setGraphData(parsedData)
          // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
          setIsDataLoaded(true)
          return
        }
      }

      // Приоритет 3: Fake данные (fallback)
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setGraphData(fakeData)
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setIsDataLoaded(true)
    } catch (error) {
      console.error('Ошибка при загрузке данных графа:', error)
      // В случае ошибки используем fake данные
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setGraphData(fakeData)
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setIsDataLoaded(true)
    }
  }, [isLoading, response])

  // Показываем спиннер пока загружаются данные
  if (isLoading || !isDataLoaded) {
    return <Spin spinning size='large' />
  }

  // Показываем спиннер при сохранении
  if (isLoadingUpdate) {
    return <Spin spinning size='large' />
  }

  return <GraphCanvas data={graphData} onChange={handleGraphChange} />
}

GraphCanvasWrapper.displayName = 'GraphCanvasWrapper'

export default GraphCanvasWrapper
