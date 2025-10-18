'use client'

import type { LoginValuesTypes } from '@/services/auth'
import { motion } from 'framer-motion'
import { AlertCircle, Lock, LogIn, Mail, Rocket } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { LogoSwitcher } from '@/components/_icons/logo/LogoSwitcher'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { useLogin } from '@/services/auth/hooks'

type LoginFormProps = {
  onGoogleLogin?: () => void
  onSuccess?: (data: any) => void
  redirectPath?: string
}

interface FieldError {
  code: string
  detail: string
  attr: string | null
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.4 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

const errorVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
}

// Компонент летающей ракеты, всегда летит вверх
const FlyingRocket = ({
  delay,
  startX,
  startY,
  duration,
}: {
  delay: number
  startX: number
  startY: number
  duration: number
}) => {
  const endY = -100
  const randomOffsetX = (Math.random() - 0.5) * 200

  return (
    <motion.div
      initial={{ x: startX, y: startY, opacity: 1 }}
      animate={{
        x: startX + randomOffsetX,
        y: endY,
        opacity: 0,
      }}
      transition={{
        duration,
        delay,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: Math.random() * 2 + 1,
      }}
      className='pointer-events-none absolute'
    >
      <div className='flex flex-col items-center'>
        <Rocket
          style={{
            rotate: '-45deg',
          }}
          size={28}
          className='text-indigo-400 drop-shadow-lg'
        />
        <div className='h-10 w-1 bg-gradient-to-b from-orange-400 to-red-500 opacity-60 blur-sm' />
      </div>
    </motion.div>
  )
}

