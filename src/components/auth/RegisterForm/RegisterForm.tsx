'use client'

import type { IRegister } from '@/services/auth'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  Lock,
  LogIn,
  Mail,
  Phone,
  User,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { ThemeSwitcher } from '@/components/_base/ThemeSwitcher/ThemeSwitcher'
import { LogoSwitcher } from '@/components/_icons/logo/LogoSwitcher'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { useRegister } from '@/services/auth/hooks'

type RegisterFormProps = {
  onGoogleRegister?: () => void
  onSuccess?: (data: any) => void
  redirectPath?: string
}

interface FieldError {
  code: string
  detail: string
  attr: string | null
}

// Анимационные варианты
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

const errorVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
}

// Компонент инпута
const FormInput = ({
  label,
  placeholder,
  type = 'text',
  icon: Icon,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  disabled,
  required = true,
}: {
  label: string
  placeholder: string
  type?: string
  icon?: any
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus: () => void
  onBlur: () => void
  error?: string
  disabled: boolean
  required?: boolean
}) => (
  <motion.div variants={itemVariants}>
    <label className='mb-2 block text-sm font-medium text-gray-300'>
      {label}{' '}
      {!required && <span className='text-gray-500'>(опционально)</span>}
    </label>
    <div className='relative flex items-center'>
      {Icon && (
        <Icon
          className={`absolute left-4 h-4 w-4 ${
            error ? 'text-red-400' : 'text-cyan-400'
          }`}
        />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3'} rounded-lg border bg-slate-800/50 py-2 pr-3 text-sm text-white placeholder-gray-500 transition-all duration-300 focus:outline-none disabled:opacity-50 ${
          error
            ? 'border-red-500/60 focus:border-red-500 focus:bg-slate-800/80'
            : 'border-indigo-500/20 focus:border-indigo-500/60 focus:bg-slate-800/80'
        }`}
      />
    </div>
    {error && (
      <motion.p
        variants={errorVariants}
        initial='hidden'
        animate='visible'
        className='mt-1 flex items-center gap-1 text-xs text-red-400'
      >
        <AlertCircle size={12} />
        {error}
      </motion.p>
    )}
  </motion.div>
)

// Основной компонент
export default function RegisterForm({
  onGoogleRegister,
  onSuccess,
  redirectPath = '/sign-in',
}: RegisterFormProps = {}) {
  const t = useTranslations('RegisterForm')

  // State для формы
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  // State для ошибок и статуса
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string>('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  // Хуки
  const { mutate: register, isLoading: registerIsLoading }
    = useRegister() as any

  // Валидация формы
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!firstName.trim()) {
      errors.first_name = t('first_name_required')
    } else if (firstName.trim().length < 2) {
      errors.first_name = t('first_name_min_length')
    }

    if (!lastName.trim()) {
      errors.last_name = t('last_name_required')
    } else if (lastName.trim().length < 2) {
      errors.last_name = t('last_name_min_length')
    }

    if (!email.trim()) {
      errors.email = t('email_required')
    } else if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email)) {
      errors.email = t('email_invalid')
    }

    if (!phone.trim()) {
      errors.phone = t('phone_required')
    } else if (!/^\+?[1-9]\d{0,15}$/.test(phone)) {
      errors.phone = t('phone_invalid')
    }

    if (!password1.trim()) {
      errors.password1 = t('password_required')
    } else if (password1.length < 8) {
      errors.password1 = t('password_min_length')
    }

    if (!password2.trim()) {
      errors.password2 = t('confirm_password_required')
    } else if (password1 !== password2) {
      errors.password2 = t('passwords_not_match')
    }

    if (!agreeTerms) {
      errors.agree_terms = t('agree_terms_required')
    }

    return errors
  }

  // Очистка ошибки поля при редактировании
  const clearFieldError = (fieldName: string) => {
    setFieldErrors((prev) => {
      const updated = { ...prev }
      delete updated[fieldName]
      return updated
    })
  }

  // Обработка отправки формы
  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')
    setFieldErrors({})

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      return
    }

    setUserEmail(email)

    const registerData: IRegister = {
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName || undefined,
      email,
      phone,
      password1,
      password2,
    }

    register(registerData, {
      onSuccess: (data: any) => {
        onSuccess?.(data)
        setIsSuccess(true)
      },
      onError: (error: any) => {
        if (Array.isArray(error?.data?.errors)) {
          const newFieldErrors: Record<string, string> = {}
          error.data.errors.forEach((err: FieldError) => {
            if (err.attr) {
              newFieldErrors[err.attr] = err.detail
            }
          })
          setFieldErrors(newFieldErrors)
        } else if (error?.data?.detail) {
          setGeneralError(error.data.detail)
        } else {
          setGeneralError(t('error_unknown') || 'Ошибка при регистрации')
        }
      },
    })
  }

  // Success экран
  if (isSuccess) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-8'>
        <div className='fixed inset-0 -z-10 overflow-hidden'>
          <div className='absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500 opacity-10 mix-blend-screen blur-3xl' />
          <div className='absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-cyan-400 opacity-10 mix-blend-screen blur-3xl' />
        </div>

        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='w-full max-w-md'
        >
          <div className='rounded-2xl border border-indigo-500/20 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl md:p-10'>
            {/* Логотип */}
            <motion.div variants={itemVariants} className='flex justify-center'>
              <LogoSwitcher width={10} height={220} />
            </motion.div>

            {/* Success иконка */}
            <motion.div
              variants={itemVariants}
              className='mb-6 flex justify-center'
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className='rounded-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 p-4'
              >
                <CheckCircle2 size={48} className='text-green-400' />
              </motion.div>
            </motion.div>

            {/* Заголовок */}
            <motion.div variants={itemVariants} className='mb-6 text-center'>
              <h1 className='mb-2 bg-gradient-to-r from-cyan-400 via-pink-400 to-indigo-400 bg-clip-text text-2xl font-bold text-transparent'>
                {t('registration_successful')}
              </h1>
              <p className='text-sm text-gray-300'>
                {t('confirmation_email_sent')}
                <br />
                <span className='font-semibold text-cyan-400'>{userEmail}</span>
              </p>
            </motion.div>

            {/* Кнопка */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => (window.location.href = redirectPath)}
              className='group relative mb-6 w-full overflow-hidden rounded-lg px-4 py-3 font-semibold text-white transition-all duration-300'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400 opacity-100 transition-opacity group-hover:opacity-80' />
              <div className='relative flex items-center justify-center gap-2'>
                <LogIn size={18} />
                {t('sign_in')}
              </div>
            </motion.button>

            {/* Переключатели */}
            <motion.div
              variants={itemVariants}
              className='flex items-center justify-center gap-4 border-t border-indigo-500/10 pt-6'
            >
              <ThemeSwitcher />
              <LocaleSwitcher variant='compact' />
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Основная форма регистрации
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-8'>
      <div className='fixed inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500 opacity-10 mix-blend-screen blur-3xl' />
        <div className='absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-cyan-400 opacity-10 mix-blend-screen blur-3xl' />
      </div>

      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='w-full max-w-md'
      >
        <div className='rounded-2xl border border-indigo-500/20 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl md:p-10'>
          {/* Логотип */}
          <motion.div
            variants={itemVariants}
            className='mb-8 flex justify-center'
          >
            <LogoSwitcher width={220} height={120} />
          </motion.div>

          {/* Заголовок */}
          <motion.div variants={itemVariants} className='mb-8 text-center'>
            <h1 className='mb-2 bg-gradient-to-r from-cyan-400 via-pink-400 to-indigo-400 bg-clip-text text-3xl font-bold text-transparent'>
              {t('create_account')}
            </h1>
            <p className='text-sm text-gray-300'>
              Присоединяйтесь к космическому обществу!
            </p>
          </motion.div>

          {/* Общая ошибка */}
          {generalError && (
            <motion.div
              variants={errorVariants}
              initial='hidden'
              animate='visible'
              className='mb-6 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4'
            >
              <AlertCircle
                size={20}
                className='mt-0.5 flex-shrink-0 text-red-400'
              />
              <div>
                <p className='text-sm font-medium text-red-300'>Ошибка</p>
                <p className='mt-1 text-sm text-red-200/80'>{generalError}</p>
              </div>
            </motion.div>
          )}

          {/* Форма */}
          <form onSubmit={handleFinish} className='space-y-4'>
            {/* Имя и Фамилия */}
            <div className='grid grid-cols-2 gap-3'>
              <FormInput
                label={t('first_name')}
                placeholder={t('first_name_placeholder')}
                icon={User}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                  clearFieldError('first_name')
                }}
                onFocus={() => {}}
                onBlur={() => {}}
                error={fieldErrors.first_name}
                disabled={registerIsLoading}
              />
              <FormInput
                label={t('last_name')}
                placeholder={t('last_name_placeholder')}
                icon={User}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                  clearFieldError('last_name')
                }}
                onFocus={() => {}}
                onBlur={() => {}}
                error={fieldErrors.last_name}
                disabled={registerIsLoading}
              />
            </div>

            {/* Отчество */}
            <FormInput
              label={t('middle_name')}
              placeholder={t('middle_name_placeholder')}
              icon={User}
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              onFocus={() => {}}
              onBlur={() => {}}
              error={fieldErrors.middle_name}
              disabled={registerIsLoading}
              required={false}
            />

            {/* Email */}
            <FormInput
              label={t('email')}
              placeholder={t('email_placeholder')}
              type='email'
              icon={Mail}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearFieldError('email')
              }}
              onFocus={() => {}}
              onBlur={() => {}}
              error={fieldErrors.email}
              disabled={registerIsLoading}
            />

            {/* Телефон */}
            <FormInput
              label={t('phone')}
              placeholder='+7 (999) 999-99-99'
              type='tel'
              icon={Phone}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                clearFieldError('phone')
              }}
              onFocus={() => {}}
              onBlur={() => {}}
              error={fieldErrors.phone}
              disabled={registerIsLoading}
            />

            {/* Пароль */}
            <FormInput
              label={t('password')}
              placeholder={t('password_placeholder')}
              type='password'
              icon={Lock}
              value={password1}
              onChange={(e) => {
                setPassword1(e.target.value)
                clearFieldError('password1')
              }}
              onFocus={() => {}}
              onBlur={() => {}}
              error={fieldErrors.password1}
              disabled={registerIsLoading}
            />

            {/* Подтверждение пароля */}
            <FormInput
              label={t('confirm_password')}
              placeholder={t('confirm_password_placeholder')}
              type='password'
              icon={Lock}
              value={password2}
              onChange={(e) => {
                setPassword2(e.target.value)
                clearFieldError('password2')
              }}
              onFocus={() => {}}
              onBlur={() => {}}
              error={fieldErrors.password2}
              disabled={registerIsLoading}
            />

            {/* Согласие */}
            <motion.div variants={itemVariants}>
              <label className='group flex cursor-pointer items-start gap-3'>
                <input
                  type='checkbox'
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked)
                    clearFieldError('agree_terms')
                  }}
                  disabled={registerIsLoading}
                  className={`mt-1 h-4 w-4 cursor-pointer rounded border-indigo-500/40 bg-slate-800/50 accent-cyan-400 ${
                    fieldErrors.agree_terms ? 'border-red-500/60' : ''
                  }`}
                />
                <span className='text-xs text-gray-400 transition-colors group-hover:text-gray-300'>
                  {t('agree_to')}{' '}
                  <Link
                    href='/terms'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-cyan-400 hover:text-indigo-400'
                  >
                    {t('terms_of_service')}
                  </Link>{' '}
                  {t('and')}{' '}
                  <Link
                    href='/privacy'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-cyan-400 hover:text-indigo-400'
                  >
                    {t('privacy_policy')}
                  </Link>
                </span>
              </label>
              {fieldErrors.agree_terms && (
                <motion.p
                  variants={errorVariants}
                  initial='hidden'
                  animate='visible'
                  className='mt-2 flex items-center gap-1 text-xs text-red-400'
                >
                  <AlertCircle size={12} />
                  {fieldErrors.agree_terms}
                </motion.p>
              )}
            </motion.div>

            {/* Кнопка отправки */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={registerIsLoading}
              className='group relative mt-6 w-full overflow-hidden rounded-lg px-4 py-3 font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400 opacity-100 transition-opacity group-hover:opacity-80' />
              <div className='absolute inset-0 bg-slate-900 opacity-0 transition-opacity group-hover:opacity-5' />
              <div className='relative flex items-center justify-center gap-2'>
                {registerIsLoading
                  ? (
                      <>
                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                        {t('create_account')}
                      </>
                    )
                  : (
                      <>
                        <User size={18} />
                        {t('create_account')}
                      </>
                    )}
              </div>
            </motion.button>
          </form>

          {/* Разделитель */}
          <motion.div variants={itemVariants} className='my-6'>
            <div className='relative flex items-center'>
              <div className='flex-grow border-t border-indigo-500/20' />
              <span className='px-4 text-xs text-gray-500'>
                {t('or_continue_with')}
              </span>
              <div className='flex-grow border-t border-indigo-500/20' />
            </div>
          </motion.div>

          {/* Google кнопка */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='button'
            onClick={onGoogleRegister}
            disabled={registerIsLoading}
            className='w-full rounded-lg border border-cyan-400/30 px-4 py-3 font-medium text-white transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-400/5 disabled:opacity-50'
          >
            <div className='flex items-center justify-center gap-2'>
              <svg className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
              </svg>
              {t('continue_with_google')}
            </div>
          </motion.button>

          {/* Ссылка на вход */}
          <motion.div variants={itemVariants} className='mt-8 text-center'>
            <p className='text-sm text-gray-400'>
              {t('already_have_account')}{' '}
              <Link
                href='/sign-in'
                className='font-semibold text-cyan-400 transition-colors duration-300 hover:text-indigo-400 hover:underline'
              >
                {t('sign_in')}
              </Link>
            </p>
          </motion.div>

          {/* Переключатели */}
          <motion.div
            variants={itemVariants}
            className='mt-8 flex items-center justify-center gap-4 border-t border-indigo-500/10 pt-6'
          >
            <LocaleSwitcher variant='compact' />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
