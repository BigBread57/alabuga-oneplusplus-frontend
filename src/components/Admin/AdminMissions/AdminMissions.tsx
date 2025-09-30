import type { FCC } from 'src/types'
import React from 'react'
import { CharacterActivity } from '@/components/Character/CharacterActivity'

const AdminMissions: FCC = () => {
  return (
    <div
      style={{
        height: 'calc(100vh - 130px)',
      }}
    >
      <CharacterActivity />
    </div>
  )
}

AdminMissions.displayName = 'AdminMissions'

export default AdminMissions
