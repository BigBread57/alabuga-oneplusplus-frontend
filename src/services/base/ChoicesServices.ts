import apiClient from '../api-client'

export default class ChoicesServices {
  static async getChoices(url: string) {
    try {
      const response = await apiClient.options(`${url}/`)
      const options: Record<string, any> = response.data.actions.POST
      const result = {} as Record<string, any>
      for (const [key, value] of Object.entries(options)) {
        if (value?.type === 'choice') {
          result[key] = value
        }
      }
      return result
    } catch (error: any) {
      return error.response
    }
  }

  static async getOptions(url: string) {
    try {
      const response = await apiClient.options(`${url}/`)
      const options: Record<string, any> = response.data.actions.POST
      return options
    } catch (error: any) {
      return error.response
    }
  }
}
