import type { BaseModelProps } from './Base'
import { BaseModel } from './Base'

export interface CommunicationTopicProps extends BaseModelProps {
  name: string
  description: string
  icon: string
  color: string
  post_count: number
  created_at: string
}

enum CommunicationTopicUrl {
  COMMUNICATION_TOPIC = '/communication/topic',
  COMMUNICATION_TOPICS = '/communication/topics',
  COMMUNICATION_TOPICS_LIST = '/communication/topics/list',
}

export class CommunicationTopic extends BaseModel {
  static override modelName = 'communication_topic'
  static override url() {
    return CommunicationTopicUrl.COMMUNICATION_TOPICS_LIST
  }
}
