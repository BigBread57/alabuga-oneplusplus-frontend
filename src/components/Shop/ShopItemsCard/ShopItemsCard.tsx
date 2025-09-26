'use client'

import type { FCC } from 'src/types'
import { Col, Row } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import ShopItemCard from '@/components/Shop/ShopItemCard/ShopItemCard'
import { Shop } from '@/models/Shop'

const MODEL = Shop
const ShopItemsCard: FCC = () => {
  const t = useTranslations('ShopItem')
  return (
    <CardWrapper title={t('shop_items').toUpperCase()}>
      <FetchMoreItemsComponent
        model={MODEL}
        defFilters={{}}
        renderItems={({ data }) => (
          <Row gutter={[16, 16]} justify='start'>
            {data?.map((shop_item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={shop_item.id}>
                <ShopItemCard key={shop_item.id} {...shop_item} />
              </Col>
            ))}
          </Row>
        )}
      />
    </CardWrapper>
  )
}

ShopItemsCard.displayName = 'ShopItemsCard'

export default ShopItemsCard
