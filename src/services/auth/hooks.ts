import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import type { IRegister, LoginValuesTypes } from '@/services/auth/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import AuthServices from 'src/services/auth/AuthServices'

export type ConfirmRegisterParams = {
  email: string
  token: string
}
/**
 * Хук подтверждения регистрации пользователя
 * @param options
 */
export const useConfirmRegister = <TData = any, TError = Error>(
  options?: UseMutationOptions<TData, TError, ConfirmRegisterParams>,
) => {
  return useMutation<TData, TError, ConfirmRegisterParams>({
    mutationKey: ['confirm-register'],
    mutationFn: (params: ConfirmRegisterParams): Promise<TData> =>
      AuthServices.confirmRegister(params) as Promise<TData>,
    ...options,
  })
}

/**
 * Хук регистрации пользователя
 * @param options
 */
export const useRegister = <TData = any, TError = Error, TVariables = any>(
  options?: UseMutationOptions<TData, TError, TVariables>,
) => {
  return useMutation<TData, TError, TVariables>({
    mutationKey: ['register'],
    mutationFn: (data: TVariables): Promise<TData> =>
      AuthServices.register(data as IRegister) as Promise<TData>,
    ...options,
  })
}

/**
 * Хук установки пароля пользовтеля
 */
export const useLogin = <
  TData = any,
  TError = Error,
  TVariables extends LoginValuesTypes = LoginValuesTypes,
>(
  options?: UseMutationOptions<TData, TError, TVariables>,
) => {
  return useMutation<TData, TError, TVariables>({
    mutationKey: ['login'],
    mutationFn: (credentials: TVariables): Promise<TData> =>
      AuthServices.login('login', credentials) as Promise<TData>,
    ...options,
  })
}
/**
 * Хук разлогинивания пользователя
 */
export const useLogout = <TData = any, TError = Error, TVariables = void>(
  options?: UseMutationOptions<TData, TError, TVariables>,
) => {
  return useMutation<TData, TError, TVariables>({
    mutationKey: ['logout'],
    mutationFn: (): Promise<TData> =>
      AuthServices.logout('logout') as Promise<TData>,
    ...options,
  })
}
/**
 * Хук для получения информации о текущем пользователе
 * @param options
 */
export const useUserGetInfo = <TData = any>(
  options?: Omit<
    UseQueryOptions<TData, Error, TData, ['userInfo']>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery<TData, Error, TData, ['userInfo']>({
    queryKey: ['userInfo'],
    queryFn: () => AuthServices.getUserInfo(),
    refetchOnWindowFocus: false,
    ...options,
  })
}
