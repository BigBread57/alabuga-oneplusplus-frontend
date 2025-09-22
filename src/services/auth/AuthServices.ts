import type { IRegister, LoginValuesTypes } from 'src/services/auth/types'

import apiClient from '../api-client'

const userApi = 'user/users'
const usersProfileApi = 'user/users'

export default class AuthServices {
  static login(url: string, credentials: LoginValuesTypes) {
    return new Promise((resolve, reject) => {
      apiClient
        .post(`${userApi}/${url}/`, { ...credentials })
        .then((response: any) => {
          return resolve(response)
        })
        .catch((error: any) => {
          return reject(error.response)
        })
    })
  }

  /**
   * Получаем с бэка информацию о текущем пользователе
   */
  static async getUserInfo() {
    try {
      const res = await apiClient.get(`${usersProfileApi}/get-info/`)
      if (res.status === 200) {
        localStorage.setItem('user', JSON.stringify(res.data))
      }
      return res
    } catch (error: any) {
      return error.response
    }
  }

  /**
   * Регистрируем пользователя
   */
  static register(data: IRegister) {
    return new Promise((resolve, reject) => {
      apiClient
        .post(`${userApi}/register/`, data)
        .then((response: any) => {
          return resolve(response)
        })
        .catch((error: any) => {
          return reject(error.response)
        })
    })
  }

  /**
   * Устанавливаем пароль для пользователя
   */
  static setPasswords(url: string, { password, uidb36Key }: any) {
    return new Promise((resolve, reject) => {
      apiClient
        .post(`${userApi}/${url}/${uidb36Key}/`, { password })
        .then((response: any) => {
          return resolve(response)
        })
        .catch((error: any) => {
          return reject(error)
        })
    })
  }

  static forgot({ email }: any) {
    return new Promise((resolve, reject) => {
      apiClient
        .post(`${userApi}/forgot-password/`, { email })
        .then((response: any) => {
          return resolve(response.data)
        })
        .catch((error: any) => {
          return reject(error.response.data)
        })
    })
  }

  /**
   * Разлогиниваем пользователя
   */
  static logout(url: string) {
    return new Promise((resolve, reject) => {
      apiClient
        .post(`${userApi}/${url}/`, {})
        .then((response: any) => {
          return resolve(response)
        })
        .catch((error: any) => {
          return reject(error.data)
        })
    })
  }
}
