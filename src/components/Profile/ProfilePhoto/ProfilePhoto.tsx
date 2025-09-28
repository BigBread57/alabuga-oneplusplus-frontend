'use client'

import type { UploadFile, UploadProps } from 'antd'
import type { CharacterProps } from '@/models/Character'
import { CameraOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar as AntdAvatar, message, Modal, Space, Upload } from 'antd'
import Avatar from 'boring-avatars'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'
import { ModalConfirm } from '@/components/_base/ModalConfirm'
import { TooltipButton } from '@/components/_base/TooltipButton'
import { Blue, DarkBlue, DeepDarkPurple, LightBlue } from '@/libs/AntdThemes'
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
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const updateCharacter = useExtraActionsPut('CharacterUpdateAvatar')

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

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response: any = await updateCharacter.mutateAsync([
        Character.updateUrl(),
        formData,
      ])

      message.success(t('upload_success'))
      onSuccess?.(response?.data)
      setFileList([])
    } catch (error) {
      console.error('Error uploading avatar:', error)
      message.error(t('upload_error'))
      onError?.(error as Error)
      setFileList([])
    }
  }

  const handleChange: UploadProps['onChange'] = (info) => {
    const { fileList: newFileList } = info

    if (newFileList.length > 0) {
      const file = newFileList[0]?.originFileObj
      if (file) {
        handleUpload(file)
        setFileList(newFileList.slice(-1))
      }
    } else {
      setFileList([])
    }
  }

  const handleRemoveConfirm = async () => {
    try {
      const response: any = await updateCharacter.mutateAsync([
        characterId as string,
        { avatar: null },
      ])

      message.success(t('remove_success'))
      onSuccess?.(response?.data)
      setRemoveModalVisible(false)
    } catch (error) {
      console.error('Error removing avatar:', error)
      message.error(t('remove_error'))
      onError?.(error as Error)
    }
  }

  const handlePreview = () => {
    if (avatar) {
      setPreviewVisible(true)
    }
  }

  const isLoading = updateCharacter.isPending

  return (
    <div
      className={className}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <div style={{ position: 'relative' }}>
        {avatar
          ? (
              <AntdAvatar
                src={avatar}
                alt={t('avatar_alt', { name: username })}
                size={size}
                icon={<UserOutlined />}
                style={{
                  cursor: 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'opacity 0.3s ease',
                }}
                onClick={handlePreview}
              />
            )
          : (
              <Avatar
                size={size}
                variant='beam'
                name={username || 'avatar'}
                colors={[Blue, DarkBlue, DeepDarkPurple, LightBlue]}
                style={{
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'opacity 0.3s ease',
                }}
              />
            )}

        {editable && (
          <Space
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Upload
              name='avatar'
              listType='picture'
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              showUploadList={false}
              accept='image/*'
              disabled={isLoading}
            >
              <TooltipButton
                type='text'
                icon={<CameraOutlined />}
                loading={isLoading}
                tooltip={t('upload_button')}
              />
            </Upload>

            {avatar && (
              <TooltipButton
                type='text'
                danger
                icon={<DeleteOutlined />}
                onClick={() => setRemoveModalVisible(true)}
                disabled={isLoading}
                tooltip={t('remove_button')}
              />
            )}
          </Space>
        )}
      </div>

      {/* Preview Modal */}
      <Modal
        open={previewVisible}
        title={t('preview_title', { name: username })}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        centered
        width={600}
      >
        {avatar && (
          <Image
            alt={t('avatar_alt', { name: username })}
            style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
            src={avatar}
            width={600}
            height={600}
          />
        )}
      </Modal>

      {/* Remove Confirmation Modal */}
      <ModalConfirm
        open={removeModalVisible}
        title={t('remove_confirm_title')}
        content={t('remove_confirm_description')}
        okText={t('remove_confirm_ok')}
        cancelText={t('remove_confirm_cancel')}
        onOk={handleRemoveConfirm}
        onCancel={() => setRemoveModalVisible(false)}
        loading={isLoading}
        danger
      />
    </div>
  )
}
