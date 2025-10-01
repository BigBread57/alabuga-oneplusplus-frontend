import { useCallback, useEffect, useState } from 'react'

const TOUR_COMPLETED_KEY = 'profile_tour_completed'

interface UseProfileTourReturn {
  isModalOpen: boolean
  tourOpen: boolean
  handleStartTour: () => void
  handleSkipTour: () => void
  handleCloseTour: () => void
}

export const useProfileTour = (): UseProfileTourReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)

  // Проверяем, был ли тур уже пройден
  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY)
    if (!tourCompleted) {
      setIsModalOpen(true)
    }
  }, [])

  const handleStartTour = useCallback(() => {
    setIsModalOpen(false)
    setTimeout(() => setTourOpen(true), 300)
  }, [])

  const handleSkipTour = useCallback(() => {
    setIsModalOpen(false)
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true')
  }, [])

  const handleCloseTour = useCallback(() => {
    setTourOpen(false)
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true')
  }, [])

  return {
    isModalOpen,
    tourOpen,
    handleStartTour,
    handleSkipTour,
    handleCloseTour,
  }
}
