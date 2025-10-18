import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import React from 'react'
import { MissionStatusFilter } from '@/components/Character/MissionStatusFilter'
import { BranchFilter } from '@/components/Mission/BranchFilter'
import { MissionsCardWrapper } from '@/components/Mission/MissionsCardWrapper'
import { useFilter } from '@/hooks/useFilter'
import { CharacterMissionStatus } from '@/models/CharacterMission'
import { CharacterMissionBranch } from '@/models/CharacterMissionBranch'
import { useFetchItems } from '@/services/base/hooks'

interface MissionsActivityMobileProps {
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

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}
const MODEL_CHARACTER_MISSIONS_BRANCH = CharacterMissionBranch

const MissionsActivityMobile: FCC<MissionsActivityMobileProps> = () => {
  const [filter, handleSetFilter] = useFilter({
    status: CharacterMissionStatus.IN_PROGRESS,
  })

  const { data: branchesData } = useFetchItems({
    model: MODEL_CHARACTER_MISSIONS_BRANCH,
    qKey: 'characterMissionsBranches',
  })
  const branches = branchesData?.data?.results || []

  const handleSelectBranch = (branchId: string | null) => {
    handleSetFilter({ branch: branchId })
  }
  return (
    <motion.div
      className='flex h-full w-full flex-col overflow-hidden'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      data-testid='test-MissionsActivityMobile'
    >
      {/* Фильтр */}
      <motion.div
        className='flex justify-between gap-4 px-4 py-2'
        variants={tabVariants}
      >
        <MissionStatusFilter
          value={filter.status}
          onChange={(status) => {
            handleSetFilter({ status })
          }}
        />
        <BranchFilter
          branches={branches}
          filter={filter}
          onSelectBranch={handleSelectBranch}
        />
      </motion.div>

      <div
        style={{
          height: '70vh',
          overflow: 'auto',
        }}
      >
        {/* Контент - Миссии */}
        <motion.div
          variants={tabVariants}
          initial='hidden'
          animate='visible'
          className='min-h-0 flex-1 overflow-y-auto px-4 py-4'
        >
          <MissionsCardWrapper filters={filter} />
        </motion.div>
      </div>
    </motion.div>
  )
}

MissionsActivityMobile.displayName = 'MissionsActivityMobile'

export default MissionsActivityMobile
