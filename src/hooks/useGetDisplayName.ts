/**
 * Получаем человекопонятное название чойса
 */
import { useQueryCache } from 'src/hooks/useQueryCache'

export type Choice = {
  value: string
  displayName: string
}

export const useGetDisplayName = (from: string) => {
  const choices: any = useQueryCache(`${from}Choices`)
  const getDisplayName = (type: string, value?: string | number) => {
    if (choices && choices[type]) {
      return choices[type]?.choices?.find(
        (item: Choice) => item.value === value,
      )?.display_name
    }
    return null
  }
  return getDisplayName
}
