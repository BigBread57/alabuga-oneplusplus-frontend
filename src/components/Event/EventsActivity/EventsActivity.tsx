import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import { CalendarRange, Rocket } from 'lucide-react'
import React from 'react'
import { MissionStatusFilter } from '@/components/Character/MissionStatusFilter'
import { EventsCardWrapper } from '@/components/Event/EventsCardWrapper'
import { useTour } from '@/components/Tour/useTour'
import { useFilter } from '@/hooks/useFilter'
import { CharacterEvent } from '@/models/CharacterEvent'
import { CharacterMissionStatus } from '@/models/CharacterMission'
import { useFetchItems } from '@/services/base/hooks'

interface CharacterActivityChangerProps {
  prop?: any
}

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

const rocketVariants = {
  animate: {
    x: [0, 8, 0],
    y: [0, -8, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

const MODEL_EVENTS = CharacterEvent

const CharacterActivityChanger: FCC<CharacterActivityChangerProps> = () => {
  const { statusFilterRef } = useTour()

  const [filter, handleSetFilter] = useFilter({
    status: CharacterMissionStatus.IN_PROGRESS,
  })

  const { data: eventData } = useFetchItems({
    model: MODEL_EVENTS,
    filter: {
      limit: 1,
      offset: 0,
      status: filter.status,
    },
    qKey: 'eventsCardCount',
  })

  const eventCount = eventData?.data?.count || 0

  return (
    <>
      <motion.div
        ref={statusFilterRef}
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='mb-4 flex flex-col items-center justify-center gap-3 p-2 sm:flex-row'
        data-testid='test-CharacterActivityChanger'
      >
        <MissionStatusFilter
          value={filter.status}
          onChange={(status) => {
            handleSetFilter({ status })
          }}
        />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        className='flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs'
        data-testid='test-CharacterActivityChanger'
      >
        {/* Заголовок */}
        <div className='flex items-center justify-between gap-2 border-b border-indigo-500/10 bg-gradient-to-r from-cyan-500/5 to-transparent px-6 py-3 md:px-8'>
          <div className='flex items-center gap-2'>
            <div className='rounded-lg bg-cyan-500/20 p-1.5'>
              <CalendarRange size={18} className='text-cyan-400' />
            </div>
            <div className='flex items-center gap-2'>
              <h2 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-sm font-bold text-transparent md:text-base'>
                События
              </h2>
              <span className='inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-cyan-500/50 bg-cyan-500/30 px-1.5 text-xs font-semibold text-cyan-300'>
                {eventCount}
              </span>
            </div>
          </div>
          <motion.div variants={rocketVariants} animate='animate'>
            <Rocket size={18} className='text-cyan-400' />
          </motion.div>
        </div>

        {/* Контент */}
        <div className='flex-1 overflow-y-auto p-2 md:p-4'>
          <EventsCardWrapper filters={filter} />
        </div>
      </motion.div>
    </>
  )
}

CharacterActivityChanger.displayName = 'CharacterActivityChanger'

export default CharacterActivityChanger
