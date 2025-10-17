'use client'

import { motion } from 'framer-motion'
import { Rocket } from 'lucide-react'
import { useTranslations } from 'next-intl'

const ComponentLoading = () => {
  const t = useTranslations('Loading')

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'>
      {/* Фоновые эффекты */}
      <div className='fixed inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500 opacity-10 mix-blend-screen blur-3xl filter' />
        <div className='absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-cyan-400 opacity-10 mix-blend-screen blur-3xl filter' />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className='flex flex-col items-center gap-8'
      >
        {/* Основной лоадер с анимацией */}
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

        {/* Текст загрузки */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='text-center'
        >
          <h1 className='mb-3 bg-gradient-to-r from-cyan-400 via-pink-400 to-indigo-400 bg-clip-text text-2xl font-bold text-transparent md:text-3xl'>
            {t('component_loading')}
          </h1>

          {/* Анимированные точки */}
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
        </motion.div>

        {/* Дополнительный текст */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className='mt-4 max-w-xs text-center text-sm text-gray-400'
        >
          Пристегните ремни...
        </motion.p>
      </motion.div>
    </div>
  )
}

export default ComponentLoading
