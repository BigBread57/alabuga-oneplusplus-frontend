import type { BaseModelProps } from '@/models/Base'

import type { CharacterRole } from '@/models/Character'
import { BaseModel } from 'src/models/Base'

export type UserProps = {
  active_character: number | null
  active_game_world: number | null
  username: string
  avatar: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  full_name: string
  middle_name: string
  active_character_role: CharacterRole
  active_game_world_currency_name: string
} & BaseModelProps

export class UserModel extends BaseModel {
  static override modelName = 'user'

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
