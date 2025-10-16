import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import { CalendarRange, Orbit, Rocket } from 'lucide-react'
import React, { useState } from 'react'
import { useFilter } from '@/hooks/useFilter'
import { CharacterEvent } from '@/models/CharacterEvent'
import { CharacterMissionStatus } from '@/models/CharacterMission'
import { CharacterMissionBranch } from '@/models/CharacterMissionBranch'
import { useFetchItems } from '@/services/base/hooks'
import EventsCardWrapper from '../../Event/EventsCardWrapper/EventsCardWrapper'
import MissionStatusFilter from '../MissionStatusFilter/MissionStatusFilter'

interface CharacterActivityChangerMobileProps {
  prop?: any
}

const MODEL_EVENTS = CharacterEvent
const MODEL_CHARACTER_MISSION_BRANCHES = CharacterMissionBranch

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

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

const CharacterActivityChangerMobile: FCC<
  CharacterActivityChangerMobileProps
> = () => {
  const [activeTab, setActiveTab] = useState<'missions' | 'events'>('missions')

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
    <motion.div
      className='flex h-full w-full flex-col gap-4 p-4 md:p-6'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      data-testid='test-CharacterActivityChangerMobile'
    >
      {/* Фильтр */}
      <motion.div
        className='mb-2 flex items-center justify-center'
        variants={tabVariants}
      >
        <MissionStatusFilter
          value={filter.status}
          onChange={(status) => {
            handleSetFilter({ status })
          }}
        />
      </motion.div>

      {/* Табы */}
      <div className='mb-4 flex justify-between gap-3 overflow-x-auto scroll-smooth'>
        <button
          type='button'
          onClick={() => setActiveTab('missions')}
          className={`flex flex-shrink-0 items-center gap-2 rounded-lg border px-4 py-3 whitespace-nowrap transition-all duration-300 ${
            activeTab === 'missions'
              ? 'border-indigo-500/50 bg-indigo-500/30'
              : 'border-gray-700/50 bg-gray-800/50 hover:bg-gray-800'
          }`}
        >
          <Orbit
            size={18}
            className={
              activeTab === 'missions' ? 'text-indigo-300' : 'text-gray-400'
            }
          />
          <span className='text-sm font-medium md:text-base'>Миссии</span>
          <span className='inline-flex h-6 min-w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/50 px-2 text-xs font-semibold text-indigo-200'>
            {missionCount}
          </span>
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('events')}
          className={`flex flex-shrink-0 items-center gap-2 rounded-lg border px-4 py-3 whitespace-nowrap transition-all duration-300 ${
            activeTab === 'events'
              ? 'border-cyan-500/50 bg-cyan-500/30'
              : 'border-gray-700/50 bg-gray-800/50 hover:bg-gray-800'
          }`}
        >
          <CalendarRange
            size={18}
            className={
              activeTab === 'events' ? 'text-cyan-300' : 'text-gray-400'
            }
          />
          <span className='text-sm font-medium md:text-base'>События</span>
          <span className='inline-flex h-6 min-w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/50 px-2 text-xs font-semibold text-cyan-200'>
            {eventCount}
          </span>
        </button>
      </div>

      {/* Контент - Миссии */}
      {activeTab === 'missions' && (
        <motion.div variants={tabVariants} initial='hidden' animate='visible'>
          <div className='flex h-full flex-col items-center justify-center py-8 text-center'>
            <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 md:h-16 md:w-16'>
              <Rocket size={24} className='text-indigo-400/50' />
            </div>
            <p className='mb-2 text-sm text-gray-400'>Компонент миссий</p>
            <p className='text-xs text-gray-500'>
              Здесь будут отображаться миссии персонажа
            </p>
          </div>
        </motion.div>
      )}

      {/* Контент - События */}
      {activeTab === 'events' && (
        <motion.div variants={tabVariants} initial='hidden' animate='visible'>
          <EventsCardWrapper filters={filter} />
        </motion.div>
      )}
    </motion.div>
  )
}

CharacterActivityChangerMobile.displayName = 'CharacterActivityChangerMobile'

export default CharacterActivityChangerMobile
