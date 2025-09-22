import type { FCC } from '@/types'
import Image from 'next/image'
import React from 'react'
import styles from './ImageContainer.module.scss'

type ImageContainerProps = {
  src: string
  alt: string
  width?: string | number
  height?: string | number
}

const ImageContainer: FCC<ImageContainerProps> = ({
  src,
  alt,
  width,
  height,
}) => {
  return (
    <div className={styles.container}>
      <Image
        src={src}
        alt={alt}
        style={{
          width,
          height,
        }}
        className={styles.image}
      />
    </div>
  )
}

ImageContainer.displayName = 'ImageContainer'

export default ImageContainer
