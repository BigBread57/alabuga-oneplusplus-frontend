import type { TourProps } from 'antd'
import type { FCC } from 'src/types'
import { Modal, Tour } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'

interface ProfileTourProps {
  isModalOpen: boolean
  tourOpen: boolean
  steps: TourProps['steps']
  onStartTour: () => void
  onSkipTour: () => void
  onCloseTour: () => void
}

const ProfileTour: FCC<ProfileTourProps> = ({
  isModalOpen,
  tourOpen,
  steps,
  onStartTour,
  onSkipTour,
  onCloseTour,
}) => {
  const t = useTranslations('ProfilePage')

  return (
    <>
      {/* Модальное окно приветствия */}
      <Modal
        title={t('welcome')}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={onStartTour}
        onCancel={onSkipTour}
        okText={t('start_tour')}
        cancelText={t('skip_tour')}
      >
        <p>{t('welcome_text')}</p>
        <p>Хотите пройти ознакомительный тур по странице профиля?</p>
      </Modal>

      {/* Тур */}
      <Tour
        open={tourOpen}
        onClose={onCloseTour}
        steps={steps}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
      />
    </>
  )
}

ProfileTour.displayName = 'ProfileTour'

export default ProfileTour
