import { isEmpty } from 'lodash'
import { useState } from 'react'

/**
 * Хук для сбора query params в один объект
 * @param initValue
 */
export const useFilter = (initValue: any = {}) => {
  const [value, setValue] = useState(initValue)

  /**
   * Обработка фильтра
   * Если значение пустое, то удаляет ключ из объекта
   * Если значение не пустое, то добавляет ключ в объект
   * @param filter
   */
  const handleFilter = (filter: Record<string, any>) => {
    const filterFieldsWithValue = {} as Record<string, any>

    setValue((prevState: Record<string, any>) => {
      if (isEmpty(filter)) {
        return {}
      }
      for (const [key, val] of Object.entries(filter)) {
        if (val) {
          filterFieldsWithValue[key] = val
        } else {
          delete prevState[key]
        }
      }
      return { ...prevState, ...filterFieldsWithValue }
    })
  }

  /**
   * Установка нового фильтра
   * Полностью заменяет старый фильтр на новый
   * @param newFilter
   */
  const handleSetNewFilter = (newFilter: Record<string, any>) => {
    setValue(newFilter)
  }

  return [value, handleFilter, handleSetNewFilter]
}
