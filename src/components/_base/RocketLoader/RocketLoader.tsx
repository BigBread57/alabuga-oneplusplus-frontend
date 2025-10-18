import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import { Rocket } from 'lucide-react'
import React from 'react'

const RocketLoader: FCC = () => {
  return (
    <div className='flex justify-center py-8'>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className='relative'
      >
        {/* Внешнее кольцо */}
        <div className='h-24 w-24 rounded-full border-2 border-transparent bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400 p-1'>
          <div className='flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'>
            {/* Иконка в центре */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className='text-cyan-400'
            >
              <Rocket size={40} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

RocketLoader.displayName = 'RocketLoader'

export default RocketLoader
