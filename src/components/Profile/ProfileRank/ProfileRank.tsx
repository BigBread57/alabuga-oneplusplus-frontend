'use client'

import type { FCC } from 'src/types'
import type { GameWorldProps } from '@/models/GameWorld'
import type { RankProps } from '@/models/Rank'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'

type ProfileRankProps = {
  currency?: number
  characterId?: string | number
  userName: string
  userAvatar: string | undefined
  rank: RankProps
  gameWorld?: GameWorldProps
  currentExperience?: number
  nextRank?: RankProps | null
  showProgress?: boolean
  className?: string
  email?: string
  onUpdateAvatarSuccess?: (updatedCharacter: any) => void
}

const ProfileRank: FCC<ProfileRankProps> = ({
  rank,
  currentExperience = 0,
  className,
  gameWorld,
  nextRank,
  userName,
  currency,
  email,
}) => {
  const t = useTranslations('ProfileRank')

  const progressPercent = currentExperience / (rank?.required_experience / 100)
  const experienceToNext = nextRank
    ? (rank.required_experience || 0) - currentExperience
    : 0

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.1,
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

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className={className}
      data-testid='test-ProfileRank'
    >
      {/* Профиль пользователя */}
      <motion.div
        variants={itemVariants}
        className='mb-8 flex gap-6 border-b border-indigo-500/10 pb-8'
      >
        {/* Информация персонажа */}
        <div className='flex-1 space-y-4'>
          {/* Имя */}
          <motion.div variants={itemVariants}>
            <h2 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-2xl font-bold text-transparent md:text-2xl'>
              {userName}
            </h2>
            {email
              ? (
                  <div className='flex flex-col gap-1 text-center'>
                    <p className='text-sm text-gray-400'>{email}</p>
                  </div>
                )
              : null}
          </motion.div>

          {/* Ранг */}
          <motion.div
            variants={itemVariants}
            className='flex items-center gap-4'
          >
            <div className='flex-1'>
              <div className='mb-2 flex items-center gap-3'>
                <h3
                  className='text-xl font-semibold'
                  style={{ color: rank?.color || '#00d9ff' }}
                >
                  {rank?.name}
                </h3>
                {rank?.icon && (
                  <div className='relative h-10 w-10 overflow-hidden rounded-lg border border-indigo-500/20 bg-indigo-500/10'>
                    <Image
                      src={rank.icon}
                      alt={rank.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                )}
              </div>
              {rank?.description && (
                <p className='text-sm text-gray-400'>{rank.description}</p>
              )}
            </div>
          </motion.div>

          {/* Статистика */}
          <motion.div
            variants={itemVariants}
            className='grid grid-cols-2 gap-4'
          >
            <div className='rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3'>
              <p className='mb-1 text-xs text-gray-400'>
                {t('required_experience')}
              </p>
              <p className='text-lg font-semibold text-cyan-400'>
                {rank?.required_experience?.toLocaleString()}
              </p>
            </div>

            <div className='rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3'>
              <p className='mb-1 text-xs text-gray-400'>
                {gameWorld?.currency_name?.toUpperCase()}
              </p>
              <p className='text-lg font-semibold text-cyan-400'>
                {currency?.toLocaleString()}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
      {/* Мир игры */}
      <motion.div
        variants={itemVariants}
        className='mb-8  flex  gap-6 border-b border-indigo-500/10 pb-8'
      >
        {gameWorld && (
          <motion.div
            variants={itemVariants}
            className='rounded-lg border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 p-4'
          >
            <p className='mb-2 text-xs tracking-wider text-gray-400 uppercase'>
              {t('game_world')}
            </p>
            <p className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-lg font-semibold text-transparent'>
              {gameWorld?.name}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Опыт и прогресс */}
      <motion.div variants={itemVariants} className='space-y-6'>
        {/* Текущий опыт */}
        {currentExperience > 0 && (
          <motion.div variants={itemVariants} className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-gray-300'>
                {t('current_experience')}
              </span>
              <span className='text-sm font-semibold text-cyan-400'>
                {currentExperience?.toLocaleString()}
              </span>
            </div>
            <div className='h-2 w-full overflow-hidden rounded-full border border-indigo-500/10 bg-slate-800/50'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className='h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500'
              />
            </div>
          </motion.div>
        )}

        {/* Прогресс к следующему рангу */}
        {nextRank && (
          <motion.div variants={itemVariants} className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-gray-300'>
                {t('progress_to_next_rank')}
              </span>
              <div className='flex items-center gap-2'>
                <span
                  className='rounded-full px-3 py-1 text-xs font-semibold text-white'
                  style={{
                    backgroundColor: `${nextRank?.color || '#6366f1'}20`,
                    border: `1px solid ${nextRank?.color || '#6366f1'}60`,
                    color: nextRank?.color || '#6366f1',
                  }}
                >
                  {nextRank?.name}
                </span>
              </div>
            </div>

            <div className='mb-2 space-y-1'>
              <div className='h-3 w-full overflow-hidden rounded-full border border-indigo-500/10 bg-slate-800/50'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className='relative h-full rounded-full bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400'
                >
                  {/* Shine effect */}
                  <motion.div
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent'
                  />
                </motion.div>
              </div>
              <div className='flex justify-between text-xs text-gray-400'>
                <span>{progressPercent.toFixed(1)}%</span>
                <span>
                  {experienceToNext?.toLocaleString()} {t('experience_left')}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

ProfileRank.displayName = 'ProfileRank'

export default ProfileRank
