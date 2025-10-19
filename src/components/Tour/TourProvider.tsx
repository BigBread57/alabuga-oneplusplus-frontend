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
      title: '1.Кнопка профиля',
      description: '1.Открывает меню с доступом к вашему профилю и настройкам.',
      target: () => currentUserRef?.current || document.body,
    },
    {
      title: '2.Профиль пользователя',
      description:
        'Здесь отображается информация о вашем ранге, статистике и достижениях.',
      target: () => profileSectionRef?.current || document.body,
    },
    {
      title: '3.Артефакты',
      description: 'Просматривайте и управляйте своими артефактами.',
      target: () => artifactsSectionRef?.current || document.body,
    },
    {
      title: '4.Компетенции',
      description: 'Ваши навыки и компетенции отображаются здесь.',
      target: () => competenciesSectionRef?.current || document.body,
    },
  ]

  const mobileSteps: TourProps['steps'] = [
    ...commonSteps,
    {
      title: '5M. Кнопка выбора веток миссий',
      description: 'Здесь находятся все доступные миссии для выполнения.',
      target: () => branchesCardRef?.current || document.body,
    },
    {
      title: '6М.Фильтр статуса',
      description: 'Фильтруйте задания по их статусу.',
      target: () => statusFilterRef?.current || document.body,
    },
    {
      title: '7М.Список миссий',
      description: 'Здесь отображаются доступные миссии в выбранной ветке.',
      target: () => missionsCardRef?.current || document.body,
    },
    {
      title: '8M.Кнопка меню',
      description: 'Здесь находятся все доступные миссии для выполнения.',
      target: () => menuButtonRef?.current || document.body,
    },
    {
      title: '9M.Навигационное меню',
      description: 'Здесь находятся навигационные элементы меню.',
      target: () => navModalRef?.current || document.body,
    },
    {
      title: '9.1М.Раздел миссий',
      description: 'Здесь находятся все доступные миссии для выполнения.',
      target: () => missionRef?.current || document.body,
    },
    {
      title: '10M.События',
      description:
        'Участвуйте в специальных событиях и получайте уникальные призы.',
      target: () => eventsRef.current || document.body,
    },
    {
      title: '11M.Журнал',
      description:
        'Здесь вы можете просмотреть историю своих действий и достижений.',
      target: () => journalRef.current || document.body,
    },
    {
      title: '12M.Магазин',
      description:
        'Приобретайте полезные предметы и улучшения для вашего персонажа.',
      target: () => shopRef.current || document.body,
    },
    {
      title: '13M.Рейтинг',
      description:
        'Сравните свои достижения с другими игроками в рейтинговой таблице.',
      target: () => rankRef.current || document.body,
    },
    {
      title: '14M.Новости',
      description: 'Будьте в курсе последних обновлений и событий в игре.',
      target: () => newsRef.current || document.body,
    },
  ]

  const desktopSteps: TourProps['steps'] = [
    ...commonSteps,
    {
      title: '6D.Выбор ветки',
      description: 'Здесь выбираются ветки миссий для отображения.',
      target: () => branchesCardRef?.current || document.body,
    },
    {
      title: '7D.Список миссий',
      description: 'Здесь отображаются доступные миссии в выбранной ветке.',
      target: () => missionsCardRef?.current || document.body,
    },
    {
      title: '8D.Фильтр статуса',
      description: 'Фильтруйте задания по их статусу.',
      target: () => statusFilterRef?.current || document.body,
    },
    {
      title: '9D.События',
      description:
        'Участвуйте в специальных событиях и получайте уникальные призы.',
      target: () => eventsRef.current || document.body,
    },
    {
      title: '10D.Журнал',
      description:
        'Здесь вы можете просмотреть историю своих действий и достижений.',
      target: () => journalRef.current || document.body,
    },
    {
      title: '11D.Магазин',
      description:
        'Приобретайте полезные предметы и улучшения для вашего персонажа.',
      target: () => shopRef.current || document.body,
    },
    {
      title: '12D.Рейтинг',
      description:
        'Сравните свои достижения с другими игроками в рейтинговой таблице.',
      target: () => rankRef.current || document.body,
    },
    {
      title: '13D.Новости',
      description: 'Будьте в курсе последних обновлений и событий в игре.',
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
