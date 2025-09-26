'use client'

import type { MenuProps } from 'antd'
import type { FCC } from 'src/types'
import { DownOutlined, FilterOutlined } from '@ant-design/icons'
import { Button, Dropdown, Radio, Space } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { useScreens } from '@/hooks/useScreens'
import { CharacterMissionStatus } from '@/models/CharacterMission'

type MissionStatusFilterProps = {
  value?: CharacterMissionStatus
  onChange?: (value: CharacterMissionStatus) => void
  size?: 'small' | 'middle' | 'large'
  direction?: 'horizontal' | 'vertical'
}

const MissionStatusFilter: FCC<MissionStatusFilterProps> = ({
  value,
  onChange,
  size = 'middle',
  direction = 'horizontal',
}) => {
  const t = useTranslations('MissionStatus')
  const { isMobile, isTablet } = useScreens()

  const handleChange = (e: any) => {
    onChange?.(e.target.value)
  }

  const handleMenuClick = (key: string) => {
    if (key === 'all') {
      onChange?.(undefined as any) // Сброс фильтра
    } else {
      onChange?.(key as CharacterMissionStatus)
    }
  }

  const options = [
    {
      label: t('in_progress'),
      value: CharacterMissionStatus.IN_PROGRESS,
    },
    {
      label: t('completed'),
      value: CharacterMissionStatus.COMPLETED,
    },
    {
      label: t('need_improvement'),
      value: CharacterMissionStatus.NEED_IMPROVEMENT,
    },
    {
      label: t('pending_review'),
      value: CharacterMissionStatus.PENDING_REVIEW,
    },
    {
      label: t('failed'),
      value: CharacterMissionStatus.FAILED,
    },
  ]

  // Получаем текущий выбранный лейбл для отображения на кнопке
  const getCurrentLabel = () => {
    const currentOption = options.find((option) => option.value === value)
    return currentOption?.label
  }

  // Формируем элементы меню для мобильной версии
  const menuItems: MenuProps['items'] = [
    ...options.map((option) => ({
      key: option.value,
      label: option.label,
      onClick: () => handleMenuClick(option.value),
    })),
  ]

  // eslint-disable-next-line style/multiline-ternary
  return !isMobile && !isTablet ? (
    <Radio.Group value={value} onChange={handleChange} size={size}>
      <Space direction={direction}>
        {options.map((option) => (
          <Radio key={option.value} value={option.value}>
            {option.label}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  ) : (
    // Мобильная версия - выпадающее меню
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      placement='bottomLeft'
    >
      <Button
        icon={<FilterOutlined />}
        size={size}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>{getCurrentLabel()}</span>
        <DownOutlined />
      </Button>
    </Dropdown>
  )
}

MissionStatusFilter.displayName = 'MissionStatusFilter'

export default MissionStatusFilter
