'use client'
import type { CharacterEventProps } from '@/models/CharacterEvent'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { DateTimeCalendar } from '@/components/_base/DateTimeCalendar'
import { useUrlDrawer } from '@/hooks/useUrlDrawer'

interface EventCardProps {
  data: CharacterEventProps
  onComplete?: () => void
}

const EventCard: React.FC<EventCardProps> = ({ data, onComplete }) => {
  const t = useTranslations('EventCard')
  const { isVisible, handleOpenDrawer, handleCloseDrawer } = useUrlDrawer({
    paramName: 'event',
    itemId: data.id,
  })

  const getStatusStyles = () => {
    switch (data?.status) {
      case 'IN_PROGRESS':
        return {
          text: 'text-blue-400',
          tag: 'bg-blue-500/20 text-blue-300',
          accent: 'from-blue-500/10 to-transparent',
        }
      case 'COMPLETED':
        return {
          text: 'text-green-400',
          tag: 'bg-green-500/20 text-green-300',
          accent: 'from-green-500/10 to-transparent',
        }
      case 'NEED_IMPROVEMENT':
        return {
          text: 'text-orange-400',
          tag: 'bg-orange-500/20 text-orange-300',
          accent: 'from-orange-500/10 to-transparent',
        }
      case 'PENDING_REVIEW':
        return {
          text: 'text-purple-400',
          tag: 'bg-purple-500/20 text-purple-300',
          accent: 'from-purple-500/10 to-transparent',
        }
      case 'FAILED':
        return {
          text: 'text-red-400',
          tag: 'bg-red-500/20 text-red-300',
          accent: 'from-red-500/10 to-transparent',
        }
      default:
        return {
          text: 'text-indigo-400',
          tag: 'bg-indigo-500/20 text-indigo-300',
          accent: 'from-indigo-500/10 to-transparent',
        }
    }
  }

  const statusStyles = getStatusStyles()

  const handleComplete = () => {
    handleCloseDrawer()
    onComplete?.()
  }

  return (
    <>
      <motion.div
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        onClick={handleOpenDrawer}
        className='group cursor-pointer'
      >
        <div
          className={`rounded-xl bg-gradient-to-r px-6 py-4 md:px-8 ${statusStyles.accent} backdrop-blur-xs transition-all duration-300 hover:backdrop-blur-sm`}
        >
          <div className='flex items-start justify-between gap-4'>
            <div className='min-w-0 flex-1'>
              {/* Название и описание */}
              <div className='mb-3'>
                <h3 className='mb-1 truncate text-base font-bold text-white'>
                  {data?.event?.name}
                </h3>
                <p className='line-clamp-2 text-sm text-gray-400'>
                  {data?.event?.description}
                </p>
              </div>

              {/* Статусы и категория */}
              <div className='mb-3 flex flex-wrap gap-2'>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusStyles.tag}`}
                >
                  {data.status_display_name}
                </span>
                {data?.event?.category && (
                  <span className='inline-flex rounded-full bg-cyan-500/20 px-2 py-1 text-xs font-semibold text-cyan-300'>
                    {data?.event?.category.name}
                  </span>
                )}
              </div>

              {/* Временные данные */}
              <div className='flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:gap-6'>
                <div className='flex items-center gap-2'>
                  <div className='h-1 w-1 flex-shrink-0 rounded-full bg-indigo-400'></div>
                  <DateTimeCalendar
                    text={t('start')}
                    datetime={data.start_datetime as string}
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-1 w-1 flex-shrink-0 rounded-full bg-indigo-400'></div>
                  <DateTimeCalendar
                    text={t('end')}
                    datetime={data.end_datetime as string}
                  />
                </div>
              </div>
            </div>

            {/* Кнопка просмотра */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                handleOpenDrawer()
              }}
              className='flex-shrink-0 rounded-lg bg-indigo-500/20 p-2 text-indigo-400 transition-colors hover:bg-indigo-500/30'
              aria-label={t('view_details')}
            >
              <Eye size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Дровер с детальной информацией */}
      {/* <EventDrawer */}
      {/*  itemId={+data.id} */}
      {/*  open={isVisible} */}
      {/*  onClose={handleCloseDrawer} */}
      {/*  onComplete={handleComplete} */}
      {/* /> */}
    </>
  )
}

export default EventCard
