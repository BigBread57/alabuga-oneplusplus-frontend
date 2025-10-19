'use client'

import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import React from 'react'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { Artifact } from '@/components/Profile/Artifact'
import { useTour } from '@/components/Tour/useTour'
import { CharacterArtifact } from '@/models/CharacterArtifacts'

const MODEL = CharacterArtifact

const ArtifactsList: FCC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }
  const { artifactsSectionRef } = useTour()
  const emptyStateVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <FetchMoreItemsComponent
      model={MODEL}
      defFilters={{}}
      isClearRender
      renderItems={({ data, isLoading }) => (
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='w-full'
          data-testid='test-ArtifactsList'
        >
          {isLoading
            ? (
                <div className='flex w-full items-center justify-center py-12'>
                  <div className='h-8 w-8 rounded-full border-4 border-t-4 border-gray-200 ease-linear'></div>
                </div>
              )
            : data?.length === 0
              ? (
                  <motion.div
                    variants={emptyStateVariants}
                    className='flex items-center justify-center px-4 py-12'
                  >
                    <div className='text-center'>
                      <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10'>
                        <svg
                          className='h-8 w-8 text-indigo-400'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={1.5}
                            d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                          />
                        </svg>
                      </div>
                      <p className='text-sm text-gray-400'>
                        У вас пока нет артефактов
                      </p>
                      <p className='mt-1 text-xs text-gray-500'>
                        Начните собирать артефакты, чтобы они отображались здесь
                      </p>
                    </div>
                  </motion.div>
                )
              : (
                  <div
                    ref={artifactsSectionRef}
                    className='flex w-full overflow-x-auto'
                  >
                    {data?.map((item) => (
                      <Artifact key={item?.id} {...item?.artifact} />
                    ))}
                  </div>
                )}
        </motion.div>
      )}
    />
  )
}

ArtifactsList.displayName = 'ArtifactsList'

export default ArtifactsList
