/**
 * хук для получения опций для полей из API
 */
import { isObject } from 'lodash'
import { useQueryCache } from 'src/hooks/useQueryCache'

import { mergeObjects } from '@/utils/mergeObj'

export type Choice = {
  value: string
  displayName: string
}

/**
 * Получает опции для полей из API
 * @param from - название модели qKey в кэше реакт-квери
 * @param mapping - массив названий полей, для которых нужно получить опции, также задает порядок полей
 */
export const useApiOptions = (
  from: string,
  mapping?: (string | Record<string, string[]>)[],
) => {
  const options: Record<string, any> = useQueryCache(`${from}Options`)
  /**
   * Объединяет опции из API с данными
   * В результате возвращает объект, где ключи - это названия полей, а значения - объекты данных
   * {
   *   field: {
   *     label: 'field',
   *     value: 'value'
   *     max_length: 255,
   *     read_only: false,
   *     required: false,
   *     type: 'string' | 'choice' | 'nested object'
   *   }
   * }
   * @param data
   */
  const mergeOptionsIntoData = (data: Record<string, any>) => {
    const result = {} as Record<string, any>

    const keys = mapping?.length ? mapping : Object.keys(data)

    keys.forEach((mapItem: string | Record<string, string[]>) => {
      let value = data?.[mapItem as string]
      let mapItemKey = mapItem as string

      // если mapItem - объект, то это nested object
      // в этом случае mapItemKey - объект с ключем и массивом ключей вложенного объекта
      // например: { territorial_location: ['region', 'city_area', 'city_district'] }
      // собираем для него строку из значений вложенных ключей
      if (isObject(mapItem)) {
        // @ts-expect-error: TS2345
        const [keyName, nestedKeys]: [string, string[]]
          = Object.entries(mapItemKey)[0]
        const nestedData = data[keyName]
        const lst: string[] = []
        nestedKeys.forEach((nestedKey: string) => {
          lst.push(nestedData[nestedKey])
        })
        value = lst.join(' ')
        mapItemKey = keyName
      }
      const option = options[mapItemKey]
      if (option) {
        if (option.type === 'choice') {
          // для чойсов возвращаем display_name
          value = option.choices.find(
            (item: Choice) => item.value === value,
          )?.display_name
        }
        result[mapItemKey] = {
          ...option,
          value,
        }
      } else {
        result[mapItemKey] = {
          label: mapItemKey,
          value,
        }
      }
    })
    return result
  }

  const getFullData = (data: Record<string, any>) => {
    return mergeObjects(options, data)
  }
  return { mergeOptionsIntoData, options, getFullData }
}
