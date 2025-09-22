import type { UsersModelProps } from '@/models'
import { createContext } from 'react'

export type CurrentUserContextType = {
  currentUser: UsersModelProps
  isLoading: boolean
}

export const CurrentUserContext = createContext<CurrentUserContextType>({
  currentUser: {} as UsersModelProps,
  isLoading: true,
})
