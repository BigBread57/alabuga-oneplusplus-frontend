import type { PermissionRulesProps } from 'src/services/base/types'

export type BaseModelProps = {
  id: string | number
  created_at: string
  updated_at: string
  permissionRules?: PermissionRulesProps
  contentType?: string | number
}
export class BaseModel {
  static modelName = 'base'

  static url() {
    return ''
  }
}
