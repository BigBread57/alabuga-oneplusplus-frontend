'use client'

import type { FormErrorsHook } from '@/hooks/useFormErrors'
import type { LoginValuesTypes } from '@/services/auth'
import { GoogleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Space,
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ThemeSwitcher } from '@/components/_base/ThemeSwitcher/ThemeSwitcher'
import { LogoSwitcher } from '@/components/_icons/logo/LogoSwitcher'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { useFormErrors } from '@/hooks/useFormErrors'
import useMessage from '@/hooks/useMessages'
import { useLogin } from '@/services/auth/hooks'

const { Title, Text, Link } = Typography

type LoginFormProps = {
  onGoogleLogin?: () => void
  onSuccess?: (data: any) => void
  redirectPath?: string
}

export default function LoginForm({
  onGoogleLogin,
  onSuccess,
  redirectPath = '/profile',
}: LoginFormProps = {}) {
  const t = useTranslations('LoginForm')
  const [form] = Form.useForm()
  const { errors, setFormErrors } = useFormErrors() as FormErrorsHook
  const { messageError } = useMessage()
  const [isFlying, setIsFlying] = useState(false)

  const { mutate: login, isLoading: loginIsLoading }: any = useLogin()

  const handleFinish = (values: LoginValuesTypes) => {
    login(values, {
      onSuccess: (
        data: Record<'data', Record<'is_need_add_info', boolean>>,
      ) => {
        setIsFlying(true)
        onSuccess?.(data)
        setTimeout(() => {
          window.location.href = redirectPath
        }, 4500)
      },
      onError: (error: any) => {
        setFormErrors(error?.data)
        if (Array.isArray(error?.data?.errors)) {
          const errors = error?.data?.errors
          errors.forEach(
            (err: { code: string; detail: string; attr: string | null }) => {
              messageError(err.detail)
            },
          )
        } else if (error?.data?.detail) {
          messageError(error?.data.detail)
        } else {
          messageError(error?.data?.message)
        }
      },
    })
  }

  const handleGoogleLogin = () => {
    onGoogleLogin?.()
  }

  const containerVariants = {
    initial: {
      scale: 1,
      y: 0,
      opacity: 1,
    },
    toRocket: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  } as const

  const backgroundVariants = {
    initial: {
      opacity: 0.1,
    },
    flying: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
      },
    },
  } as const

  const rocketVariants = {
    initial: {
      scale: 0,
      opacity: 0,
      y: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    flying: {
      y: -window.innerHeight - 200,
      transition: {
        duration: 4,
        ease: 'easeInOut',
        delay: 0.6,
      },
    },
  } as const

  const starVariants = {
    initial: {
      y: -100,
      opacity: 0,
    },
    falling: (duration: number) => ({
      y: window.innerHeight + 100,
      opacity: [0, 1, 1, 0],
      transition: {
        duration: duration,
        ease: 'easeIn',
        times: [0, 0.1, 0.8, 1],
      },
    }),
  } as any

  const stars = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    delay: 0.7 + (i % 8) * 0.35,
    left: Math.random() * 80 + 10,
    top: Math.random() * 20 + 10,
    duration: 3.5 + Math.floor(i / 8) * 0.5,
  }))

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AnimatePresence mode='wait'>
        {!isFlying ? (
          <motion.div
            key='form'
            variants={containerVariants}
            initial='initial'
            animate='initial'
            exit='toRocket'
          >
            <Card
              style={{
                width: '100%',
                maxWidth: '400px',
              }}
              styles={{
                body: {
                  padding: '32px',
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
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '24px',
                }}
              >
                <Title level={2} style={{ margin: 0, marginBottom: '8px' }}>
                  {t('welcome_back')}
                </Title>
              </div>

              <Form
                form={form}
                name='login'
                layout='vertical'
                wrapperCol={{ span: 24 }}
                initialValues={{ remember: true }}
                autoComplete='off'
                size='large'
                onFinish={handleFinish}
              >
                <Form.Item
                  label={t('email')}
                  name='email'
                  rules={[
                    {
                      required: true,
                      message: t('email_required'),
                    },
                    {
                      type: 'email',
                      message: t('email_invalid'),
                    },
                  ]}
                  validateStatus={errors.email ? 'error' : ''}
                  help={errors.email?.[0]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder={t('email_placeholder')}
                    disabled={loginIsLoading}
                  />
                </Form.Item>

                <Form.Item
                  label={t('password')}
                  name='password'
                  rules={[
                    {
                      required: true,
                      message: t('password_required'),
                    },
                  ]}
                  validateStatus={errors.password ? 'error' : ''}
                  help={errors?.password?.[0]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder={t('password_placeholder')}
                    disabled={loginIsLoading}
                  />
                </Form.Item>

                <Form.Item>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Form.Item name='remember' valuePropName='checked' noStyle>
                      <Checkbox disabled={loginIsLoading}>
                        {t('remember_me')}
                      </Checkbox>
                    </Form.Item>
                    <Link>{t('forgot_password')}</Link>
                  </div>
                </Form.Item>

                <Form.Item>
                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={loginIsLoading}
                    style={{ width: '100%', height: '40px' }}
                  >
                    🚀 {t('sign_in')}
                  </Button>
                </Form.Item>
              </Form>

              <Divider style={{ margin: '24px 0' }}>
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  {t('or_continue_with')}
                </Text>
              </Divider>

              <Space
                direction='vertical'
                style={{ width: '100%' }}
                size='middle'
              >
                <Button
                  icon={<GoogleOutlined />}
                  style={{ width: '100%', height: '40px' }}
                  onClick={handleGoogleLogin}
                  disabled={loginIsLoading}
                >
                  {t('continue_with_google')}
                </Button>
              </Space>

              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Text type='secondary'>
                  {t('no_account')} <Link href='/sign-up'>{t('sign_up')}</Link>
                </Text>
              </div>
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Space>
                  <ThemeSwitcher />
                  <LocaleSwitcher variant='compact' />
                </Space>
              </div>
            </Card>
          </motion.div>
        ) : (
          <>
            <motion.div
              key='background'
              variants={backgroundVariants}
              initial='initial'
              animate='flying'
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url(/assets/earth.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />

            {stars.map((star) => (
              <motion.div
                key={`star-${star.id}`}
                variants={starVariants}
                initial='initial'
                animate='falling'
                custom={star.duration}
                transition={{ delay: star.delay }}
                style={{
                  position: 'fixed',
                  left: `${star.left}%`,
                  top: 0,
                  fontSize: '24px',
                  zIndex: 2,
                  pointerEvents: 'none',
                }}
              >
                ⭐
              </motion.div>
            ))}

            <motion.div
              key='rocket'
              variants={rocketVariants}
              initial='initial'
              animate={['visible', 'flying']}
              style={{
                fontSize: '120px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                position: 'relative',
                zIndex: 3,
              }}
            >
              <span
                style={{
                  rotate: '-45deg',
                }}
              >
                🚀
              </span>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
