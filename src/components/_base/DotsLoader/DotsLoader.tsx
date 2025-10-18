import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import React from 'react'

const DotsLoader: FCC = () => {
  return (
    <>
      <div className='flex h-8 items-center justify-center gap-2'>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          className='h-2 w-2 rounded-full bg-cyan-400'
        />
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          className='h-2 w-2 rounded-full bg-pink-400'
        />
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          className='h-2 w-2 rounded-full bg-indigo-400'
        />
      </div>
    </>
  )
}

DotsLoader.displayName = 'DotsLoader'

export default DotsLoader
