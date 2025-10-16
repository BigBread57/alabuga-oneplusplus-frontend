import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import { CalendarRange, Orbit, Rocket } from 'lucide-react'
import React from 'react'
import { EventsCardWrapper } from '@/components/Event/EventsCardWrapper'
import { useTour } from '@/components/Tour/useTour'
import { useFilter } from '@/hooks/useFilter'
import { CharacterEvent } from '@/models/CharacterEvent'
import { CharacterMissionStatus } from '@/models/CharacterMission'
import { CharacterMissionBranch } from '@/models/CharacterMissionBranch'
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

const MODEL_EVENTS = CharacterEvent
const MODEL_CHARACTER_MISSION_BRANCHES = CharacterMissionBranch

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
        className='grid h-6/12  w-full auto-rows-max grid-cols-1 gap-6 lg:grid-cols-2'
        data-testid='test-CharacterActivityChanger'
      >
        {/* Левая часть - Миссии */}
        <motion.div
          variants={sectionVariants}
          className='overflow-hidden rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs'
        >
          {/* Заголовок */}
          <div className='flex items-center gap-3 border-b border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-transparent px-6 py-6 md:px-8'>
            <div className='rounded-lg bg-indigo-500/20 p-2'>
              <Orbit size={24} className='text-indigo-400' />
            </div>
            <div className='flex items-center gap-2'>
              <h2 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-lg font-bold text-transparent md:text-xl'>
                Миссии
              </h2>
              <span className='inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-indigo-500/50 bg-indigo-500/30 px-2 text-xs font-semibold text-indigo-300'>
                {missionCount}
              </span>
            </div>
          </div>

          {/* Контент (заглушка) */}
          <div className='p-6 md:p-8'>
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10'>
                <Rocket size={32} className='text-indigo-400/50' />
              </div>
              <p className='mb-2 text-sm text-gray-400'>Компонент миссий</p>
              <p className='text-xs text-gray-500'>
                Здесь будут отображаться миссии персонажа
              </p>
            </div>
          </div>
        </motion.div>

        {/* Правая часть - События */}
        <motion.div
          variants={sectionVariants}
          className='overflow-hidden overflow-y-auto rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs'
        >
          {/* Заголовок */}
          <div className='flex items-center gap-3 border-b border-indigo-500/10 bg-gradient-to-r from-cyan-500/5 to-transparent px-6 py-6 md:px-8'>
            <div className='rounded-lg bg-cyan-500/20 p-2'>
              <CalendarRange size={24} className='text-cyan-400' />
            </div>
            <div className='flex items-center gap-2'>
              <h2 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-lg font-bold text-transparent md:text-xl'>
                События
              </h2>
              <span className='inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-cyan-500/50 bg-cyan-500/30 px-2 text-xs font-semibold text-cyan-300'>
                {eventCount}
              </span>
            </div>
          </div>

          {/* Контент (заглушка) */}
          <div className='p-6 md:p-8'>
            <EventsCardWrapper filters={filter} />
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

CharacterActivityChanger.displayName = 'CharacterActivityChanger'

export default CharacterActivityChanger
