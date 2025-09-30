import type { BaseModelProps } from './Base'
import type { CharacterProps } from '@/models/Character'
import type { ShopItemProps } from '@/models/ShopItem'
import { BaseModel } from '@/models/Base'

export enum CharacterPurchaseStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
export interface CharacterPurchaseProps extends BaseModelProps {
  id: string
  price: number
  number: number
  discount: number
  total_sum: number
  status: CharacterPurchaseStatus
  additional_info: string
  buyer: CharacterProps
  shop_item: ShopItemProps
  manager?: CharacterProps | null
}

enum CharacterPurchaseUrl {
  CHARACTER_PURCHASE_ITEM = '/shop/character-purchase',
  CHARACTER_PURCHASE_ITEMS = '/shop/character-purchases',
}

export class CharacterPurchase extends BaseModel {
  static override modelName = 'characterPurchase'

  static override url() {
    return CharacterPurchaseUrl.CHARACTER_PURCHASE_ITEMS
  }
}
