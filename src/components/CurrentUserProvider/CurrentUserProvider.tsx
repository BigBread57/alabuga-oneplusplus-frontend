import type { FCC } from 'src/types'

import type { CurrentUserContextType } from '@/components/CurrentUserProvider/CurrentUserContext'
import React, { useMemo } from 'react'
import {
  CurrentUserContext,

} from '@/components/CurrentUserProvider/CurrentUserContext'
import { useUserGetInfo } from '@/services/auth/hooks'

const CurrentUserProvider: FCC = ({ children }) => {
  const { data, isLoading }: { data: any, isLoading: boolean } = useUserGetInfo(
    {
      refetchOnWindowFocus: false,
    },
  )

  const providerValue: CurrentUserContextType = useMemo(() => {
    return {
      currentUser: data?.status === 200 ? data?.data : {},
      isLoading,
    }
  }, [data, isLoading]) // Добавлена зависимость isLoading

  return (
    <CurrentUserContext.Provider value={providerValue}>
      {children}
    </CurrentUserContext.Provider>
  )
}

CurrentUserProvider.displayName = 'CurrentUserProvider'

export default CurrentUserProvider
