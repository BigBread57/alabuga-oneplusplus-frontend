import type { BaseModelProps } from './Base'
import { BaseModel } from './Base'

export interface EventCategoryProps extends BaseModelProps {
  name: string
  description: string
  icon: string | null
  color: string
}

enum EventCategoryUrl {
  CATEGORY = '/game-world/mission-category',
  CATEGORIES = '/game-world/mission-categories',
}

export class EventCategory extends BaseModel {
  static override modelName = 'eventCategory'

  static override url() {
    return EventCategoryUrl.CATEGORIES
  }
}
