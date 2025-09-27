import type { FCC } from 'src/types'
import { LockOutlined } from '@ant-design/icons'
import { Space, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'

const { Text } = Typography

interface ComponentLockerProps {
  prop?: any
}

const ComponentLocker: FCC<ComponentLockerProps> = () => {
  const t = useTranslations('Common')

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        borderRadius: '6px',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '8px 12px',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Space>
          <LockOutlined style={{ color: '#000000' }} />
          <Text strong style={{ color: '#000000' }}>
            {t('locked')}
          </Text>
        </Space>
      </div>
    </div>
  )
}

ComponentLocker.displayName = 'ComponentLocker'

export default ComponentLocker
