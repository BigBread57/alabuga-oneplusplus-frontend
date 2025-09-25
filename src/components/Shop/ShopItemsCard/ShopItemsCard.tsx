'use client'

import type { FCC } from 'src/types'
import type { ShopItemModel } from '@/components/Shop/ShopItemCard/ShopItemCard'
import { Space } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import ShopItemCard from '@/components/Shop/ShopItemCard/ShopItemCard'
import { ShopItem } from '@/models/ShopItem'

interface ShopItemsCardProps {
  items: ShopItemModel[]
}

const MODEL = ShopItem
const ShopItemsCard: FCC<ShopItemsCardProps> = ({ items }) => {
  const t = useTranslations('ShopItem')
  return (
    <CardWrapper
      title={t('shop_items').toUpperCase()}
      styles={{
        header: {
          fontSize: '18px',
        },
        body: {
          height: '90%',
          overflow: 'scroll',
        },
      }}
      {...items}
    >
      <FetchMoreItemsComponent
        model={MODEL}
        defFilters={{}}
        renderItems={() => (
          <div
            style={{
              paddingRight: '8px',
            }}
          >
            <Space direction='vertical' size='large' style={{ width: '100%' }}>
              {items?.map((shop_item) => (
                <ShopItemCard key={shop_item.id} {...shop_item} />
              ))}
            </Space>
          </div>
        )}
      />
    </CardWrapper>
  )
}

ShopItemsCard.displayName = 'ShopItemsCard'

export default ShopItemsCard
