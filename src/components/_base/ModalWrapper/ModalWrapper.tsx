import type { FCC } from '@/types'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Modal, Row } from 'antd'
import React from 'react'

import styles from './ModalWrapper.module.scss'

type ModalWrapperProps = {
  open: boolean
  isLoading?: boolean
  onCancel: () => void
  onClose?: () => void
  onOk: () => void
  okText?: string
  cancelText?: string
  title?: string
}

const ModalWrapper: FCC<ModalWrapperProps> = ({
  children,
  onCancel,
  onOk,
  isLoading,
  open,
  okText,
  cancelText,
  title,
  onClose,
}) => {
  return (
    <Modal
      width={800}
      height={800}
      loading={isLoading}
      open={open}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{
        className: styles.modalButton,
      }}
      closable={!onClose}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Row justify="space-between">
        {title ? <h2>{title}</h2> : <div />}
        {onClose
          ? (
              <Button
                shape="circle"
                type="text"
                icon={<CloseOutlined />}
                onClick={onClose}
              />
            )
          : null}
      </Row>
      {children}
    </Modal>
  )
}

ModalWrapper.displayName = 'ModalWrapper'

export default ModalWrapper
