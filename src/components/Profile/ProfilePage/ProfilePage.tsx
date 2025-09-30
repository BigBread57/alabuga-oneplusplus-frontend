'use client'

import type { TourProps } from 'antd'
import type { FCC } from 'src/types'
import { Col, Modal, Row, Tour } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useRef, useState } from 'react'
import { CharacterActivity } from '@/components/Character/CharacterActivity'
import { ProfileCard } from '@/components/Profile/ProfileCard'
import { Character } from '@/models/Character'
import { useFetchExtraAction } from '@/services/base/hooks'

const MODEL = Character

// Создаем реф для дочерних компонентов
export type ProfileComponentsRef = {
  getTourRefs: () => {
    profileRefs: Record<string, React.RefObject<any>>
    activityRefs: Record<string, React.RefObject<any>>
  }
}

const ProfilePage: FCC = () => {
  const t = useTranslations('ProfilePage')
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [tourOpen, setTourOpen] = useState<boolean>(false)

  // Рефы для тура
  const profileCardRef = useRef<any>(null)
  const characterActivityRef = useRef<any>(null)
  const handleOk = () => {
    setIsModalOpen(false)
    // Запускаем тур после закрытия модального окна
    setTimeout(() => setTourOpen(true), 300)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // Получаем все рефы из дочерних компонентов
  const getAllTourRefs = () => {
    const profileRefs = profileCardRef.current?.getTourRefs?.() || {}
    const activityRefs = characterActivityRef.current?.getTourRefs?.() || {}

    return { ...profileRefs, ...activityRefs }
  }

  const steps: TourProps['steps'] = [
    {
      title: 'Профиль пользователя',
      description: 'Здесь отображается информация о вашем профиле и ранге.',
      target: () => getAllTourRefs().profileSection?.current || document.body,
    },
    {
      title: 'Артефакты',
      description: 'Просматривайте и управляйте своими артефактами.',
      target: () => getAllTourRefs().artifactsSection?.current || document.body,
    },
    {
      title: 'Компетенции',
      description: 'Ваши навыки и компетенции отображаются здесь.',
      target: () =>
        getAllTourRefs().competenciesSection?.current || document.body,
    },
    {
      title: 'Активность',
      description: 'Здесь отображается ваша текущая активность и задания.',
      target: () => getAllTourRefs().activitySection?.current || document.body,
    },
    {
      title: 'Фильтр статуса',
      description: 'Фильтруйте задания по их статусу.',
      target: () => getAllTourRefs().statusFilter?.current || document.body,
    },
    {
      title: 'Вкладки активности',
      description: 'Переключайтесь между различными типами активности.',
      target: () => getAllTourRefs().activityTabs?.current || document.body,
    },
  ]

  const {
    data,
    isLoading,
    refetch,
  }: {
    data: any
    isLoading: boolean
    refetch: () => void
  } = useFetchExtraAction({
    extraUrl: MODEL.actualForUserUrl(),
    qKey: 'CharacterActualForUser',
  })

  return (
    <Row
      style={{
        height: '100%',
      }}
      gutter={[24, 24]}
    >
      {/* Модальное окно приветствия */}
      <Modal
        title={t('welcome')}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={t('start_tour')}
        cancelText={t('skip_tour')}
      >
        <p>{t('welcome_text')}</p>
        <p>Хотите пройти ознакомительный тур по странице профиля?</p>
      </Modal>

      {/* Тур */}
      <Tour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        steps={steps}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
      />

      {/* Основной контент с передачей рефов */}
      <Col xs={24} sm={24} md={24} lg={8}>
        <ProfileCard
          ref={profileCardRef}
          isLoading={isLoading}
          userName={data?.data?.user?.full_name || data?.data?.user?.username}
          userAvatar={data?.data?.avatar}
          character={data?.data}
          gameWorld={data?.data?.game_world}
          onUpdateAvatarSuccess={refetch}
        />
      </Col>
      <Col
        xs={24}
        sm={24}
        md={24}
        lg={16}
        style={{
          height: 'calc(100vh - 130px)',
        }}
      >
        <CharacterActivity ref={characterActivityRef} />
      </Col>
    </Row>
  )
}

ProfilePage.displayName = 'ProfilePage'

export default ProfilePage
