import type { BaseModelProps } from './Base'
import type { GameWorldProps } from './GameWorld'
import { BaseModel } from './Base'

export interface CompetencyProps extends BaseModelProps {
  name: string
  description: string
  required_experience: number
  icon: string
  color: string
  parent?: CompetencyProps | null
  game_world: GameWorldProps
  children?: CompetencyProps[]
}

enum CompetencyUrl {
  COMPETENCY = '/game/competency',
  COMPETENCIES = '/game/competencies',
}

export class Competency extends BaseModel {
  static override modelName = 'competency'
  static override url() {
    return CompetencyUrl.COMPETENCIES
  }
}
