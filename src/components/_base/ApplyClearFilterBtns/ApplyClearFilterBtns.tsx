import type { FCC } from '@/types'
import { Button, Space } from 'antd'
import React from 'react'

import styles from './style.module.scss'

type ApplyClearFilterBtnsProps = {
  onClear: () => void
  onApply: () => void
  textClearBtn?: string
  textApplyBtn?: string
}
export const ApplyClearFilterBtns: FCC<ApplyClearFilterBtnsProps> = ({
  onApply,
  onClear,
  textApplyBtn,
  textClearBtn,
}) => {
  return (
    <Space className={styles.container}>
      <Button type='link' danger onClick={onClear}>
        {textClearBtn || 'Очистить'}
      </Button>
      <Button type='primary' onClick={onApply}>
        {textApplyBtn || 'Применить'}
      </Button>
    </Space>
  )
}

ApplyClearFilterBtns.displayName = 'ApplyClearFilterBtns'

export default ApplyClearFilterBtns
