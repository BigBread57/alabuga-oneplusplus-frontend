import React from 'react'
import type { FCC } from 'src/types'

interface EmojiIconProps {
  size?: string | number
}

const EmojiIcon: FCC<EmojiIconProps> = ({ children, size = '16px' }) => {
  return (
    <span
      data-testid='test-EmojiIcon'
      style={{ fontSize: size, margin: '4px' }}
    >
      {children}
    </span>
  )
}

EmojiIcon.displayName = 'EmojiIcon'

export default EmojiIcon
