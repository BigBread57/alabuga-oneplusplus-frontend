import type { FCC } from 'src/types'
import React from 'react'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { Competence } from '@/components/Profile/Competence'
import { CharacterCompetency } from '@/models/CharacterCompetence'
import styles from './Competencies.module.scss'

const MODEL = CharacterCompetency

export const CompetenceList: FCC = () => {
  return (
    <FetchMoreItemsComponent
      model={MODEL}
      defFilters={{}}
      isClearRender
      renderItems={({ data, isLoading }) => (
        <div className={styles.container} data-testid='test-ArtifactsList'>
          {data?.map((item) => (
            <Competence isLoading={isLoading} key={item.id} data={item} />
          ))}
        </div>
      )}
    />
  )
}

CompetenceList.displayName = 'CompetenceList'

export default CompetenceList
