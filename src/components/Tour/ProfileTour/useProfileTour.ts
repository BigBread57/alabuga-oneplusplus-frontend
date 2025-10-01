import { useCallback, useEffect, useState } from 'react'
import { useTour } from '@/components/Tour/useTour'
import { useScreens } from '@/hooks/useScreens'

const TOUR_COMPLETED_KEY = 'profile_tour_completed'

interface UseProfileTourReturn {
  isModalOpen: boolean
  tourOpen: boolean
  currentStep: number
  handleStartTour: () => void
  handleSkipTour: () => void
  handleCloseTour: () => void
  handleStepChange: (current: number) => void
}

export const useProfileTour = (): UseProfileTourReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const { openDrawerForTour, setIsDrawerOpen } = useTour()
  const { isMobile, isTablet } = useScreens()

  const isCompact = isMobile || isTablet

  // Проверяем, был ли тур уже пройден
  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY)
    if (!tourCompleted) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setIsModalOpen(true)
    }
  }, [])

  const handleStartTour = useCallback(() => {
    setIsModalOpen(false)
    setCurrentStep(0)
    setTimeout(() => setTourOpen(true), 300)
  }, [])

  const handleSkipTour = useCallback(() => {
    setIsModalOpen(false)
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true')
  }, [])

  const handleCloseTour = useCallback(() => {
    setTourOpen(false)
    setCurrentStep(0)
    // Закрываем drawer при завершении тура
    if (isCompact) {
      setIsDrawerOpen(false)
    }
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true')
  }, [isCompact, setIsDrawerOpen])

  const handleStepChange = useCallback(
    (current: number) => {
      setCurrentStep(current)

      // Определяем, на каких шагах нужно открыть drawer
      // Шаги 6-11 соответствуют элементам меню:
      // 6 - Профиль, 7 - Журнал, 8 - Магазин, 9 - Рейтинг, 10 - Новости, 11 - Админ
      const menuSteps = [6, 7, 8, 9, 10, 11]

      if (isCompact && menuSteps.includes(current)) {
        // Открываем drawer для показа элементов меню
        openDrawerForTour()
      } else if (isCompact && current < 6) {
        // Закрываем drawer для шагов профиля (0-5)
        setIsDrawerOpen(false)
      }
    },
    [isCompact, openDrawerForTour, setIsDrawerOpen],
  )

  return {
    isModalOpen,
    tourOpen,
    currentStep,
    handleStartTour,
    handleSkipTour,
    handleCloseTour,
    handleStepChange,
  }
}
