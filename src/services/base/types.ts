import type { AxiosResponse } from 'axios'

export type ResponseData = {
  count: number
  next: string | null
  previous: string | null
  results: DefaultItem[]
}
export type ErrorResponse = {
  response: AxiosResponseI
  message?: string
}
export type DefaultItem = {
  id: number
}

export type AxiosResponseI<T = ResponseData> = {
  config: Record<string, any>
  data: T
  headers: Record<string, unknown>
  request: XMLHttpRequest
  status: number
  statusText: string
}

export type ReactQueryMutate = {
  mutate: CallableFunction
  isLoading: boolean
}

export type ReactQueryInfinityFetch = {
  rowData: Record<string, any>[]
  data: Record<string, any>[]
  refetch: CallableFunction
  fetchNextPage: CallableFunction
  isLoading: boolean
  isFetching: boolean
  [key: string]: unknown
}

export type ReactQueryFetch = {
  data: AxiosResponse
  isLoading: boolean
  refetch: CallableFunction
}

export type PermissionRulesProps = {
  add: boolean
  view: boolean
  delete: boolean
  change: boolean
  list: boolean
}
