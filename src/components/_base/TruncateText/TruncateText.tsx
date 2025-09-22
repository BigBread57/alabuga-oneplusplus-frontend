import type { FCC } from '@/types'
import { Button } from 'antd'
import React, { useState } from 'react'

import styles from './TruncateText.module.scss'

type TruncateTextProps = {
  text: string
  length: number
}

const TruncateText: FCC<TruncateTextProps> = ({ text, length }) => {
  const [isTruncated, setIsTruncated] = useState(true)

  const truncatedText = isTruncated ? `${text?.slice(0, length)}...` : text

  const toggleTruncated = () => {
    setIsTruncated(!isTruncated)
  }

  return (
    <div className={styles.container} data-testid='test-TruncateText'>
      <p>
        {truncatedText}
        <Button
          size='small'
          type='link'
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleTruncated()
          }}
        >
          {isTruncated ? 'Еще' : 'Скрыть'}
        </Button>
      </p>
    </div>
  )
}

TruncateText.displayName = 'TruncateText'

export default TruncateText
