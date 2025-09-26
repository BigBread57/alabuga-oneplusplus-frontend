'use client'
import type { UserProps } from '@/models'
import { createContext } from 'react'

export type CurrentUserContextType = {
  currentUser: UserProps
  isLoading: boolean
}

export const CurrentUserContext = createContext<CurrentUserContextType>({
  currentUser: {} as UserProps,
  isLoading: true,
})
