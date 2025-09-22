import { useState } from 'react'

/**
 * Хук для работы с массивами
 * @param initList
 */
export const useListState = (initList: any) => {
  const [list, setList] = useState(initList)

  const addItemsToList = (items: any[]) => {
    setList((prevState: any) => [...prevState, ...items])
  }

  const removeItemFromList = (item: any) => {
    setList((prevState: any) => {
      const index = prevState.indexOf(item)
      return [
        ...prevState.slice(0, index),
        ...prevState.slice(index + 1, prevState.length),
      ]
    })
  }

  const removeItemFromListByIndex = (index: number) => {
    setList((prevState: any) => {
      return [
        ...prevState.slice(0, index),
        ...prevState.slice(index + 1, prevState.length),
      ]
    })
  }

  const clearList = () => {
    setList([])
    return []
  }

  return {
    list,
    addItemsToList,
    removeItemFromList,
    clearList,
    removeItemFromListByIndex,
  }
}
