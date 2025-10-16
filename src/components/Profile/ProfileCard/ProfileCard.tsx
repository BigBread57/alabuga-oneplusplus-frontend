'use client'

import type { CharacterProps } from '@/models/Character'
import type { GameWorldProps } from '@/models/GameWorld'
import { motion } from 'framer-motion'
import { HelpCircle, Loader } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { Artifacts } from '@/components/Profile/Artifacts'
import { Competencies } from '@/components/Profile/Competencies'
import { ProfileRank } from '@/components/Profile/ProfileRank'
import { ProfileTour } from '@/components/Tour/ProfileTour/ProfileTour'
import { useProfileTour } from '@/components/Tour/ProfileTour/useProfileTour'
import { useTour } from '@/components/Tour/useTour'

type ProfileCardProps = {
  userName: string
  userAvatar?: string
  character: CharacterProps
  showProgress?: boolean
  gameWorld?: GameWorldProps
  isLoading?: boolean
  onUpdateAvatarSuccess?: (updatedCharacter: any) => void
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  userName,
  userAvatar,
  character,
  gameWorld,
  isLoading = false,
  onUpdateAvatarSuccess,
}) => {
  const t = useTranslations('ProfileCard')
  const {
    profileSectionRef,
    artifactsSectionRef,
    competenciesSectionRef,
    steps,
  } = useTour()

  const {
    isModalOpen,
    tourOpen,
    currentStep,
    handleStartTour,
    handleSkipTour,
    handleCloseTour,
    handleStepChange,
  } = useProfileTour()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='w-full'
    >
      {/* Лоадер */}
      {isLoading && (
        <div className='absolute inset-0 z-40 flex items-center justify-center rounded-2xl bg-slate-900/50 backdrop-blur-sm'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Loader size={40} className='text-cyan-400' />
          </motion.div>
        </div>
      )}

      {/* Карточка профиля */}
      <div className='overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-900/60 shadow-2xl backdrop-blur-xl'>
        {/* Заголовок */}
        <div className='flex items-center justify-between border-b border-indigo-500/10 px-6 py-6 md:px-8'>
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-xl font-bold text-transparent md:text-2xl'
          >
            {t('profile').toUpperCase()}
          </motion.h2>

          {/* Кнопка тура */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleStartTour}
            className='rounded-lg p-2 text-cyan-400 transition-all duration-200 hover:bg-indigo-500/10 hover:text-indigo-400'
            title={t('start_tour')}
          >
            <HelpCircle size={24} />
          </motion.button>
        </div>

        {/* Контент */}
        <div className='max-h-[calc(100vh-200px)] space-y-8 overflow-y-auto p-6 md:p-8'>
          {/* Секция профиля */}
          <motion.div
            ref={profileSectionRef}
            variants={sectionVariants}
            className='w-full'
          >
            <ProfileRank
              characterId={character?.id}
              userName={userName}
              userAvatar={userAvatar}
              rank={character?.character_rank?.rank}
              nextRank={character?.character_rank?.next_rank || null}
              currency={character?.currency}
              gameWorld={gameWorld}
              showProgress
              currentExperience={character?.character_rank?.experience}
              onUpdateAvatarSuccess={onUpdateAvatarSuccess}
            />
          </motion.div>

          {/* Разделитель */}
          <motion.div
            variants={sectionVariants}
            className='h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent'
          />

          {/* Секция артефактов */}
          <motion.div
            ref={artifactsSectionRef}
            variants={sectionVariants}
            className='w-full'
          >
            <motion.h3
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className='mb-4 text-lg font-semibold tracking-wider text-gray-300 uppercase'
            >
              {t('artifacts')}
            </motion.h3>
            <Artifacts />
          </motion.div>

          {/* Разделитель */}
          <motion.div
            variants={sectionVariants}
            className='h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent'
          />

          {/* Секция компетенций */}
          <motion.div
            ref={competenciesSectionRef}
            variants={sectionVariants}
            className='w-full'
          >
            <motion.h3
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className='mb-4 text-lg font-semibold tracking-wider text-gray-300 uppercase'
            >
              {t('competencies')}
            </motion.h3>
            <Competencies />
          </motion.div>
        </div>
      </div>

      {/* Тур */}
      <ProfileTour
        isModalOpen={isModalOpen}
        tourOpen={tourOpen}
        steps={steps}
        currentStep={currentStep}
        onStartTour={handleStartTour}
        onSkipTour={handleSkipTour}
        onCloseTour={handleCloseTour}
        onStepChange={handleStepChange}
      />
    </motion.div>
  )
}

ProfileCard.displayName = 'ProfileCard'

export default ProfileCard
