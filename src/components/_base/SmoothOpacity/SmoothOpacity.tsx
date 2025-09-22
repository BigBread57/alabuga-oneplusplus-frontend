import type { CSSProperties } from 'react'
import type { FCC } from '@/types'
import React from 'react'

import styles from './SmoothOpacity.module.scss'

type SmoothOpacityProps = {
  style?: CSSProperties
}
const SmoothOpacity: FCC<SmoothOpacityProps> = ({ children, style }) => {
  return (
    <div className={styles.container} style={style}>
      {children}
    </div>
  )
}

SmoothOpacity.displayName = 'SmoothOpacity'

export default SmoothOpacity
