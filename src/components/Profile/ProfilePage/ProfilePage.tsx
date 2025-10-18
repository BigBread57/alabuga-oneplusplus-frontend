'use client'

import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import React from 'react'
import { CharacterActivityChanger } from '@/components/Character/CharacterActivityChanger'
import { CharacterActivityChangerMobile } from '@/components/Character/CharacterActivityChangerMobile'
import { useScreens } from '@/hooks/useScreens'

const ProfilePage: FCC = () => {
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
            <CharacterActivityChanger />
          )}
    </motion.div>
  )
}

ProfilePage.displayName = 'ProfilePage'

export default ProfilePage
