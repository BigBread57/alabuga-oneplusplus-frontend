import type { BaseModelProps } from './Base'
import type { CharacterMissionProps } from '@/models/CharacterMission'
import type { MissionProps } from '@/models/Mission'
import type { MissionBranchProps } from '@/models/MissionBranch'
import { BaseModel } from './Base'

export interface CharacterMissionBranchProps extends BaseModelProps {
  status: string
  status_display_name: string
  start_datetime: string
  end_datetime: string | null
  content_type_id: number
  mission: MissionProps
  branch: MissionBranchProps
  character_missions: CharacterMissionProps[]
}

enum CharacterMissionBranchUrl {
  CHARACTER_MISSION_BRANCH = '/user/character-mission-branch',
  CHARACTER_MISSION_BRANCHES = '/user/character-mission-branches',
}

export class CharacterMissionBranch extends BaseModel {
  static override modelName = 'characterMissionBranch'

  static override url() {
    return CharacterMissionBranchUrl.CHARACTER_MISSION_BRANCHES
  }
}
