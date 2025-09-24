import type { BaseModelProps } from './Base'
import type { GameWorldProps } from './GameWorld'
import { BaseModel } from './Base'

export interface RankProps extends BaseModelProps {
  name: string
  description: string
  required_experience: number
  icon: string
  color: string
  parent?: RankProps | null
  game_world: GameWorldProps
  children?: RankProps[]
}

enum RankUrl {
  RANK = '/game/rank',
  RANKS = '/game/ranks',
}

export class Rank extends BaseModel {
  static override modelName = 'rank'

  static override url() {
    return RankUrl.RANKS
  }
}
