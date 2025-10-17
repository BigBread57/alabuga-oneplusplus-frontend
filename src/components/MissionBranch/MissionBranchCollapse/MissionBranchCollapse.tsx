'use client'
import type { CharacterMissionBranchProps } from '@/models/CharacterMissionBranch'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { MissionCard } from '@/components/Mission/MissionCard'
import { useFilter } from '@/hooks/useFilter'
import { CharacterMission } from '@/models/CharacterMission'
import { useFetchItems } from '@/services/base/hooks'

interface MissionBranchCollapseProps {
  data: CharacterMissionBranchProps
  externalFilter?: Record<string, any>
  onRefetch?: () => void
}

const MODEL_MISSIONS = CharacterMission

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

const MissionBranchCollapse: React.FC<MissionBranchCollapseProps> = ({
  data,
  externalFilter,
  onRefetch,
}) => {
  const [_, setFilter] = useFilter(externalFilter)
  const [isExpanded, setIsExpanded] = useState(true)

  const handleSetFilter = () => {
    setFilter({ branch: data?.branch?.id })
  }
  const { data: missionData } = useFetchItems({
    model: MODEL_MISSIONS,
    filter: {
      limit: 1,
      offset: 0,
      status: externalFilter?.status,
    },
    qKey: 'missionsCardCount',
  })
  const handleRefetch = () => {
    onRefetch?.()
  }
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Заголовок */}
      <motion.div
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        onClick={() => {
          handleSetFilter()
          toggleExpanded()
        }}
        className='group cursor-pointer'
      >
        <div className='rounded-xl bg-gradient-to-r from-indigo-500/5 to-transparent px-6 py-4 backdrop-blur-xs transition-all duration-300 hover:backdrop-blur-sm md:px-8'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex flex-1 items-center gap-3'>
              <motion.div
                animate={{ rotate: isExpanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={20} className='text-indigo-400' />
              </motion.div>
              <div className='flex items-center gap-2'>
                <h3 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text font-bold text-transparent'>
                  {data?.branch?.name}
                </h3>
                <span className='inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-indigo-500/50 bg-indigo-500/30 px-2 text-xs font-semibold text-indigo-300'>
                  {missionData?.data?.count || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Контент */}
      <motion.div
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
          marginTop: isExpanded ? 16 : 0,
        }}
        transition={{ duration: 0.3 }}
        className='overflow-hidden'
      >
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='flex flex-col gap-4'
        >
          <FetchMoreItemsComponent
            isParentCounter
            model={MODEL_MISSIONS}
            defFilters={externalFilter}
            renderItems={({ data, refetch }) => (
              <motion.div
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                className='flex flex-col gap-4'
              >
                {data && data.length > 0
                  ? data?.map((item) => (
                      <MissionCard
                        data={item}
                        key={item.id}
                        onComplete={() => {
                          refetch()
                          handleRefetch()
                        }}
                      />
                    ))
                  : null}
              </motion.div>
            )}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default MissionBranchCollapse
