import type { BaseModelProps } from './Base'
import type { CompetencyProps } from './Competency'
import { BaseModel } from './Base'

export interface CharacterCompetencyProps extends BaseModelProps {
  competency: CompetencyProps
  experience: number
  is_received: boolean
}

enum CompetencyUrl {
  COMPETENCY = '/user/character-competency',
  COMPETENCIES = '/user/character-competencies',
}

export class CharacterCompetency extends BaseModel {
  static override modelName = 'characterCompetency'

  static override url() {
    return CompetencyUrl.COMPETENCIES
  }
}
