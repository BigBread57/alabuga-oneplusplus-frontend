import type { BaseModelProps } from './Base'
import { BaseModel } from './Base'

export interface MissionLevelProps extends BaseModelProps {
  name: string
  description: string
  icon: string
  color: string
  multiplier_experience: number
  multiplier_currency: number
}

enum MissionLevelUrl {
  MISSION_LEVEL = '/game/mission-level',
  MISSION_LEVELS = '/game/mission-levels',
}

export class MissionLevel extends BaseModel {
  static override modelName = 'missionLevel'

  static override url() {
    return MissionLevelUrl.MISSION_LEVELS
  }
}
