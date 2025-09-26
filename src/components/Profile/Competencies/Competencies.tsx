import type { FCC } from 'src/types'
import type { CompetenceModel } from '@/components/Profile/Competence/Competence'
import { Space } from 'antd'
import React from 'react'
import { Competence } from '@/components/Profile/Competence'
import styles from './Competencies.module.scss'

type CompetenceListProps = {
  items: CompetenceModel[]
}

export const CompetenceList: FCC<CompetenceListProps> = ({ items }) => {
  return (
    <div className={styles.container} data-testid='test-CompetenceList'>
      <Space direction='horizontal' size='middle'>
        {items.map((item) => (
          <Competence key={item.id} competence={item} />
        ))}
      </Space>
    </div>
  )
}

CompetenceList.displayName = 'CompetenceList'

export default CompetenceList
