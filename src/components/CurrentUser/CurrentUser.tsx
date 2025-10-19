'use client'

import type { UserProps } from '@/models'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, LogOut, Satellite, User, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Artifacts } from '@/components/Profile/Artifacts'
import { Competencies } from '@/components/Profile/Competencies'
import { ProfilePhoto } from '@/components/Profile/ProfilePhoto'
import { ProfileRank } from '@/components/Profile/ProfileRank'
import { useTour } from '@/components/Tour/useTour'
import { Character } from '@/models/Character'
import { useLogout } from '@/services/auth/hooks'
import { useFetchExtraAction } from '@/services/base/hooks'

type CurrentUserProps = {
  currentUser: UserProps
}

const MODEL = Character

const ModalContent = ({
  onLogout,
  onClose,
}: {
  onLogout: () => void
  currentUser: UserProps
  onClose: () => void
}) => {
  const t = useTranslations('ProfileCard')
  const { profileSectionRef } = useTour()
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.25, ease: 'easeOut' },
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
  } as const

  const {
    data,
    isLoading,
    refetch,
  }: {
    data: any
    isLoading: boolean
    refetch: () => void
  } = useFetchExtraAction({
    extraUrl: MODEL.actualForUserUrl(),
    qKey: 'CharacterActualForUser',
  })

  const isEmpty = !data?.data && !isLoading

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
        onClick={onClose}
        className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 p-1 backdrop-blur-sm'
      >
        <motion.div
          variants={modalVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          onClick={(e) => e.stopPropagation()}
          className='relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-900/90 shadow-2xl backdrop-blur-xl'
        >
          {/* Кнопка закрытия */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='absolute top-3 right-3 z-10 p-1.5 text-gray-400 transition-colors hover:text-cyan-400'
          >
            <X size={18} />
          </motion.button>

          {/* Состояния загрузки */}
          {isLoading || isEmpty ? (
            <div className='flex flex-col items-center justify-center py-10'>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: 'linear',
                }}
              >
                <Loader2 size={36} className='text-cyan-400' />
              </motion.div>
              <p className='mt-4 text-sm text-gray-400'>{t('loading')}</p>
            </div>
          ) : (
            <div className='flex h-full flex-col overflow-hidden px-2 pt-10 md:px-4'>
              {/* Прокручиваемая область */}
              <div className='w-full flex-1 overflow-y-auto px-2 py-6'>
                <div className='flex w-full flex-col items-center gap-6'>
                  <div
                    className='gap-6 flex w-full flex-col items-center'
                    ref={profileSectionRef}
                  >
                    <ProfilePhoto
                      characterId={data?.data?.id}
                      username={
                        data?.data?.user?.full_name ||
                        data?.data?.user?.username
                      }
                      avatar={data?.data?.avatar}
                      editable
                      onSuccess={refetch}
                    />
                    <div className='w-full'>
                      <ProfileRank
                        characterId={data?.data?.id}
                        userName={
                          data?.data?.user?.full_name ||
                          data?.data?.user?.username
                        }
                        rank={data?.data?.character_rank?.rank || null}
                        nextRank={data?.data?.character_rank?.next_rank || null}
                        currency={data?.data?.currency}
                        gameWorld={data?.data?.game_world}
                        email={data?.data?.user?.email || null}
                        showProgress
                        currentExperience={
                          data?.data?.character_rank?.experience
                        }
                        onUpdateAvatarSuccess={refetch}
                      />
                    </div>
                  </div>
                  {/* Artifacts с прокруткой */}
                  <div className='max-h-64 w-full rounded-lg border border-indigo-500/20 bg-slate-800/50 p-4'>
                    <p className='text-xs tracking-wider text-gray-500 uppercase'>
                      {t('artifacts')}
                    </p>
                    <Artifacts />
                  </div>
                  {/* Artifacts с прокруткой */}
                  <div className='max-h-64 w-full rounded-lg border border-indigo-500/20 bg-slate-800/50 p-4'>
                    {/* Секция компетенций */}
                    <motion.div className='w-full'>
                      <p className='text-xs tracking-wider text-gray-500 uppercase'>
                        {t('competencies')}
                      </p>
                      <Competencies />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Кнопка logout (фиксирована внизу) */}
              <div className='flex-shrink-0 border-t border-indigo-500/20 bg-slate-900/90 p-6'>
                <motion.button
                  onClick={() => {
                    onClose()
                    onLogout()
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400 px-4 py-2 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50'
                >
                  <LogOut size={16} />
                  {t('logout')}
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export interface CurrentUserHandle {
  open: () => void
  close: () => void
}

const CurrentUserComponent = React.forwardRef<
  CurrentUserHandle,
  CurrentUserProps
>(({ currentUser }, ref) => {
  const { mutate: logout } = useLogout() as any
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { currentUserRef } = useTour()
  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setIsMounted(true)
  }, [])

  const handleLogout = useCallback(() => {
    logout(
      {},
      {
        onSuccess: () => {
          window.location.reload()
        },
      },
    )
  }, [logout])

  // Закрытие по ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Expose методы через ref
  React.useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [],
  )

  const modalRoot =
    typeof document !== 'undefined'
      ? document.getElementById('modal-root')
      : null

  return (
    <>
      <motion.button
        ref={currentUserRef as any}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='relative rounded-lg p-2 text-cyan-400 transition-colors duration-200 hover:bg-indigo-500/10'
        aria-label='User profile'
      >
        <User size={24} />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className='absolute inset-0 flex items-center justify-center'
        >
          <Satellite
            size={12}
            className='absolute text-yellow-400'
            style={{ top: '-1px', right: '-1px' }}
          />
        </motion.div>
      </motion.button>

      {isMounted &&
        modalRoot &&
        isOpen &&
        createPortal(
          <ModalContent
            onLogout={handleLogout}
            currentUser={currentUser}
            onClose={() => setIsOpen(false)}
          />,
          modalRoot,
        )}
    </>
  )
})

CurrentUserComponent.displayName = 'CurrentUser'

export default CurrentUserComponent
