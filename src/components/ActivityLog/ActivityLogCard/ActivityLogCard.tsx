'use client'

import type { FCC } from 'src/types'
import { Card } from 'antd'
import React from 'react'
import styles from './ActivityLogCard.module.scss'

type ActivityLogProps = {
  id: number
  character: number
  text: string
  content_type: {
    id: number
    name: string
  }
  object_id: number
  created_at: string | null
}

const ActivityLogCard: FCC<ActivityLogProps> = ({ text, created_at }) => {
  return (
    <>
      <Card style={{ width: '100%' }}>
        <p>{text}</p>
        <p className={styles.createdAt}>{created_at}</p>
      </Card>
    </>
  )
}

ActivityLogCard.displayName = 'ActivityLogCard'

export default ActivityLogCard
