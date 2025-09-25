'use client'

import type { ModalProps } from 'antd'
import type { FCC } from 'src/types'
import { Modal } from 'antd'
import { useState } from 'react'

type ModalWrapperProps = {
  trigger: React.ReactNode
  children: React.ReactNode
  title?: string
  width?: number | string
  footer?: React.ReactNode | null
  destroyOnClose?: boolean
  centered?: boolean
  className?: string
  modalProps?: Partial<ModalProps>
  onOpen?: () => void
  onClose?: () => void
}

const ModalWrapper: FCC<ModalWrapperProps> = ({
  trigger,
  children,
  title,
  width = 520,
  footer,
  destroyOnClose = true,
  centered = true,
  className,
  modalProps,
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
    onOpen?.()
  }

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  return (
    <>
      <div
        style={{ display: 'inline-block', cursor: 'pointer', width: '100%' }}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleOpen()
          }
        }}
        role='button'
        tabIndex={0}
      >
        {trigger}
      </div>

      <Modal
        title={title}
        open={isOpen}
        width={width}
        footer={footer}
        destroyOnClose={destroyOnClose}
        centered={centered}
        className={className}
        onCancel={handleClose}
        {...modalProps}
      >
        {children}
      </Modal>
    </>
  )
}

ModalWrapper.displayName = 'ModalWrapper'

export default ModalWrapper
