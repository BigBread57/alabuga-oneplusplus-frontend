'use client'

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
import { ThemeSwitcher } from '@/components/_base/ThemeSwitcher/ThemeSwitcher'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

const { Title, Text, Link } = Typography

type FieldType = {
  email: string
  password: string
  remember?: boolean
}

type LoginFormProps = {
  onSubmit?: (values: FieldType) => void
  onGoogleLogin?: () => void
  loading?: boolean
}

export default function LoginForm({
  onSubmit,
  onGoogleLogin,
  loading = false,
}: LoginFormProps = {}) {
  const t = useTranslations('LoginForm')
  const [form] = Form.useForm()

  const handleFinish = (values: FieldType) => {
    onSubmit?.(values)
  }

  const handleGoogleLogin = () => {
    onGoogleLogin?.()
  }

  return (
    <Card
      style={{
        width: '100%',
        maxWidth: '400px',
        boxShadow:
          '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      }}
      bodyStyle={{ padding: '32px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={2} style={{ margin: 0, marginBottom: '8px' }}>
          {t('welcome_back')}
        </Title>
        <Text type='secondary'>{t('sign_in_description')}</Text>
      </div>

      <Form
        form={form}
        name='login'
        layout='vertical'
        onFinish={handleFinish}
        autoComplete='off'
        size='large'
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
        >
          <Input
            prefix={<MailOutlined />}
            placeholder={t('email_placeholder')}
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
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('password_placeholder')}
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
              <Checkbox>{t('remember_me')}</Checkbox>
            </Form.Item>
            <Link>{t('forgot_password')}</Link>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
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
