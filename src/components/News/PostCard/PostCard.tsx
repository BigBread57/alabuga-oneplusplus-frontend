import type { FCC } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useDateTimePrettyStr } from '@/hooks/useDateTimePrettyStr'

type PostProps = {
  id?: number
  image?: string
  name?: string
  text?: string
  character?: {
    id?: number
    avatar?: string
    user?: {
      id?: number
      email?: string
      first_name?: string
      last_name?: string
      middle_name?: string
      full_name?: string
    }
    role?: string
    role_display_name?: string
  }
  topic?: {
    id?: number
    name?: string
    color?: string
    icon?: string
  }
  created_at?: string
}

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const contentVariants = {
  hidden: { scale: 0.95, opacity: 0, y: 20 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
  },
}

const PostCard: FCC<PostProps> = ({
  image,
  name,
  character,
  topic,
  text,
  created_at,
}) => {
  const { timeDateString } = useDateTimePrettyStr()
  const t = useTranslations('ShopItem')
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setMounted(true)
  }, [])

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          onClick={() => setIsOpen(false)}
          className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'
        >
          <motion.div
            variants={contentVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            onClick={(e) => e.stopPropagation()}
            className='flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-2xl border border-indigo-500/20 bg-slate-900 shadow-2xl'
          >
            {/* Заголовок модалки */}
            <div className='flex flex-shrink-0 items-center justify-between border-b border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-transparent px-6 py-4'>
              <div className='flex items-center gap-3'>
                <h2 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-lg font-bold text-transparent'>
                  {name ?? 'Пост'}
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className='flex-shrink-0 text-gray-400 transition-colors hover:text-gray-300'
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Содержимое модалки */}
            <div className='flex-1 space-y-4 overflow-y-auto p-6'>
              {/* Тема */}
              {topic?.name && (
                <div className='flex items-center gap-2'>
                  <div
                    className='rounded-lg border px-3 py-1 text-xs font-medium'
                    style={{
                      backgroundColor: `${topic.color}20`,
                      borderColor: `${topic.color}40`,
                      color: topic.color,
                    }}
                  >
                    {topic.name}
                  </div>
                </div>
              )}

              {/* Изображение */}
              {image && (
                <div className='relative h-96 w-full overflow-hidden rounded-lg bg-slate-800'>
                  <Image
                    src={image}
                    alt={name ?? 'Изображение'}
                    fill
                    className='object-cover'
                  />
                </div>
              )}

              {/* Текст */}
              {text && (
                <div className='rounded-lg border border-indigo-500/10 bg-indigo-500/5 p-4'>
                  <p className='leading-relaxed text-gray-200'>{text}</p>
                </div>
              )}

              {/* Информация об авторе */}
              <div className='mt-4 space-y-3 border-t border-indigo-500/10 pt-4'>
                <div className='flex items-center gap-3'>
                  {character?.avatar && (
                    <div className='relative h-12 w-12 overflow-hidden rounded-full bg-slate-800'>
                      <Image
                        src={character.avatar}
                        alt={character.user?.full_name ?? 'Автор'}
                        fill
                        className='object-cover'
                      />
                    </div>
                  )}
                  <div>
                    <p className='font-semibold text-cyan-300'>
                      {character?.user?.full_name ?? '-'}
                    </p>
                    {character?.role_display_name && (
                      <p className='text-xs text-gray-400'>
                        {character.role_display_name}
                      </p>
                    )}
                  </div>
                </div>

                {created_at && (
                  <p className='text-xs text-gray-500'>
                    {timeDateString(created_at)}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {/* Карточка */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='group cursor-pointer rounded-lg border border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 p-4 transition-all duration-300 hover:border-cyan-400/40 hover:from-indigo-500/10 hover:to-blue-500/10'
        onClick={() => setIsOpen(true)}
      >
        {/* Заголовок и мета */}
        <div className='mb-3 flex items-start justify-between gap-4'>
          <div className='min-w-0 flex-1'>
            <div className='mb-2 flex items-center gap-2'>
              {character?.avatar && (
                <div className='relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-slate-800'>
                  <Image
                    src={character.avatar}
                    alt={character.user?.full_name ?? 'Автор'}
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <div>
                <p className='text-sm font-semibold text-cyan-300'>
                  {character?.user?.full_name ?? '-'}
                </p>
                <p className='text-xs text-gray-500'>
                  {created_at ? timeDateString(created_at) : '-'}
                </p>
              </div>
            </div>

            <h3 className='mb-2 line-clamp-2 text-base font-semibold text-white group-hover:text-cyan-200'>
              {name ?? 'Без названия'}
            </h3>

            {topic?.name && (
              <div
                className='inline-block rounded px-2 py-1 text-xs font-medium'
                style={{
                  backgroundColor: `${topic.color}20`,
                  borderColor: `${topic.color}40`,
                  color: topic.color,
                }}
              >
                {topic.name}
              </div>
            )}
          </div>

          {/* Изображение превью */}
          {image && (
            <div className='relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800'>
              <Image
                src={image}
                alt={name ?? 'Превью'}
                fill
                className='object-cover'
              />
            </div>
          )}
        </div>

        {/* Текст */}
        {text && (
          <p className='mb-3 line-clamp-2 text-sm text-gray-300'>{text}</p>
        )}

        {/* Кнопка подробнее */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className='mt-2 inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-all duration-300 hover:border-cyan-400/60 hover:from-cyan-500/30 hover:to-blue-500/30'
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(true)
          }}
        >
          {t('view_details') ?? 'Подробнее'}
        </motion.button>
      </motion.div>

      {/* Портал для модалки */}
      {mounted && createPortal(modalContent, document.body)}
    </>
  )
}

PostCard.displayName = 'PostCard'

export default PostCard
