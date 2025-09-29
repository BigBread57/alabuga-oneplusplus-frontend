import type { BaseModelProps } from './Base'
import type { GameWorldStoryProps } from '@/models/GameWorldStory'
import { BaseModel } from './Base'

export enum ArtifactModifier {
  DEFAULT = 'DEFAULT',
  EXPERIENCE_GAIN = 'EXPERIENCE_GAIN',
  CURRENCY_GAIN = 'CURRENCY_GAIN',
  SHOP_DISCOUNT = 'SHOP_DISCOUNT',
}
export interface ArtifactProps extends BaseModelProps {
  name: string
  description: string
  icon: string
  color: string
  modifier: ArtifactModifier
  modifier_value: number
  game_world_stories: GameWorldStoryProps[]
}

enum ArtifactUrl {
  ARTIFACT = '/game-world/artifact',
  ARTIFACTS = '/game-world/artifacts/list',
}

export class Artifact extends BaseModel {
  static override modelName = 'artifact'

  static override url() {
    return ArtifactUrl.ARTIFACTS
  }
}
