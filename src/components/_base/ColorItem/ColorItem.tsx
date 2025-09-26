import type { FCC } from 'src/types'
import React from 'react'
import styles from './ColorItem.module.scss'

interface ColorItemProps {
  color?: any
}

const ColorItem: FCC<ColorItemProps> = ({ children, color }) => {
  return (
    <div className={styles.placeholder} style={{ backgroundColor: color }}>
      {children}
    </div>
  )
}

ColorItem.displayName = 'ColorItem'

export default ColorItem
