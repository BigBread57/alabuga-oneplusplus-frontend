import type { BaseModelProps } from '@/models/Base'
import type { GameWorldProps } from '@/models/GameWorld'
import type { RankProps } from '@/models/Rank'
import type { UserProps } from '@/models/User'
import { BaseModel } from '@/models/Base'

// Category types
export interface CategoryProps extends BaseModelProps {
  name: string
  description: string
  icon: string
  color: string
}

export interface CharacterRank extends BaseModelProps {
  rank: RankProps
  next_rank?: RankProps | null
  experience: number
}

// Main Character interface
export interface CharacterProps extends BaseModelProps {
  avatar: string
  currency: number
  is_active: boolean
  user: UserProps
  game_world: GameWorldProps
  character_rank: CharacterRank
  next_rank?: RankProps | null
}

enum CharacterUrl {
  CHARACTER = '/user/character',
  CHARACTERS = '/user/characters',
  ACTUAL_FOR_USER = '/user/characters/actual-for-user',
}

export class Character extends BaseModel {
  static override modelName = 'character'

  static override url() {
    return CharacterUrl.CHARACTER
  }

  static actualForUserUrl() {
    return CharacterUrl.ACTUAL_FOR_USER
  }

  static updateUrl() {
    return `${this.url()}/update/`
  }
}
