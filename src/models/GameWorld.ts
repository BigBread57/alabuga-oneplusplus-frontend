import type { BaseModelProps } from './Base'
import { BaseModel } from './Base'

export interface GameWorldProps extends BaseModelProps {
  name: string
  description: string
  color: string
  standard_experience: number
  standard_currency: number
  currency_name: string
}

enum GameWorldUrl {
  GAME_WORLDS = 'game-world/game-worlds',
}

export class GameWorld extends BaseModel {
  static override modelName = 'gameWorld'

  static override url() {
    return GameWorldUrl.GAME_WORLDS
  }

  static statisticsUrl(id: number) {
    return `${this.url()}/${id}/statistics`
  }

  static allInfoUrl(id: number) {
    return `${this.url()}/${id}/list-with-all-entities/`
  }

  // /api/v1/game-world/game-worlds/{id}/update-or-create-all-entities/
  static updateOrCreateAllEntitiesUrl(id: number) {
    return `${this.url()}/${id}/update-or-create-all-entities/`
  }
}
