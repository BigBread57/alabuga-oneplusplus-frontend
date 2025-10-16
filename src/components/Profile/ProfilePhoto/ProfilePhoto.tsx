'use client'

import type { CharacterProps } from '@/models/Character'
import Avatar from 'boring-avatars'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Trash2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'
import { Blue, DarkBlue, DeepDarkBlue, LightBlue } from '@/libs/AntdThemes'
import { Character } from '@/models/Character'
import { useExtraActionsPut } from '@/services/base/hooks'

type ProfilePhotoProps = {
  username: string
  characterId?: string | number
  avatar?: string
  size?: number
  editable?: boolean
  className?: string
  onSuccess?: (updatedCharacter: CharacterProps) => void
  onError?: (error: Error) => void
}

export function ProfilePhoto({
  size = 100,
  editable = false,
  className,
  onSuccess,
  onError,
  characterId,
  username,
  avatar,
}: ProfilePhotoProps) {
  const t = useTranslations('ProfilePhoto')
  const [previewVisible, setPreviewVisible] = useState(false)
  const [removeModalVisible, setRemoveModalVisible] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const updateCharacter = useExtraActionsPut('CharacterUpdateAvatar')

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      return false
    }

    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      return false
    }

    return true
  }

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('avatar', file)

      const response: any = await updateCharacter.mutateAsync([
        Character.updateUrl(),
        formData,
      ])

      onSuccess?.(response?.data)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      onError?.(error as Error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && beforeUpload(file)) {
      handleUpload(file)
    }
  }

  const handleRemoveConfirm = async () => {
    try {
      setIsUploading(true)
      const response: any = await updateCharacter.mutateAsync([
        characterId as string,
        { avatar: null },
      ])

      onSuccess?.(response?.data)
      setRemoveModalVisible(false)
    } catch (error) {
      console.error('Error removing avatar:', error)
      onError?.(error as Error)
    } finally {
      setIsUploading(false)
    }
  }

  const handlePreview = () => {
    if (avatar) {
      setPreviewVisible(true)
    }
  }

  return (
    <div className={className}>
      {/* Avatar Container */}
      <div className='relative inline-block'>
        {/* Avatar Image */}
        <motion.div
          whileHover={editable ? { scale: 1.05 } : {}}
          className={`relative cursor-pointer overflow-hidden rounded-full border-2 border-indigo-500/30 transition-all duration-300 ${
            isUploading ? 'opacity-70' : 'opacity-100'
          }`}
          style={{
            width: size,
            height: size,
          }}
          onClick={handlePreview}
        >
          {avatar
            ? (
                <Image
                  src={avatar}
                  alt={t('avatar_alt', { name: username })}
                  fill
                  className='object-cover'
                  priority
                />
              )
            : (
                <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900'>
                  <Avatar
                    size={size - 10}
                    variant='beam'
                    name={username || 'avatar'}
                    colors={[Blue, DarkBlue, DeepDarkBlue, LightBlue]}
                  />
                </div>
              )}

          {/* Hover Overlay */}
          {editable && (
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className='absolute inset-0 flex items-center justify-center gap-2 bg-black/40 backdrop-blur-sm'
            >
              <label className='cursor-pointer rounded-lg bg-indigo-500/20 p-2 transition-colors hover:bg-indigo-500/40'>
                <Camera size={20} className='text-cyan-400' />
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className='hidden'
                  aria-label={t('upload_button')}
                />
              </label>

              {avatar && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setRemoveModalVisible(true)
                  }}
                  disabled={isUploading}
                  className='rounded-lg bg-red-500/20 p-2 transition-colors hover:bg-red-500/40 disabled:opacity-50'
                  title={t('remove_button')}
                >
                  <Trash2 size={20} className='text-red-400' />
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Loading Spinner */}
          {isUploading && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <div className='h-8 w-8 rounded-full border-2 border-cyan-400/30 border-t-cyan-400' />
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewVisible && avatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewVisible(false)}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className='relative w-full max-w-2xl rounded-2xl border border-indigo-500/20 bg-slate-900/90 p-6 shadow-2xl'
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPreviewVisible(false)}
                className='absolute top-4 right-4 rounded-lg p-2 transition-colors hover:bg-indigo-500/10'
              >
                <X size={20} className='text-gray-400' />
              </motion.button>

              {/* Title */}
              <h2 className='mb-4 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-lg font-bold text-transparent'>
                {t('preview_title', { name: username })}
              </h2>

              {/* Image */}
              <div className='relative h-96 w-full overflow-hidden rounded-lg bg-slate-800/50'>
                <Image
                  alt={t('avatar_alt', { name: username })}
                  src={avatar}
                  fill
                  className='object-contain'
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remove Confirmation Modal */}
      <AnimatePresence>
        {removeModalVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRemoveModalVisible(false)}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className='w-full max-w-sm rounded-2xl border border-red-500/20 bg-slate-900/90 p-6 shadow-2xl'
            >
              {/* Title */}
              <h2 className='mb-3 text-lg font-bold text-red-400'>
                {t('remove_confirm_title')}
              </h2>

              {/* Description */}
              <p className='mb-6 text-sm text-gray-300'>
                {t('remove_confirm_description')}
              </p>

              {/* Buttons */}
              <div className='flex gap-3'>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRemoveModalVisible(false)}
                  disabled={isUploading}
                  className='flex-1 rounded-lg border border-gray-500/30 px-4 py-2 text-gray-300 transition-all duration-200 hover:bg-gray-500/10 disabled:opacity-50'
                >
                  {t('remove_confirm_cancel')}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRemoveConfirm}
                  disabled={isUploading}
                  className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-red-500/50 disabled:opacity-50'
                >
                  {isUploading
                    ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <div className='h-4 w-4 rounded-full border-2 border-white/30 border-t-white' />
                          </motion.div>
                          {t('remove_confirm_ok')}
                        </>
                      )
                    : (
                        t('remove_confirm_ok')
                      )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
