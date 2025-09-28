import type { BaseModelProps } from './Base'
import type { CharacterProps } from './Character'
import type { TopicProps } from './Topic'
import { BaseModel } from './Base'

export interface PostProps extends BaseModelProps {
  name: string
  text: string
  character: CharacterProps
  topic: TopicProps
  parent?: PostProps | null
  children?: PostProps[]
}

enum PostUrl {
  POST = '/communication/post',
  POSTS = '/communication/posts',
}

export class Post extends BaseModel {
  static override modelName = 'post'

  static override url() {
    return PostUrl.POSTS
  }
}
