import type { BaseModelProps } from './Base'
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
  branch: MissionBranchProps
  level: MissionLevelProps
  game_world?: GameWorldProps
  game_world_stories: string[]
  is_active: true
  time_to_complete: number
  required_missions: Record<string, any>[]
  artifacts: Record<string, any>[]
  competencies: Record<string, any>[]
}

enum MissionUrl {
  MISSION = '/game-world/mission',
  MISSIONS = '/game-world/missions/list',
}

export class Mission extends BaseModel {
  static override modelName = 'mission'

  static override url() {
    return MissionUrl.MISSIONS
  }
}
