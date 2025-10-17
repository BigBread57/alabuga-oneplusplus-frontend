'use client'
import type { CharacterMissionProps } from '@/models/CharacterMission'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { DateTimeCalendar } from '@/components/_base/DateTimeCalendar'
import { CharacterMissionDrawer } from '@/components/Character/CharacterMissionDrawer'
import { useUrlDrawer } from '@/hooks/useUrlDrawer'

interface MissionCardProps {
  data: CharacterMissionProps
  onComplete?: () => void
}

const MissionCard: React.FC<MissionCardProps> = ({ data, onComplete }) => {
  const t = useTranslations('MissionCard')
  const { isVisible, handleOpenDrawer, handleCloseDrawer } = useUrlDrawer({
    paramName: 'mission',
    itemId: data?.id,
  })

  const getStatusStyles = () => {
    switch (data?.status) {
      case 'IN_PROGRESS':
        return {
          tag: 'bg-blue-500/20 text-blue-300',
          accent: 'from-blue-500/5 to-transparent',
        }
      case 'COMPLETED':
        return {
          tag: 'bg-green-500/20 text-green-300',
          accent: 'from-green-500/5 to-transparent',
        }
      case 'NEED_IMPROVEMENT':
        return {
          tag: 'bg-orange-500/20 text-orange-300',
          accent: 'from-orange-500/5 to-transparent',
        }
      case 'PENDING_REVIEW':
        return {
          tag: 'bg-purple-500/20 text-purple-300',
          accent: 'from-purple-500/5 to-transparent',
        }
      case 'FAILED':
        return {
          tag: 'bg-red-500/20 text-red-300',
          accent: 'from-red-500/5 to-transparent',
        }
      default:
        return {
          tag: 'bg-indigo-500/20 text-indigo-300',
          accent: 'from-indigo-500/5 to-transparent',
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
          <div className='flex items-end justify-between gap-4'>
            <div className='min-w-0 flex-1'>
              {/* Название ветки и описание */}
              <div className='mb-2'>
                <div className='mb-2 flex items-center gap-2'>
                  <div
                    className='h-2 w-2 flex-shrink-0 rounded-full'
                    style={{
                      backgroundColor:
                        data?.mission?.branch?.color || '#818cf8',
                    }}
                  ></div>
                  <span
                    className='text-xs font-medium'
                    style={{
                      color: data?.mission?.branch?.color || '#818cf8',
                    }}
                  >
                    {data?.mission?.branch?.name}
                  </span>
                </div>
                <h3
                  className='mb-1 truncate text-base font-bold text-white'
                  style={{ color: data?.mission?.branch?.color || 'white' }}
                >
                  {data?.mission?.name}
                </h3>
                <p className='line-clamp-2 text-sm text-gray-400'>
                  {data?.mission?.description}
                </p>
              </div>

              {/* Статусы и категория */}
              <div className='mb-3 flex flex-wrap gap-2'>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusStyles.tag}`}
                >
                  {data?.status_display_name}
                </span>
                {data?.mission?.is_key_mission && (
                  <span className='inline-flex rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-semibold text-yellow-300'>
                    {t('key_mission')}
                  </span>
                )}
                <span className='inline-flex rounded-full bg-blue-500/20 px-2 py-1 text-xs font-semibold text-blue-300'>
                  {t('level')} <>{data?.mission?.level}</>
                </span>
              </div>

              {/* Временные данные */}
              <div className='flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:gap-6'>
                <div className='flex items-center gap-2'>
                  <div className='h-1 w-1 flex-shrink-0 rounded-full bg-indigo-400'></div>
                  <DateTimeCalendar
                    text={t('start')}
                    datetime={data?.start_datetime as string}
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-1 w-1 flex-shrink-0 rounded-full bg-indigo-400'></div>
                  <DateTimeCalendar
                    text={t('end')}
                    datetime={data?.end_datetime as string}
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
              className='hidden flex-shrink-0 rounded-lg bg-indigo-500/20 p-2 text-indigo-400 transition-colors hover:bg-indigo-500/30'
              aria-label={t('view_details')}
            >
              <Eye size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Дровер с детальной информацией */}
      <CharacterMissionDrawer
        itemId={+data?.id}
        open={isVisible}
        onComplete={handleComplete}
        onClose={handleCloseDrawer}
      />
    </>
  )
}

export default MissionCard
