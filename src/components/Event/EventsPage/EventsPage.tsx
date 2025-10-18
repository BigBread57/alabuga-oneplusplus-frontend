'use client'

import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import React from 'react'
import { CharacterActivityChangerMobile } from '@/components/Character/CharacterActivityChangerMobile'
import { EventsActivity } from '@/components/Event/EventsActivity'
import { useScreens } from '@/hooks/useScreens'

const EventsPage: FCC = () => {
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
      {isMobile || isTablet
        ? (
            <CharacterActivityChangerMobile />
          )
        : (
            <EventsActivity />
          )}
    </motion.div>
  )
}

EventsPage.displayName = 'EventsPage'

export default EventsPage
