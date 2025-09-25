import type { ArtifactProps } from './Artifact'
import type { BaseModelProps } from './Base'
import type { CompetencyProps } from './Competency'
import type { GameWorldProps } from './GameWorld'
import type { MissionBranchProps } from './MissionBranch'
import type { MissionLevelProps } from './MissionLevel'
import { BaseModel } from './Base'

export interface MissionProps extends BaseModelProps {
  icon: string
  name: string
  description: string
  experience: number
  currency: number
  order: number
  is_key_mission: boolean
  is_active: boolean
  time_to_complete?: number | null
  branch: MissionBranchProps
  level: MissionLevelProps
  required_missions?: MissionProps[]
  unlocks_missions?: MissionProps[]
  artifacts?: ArtifactProps[]
  competencies?: CompetencyProps[]
  game_world: GameWorldProps
}

enum MissionUrl {
  MISSION = '/game/mission',
  MISSIONS = '/game/missions',
}

export class Mission extends BaseModel {
  static override modelName = 'mission'

  static override url() {
    return MissionUrl.MISSIONS
  }
}
