import type { BaseModelProps } from '@/models/Base'

import type { PermissionRulesProps } from '@/services/base/types'
import { BaseModel } from 'src/models/Base'

export type UsersModelProps = {
  username: string
  avatar: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  full_name: string
  middle_name: string
  is_need_add_info: true
  permission_rules: PermissionRulesProps
} & BaseModelProps

export class UsersModel extends BaseModel {
  static override modelName = 'users'

  static override url() {
    return '/user/users'
  }

  static changePasswordUrl() {
    return `${this.url()}/change-password/`
  }

  static confirmRegisterUrl(email: string, token: string) {
    return `${this.url()}/confirm-register/${email}/${token}`
  }
}
