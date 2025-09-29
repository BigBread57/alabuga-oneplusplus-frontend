import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface UseUrlDrawerProps {
  paramName: string
  itemId: string | number
}

export const useUrlDrawer = ({ paramName, itemId }: UseUrlDrawerProps) => {
  const searchParams = useSearchParams()
  const [isVisible, setDrawerVisible] = useState(false)

  // Проверяем URL параметр при монтировании и изменении searchParams
  useEffect(() => {
    const itemParam = searchParams.get(paramName)
    if (itemParam === itemId?.toString()) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setDrawerVisible(true)
    } else {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setDrawerVisible(false)
    }
  }, [searchParams, itemId, paramName])

  const handleOpenDrawer = () => {
    setDrawerVisible(true)
    // Добавляем параметр к существующим URL параметрам
    const currentPath = window.location.pathname
    const currentSearch = new URLSearchParams(window.location.search)
    currentSearch.set(paramName, itemId?.toString())
    const newUrl = `${currentPath}?${currentSearch.toString()}`
    window.history.pushState(null, '', newUrl)
  }

  const handleCloseDrawer = () => {
    setDrawerVisible(false)
    // Удаляем только нужный параметр, сохраняя остальные
    const currentPath = window.location.pathname
    const currentSearch = new URLSearchParams(window.location.search)
    currentSearch.delete(paramName)

    // Если есть другие параметры, оставляем их
    const searchString = currentSearch.toString()
    const newUrl = searchString ? `${currentPath}?${searchString}` : currentPath

    window.history.pushState(null, '', newUrl)
  }

  return {
    isVisible,
    handleOpenDrawer,
    handleCloseDrawer,
  }
}
