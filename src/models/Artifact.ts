import type { BaseModelProps } from './Base'
import type { GameWorldProps } from './GameWorld'
import { BaseModel } from './Base'

export enum ArtifactModifier {
  DEFAULT = 'DEFAULT',
  EXPERIENCE_GAIN = 'EXPERIENCE_GAIN',
  CURRENCY_GAIN = 'CURRENCY_GAIN',
  STORE_DISCOUNT = 'STORE_DISCOUNT',
}
export interface ArtifactProps extends BaseModelProps {
  name: string
  description: string
  icon: string
  color: string
  modifier: ArtifactModifier
  modifier_value: number
  game_world: GameWorldProps
}

enum ArtifactUrl {
  ARTIFACT = '/game-world/artifact',
  ARTIFACTS = '/game-world/artifacts',
}

export class Artifact extends BaseModel {
  static override modelName = 'artifact'

  static override url() {
    return ArtifactUrl.ARTIFACTS
  }
}
