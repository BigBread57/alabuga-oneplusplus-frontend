'use client'

import type { FCC, ReactQueryFetch } from 'src/types'
import type { CharacterMissionProps } from '@/models/CharacterMission'
import type { GameWorldStoryProps } from '@/models/GameWorldStory'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, ChevronRight, Star, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { DateTimeCalendar } from '@/components/_base/DateTimeCalendar'
import { FileUpload } from '@/components/_base/FileUpload'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import { CharacterRole } from '@/models/Character'
import { CharacterMission } from '@/models/CharacterMission'
import { CharacterMissionForInspector } from '@/models/CharacterMissionForInspector'
import { useExtraActionsPut, useFetchOneItem } from '@/services/base/hooks'

interface CharacterMissionDrawerProps {
  itemId?: number
  open: boolean
  onClose: () => void
  onComplete?: () => void
}

const MODEL_MISSIONS = CharacterMission
const CHARACTER_MISSION_MODEL = CharacterMissionForInspector

const CharacterMissionModal: FCC<CharacterMissionDrawerProps> = ({
  open,
  itemId,
  onComplete,
  onClose,
}) => {
  const t = useTranslations('MissionCard')
  const [userFormData, setUserFormData] = useState({ result: '' })
  const [hrFormData, setHrFormData] = useState({
    inspector_comment: '',
    status: 'PENDING_REVIEW',
  })
  const [isMounted, setIsMounted] = useState(false)
  const { currentUser } = useContext(CurrentUserContext)

  const {
    data: response,
    isLoading,
    refetch,
  }: ReactQueryFetch<CharacterMissionProps> | any = useFetchOneItem({
    model: MODEL_MISSIONS,
    id: itemId,
    qKey: 'characterMissionModal',
    options: {
      queryKey: ['characterMissionModal', itemId],
      enabled: !!itemId && open,
    },
  })

  const { mutate: updateForInspector } = useExtraActionsPut(
    'update_for_inspector',
  )
  const handleInspectorUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    updateForInspector(
      [
        CHARACTER_MISSION_MODEL.updateForInspectorUrl(itemId as number),
        hrFormData,
      ],
      {
        onSuccess: () => {
          refetch()
          onComplete?.()
        },
      },
    )
  }

  const { mutate: updateForCharacter } = useExtraActionsPut('user_missions')
  const handleCharacterUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    updateForCharacter(
      [
        MODEL_MISSIONS.updateForCharacterUrl(itemId as number),
        { result: userFormData.result },
      ],
      {
        onSuccess: () => {
          refetch()
          onComplete?.()
        },
      },
    )
  }

  const getStatusColor = () => {
    switch (response?.data?.status) {
      case 'IN_PROGRESS':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20'
      case 'COMPLETED':
        return 'bg-green-500/10 text-green-300 border-green-500/20'
      case 'NEED_IMPROVEMENT':
        return 'bg-orange-500/10 text-orange-300 border-orange-500/20'
      case 'PENDING_REVIEW':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20'
      case 'FAILED':
        return 'bg-red-500/10 text-red-300 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-300 border-gray-500/20'
    }
  }

  const isHR = currentUser?.active_character_role === CharacterRole.HR

  const canSubmitResult = () => {
    return (
      response?.data?.status === 'IN_PROGRESS'
      || response?.data?.status === 'NEED_IMPROVEMENT'
      || response?.data?.status === 'FAILED'
    )
  }

  const handleFileChange = () => {
    refetch()
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
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setIsMounted(true)
    if (open) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const modalRoot
    = typeof document !== 'undefined'
      ? document.getElementById('modal-root')
      : null

  const modalContent = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={backdropVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            onClick={onClose}
            className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm'
          />

          <motion.div
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='fixed inset-0 z-50 flex items-end justify-center md:items-center'
            onClick={onClose}
          >
            <div
              className='h-[100dvh] w-full overflow-hidden rounded-t-3xl border-0 border-indigo-500/20 bg-slate-900/95 shadow-2xl backdrop-blur-xl md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-2xl md:border'
              role='dialog'
              tabIndex={-1}
            >
              {/* Header */}
              <div className='sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-indigo-500/20 bg-slate-900/95 p-4 backdrop-blur-xl md:p-6'>
                <h2 className='flex-1 truncate text-lg font-bold text-white md:text-xl'>
                  {response?.data?.mission?.name}
                </h2>
                <motion.button
                  onClick={onClose}
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
                <div className='space-y-4 p-3 md:space-y-6 md:p-6'>
                  {isLoading ? (
                    <div className='flex items-center justify-center py-16'>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                      >
                        <Award className='text-cyan-400' size={40} />
                      </motion.div>
                    </div>
                  ) : (
                    <>
                      {/* Описание */}
                      <div>
                        <div className='mb-3 flex flex-row items-start justify-between gap-2 pt-2 md:items-center md:gap-4'>
                          <h3 className='text-base font-semibold text-white md:text-lg'>
                            {t('mission_description')}
                          </h3>
                          <span
                            style={{
                              transform: 'rotate(18deg) translateY(-4px)',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
                              border: '2px solid rgba(0, 0, 0, 0.2)',
                              display: 'inline-block',
                            }}
                            className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap md:px-4 md:py-2 md:text-sm ${getStatusColor()}`}
                          >
                            {response?.data?.status_display_name}
                          </span>
                        </div>
                        <p className='text-sm leading-relaxed text-gray-300 md:text-base'>
                          {response?.data?.mission.description}
                        </p>
                      </div>

                      {/* Связанные истории */}
                      {response?.data?.mission?.game_world_stories
                        && response?.data?.mission?.game_world_stories.length > 0
                        ? (
                            <>
                              <div className='h-px bg-indigo-500/20' />
                              <div>
                                <h3 className='mb-2 text-base font-semibold text-white md:mb-3 md:text-lg'>
                                  {t('related_stories')}
                                </h3>
                                <div className='space-y-1.5 md:space-y-2'>
                                  {response?.data?.mission?.game_world_stories?.map(
                                    (story: GameWorldStoryProps) => (
                                      <div
                                        key={story.id}
                                        className='flex items-start gap-2 text-sm text-gray-300 md:text-base'
                                      >
                                        <ChevronRight
                                          size={16}
                                          className='mt-0.5 flex-shrink-0 text-indigo-400'
                                        />
                                        <span>{story.text || story.id}</span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </>
                          )
                        : null}

                      <div className='h-px bg-indigo-500/20' />

                      {/* Награды */}
                      <div>
                        <h3 className='mb-3 text-base font-semibold text-white md:text-lg'>
                          {t('rewards')}
                        </h3>
                        <div className='grid grid-cols-2 gap-2 md:gap-4'>
                          <div className='rounded-lg border border-indigo-500/20 bg-slate-800/50 p-3 md:p-4'>
                            <div className='mb-2 flex items-center gap-2'>
                              <Award size={16} className='text-yellow-400' />
                              <span className='text-xs text-gray-400 md:text-sm'>
                                {t('experience')}
                              </span>
                            </div>
                            <p className='text-base font-bold text-white md:text-xl'>
                              {response?.data?.mission.experience.toLocaleString()}
                            </p>
                          </div>
                          <div className='rounded-lg border border-indigo-500/20 bg-slate-800/50 p-3 md:p-4'>
                            <div className='mb-2 flex items-center gap-2'>
                              <Star size={16} className='text-green-400' />
                              <span className='text-xs text-gray-400 md:text-sm'>
                                {t('coins')}
                              </span>
                            </div>
                            <p className='text-base font-bold text-white md:text-xl'>
                              {response?.data?.mission.currency.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='h-px bg-indigo-500/20' />

                      {/* Информация */}
                      <div>
                        <h3 className='mb-2 text-base font-semibold text-white md:mb-3 md:text-lg'>
                          {t('information')}
                        </h3>
                        <div className='space-y-1.5 text-xs text-gray-300 md:space-y-2 md:text-sm'>
                          <div className='flex justify-between gap-2'>
                            <span className='text-gray-400'>
                              {t('branch')}:
                            </span>
                            <span className='text-right'>
                              {response?.data?.mission.branch.name}
                            </span>
                          </div>
                          <div className='flex justify-between gap-2'>
                            <span className='text-gray-400'>
                              {t('category')}:
                            </span>
                            <span className='text-right'>
                              {response?.data?.mission.branch.category.name}
                            </span>
                          </div>
                          <div className='flex justify-between gap-2'>
                            <span className='text-gray-400'>{t('order')}:</span>
                            <span>#{response?.data?.mission.order}</span>
                          </div>
                          <div className='flex justify-between gap-2'>
                            <span className='text-gray-400'>{t('level')}:</span>
                            <span>{response?.data?.mission.level}</span>
                          </div>
                        </div>
                      </div>

                      <div className='h-px bg-indigo-500/20' />

                      {/* Временные рамки */}
                      <div>
                        <h3 className='mb-2 text-base font-semibold text-white md:mb-3 md:text-lg'>
                          {t('timeframe')}
                        </h3>
                        <div className='space-y-2'>
                          <DateTimeCalendar
                            text={t('start_date')}
                            datetime={response?.data?.start_datetime as string}
                          />
                          <DateTimeCalendar
                            text={t('end_date')}
                            datetime={response?.data?.end_datetime as string}
                          />
                        </div>
                      </div>

                      {/* Описание ветки */}
                      <div>
                        <h3 className='mb-2 text-base font-semibold text-white md:mb-3 md:text-lg'>
                          {t('about_branch', {
                            branchName: response?.data?.mission?.branch?.name,
                          })}
                        </h3>
                        <p className='text-xs leading-relaxed text-gray-400 md:text-sm'>
                          {response?.data?.mission.branch?.description}
                        </p>
                      </div>

                      <div className='h-px bg-indigo-500/20' />

                      {/* Форма для пользователя */}
                      {!isHR && (
                        <form onSubmit={handleCharacterUpdate}>
                          <div className='space-y-3 md:space-y-4'>
                            <h3 className='text-base font-semibold text-white md:text-lg'>
                              {t('mission_results')}
                            </h3>

                            <div>
                              <label className='mb-1.5 block text-xs font-medium text-gray-300 md:mb-2 md:text-sm'>
                                {t('result_description')}
                              </label>
                              <textarea
                                value={userFormData.result}
                                onChange={(e) =>
                                  setUserFormData({
                                    ...userFormData,
                                    result: e.target.value,
                                  })}
                                disabled={
                                  !['IN_PROGRESS', 'NEED_IMPROVEMENT'].includes(
                                    response?.data?.status,
                                  )
                                }
                                maxLength={1000}
                                rows={4}
                                placeholder={t(
                                  'result_description_placeholder',
                                )}
                                className='w-full resize-none rounded-lg border border-indigo-500/20 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-indigo-500/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                              />
                              <div className='mt-1 text-right text-xs text-gray-400'>
                                {userFormData.result.length}/1000
                              </div>
                            </div>

                            <div>
                              <label className='mb-1.5 block text-xs font-medium text-gray-300 md:mb-2 md:text-sm'>
                                {t('attachments')}
                              </label>
                              <FileUpload
                                disabled={
                                  !['IN_PROGRESS', 'NEED_IMPROVEMENT'].includes(
                                    response?.data?.status,
                                  )
                                }
                                fileList={response?.data?.multimedia}
                                object_id={itemId as number}
                                content_type_id={
                                  response?.data?.content_type_id as number
                                }
                                maxSize={10}
                                onChange={handleFileChange}
                              />
                            </div>

                            {response?.data?.inspector_comment && (
                              <div>
                                <label className='mb-1.5 block text-xs font-medium text-gray-300 md:mb-2 md:text-sm'>
                                  {t('inspector_comment')}
                                </label>
                                <p className='rounded-lg border border-indigo-500/20 bg-slate-800/50 p-2.5 text-sm text-gray-300 md:p-3'>
                                  {response?.data?.inspector_comment}
                                </p>
                              </div>
                            )}

                            {canSubmitResult() && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type='submit'
                                className='w-full rounded-lg bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/50 md:py-3 md:text-base'
                              >
                                {response?.data?.status === 'IN_PROGRESS'
                                  && t('to_pending_review')}
                                {response?.data?.status
                                  === 'NEED_IMPROVEMENT' && t('resubmit')}
                                {response?.data?.status === 'FAILED'
                                  && t('retry')}
                              </motion.button>
                            )}
                          </div>
                        </form>
                      )}

                      {/* Форма для HR */}
                      {isHR && (
                        <form onSubmit={handleInspectorUpdate}>
                          <div className='space-y-3 md:space-y-4'>
                            <h3 className='text-base font-semibold text-white md:text-lg'>
                              {t('mission_results')}
                            </h3>

                            <div>
                              <label className='mb-1.5 block text-xs font-medium text-gray-300 md:mb-2 md:text-sm'>
                                {t('result_description')}
                              </label>
                              <p className='rounded-lg border border-indigo-500/20 bg-slate-800/50 p-2.5 text-sm text-gray-300 md:p-3'>
                                {response?.data?.result || t('no_result_yet')}
                              </p>
                            </div>

                            {response?.data?.multimedia
                              && response?.data?.multimedia.length > 0 && (
                              <div>
                                <label className='mb-1.5 block text-xs font-medium text-gray-300 md:mb-2 md:text-sm'>
                                  {t('attachments')}
                                </label>
                                <FileUpload
                                  fileList={response?.data?.multimedia}
                                  object_id={itemId as number}
                                  content_type_id={
                                    response?.data?.content_type_id as number
                                  }
                                  maxSize={10}
                                  disabled={true}
                                  onChange={handleFileChange}
                                />
                              </div>
                            )}

                            <div className='h-px bg-indigo-500/20' />

                            <div>
                              <label className='mb-1.5 block text-xs font-medium text-gray-300 md:mb-2 md:text-sm'>
                                {t('inspector_comment')}
                              </label>
                              <textarea
                                value={hrFormData.inspector_comment}
                                onChange={(e) =>
                                  setHrFormData({
                                    ...hrFormData,
                                    inspector_comment: e.target.value,
                                  })}
                                maxLength={500}
                                rows={3}
                                placeholder={t('inspector_comment_placeholder')}
                                className='w-full resize-none rounded-lg border border-indigo-500/20 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-indigo-500/50 focus:outline-none'
                              />
                              <div className='mt-1 text-right text-xs text-gray-400'>
                                {hrFormData.inspector_comment.length}/500
                              </div>
                            </div>

                            <div>
                              <label className='mb-1.5 block text-xs font-medium text-gray-300 md:mb-2 md:text-sm'>
                                {t('status')}
                              </label>
                              <select
                                value={hrFormData.status}
                                onChange={(e) =>
                                  setHrFormData({
                                    ...hrFormData,
                                    status: e.target.value,
                                  })}
                                className='w-full rounded-lg border border-indigo-500/20 bg-slate-800/50 px-3 py-2 text-sm text-white focus:border-indigo-500/50 focus:outline-none'
                              >
                                <option value='PENDING_REVIEW'>
                                  {t('pending_review')}
                                </option>
                                <option value='NEED_IMPROVEMENT'>
                                  {t('need_improvement')}
                                </option>
                                <option value='COMPLETED'>
                                  {t('completed')}
                                </option>
                              </select>
                            </div>

                            <div className='space-y-2 pt-1 md:pt-2'>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type='submit'
                                className='w-full rounded-lg bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/50 md:py-3 md:text-base'
                              >
                                {t('apply')}
                              </motion.button>
                              <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type='button'
                                className='w-full rounded-lg border border-indigo-500/20 bg-slate-800/50 py-2.5 text-sm font-semibold text-white transition-all hover:border-indigo-500/50 md:py-3 md:text-base'
                              >
                                {t('close')}
                              </motion.button>
                            </div>
                          </div>
                        </form>
                      )}

                      {/* Padding для мобильных */}
                      <div className='h-4 md:h-0' />
                    </>
                  )}
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

CharacterMissionModal.displayName = 'CharacterMissionModal'

export default CharacterMissionModal
