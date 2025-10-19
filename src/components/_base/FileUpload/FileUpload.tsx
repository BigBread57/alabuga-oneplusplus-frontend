'use client'

import type { FCC } from 'src/types'
import type { MultimediaProps } from '@/models/Multimedia'
import { motion } from 'framer-motion'
import { AlertCircle, Download, Upload, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useRef, useState } from 'react'
import { Multimedia } from '@/models/Multimedia'
import { usePostExtraActions } from '@/services/base/hooks'

interface FileUploadProps {
  disabled?: boolean
  fileList: MultimediaProps[]
  onChange: () => void
  maxCount?: number
  accept?: string
  maxSize?: number
  content_type_id?: number
  object_id?: number
}

const MODEL = Multimedia

const FileUpload: FCC<FileUploadProps> = ({
  fileList,
  onChange,
  maxCount = 10,
  accept = '.jpg,.jpeg,.png,.pdf,.doc,.docx,.txt',
  maxSize = 10,
  object_id,
  content_type_id,
  disabled,
}) => {
  const t = useTranslations('FileUpload')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { mutate: create } = usePostExtraActions({
    qKey: 'uploadFile',
    extraUrl: MODEL.createUrl(),
  })

  const beforeUpload = (file: File) => {
    const isValidSize = file.size / 1024 / 1024 < maxSize
    if (!isValidSize) {
      setUploadError(t('file_too_large', { maxSize }))
      return false
    }

    const isValidCount = fileList.length < maxCount
    if (!isValidCount) {
      setUploadError(t('max_files_exceeded', { maxCount }))
      return false
    }

    return true
  }

  const handleUpload = (files: FileList) => {
    const file = files[0]
    if (!file) {
      return
    }

    if (!beforeUpload(file)) {
      return
    }

    setIsUploading(true)
    setUploadError(null)

    const formData = new FormData()
    formData.append('multimedia', file)
    formData.append('content_type', String(content_type_id))
    formData.append('object_id', String(object_id))

    create(formData, {
      onSuccess: () => {
        setIsUploading(false)
        onChange()
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      },
      onError: () => {
        setIsUploading(false)
        setUploadError(t('upload_failed'))
      },
    })
  }

  const handleDownload = (file: MultimediaProps) => {
    try {
      const link = document.createElement('a')
      link.href = file.multimedia || ''
      link.download = file.multimedia_name || 'download'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download error:', error)
      setUploadError(`${t('download_failed')}`)
    }
  }

  const handleRemove = () => {
    onChange()
  }

  const canUpload = !disabled && fileList.length < maxCount && !isUploading

  return (
    <div className='space-y-3'>
      {/* Upload Area */}
      <motion.div
        onDragOver={(e) => {
          if (!disabled) {
            e.preventDefault()
            setIsDragging(true)
          }
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          if (!disabled) {
            e.preventDefault()
            setIsDragging(false)
            handleUpload(e.dataTransfer.files)
          }
        }}
        className={`relative cursor-pointer rounded-lg border-2 border-dashed p-4 transition-all md:p-6 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10'
            : disabled
              ? 'cursor-not-allowed border-gray-600/30 bg-gray-900/20 opacity-50'
              : 'border-indigo-500/30 bg-slate-800/50 hover:border-indigo-500/50 hover:bg-slate-800/80'
        }`}
        whileHover={!disabled ? { scale: 1.01 } : {}}
      >
        <input
          ref={fileInputRef}
          type='file'
          multiple
          accept={accept}
          disabled={!canUpload}
          onChange={(e) => handleUpload(e.currentTarget.files!)}
          className='hidden'
        />

        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          disabled={!canUpload}
          className='flex w-full flex-col items-center gap-3'
        >
          <motion.div
            animate={isUploading ? { rotate: 360 } : {}}
            transition={isUploading ? { repeat: Infinity, duration: 1.2 } : {}}
          >
            <Upload
              size={32}
              className={
                isUploading
                  ? 'text-cyan-400'
                  : disabled
                    ? 'text-gray-500'
                    : 'text-indigo-400'
              }
            />
          </motion.div>

          <div className='text-center'>
            <p className='text-sm font-medium text-white md:text-base'>
              {isUploading ? t('uploading') : t('upload_text')}
            </p>
            <p className='mt-1 text-xs text-gray-400 md:text-sm'>
              {t('upload_hint', { maxSize, maxCount })}
            </p>
          </div>
        </button>
      </motion.div>

      {/* Error Message */}
      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className='flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 md:p-3'
        >
          <AlertCircle
            size={16}
            className='mt-0.5 flex-shrink-0 text-red-400'
          />
          <p className='text-xs text-red-300 md:text-sm'>{uploadError}</p>
        </motion.div>
      )}

      {/* Files List */}
      {fileList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='space-y-2'
        >
          <p className='text-xs font-semibold text-white md:text-sm'>
            {t('uploaded_files')} ({fileList.length}/{maxCount})
          </p>

          <div className='space-y-1.5'>
            {fileList?.map((file) => (
              <motion.div
                key={`${file.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className='group flex items-center justify-between gap-2 rounded-lg border border-indigo-500/20 bg-slate-800/50 p-2.5 md:p-3'
              >
                <p className='truncate text-xs text-gray-300 md:text-sm'>
                  {file.multimedia_name}
                </p>

                <div className='flex flex-shrink-0 items-center gap-1'>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type='button'
                    onClick={() => handleDownload(file)}
                    className='p-1 text-gray-400 transition-colors hover:text-cyan-400'
                    title={t('download')}
                  >
                    <Download size={16} />
                  </motion.button>

                  {!disabled && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type='button'
                      onClick={() => handleRemove()}
                      className='p-1 text-gray-400 transition-colors hover:text-red-400'
                      title={t('delete')}
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

FileUpload.displayName = 'FileUpload'

export default FileUpload
