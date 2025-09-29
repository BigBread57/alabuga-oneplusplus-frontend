import type { BaseModelProps } from './Base'
import type { GameWorldProps } from './GameWorld'
import type { GameWorldStoryProps } from './GameWorldStory'
import { BaseModel } from './Base'

export interface CompetencyProps extends BaseModelProps {
  name: string
  description: string
  required_experience: number
  icon: string | null
  level: number
  color: string
  parent: CompetencyProps | null
  game_world: GameWorldProps
  children?: CompetencyProps[]
  game_world_stories: GameWorldStoryProps[]
}

enum CompetencyUrl {
  COMPETENCY = '/game-mechanics/competency',
  COMPETENCIES = '/game-mechanics/competencies',
}

export class Competency extends BaseModel {
  static override modelName = 'competency'
  static override url() {
    return CompetencyUrl.COMPETENCIES
  }
}
