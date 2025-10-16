'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Rocket } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useState } from 'react'
import LogoEn from '@/components/_icons/logo/LogoEn'
import LogoRu from '@/components/_icons/logo/LogoRu'

type LogoSwitcherProps = {
  width?: number
  height?: number
  animated?: boolean
}

export function LogoSwitcher({
  width = 48,
  height = 48,
  animated = true,
}: LogoSwitcherProps) {
  const locale = useLocale()
  const [isHovered, setIsHovered] = useState(false)

  const LogoComponent = locale !== 'ru' ? LogoEn : LogoRu

  if (!animated) {
    return <LogoComponent width={width} height={height} />
  }

  return (
    <div
      className='relative inline-block cursor-pointer'
      style={{ width, height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Логотип с анимацией при наведении */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <LogoComponent width={width} height={height} />
      </motion.div>

      {/* Анимированная ракета */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className='pointer-events-none absolute top-0 left-0 text-red-500'
            initial={{
              x: -50,
              y: 60,
              opacity: 0,
              rotate: -45,
              scale: 0.8,
            }}
            animate={{
              x: width + 20,
              y: -40,
              opacity: [0, 1, 0.8, 0],
              rotate: 45,
              scale: 1.2,
            }}
            exit={{
              x: width + 50,
              y: -60,
              opacity: 0,
              rotate: 90,
            }}
            transition={{
              duration: 3.2,
              ease: 'easeOut',
              times: [0, 0.3, 0.7, 1],
            }}
          >
            <Rocket size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
