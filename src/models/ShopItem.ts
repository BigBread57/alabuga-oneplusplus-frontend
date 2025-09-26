import type { BaseModelProps } from '@/models/Base'
import type { CompetencyProps } from '@/models/Competency'
import type { GameWorldStoryProps } from '@/models/GameWorldStory'
import type { RankProps } from '@/models/Rank'
import type { ShopItemCategoryProps } from '@/models/ShopItemCategory'
import { BaseModel } from '@/models/Base'

export interface ShopItemProps extends BaseModelProps {
  id: number
  name: string
  description: string
  price: number
  number: number
  image?: string | null
  is_active: boolean
  start_datetime: string
  time_to_buy: number
  purchase_restriction: number
  category: ShopItemCategoryProps
  parent?: ShopItemProps | null
  rank?: RankProps | null
  competency?: CompetencyProps | null
  game_world_stories?: GameWorldStoryProps | []
}

enum ShopItemUrl {
  SHOP_ITEM = '/shop/item',
  SHOP_ITEMS_LIST = '/shop/items/list/',
}

export class ShopItem extends BaseModel {
  static override modelName = 'shopItem'

  static override url() {
    return ShopItemUrl.SHOP_ITEMS_LIST
  }
}
