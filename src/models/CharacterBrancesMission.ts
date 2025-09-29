import type { BaseModelProps } from './Base'
import type { CharacterMissionProps } from '@/models/CharacterMission'
import type { MissionProps } from '@/models/Mission'
import type { MissionBranchProps } from '@/models/MissionBranch'
import { BaseModel } from './Base'

export interface CharacterBranchesMissionProps extends BaseModelProps {
  status: string
  status_display_name: string
  start_datetime: string
  end_datetime: string | null
  content_type_id: number
  mission: MissionProps
  branch: MissionBranchProps
  character_missions: CharacterMissionProps[]
}

enum CharacterBranchesMissionUrl {
  CHARACTER_BRANCH_MISSION = '/user/character-mission-branch',
  CHARACTER_BRANCH_MISSIONS = '/user/character-mission-branches',
}

export class CharacterBranchesMission extends BaseModel {
  static override modelName = 'characterBranchesMission'

  static override url() {
    return CharacterBranchesMissionUrl.CHARACTER_BRANCH_MISSIONS
  }
}
