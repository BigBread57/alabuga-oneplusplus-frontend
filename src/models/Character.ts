import type { BaseModelProps } from '@/models/Base'
import type { GameWorldProps } from '@/models/GameWorld'
import type { UserProps } from '@/models/User'
import { BaseModel } from '@/models/Base'

// Category types
export interface CategoryProps extends BaseModelProps {
  name: string
  description: string
  icon: string
  color: string
}

export type RankProps = Record<string, string>

// Main Character interface
export interface CharacterProps extends BaseModelProps {
  avatar: string
  currency: number
  is_active: boolean
  user: UserProps
  game_world: GameWorldProps
  rank: RankProps
}

enum CharacterUrl {
  CHARACTER = '/user/character',
  CHARACTERS = '/user/characters',
  ACTUAL_FOR_USER = '/user/characters/actual-for-user',
}

export class Character extends BaseModel {
  static override modelName = 'character'

  static override url() {
    return CharacterUrl.ACTUAL_FOR_USER
  }
}
