'use client'

import type { FCC } from 'src/types'
import type { ArtifactProps } from '@/models/Artifact'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useState } from 'react'

const modifierLabels: Record<ArtifactProps['modifier'], string> = {
  DEFAULT: 'no_modifier',
  EXPERIENCE_GAIN: 'experience_gain',
  CURRENCY_GAIN: 'currency_gain',
  SHOP_DISCOUNT: 'SHOP_DISCOUNT',
}

const Artifact: FCC<ArtifactProps> = ({
  name,
  description,
  icon,
  color,
  modifier,
  modifier_value,
  game_world_stories,
}) => {
  const t = useTranslations('Artifact')
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => setIsOpen(false)

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
  }

  const iconColor = color || '#00d9ff'

  return (
    <>
      {/* Иконка артефакта */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenModal}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleOpenModal()
          }
        }}
        className='group relative flex cursor-pointer flex-col items-center rounded-lg p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400'
        title={name}
      >
        {/* Иконка */}
        <div
          className='relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-all duration-300'
          style={{
            borderColor: `${iconColor}40`,
            backgroundColor: `${iconColor}10`,
          }}
        >
          {/* Hover эффект */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className='pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/10 to-transparent'
          />

          {/* Фон с градиентом */}
          <div
            className='absolute inset-0 opacity-20'
            style={{
              background: `linear-gradient(135deg, ${iconColor}20, ${iconColor}05)`,
            }}
          />

          {/* Контент */}
          <div className='relative flex h-full w-full items-center justify-center p-2'>
            {icon
              ? (
                  <Image
                    src={icon}
                    alt={name}
                    width={48}
                    height={48}
                    className='object-contain drop-shadow-lg'
                  />
                )
              : (
                  <span className='text-2xl font-bold' style={{ color: iconColor }}>
                    {name?.[0]}
                  </span>
                )}
          </div>

          {/* Свечение при hover */}
          <motion.div
            className='absolute inset-0 rounded-xl'
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            style={{
              boxShadow: `inset 0 0 20px ${iconColor}40`,
            }}
          />
        </div>

        {/* Название артефакта */}
        <p className='mt-2 max-w-[80px] truncate text-center text-xs text-gray-300 transition-colors group-hover:text-cyan-400'>
          {name}
        </p>
      </motion.button>

      {/* Модалка с информацией */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            onClick={handleCloseModal}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'
          >
            <motion.div
              variants={modalVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              onClick={(e) => e.stopPropagation()}
              className='max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl border border-indigo-500/20 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl'
              style={{
                boxShadow: `0 0 30px ${iconColor}20`,
              }}
            >
              {/* Кнопка закрытия */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseModal}
                className='absolute top-4 right-4 rounded-lg p-2 transition-colors hover:bg-indigo-500/10'
              >
                <X size={20} className='text-gray-400' />
              </motion.button>

              {/* Заголовок */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className='mb-6 flex items-start gap-4'
              >
                {icon && (
                  <div
                    className='relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 p-2'
                    style={{
                      borderColor: `${iconColor}40`,
                      backgroundColor: `${iconColor}10`,
                    }}
                  >
                    <Image
                      src={icon}
                      alt={name}
                      width={96}
                      height={96}
                      className='h-full w-full object-contain'
                    />
                  </div>
                )}
                <div className='flex-1'>
                  <h2 className='mb-2 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-2xl font-bold text-transparent'>
                    {name}
                  </h2>
                </div>
              </motion.div>

              {/* Модификатор */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className='mb-6 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5'
                style={{
                  backgroundColor: `${iconColor}15`,
                  borderColor: `${iconColor}40`,
                  color: iconColor,
                }}
              >
                <span className='text-sm font-semibold'>
                  {t(modifierLabels[modifier] as any)}
                </span>
                {modifier_value && (
                  <span className='text-sm font-bold'>+{modifier_value}</span>
                )}
              </motion.div>

              {/* Описание */}
              {description && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className='mb-6 rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-4'
                >
                  <p className='text-sm leading-relaxed text-gray-300'>
                    {description}
                  </p>
                </motion.div>
              )}

              {/* Истории игрового мира */}
              {game_world_stories && game_world_stories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className='space-y-4'
                >
                  <div className='mb-4 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent' />

                  <h3 className='text-sm font-semibold tracking-wider text-gray-300 uppercase'>
                    {t('game_world_stories')}
                  </h3>

                  <div className='space-y-4'>
                    {game_world_stories.map((story, index) => (
                      <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + index * 0.05 }}
                        className='overflow-hidden rounded-lg border border-indigo-500/10 bg-slate-800/50'
                      >
                        {story.image && (
                          <div className='relative h-32 w-full overflow-hidden bg-slate-700'>
                            <Image
                              src={story.image}
                              alt={t('story_image')}
                              fill
                              className='object-cover'
                            />
                          </div>
                        )}
                        <div className='p-4'>
                          <p className='text-sm leading-relaxed text-gray-300'>
                            {story.text}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

Artifact.displayName = 'Artifact'

export default Artifact
