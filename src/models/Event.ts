import type { BaseModelProps } from './Base'
import { BaseModel } from './Base'

export interface EventProps extends BaseModelProps {
  icon: string
  name: string
  description: string
  experience: number
  currency: number
  order: number
  is_key_mission: boolean
  game_world_stories: string[]
  required_number: number
  start_datetime: string
  time_to_complete: number
  end_datetime: string | null
}

enum EventUrl {
  EVENTS = '/game-world/events/list',
  EVENT = '/game-world/events',
}

export class Event extends BaseModel {
  static override modelName = 'event'

  static override url() {
    return EventUrl.EVENTS
  }
}
