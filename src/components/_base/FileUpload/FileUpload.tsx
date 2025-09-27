'use client'

import type { UploadProps } from 'antd'
import type { RcFile } from 'antd/es/upload'
import type { FCC } from 'src/types'
import type { MultimediaProps } from '@/models/Multimedia'
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons'
import { App, Button, List, Space, Typography, Upload } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { Multimedia } from '@/models/Multimedia'
import { usePostExtraActions } from '@/services/base/hooks'

const { Dragger } = Upload
const { Text } = Typography

interface FileUploadProps {
  fileList: MultimediaProps[]
  onChange: () => void
  maxCount?: number
  accept?: string
  maxSize?: number // в MB
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
}) => {
  const t = useTranslations('FileUpload')
  const { mutate: create } = usePostExtraActions(
    'uploadFile',
    MODEL.createUrl(),
  )
  const { message } = App.useApp() // Используем хук из App контекста

  const handleUpload: UploadProps['customRequest'] = ({ file }) => {
    const formData = new FormData()
    formData.append('multimedia', file as RcFile)
    formData.append('content_type', String(content_type_id))
    formData.append('object_id', String(object_id))
    create(formData, {
      onSuccess: () => {
        message.success(t('upload_successful'))
        onChange()
      },
      onError: () => {
        message.error(t('upload_failed'))
      },
    })
  }

  const handleChange: UploadProps['onChange'] = () => {
    onChange()
  }

  const handleRemove = () => {
    onChange()
  }

  const beforeUpload = (file: File) => {
    const isValidSize = file.size / 1024 / 1024 < maxSize
    if (!isValidSize) {
      message.error(t('file_too_large', { maxSize }))
      return false
    }

    const isValidCount = fileList.length < maxCount
    if (!isValidCount) {
      message.error(t('max_files_exceeded', { maxCount }))
      return false
    }

    return true
  }

  return (
    <div>
      <Dragger
        multiple
        fileList={fileList as any}
        customRequest={handleUpload}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        accept={accept}
        showUploadList={false}
        disabled={fileList.length >= maxCount}
      >
        <Space direction='vertical'>
          <InboxOutlined
            style={{
              fontSize: 32,
            }}
          />
          <Text>{t('upload_text')}</Text>
          <Text>{t('upload_hint', { maxSize, maxCount })}</Text>
        </Space>
      </Dragger>

      {fileList.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Text strong>{t('uploaded_files')}:</Text>
          <List
            size='small'
            dataSource={fileList}
            renderItem={(file) => (
              <List.Item
                actions={[
                  <Button
                    key='delete'
                    type='text'
                    size='small'
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove()}
                  />,
                ]}
              >
                <Space>
                  <Text>{file.multimedia_name}</Text>
                </Space>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  )
}

FileUpload.displayName = 'FileUpload'

export default FileUpload
