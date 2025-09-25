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
  notification,
  Space,
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import { ThemeSwitcher } from '@/components/_base/ThemeSwitcher/ThemeSwitcher'
import { LogoSwitcher } from '@/components/_icons/logo/LogoSwitcher'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { useFormErrors } from '@/hooks/useFormErrors'
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

  const { mutate: login, isLoading: loginIsLoading }: any = useLogin()

  const handleFinish = (values: LoginValuesTypes) => {
    login(values, {
      onSuccess: (
        data: Record<'data', Record<'is_need_add_info', boolean>>,
      ) => {
        // Вызываем колбэк onSuccess если он передан
        onSuccess?.(data)

        window.location.href = redirectPath
      },
      onError: (error: any) => {
        setFormErrors(error?.data)
        if (error?.data?.detail) {
          notification.error({
            message: error.data.detail,
          })
        }
      },
    })
  }

  const handleGoogleLogin = () => {
    onGoogleLogin?.()
  }

  return (
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
              <Checkbox disabled={loginIsLoading}>{t('remember_me')}</Checkbox>
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
            {t('sign_in')}
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: '24px 0' }}>
        <Text type='secondary' style={{ fontSize: '12px' }}>
          {t('or_continue_with')}
        </Text>
      </Divider>

      <Space direction='vertical' style={{ width: '100%' }} size='middle'>
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
          {t('no_account')} <Link>{t('sign_up')}</Link>
        </Text>
      </div>
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Space>
          <ThemeSwitcher />
          <LocaleSwitcher variant='compact' />
        </Space>
      </div>
    </Card>
  )
}
