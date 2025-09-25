import type { BaseModelProps } from '@/models/Base'
import type { GameWorldProps } from '@/models/GameWorld'
import { BaseModel } from '@/models/Base'

export interface GameWorldStoryProps extends BaseModelProps {
  id: string | number
  image?: string | null
  text: string
  game_world: GameWorldProps
  contentType: number
  object_id: number
}

enum GameWorldStoryUrl {
  GAME_WORLD_STORY_ITEM = '/game-world/story',
  GAME_WORLD_STORY_ITEMS = '/game-world/stories',
}

export class GameWorldStory extends BaseModel {
  static override modelName = 'gameWorldStory'

  static override url() {
    return GameWorldStoryUrl.GAME_WORLD_STORY_ITEMS
  }
}
