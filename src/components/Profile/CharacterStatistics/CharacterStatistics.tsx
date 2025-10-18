'use client'

import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import React, { useContext } from 'react'
import { CardLoader } from '@/components/_base/CardLoader'
import PieChartComponent from '@/components/Charts/PieChart/PieChart'
import { RadarChartComponent } from '@/components/Charts/RadarChart'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import { Character } from '@/models/Character'
import { useExtraActionsGet } from '@/services/base/hooks'

const MODEL = Character

const CharacterStatistics: FCC = () => {
  const t = useTranslations('Statistics')
  const { currentUser } = useContext(CurrentUserContext)

  const { data: response, isLoading }: any = useExtraActionsGet({
    qKey: 'statisticsForUser',
    extraUrl: MODEL.statisticsForUserUrl(
      currentUser?.active_character as number,
    ),
    enabled: !!currentUser?.active_character,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  }

  return (
    <CardLoader isLoading={isLoading}>
      <div className='flex h-full w-full flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-slate-900/50 to-slate-800/50'>
        {/* Content */}
        <div className='flex-1 overflow-y-auto'>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='space-y-6 p-4 md:space-y-8 md:p-6'
          >
            {/* Competencies Section */}
            <motion.div variants={itemVariants}>
              <div className='space-y-3'>
                <h3 className='px-2 text-base font-semibold text-white md:text-lg'>
                  {t('competencies')}
                </h3>
                <RadarChartComponent
                  maxValue={10}
                  data={response?.data?.competencies?.by_name}
                />
              </div>
            </motion.div>

            {/* Missions by Level & Status Section */}
            <motion.div variants={itemVariants}>
              <h3 className='mb-3 px-2 text-base font-semibold text-white md:text-lg'>
                {t('missions')}
              </h3>
              <div className='grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4'>
                <div className='rounded-lg bg-slate-800/50 p-6'>
                  <p className='mb-2 px-2 text-xs text-gray-400 md:text-sm'>
                    {t('by_level')}
                  </p>
                  <PieChartComponent
                    key='by_level'
                    legendPosition='bottom'
                    data={response?.data?.missions?.by_level}
                  />
                </div>
                <div className='rounded-lg bg-slate-800/50 p-6'>
                  <p className='mb-2 px-2 text-xs text-gray-400 md:text-sm'>
                    {t('by_status')}
                  </p>
                  <PieChartComponent
                    key='by_status'
                    legendPosition='bottom'
                    data={response?.data?.missions?.by_status}
                  />
                </div>
                <div className='rounded-lg bg-slate-800/50 p-6'>
                  <p className='mb-2 px-2 text-xs text-gray-400 md:text-sm'>
                    {t('events')}
                  </p>
                  <PieChartComponent
                    key='by_status_events'
                    legendPosition='bottom'
                    data={response?.data?.events?.by_status}
                  />
                </div>
                <div className='rounded-lg bg-slate-800/50 p-6'>
                  <p className='mb-2 px-2 text-xs text-gray-400 md:text-sm'>
                    {t('artifacts')}
                  </p>
                  <PieChartComponent
                    key='by_type_artifacts'
                    legendPosition='bottom'
                    data={response?.data?.artifacts?.by_type}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </CardLoader>
  )
}

CharacterStatistics.displayName = 'CharacterStatistics'

export default CharacterStatistics
