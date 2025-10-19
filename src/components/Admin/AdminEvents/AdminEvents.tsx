'use client'

import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import { Flame, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { MissionStatusFilter } from '@/components/Character/MissionStatusFilter'
import { EventCard } from '@/components/Event/EventCard'
import { useFilter } from '@/hooks/useFilter'
import { CharacterEventForInspector } from '@/models/CharacterEventForInspector'
import { CharacterMissionStatus } from '@/models/CharacterMission'
import { useFetchItems } from '@/services/base/hooks'

const MODEL_EVENTS = CharacterEventForInspector

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

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

const rotateVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

const AdminEvents: FCC = () => {
  const t = useTranslations('Mission')

  const [filter, handleSetFilter] = useFilter({
    status: CharacterMissionStatus.IN_PROGRESS,
  })

  const { data: eventData, refetch: refetchEvents } = useFetchItems({
    model: MODEL_EVENTS,
    filter: {
      status: filter.status,
    },
    qKey: 'characterEventsAdmin',
  })

  const eventsList = eventData?.data?.results || []
  const eventCount = eventData?.data?.count || 0

  const handleEventComplete = () => {
    refetchEvents()
  }

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='w-full'
    >
      {/* Фильтр */}
      <motion.div
        variants={sectionVariants}
        className='mb-6 flex items-center justify-between rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-transparent p-4 backdrop-blur-xs'
      >
        <div className='flex items-center gap-2'>
          <div className='rounded-lg bg-indigo-500/20 p-1.5'>
            <Zap size={18} className='text-indigo-400' />
          </div>
          <h2 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-sm font-bold text-transparent md:text-base'>
            {t('events')}
          </h2>
        </div>

        <MissionStatusFilter
          value={filter.status}
          onChange={(status) => {
            handleSetFilter({ status })
          }}
        />
      </motion.div>

      {/* Контент */}
      <motion.div
        variants={sectionVariants}
        className='flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs'
      >
        <div className='flex items-center justify-between gap-2 border-b border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-transparent px-6 py-4'>
          <div className='flex items-center gap-2'>
            <div className='rounded-lg bg-indigo-500/20 p-1.5'>
              <Flame size={18} className='text-indigo-400' />
            </div>
            <h3 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-sm font-bold text-transparent md:text-base'>
              {t('events')}
            </h3>
            <span className='inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-indigo-500/50 bg-indigo-500/30 px-1.5 text-xs font-semibold text-indigo-300'>
              {eventCount}
            </span>
          </div>
          <motion.div variants={rotateVariants} animate='animate'>
            <Flame size={18} className='text-indigo-400' />
          </motion.div>
        </div>

        <div
          className='flex-1 overflow-y-auto p-4'
          style={{ maxHeight: '70vh' }}
        >
          <div className='flex flex-col gap-4'>
            {eventsList?.map((item: any) => (
              <EventCard
                data={item}
                key={item.id}
                onComplete={handleEventComplete}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

AdminEvents.displayName = 'AdminEvents'

export default AdminEvents
