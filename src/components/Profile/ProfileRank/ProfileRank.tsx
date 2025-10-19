'use client'

import type { FCC } from 'src/types'
import type { GameWorldProps } from '@/models/GameWorld'
import type { RankProps } from '@/models/Rank'
import { motion } from 'framer-motion'
import { Coins, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'

type ProfileRankProps = {
  currency?: number
  characterId?: string | number
  userName: string
  rank: RankProps
  gameWorld?: GameWorldProps
  currentExperience?: number
  nextRank: RankProps | null
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

  const progressPercent =
    currentExperience / ((nextRank?.required_experience || 0) / 100)
  const experienceToNext = nextRank
    ? (nextRank?.required_experience || 0) - currentExperience
    : 0

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
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
      {/* Avatar + Currency */}
      <motion.div
        variants={itemVariants}
        className='mb-6 flex flex-col items-center gap-2'
      >
        {/* Currency */}
        <motion.div
          variants={itemVariants}
          className='flex items-center gap-1.5'
        >
          <div className='flex flex-col items-center gap-0'>
            <p className='text-xs tracking-wide text-gray-500 uppercase'>
              {gameWorld?.currency_name || 'Currency'}
            </p>
            <div className='flex items-center gap-1'>
              <Coins size={14} className='text-yellow-400' />

              <p className='text-sm font-semibold text-cyan-400'>
                {currency?.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* User Info: Name, Email, Rank */}
      <motion.div variants={itemVariants} className='mb-6 space-y-3'>
        {/* Name & Email */}
        <div className='space-y-1 text-center'>
          <h1 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-2xl font-bold text-transparent'>
            {userName}
          </h1>
          {email && <p className='text-xs text-gray-500'>{email}</p>}
        </div>

        {/* Rank Badge */}
        <div className='flex items-center gap-2'>
          {rank?.icon && (
            <div className='relative h-8 w-8 overflow-hidden rounded-lg border border-indigo-500/20 bg-indigo-500/10'>
              <Image
                src={rank.icon}
                alt={rank.name}
                fill
                className='object-cover'
              />
            </div>
          )}
          <div
            className='w-full rounded-lg border px-3 py-2 backdrop-blur-sm'
            style={{
              backgroundColor: `${rank?.color || '#00d9ff'}10`,
              borderColor: `${rank?.color || '#00d9ff'}30`,
            }}
          >
            <h3
              className='text-sm font-semibold'
              style={{ color: rank?.color || '#00d9ff' }}
            >
              {rank?.name}
            </h3>
            {rank?.description && (
              <p className='mt-0.5 text-xs text-gray-500'>{rank.description}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Progress Section - Full Width */}
      <motion.div
        variants={itemVariants}
        className='mb-4 space-y-4 rounded-lg border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 p-4'
      >
        {/* Current Experience */}
        {currentExperience > 0 && (
          <div className='space-y-1.5'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <TrendingUp size={14} className='text-cyan-400' />
                <span className='text-xs font-medium tracking-wide text-gray-400 uppercase'>
                  {t('current_experience')}
                </span>
              </div>
              <span className='text-xs font-semibold text-cyan-400'>
                {currentExperience?.toLocaleString()}
              </span>
            </div>
            <div className='h-1.5 w-full overflow-hidden rounded-full border border-indigo-500/10 bg-slate-800/50'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className='h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500'
              />
            </div>
          </div>
        )}

        {/* Divider */}
        {currentExperience > 0 && nextRank && (
          <div className='h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent' />
        )}

        {/* Next Rank Progress */}
        {nextRank && (
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-medium tracking-wide text-gray-400 uppercase'>
                {t('progress_to_next_rank')}
              </span>
              <span
                className='rounded-full px-2.5 py-0.5 text-xs font-semibold'
                style={{
                  backgroundColor: `${nextRank?.color || '#6366f1'}15`,
                  border: `1px solid ${nextRank?.color || '#6366f1'}40`,
                  color: nextRank?.color || '#6366f1',
                }}
              >
                {nextRank?.name}
              </span>
            </div>

            <div className='space-y-1'>
              <div className='h-2 w-full overflow-hidden rounded-full border border-indigo-500/10 bg-slate-800/50'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className='relative h-full rounded-full bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400'
                >
                  <motion.div
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent'
                  />
                </motion.div>
              </div>
              <div className='flex justify-between text-xs text-gray-500'>
                <span>{progressPercent.toFixed(1)}%</span>
                <span>
                  {experienceToNext?.toLocaleString()} {t('experience_left')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Required Experience */}
        <div className='rounded-lg border border-indigo-500/30 bg-indigo-500/20 p-2.5'>
          <p className='text-xs tracking-wide text-gray-500 uppercase'>
            {t('required_experience')}
          </p>
          <p className='mt-0.5 text-sm font-semibold text-cyan-400'>
            {nextRank?.required_experience?.toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* Game World Footer */}
      {gameWorld && (
        <motion.div
          variants={itemVariants}
          className='rounded-lg border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 p-3'
        >
          <p className='text-xs tracking-wider text-gray-500 uppercase'>
            {t('game_world')}
          </p>
          <p className='mt-1 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-base font-semibold text-transparent'>
            {gameWorld?.name}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

ProfileRank.displayName = 'ProfileRank'

export default ProfileRank
