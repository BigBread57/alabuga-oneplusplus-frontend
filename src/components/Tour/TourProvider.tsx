'use client'

import type { TourProps } from 'antd'
import React, {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

interface TourContextValue {
  profileSectionRef: React.RefObject<HTMLDivElement>
  artifactsSectionRef: React.RefObject<HTMLDivElement>
  competenciesSectionRef: React.RefObject<HTMLDivElement>
  profileRef: React.RefObject<HTMLAnchorElement>
  journalRef: React.RefObject<HTMLAnchorElement>
  shopRef: React.RefObject<HTMLAnchorElement>
  rangRef: React.RefObject<HTMLAnchorElement>
  newsRef: React.RefObject<HTMLAnchorElement>
  adminRef: React.RefObject<HTMLAnchorElement>
  menuButtonRef: React.RefObject<HTMLButtonElement>
  activitySectionRef: React.RefObject<HTMLDivElement>
  statusFilterRef: React.RefObject<HTMLDivElement>
  activityTabsRef: React.RefObject<HTMLDivElement>
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Рефы для тура по странице профиля
  const profileSectionRef = useRef<HTMLDivElement>(null)
  const artifactsSectionRef = useRef<HTMLDivElement>(null)
  const competenciesSectionRef = useRef<HTMLDivElement>(null)
  const activitySectionRef = useRef<HTMLDivElement>(null)
  const statusFilterRef = useRef<HTMLDivElement>(null)
  const activityTabsRef = useRef<HTMLDivElement>(null)

  // Рефы для элементов меню
  const profileRef = useRef<HTMLAnchorElement>(null)
  const journalRef = useRef<HTMLAnchorElement>(null)
  const shopRef = useRef<HTMLAnchorElement>(null)
  const rangRef = useRef<HTMLAnchorElement>(null)
  const newsRef = useRef<HTMLAnchorElement>(null)
  const adminRef = useRef<HTMLAnchorElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const openDrawerForTour = useCallback(() => {
    setIsDrawerOpen(true)
  }, [])

  const value: TourContextValue = useMemo(() => {
    const steps: TourProps['steps'] = [
      {
        title: 'Профиль пользователя',
        description: 'Здесь отображается информация о вашем профиле и ранге.',
        target: () => profileSectionRef?.current || document.body,
      },
      {
        title: 'Артефакты',
        description: 'Просматривайте и управляйте своими артефактами.',
        target: () => artifactsSectionRef?.current || document.body,
      },
      {
        title: 'Компетенции',
        description: 'Ваши навыки и компетенции отображаются здесь.',
        target: () => competenciesSectionRef?.current || document.body,
      },
      {
        title: 'Активность',
        description: 'Здесь отображается ваша текущая активность и задания.',
        target: () => activitySectionRef?.current || document.body,
      },
      {
        title: 'Фильтр статуса',
        description: 'Фильтруйте задания по их статусу.',
        target: () => statusFilterRef?.current || document.body,
      },
      {
        title: 'Вкладки активности',
        description: 'Переключайтесь между различными типами активности.',
        target: () => activityTabsRef?.current || document.body,
      },
      {
        title: 'Профиль',
        description:
          'Перейдите в свой профиль, чтобы посмотреть статистику, артефакты и компетенции.',
        target: () => profileRef.current || document.body,
      },
      {
        title: 'Журнал',
        description:
          'Здесь вы можете просмотреть историю своих действий и достижений.',
        target: () => journalRef.current || document.body,
      },
      {
        title: 'Магазин',
        description:
          'Приобретайте полезные предметы и улучшения для вашего персонажа.',
        target: () => shopRef.current || document.body,
      },
      {
        title: 'Рейтинг',
        description:
          'Сравните свои достижения с другими игроками в рейтинговой таблице.',
        target: () => rangRef.current || document.body,
      },
      {
        title: 'Новости',
        description: 'Будьте в курсе последних обновлений и событий в игре.',
        target: () => newsRef.current || document.body,
      },
      {
        title: 'Админ-панель',
        description:
          'Для администраторов: управление контентом и пользователями.',
        target: () => adminRef.current || document.body,
      },
    ]
    return {
      profileSectionRef,
      artifactsSectionRef,
      competenciesSectionRef,
      profileRef,
      journalRef,
      shopRef,
      rangRef,
      newsRef,
      adminRef,
      menuButtonRef,
      activitySectionRef,
      statusFilterRef,
      activityTabsRef,
      steps,
      isDrawerOpen,
      setIsDrawerOpen,
      openDrawerForTour,
    }
  }, [isDrawerOpen, openDrawerForTour])

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>
}
