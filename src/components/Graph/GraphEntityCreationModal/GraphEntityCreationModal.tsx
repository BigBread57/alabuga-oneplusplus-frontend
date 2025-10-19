import type { FCC } from 'src/types'
import type { ENTITY_TYPES } from '@/hooks/useGraph'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export interface EntityData {
  name: string
  description: string
}

interface EntityCreationModalProps {
  visible: boolean
  entityType: ENTITY_TYPES | null
  onConfirm: (entityType: ENTITY_TYPES, data: EntityData) => void
  onCancel: () => void
}

const EntityCreationModal: FCC<EntityCreationModalProps> = ({
  visible,
  entityType,
  onConfirm,
  onCancel,
}) => {
  const t = useTranslations('Graph')
  const [isMounted, setIsMounted] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getDefaultTitle = (type: ENTITY_TYPES | null): string => {
    if (!type) {
      return ''
    }
    const entityLabel = getEntityLabel(type)
    return `${entityLabel} ${Date.now().toString().slice(-4)}`
  }

  useEffect(
    () => {
      if (visible && entityType) {
        setFormData({
          name: getDefaultTitle(entityType),
          description: getDefaultDescription(entityType),
        })
        setErrors({})
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visible, entityType],
  )

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [visible])

  const getEntityLabel = (type: ENTITY_TYPES | null): string => {
    if (!type) {
      return ''
    }
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    return t(`entities.${type}`, { fallback: type })
  }

  const getDefaultDescription = (type: ENTITY_TYPES | null): string => {
    const descriptions = {
      rank: t('entities.descriptions.rank', { fallback: 'Rank description' }),
      mission_branch: t('entities.descriptions.mission_branch', {
        fallback: 'Mission branch description',
      }),
      mission: t('entities.descriptions.mission', {
        fallback: 'Mission description',
      }),
      artifact: t('entities.descriptions.artifact', {
        fallback: 'Artifact description',
      }),
      competency: t('entities.descriptions.competency', {
        fallback: 'Competency description',
      }),
      event: t('entities.descriptions.event', {
        fallback: 'Event description',
      }),
    }
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    return type ? descriptions[type] : ''
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = t('title_required', {
        fallback: 'Please enter a title',
      })
    } else if (formData.name.length < 2) {
      newErrors.name = t('title_min_length', {
        fallback: 'Title must be at least 2 characters',
      })
    } else if (formData.name.length > 50) {
      newErrors.name = t('title_max_length', {
        fallback: 'Title must not exceed 50 characters',
      })
    }

    if (formData.description.length > 200) {
      newErrors.description = t('description_max_length', {
        fallback: 'Description must not exceed 200 characters',
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConfirm = () => {
    if (validateForm() && entityType) {
      onConfirm(entityType, {
        name: formData.name.trim(),
        description: formData.description.trim(),
      })
      setFormData({ name: '', description: '' })
      setErrors({})
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', description: '' })
    setErrors({})
    onCancel()
  }

  const handleUseDefaults = () => {
    setFormData({
      name: getDefaultTitle(entityType),
      description: getDefaultDescription(entityType),
    })
    setErrors({})
  }

  const modalVariants = {
    hidden: { opacity: 0, y: '100%' },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: '100%',
      transition: { duration: 0.2 },
    },
  } as const

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const modalRoot =
    typeof document !== 'undefined'
      ? document.getElementById('modal-root')
      : null

  const modalContent = (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            variants={backdropVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            onClick={handleCancel}
            className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm'
          />

          <motion.div
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='fixed inset-0 z-50 flex items-end justify-center md:items-center'
            onClick={handleCancel}
          >
            <div
              className='h-[100dvh] w-full overflow-hidden rounded-t-3xl border-0 border-indigo-500/20 bg-slate-900/95 shadow-2xl backdrop-blur-xl md:h-auto md:max-h-[90vh] md:max-w-md md:rounded-2xl md:border'
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation()
                }
              }}
              role='dialog'
              tabIndex={-1}
            >
              {/* Header */}
              <div className='sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-indigo-500/20 bg-slate-900/95 p-4 backdrop-blur-xl md:p-6'>
                <div className='flex items-center gap-2'>
                  <Sparkles size={20} className='text-cyan-400' />
                  <h2 className='text-lg font-bold text-white md:text-xl'>
                    {t('create', { fallback: 'Create' })}{' '}
                    {getEntityLabel(entityType)}
                  </h2>
                </div>
                <motion.button
                  onClick={handleCancel}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className='flex-shrink-0 p-1.5 text-gray-400 transition-colors hover:text-cyan-400'
                  aria-label='Close modal'
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Content */}
              <div className='max-h-[calc(100dvh-60px)] overflow-y-auto md:max-h-[calc(90vh-80px)]'>
                <div className='space-y-4 p-4 md:space-y-6 md:p-6'>
                  {/* Title Field */}
                  <div>
                    <label className='mb-2 block text-xs font-medium text-gray-300 md:text-sm'>
                      {t('entity_title', { fallback: 'Title' })}
                    </label>
                    <input
                      type='text'
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          name: e.target.value.slice(0, 50),
                        })
                        if (errors.name) {
                          setErrors({ ...errors, name: '' })
                        }
                      }}
                      placeholder={t('enter_title', {
                        fallback: 'Enter title...',
                      })}
                      maxLength={50}
                      className={`w-full rounded-lg border-2 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-gray-500 transition-all focus:outline-none ${
                        errors.name
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-indigo-500/20 focus:border-cyan-400/60'
                      }`}
                    />
                    {errors.name && (
                      <p className='mt-1 text-xs text-red-400'>{errors.name}</p>
                    )}
                    <div className='mt-1 text-right text-xs text-gray-400'>
                      {formData.name.length}/50
                    </div>
                  </div>

                  <div className='h-px bg-indigo-500/20' />

                  {/* Description Field */}
                  <div>
                    <label className='mb-2 block text-xs font-medium text-gray-300 md:text-sm'>
                      {t('entity_description', { fallback: 'Description' })}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          description: e.target.value.slice(0, 200),
                        })
                        if (errors.description) {
                          setErrors({ ...errors, description: '' })
                        }
                      }}
                      placeholder={t('enter_description', {
                        fallback: 'Enter description...',
                      })}
                      maxLength={200}
                      rows={4}
                      className={`w-full resize-none rounded-lg border-2 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-gray-500 transition-all focus:outline-none ${
                        errors.description
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-indigo-500/20 focus:border-cyan-400/60'
                      }`}
                    />
                    {errors.description && (
                      <p className='mt-1 text-xs text-red-400'>
                        {errors.description}
                      </p>
                    )}
                    <div className='mt-1 text-right text-xs text-gray-400'>
                      {formData.description.length}/200
                    </div>
                  </div>

                  <div className='h-px bg-indigo-500/20' />

                  {/* Default Values Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUseDefaults}
                    className='w-full rounded-lg border-2 border-indigo-500/30 bg-indigo-500/5 py-2 text-sm font-medium text-indigo-300 transition-all hover:border-indigo-500/60 hover:bg-indigo-500/10'
                  >
                    {t('use_default_values', {
                      fallback: 'Use Default Values',
                    })}
                  </motion.button>

                  {/* Buttons */}
                  <div className='space-y-2 pt-2'>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirm}
                      className='w-full rounded-lg bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/50 md:py-3'
                    >
                      {t('create', { fallback: 'Create' })}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCancel}
                      type='button'
                      className='w-full rounded-lg border-2 border-indigo-500/20 bg-slate-800/50 py-2.5 text-sm font-semibold text-white transition-all hover:border-indigo-500/50 md:py-3'
                    >
                      {t('cancel', { fallback: 'Cancel' })}
                    </motion.button>
                  </div>

                  {/* Padding для мобильных */}
                  <div className='h-4 md:h-0' />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return isMounted && modalRoot ? createPortal(modalContent, modalRoot) : null
}

EntityCreationModal.displayName = 'EntityCreationModal'

export default EntityCreationModal
