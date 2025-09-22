import type { FCC } from '@/types'
import React from 'react'

import styles from './style.module.scss'

type IconAsButtonProps = {
  icon: any
} & React.HTMLAttributes<HTMLButtonElement>
export const IconAsButton: FCC<IconAsButtonProps> = ({
  icon: Icon,
  ...rest
}) => {
  return <Icon className={styles.icon} {...rest} />
}

IconAsButton.displayName = 'IconAsButton'

export default IconAsButton
