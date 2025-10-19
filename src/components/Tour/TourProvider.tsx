'use client'

import type { TourProps } from 'antd'
import React, {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useScreens } from '@/hooks/useScreens'

interface TourContextValue {
  profileSectionRef: React.RefObject<HTMLDivElement>
  artifactsSectionRef: React.RefObject<HTMLDivElement>
  competenciesSectionRef: React.RefObject<HTMLDivElement>
  profileRef: React.RefObject<HTMLAnchorElement>
  journalRef: React.RefObject<HTMLAnchorElement>
  shopRef: React.RefObject<HTMLAnchorElement>
  rankRef: React.RefObject<HTMLAnchorElement>
  newsRef: React.RefObject<HTMLAnchorElement>
  adminRef: React.RefObject<HTMLAnchorElement>
  menuButtonRef: React.RefObject<HTMLAnchorElement>
  activitySectionRef: React.RefObject<HTMLDivElement>
  statusFilterRef: React.RefObject<HTMLDivElement>
  activityTabsRef: React.RefObject<HTMLDivElement>
  missionRef: React.RefObject<HTMLAnchorElement>
  eventsRef: React.RefObject<HTMLAnchorElement>
  currentUserRef: React.RefObject<HTMLAnchorElement>
  branchesCardRef: React.RefObject<HTMLAnchorElement>
  missionsCardRef: React.RefObject<HTMLAnchorElement>
  menuLinksRef: React.RefObject<HTMLAnchorElement>
  navModalRef: React.RefObject<HTMLAnchorElement>
  steps: TourProps['steps']
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
  openDrawerForTour: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const TourContext = createContext<TourContextValue | undefined>(
  undefined,
)

interface TourProviderProps {
  children: React.ReactNode
  storageKey?: string
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const { isMobile, isTablet } = useScreens()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Рефы для тура по странице профиля
  const profileSectionRef = useRef<HTMLDivElement>(null)
  const artifactsSectionRef = useRef<HTMLDivElement>(null)
  const competenciesSectionRef = useRef<HTMLDivElement>(null)
  const activitySectionRef = useRef<HTMLDivElement>(null)
  const statusFilterRef = useRef<HTMLDivElement>(null)
  const activityTabsRef = useRef<HTMLDivElement>(null)
  const currentUserRef = useRef<HTMLAnchorElement>(null)

  // Рефы для элементов меню
  const profileRef = useRef<HTMLAnchorElement>(null)
  const journalRef = useRef<HTMLAnchorElement>(null)
  const shopRef = useRef<HTMLAnchorElement>(null)
  const rankRef = useRef<HTMLAnchorElement>(null)
  const newsRef = useRef<HTMLAnchorElement>(null)
  const adminRef = useRef<HTMLAnchorElement>(null)
  const missionRef = useRef<HTMLAnchorElement>(null)
  const eventsRef = useRef<HTMLAnchorElement>(null)
  const menuButtonRef = useRef<HTMLAnchorElement>(null)
  const branchesCardRef = useRef<HTMLAnchorElement>(null)
  const missionsCardRef = useRef<HTMLAnchorElement>(null)
  const menuLinksRef = useRef<HTMLAnchorElement>(null)
  const navModalRef = useRef<HTMLAnchorElement>(null)

  const openDrawerForTour = useCallback(() => {
    setIsDrawerOpen(true)
  }, [])

  const commonSteps: TourProps['steps'] = [
    {
      title: '1. Портал командира',
      description:
        'Откройте портал командира для доступа к вашему цифровому профилю и управлению станцией.',
      target: () => currentUserRef?.current || document.body,
    },
    {
      title: '2. Космический профиль',
      description:
        'Здесь отображается ваш боевой рейтинг, космические статистики и достижения в бесконечном пространстве.',
      target: () => profileSectionRef?.current || document.body,
    },
    {
      title: '3. Артефакты галактики',
      description:
        'Просматривайте и управляйте редкими артефактами, обнаруженными во время экспедиций.',
      target: () => artifactsSectionRef?.current || document.body,
    },
    {
      title: '4. Навыки пилота',
      description:
        'Ваши компетенции и умения космического путешественника отображаются здесь.',
      target: () => competenciesSectionRef?.current || document.body,
    },
  ]

