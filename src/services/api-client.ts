import axios from 'axios'
import Cookie from 'js-cookie'
import Qs from 'qs'

const paramsSerializer = (params: any) => {
  return Qs.stringify(params, { indices: false })
}

const config = {
  // baseURL: 'https://prod.api.invest.yapa.one/api/v1',
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 60000,
  withCredentials: true,
  paramsSerializer,
}
const apiClient = () => {
  const instance = axios.create({
    ...config,
  })
  instance.interceptors.request.use((request) => {
    request.headers['X-CSRFToken'] = Cookie.get('csrftoken')
    request.headers['Generated-User-Id'] = Cookie.get('GENERATE-USER-ID')
    return request
  })

  instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      throw error
    },
  )
  return instance
}
export default apiClient()
