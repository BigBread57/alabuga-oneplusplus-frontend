import { useContext } from 'react'
import { TourContext } from '@/components/Tour/TourProvider'

export const useTour = () => {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error('useTour must be used within TourProvider')
  }
  return context
}
