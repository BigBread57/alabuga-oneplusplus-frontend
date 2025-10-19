'use client'

import type { TourProps } from 'antd'
import { Modal, Tour } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { AntdProvider } from '@/providers/antd'
import { ThemeProvider } from '@/providers/ThemeProvider'

interface ProfileTourProps {
  isModalOpen: boolean
  tourOpen: boolean
  steps: TourProps['steps']
  currentStep?: number
  onStartTour: () => void
  onSkipTour: () => void
  onCloseTour: () => void
  onStepChange?: (current: number) => void
}

export const ProfileTour = React.forwardRef<HTMLDivElement, ProfileTourProps>(
  (
    {
      isModalOpen,
      tourOpen,
      steps,
      currentStep = 0,
      onStartTour,
      onSkipTour,
      onCloseTour,
      onStepChange,
    },
    ref,
  ) => {
    const t = useTranslations('ProfileTour')

    return (
      <div ref={ref}>
        <ThemeProvider>
          <AntdProvider>
            {/* Модальное окно приветствия */}
            <Modal
              open={isModalOpen}
              onCancel={onSkipTour}
              onOk={onStartTour}
              title={t('welcome_title')}
              okText={t('start_tour')}
              cancelText={t('skip_tour')}
            >
              <p>{t('welcome_description')}</p>
            </Modal>

            {/* Тур по профилю */}
            <Tour
              open={tourOpen}
              onClose={onCloseTour}
              steps={steps}
              indicatorsRender={(current, total) => (
                <span>
                  {current + 1} / {total}
                </span>
              )}
              current={currentStep}
              onChange={onStepChange}
            />
          </AntdProvider>
        </ThemeProvider>
      </div>
    )
  },
)

ProfileTour.displayName = 'ProfileTour'
