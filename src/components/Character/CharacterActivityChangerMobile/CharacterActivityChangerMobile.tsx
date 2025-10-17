import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import { CalendarRange, Orbit } from 'lucide-react'
import React, { useState } from 'react'
import { MissionsCardWrapper } from '@/components/Mission/MissionsCardWrapper'
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
      className='flex h-full w-full flex-col overflow-hidden'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      data-testid='test-CharacterActivityChangerMobile'
    >
      {/* Фильтр */}
      <motion.div
        className='flex flex-shrink-0 items-center justify-center px-4 py-2'
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
      <div className='flex flex-shrink-0 justify-between gap-3 overflow-x-auto scroll-smooth px-4 py-2'>
        <button
          type='button'
          onClick={() => setActiveTab('missions')}
          className={`flex flex-shrink-0 items-center gap-2 rounded-lg border px-3 py-2 whitespace-nowrap transition-all duration-300 ${
            activeTab === 'missions'
              ? 'border-indigo-500/50 bg-indigo-500/30'
              : 'border-gray-700/50 bg-gray-800/50 hover:bg-gray-800'
          }`}
        >
          <Orbit
            size={16}
            className={
              activeTab === 'missions' ? 'text-indigo-300' : 'text-gray-400'
            }
          />
          <span className='text-xs font-medium'>Миссии</span>
          <span className='inline-flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/50 px-1.5 text-xs font-semibold text-indigo-200'>
            {missionCount}
          </span>
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('events')}
          className={`flex flex-shrink-0 items-center gap-2 rounded-lg border px-3 py-2 whitespace-nowrap transition-all duration-300 ${
            activeTab === 'events'
              ? 'border-cyan-500/50 bg-cyan-500/30'
              : 'border-gray-700/50 bg-gray-800/50 hover:bg-gray-800'
          }`}
        >
          <CalendarRange
            size={16}
            className={
              activeTab === 'events' ? 'text-cyan-300' : 'text-gray-400'
            }
          />
          <span className='text-xs font-medium'>События</span>
          <span className='inline-flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/50 px-1.5 text-xs font-semibold text-cyan-200'>
            {eventCount}
          </span>
        </button>
      </div>

      <div
        style={{
          height: '70vh',
          overflow: 'auto',
        }}
      >
        {/* Контент - Миссии */}
        {activeTab === 'missions' && (
          <motion.div
            variants={tabVariants}
            initial='hidden'
            animate='visible'
            className='min-h-0 flex-1 overflow-y-auto px-4 py-4'
          >
            <MissionsCardWrapper filters={filter} />
          </motion.div>
        )}

        {/* Контент - События */}
        {activeTab === 'events' && (
          <motion.div
            variants={tabVariants}
            initial='hidden'
            animate='visible'
            className='min-h-0 flex-1 overflow-y-auto px-4 py-4'
          >
            <EventsCardWrapper filters={filter} />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

CharacterActivityChangerMobile.displayName = 'CharacterActivityChangerMobile'

export default CharacterActivityChangerMobile
