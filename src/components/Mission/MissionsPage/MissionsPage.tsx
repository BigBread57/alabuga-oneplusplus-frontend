'use client'

import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import React from 'react'
import { MissionsActivity } from '@/components/Mission/MissionsActivity'
import { MissionsActivityMobile } from '@/components/Mission/MissionsActivityMobile'
import { useScreens } from '@/hooks/useScreens'

const MissionsPage: FCC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }
  const { isMobile, isTablet } = useScreens()

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='flex h-full w-full flex-col'
    >
      {isMobile || isTablet ? <MissionsActivityMobile /> : <MissionsActivity />}
    </motion.div>
  )
}

MissionsPage.displayName = 'MissionsPage'

export default MissionsPage
