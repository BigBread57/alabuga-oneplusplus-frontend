import type { FCC } from 'src/types'
import { Card, Image, Space, Tag, Typography } from 'antd'
// src/components/Competence/Competence.tsx
import React from 'react'
import styles from './Competence.module.scss'

const { Text, Paragraph } = Typography
export type CompetenceModel = {
  id: string
  name: string
  description?: string
  required_experience: number
  icon: string // URL картинки
  color?: string
  parent?: string | null
  game_world?: string
}
export type CompetenceProps = {
  competence: CompetenceModel
}

export const Competence: FCC<CompetenceProps> = ({ competence }) => {
  return (
    <Card
      className={styles.card}
      data-testid={`competence-${competence.id}`}
      size='small'
      hoverable
      style={{ borderTop: `4px solid ${competence.color || '#1677ff'}` }}
    >
      <Space direction='vertical' size='small' style={{ width: '100%' }}>
        <Image
          src={competence.icon}
          alt={competence.name}
          preview={false}
          className={styles.icon}
          height={48}
        />
        <Text strong>{competence.name}</Text>
        {competence.description && (
          <Paragraph ellipsis={{ rows: 3 }}>{competence.description}</Paragraph>
        )}
        <Tag color='blue'>{competence.required_experience} XP</Tag>
      </Space>
    </Card>
  )
}

Competence.displayName = 'Competence'

export default Competence
