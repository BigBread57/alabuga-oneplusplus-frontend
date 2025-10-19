import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import { Split, Telescope, X } from 'lucide-react'
import React, { useState } from 'react'
import { useTour } from '@/components/Tour/useTour'
import { useScreens } from '@/hooks/useScreens'

interface BranchFilterProps {
  branches?: any[]
  filter?: any
  onSelectBranch?: (branchId: string | null) => void
}

const BranchFilter: FCC<BranchFilterProps> = ({
  branches,
  filter,
  onSelectBranch,
}) => {
  const { branchesCardRef } = useTour()

  const { isMobile, isTablet } = useScreens()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSelectBranch = (branchId: string | null) => {
    onSelectBranch?.(branchId)
    setIsModalOpen(false)
  }

  // Мобильная версия - Модальное окно
  if (isMobile || isTablet) {
    return (
      <div
        ref={branchesCardRef as any}
        className='w-full'
        data-testid='test-BranchFilter'
      >
        <motion.button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className='flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 transition-colors hover:bg-indigo-500/20'
        >
          <Split size={16} />
          <span>Ветки миссий</span>
        </motion.button>

        {/* Модальное окно с ветками */}
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs'
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className='w-full max-w-sm rounded-xl border border-indigo-500/20 bg-slate-900 p-6'
            >
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg font-bold text-cyan-400'>
                  Ветки миссий
                </h3>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='text-indigo-400 transition-colors hover:text-indigo-300'
                >
                  <X size={20} />
                </button>
              </div>

              {/* Опция "Все ветки" */}
              <motion.button
                whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                onClick={() => handleSelectBranch(null)}
                className={`mb-2 w-full rounded-lg px-4 py-3 text-left transition-colors ${
                  !filter?.branch
                    ? 'bg-indigo-500/30 text-indigo-300'
                    : 'text-indigo-300 hover:bg-indigo-500/10'
                }`}
              >
                Все ветки
              </motion.button>

              {/* Список веток */}
              <div className='max-h-96 space-y-1 overflow-y-auto'>
                {branches?.map((branch: any) => (
                  <motion.button
                    key={branch?.branch?.id}
                    whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                    onClick={() => handleSelectBranch(branch?.branch?.id)}
                    className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                      filter?.branch === branch?.branch?.id
                        ? 'bg-indigo-500/30 text-indigo-300'
                        : 'text-indigo-300 hover:bg-indigo-500/10'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <span className='font-medium'>
                        {branch?.branch?.name}
                      </span>
                      {filter?.branch === branch?.branch?.id && (
                        <div className='h-2 w-2 rounded-full bg-indigo-400' />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    )
  }

  // Десктопная версия - Развернутый список
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Контент - Список веток */}
      <div className='flex-1 space-y-1 overflow-y-auto p-4'>
        {/* Опция "Все ветки" */}
        <motion.button
          whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
          style={{
            backgroundColor: !filter?.branch ? 'indigo-300/10' : 'transparent',
          }}
          onClick={() => handleSelectBranch(null)}
          className='mb-2 w-full cursor-pointer rounded-lg px-4 py-3 text-left transition-colors'
        >
          <div className='flex items-center justify-between'>
            <span className='font-medium'>Все ветки</span>
            {!filter?.branch && <Telescope className='text-yellow-600' />}
          </div>
        </motion.button>
        {/* Список веток */}
        {branches?.map((branch: any) => (
          <motion.button
            key={branch?.branch?.id}
            whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
            onClick={() => handleSelectBranch(branch?.branch?.id)}
            style={{
              backgroundColor:
                filter?.branch === branch?.branch?.id
                  ? 'indigo-300/10'
                  : 'transparent',
            }}
            className='w-full cursor-pointer rounded-lg px-4 py-3 text-left transition-colors '
          >
            <div className='flex items-center justify-between'>
              <span className='font-medium'>{branch?.branch?.name}</span>
              {filter?.branch === branch?.branch?.id
                ? (
                    <Telescope className='text-yellow-600' />
                  )
                : null}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

BranchFilter.displayName = 'BranchFilter'

export default BranchFilter
