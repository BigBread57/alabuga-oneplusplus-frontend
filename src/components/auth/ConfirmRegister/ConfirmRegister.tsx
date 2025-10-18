'use client'

import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LogoSwitcher } from '@/components/_icons/logo/LogoSwitcher'
import { useConfirmRegister } from '@/services/auth/hooks'

type ConfirmStatus = 'loading' | 'success' | 'error'

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.2 },
  },
}

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: { duration: 2, repeat: Infinity, ease: 'linear' },
  },
}

export default function ConfirmRegister() {
  const t = useTranslations('ConfirmRegister')
  const [status, setStatus] = useState<ConfirmStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const { mutate: confirmRegister } = useConfirmRegister()

  useEffect(() => {
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
          <motion.div
            variants={contentVariants}
            className='flex flex-col items-center gap-4'
          >
            <motion.div variants={spinnerVariants} animate='animate'>
              <Loader2 size={48} className='text-indigo-400' />
            </motion.div>
            <div>
              <h2 className='text-xl font-bold text-cyan-400'>
                {t('confirming_registration')}
              </h2>
              <p className='mt-2 text-sm text-indigo-300'>{t('please_wait')}</p>
            </div>
          </motion.div>
        )

      case 'success':
        return (
          <motion.div
            variants={contentVariants}
            className='flex flex-col items-center gap-4'
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <CheckCircle size={48} className='text-emerald-400' />
            </motion.div>
            <div>
              <h2 className='text-xl font-bold text-cyan-400'>
                {t('registration_confirmed')}
              </h2>
              <p className='mt-2 text-sm text-indigo-300'>
                {t('registration_success_message')}
              </p>
            </div>
          </motion.div>
        )

      case 'error':
        return (
          <motion.div
            variants={contentVariants}
            className='flex flex-col items-center gap-4'
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <AlertCircle size={48} className='text-red-400' />
            </motion.div>
            <div>
              <h2 className='text-xl font-bold text-cyan-400'>
                {t('confirmation_failed')}
              </h2>
              <p className='mt-2 text-sm text-indigo-300'>{errorMessage}</p>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='mx-auto my-20 w-full max-w-sm'
    >
      <div className='rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-slate-900/80 to-slate-900 p-8 backdrop-blur-xl md:p-12'>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className='mb-8 flex justify-center'
        >
          <LogoSwitcher width={200} />
        </motion.div>

        {/* Content */}
        {renderContent()}

        {/* Buttons */}
        <motion.div
          variants={contentVariants}
          className='mt-8 flex flex-col gap-3'
        >
          <Link href='/'>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='w-full rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 font-medium text-indigo-300 transition-colors hover:bg-indigo-500/20'
            >
              {t('go_to_home')}
            </motion.button>
          </Link>
          <Link href='/sign-in'>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='w-full rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-3 font-medium text-slate-900 transition-opacity hover:opacity-90'
            >
              {t('go_to_login')}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
