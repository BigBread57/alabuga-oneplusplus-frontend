import type { ArtifactProps } from './Artifact'
import type { BaseModelProps } from './Base'
import type { CharacterProps } from './Character'
import { BaseModel } from './Base'

export interface CharacterArtifactProps extends BaseModelProps {
  character: CharacterProps
  artifact: ArtifactProps
  content_type_id: number
}

enum ArtifactUrl {
  ARTIFACT = '/user/character-artifact',
  ARTIFACTS = '/user/character-artifacts/list',
}

export class CharacterArtifact extends BaseModel {
  static override modelName = 'characterArtifact'

  static override url() {
    return ArtifactUrl.ARTIFACTS
  }
}
