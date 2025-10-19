import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import React from 'react'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { MissionCard } from '@/components/Mission/MissionCard'
import { useTour } from '@/components/Tour/useTour'
import { CharacterMission } from '@/models/CharacterMission'

interface MissionsCardWrapperProps {
  filters?: any
  prop?: any
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

const MissionsCardWrapper: FCC<MissionsCardWrapperProps> = ({ filters }) => {
  const { missionsCardRef } = useTour()

  return (
    <motion.div
      ref={missionsCardRef}
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      data-testid='test-MissionsCardWrapper'
      className='h-full w-full'
    >
      <FetchMoreItemsComponent
        isParentCounter
        model={MODEL_MISSIONS}
        defFilters={filters}
        renderItems={({ data, refetch }) => (
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='flex h-full flex-col gap-4 overflow-y-auto'
          >
            {data && data.length > 0
              ? data?.map((item) => (
                  <MissionCard
                    data={item}
                    key={item.id}
                    onComplete={() => {
                      refetch()
                    }}
                  />
                ))
              : null}
          </motion.div>
        )}
      />
    </motion.div>
  )
}

MissionsCardWrapper.displayName = 'MissionsCardWrapper'

export default MissionsCardWrapper
