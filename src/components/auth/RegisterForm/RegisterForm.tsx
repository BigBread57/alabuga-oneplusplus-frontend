'use client'

import type { FormErrorsHook } from '@/hooks/useFormErrors'
import type { IRegister } from '@/services/auth'
import {
  CheckCircleOutlined,
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  notification,
  Result,
  Row,
  Space,
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { ThemeSwitcher } from '@/components/_base/ThemeSwitcher/ThemeSwitcher'
import { LogoSwitcher } from '@/components/_icons/logo/LogoSwitcher'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { useFormErrors } from '@/hooks/useFormErrors'
import { useRegister } from '@/services/auth/hooks'

const { Title, Text, Link } = Typography

type RegisterFormProps = {
  onGoogleRegister?: () => void
  onSuccess?: (data: any) => void
  redirectPath?: string
}

export default function RegisterForm({
  onGoogleRegister,
  onSuccess,
}: RegisterFormProps = {}) {
  const t = useTranslations('RegisterForm')
  const [form] = Form.useForm()
  const { errors } = useFormErrors() as FormErrorsHook
  const [isSuccess, setIsSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const { mutate: register, isLoading: registerIsLoading }: any = useRegister()

  const handleFinish = (values: IRegister) => {
    // Удаляем agree_terms из данных перед отправкой
    const { agree_terms, ...registerData } = values

    // Сохраняем email для отображения в Success экране
    setUserEmail(values.email)

    register(registerData, {
      onSuccess: (
        data: Record<'data', Record<'is_need_add_info', boolean>>,
      ) => {
        // Вызываем колбэк onSuccess если он передан
        onSuccess?.(data)

        // Показываем Success экран вместо notification
        setIsSuccess(true)
      },
      onError: (error: any) => {
        // setFormErrors(error?.data?.errors)

        if (error?.data?.detail) {
          notification.error({
            message: error.data.detail,
          })
        }
      },
    })
  }

  const handleGoogleRegister = () => {
    onGoogleRegister?.()
  }

  const handleSignInRedirect = () => {
    window.location.href = '/sign-in'
  }

  // Success экран
  if (isSuccess) {
    return (
      <Card
        style={{
          width: '100%',
          maxWidth: '500px',
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

        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title={t('registration_successful')}
          subTitle={
            <div style={{ textAlign: 'center' }}>
              <Text>
                {t('confirmation_email_sent')} <br />
                <Text strong>{userEmail}</Text>
              </Text>
            </div>
          }
          extra={[
            <Button
              type='primary'
              key='signin'
              onClick={handleSignInRedirect}
              style={{ width: '200px' }}
            >
              {t('sign_in')}
            </Button>,
          ]}
        />

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Space>
            <ThemeSwitcher />
            <LocaleSwitcher variant='compact' />
          </Space>
        </div>
      </Card>
    )
  }

  // Основная форма регистрации
  return (
    <Card
      style={{
        width: '100%',
        maxWidth: '500px',
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
          {t('create_account')}
        </Title>
      </div>

      <Form
        form={form}
        name='register'
        layout='vertical'
        wrapperCol={{ span: 24 }}
        initialValues={{ agree_terms: false }}
        autoComplete='off'
        size='large'
        onFinish={handleFinish}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('first_name')}
              name='first_name'
              rules={[
                {
                  required: true,
                  message: t('first_name_required'),
                },
                {
                  min: 2,
                  message: t('first_name_min_length'),
                },
              ]}
              validateStatus={errors.first_name ? 'error' : ''}
              help={errors.first_name?.[0]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={t('first_name_placeholder')}
                disabled={registerIsLoading}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('last_name')}
              name='last_name'
              rules={[
                {
                  required: true,
                  message: t('last_name_required'),
                },
                {
                  min: 2,
                  message: t('last_name_min_length'),
                },
              ]}
              validateStatus={errors.last_name ? 'error' : ''}
              help={errors.last_name?.[0]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={t('last_name_placeholder')}
                disabled={registerIsLoading}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('middle_name')}
          name='middle_name'
          validateStatus={errors.middle_name ? 'error' : ''}
          help={errors.middle_name?.[0]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('middle_name_placeholder')}
            disabled={registerIsLoading}
          />
        </Form.Item>

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
            disabled={registerIsLoading}
          />
        </Form.Item>

        <Form.Item
          label={t('phone')}
          name='phone'
          rules={[
            {
              required: true,
              message: t('phone_required'),
            },
            {
              pattern: /^\+?[1-9]\d{0,15}$/,
              message: t('phone_invalid'),
            },
          ]}
          validateStatus={errors.phone ? 'error' : ''}
          help={errors.phone?.[0]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder={'+79199697725'}
            disabled={registerIsLoading}
          />
        </Form.Item>

        <Form.Item
          label={t('password')}
          name='password1'
          rules={[
            {
              required: true,
              message: t('password_required'),
            },
            {
              min: 8,
              message: t('password_min_length'),
            },
          ]}
          validateStatus={errors.password1 ? 'error' : ''}
          help={errors.password1?.[0]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('password_placeholder')}
            disabled={registerIsLoading}
          />
        </Form.Item>

        <Form.Item
          label={t('confirm_password')}
          name='password2'
          dependencies={['password1']}
          rules={[
            {
              required: true,
              message: t('confirm_password_required'),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password1') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(t('passwords_not_match')))
              },
            }),
          ]}
          validateStatus={errors.password2 ? 'error' : ''}
          help={errors.password2?.[0]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('confirm_password_placeholder')}
            disabled={registerIsLoading}
          />
        </Form.Item>

        <Form.Item
          name='agree_terms'
          valuePropName='checked'
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error(t('agree_terms_required'))),
            },
          ]}
        >
          <Checkbox disabled={registerIsLoading}>
            {t('agree_to')}{' '}
            <Link href='/terms' target='_blank'>
              {t('terms_of_service')}
            </Link>{' '}
            {t('and')}{' '}
            <Link href='/privacy' target='_blank'>
              {t('privacy_policy')}
            </Link>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={registerIsLoading}
            style={{ width: '100%', height: '40px' }}
          >
            {t('create_account')}
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
          onClick={handleGoogleRegister}
          disabled={registerIsLoading}
        >
          {t('continue_with_google')}
        </Button>
      </Space>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Text type='secondary'>
          {t('already_have_account')}{' '}
          <Link href='/sign-in'>{t('sign_in')}</Link>
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
