import type { ArtifactProps } from './Artifact'
import type { BaseModelProps } from './Base'
import type { CompetencyProps } from './Competency'
import type { GameWorldProps } from './GameWorld'
import type { EventProps } from '@/models/Event'
import { BaseModel } from './Base'

// Enum для статуса события
export enum CharacterEventStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  NEED_IMPROVEMENT = 'NEED_IMPROVEMENT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  FAILED = 'FAILED',
}

export interface CharacterEventProps extends BaseModelProps {
  event: EventProps
  status: CharacterEventStatus
  status_display_name: string
  start_datetime: string
  end_datetime: string | null
  content_type_id: number
  artifact?: ArtifactProps | null
  competency?: CompetencyProps | null
  game_world?: GameWorldProps | null
}

// Альтернативный вариант с union type вместо enum
export type CharacterEventStatusType
  = | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'NEED_IMPROVEMENT'
    | 'PENDING_REVIEW'
    | 'FAILED'

// Интерфейс с union type
export interface CharacterEventQueryParamsUnion {
  limit?: number
  offset?: number
  ordering?: string
  search?: string
  status?: CharacterEventStatusType
}

enum EventUrl {
  EVENT = '/user/character-event',
  EVENTS = '/user/character-events',
}

export class CharacterEvent extends BaseModel {
  static override modelName = 'characterEvent'

  static override url() {
    return EventUrl.EVENTS
  }

  static updateForCharacterUrl(id: number) {
    return `${this.url()}/${id}/update/for-character/`
  }

  static listForInspectorUrl(id: number) {
    return `${this.url()}/${id}/list/for-inspector/`
  }

  static updateForInspectorUrl(id: number) {
    return `${this.url()}/${id}/update/for-inspector/`
  }
}
