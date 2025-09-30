import type { BaseModelProps } from './Base'
import type { CharacterMissionStatus } from '@/models/CharacterMission'
import type { MissionProps } from '@/models/Mission'
import { BaseModel } from './Base'

export interface CharacterMissionForInspectorProps extends BaseModelProps {
  mission: MissionProps
  status: CharacterMissionStatus
  status_display_name: string
  start_datetime: string
  end_datetime: string | null
  content_type_id: number
  result: string
  inspector_comment: string
}

enum MissionUrl {
  MISSION = '/user/character-mission',
  MISSIONS = '/user/character-missions',
}

export class CharacterMissionForInspector extends BaseModel {
  static override modelName = 'characterMissionForInspector'

  static override url() {
    return `${MissionUrl.MISSIONS}/for-inspector`
  }

  static updateForInspectorUrl(id: string | number) {
    return `${MissionUrl.MISSIONS}/${id}/update/for-inspector/`
  }
}
