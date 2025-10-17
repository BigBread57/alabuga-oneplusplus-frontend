'use client'

import type { BaseModel } from '@/models'
import type { FCC } from '@/types'
import { motion } from 'framer-motion'
import { Inbox, Rocket } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useMemo } from 'react'
import { useApiOptions } from '@/hooks/useApiOptions'
import { useInfinityFetchData } from '@/services/base/useInfinityFetchData'

type FetchMoreItemsComponentProps = {
  baseURL?: string
  model: typeof BaseModel
  defFilters?: Record<string, any>
  options?: Record<string, any>
  extra?: ({
    isLoading,
    isFetching,
    refetch,
  }: {
    refetch: () => void
    isLoading: boolean
    isFetching: boolean
  }) => React.ReactNode
  renderItems: ({
    data,
    mergedOptionsIntoData,
    dataCount,
    fetchNextPage,
    isLoading,
    isFetching,
    refetch,
  }: {
    data: any[]
    mergedOptionsIntoData: any[]
    fetchNextPage: () => void
    refetch: () => void
    dataCount: number
    isLoading: boolean
    isFetching: boolean
  }) => React.ReactNode
  lengthPostfixPlural?: string
  optionsFieldList?: (string | Record<string, string[]>)[]
  isClearRender?: boolean
  isParentCounter?: boolean
  emptyStateTitle?: string
  emptyStateDescription?: string
}

const FetchMoreItemsComponent: FCC<FetchMoreItemsComponentProps> = ({
  model: Model,
  defFilters,
  renderItems,
  options,
  lengthPostfixPlural,
  optionsFieldList,
  extra,
  isClearRender,
  isParentCounter,
  baseURL,
  emptyStateTitle,
  emptyStateDescription,
}) => {
  const t = useTranslations('FetchMoreItemsComponent')
  const {
    rowData: rawData = [],
    fetchNextPage,
    isLoading,
    isFetching,
    hasNextPage,
    dataCount,
    refetch,
  }: any = useInfinityFetchData({
    baseURL,
    model: Model,
    defFilters,
    options,
  })

  const { mergeOptionsIntoData } = useApiOptions(
    Model.modelName,
    optionsFieldList,
  )

  const rData = useMemo(
    () => rawData?.map((item: any) => mergeOptionsIntoData(item)),
    [rawData, mergeOptionsIntoData],
  )

  if (isClearRender) {
    return renderItems({
      data: rawData,
      mergedOptionsIntoData: rData,
      fetchNextPage,
      dataCount,
      isFetching,
      isLoading,
      refetch,
    })
  }

  return (
    <div className='w-full'>
      {!isParentCounter && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-6 text-sm'
        >
          <span className='font-semibold text-gray-300'>
            {isLoading ? t('loading') : `${t('found')} ${dataCount || 0}`}
          </span>
          {lengthPostfixPlural && (
            <span className='ml-2 text-gray-400'>{lengthPostfixPlural}</span>
          )}
        </motion.div>
      )}
      {extra?.({
        isLoading,
        isFetching,
        refetch,
      })}
      {isLoading && (
        <div className='flex justify-center py-8'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className='relative'
          >
            {/* Внешнее кольцо */}
            <div className='h-24 w-24 rounded-full border-2 border-transparent bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400 p-1'>
              <div className='flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'>
                {/* Иконка в центре */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className='text-cyan-400'
                >
                  <Rocket size={40} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {renderItems({
        data: rawData,
        mergedOptionsIntoData: rData,
        fetchNextPage,
        dataCount,
        isFetching,
        isLoading,
        refetch,
      })}
      {hasNextPage
        ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mt-8 flex justify-center'
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isFetching}
                onClick={fetchNextPage}
                className='rounded-lg border border-indigo-500/30 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 px-6 py-2 font-semibold text-indigo-300 transition-all duration-300 hover:from-indigo-500/30 hover:to-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isFetching ? 'Загрузка...' : 'Показать еще'}
              </motion.button>
            </motion.div>
          )
        : null}
      {!hasNextPage && dataCount
        ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='my-8 flex items-center justify-center'
            >
              <div className='h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent'></div>
              <span className='px-4 text-sm text-gray-400'>
                {t('no_more_items')}
              </span>
              <div className='h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent'></div>
            </motion.div>
          )
        : null}
      {!isLoading && !dataCount && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='flex flex-col items-center justify-center py-12 text-center'
        >
          <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10'>
            <Inbox size={32} className='text-indigo-400/50' />
          </div>
          <h3 className='mb-2 text-lg font-semibold text-gray-300'>
            {emptyStateTitle || t('empty_title')}
          </h3>
          <p className='text-sm text-gray-400'>
            {emptyStateDescription || t('empty_description')}
          </p>
        </motion.div>
      )}
    </div>
  )
}

FetchMoreItemsComponent.displayName = 'FetchMoreItemsComponent'

export default FetchMoreItemsComponent