  const mobileSteps: TourProps['steps'] = [
    ...commonSteps,
    {
      title: '5. Ветки миссий',
      description:
        'Выберите сектор галактики с доступными космическими миссиями.',
      target: () => branchesCardRef?.current || document.body,
    },
    {
      title: '6. Фильтр статуса полёта',
      description:
        'Отфильтруйте миссии по их статусу: активные, завершённые или невыполненные.',
      target: () => statusFilterRef?.current || document.body,
    },
    {
      title: '7. Карта миссий',
      description:
        'Здесь отображаются все доступные миссии в выбранном секторе галактики.',
      target: () => missionsCardRef?.current || document.body,
    },
    {
      title: '8. Кнопка навигации',
      description:
        'Нажмите для открытия звёздной карты со всеми доступными секторами.',
      target: () => menuButtonRef?.current || document.body,
    },
    {
      title: '9. Звёздная карта',
      description:
        'Основная навигационная система для путешествия между космическими объектами.',
      target: () => navModalRef?.current || document.body,
    },
    {
      title: '10. Раздел миссий',
      description:
        'Исследуйте все доступные миссии в бесконечных просторах космоса.',
      target: () => missionRef?.current || document.body,
    },
    {
      title: '11. Межпланетные события',
      description:
        'Участвуйте в глобальных космических событиях и получайте уникальные награды.',
      target: () => eventsRef.current || document.body,
    },
    {
      title: '12. Журнал экспедиций',
      description:
        'Просмотрите всю историю ваших путешествий, побед и открытий в космосе.',
      target: () => journalRef.current || document.body,
    },
    {
      title: '13. Космический торговец',
      description:
        'Приобретите оборудование, топливо и редкие артефакты для своего корабля.',
      target: () => shopRef.current || document.body,
    },
    {
      title: '14. Таблица лидеров',
      description:
        'Сравните свои достижения с лучшими пилотами и завоевателями галактики.',
      target: () => rankRef.current || document.body,
    },
    {
      title: '15. Новости космоса',
      description:
        'Будьте в курсе последних открытий, угроз и событий во вселенной.',
      target: () => newsRef.current || document.body,
    },
  ]

  const desktopSteps: TourProps['steps'] = [
    ...commonSteps,
    {
      title: '5. Выбор сектора',
      description: 'Выберите интересующий вас сектор галактики для изучения.',
      target: () => branchesCardRef?.current || document.body,
    },
    {
      title: '6. Список космических миссий',
      description:
        'Здесь отображаются все доступные миссии в выбранном секторе.',
      target: () => missionsCardRef?.current || document.body,
    },
    {
      title: '7. Фильтр статуса полёта',
      description:
        'Отфильтруйте миссии по статусу: активные, завершённые или невыполненные.',
      target: () => statusFilterRef?.current || document.body,
    },
    {
      title: '8. Межпланетные события',
      description:
        'Участвуйте в глобальных космических событиях и получайте уникальные награды.',
      target: () => eventsRef.current || document.body,
    },
    {
      title: '9. Журнал экспедиций',
      description:
        'Просмотрите всю историю ваших путешествий, побед и открытий в космосе.',
      target: () => journalRef.current || document.body,
    },
    {
      title: '10. Космический торговец',
      description:
        'Приобретите оборудование, топливо и редкие артефакты для своего корабля.',
      target: () => shopRef.current || document.body,
    },
    {
      title: '11. Таблица лидеров',
      description:
        'Сравните свои достижения с лучшими пилотами и завоевателями галактики.',
      target: () => rankRef.current || document.body,
    },
    {
      title: '12. Новости космоса',
      description:
        'Будьте в курсе последних открытий, угроз и событий во вселенной.',
      target: () => newsRef.current || document.body,
    },
  ]

  const value: TourContextValue = useMemo(
    () => {
      const isMobileOrTablet = isMobile || isTablet
      const steps = isMobileOrTablet ? mobileSteps : desktopSteps

      return {
        profileSectionRef,
        artifactsSectionRef,
        competenciesSectionRef,
        profileRef,
        journalRef,
        shopRef,
        rankRef,
        newsRef,
        adminRef,
        menuButtonRef,
        activitySectionRef,
        statusFilterRef,
        activityTabsRef,
        missionRef,
        eventsRef,
        currentUserRef,
        branchesCardRef,
        missionsCardRef,
        menuLinksRef,
        navModalRef,
        steps,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawerForTour,
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMobile, isTablet, isDrawerOpen, openDrawerForTour],
  )

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>
}
