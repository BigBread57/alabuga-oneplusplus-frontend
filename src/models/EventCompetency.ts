import type { BaseModelProps } from './Base'
import { BaseModel } from './Base'

export interface EventCompetencyProps extends BaseModelProps {
  event: string
  competency: string
  experience: number
}

enum EventCompetencyUrl {
  COMPETENCY = '/game-world/event-competency',
  COMPETENCIES = '/game-world/event-competencies',
}

export class EventCompetency extends BaseModel {
  static override modelName = 'eventCompetency'

  static override url() {
    return EventCompetencyUrl.COMPETENCIES
  }
}
