'use client'

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { Button, Card, Result, Space, Spin } from 'antd'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LogoSwitcher } from '@/components/_icons/logo/LogoSwitcher'
import { useConfirmRegister } from '@/services/auth/hooks'

type ConfirmStatus = 'loading' | 'success' | 'error'

export default function ConfirmRegister() {
  const t = useTranslations('ConfirmRegister')
  const [status, setStatus] = useState<ConfirmStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const { mutate: confirmRegister } = useConfirmRegister()

  useEffect(() => {
    // Извлекаем email и token из query параметров
    const urlParams = new URLSearchParams(window.location.search)
    const email = urlParams.get('email')
    const token = urlParams.get('token')

    if (email && token) {
      confirmRegister(
        { email, token },
        {
          onSuccess: () => {
            setStatus('success')
          },
          onError: (error: any) => {
            setStatus('error')
            setErrorMessage(
              error?.data?.detail || error?.message || t('confirmation_failed'),
            )
          },
        },
      )
    } else {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setStatus('error')
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setErrorMessage(t('invalid_confirmation_link'))
    }
  }, [confirmRegister, t])

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Result
            icon={<Spin size='large' indicator={<LoadingOutlined spin />} />}
            title={t('confirming_registration')}
            subTitle={t('please_wait')}
          />
        )

      case 'success':
        return (
          <Result
            status='success'
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title={t('registration_confirmed')}
            subTitle={t('registration_success_message')}
          />
        )

      case 'error':
        return (
          <Result
            status='error'
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            title={t('confirmation_failed')}
            subTitle={errorMessage}
          />
        )

      default:
        return null
    }
  }

  return (
    <Card
      style={{
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center',
      }}
      styles={{
        body: {
          padding: '48px 32px',
        },
      }}
    >
      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <LogoSwitcher />
      </div>
      {renderContent()}
      <Space direction='vertical'>
        <Link href='/'>
          <Button key='home'>{t('go_to_home')}</Button>
        </Link>
        <Link href='/sign-in'>
          <Button type='primary' key='login'>
            {t('go_to_login')}
          </Button>
        </Link>
      </Space>
    </Card>
  )
}
