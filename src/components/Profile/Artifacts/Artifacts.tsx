'use client'

import type { FCC } from 'src/types'
import { Space } from 'antd'
import React from 'react'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { Artifact } from '@/components/Profile/Artifact'
import { Artifact as Model } from '@/models/Artifact'
import styles from './Artifacts.module.scss'

const MODEL = Model

const ArtifactsList: FCC = () => {
  return (
    <FetchMoreItemsComponent
      model={MODEL}
      defFilters={{}}
      isClearRender
      renderItems={({ data }) => (
        <div className={styles.container} data-testid='test-ArtifactsList'>
          <Space direction='horizontal' size='middle'>
            {data?.map((item) => (
              <Artifact key={item.id} {...item} />
            ))}
          </Space>
        </div>
      )}
    />
  )
}

ArtifactsList.displayName = 'ArtifactsList'

export default ArtifactsList
