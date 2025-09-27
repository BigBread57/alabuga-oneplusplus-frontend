import type { BaseModelProps } from './Base'
import type { GameWorldProps } from './GameWorld'
import { BaseModel } from './Base'

export interface ActivityCategoryProps {
  id: number
  name: string
  description: string
  icon: string | null
  color: string
}

export interface MissionBranchProps extends BaseModelProps {
  name: string
  description: string
  icon: string
  color: string
  is_active: boolean

  category: ActivityCategoryProps
  // mentor?: UserProps | null
  game_world: GameWorldProps
}

enum MissionBranchUrl {
  MISSION_BRANCH = '/game/mission-branch',
  MISSION_BRANCHES = '/game/mission-branches',
}

export class MissionBranch extends BaseModel {
  static override modelName = 'missionBranch'

  static override url() {
    return MissionBranchUrl.MISSION_BRANCHES
  }
}
