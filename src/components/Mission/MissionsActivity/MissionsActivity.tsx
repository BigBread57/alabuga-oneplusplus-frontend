import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import { Earth, Orbit, Split } from 'lucide-react'
import React from 'react'
import { MissionStatusFilter } from '@/components/Character/MissionStatusFilter'
import { BranchFilter } from '@/components/Mission/BranchFilter'
import { MissionsCardWrapper } from '@/components/Mission/MissionsCardWrapper'
import { useTour } from '@/components/Tour/useTour'
import { useFilter } from '@/hooks/useFilter'

import {
  CharacterMission,
  CharacterMissionStatus,
} from '@/models/CharacterMission'
import { CharacterMissionBranch } from '@/models/CharacterMissionBranch'
import { useFetchItems } from '@/services/base/hooks'

interface MissionsActivityProps {
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

const MODEL_CHARACTER_MISSIONS = CharacterMission
const MODEL_CHARACTER_MISSIONS_BRANCH = CharacterMissionBranch

const MissionsActivity: FCC<MissionsActivityProps> = () => {
  const { statusFilterRef, activitySectionRef, activityTabsRef } = useTour()

  const [filter, handleSetFilter] = useFilter({
    status: CharacterMissionStatus.IN_PROGRESS,
    branch: undefined,
  })

  const { data: branchesData } = useFetchItems({
    model: MODEL_CHARACTER_MISSIONS_BRANCH,
    qKey: 'characterMissionsBranches',
  })

  const { data: missionData } = useFetchItems({
    model: MODEL_CHARACTER_MISSIONS,
    filter: {
      limit: 1,
      offset: 0,
      status: filter.status,
      ...(filter.branch && { branch: filter.branch }),
    },
    qKey: 'characterMissionsBranchCardCount',
  })

  const missionCount = missionData?.data?.count || 0
  const branches = branchesData?.data?.results || []

  const handleSelectBranch = (branchId: string | null) => {
    handleSetFilter({ branch: branchId })
  }

  return (
    <>
      <motion.div
        ref={statusFilterRef}
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='mb-4 flex flex-col items-center justify-center gap-3 p-2 sm:flex-row'
        data-testid='test-MissionsActivity'
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
        className='grid h-[70vh] w-full grid-cols-1 gap-6 lg:grid-cols-4'
        data-testid='test-MissionsActivity'
      >
        {/* Левая часть - Фильтр веток */}
        <motion.div
          variants={sectionVariants}
          className='flex flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs lg:col-span-1'
        >
          <div className='flex items-center gap-2 border-b border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-transparent px-4 py-3'>
            <div className='rounded-lg bg-indigo-500/20 p-1.5'>
              <Split size={18} className='text-indigo-400' />
            </div>
            <h3 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-sm font-bold text-transparent'>
              Ветки
            </h3>
          </div>

          <div className='flex-1 overflow-y-auto p-3'>
            <div className='flex flex-col gap-2'>
              <BranchFilter
                branches={branches}
                filter={filter}
                onSelectBranch={handleSelectBranch}
              />
            </div>
          </div>
        </motion.div>

        {/* Правая часть - Миссии */}
        <motion.div
          ref={activityTabsRef}
          variants={sectionVariants}
          className='flex flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs lg:col-span-3'
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
      </motion.div>
    </>
  )
}

MissionsActivity.displayName = 'MissionsActivity'

export default MissionsActivity
