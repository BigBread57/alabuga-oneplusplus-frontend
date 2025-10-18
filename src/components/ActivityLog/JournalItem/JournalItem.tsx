'use client'

import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { useDateTimePrettyStr } from '@/hooks/useDateTimePrettyStr'

interface JournalItemProps {
  itemId: string | number
  text: string
  created_at: string
  is_read?: boolean
}

const JournalItem: FCC<JournalItemProps> = ({ is_read, created_at, text }) => {
  const { timeDateString } = useDateTimePrettyStr()
  const t = useTranslations('ActivityLog')

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      className={`group relative flex flex-col gap-1 rounded-xl border p-4 transition-all duration-300 ${
        is_read
          ? 'border-indigo-500/10 bg-slate-800/40 hover:bg-slate-800/60'
          : 'border-cyan-400/30 bg-gradient-to-r from-cyan-900/30 to-indigo-900/30 shadow-lg shadow-cyan-500/10 hover:from-cyan-800/40 hover:to-indigo-800/40'
      }`}
    >
      {/* Индикатор непрочитанного */}
      {!is_read && (
        <motion.span
          layoutId='unread-indicator'
          className='absolute top-3 right-3 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.5)]'
        />
      )}

      {/* Текст уведомления */}
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <p
          className={`text-sm transition-colors sm:text-base ${
            is_read ? 'text-gray-300' : 'font-semibold text-cyan-200'
          }`}
        >
          {text}
        </p>

        {/* Дата */}
        <div className='flex items-center gap-1 text-xs text-gray-400'>
          <Clock size={14} className='text-indigo-400' />
          <span>{timeDateString(created_at)}</span>
        </div>
      </div>

      {/* Метка "NEW" */}
      {!is_read && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className='absolute -top-2 left-3 rounded-md bg-cyan-500/20 px-2 py-0.5 text-[10px] font-medium tracking-wider text-cyan-300 uppercase'
        >
          {t('new')}
        </motion.span>
      )}
    </motion.div>
  )
}

JournalItem.displayName = 'JournalItem'

export default JournalItem
