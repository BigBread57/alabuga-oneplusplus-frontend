import type { FC, PropsWithChildren, SyntheticEvent } from 'react'

export type FCC<P = object> = FC<PropsWithChildren<P>>
export type Nullable<T> = T | null
export type HTMLElementEvent<T extends HTMLElement> = SyntheticEvent & {
  target: T
}

export type ChoiceProps = {
  value: string
  display_name: string
}

export type FieldTypeProps = 'string' | 'choice' | 'nested object'

export type ChoicesProps = {
  value: string
  display_name: string
}
export type OptionProps<T> = {
  label: string
  value: T
  max_length?: number
  read_only?: boolean
  required?: boolean
  type: FieldTypeProps
  choices?: ChoicesProps[]
}

/**
 * Тип который описывает модель в которой ключи это поля модели, а значения это объекты описывающие поля модели
 */
export type ModelOptionProps<M> = {
  [K in keyof M]: OptionProps<M[K]>
}

export type ResponseData<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type AxiosResponse<T, R = ResponseData<T>> = {
  config: Record<string, any>
  data: R
  headers: Record<string, unknown>
  request: XMLHttpRequest
  status: number
  statusText: string
}

export type ReactQueryFetch<T> = {
  data: AxiosResponse<T>
  isLoading: boolean
  refetch: CallableFunction | unknown
}

export type ApiResponse<T = any> = {
  data?: {
    results?: T[]
    [key: string]: any
  }
  [key: string]: any
}
