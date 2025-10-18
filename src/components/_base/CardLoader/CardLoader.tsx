import type { FCC } from 'src/types'
import React from 'react'
import { RocketLoader } from '@/components/_base/RocketLoader'

interface CardLoaderProps {
  isLoading: boolean
}

const CardLoader: FCC<CardLoaderProps> = ({ isLoading, children }) => {
  if (!isLoading) {
    return children
  }
  return <RocketLoader />
}

CardLoader.displayName = 'CardLoader'

export default CardLoader
