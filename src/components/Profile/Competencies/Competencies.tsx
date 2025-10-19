import type { FCC } from 'src/types'
import React from 'react'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { Competence } from '@/components/Profile/Competence'
import { useTour } from '@/components/Tour/useTour'
import { CharacterCompetency } from '@/models/CharacterCompetence'

const MODEL = CharacterCompetency

export const CompetenceList: FCC = () => {
  const { competenciesSectionRef } = useTour()
  return (
    <FetchMoreItemsComponent
      model={MODEL}
      defFilters={{}}
      isClearRender
      renderItems={({ data, isLoading }) => (
        <div
          className='flex gap-4 overflow-x-auto pb-2'
          data-testid='test-CompetenceList'
        >
          {data?.map((item) => (
            <div
              key={item.id}
              ref={competenciesSectionRef}
              className='flex-shrink-0'
            >
              <Competence isLoading={isLoading} data={item} />
            </div>
          ))}
        </div>
      )}
    />
  )
}

CompetenceList.displayName = 'CompetenceList'

export default CompetenceList
