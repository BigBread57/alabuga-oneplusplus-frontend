import type { BaseModelProps } from './Base'
import type { ShopItemProps } from '@/models/Shop'
import type { UserProps } from '@/models/User'
import { BaseModel } from '@/models/Base'

export enum UserPurchaseStatus {
  DEFAULT = 'DEFAULT',
  EXPERIENCE_GAIN = 'EXPERIENCE_GAIN',
  CURRENCY_GAIN = 'CURRENCY_GAIN',
  STORE_DISCOUNT = 'STORE_DISCOUNT',
}
export interface UserPurchaseProps extends BaseModelProps {
  id: string
  price: number
  number: number
  discount: number
  total_sum: number
  status: UserPurchaseStatus
  additional_info: string
  buyer: UserProps
  shop_item: ShopItemProps
  manager?: UserProps | null
}

enum UserPurchaseUrl {
  USER_PURCHASE_ITEM = '/shop/user-purchase',
  USER_PURCHASE_ITEMS = '/shop/user-purchases',
}

export class UserPurchase extends BaseModel {
  static override modelName = 'userPurchase'

  static override url() {
    return UserPurchaseUrl.USER_PURCHASE_ITEMS
  }
}
