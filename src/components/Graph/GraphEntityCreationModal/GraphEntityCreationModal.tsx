import type { FCC } from 'src/types'
import { Button, Form, Input, Modal, Space } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

export interface EntityData {
  title: string
  description: string
}

export type EntityType
  = | 'rang'
    | 'missionBranch'
    | 'mission'
    | 'artefact'
    | 'competency'
    | 'event'

interface EntityCreationModalProps {
  visible: boolean
  entityType: EntityType | null
  onConfirm: (entityType: EntityType, data: EntityData) => void
  onCancel: () => void
}

const EntityCreationModal: FCC<EntityCreationModalProps> = ({
  visible,
  entityType,
  onConfirm,
  onCancel,
}) => {
  const t = useTranslations('Graph')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Сброс формы при открытии/закрытии модального окна
  useEffect(() => {
    if (visible && entityType) {
      form.resetFields()
      // Устанавливаем значения по умолчанию
      form.setFieldsValue({
        title: '',
        description: '',
      })
    }
  }, [visible, entityType, form])

  const handleConfirm = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      if (entityType) {
        onConfirm(entityType, {
          title: values.title.trim(),
          description: values.description.trim(),
        })
      }

      form.resetFields()
    } catch (error) {
      console.error('Validation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  const getEntityLabel = (type: EntityType | null): string => {
    if (!type) {
      return ''
    }
    return t(`entities.${type}`, { fallback: type })
  }

  const getDefaultTitle = (type: EntityType | null): string => {
    if (!type) {
      return ''
    }
    const entityLabel = getEntityLabel(type)
    return `${entityLabel} ${Date.now().toString().slice(-4)}` // Добавляем последние 4 цифры timestamp для уникальности
  }

  const getDefaultDescription = (type: EntityType | null): string => {
    const descriptions = {
      rang: t('entities.descriptions.rang', { fallback: 'Rank description' }),
      missionBranch: t('entities.descriptions.missionBranch', {
        fallback: 'Mission branch description',
      }),
      mission: t('entities.descriptions.mission', {
        fallback: 'Mission description',
      }),
      artefact: t('entities.descriptions.artefact', {
        fallback: 'Artefact description',
      }),
      competency: t('entities.descriptions.competency', {
        fallback: 'Competency description',
      }),
      event: t('entities.descriptions.event', {
        fallback: 'Event description',
      }),
    }
    return type ? descriptions[type] : ''
  }

  return (
    <Modal
      title={`${t('create', { fallback: 'Create' })} ${getEntityLabel(entityType)}`}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          {t('cancel', { fallback: 'Cancel' })}
        </Button>,
        <Button
          key='confirm'
          type='primary'
          loading={loading}
          onClick={handleConfirm}
        >
          {t('create', { fallback: 'Create' })}
        </Button>,
      ]}
      width={500}
      destroyOnClose
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          title: getDefaultTitle(entityType),
          description: getDefaultDescription(entityType),
        }}
      >
        <Form.Item
          label={t('entity_title', { fallback: 'Title' })}
          name='title'
          rules={[
            {
              required: true,
              message: t('title_required', {
                fallback: 'Please enter a title',
              }),
            },
            {
              min: 2,
              message: t('title_min_length', {
                fallback: 'Title must be at least 2 characters',
              }),
            },
            {
              max: 50,
              message: t('title_max_length', {
                fallback: 'Title must not exceed 50 characters',
              }),
            },
          ]}
        >
          <Input
            placeholder={t('enter_title', { fallback: 'Enter title...' })}
          />
        </Form.Item>

        <Form.Item
          label={t('entity_description', { fallback: 'Description' })}
          name='description'
          rules={[
            {
              max: 200,
              message: t('description_max_length', {
                fallback: 'Description must not exceed 200 characters',
              }),
            },
          ]}
        >
          <Input.TextArea
            placeholder={t('enter_description', {
              fallback: 'Enter description...',
            })}
            rows={3}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Space direction='vertical' style={{ width: '100%', marginTop: 16 }}>
          <Button
            type='dashed'
            block
            onClick={() => {
              form.setFieldsValue({
                title: getDefaultTitle(entityType),
                description: getDefaultDescription(entityType),
              })
            }}
          >
            {t('use_default_values', { fallback: 'Use Default Values' })}
          </Button>
        </Space>
      </Form>
    </Modal>
  )
}

EntityCreationModal.displayName = 'EntityCreationModal'

export default EntityCreationModal
