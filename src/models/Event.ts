import type { BaseModelProps } from './Base'
import type { EventCategoryProps } from '@/models/EventCategory'
import type { GameWorldStoryProps } from '@/models/GameWorldStory'
import { BaseModel } from './Base'

export interface EventProps extends BaseModelProps {
  icon: string
  name: string
  description: string
  experience: number
  currency: number
  order: number
  is_key_mission: boolean
  game_world_stories: GameWorldStoryProps[]
  required_number: number
  start_datetime: string
  time_to_complete: number
  end_datetime: string | null
  category: EventCategoryProps
}

enum EventUrl {
  EVENT = '/game-world/event',
  EVENTS = '/game-world/events',
}

export class Event extends BaseModel {
  static override modelName = 'event'

  static override url() {
    return EventUrl.EVENTS
  }
}
