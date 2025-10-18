'use client'

import type { FCC } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { Select } from '@/components/_base/Select'
import { PostCard } from '@/components/News/PostCard'
import { useFilter } from '@/hooks/useFilter'
import { Post } from '@/models/Post'
import { CommunicationTopic } from '@/models/Topic'

const MODEL = Post
const TOPIC_MODEL = CommunicationTopic

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

const PostsCard: FCC = () => {
  const t = useTranslations('Post')
  const [filter, setFilter] = useFilter({})

  const handleSingleChange = (value?: number | string | any) => {
    setFilter({ topic: value })
  }

  return (
    <motion.div
      variants={sectionVariants}
      initial='hidden'
      animate='visible'
      className='mt-4 flex h-[75vh] flex-col overflow-y-auto rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs'
    >
      {/* Заголовок */}
      <div className='flex flex-col gap-4 border-b border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-transparent px-6 py-4 md:flex-row md:items-center md:justify-between md:px-8'>
        {/* Фильтр */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className='w-full flex-shrink-0 md:w-auto'
        >
          <Select
            url={`${TOPIC_MODEL.url()}?limit=1000&offset=0`}
            qKey='users-select'
            placeholder={t('select_topic')}
            valueKey='id'
            allowClear
            labelKey='name'
            style={{
              width: '100%',
              minWidth: '300px',
            }}
            onChange={handleSingleChange}
          />
        </motion.div>
      </div>

      {/* Контент */}
      <div className='flex-1 overflow-y-auto p-4 md:p-6'>
        <FetchMoreItemsComponent
          model={MODEL}
          defFilters={{ ...filter }}
          renderItems={({ data, isLoading }) => (
            <>
              {isLoading && (
                <div className='flex h-40 items-center justify-center'>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Loader2 size={32} className='text-cyan-400' />
                  </motion.div>
                </div>
              )}

              {!isLoading && (!data || data.length === 0) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='flex h-40 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/5'
                >
                  <p className='text-center text-gray-400'>
                    {t('no_data') ?? 'Нет данных'}
                  </p>
                </motion.div>
              )}

              <motion.div
                variants={sectionVariants}
                initial='hidden'
                animate='visible'
              >
                <div className='space-y-4'>
                  <AnimatePresence>
                    {data?.map((item, index) => (
                      <motion.div
                        key={item.id ?? index}
                        variants={itemVariants}
                        custom={index}
                        initial='hidden'
                        animate='visible'
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          delay: index * 0.05,
                        }}
                      >
                        <PostCard {...item} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </>
          )}
        />
      </div>
    </motion.div>
  )
}

PostsCard.displayName = 'PostsCard'

export default PostsCard
