'use client'

import type { FCC } from 'src/types'
import type { CharacterCompetencyProps } from '@/models/CharacterCompetence'
import { motion } from 'framer-motion'
import { BookOpen, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useState } from 'react'

export type CompetenceProps = {
  data: CharacterCompetencyProps
  isLoading?: boolean
}

export const Competence: FCC<CompetenceProps> = ({ data, isLoading }) => {
  const t = useTranslations('Competence')
  const [modalOpen, setModalOpen] = useState(false)

  const hasStories
    = data?.competency?.game_world_stories
      && data.competency.game_world_stories.length > 0

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  }

  if (isLoading) {
    return (
      <div className='h-48 w-40 animate-pulse rounded-lg bg-indigo-500/10' />
    )
  }

  return (
    <>
      {/* Card */}
      <motion.div
        variants={cardVariants}
        initial='hidden'
        animate='visible'
        onClick={() => setModalOpen(true)}
        className='group relative h-48 w-40 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 p-4 transition-all hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/20'
        style={{
          borderTop: `3px solid ${data?.competency.color || '#00d9ff'}`,
          borderBottom: `3px solid ${data?.competency.color || '#00d9ff'}`,
        }}
      >
        {/* Received Badge */}
        {data?.is_received && (
          <div className='absolute top-0 right-0 z-5 w-24 translate-y-3  bg-yellow-400/80 py-1 text-center text-xs font-semibold text-gray-900 shadow-lg'>
            {t('received')}
          </div>
        )}

        {/* Background Gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />

        {/* Content */}
        <div className='relative flex h-full flex-col gap-3'>
          {/* Icon */}
          <div className='flex justify-center'>
            <div className='relative h-12 w-12 overflow-hidden rounded-lg border border-indigo-500/20 bg-indigo-500/20'>
              <Image
                src={
                  (data?.competency?.icon as string)
                  || 'https://dummyimage.com/200'
                }
                alt={data?.competency.name}
                fill
                className='object-cover'
              />
            </div>
          </div>

          {/* Name */}
          <h3 className='truncate text-center text-sm font-semibold'>
            <span style={{ color: data?.competency.color || '#00d9ff' }}>
              {data?.competency?.name}
            </span>
          </h3>

          {/* Level */}
          <div className='flex items-center justify-center gap-1'>
            <Zap size={12} className='text-yellow-400' />
            <span className='text-xs text-gray-400'>
              {t('level')}: {data?.competency.level}
            </span>
          </div>

          {/* Experience */}
          <div className='flex flex-col gap-1'>
            <div className='flex items-center justify-center gap-1'>
              <span className='text-xs font-semibold text-cyan-400'>
                {data?.experience} XP
              </span>
              <span className='text-xs text-gray-500'>/</span>
              <span className='text-xs text-gray-500'>
                {data?.competency.required_experience} XP
              </span>
            </div>
            <div className='h-1 w-full overflow-hidden rounded-full border border-indigo-500/20 bg-slate-800/50'>
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((data?.experience / data?.competency.required_experience) * 100, 100)}%`,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className='h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500'
              />
            </div>
          </div>

          {/* /!* Stories Icon Badge *!/ */}
          {/* {hasStories && ( */}
          {/*  <div className='flex items-center justify-center'> */}
          {/*    <div className='flex items-center justify-center gap-1 rounded-full bg-purple-500/20 p-2'> */}
          {/*      <BookOpen size={14} className='text-purple-400' /> */}
          {/*    </div> */}
          {/*  </div> */}
          {/* )} */}
        </div>
      </motion.div>

      {/* Modal */}
      {modalOpen && (
        <motion.div
          variants={modalVariants}
          initial='hidden'
          animate='visible'
          className='fixed inset-0 z-50 flex items-center justify-center'
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
          />

          {/* Modal Content */}
          <motion.div
            className='relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl'
            style={{
              borderTop: `3px solid ${data?.competency.color || '#00d9ff'}`,
            }}
          >
            {/* Close Button */}
            <button
              type='button'
              onClick={() => setModalOpen(false)}
              className='absolute top-4 right-4 rounded-lg p-1 transition-colors hover:bg-indigo-500/20'
            >
              <svg
                className='h-6 w-6 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>

            {/* Header */}
            <div className='mb-6 flex items-start gap-4'>
              {data?.competency.icon && (
                <div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-indigo-500/20 bg-indigo-500/10'>
                  <Image
                    src={data.competency.icon as string}
                    alt={data.competency.name}
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <div className='flex-1'>
                <h2
                  className='text-2xl font-bold'
                  style={{ color: data?.competency.color || '#00d9ff' }}
                >
                  {data?.competency.name}
                </h2>
                <div className='mt-2 flex flex-wrap gap-2'>
                  <span
                    className='rounded-full px-3 py-1 text-xs font-semibold'
                    style={{
                      backgroundColor: `${data?.competency.color || '#00d9ff'}20`,
                      color: data?.competency.color || '#00d9ff',
                      border: `1px solid ${data?.competency.color || '#00d9ff'}40`,
                    }}
                  >
                    {t('level')} {data?.competency.level}
                  </span>
                  {data?.is_received && (
                    <span className='rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-semibold text-yellow-300'>
                      {t('received')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Experience Progress */}
            <div className='mb-6 rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-4'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-xs font-medium tracking-wide text-gray-400 uppercase'>
                  {t('experience')}
                </span>
                <span className='text-sm font-semibold text-cyan-400'>
                  {data?.experience} / {data?.competency.required_experience} XP
                </span>
              </div>
              <div className='h-2 w-full overflow-hidden rounded-full border border-indigo-500/10 bg-slate-800/50'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((data?.experience / data?.competency.required_experience) * 100, 100)}%`,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className='h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500'
                />
              </div>
              <div className='mt-1 text-right text-xs text-gray-500'>
                {(
                  (data?.experience / data?.competency.required_experience)
                  * 100
                ).toFixed(1)}
                %
              </div>
            </div>

            {/* Description */}
            {data?.competency.description && (
              <div className='mb-6'>
                <h3 className='mb-2 text-sm font-semibold text-gray-300'>
                  {t('description', { defaultValue: 'Description' })}
                </h3>
                <p className='text-sm leading-relaxed text-gray-400'>
                  {data.competency.description}
                </p>
              </div>
            )}

            {/* Stories Section */}
            {hasStories && (
              <div className='space-y-4 border-t border-indigo-500/20 pt-6'>
                <h3 className='flex items-center gap-2 text-sm font-semibold text-gray-300'>
                  <BookOpen size={16} className='text-purple-400' />
                  {t('game_world_stories')}
                </h3>
                <div className='space-y-4'>
                  {data.competency.game_world_stories?.map((story) => (
                    <div
                      key={story.id}
                      className='overflow-hidden rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3'
                    >
                      {story.image && (
                        <div className='mb-3 overflow-hidden rounded-lg'>
                          <Image
                            src={story.image}
                            alt={t('story_image')}
                            width={400}
                            height={200}
                            className='h-32 w-full object-cover transition-transform hover:scale-105'
                          />
                        </div>
                      )}
                      <p className='text-sm leading-relaxed text-gray-400'>
                        {story.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

Competence.displayName = 'Competence'

export default Competence
