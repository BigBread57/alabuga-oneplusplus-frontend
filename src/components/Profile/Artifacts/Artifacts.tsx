'use client'

import type { FCC } from 'src/types'
import type { ArtifactModel } from '@/components/Profile/Artifact/Artifact'
import { Space } from 'antd'
import React from 'react'
import { Artifact } from '@/components/Profile/Artifact'
import styles from './Artifacts.module.scss'

type ArtifactsListProps = {
  items: ArtifactModel[]
}

const ArtifactsList: FCC<ArtifactsListProps> = ({ items }) => {
  return (
    <div className={styles.container} data-testid='test-ArtifactsList'>
      <Space direction='horizontal' size='middle'>
        {items?.map((artifact) => (
          <Artifact key={artifact.id} {...artifact} />
        ))}
      </Space>
    </div>
  )
}

ArtifactsList.displayName = 'ArtifactsList'

export default ArtifactsList
