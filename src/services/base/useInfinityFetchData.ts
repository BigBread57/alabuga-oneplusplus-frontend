import type { InfiniteData, QueryKey } from '@tanstack/react-query'
import type { BaseModel } from '@/models/Base'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useFilter } from 'src/hooks/useFilter'
import BaseServices from 'src/services/base/BaseServices'

import { useChoices, useOptions } from 'src/services/base/hooks'
import { useQueryParamsCleaner } from '@/hooks/useQueryParamsCleaner'

let stagesCounter = {}

type FetchDataProps = {
  pageParam: number
  filters: Record<string, any>
  url: string
}

type FetchDataResponseProps<ModelType> = {
  data: ModelType[]
  nextPage: string
  status: number
  count: number
}

const fetchData = async <ModelType>({
  pageParam: offset = 0,
  filters,
  url,
}: FetchDataProps): Promise<FetchDataResponseProps<ModelType>> => {
  return BaseServices.fetch(url, {
    offset,
    ...filters,
  })
    .then((response: any) => {
      const offsetCount = filters?.limit || 10
      const nextPage = response.data.next ? offset + offsetCount : undefined
      stagesCounter = response.data.stagesCounter
      return {
        data: response.data.results,
        nextPage,
        status: response.status,
        count: response.data.count,
      }
    })
    .catch((error: any) => {
      return error.response
    })
}
const getNextPageParam = (
  lastPage: FetchDataResponseProps<any>,
): number | undefined | string => {
  return lastPage?.nextPage
}

/**
 * Хук для бесконечной подгрузки элементов
 * @returns - возвращаем все поля useInfiniteQuery
 * и rowData - все загруженные данные одним массивом
 */
export const useInfinityFetchData = <ModelType>({
  model,
  defFilters = {},
  options,
  qKeyPrefix,
  dependOn,
}: {
  model: typeof BaseModel
  defFilters?: Record<string, any>
  options?: any
  qKeyPrefix?: string
  dependOn?: any
}) => {
  const url = model.url()
  const qKey = qKeyPrefix || model.modelName
  useChoices(qKey, url)
  useOptions(qKey, url)
  const [filters, setFilters] = useFilter({})
  const cleanedParams = useQueryParamsCleaner({ ...defFilters, ...filters })

  const queryKey = qKeyPrefix
    ? `${qKeyPrefix}Infinity`
    : `${model.modelName}Infinity`

  const infinityData = useInfiniteQuery<
    FetchDataResponseProps<ModelType>,
    Error,
    InfiniteData<FetchDataResponseProps<ModelType>>
  >({
    queryFn: ({ pageParam = 0 }: { pageParam?: any }) =>
      fetchData<ModelType>({
        pageParam,
        filters: cleanedParams,
        url,
      }),
    refetchOnWindowFocus: false,
    ...options,
    getNextPageParam,
    queryKey: [queryKey, filters, defFilters, dependOn] as QueryKey,
  })

  const dataCount = useMemo(
    () => infinityData?.data?.pages?.[0]?.count,
    [infinityData?.data?.pages],
  )

  const rowData: ModelType[] = []
  infinityData.data?.pages?.forEach(
    (page: FetchDataResponseProps<ModelType>) => {
      if (page?.status === 200 && page?.data) {
        rowData.push(...page.data)
      }
    },
  )

  return {
    rowData,
    setFilters,
    ...infinityData,
    stagesCounter,
    dataCount,
  }
}
