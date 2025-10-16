'use client'

import type { FCC } from 'src/types'
import { debounce } from 'lodash'
import { useTranslations } from 'next-intl'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import { GraphCanvas } from '@/components/Graph/GraphCanvas'
import { fakeData } from '@/components/Graph/GraphCanvas/fake_data'
import { postDataGenerate } from '@/components/Graph/postDataGenerate'
import useMessage from '@/hooks/useMessages'
import { GameWorld } from '@/models/GameWorld'
import { useExtraActionsGet, usePostExtraActions } from '@/services/base/hooks'
import CardLoader from '../../_base/CardLoader/CardLoader'

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

  const { mutate: saveGraph, isPending: isLoadingUpdate }: any =
    usePostExtraActions({
      qKey: 'updateOrCreateAllEntitiesUrl',
      extraUrl: MODEL.updateOrCreateAllEntitiesUrl(
        currentUser?.active_game_world as number,
      ),
    })
  const handleSaveGraph = () => {
    saveGraph(graphData, {
      onSuccess: () => {
        messageSuccess(t('graph_saved_successfully'))
      },
      onError: (err: any) => {
        console.error('Ошибка сохранения графа:', err)

        const errorMessage =
          err?.response?.data?.errors?.[0]?.detail ||
          err?.response?.data?.detail ||
          err?.message

        messageError(t('error_saving_graph'))
        messageError(errorMessage)
      },
    })
  }

  const { mutate: generateNewLor, isPending: isLoadingGenerate }: any =
    usePostExtraActions({
      qKey: 'generateNewLor',
      extraUrl: MODEL.generateUrl(currentUser?.active_game_world as number),
    })

  const handleNewLoreClick = () => {
    generateNewLor(postDataGenerate, {
      onSuccess: (res: any) => {
        if (res?.data) {
          setGraphData(res.data)
          localStorage.setItem(GRAPH_STORAGE_KEY, JSON.stringify(res.data))
          messageSuccess(t('new_lore_generated_successfully'))
        }
      },
      onError: (err: any) => {
        console.error('Ошибка генерации нового лора:', err)

        const errorMessage =
          err?.response?.data?.errors?.[0]?.detail ||
          err?.response?.data?.detail ||
          err?.message
        messageError(t('error_generating_new_lore'))
        messageError(errorMessage)
      },
    })
  }

  const handleGraphChange = useMemo(
    () =>
      debounce((graphData: any) => {
        try {
          localStorage.setItem(GRAPH_STORAGE_KEY, JSON.stringify(graphData))
        } catch (error) {
          console.error('Ошибка при сохранении в localStorage:', error)
        }
      }, 1000),

    [],
  )

  // Загрузка данных с приоритетом: сервер -> localStorage -> fakeData
  useEffect(() => {
    // Ждём завершения загрузки с сервера
    if (isLoading) {
      return
    }

    try {
      // FIXME: раскоментить когда бэкенд будет готов
      // Приоритет 1: Данные с сервера
      if (
        response?.data &&
        response.data.cells &&
        response.data.cells.length > 0
      ) {
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setGraphData(response.data)
        // Сохраняем серверные данные в localStorage для кэширования
        localStorage.setItem(GRAPH_STORAGE_KEY, JSON.stringify(response.data))
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setIsDataLoaded(true)
        return
      }

      // // Приоритет 2: localStorage (если сервер вернул пустые данные или ошибку)
      // const savedData = localStorage.getItem(GRAPH_STORAGE_KEY)
      // if (savedData) {
      //   const parsedData = JSON.parse(savedData)
      //   if (parsedData && parsedData.cells && parsedData.cells.length > 0) {
      //     // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      //     setGraphData(parsedData)
      //     // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      //     setIsDataLoaded(true)
      //     return
      //   }
      // }

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

  return (
    <CardLoader isLoading={isLoading || !isDataLoaded}>
      <GraphCanvas
        isLoading={isLoading || !isDataLoaded}
        isLoadingGenerate={isLoadingGenerate || isLoadingUpdate}
        data={graphData}
        onChange={handleGraphChange}
        onNewLoreClick={handleNewLoreClick}
        onSave={handleSaveGraph}
      />
    </CardLoader>
  )
}

GraphCanvasWrapper.displayName = 'GraphCanvasWrapper'

export default GraphCanvasWrapper
