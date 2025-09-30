import type { BaseModelProps } from './Base'
import type { CharacterEventStatus } from '@/models/CharacterEvent'
import type { EventProps } from '@/models/Event'
import { BaseModel } from './Base'

export interface CharacterEventForInspectorProps extends BaseModelProps {
  event: EventProps
  status: CharacterEventStatus
  status_display_name: string
  start_datetime: string
  end_datetime: string | null
  content_type_id: number
  result: string
}

enum EventUrl {
  EVENT = '/user/character-event',
  EVENTS = '/user/character-events',
}

export class CharacterEventForInspector extends BaseModel {
  static override modelName = 'characterEventForInspector'

  static override url() {
    return `${EventUrl.EVENTS}/for-inspector`
  }

  static updateForInspectorUrl(id: string | number) {
    return `${EventUrl.EVENTS}/${id}/update/for-inspector/`
  }
}
