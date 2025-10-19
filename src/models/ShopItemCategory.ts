import type { BaseModelProps } from '@/models/Base'
import { BaseModel } from '@/models/Base'

export interface ShopItemCategoryProps extends BaseModelProps {
  id: string
  name: string
  description: string
  icon?: string | null
  color?: string | null
  purchase_restriction?: number | null
}

enum ShopItemCategoryUrl {
  SHOP_ITEM_CATEGORY = '/shop/item-category',
  SHOP_ITEM_CATEGORIES = '/shop/item-categories',
  SHOP_ITEM_CATEGORIES_LIST = '/shop/item-categories',
}

export class ShopItemCategory extends BaseModel {
  static override modelName = 'shopItemCategory'

  static override url() {
    return ShopItemCategoryUrl.SHOP_ITEM_CATEGORIES_LIST
  }
}
