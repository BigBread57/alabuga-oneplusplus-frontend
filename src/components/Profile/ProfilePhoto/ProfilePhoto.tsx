'use client'
import type { UploadFile, UploadProps } from 'antd'

import { CameraOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar as AntdAvatart, Button, message, Modal, Upload } from 'antd'
import Avatar from 'boring-avatars'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'
import { Blue, DarkBlue, DarkPurple, LightBlue } from '@/libs/AntdThemes'
import styles from './ProfilePhoto.module.scss'

type ProfilePhotoProps = {
  src?: string
  alt?: string
  size?: number
  editable?: boolean
  onPhotoChange?: (file: File | null) => void
  loading?: boolean
  className?: string
}

export function ProfilePhoto({
  src,
  alt,
  size = 100,
  editable = false,
  onPhotoChange,
  loading = false,
  className,
}: ProfilePhotoProps) {
  const t = useTranslations('ProfilePhoto')
  const [previewVisible, setPreviewVisible] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error(t('upload_error_format'))
      return false
    }

    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.error(t('upload_error_size'))
      return false
    }

    return false // Prevent auto upload
  }

  const handleChange: UploadProps['onChange'] = (info) => {
    const { fileList: newFileList } = info

    if (newFileList.length > 0) {
      const file = newFileList[0]?.originFileObj
      if (file) {
        onPhotoChange?.(file)
        setFileList(newFileList.slice(-1))
      }
    } else {
      setFileList([])
    }
  }

  const handleRemove = () => {
    Modal.confirm({
      title: t('remove_confirm_title'),
      content: t('remove_confirm_description'),
      okText: t('remove_confirm_ok'),
      cancelText: t('remove_confirm_cancel'),
      okType: 'danger',
      onOk: () => {
        onPhotoChange?.(null)
        setFileList([])
        message.success(t('remove_success'))
      },
    })
  }

  const handlePreview = () => {
    if (src) {
      setPreviewVisible(true)
    }
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.avatarWrapper}>
        {src
          ? (
              <AntdAvatart
                src={src}
                alt={alt || t('avatar_alt')}
                size={size}
                icon={<UserOutlined />}
                style={{ cursor: src ? 'pointer' : 'default' }}
                onClick={handlePreview}
              />
            )
          : (
              <Avatar
                size={size}
                variant='beam'
                name='avatar'
                colors={[Blue, DarkBlue, DarkPurple, LightBlue]}
              />
            )}

        {editable && (
          <div className={styles.actions}>
            <Upload
              name='avatar'
              listType='picture'
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              showUploadList={false}
              accept='image/*'
              disabled={loading}
            >
              <Button
                type='primary'
                icon={<CameraOutlined />}
                loading={loading}
                size='small'
              >
                {t('upload_button')}
              </Button>
            </Upload>

            {src && (
              <Button
                type='default'
                danger
                icon={<DeleteOutlined />}
                size='small'
                onClick={handleRemove}
                disabled={loading}
              >
                {t('remove_button')}
              </Button>
            )}
          </div>
        )}
      </div>

      <Modal
        open={previewVisible}
        title={t('preview_title')}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        centered
      >
        <Image
          alt={alt || t('avatar_alt')}
          style={{ width: '100%' }}
          src={src as string}
        />
      </Modal>
    </div>
  )
}
