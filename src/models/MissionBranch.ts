import type { BaseModelProps } from './Base'
import type { GameWorldProps } from './GameWorld'
import type { RankProps } from './Rank'
import { BaseModel } from './Base'

export interface MissionBranchProps extends BaseModelProps {
  name: string
  description: string
  icon: string
  color: string
  is_active: boolean
  start_datetime?: string | null
  time_to_complete?: number | null
  rank: RankProps
  // category: ActivityCategoryProps
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
