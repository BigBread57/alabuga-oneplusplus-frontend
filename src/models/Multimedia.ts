import type { BaseModelProps } from './Base'
import { BaseModel } from './Base'

export interface MultimediaProps extends BaseModelProps {
  multimedia: string
  content_type: number
  object_id: number
  multimedia_name: string
}

export interface MultimediaCreateRequest {
  multimedia: string
  content_type: number
  object_id: number
}

enum MultimediaUrl {
  MULTIMEDIAS = 'multimedia/multimedia',
  CREATE = 'multimedia/multimedia/create',
}

export class Multimedia extends BaseModel {
  static override modelName = 'multimedia'

  static override url() {
    return MultimediaUrl.MULTIMEDIAS
  }

  static createUrl() {
    return MultimediaUrl.CREATE
  }
}
