'use client'

import type { FCC } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CheckCheck, Clock, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { useFilter } from '@/hooks/useFilter'
import useMessage from '@/hooks/useMessages'
import { ActivityLog } from '@/models/ActivityLog'
import { useExtraActionsGet, useExtraActionsPut } from '@/services/base/hooks'
import JournalItem from '../JournalItem/JournalItem'

const MODEL = ActivityLog

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

const tabVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
}

const ActivityLogsCard: FCC = () => {
  const t = useTranslations('ActivityLog')
  const [filter, setFilter] = useFilter({})
  const [activeTab, setActiveTab] = useState('all')
  const [isLoadingReadAll, setIsLoadingReadAll] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { messageSuccess } = useMessage()

  const { data: contentTypesData }: any = useExtraActionsGet({
    qKey: 'getContentTypes',
    extraUrl: MODEL.contentTypesUrl(),
  })

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setMounted(true)
  }, [])

  const tabsItems = [
    { key: 'all', label: t('all') },
    ...(contentTypesData?.data?.results?.map(
      (type: { id: number; name: string }) => ({
        key: type.id,
        label: type.name,
      }),
    ) || []),
  ]

  const handleTabChange = (newKey: string) => {
    setActiveTab(newKey)
    setFilter({ content_type: newKey === 'all' ? undefined : newKey })
  }

  const { mutate } = useExtraActionsPut('read_all')

  const handleReadAll = (refetch: () => void) => {
    setIsLoadingReadAll(true)
    mutate([MODEL.markAllAsReadUrl(), { is_read: true }], {
      onSuccess: () => {
        refetch()
        messageSuccess()
        setIsLoadingReadAll(false)
        setUnreadCount(0)
      },
      onError: () => {
        setIsLoadingReadAll(false)
      },
    })
  }

  const modalContent = (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          variants={modalVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          onClick={() => setIsModalOpen(false)}
          className='fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 pt-4 backdrop-blur-sm sm:items-center sm:pt-0'
        >
          <motion.div
            variants={contentVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            onClick={(e) => e.stopPropagation()}
            className='mx-4 flex h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-900 shadow-2xl sm:mx-0 sm:h-auto sm:max-h-[90vh] sm:max-w-2xl'
          >
            {/* Заголовок */}
            <div className='flex flex-shrink-0 items-center justify-between border-b border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-transparent px-6 py-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-indigo-500/20 p-1.5'>
                  <Clock size={20} className='text-indigo-400' />
                </div>
                <h2 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-lg font-bold text-transparent'>
                  {t('title').toUpperCase()}
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsModalOpen(false)}
                className='flex-shrink-0 text-gray-400 transition-colors hover:text-gray-300'
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Вкладки */}
            <div className='flex-shrink-0 overflow-x-auto border-b border-indigo-500/10 bg-slate-900/50 p-4'>
              <div className='flex flex-nowrap gap-2'>
                {tabsItems.map((tab, index) => (
                  <motion.button
                    key={tab.key}
                    variants={tabVariants}
                    initial='hidden'
                    animate='visible'
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleTabChange(String(tab.key))}
                    className={`flex-shrink-0 rounded-lg border-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      activeTab === String(tab.key)
                        ? 'border-cyan-400/60 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-lg shadow-cyan-500/10'
                        : 'border-indigo-500/30 bg-indigo-500/5 text-indigo-300 hover:border-indigo-500/60 hover:bg-indigo-500/10'
                    }`}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Контент */}
            <div className='flex flex-1 flex-col overflow-hidden'>
              <FetchMoreItemsComponent
                model={MODEL}
                defFilters={{ ...filter }}
                extra={({ refetch }) => (
                  <div className='flex-shrink-0 border-b border-indigo-500/10 bg-slate-900/50 px-6 py-3'>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReadAll(refetch)}
                      disabled={isLoadingReadAll}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                        isLoadingReadAll
                          ? 'cursor-not-allowed border border-gray-600 bg-gray-800/20 text-gray-500'
                          : 'border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 hover:border-cyan-400/60 hover:from-cyan-500/30 hover:to-blue-500/30'
                      }`}
                    >
                      {isLoadingReadAll ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                          >
                            <Clock size={16} />
                          </motion.div>
                          {t('read_all')}
                        </>
                      ) : (
                        <>
                          <CheckCheck size={16} />
                          {t('read_all')}
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
                isClearRender
                renderItems={({ data }) => (
                  <div className='flex-1 overflow-y-auto'>
                    <div className='space-y-2 p-4'>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <AnimatePresence>
                          {data && data.length > 0 ? (
                            <>
                              {(() => {
                                const unread = data.filter(
                                  (item) => !item.is_read,
                                ).length
                                if (unreadCount !== unread) {
                                  setUnreadCount(unread)
                                }
                              })()}
                              {data.map((item, index) => (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ delay: index * 0.05 }}
                                  className='mb-4'
                                >
                                  <JournalItem
                                    is_read={item.is_read}
                                    itemId={item.id}
                                    text={item.text}
                                    created_at={item.created_at}
                                  />
                                </motion.div>
                              ))}
                            </>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className='flex h-48 items-center justify-center rounded-lg border border-indigo-500/10 bg-indigo-500/5'
                            >
                              <p className='text-center text-gray-400'>
                                {t('no_data') || 'No activity logs'}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </div>
                )}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {/* Кнопка уведомлений */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='relative rounded-lg p-2 text-cyan-400 transition-colors duration-200 hover:bg-indigo-500/10'
        aria-label='activity logs'
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className='absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Портал для модалки */}
      {mounted && createPortal(modalContent, document.body)}
    </>
  )
}

ActivityLogsCard.displayName = 'ActivityLogsCard'

export default ActivityLogsCard
