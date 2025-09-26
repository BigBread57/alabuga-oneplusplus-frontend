'use client'

import type { ModalProps } from 'antd'
import type { ReactNode } from 'react'
import type { FCC } from 'src/types'
import { Modal } from 'antd'
import { useTranslations } from 'next-intl'

type ModalConfirmProps = {
  open: boolean
  title?: ReactNode
  content?: ReactNode
  okText?: string
  cancelText?: string
  onOk?: () => void | Promise<void>
  onCancel?: () => void
  loading?: boolean
  danger?: boolean
} & Omit<
  ModalProps,
  'open' | 'title' | 'onOk' | 'onCancel' | 'okText' | 'cancelText'
>

const ModalConfirm: FCC<ModalConfirmProps> = ({
  children,
  open,
  title,
  content,
  okText,
  cancelText,
  onOk,
  onCancel,
  loading = false,
  danger = false,
  ...modalProps
}) => {
  const t = useTranslations('ModalConfirm')

  const handleOk = async () => {
    try {
      await onOk?.()
    } catch (error) {
      console.error('Modal confirm error:', error)
    }
  }

  return (
    <Modal
      open={open}
      title={title || t('confirm')}
      okText={okText || t('ok')}
      cancelText={cancelText || t('cancel')}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okType={danger ? 'danger' : 'primary'}
      centered
      {...modalProps}
    >
      {content || children}
    </Modal>
  )
}

ModalConfirm.displayName = 'ModalConfirm'

export default ModalConfirm
export type { ModalConfirmProps }
