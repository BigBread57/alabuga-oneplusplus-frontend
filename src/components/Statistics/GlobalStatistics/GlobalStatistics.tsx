'use client'

import type { FCC } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Brain, Gem, Group, Loader2, Trophy, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useContext, useState } from 'react'
import RadialBarChartComponent from '@/components/Charts/RadialBarChart/RadialBarChart'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import { GameWorld } from '@/models/GameWorld'
import { useExtraActionsGet } from '@/services/base/hooks'

const MODEL = GameWorld

const tabConfig = [
  {
    key: '1',
    label: 'Топ по выполненным миссиям',
    icon: Trophy,
    dataKey: 'character_missions',
    placeKey: 'character_missions_place',
    numberKey: 'character_missions_number',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    key: '2',
    label: 'Топ по выполненным событиям',
    icon: Zap,
    dataKey: 'character_events',
    placeKey: 'character_events_place',
    numberKey: 'character_events_number',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    key: '3',
    label: 'Топ по количеству артефактов',
    icon: Gem,
    dataKey: 'character_artifacts',
    placeKey: 'character_artifacts_place',
    numberKey: 'character_artifacts_number',
    color: 'from-purple-500 to-pink-500',
  },
  {
    key: '4',
    label: 'Топ по количеству компетенций',
    icon: Brain,
    dataKey: 'character_competencies',
    placeKey: 'character_competencies_place',
    numberKey: 'character_competencies_number',
    color: 'from-green-500 to-emerald-500',
  },
]

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
}

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
}

const GlobalStatistics: FCC = () => {
  const t = useTranslations('Statistics')
  const { currentUser } = useContext(CurrentUserContext)
  const [activeTab, setActiveTab] = useState('1')

  const { data: response, isLoading }: any = useExtraActionsGet({
    qKey: 'statisticsForUser',
    extraUrl: MODEL.statisticsUrl(currentUser?.active_game_world as number),
    enabled: !!currentUser?.active_game_world,
  })

  const currentTab = tabConfig.find((tab) => tab.key === activeTab)
  const tableData = response?.data?.top_characters ?? []

  return (
    <div className='mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3'>
      {/* Левая часть - 2/3 (таблица) */}
      <motion.div
        variants={sectionVariants}
        initial='hidden'
        animate='visible'
        className='flex flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs lg:col-span-2'
      >
        {/* Заголовок */}
        <div className='border-b border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-transparent px-6 py-4 md:px-8'>
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className='text-lg font-bold text-cyan-300'
          >
            <div className='flex items-center gap-2'>
              <div className='rounded-lg bg-indigo-500/20 p-1.5'>
                <Trophy size={18} className='text-indigo-400' />
              </div>
              <h3 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-sm font-bold text-transparent'>
                {t('top_characters')}
              </h3>
            </div>
          </motion.h2>
        </div>

        {/* Вкладки */}
        <div className='overflow-x-auto border-b border-indigo-500/10 bg-slate-900/50 p-4'>
          <div className='flex flex-nowrap gap-2'>
            {tabConfig?.map((tab, index) => {
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex flex-shrink-0 items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.key
                      ? `border-cyan-400/60 bg-gradient-to-r ${tab.color} text-cyan-300 shadow-lg`
                      : 'border-indigo-500/30 bg-indigo-500/5 text-indigo-300 hover:border-indigo-500/60 hover:bg-indigo-500/10'
                  }`}
                >
                  <Icon size={16} />
                  <span className='hidden sm:inline'>{tab.label}</span>
                  <span className='sm:hidden'>{tab.label.split(' ')[2]}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Таблица */}
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

        {!isLoading && (!tableData || tableData.length === 0) && (
          <div className='flex h-40 items-center justify-center'>
            <p className='text-center text-gray-400'>Нет данных</p>
          </div>
        )}

        {tableData && tableData.length > 0 && (
          <div className='flex flex-1 flex-col'>
            {/* Заголовок таблицы */}
            <table className='w-full border-collapse'>
              <thead>
                <tr className='border-b border-indigo-500/10 bg-indigo-500/5'>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-gray-400'>
                    {t('character_place')}
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-gray-400'>
                    {t('character_name')}
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-gray-400'>
                    {t('character_number')}
                  </th>
                </tr>
              </thead>
            </table>

            {/* Строки таблицы - прокручиваемые */}
            <div className='max-h-[500px] flex-1 overflow-y-auto'>
              <table className='w-full border-collapse'>
                <tbody>
                  <AnimatePresence>
                    {tableData?.map((item: any, index: number) => (
                      <motion.tr
                        key={`${item.character_name}-${item?.id}`}
                        variants={rowVariants}
                        initial='hidden'
                        animate='visible'
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className='group border-b border-indigo-500/10 transition-all duration-200 hover:bg-indigo-500/10'
                      >
                        {/* Место */}
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-2'>
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r ${currentTab?.color} font-bold text-white`}
                            >
                              {index === 0
                                ? '🥇'
                                : index === 1
                                  ? '🥈'
                                  : index === 2
                                    ? '🥉'
                                    : index + 1}
                            </div>
                            <span className='text-white'>
                              {item?.[currentTab?.placeKey!] || '-'}
                            </span>
                          </div>
                        </td>

                        {/* Имя */}
                        <td className='px-6 py-4'>
                          <span className='font-medium text-cyan-300'>
                            {item.character_name ?? '-'}
                          </span>
                        </td>

                        {/* Количество */}
                        <td className='px-6 py-4'>
                          <span className='font-semibold text-cyan-300'>
                            {item?.[currentTab?.numberKey!] || '-'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* Правая часть - 1/3 (график) */}
      <motion.div
        variants={sectionVariants}
        initial='hidden'
        animate='visible'
        transition={{ delay: 0.2 }}
        className='flex flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs lg:col-span-1'
      >
        {/* Заголовок */}
        <div className='border-b border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-transparent px-6 py-4 md:px-8'>
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className='text-lg font-bold text-cyan-300'
          >
            <div className='flex items-center gap-2'>
              <div className='rounded-lg bg-indigo-500/20 p-1.5'>
                <Group size={18} className='text-indigo-400' />
              </div>
              <h3 className='line-clamp-2 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-sm font-bold text-transparent'>
                {t('grouping_character_by_ranks')}
              </h3>
            </div>
          </motion.h2>
        </div>

        {/* Содержимое графика */}
        <div className='flex flex-1 items-center justify-center overflow-auto p-4'>
          {isLoading
            ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Loader2 size={32} className='text-cyan-400' />
                </motion.div>
              )
            : response?.data?.grouping_character_by_ranks
              ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className='w-full'
                  >
                    <RadialBarChartComponent
                      height={400}
                      data={response?.data?.grouping_character_by_ranks}
                    />
                  </motion.div>
                )
              : (
                  <p className='text-center text-gray-400'>Нет данных</p>
                )}
        </div>
      </motion.div>
    </div>
  )
}

GlobalStatistics.displayName = 'GlobalStatistics'

export default GlobalStatistics
