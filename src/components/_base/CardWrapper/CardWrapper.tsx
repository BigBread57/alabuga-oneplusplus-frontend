'use client'

import type { FCC } from '@/types'
import { motion } from 'framer-motion'
import React from 'react'

interface CardWrapperProps {
  title?: string | React.ReactNode
  children?: React.ReactNode
  className?: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

const CardWrapper: FCC<CardWrapperProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <motion.div
      variants={cardVariants}
      initial='hidden'
      animate='visible'
      className={`overflow-hidden rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 ${className}`}
    >
      {/* Заголовок карточки */}
      {title && (
        <div className='flex items-center gap-2 border-b border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-transparent px-4 py-3'>
          <h3 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-sm font-bold text-transparent'>
            {title}
          </h3>
        </div>
      )}

      {/* Содержимое карточки */}
      <div className='p-4'>{children}</div>
    </motion.div>
  )
}

CardWrapper.displayName = 'CardWrapper'

export default CardWrapper
export type { CardWrapperProps }
