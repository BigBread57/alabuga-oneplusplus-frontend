import { useMemo } from 'react'

/**
 * Функция для очистки объекта от пустых значений
 * @param obj - исходный объект
 * @returns очищенный объект
 */
const cleanObject = (obj: Record<string, any>): Record<string, any> => {
  const cleanedObj: Record<string, any> = {}

  Object.entries(obj).forEach(([key, value]) => {
    if (
      value === ''
      || (Array.isArray(value) && value.length === 0)
      || (typeof value === 'object'
        && value !== null
        && Object.keys(value).length === 0)
    ) {
      cleanedObj[key] = undefined
    } else {
      cleanedObj[key] = value
    }
  })

  return cleanedObj
}

/**
 * Хук для очистки параметров запроса
 * @param params - исходные параметры запроса
 * @returns очищенные параметры запроса
 */
export const useQueryParamsCleaner = (
  params: Record<string, any>,
): Record<string, any> => {
  const cleanedParams = useMemo(() => cleanObject(params), [params])
  return cleanedParams
}
