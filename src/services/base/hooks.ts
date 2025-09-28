import type {
  MutationKey,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import BaseServices from 'src/services/base/BaseServices'
import ChoicesServices from 'src/services/base/ChoicesServices'

import { useNotification } from '@/components/_base/NotificationMessage/useNotification'
import { BaseModel } from '@/models/Base'

const DEFAULT_RESULTS_KEY = 'results'

export const useChoices = (
  qKey: string,
  url: string,
  options?: UseQueryOptions,
) => {
  return useQuery({
    queryKey: [`${qKey}Choices`] as QueryKey,
    queryFn: () => ChoicesServices.getChoices(url),
    refetchOnWindowFocus: false,
    ...options,
  })
}

export const useOptions = (
  qKey: string,
  url: string,
  options?: UseQueryOptions,
) => {
  return useQuery({
    queryKey: [`${qKey}Options`] as QueryKey,
    queryFn: () => ChoicesServices.getOptions(url),
    refetchOnWindowFocus: false,
    ...options,
  })
}

export const useFetchItems = <T = any>({
  model,
  qKey,
  resultsKey,
  options,
  filter,
}: {
  model: typeof BaseModel
  filter?: Record<string, any>
  resultsKey?: string
  options?: UseQueryOptions
  qKey?: string | string[]
}): { results: T, [key: string]: any } => {
  const queryKey = qKey || model.modelName
  const url = model.url()

  const queryData: Record<string, any> = useQuery({
    queryKey: [queryKey, filter] as QueryKey,
    queryFn: () => BaseServices.fetch(url, filter),
    refetchOnWindowFocus: false,
    ...options,
  })

  return {
    ...queryData,
    results: queryData?.data?.data?.[resultsKey || DEFAULT_RESULTS_KEY],
  }
}

export const useFetchOneItem = ({
  model,
  id,
  options,
  filters,
  qKey,
}: {
  model: typeof BaseModel
  id: string | string[] | number | undefined
  options?: UseQueryOptions
  filters?: Record<string, any>
  qKey?: string
}) => {
  const url = model?.url()
  const queryKey = qKey || model?.modelName
  useChoices(queryKey, url)

  return useQuery({
    queryKey: [queryKey, id] as QueryKey,
    queryFn: () => BaseServices.fetchOne(url, id, filters),
    ...options,
  })
}

export const useCreateItem = (
  model: typeof BaseModel,
  options: object = {},
  qKey?: string,
) => {
  const url = model.url()
  return useMutation({
    mutationKey: [qKey || model.modelName],
    mutationFn: (item: any) => BaseServices.create(url, item, options),
  })
}

export const useUpdateItem = (model: typeof BaseModel, qKey?: string) => {
  const url = model.url()
  const queryKey = qKey || BaseModel.modelName
  return useMutation({
    mutationKey: [queryKey],
    mutationFn: ([id, fields]: [string | number | undefined, any]) =>
      BaseServices.update(url, id, fields),
  })
}

export const useDeleteItem = (model: typeof BaseModel, qKey?: string) => {
  const url = model.url()
  const { notifyError } = useNotification()
  const handleDelete = (id?: string | number) => {
    if (!id) {
      throw new Error('Не указан id')
    }
    try {
      return BaseServices.delete(url, id)
    } catch (e: any) {
      if (e.response?.status === 403) {
        notifyError({ message: e.response?.data?.detail })
      }
      throw e
    }
  }
  return useMutation({
    mutationKey: [qKey || model.modelName],
    mutationFn: handleDelete,
  })
}

export const useFetchExtraAction = ({
  qKey,
  extraUrl,
  filter,
  options,
}: {
  qKey: string | string[]
  extraUrl: string
  filter?: Record<string, any>
  options?: UseQueryOptions
}) => {
  return useQuery({
    queryKey: [qKey, filter] as QueryKey,
    queryFn: () => BaseServices.fetchExtra(extraUrl, filter),
    ...options,
  })
}

export const usePatchExtraActions = <
  FieldsType,
  TData = unknown,
  TError = Error,
>(
  qKey: MutationKey,
  extraUrl: string,
  options?: UseMutationOptions<TData, TError, FieldsType>,
) => {
  return useMutation<TData, TError, FieldsType>({
    mutationKey: qKey,
    mutationFn: (fields: FieldsType) =>
      BaseServices.patchExtra(extraUrl, fields),
    ...options,
  })
}

export const useExtraActionsPost = <
  FieldsType,
  TData = unknown,
  TError = Error,
>(
  qKey: string,
  options?: UseMutationOptions<
    TData,
    TError,
    { url: string, record: FieldsType }
  >,
) => {
  return useMutation<TData, TError, { url: string, record: FieldsType }>({
    mutationKey: [qKey],
    mutationFn: ({ url, record }) => BaseServices.postExtra(url, record),
    ...options,
  })
}

export const usePostExtraActions = <
  FieldsType,
  TData = unknown,
  TError = Error,
>(
  qKey: string,
  extraUrl: string,
  options?: UseMutationOptions<TData, TError, FieldsType>,
) => {
  return useMutation<TData, TError, FieldsType>({
    mutationKey: [qKey],
    mutationFn: (fields: FieldsType) =>
      BaseServices.postExtra(extraUrl, fields),
    ...options,
  })
}

export const useExtraActionsPatch = <TData = unknown, TError = Error>(
  qKey: MutationKey,
  options?: UseMutationOptions<
    TData,
    TError,
    [extraUrl: string, fields: Record<string, any>]
  >,
) => {
  return useMutation<
    TData,
    TError,
    [extraUrl: string, fields: Record<string, any>]
  >({
    mutationKey: qKey,
    mutationFn: ([extraUrl, fields]) =>
      BaseServices.patchExtra(extraUrl, fields),
    ...options,
  })
}

export const useExtraActionsPut = <
  TData = unknown,
  TError = Error,
  FieldsType extends Record<string, any> = Record<string, any>,
>(
  qKey: string,
  options?: UseMutationOptions<
    TData,
    TError,
    [extraUrl: string, fields: FieldsType]
  >,
) => {
  return useMutation<TData, TError, [extraUrl: string, fields: FieldsType]>({
    mutationKey: [qKey],
    mutationFn: ([extraUrl, fields]) => BaseServices.putExtra(extraUrl, fields),
    ...options,
  })
}

export const useExtraActionsGet = ({
  qKey,
  extraUrl,
  options,
}: {
  qKey: string
  extraUrl: string
  options?: UseQueryOptions
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: [qKey] as QueryKey,
    queryFn: () => BaseServices.fetchExtra(extraUrl),
    ...options,
  })
}
