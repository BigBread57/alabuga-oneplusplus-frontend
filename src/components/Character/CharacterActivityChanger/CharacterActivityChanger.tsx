import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import { CalendarRange, Earth, Orbit, Rocket } from 'lucide-react'
import React from 'react'
import { EventsCardWrapper } from '@/components/Event/EventsCardWrapper'
import { MissionsCardWrapper } from '@/components/Mission/MissionsCardWrapper'
import { useTour } from '@/components/Tour/useTour'
import { useFilter } from '@/hooks/useFilter'
import { CharacterEvent } from '@/models/CharacterEvent'
import {
  CharacterMission,
  CharacterMissionStatus,
} from '@/models/CharacterMission'
import { useFetchItems } from '@/services/base/hooks'
import MissionStatusFilter from '../MissionStatusFilter/MissionStatusFilter'

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

const orbitVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

const MODEL_EVENTS = CharacterEvent
const MODEL_CHARACTER_MISSION_BRANCHES = CharacterMission

const CharacterActivityChanger: FCC<CharacterActivityChangerProps> = () => {
  const { statusFilterRef, activitySectionRef, activityTabsRef } = useTour()

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
  const { data: missionData } = useFetchItems({
    model: MODEL_CHARACTER_MISSION_BRANCHES,
    filter: {
      limit: 1,
      offset: 0,
      status: filter.status,
    },
    qKey: 'characterMissionsBranchCardCount',
  })

  const missionCount = missionData?.data?.count || 0
  const eventCount = eventData?.data?.count || 0

  return (
    <>
      <motion.div
        ref={statusFilterRef}
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='mb-4 flex items-center justify-center p-2'
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
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='grid h-[70vh] w-full grid-cols-1 gap-6 lg:grid-cols-2'
        data-testid='test-CharacterActivityChanger'
      >
        {/* Левая часть - Миссии */}
        <motion.div
          variants={sectionVariants}
          className='flex flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs'
        >
          {/* Заголовок */}
          <div className='flex items-center justify-between gap-2 border-b border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-transparent px-6 py-3 md:px-8'>
            <div className='flex items-center gap-2'>
              <div className='rounded-lg bg-indigo-500/20 p-1.5'>
                <Orbit size={18} className='text-indigo-400' />
              </div>
              <div className='flex items-center gap-2'>
                <h2 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-sm font-bold text-transparent md:text-base'>
                  Миссии
                </h2>
                <span className='inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-indigo-500/50 bg-indigo-500/30 px-1.5 text-xs font-semibold text-indigo-300'>
                  {missionCount}
                </span>
              </div>
            </div>
            <motion.div variants={orbitVariants} animate='animate'>
              <Earth size={18} className='text-indigo-400' />
            </motion.div>
          </div>

          {/* Контент */}
          <div className='flex-1 overflow-y-auto p-2 md:p-4'>
            <MissionsCardWrapper filters={filter} />
          </div>
        </motion.div>

        {/* Правая часть - События */}
        <motion.div
          variants={sectionVariants}
          className='flex flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs'
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
      </motion.div>
    </>
  )
}

CharacterActivityChanger.displayName = 'CharacterActivityChanger'

export default CharacterActivityChanger
