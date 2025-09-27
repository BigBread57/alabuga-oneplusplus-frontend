import type { BaseModelProps } from './Base'
import type { MissionProps } from '@/models/Mission'
import { BaseModel } from './Base'

// Enum для статуса миссии
export enum CharacterMissionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  NEED_IMPROVEMENT = 'NEED_IMPROVEMENT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  FAILED = 'FAILED',
}

// Интерфейс для параметров запроса миссий персонажа
export interface CharacterMissionQueryParams {
  limit?: number
  offset?: number
  ordering?: string
  search?: string
  status?: CharacterMissionStatus
}

export interface CharacterMissionProps extends BaseModelProps {
  mission: MissionProps
  status: CharacterMissionStatus
  status_display_name: string
  start_datetime: string
  end_datetime: string | null
  content_type_id: number
  result: string
}

// Альтернативный вариант с union type вместо enum
export type CharacterMissionStatusType
  = | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'NEED_IMPROVEMENT'
    | 'PENDING_REVIEW'
    | 'FAILED'

enum MissionUrl {
  MISSION = '/user/character-mission',
  MISSIONS = '/user/character-missions',
}

export class CharacterMission extends BaseModel {
  static override modelName = 'characterMission'

  static override url() {
    return `${MissionUrl.MISSIONS}`
  }

  static updateForCharacterUrl(id: number) {
    return `${this.url()}/${id}/update-for-character/`
  }

  static updateForInspectorUrl(id: number) {
    return `${this.url()}/${id}/update-for-inspector/`
  }
}
