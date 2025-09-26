import type { BaseModelProps } from './Base'
import type { CharacterProps } from '@/models/Character'
import { BaseModel } from './Base'

export interface ActivityLogProps extends BaseModelProps {
  id: number
  text: string
  character: CharacterProps
  content_type: number
  object_id: number
}

// enum ActivityLogUrl {
//   ACTIVITY_LOGS = '/communication/activity-logs',
// }

export class ActivityLog extends BaseModel {
  static override modelName = 'activityLog'

  static override url() {
    return '/communication/activity-logs/list'
  }

  static contentTypesUrl() {
    return '/communication/activity-logs/content-types/list'
  }
}
