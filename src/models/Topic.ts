import type { BaseModelProps } from './Base'
import type { GameWorldProps } from './GameWorld'
import { BaseModel } from './Base'

export interface TopicProps extends BaseModelProps {
  name: string
  description: string
  icon: string
  color: string
  game_worlds: GameWorldProps[]
}

enum TopicUrl {
  TOPIC = '/communication/topic',
  TOPICS = '/communication/topics',
}

export class Topic extends BaseModel {
  static override modelName = 'topic'

  static override url() {
    return TopicUrl.TOPICS
  }
}