export default function LoginForm({
  onGoogleLogin,
  onSuccess,
  redirectPath = '/profile',
}: LoginFormProps = {}) {
  const t = useTranslations('LoginForm')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string>('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const { mutate: login, isLoading: loginIsLoading } = useLogin() as any

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!email.trim()) {
      errors.email = t('email_required')
    } else if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email)) {
      errors.email = t('email_invalid')
    }

    if (!password.trim()) {
      errors.password = t('password_required')
    }

    return errors
  }

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')
    setFieldErrors({})

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      return
    }

    const values: LoginValuesTypes = {
      email,
      password,
    }

    login(values, {
      onSuccess: (
        data: Record<'data', Record<'is_need_add_info', boolean>>,
      ) => {
        setIsAuthenticated(true)

        setTimeout(() => {
          onSuccess?.(data)
          window.location.href = redirectPath
        }, 1500)
      },
      onError: (error: any) => {
        const newFieldErrors: Record<string, string> = {}

        if (Array.isArray(error?.data?.errors)) {
          const errors: FieldError[] = error.data.errors
          errors.forEach((err: FieldError) => {
            if (err.attr) {
              newFieldErrors[err.attr] = err.detail
            }
          })
          setFieldErrors(newFieldErrors)
        } else if (error?.data?.detail) {
          setGeneralError(error.data.detail)
        } else if (error?.data?.message) {
          setGeneralError(error.data.message)
        } else {
          setGeneralError('Ошибка при входе')
        }
      },
    })
  }

  const handleGoogleLogin = () => {
    setGeneralError('')
    setFieldErrors({})
    onGoogleLogin?.()
  }

  const getFieldError = (fieldName: string) => fieldErrors[fieldName]

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-8'>
      {/* Летающие ракеты */}
      <div className='pointer-events-none fixed inset-0 overflow-hidden'>
        {Array.from({ length: 12 }).map((_, i) => (
          <FlyingRocket
            key={`flying-rocket-${new Date().getTime()}`}
            delay={i * 0.3}
            startX={Math.random() * window.innerWidth}
            startY={window.innerHeight + Math.random() * 100}
            duration={8 + Math.random() * 6}
          />
        ))}
      </div>

      {/* Фоновые эффекты */}
      <div className='fixed inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500 opacity-10 mix-blend-screen blur-3xl filter' />
        <div className='absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-cyan-400 opacity-10 mix-blend-screen blur-3xl filter' />
      </div>

      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate={isAuthenticated ? 'exit' : 'visible'}
        className='relative z-10 w-full max-w-md'
      >
        {/* Основная карточка */}
        <div className='rounded-2xl border border-indigo-500/20 bg-transparent p-8 shadow-2xl backdrop-blur-xs md:p-10'>
          {/* Заголовок */}
          <div className='mb-6 flex justify-center'>
            <LogoSwitcher width={300} />
          </div>
          <motion.div variants={itemVariants} className='mb-8 text-center'>
            <h1 className='mb-2 bg-gradient-to-r from-cyan-400 via-pink-400 to-indigo-400 bg-clip-text text-3xl font-bold text-transparent'>
              {t('welcome_back')}
            </h1>
            <p className='text-sm text-gray-300'>в космическое путешествие</p>
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
                <p className='text-sm font-medium text-red-300'>'Ошибка'</p>
                <p className='mt-1 text-sm text-red-200/80'>{generalError}</p>
              </div>
            </motion.div>
          )}

          {/* Форма */}
          <form onSubmit={handleFinish} className='space-y-6'>
            {/* Email поле */}
            <motion.div variants={itemVariants}>
              <label className='mb-2 block text-sm font-medium text-gray-300'>
                {t('email')}
              </label>
              <div
                className={`group relative transition-all duration-300 ${
                  focusedField === 'email' ? 'rounded-lg ring-2' : ''
                } ${
                  getFieldError('email')
                    ? 'rounded-lg ring-2 ring-red-500'
                    : 'ring-indigo-500'
                }`}
              >
                <div
                  className={`absolute top-0 left-0 h-full w-1 rounded-l-lg ${
                    getFieldError('email')
                      ? 'bg-gradient-to-b from-red-500 to-red-400'
                      : 'bg-gradient-to-b from-indigo-500 to-cyan-400'
                  }`}
                />
                <div className='relative flex items-center'>
                  <Mail
                    className={`absolute left-4 h-5 w-5 ${
                      getFieldError('email') ? 'text-red-400' : 'text-cyan-400'
                    }`}
                  />
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (getFieldError('email')) {
                        setFieldErrors((prev) => {
                          const updated = { ...prev }
                          delete updated.email
                          return updated
                        })
                      }
                    }}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={t('email_placeholder')}
                    disabled={loginIsLoading}
                    className={`w-full rounded-lg border bg-slate-800/50 py-3 pr-4 pl-12 text-white placeholder-gray-500 transition-all duration-300 focus:outline-none disabled:opacity-50 ${
                      getFieldError('email')
                        ? 'border-red-500/60 focus:border-red-500 focus:bg-slate-800/80'
                        : 'border-indigo-500/20 focus:border-indigo-500/60 focus:bg-slate-800/80'
                    }`}
                  />
                </div>
              </div>
              {getFieldError('email') && (
                <motion.div
                  variants={errorVariants}
                  initial='hidden'
                  animate='visible'
                  className='mt-2 flex items-center gap-1'
                >
                  <AlertCircle
                    size={16}
                    className='flex-shrink-0 text-red-400'
                  />
                  <p className='text-xs text-red-400'>
                    {getFieldError('email')}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Password поле */}
            <motion.div variants={itemVariants}>
              <label className='mb-2 block text-sm font-medium text-gray-300'>
                {t('password')}
              </label>
              <div
                className={`group relative transition-all duration-300 ${
                  focusedField === 'password' ? 'rounded-lg ring-2' : ''
                } ${
                  getFieldError('password')
                    ? 'rounded-lg ring-2 ring-red-500'
                    : 'ring-cyan-400'
                }`}
              >
                <div
                  className={`absolute top-0 left-0 h-full w-1 rounded-l-lg ${
                    getFieldError('password')
                      ? 'bg-gradient-to-b from-red-500 to-red-400'
                      : 'bg-gradient-to-b from-cyan-400 to-pink-400'
                  }`}
                />
                <div className='relative flex items-center'>
                  <Lock
                    className={`absolute left-4 h-5 w-5 ${
                      getFieldError('password')
                        ? 'text-red-400'
                        : 'text-cyan-400'
                    }`}
                  />
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (getFieldError('password')) {
                        setFieldErrors((prev) => {
                          const updated = { ...prev }
                          delete updated.password
                          return updated
                        })
                      }
                    }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={t('password_placeholder')}
                    disabled={loginIsLoading}
                    className={`w-full rounded-lg border bg-slate-800/50 py-3 pr-4 pl-12 text-white placeholder-gray-500 transition-all duration-300 focus:outline-none disabled:opacity-50 ${
                      getFieldError('password')
                        ? 'border-red-500/60 focus:border-red-500 focus:bg-slate-800/80'
                        : 'border-cyan-400/20 focus:border-cyan-400/60 focus:bg-slate-800/80'
                    }`}
                  />
                </div>
              </div>
              {getFieldError('password') && (
                <motion.div
                  variants={errorVariants}
                  initial='hidden'
                  animate='visible'
                  className='mt-2 flex items-center gap-1'
                >
                  <AlertCircle
                    size={16}
                    className='flex-shrink-0 text-red-400'
                  />
                  <p className='text-xs text-red-400'>
                    {getFieldError('password')}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Remember me & Forgot password */}
            <motion.div
              variants={itemVariants}
              className='flex items-center justify-between'
            >
              <label className='group flex cursor-pointer items-center gap-2'>
                <input
                  type='checkbox'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loginIsLoading}
                  className='h-4 w-4 cursor-pointer rounded border-indigo-500/40 bg-slate-800/50 accent-cyan-400'
                />
                <span className='text-sm text-gray-400 transition-colors group-hover:text-gray-300'>
                  {t('remember_me')}
                </span>
              </label>
              <Link
                href='/forgot-password'
                className='text-sm text-cyan-400 transition-colors duration-300 hover:text-indigo-400 hover:underline'
              >
                {t('forgot_password')}
              </Link>
            </motion.div>

            {/* Submit кнопка */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={loginIsLoading}
              className='group relative w-full overflow-hidden rounded-lg px-4 py-3 font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400 opacity-100 transition-opacity group-hover:opacity-80' />
              <div className='absolute inset-0 bg-slate-900 opacity-0 transition-opacity group-hover:opacity-5' />
              <div className='relative flex items-center justify-center gap-2'>
                {loginIsLoading
                  ? (
                      <>
                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                        {t('sign_in') || 'Вход...'}
                      </>
                    )
                  : (
                      <>
                        <LogIn size={18} />
                        {t('sign_in')}
                      </>
                    )}
              </div>
            </motion.button>
          </form>

          {/* Разделитель */}
          <motion.div variants={itemVariants} className='my-8'>
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
            onClick={handleGoogleLogin}
            disabled={loginIsLoading}
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

          {/* Ссылка на регистрацию */}
          <motion.div variants={itemVariants} className='mt-8 text-center'>
            <p className='text-sm text-gray-400'>
              {t('no_account')}{' '}
              <Link
                href='/sign-up'
                className='font-semibold text-cyan-400 transition-colors duration-300 hover:text-indigo-400 hover:underline'
              >
                {t('sign_up')}
              </Link>
            </p>
          </motion.div>

          {/* Переключатели языка */}
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
