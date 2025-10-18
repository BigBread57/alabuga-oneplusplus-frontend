'use client'
import type { CharacterEventProps } from '@/models/CharacterEvent'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Moon,
  Rocket,
  Star,
  Sun,
  XCircle,
  Zap,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { DateTimeCalendar } from '@/components/_base/DateTimeCalendar'
import { EventDrawer } from '@/components/Event/EventDrawer'
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
          icon: Rocket,
          iconColor: 'text-blue-400',
        }
      case 'COMPLETED':
        return {
          text: 'text-green-400',
          tag: 'bg-green-500/20 text-green-300',
          accent: 'from-green-500/10 to-transparent',
          icon: CheckCircle2,
          iconColor: 'text-green-400',
        }
      case 'NEED_IMPROVEMENT':
        return {
          text: 'text-orange-400',
          tag: 'bg-orange-500/20 text-orange-300',
          accent: 'from-orange-500/10 to-transparent',
          icon: AlertCircle,
          iconColor: 'text-orange-400',
        }
      case 'PENDING_REVIEW':
        return {
          text: 'text-purple-400',
          tag: 'bg-purple-500/20 text-purple-300',
          accent: 'from-purple-500/10 to-transparent',
          icon: Clock,
          iconColor: 'text-purple-400',
        }
      case 'FAILED':
        return {
          text: 'text-red-400',
          tag: 'bg-red-500/20 text-red-300',
          accent: 'from-red-500/10 to-transparent',
          icon: XCircle,
          iconColor: 'text-red-400',
        }
      default:
        return {
          text: 'text-indigo-400',
          tag: 'bg-indigo-500/20 text-indigo-300',
          accent: 'from-indigo-500/10 to-transparent',
          icon: Star,
          iconColor: 'text-indigo-400',
        }
    }
  }

  const statusStyles = getStatusStyles()
  const StatusIcon = statusStyles.icon

  // Иконки для категорий
  const getCategoryIcon = () => {
    const categoryName = data?.event?.category?.name?.toLowerCase() || ''
    if (categoryName.includes('space') || categoryName.includes('квест')) {
      return <Moon size={14} />
    }
    if (categoryName.includes('night') || categoryName.includes('адаптация')) {
      return <Moon size={14} />
    }
    if (categoryName.includes('day') || categoryName.includes('день')) {
      return <Sun size={14} />
    }
    if (categoryName.includes('quest') || categoryName.includes('задача')) {
      return <Zap size={14} />
    }
    return <Star size={14} />
  }

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
          className={`rounded-xl bg-gradient-to-r px-2 py-4 md:px-3 ${statusStyles.accent} backdrop-blur-xs transition-all duration-300 hover:backdrop-blur-sm`}
        >
          <div className='flex items-start justify-between gap-4'>
            {/* Иконка статуса */}
            <motion.div
              variants={{
                animate: {
                  x: [0, 0, 0],
                  y: [0, -4, 0],
                  transition: {
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                },
              }}
              animate='animate'
            >
              <StatusIcon size={24} className={statusStyles.iconColor} />
            </motion.div>

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
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${statusStyles.tag}`}
                >
                  {data.status_display_name}
                </span>
                {data?.event?.category && (
                  <span className='inline-flex items-center gap-1 rounded-full bg-cyan-500/20 px-2 py-1 text-xs font-semibold text-cyan-300'>
                    {getCategoryIcon()}
                    {data?.event?.category.name}
                  </span>
                )}
              </div>

              {/* Временные данные */}
              <div className='flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:gap-6'>
                <div className='flex items-center gap-2'>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className='h-1 w-1 flex-shrink-0 rounded-full bg-indigo-400'
                  >
                  </motion.div>
                  <DateTimeCalendar
                    text={t('start')}
                    datetime={data.start_datetime as string}
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className='h-1 w-1 flex-shrink-0 rounded-full bg-indigo-400'
                  >
                  </motion.div>
                  <DateTimeCalendar
                    text={t('end')}
                    datetime={data.end_datetime as string}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Дровер с детальной информацией */}
      <EventDrawer
        itemId={+data.id}
        open={isVisible}
        onClose={handleCloseDrawer}
        onComplete={handleComplete}
      />
    </>
  )
}

export default EventCard
