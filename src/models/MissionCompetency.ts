import type { BaseModelProps } from './Base'
import { BaseModel } from './Base'

export interface MissionCompetencyProps extends BaseModelProps {
  mission: string
  competency: string
  experience: number
}

enum MissionCompetencyUrl {
  COMPETENCY = '/game-world/mission-competency',
  COMPETENCIES = '/game-world/mission-competencies',
}

export class MissionCompetency extends BaseModel {
  static override modelName = 'missionCompetency'

  static override url() {
    return MissionCompetencyUrl.COMPETENCIES
  }
}
